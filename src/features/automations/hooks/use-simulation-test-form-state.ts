import { useState } from 'react'

export function useSimulationTestFormState(
  onSubmit: (values: { author: string; text: string; commentId?: string }) => Promise<void> | void,
) {
  const [author, setAuthor] = useState('@seguidor.teste')
  const [commentId, setCommentId] = useState('')
  const [text, setText] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    const trimmedAuthor = author.trim()
    const trimmedText = text.trim()

    if (!trimmedAuthor) {
      setValidationError('O nome de usuário do autor é obrigatório.')
      return
    }
    if (trimmedAuthor.length > 120) {
      setValidationError('O autor deve ter no máximo 120 caracteres.')
      return
    }
    if (!trimmedText) {
      setValidationError('O texto do comentário é obrigatório.')
      return
    }
    if (trimmedText.length > 1000) {
      setValidationError('O comentário deve ter no máximo 1000 caracteres.')
      return
    }

    try {
      await onSubmit({
        author: trimmedAuthor,
        text: trimmedText,
        commentId: commentId.trim() || undefined,
      })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Ocorreu um erro ao enviar o comentário de teste.'
      setValidationError(message)
    }
  }

  return {
    author,
    setAuthor,
    commentId,
    setCommentId,
    text,
    setText,
    validationError,
    handleSubmit,
  }
}
