import { useCallback, useRef, useState } from 'react'
import type { SimulationExecutionResponse } from '@engancha/contracts'
import { SimulationsApi } from '../services/simulations-api'

export type SseConnectionStatus =
  'idle' | 'connecting' | 'connected' | 'reconnecting' | 'closed' | 'error'

interface UseSimulationSseParams {
  onUpdate: (data: SimulationExecutionResponse) => void
}

export function useSimulationSse({ onUpdate }: UseSimulationSseParams) {
  const [connectionStatus, setConnectionStatus] = useState<SseConnectionStatus>('idle')
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const onUpdateRef = useRef(onUpdate)
  onUpdateRef.current = onUpdate

  const closeStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
  }, [])

  const startStream = useCallback(
    (id: string) => {
      closeStream()

      if (typeof window === 'undefined' || typeof window.EventSource === 'undefined') {
        return
      }

      setConnectionStatus('connecting')
      const url = SimulationsApi.getEventsUrl(id)
      const es = new EventSource(url, { withCredentials: true })
      eventSourceRef.current = es

      es.onopen = () => {
        setConnectionStatus('connected')
        setIsReconnecting(false)
      }

      const handleEvent = (event: Event) => {
        try {
          const parsed = JSON.parse((event as MessageEvent).data)
          if (parsed?.data) {
            onUpdateRef.current(parsed.data)
          }
        } catch {
          // ignore parsing error on stream
        }
      }

      es.addEventListener('snapshot', handleEvent)
      es.addEventListener('update', handleEvent)

      es.onerror = () => {
        setConnectionStatus('reconnecting')
        setIsReconnecting(true)

        SimulationsApi.getExecution(id)
          .then((latest) => {
            if (latest) onUpdateRef.current(latest)
          })
          .catch(() => {})
      }
    },
    [closeStream],
  )

  const markClosed = useCallback(() => {
    closeStream()
    setConnectionStatus('closed')
    setIsReconnecting(false)
  }, [closeStream])

  const resetStream = useCallback(() => {
    closeStream()
    setConnectionStatus('idle')
    setIsReconnecting(false)
  }, [closeStream])

  return {
    connectionStatus,
    isReconnecting,
    startStream,
    closeStream,
    markClosed,
    resetStream,
  }
}
