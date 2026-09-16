import { Bot, User } from 'lucide-react'
import type { SimulationExecutionResponse } from '@engancha/contracts'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { getAutomationMatchDescription } from '../../data/activity-grouping'
import type { extractSimulationOutputs } from '../../data/simulation-view-mappers'
import { AutomationActivityTimelineOutputs } from './automation-activity-timeline-outputs'

export interface AutomationActivityTimelineProps {
  execution: SimulationExecutionResponse
  matchDesc: ReturnType<typeof getAutomationMatchDescription>
  outputs: ReturnType<typeof extractSimulationOutputs>
}

export function AutomationActivityTimeline({
  execution,
  matchDesc,
  outputs,
}: AutomationActivityTimelineProps) {
  return (
    <div
      className="border-t bg-muted/10 p-4 space-y-4 text-xs"
      data-testid="activity-journey-details"
    >
      <h5 className="font-semibold text-xs tracking-tight text-foreground flex items-center gap-1.5">
        <span>Jornada da interação</span>
        <Badge
          variant="outline"
          className="text-[10px] py-0 font-normal"
        >
          Passo a passo
        </Badge>
      </h5>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
        {/* Step 1: Ingested Comment */}
        <div className="relative">
          <div className="absolute -left-6 top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="size-2.5" />
          </div>
          <div className="space-y-0.5">
            <p className="font-medium text-foreground">Comentário do seguidor</p>
            <p className="text-muted-foreground">
              @{execution.input.author} comentou: "{execution.input.text}"
            </p>
          </div>
        </div>

        {/* Step 2: Match / Evaluation */}
        <div className="relative">
          <div
            className={cn(
              'absolute -left-6 top-0.5 flex size-4 items-center justify-center rounded-full',
              matchDesc.type === 'matched' && 'bg-primary text-primary-foreground',
              matchDesc.type === 'other-matched' && 'bg-primary text-primary-foreground',
              matchDesc.type === 'unmatched' && 'bg-amber-500 text-white',
              matchDesc.type === 'failed' && 'bg-destructive text-white',
              (matchDesc.type === 'pending' || matchDesc.type === 'processing') &&
                'bg-muted text-muted-foreground',
            )}
          >
            <Bot className="size-2.5" />
          </div>
          <div className="space-y-0.5">
            <p className="font-medium text-foreground">{matchDesc.label}</p>
            <p className="text-muted-foreground">{matchDesc.description}</p>
          </div>
        </div>

        <AutomationActivityTimelineOutputs
          execution={execution}
          outputs={outputs}
        />
      </div>
    </div>
  )
}
