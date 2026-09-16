import { useState } from 'react'
import type { ActivityFilters } from '../data/activity-filter-options'
import type { AutomationActivityTabViewProps } from '../views/automation-activity-tab-view'

export function useActivityTabState(props: AutomationActivityTabViewProps) {
  const [internalQuery, setInternalQuery] = useState<string | undefined>(undefined)
  const [internalFilters, setInternalFilters] = useState<ActivityFilters>({})
  const [internalPage, setInternalPage] = useState<number>(1)
  const [internalLimit, setInternalLimit] = useState<number>(20)

  const query = props.query !== undefined ? props.query : internalQuery
  const filters = props.filters !== undefined ? props.filters : internalFilters
  const page = props.page !== undefined ? props.page : internalPage
  const limit = props.limit !== undefined ? props.limit : internalLimit

  const handleQueryChange = (nextQuery?: string) => {
    if (props.onQueryChange) props.onQueryChange(nextQuery)
    else {
      setInternalQuery(nextQuery)
      setInternalPage(1)
    }
  }

  const handleFiltersChange = (nextFilters: ActivityFilters) => {
    if (props.onFiltersChange) props.onFiltersChange(nextFilters)
    else {
      setInternalFilters(nextFilters)
      setInternalPage(1)
    }
  }

  const handlePageChange = (nextPage: number) => {
    if (props.onPageChange) props.onPageChange(nextPage)
    else setInternalPage(nextPage)
  }

  const handlePageSizeChange = (nextLimit: number) => {
    if (props.onPageSizeChange) props.onPageSizeChange(nextLimit)
    else {
      setInternalLimit(nextLimit)
      setInternalPage(1)
    }
  }

  const handleReset = () => {
    if (props.onReset) props.onReset()
    else {
      setInternalQuery(undefined)
      setInternalFilters({})
      setInternalPage(1)
    }
  }

  return {
    query,
    filters,
    page,
    limit,
    handleQueryChange,
    handleFiltersChange,
    handlePageChange,
    handlePageSizeChange,
    handleReset,
  }
}
