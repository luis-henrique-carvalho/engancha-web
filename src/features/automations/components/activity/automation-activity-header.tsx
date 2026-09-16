import { ChevronDown, ChevronUp, Instagram, RefreshCw } from 'lucide-react'
import type { SimulationExecutionResponse } from '@engancha/contracts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import type { getAutomationMatchDescription } from '../../data/activity-grouping'
import type { getExecutionStatusViewModel } from '../../data/simulation-view-mappers'
import { AutomationActivityStatusIcon } from './automation-activity-status-icon'

export interface AutomationActivityHeaderProps {
  execution: SimulationExecutionResponse
  statusVm: ReturnType<typeof getExecutionStatusViewModel>
  matchDesc: ReturnType<typeof getAutomationMatchDescription>
  contentTitle: string
  timeFormatted: string | null
  isOpen: boolean
  isRetrying: boolean
  onRetry?: (executionId: string) => void
}

export function AutomationActivityHeader({
  execution,
  statusVm,
  matchDesc,
  contentTitle,
  timeFormatted,
  isOpen,
  isRetrying,
  onRetry,
}: AutomationActivityHeaderProps) {
  const isFailed = execution.status === 'FAILED'

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AutomationActivityStatusIcon status={execution.status} />

        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold truncate">@{execution.input.author}</span>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 font-normal"
            >
              <Instagram className="mr-1 size-2.5" />
              Simulado
            </Badge>
            <Badge
              variant={statusVm.variant}
              className="text-[10px] px-1.5 py-0 font-medium"
              data-testid="activity-status-badge"
            >
              {statusVm.label}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate max-w-[200px]">{contentTitle}</span>
            <span>•</span>
            <span
              className={cn(
                'font-medium',
                matchDesc.type === 'unmatched' && 'text-amber-600 dark:text-amber-400',
                matchDesc.type === 'failed' && 'text-destructive',
              )}
              data-testid="activity-match-label"
            >
              {matchDesc.label}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {timeFormatted && (
          <span className="text-xs text-muted-foreground mr-1">{timeFormatted}</span>
        )}

        {isFailed && onRetry && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
            disabled={isRetrying}
            onClick={(e) => {
              e.stopPropagation()
              onRetry(execution.id)
            }}
            data-testid="activity-retry-button"
          >
            <RefreshCw className={cn('size-3.5', isRetrying && 'animate-spin')} />
            {isRetrying ? 'Reprocessando...' : 'Tentar novamente'}
          </Button>
        )}

        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
            aria-label={isOpen ? 'Recolher detalhes da jornada' : 'Expandir jornada'}
            data-testid="activity-expand-button"
          >
            <span className="hidden sm:inline mr-1">{isOpen ? 'Ocultar' : 'Ver jornada'}</span>
            {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>
    </div>
  )
}
