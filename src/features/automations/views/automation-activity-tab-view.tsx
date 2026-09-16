import { AutomationActivityToolbar } from '../components'
import { AutomationActivityContent } from '../components/activity/automation-activity-content'
import { AutomationActivityTabHeader } from '../components/activity/automation-activity-tab-header'
import type { ActivityFilters } from '../data/activity-filter-options'
import { useSimulationExecutionsList } from '../hooks/use-simulation-executions-list'
import { useActivityTabState } from '../hooks/use-activity-tab-state'

export interface AutomationActivityTabViewProps {
  automationId: string
  query?: string
  filters?: ActivityFilters
  page?: number
  limit?: number
  onQueryChange?: (query?: string) => void
  onFiltersChange?: (filters: ActivityFilters) => void
  onPageChange?: (page: number) => void
  onPageSizeChange?: (limit: number) => void
  onReset?: () => void
}

export function AutomationActivityTabView(props: AutomationActivityTabViewProps) {
  const { automationId } = props
  const {
    query,
    filters,
    page,
    limit,
    handleQueryChange,
    handleFiltersChange,
    handlePageChange,
    handlePageSizeChange,
    handleReset,
  } = useActivityTabState(props)

  const {
    executions,
    meta,
    isLoading,
    isRefreshing,
    isReconnecting,
    error,
    retryingId,
    refresh,
    retry,
  } = useSimulationExecutionsList({
    automationId,
    query,
    filters,
    page,
    limit,
  })

  const isFiltered = Boolean(
    query ||
    filters.status?.length ||
    filters.provider?.length ||
    filters.mode?.length ||
    filters.contentType?.length ||
    filters.outputType?.length,
  )

  return (
    <div
      className="space-y-6"
      data-testid="automation-activity-tab-view"
    >
      <AutomationActivityTabHeader
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        isReconnecting={isReconnecting}
        error={error}
        onRefresh={refresh}
      />

      <AutomationActivityToolbar
        query={query}
        onQueryChange={handleQueryChange}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleReset}
      />

      <AutomationActivityContent
        automationId={automationId}
        isLoading={isLoading}
        isFiltered={isFiltered}
        executions={executions}
        meta={meta}
        retryingId={retryingId}
        onReset={handleReset}
        onRetry={retry}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  )
}
