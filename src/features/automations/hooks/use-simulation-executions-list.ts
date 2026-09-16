import { useCallback, useMemo, useState } from 'react'
import type {
  ExecutionStatus,
  SimulationExecutionListQuery,
  SimulationExecutionResponse,
} from '@engancha/contracts'
import type { ActivityFilters } from '../data/activity-filter-options'
import { SimulationsApi } from '../services/simulations-api'
import { useSimulationStreamsPool } from './use-simulation-streams-pool'
import { useSimulationExecutionsQuery } from './use-simulation-executions-query'

const TERMINAL_STATUSES: ExecutionStatus[] = ['COMPLETED', 'IGNORED', 'FAILED']

export interface UseSimulationExecutionsListOptions {
  automationId?: string
  query?: string
  filters?: ActivityFilters
  page?: number
  limit?: number
}

function resolveFilterArray<T>(list?: T[]): T[] | undefined {
  return list && list.length > 0 ? list : undefined
}

function buildSerializedFilters(
  options?: UseSimulationExecutionsListOptions,
): Partial<SimulationExecutionListQuery> {
  const f = options?.filters
  return {
    limit: options?.limit ?? 20,
    page: options?.page,
    automationId: options?.automationId,
    query: options?.query,
    status: resolveFilterArray(f?.status),
    provider: resolveFilterArray(f?.provider),
    mode: resolveFilterArray(f?.mode),
    contentType: resolveFilterArray(f?.contentType),
    outputType: resolveFilterArray(f?.outputType),
  }
}

function useSimulationExecutionRetry(params: {
  startStreamForExecution: (id: string) => void
  updateExecutionInList: (item: SimulationExecutionResponse) => void
  setExecutions: React.Dispatch<React.SetStateAction<SimulationExecutionResponse[]>>
  setError: React.Dispatch<React.SetStateAction<Error | null>>
}) {
  const { startStreamForExecution, updateExecutionInList, setExecutions, setError } = params
  const [retryingId, setRetryingId] = useState<string | null>(null)

  const retry = useCallback(
    async (executionId: string) => {
      setRetryingId(executionId)
      setError(null)
      try {
        const res = await SimulationsApi.retryExecution(executionId)
        setExecutions((prev) =>
          prev.map((item) =>
            item.id === executionId
              ? {
                  ...item,
                  status: 'PENDING',
                  attempts: item.attempts + 1,
                  error: null,
                  stateVersion: (item.stateVersion ?? 1) + 1,
                }
              : item,
          ),
        )
        startStreamForExecution(res.executionId)
        const fresh = await SimulationsApi.getExecution(executionId)
        updateExecutionInList(fresh)
        return res
      } catch (err) {
        const parsedErr =
          err instanceof Error ? err : new Error('Não foi possível reprocessar a interação')
        setError(parsedErr)
        throw parsedErr
      } finally {
        setRetryingId(null)
      }
    },
    [startStreamForExecution, updateExecutionInList, setExecutions, setError],
  )

  return { retryingId, retry }
}

export function useSimulationExecutionsList(options?: UseSimulationExecutionsListOptions) {
  const automationId = options?.automationId
  const [executions, setExecutions] = useState<SimulationExecutionResponse[]>([])

  const { isReconnecting, closeAllStreams, closeStreamForExecution, startStreamForExecution } =
    useSimulationStreamsPool({
      onUpdate: (item) => updateExecutionInList(item),
    })

  const updateExecutionInList = useCallback(
    (item: SimulationExecutionResponse) => {
      setExecutions((prev) => {
        const index = prev.findIndex((e) => e.id === item.id)
        if (index >= 0) {
          const existing = prev[index]
          if ((item.stateVersion ?? 0) >= (existing.stateVersion ?? 0)) {
            const next = [...prev]
            next[index] = item
            return next
          }
          return prev
        }
        if (
          !automationId ||
          item.automation?.id === automationId ||
          item.originAutomationId === automationId
        ) {
          return [item, ...prev]
        }
        return prev
      })

      if (TERMINAL_STATUSES.includes(item.status)) {
        closeStreamForExecution(item.id)
      }
    },
    [automationId, closeStreamForExecution],
  )

  const page = options?.page ?? 1
  const limit = options?.limit ?? 20

  const serializedFilters = useMemo(() => buildSerializedFilters(options), [options])

  const { isLoading, isRefreshing, error, meta, refresh } = useSimulationExecutionsQuery({
    serializedFilters,
    page,
    limit,
    startStreamForExecution,
    closeAllStreams,
    setExecutions,
  })

  const [retryError, setRetryError] = useState<Error | null>(null)

  const { retryingId, retry } = useSimulationExecutionRetry({
    startStreamForExecution,
    updateExecutionInList,
    setExecutions,
    setError: setRetryError,
  })

  return {
    executions,
    meta,
    isLoading,
    isRefreshing,
    isReconnecting,
    error: error || retryError,
    retryingId,
    refresh,
    retry,
    updateExecutionInList,
  }
}
