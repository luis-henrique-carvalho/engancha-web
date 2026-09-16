import { useState } from 'react'
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
} from '@tanstack/react-table'
import type { ListUsersParams } from '../services/users-api'
import type { User } from '../data/schema'
import { usersColumns } from '../components/users-columns'

interface UseUsersTableProps {
  data: User[]
  meta: { page: number; limit: number; total: number; totalPages: number }
  filters: Pick<ListUsersParams, 'query' | 'role' | 'status'>
  onFiltersChange: (filters: Pick<ListUsersParams, 'query' | 'role' | 'status'>) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (limit: number) => void
}

export function useUsersTable({
  data,
  meta,
  filters,
  onFiltersChange,
  onPageChange,
  onPageSizeChange,
}: UseUsersTableProps) {
  const [columnVisibility, setColumnVisibility] = useState({})
  const columnFilters: ColumnFiltersState = [
    ...(filters.role?.length ? [{ id: 'role', value: filters.role }] : []),
    ...(filters.status?.length ? [{ id: 'status', value: filters.status }] : []),
  ]
  const pagination: PaginationState = {
    pageIndex: Math.max(0, meta.page - 1),
    pageSize: meta.limit,
  }

  const table = useReactTable({
    data,
    columns: usersColumns,
    state: { globalFilter: filters.query ?? '', columnFilters, pagination, columnVisibility },
    rowCount: meta.total,
    manualFiltering: true,
    manualPagination: true,
    onGlobalFilterChange: (value) =>
      onFiltersChange({ ...filters, query: String(value) || undefined }),
    onColumnFiltersChange: (next) => {
      const resolved = typeof next === 'function' ? next(columnFilters) : next
      const role = resolved.find((filter) => filter.id === 'role')?.value as string[] | undefined
      const status = resolved.find((filter) => filter.id === 'status')?.value as
        string[] | undefined
      onFiltersChange({
        ...filters,
        role: role?.length ? (role as ListUsersParams['role']) : undefined,
        status: status?.length ? (status as ListUsersParams['status']) : undefined,
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

  return { table }
}
