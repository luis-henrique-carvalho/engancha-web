import { useState } from 'react'
import { RefreshCw, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface EmailCaptureFormProps {
  onSubmit: (email: string) => Promise<void>
  isProcessing: boolean
}

export function EmailCaptureForm({ onSubmit, isProcessing }: EmailCaptureFormProps) {
  const [emailInput, setEmailInput] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    const trimmed = emailInput.trim()
    if (!trimmed) {
      setLocalError('Por favor, informe um endereço de e-mail.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) {
      setLocalError('Por favor, informe um endereço de e-mail válido.')
      return
    }

    await onSubmit(trimmed)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 pt-1"
      data-testid="simulation-email-capture-form"
    >
      {localError && (
        <p
          className="text-[11px] text-destructive font-medium"
          data-testid="simulation-email-validation-error"
        >
          {localError}
        </p>
      )}
      <div className="flex items-center gap-2">
        <Input
          type="email"
          placeholder="seu.email@exemplo.com"
          value={emailInput}
          onChange={(e) => {
            setEmailInput(e.target.value)
            if (localError) setLocalError(null)
          }}
          disabled={isProcessing}
          aria-label="Seu endereço de e-mail"
          className="text-xs h-8"
          data-testid="simulation-email-input"
        />
        <Button
          type="submit"
          size="sm"
          disabled={isProcessing || !emailInput.trim()}
          className="h-8 px-3 text-xs gap-1.5 shrink-0"
          data-testid="simulation-email-submit-btn"
        >
          {isProcessing ? (
            <RefreshCw className="size-3 animate-spin" />
          ) : (
            <Send className="size-3" />
          )}
          {isProcessing ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>
    </form>
  )
}
