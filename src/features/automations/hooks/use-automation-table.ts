import { useState } from 'react'
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
} from '@tanstack/react-table'
import type { Automation, AutomationStatus } from '@/types/api'
import { createAutomationColumns } from '../components/list/automation-columns'

type Filters = { query?: string; status?: AutomationStatus[] }

interface UseAutomationTableProps {
  data: Automation[]
  workspaceId?: string
  meta: { page: number; limit: number; total: number; totalPages: number }
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (limit: number) => void
}

export function useAutomationTable({
  data,
  workspaceId,
  meta,
  filters,
  onFiltersChange,
  onPageChange,
  onPageSizeChange,
}: UseAutomationTableProps) {
  const [columnVisibility, setColumnVisibility] = useState({})

  const columns = createAutomationColumns(workspaceId)

  const columnFilters: ColumnFiltersState = [
    ...(filters.status?.length ? [{ id: 'status', value: filters.status }] : []),
  ]

  const pagination: PaginationState = {
    pageIndex: Math.max(0, meta.page - 1),
    pageSize: meta.limit,
  }

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter: filters.query ?? '', columnFilters, pagination, columnVisibility },
    rowCount: meta.total,
    manualFiltering: true,
    manualPagination: true,
    onGlobalFilterChange: (value) =>
      onFiltersChange({ ...filters, query: String(value) || undefined }),
    onColumnFiltersChange: (next) => {
      const resolved = typeof next === 'function' ? next(columnFilters) : next
      const status = resolved.find((f) => f.id === 'status')?.value as
        AutomationStatus[] | undefined
      onFiltersChange({
        ...filters,
        status: status?.length ? status : undefined,
      })
    },
    onPaginationChange: (next) => {
      const resolved = typeof next === 'function' ? next(pagination) : next
      if (resolved.pageSize !== pagination.pageSize) onPageSizeChange(resolved.pageSize)
      else onPageChange(resolved.pageIndex + 1)
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return { table, columns }
}
