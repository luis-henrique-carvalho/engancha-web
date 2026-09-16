import { useCallback, useEffect, useRef, useState } from 'react'
import type { ExecutionStatus, SimulationExecutionResponse } from '@engancha/contracts'
import { useSimulationSse, type SseConnectionStatus } from './use-simulation-sse'
import { useSimulationExecutionActions } from './use-simulation-execution-actions'

export type { SseConnectionStatus }

const TERMINAL_STATUSES: ExecutionStatus[] = ['COMPLETED', 'IGNORED', 'FAILED']

export interface UseSimulationExecutionOptions {
  initialExecutionId?: string | null
  onTerminalState?: (execution: SimulationExecutionResponse) => void
}

export function useSimulationExecution(options?: UseSimulationExecutionOptions) {
  const [executionId, setExecutionId] = useState<string | null>(options?.initialExecutionId ?? null)
  const [execution, setExecution] = useState<SimulationExecutionResponse | null>(null)
  const onTerminalStateRef = useRef(options?.onTerminalState)
  onTerminalStateRef.current = options?.onTerminalState

  const { connectionStatus, isReconnecting, startStream, closeStream, markClosed, resetStream } =
    useSimulationSse({
      onUpdate: (data) => updateExecutionIfNewer(data),
    })

  const updateExecutionIfNewer = useCallback(
    (data?: SimulationExecutionResponse | null) => {
      if (!data || typeof data !== 'object') return
      setExecution((prev: SimulationExecutionResponse | null) => {
        if (!prev || (data.stateVersion ?? 0) >= (prev.stateVersion ?? 0)) {
          return data
        }
        return prev
      })
      if (TERMINAL_STATUSES.includes(data.status)) {
        markClosed()
        onTerminalStateRef.current?.(data)
      }
    },
    [markClosed],
  )

  const {
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
  } = useSimulationExecutionActions({
    executionId,
    setExecutionId,
    setExecution,
    updateExecutionIfNewer,
    startStream,
    resetStream,
  })

  useEffect(() => {
    if (executionId) {
      void loadExecution(executionId)
    } else {
      resetStream()
      setExecution(null)
    }
    return () => {
      closeStream()
    }
  }, [executionId, loadExecution, closeStream, resetStream])

  return {
    executionId,
    execution,
    isLoading,
    isSubmitting,
    isRetrying,
    isSubmittingEmail,
    isReconnecting,
    connectionStatus,
    error,
    emailCaptureError,
    submitComment,
    submitEmailResponse,
    clearEmailCaptureError,
    retry,
    reset,
    setExecutionId,
  }
}
