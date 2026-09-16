import { Activity, AlertCircle, RefreshCw, WifiOff } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export interface AutomationActivityTabHeaderProps {
  isLoading: boolean
  isRefreshing: boolean
  isReconnecting: boolean
  error: Error | null
  onRefresh: () => void
}

export function AutomationActivityTabHeader({
  isLoading,
  isRefreshing,
  isReconnecting,
  error,
  onRefresh,
}: AutomationActivityTabHeaderProps) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            Histórico de atividades
          </h3>
          <p className="text-xs text-muted-foreground">
            Interações e respostas simuladas vinculadas a esta automação e publicação.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing || isLoading}
          className="h-8 gap-1.5 text-xs"
          data-testid="activity-refresh-button"
        >
          <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

      {isReconnecting && (
        <Alert
          className="border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200"
          data-testid="activity-reconnecting-banner"
        >
          <WifiOff className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-xs font-semibold">Reconectando em tempo real</AlertTitle>
          <AlertDescription className="text-xs">
            Atualizações em tempo real temporariamente suspensas. O histórico autoritativo continua
            preservado.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert
          variant="destructive"
          data-testid="activity-error-alert"
        >
          <AlertCircle className="size-4" />
          <AlertTitle className="text-xs font-semibold">Falha na consulta de atividades</AlertTitle>
          <AlertDescription className="text-xs flex items-center justify-between">
            <span>{error.message}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={onRefresh}
              className="h-7 text-xs border-destructive/30 hover:bg-destructive/10"
            >
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}
