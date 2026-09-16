import { AlertCircle, Info, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface EmailCaptureAlertsProps {
  emailCapture: any
  emailCaptureError: Error | null
  isIdentityConflict: boolean
  isSuperseded: boolean
  isSubmittingEmail: boolean
  onRetry: () => void
}

export function EmailCaptureAlerts({
  emailCapture,
  emailCaptureError,
  isIdentityConflict,
  isSuperseded,
  isSubmittingEmail,
  onRetry,
}: EmailCaptureAlertsProps) {
  return (
    <>
      {isIdentityConflict && (
        <Alert
          variant="destructive"
          className="space-y-1.5"
          data-testid="simulation-email-conflict-alert"
        >
          <AlertCircle className="size-4" />
          <AlertTitle className="text-xs font-semibold">Conflito de identidade</AlertTitle>
          <AlertDescription className="text-xs">
            {emailCapture?.errorMessage ||
              'O e-mail informado já está associado a outro contato neste espaço de trabalho. Por favor, informe outro endereço.'}
          </AlertDescription>
        </Alert>
      )}

      {isSuperseded && (
        <Alert
          className="border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200"
          data-testid="simulation-email-superseded-alert"
        >
          <Info className="size-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-xs font-semibold">Solicitação substituída</AlertTitle>
          <AlertDescription className="text-xs">
            Esta solicitação de e-mail foi substituída por uma nova interação nesta conversa.
          </AlertDescription>
        </Alert>
      )}

      {emailCaptureError && !isIdentityConflict && (
        <Alert
          variant="destructive"
          className="space-y-2"
          data-testid="simulation-email-error-alert"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4" />
            <AlertTitle className="text-xs font-semibold">Falha ao enviar resposta</AlertTitle>
          </div>
          <AlertDescription className="text-xs">{emailCaptureError.message}</AlertDescription>
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            disabled={isSubmittingEmail}
            className="h-7 gap-1.5 text-xs border-destructive/30 hover:bg-destructive/10"
            data-testid="simulation-email-retry-btn"
          >
            <RefreshCw className={isSubmittingEmail ? 'size-3 animate-spin' : 'size-3'} />
            Tentar enviar novamente
          </Button>
        </Alert>
      )}
    </>
  )
}
