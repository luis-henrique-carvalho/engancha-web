import { useCallback, useState } from 'react'
import type { SimulationCommentRequest } from '@engancha/contracts'
import { SimulationsApi } from '../services/simulations-api'

function buildSimulationCommentPayload(
  payload: Omit<SimulationCommentRequest, 'idempotencyKey'> & { idempotencyKey?: string },
): SimulationCommentRequest {
  const key = payload.idempotencyKey || crypto.randomUUID()
  return {
    contentId: payload.contentId,
    provider: payload.provider,
    author: payload.author,
    text: payload.text,
    commentId: payload.commentId || undefined,
    idempotencyKey: key,
    originAutomationId: payload.originAutomationId ?? undefined,
  }
}

export function useSimulationSubmitComment(
  setExecutionId: React.Dispatch<React.SetStateAction<string | null>>,
  setError: React.Dispatch<React.SetStateAction<Error | null>>,
) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitComment = useCallback(
    async (
      payload: Omit<SimulationCommentRequest, 'idempotencyKey'> & { idempotencyKey?: string },
    ) => {
      setIsSubmitting(true)
      setError(null)
      try {
        const res = await SimulationsApi.submitComment(buildSimulationCommentPayload(payload))
        setExecutionId(res.executionId)
        return res
      } catch (err) {
        const parsedErr =
          err instanceof Error ? err : new Error('Não foi possível enviar o comentário')
        setError(parsedErr)
        throw parsedErr
      } finally {
        setIsSubmitting(false)
      }
    },
    [setExecutionId, setError],
  )

  return { isSubmitting, submitComment }
}

export function useSimulationRetryAction(
  executionId: string | null,
  loadExecution: (id: string) => Promise<void>,
  setError: React.Dispatch<React.SetStateAction<Error | null>>,
) {
  const [isRetrying, setIsRetrying] = useState(false)

  const retry = useCallback(async () => {
    if (!executionId) return
    setIsRetrying(true)
    setError(null)
    try {
      const res = await SimulationsApi.retryExecution(executionId)
      await loadExecution(res.executionId)
      return res
    } catch (err) {
      const parsedErr =
        err instanceof Error ? err : new Error('Não foi possível reprocessar a simulação')
      setError(parsedErr)
      throw parsedErr
    } finally {
      setIsRetrying(false)
    }
  }, [executionId, loadExecution, setError])

  return { isRetrying, retry }
}

export function useSimulationEmailCaptureAction(
  loadExecution: (id: string) => Promise<void>,
  setError: React.Dispatch<React.SetStateAction<Error | null>>,
) {
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false)
  const [emailCaptureError, setEmailCaptureError] = useState<Error | null>(null)

  const submitEmailResponse = useCallback(
    async (params: {
      conversationId: string
      captureId: string
      email: string
      idempotencyKey?: string
      executionId: string
    }) => {
      setIsSubmittingEmail(true)
      setEmailCaptureError(null)
      setError(null)
      const key = params.idempotencyKey || crypto.randomUUID()
      try {
        const res = await SimulationsApi.submitEmailCaptureResponse(
          params.conversationId,
          params.captureId,
          {
            email: params.email,
            idempotencyKey: key,
          },
        )
        await loadExecution(params.executionId)
        return res
      } catch (err) {
        const parsedErr =
          err instanceof Error ? err : new Error('Não foi possível enviar a resposta de e-mail')
        setEmailCaptureError(parsedErr)
        throw parsedErr
      } finally {
        setIsSubmittingEmail(false)
      }
    },
    [loadExecution, setError],
  )

  const clearEmailCaptureError = useCallback(() => {
    setEmailCaptureError(null)
  }, [])

  return {
    isSubmittingEmail,
    emailCaptureError,
    submitEmailResponse,
    clearEmailCaptureError,
  }
}
