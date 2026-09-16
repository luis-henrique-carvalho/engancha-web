import { useState } from 'react'
import { ApiClientError } from '@/lib/api-client'

export function useReviewStepPublish(
  publishAutomation: () => Promise<any>,
  propOnPublished?: () => void,
) {
  const [publishIssues, setPublishIssues] = useState<string[] | null>(null)
  const [publishErrorMessage, setPublishErrorMessage] = useState<string | null>(null)

  const handlePublish = async () => {
    setPublishIssues(null)
    setPublishErrorMessage(null)

    try {
      await publishAutomation()
      propOnPublished?.()
    } catch (error) {
      if (error instanceof ApiClientError && error.code === 'AUTOMATION_NOT_PUBLISHABLE') {
        const issues = Array.isArray(error.issues) ? (error.issues as string[]) : []
        setPublishIssues(issues)
        setPublishErrorMessage(
          'A automação possui requisitos obrigatórios incompletos para publicação.',
        )
      } else if (error instanceof ApiClientError && error.code === 'AUTOMATION_TRIGGER_CONFLICT') {
        setPublishIssues(['targetId', 'keyword'])
        setPublishErrorMessage(
          'Já existe outra automação ativa configurada para a mesma combinação de conteúdo e palavra-chave.',
        )
      } else if (error instanceof ApiClientError && error.code === 'AUTOMATION_ARCHIVED') {
        setPublishErrorMessage(
          'Esta automação está arquivada e não pode mais ser publicada ou modificada.',
        )
      } else {
        setPublishErrorMessage(
          error instanceof Error ? error.message : 'Falha inesperada ao publicar a automação.',
        )
      }
    }
  }

  return {
    publishIssues,
    publishErrorMessage,
    handlePublish,
  }
}
