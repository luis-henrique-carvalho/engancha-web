import type { SimulationExecutionResponse, PaginationMeta } from '@engancha/contracts'
import { AutomationActivityList, AutomationActivityPagination } from '../../components'
import { AutomationActivityLoadingSkeleton } from './automation-activity-loading-skeleton'
import { AutomationActivityFilteredEmpty } from './automation-activity-filtered-empty'
import { AutomationActivityEmpty } from './automation-activity-empty'
import { groupExecutionsByDate } from '../../data/activity-grouping'

interface AutomationActivityContentProps {
  automationId: string
  isLoading: boolean
  isFiltered: boolean
  executions: SimulationExecutionResponse[]
  meta: PaginationMeta
  retryingId: string | null
  onReset: () => void
  onRetry: (executionId: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (limit: number) => void
}

export function AutomationActivityContent({
  automationId,
  isLoading,
  isFiltered,
  executions,
  meta,
  retryingId,
  onReset,
  onRetry,
  onPageChange,
  onPageSizeChange,
}: AutomationActivityContentProps) {
  if (isLoading) {
    return <AutomationActivityLoadingSkeleton />
  }

  if (executions.length === 0) {
    return isFiltered ? (
      <AutomationActivityFilteredEmpty onReset={onReset} />
    ) : (
      <AutomationActivityEmpty automationId={automationId} />
    )
  }

  const groups = groupExecutionsByDate(executions)

  return (
    <div className="space-y-6">
      <AutomationActivityList
        groups={groups}
        currentAutomationId={automationId}
        retryingId={retryingId}
        onRetry={onRetry}
      />

      <AutomationActivityPagination
        page={meta.page}
        limit={meta.limit}
        total={meta.total}
        totalPages={meta.totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
