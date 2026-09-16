import { useCallback, useEffect, useState } from 'react'
import type {
  ExecutionStatus,
  SimulationExecutionListQuery,
  SimulationExecutionResponse,
} from '@engancha/contracts'
import { SimulationsApi } from '../services/simulations-api'

const TERMINAL_STATUSES: ExecutionStatus[] = ['COMPLETED', 'IGNORED', 'FAILED']

interface FetcherBaseParams {
  serializedFilters: Partial<SimulationExecutionListQuery>
  page: number
  limit: number
  startStreamForExecution: (id: string) => void
  closeAllStreams: () => void
  setExecutions: React.Dispatch<React.SetStateAction<SimulationExecutionResponse[]>>
}

async function fetchExecutionsFromApi(filters: any, fallbackError: string) {
  try {
    const res = await SimulationsApi.listExecutions(filters)
    return { res, error: null }
  } catch (err) {
    return {
      res: null,
      error: err instanceof Error ? err : new Error(fallbackError),
    }
  }
}

function attachStreamsForItems(
  items: SimulationExecutionResponse[],
  startStream: (id: string) => void,
) {
  for (const item of items) {
    if (!TERMINAL_STATUSES.includes(item.status)) {
      startStream(item.id)
    }
  }
}

export function useSimulationExecutionsQuery(params: FetcherBaseParams) {
  const {
    serializedFilters,
    page,
    limit,
    startStreamForExecution,
    closeAllStreams,
    setExecutions,
  } = params
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [meta, setMeta] = useState({ page, limit, total: 0, totalPages: 0 })

  const fetchInitial = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    closeAllStreams()
    const { res, error: fetchErr } = await fetchExecutionsFromApi(
      serializedFilters,
      'Falha ao carregar histórico de atividades',
    )
    if (res) {
      setExecutions(res.items)
      setMeta(res.meta)
      attachStreamsForItems(res.items, startStreamForExecution)
    } else {
      setError(fetchErr)
    }
    setIsLoading(false)
  }, [serializedFilters, closeAllStreams, startStreamForExecution, setExecutions])

  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    setError(null)
    const { res, error: fetchErr } = await fetchExecutionsFromApi(
      serializedFilters,
      'Falha ao atualizar atividades',
    )
    if (res) {
      setExecutions(res.items)
      setMeta(res.meta)
      attachStreamsForItems(res.items, startStreamForExecution)
    } else {
      setError(fetchErr)
    }
    setIsRefreshing(false)
  }, [serializedFilters, startStreamForExecution, setExecutions])

  useEffect(() => {
    void fetchInitial()
    return () => {
      closeAllStreams()
    }
  }, [fetchInitial, closeAllStreams])

  return {
    isLoading,
    isRefreshing,
    error,
    meta,
    refresh,
  }
}
