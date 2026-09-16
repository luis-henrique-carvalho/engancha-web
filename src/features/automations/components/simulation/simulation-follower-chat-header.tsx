import { RefreshCw, RotateCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardHeader, CardTitle } from '@/components/ui/card'

interface SimulationFollowerChatHeaderProps {
  isReconnecting: boolean
  showReset: boolean
  onReset?: () => void
}

export function SimulationFollowerChatHeader({
  isReconnecting,
  showReset,
  onReset,
}: SimulationFollowerChatHeaderProps) {
  return (
    <CardHeader className="pb-3 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">Experiência do seguidor</CardTitle>
          <Badge
            variant="secondary"
            className="text-[10px]"
          >
            Simulado
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {isReconnecting && (
            <Badge
              variant="outline"
              className="gap-1 border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[11px]"
              data-testid="simulation-reconnecting-badge"
            >
              <RefreshCw className="size-3 animate-spin" />
              Reconectando...
            </Badge>
          )}
          {showReset && onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              data-testid="simulation-reset-btn"
            >
              <RotateCcw className="mr-1 size-3" />
              Novo teste
            </Button>
          )}
        </div>
      </div>
    </CardHeader>
  )
}
