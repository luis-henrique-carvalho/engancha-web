import { useCallback, useRef, useState } from 'react'
import type { SimulationExecutionResponse } from '@engancha/contracts'
import { SimulationsApi } from '../services/simulations-api'

export function useSimulationStreamsPool(params: {
  onUpdate: (item: SimulationExecutionResponse) => void
}) {
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false)
  const activeStreamsRef = useRef<Map<string, EventSource>>(new Map())
  const onUpdateRef = useRef(params.onUpdate)
  onUpdateRef.current = params.onUpdate

  const closeAllStreams = useCallback(() => {
    for (const [, es] of activeStreamsRef.current.entries()) {
      es.close()
    }
    activeStreamsRef.current.clear()
  }, [])

  const closeStreamForExecution = useCallback((id: string) => {
    const es = activeStreamsRef.current.get(id)
    if (es) {
      es.close()
      activeStreamsRef.current.delete(id)
    }
  }, [])

  const startStreamForExecution = useCallback((id: string) => {
    if (typeof window === 'undefined' || typeof window.EventSource === 'undefined') {
      return
    }
    if (activeStreamsRef.current.has(id)) {
      return
    }

    const url = SimulationsApi.getEventsUrl(id)
    const es = new EventSource(url, { withCredentials: true })
    activeStreamsRef.current.set(id, es)

    const handleEvent = (event: Event) => {
      try {
        const parsed = JSON.parse((event as MessageEvent).data)
        if (parsed?.data) {
          onUpdateRef.current(parsed.data)
        }
      } catch {
        // ignore
      }
    }

    es.addEventListener('snapshot', handleEvent)
    es.addEventListener('update', handleEvent)

    es.onerror = () => {
      setIsReconnecting(true)
      SimulationsApi.getExecution(id)
        .then((latest) => {
          setIsReconnecting(false)
          if (latest) onUpdateRef.current(latest)
        })
        .catch(() => {})
    }
  }, [])

  return {
    isReconnecting,
    closeAllStreams,
    closeStreamForExecution,
    startStreamForExecution,
  }
}
