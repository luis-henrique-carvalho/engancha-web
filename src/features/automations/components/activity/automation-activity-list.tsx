import { Calendar } from 'lucide-react'
import type { ActivityGroup } from '../../data/activity-grouping'
import { AutomationActivityItem } from './automation-activity-item'

export interface AutomationActivityListProps {
  groups: ActivityGroup[]
  currentAutomationId?: string
  retryingId?: string | null
  onRetry?: (executionId: string) => void
}

export function AutomationActivityList({
  groups,
  currentAutomationId,
  retryingId,
  onRetry,
}: AutomationActivityListProps) {
  return (
    <div
      className="space-y-6"
      data-testid="automation-activity-list"
    >
      {groups.map((group) => (
        <div
          key={group.dateLabel}
          className="space-y-3"
        >
          {/* Date header */}
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Calendar className="size-3.5" />
            <span>{group.dateLabel}</span>
            <span className="text-[10px] font-normal lowercase">
              ({group.executions.length}{' '}
              {group.executions.length === 1 ? 'interação' : 'interações'})
            </span>
          </div>

          {/* List of items in date bucket */}
          <div className="space-y-3">
            {group.executions.map((execution) => (
              <AutomationActivityItem
                key={execution.id}
                execution={execution}
                currentAutomationId={currentAutomationId}
                isRetrying={retryingId === execution.id}
                onRetry={onRetry}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
