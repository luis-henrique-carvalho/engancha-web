import { useState } from 'react'
import type { SimulationExecutionResponse } from '@engancha/contracts'
import { Card } from '@/components/ui/card'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { formatActivityTime, getAutomationMatchDescription } from '../../data/activity-grouping'
import {
  extractSimulationOutputs,
  getExecutionStatusViewModel,
} from '../../data/simulation-view-mappers'
import { AutomationActivityHeader } from './automation-activity-header'
import { AutomationActivityTimeline } from './automation-activity-timeline'

export interface AutomationActivityItemProps {
  execution: SimulationExecutionResponse
  currentAutomationId?: string
  isRetrying?: boolean
  onRetry?: (executionId: string) => void
}

export function AutomationActivityItem({
  execution,
  currentAutomationId,
  isRetrying = false,
  onRetry,
}: AutomationActivityItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const statusVm = getExecutionStatusViewModel(execution.status, execution.matched, execution.error)
  const matchDesc = getAutomationMatchDescription(execution, currentAutomationId)
  const outputs = extractSimulationOutputs(execution.outputs)
  const timeFormatted = formatActivityTime(execution.createdAt || execution.input.submittedAt)
  const contentTitle = execution.content?.title || 'Publicação simulada'

  return (
    <Card
      className={cn(
        'overflow-hidden transition-colors border',
        execution.status === 'FAILED' && 'border-destructive/30 bg-destructive/5',
        execution.status === 'IGNORED' && 'border-muted-foreground/20 bg-muted/10',
      )}
      data-testid={`activity-item-${execution.id}`}
    >
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <div className="p-4">
          <AutomationActivityHeader
            execution={execution}
            statusVm={statusVm}
            matchDesc={matchDesc}
            contentTitle={contentTitle}
            timeFormatted={timeFormatted}
            isOpen={isOpen}
            isRetrying={isRetrying}
            onRetry={onRetry}
          />

          <div className="mt-3 rounded-md bg-muted/30 p-2.5 text-xs">
            <span className="text-muted-foreground font-medium mr-1.5">Comentário:</span>
            <span className="text-foreground italic">"{execution.input.text}"</span>
          </div>
        </div>

        <CollapsibleContent>
          <AutomationActivityTimeline
            execution={execution}
            matchDesc={matchDesc}
            outputs={outputs}
          />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
