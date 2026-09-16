import { useCallback, useState } from 'react'
import type { ExecutionStatus, SimulationExecutionResponse } from '@engancha/contracts'
import { SimulationsApi } from '../services/simulations-api'
import {
  useSimulationEmailCaptureAction,
  useSimulationRetryAction,
  useSimulationSubmitComment,
} from './use-simulation-actions-bundle'

const TERMINAL_STATUSES: ExecutionStatus[] = ['COMPLETED', 'IGNORED', 'FAILED']

interface UseSimulationExecutionActionsParams {
  executionId: string | null
  setExecutionId: React.Dispatch<React.SetStateAction<string | null>>
  setExecution: React.Dispatch<React.SetStateAction<SimulationExecutionResponse | null>>
  updateExecutionIfNewer: (data?: SimulationExecutionResponse | null) => void
  startStream: (id: string) => void
  resetStream: () => void
}

export function useSimulationExecutionActions({
  executionId,
  setExecutionId,
  setExecution,
  updateExecutionIfNewer,
  startStream,
  resetStream,
}: UseSimulationExecutionActionsParams) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const loadExecution = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await SimulationsApi.getExecution(id)
        updateExecutionIfNewer(data)
        if (!TERMINAL_STATUSES.includes(data.status)) {
          startStream(id)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Falha ao carregar simulação'))
      } finally {
        setIsLoading(false)
      }
    },
    [startStream, updateExecutionIfNewer],
  )

  const { isSubmitting, submitComment } = useSimulationSubmitComment(setExecutionId, setError)
  const { isRetrying, retry } = useSimulationRetryAction(executionId, loadExecution, setError)
  const { isSubmittingEmail, emailCaptureError, submitEmailResponse, clearEmailCaptureError } =
    useSimulationEmailCaptureAction(loadExecution, setError)

  const reset = useCallback(() => {
    resetStream()
    setExecutionId(null)
    setExecution(null)
    setError(null)
    clearEmailCaptureError()
  }, [resetStream, setExecution, setExecutionId, clearEmailCaptureError])

  return {
    isLoading,
    isSubmitting,
    isRetrying,
    isSubmittingEmail,
    error,
    emailCaptureError,
    loadExecution,
    submitComment,
    retry,
    submitEmailResponse,
    clearEmailCaptureError,
    reset,
  }
}
