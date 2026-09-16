import { AlertCircle, Info, RefreshCw } from 'lucide-react'
import type { SimulationExecutionResponse } from '@engancha/contracts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface SimulationFollowerStatusAlertProps {
  execution: SimulationExecutionResponse
  isRetrying: boolean
  onRetry?: () => Promise<unknown> | void
}

export function SimulationFollowerStatusAlert({
  execution,
  isRetrying,
  onRetry,
}: SimulationFollowerStatusAlertProps) {
  if (execution.status === 'IGNORED') {
    return (
      <Alert
        className="border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200"
        data-testid="simulation-ignored-alert"
      >
        <Info className="size-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-xs font-semibold">Comentário ignorado</AlertTitle>
        <AlertDescription className="text-xs">
          Nenhuma automação ativa reconheceu a palavra-chave configurada para esta publicação.
        </AlertDescription>
      </Alert>
    )
  }

  if (execution.status === 'FAILED') {
    return (
      <Alert
        variant="destructive"
        className="space-y-2"
        data-testid="simulation-failed-alert"
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="size-4" />
          <AlertTitle className="text-xs font-semibold">Falha na simulação</AlertTitle>
        </div>
        <AlertDescription className="text-xs">
          {execution.error?.message ||
            'A simulação não pôde ser concluída devido a uma inconsistência.'}
        </AlertDescription>
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              void onRetry()
            }}
            disabled={isRetrying}
            className="mt-2 h-7 gap-1.5 text-xs border-destructive/30 hover:bg-destructive/10"
            data-testid="simulation-retry-btn"
          >
            <RefreshCw className={isRetrying ? 'size-3 animate-spin' : 'size-3'} />
            {isRetrying ? 'Reprocessando...' : 'Tentar novamente'}
          </Button>
        )}
      </Alert>
    )
  }

  return null
}
