import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { LeadListQuery, LeadSummary, PaginationMeta } from '@engancha/contracts'
import { leadsColumns } from './leads-columns'
import { LeadsTableToolbar } from './leads-table-toolbar'
import { LeadsPaginationBar } from './leads-pagination-bar'
import { LeadsEmptyState } from './leads-empty-state'

type Props = {
  data: LeadSummary[]
  isLoading: boolean
  meta: PaginationMeta
  params: Partial<LeadListQuery>
  onParamsChange: (params: Partial<LeadListQuery>) => void
}

export function LeadsTable({ data, isLoading, meta, params, onParamsChange }: Props) {
  const table = useReactTable({
    data,
    columns: leadsColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const hasActiveFilters = Boolean(
    params.query ||
    (params.provider && params.provider.length > 0) ||
    (params.mode && params.mode.length > 0) ||
    params.automationId ||
    params.tagId,
  )

  return (
    <div className="space-y-4">
      <LeadsTableToolbar
        params={params}
        hasActiveFilters={hasActiveFilters}
        onParamsChange={onParamsChange}
      />

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {leadsColumns.map((_, colIndex) => (
                    <TableCell key={`col-${colIndex}`}>
                      <Skeleton className="h-6 w-full max-w-[120px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={leadsColumns.length}
                  className="h-32 text-center"
                >
                  <LeadsEmptyState
                    hasActiveFilters={hasActiveFilters}
                    onResetFilters={() =>
                      onParamsChange({
                        limit: params.limit,
                        page: 1,
                      })
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <LeadsPaginationBar
        meta={meta}
        isLoading={isLoading}
        onPageChange={(page) => onParamsChange({ ...params, page })}
        onLimitChange={(limit) => onParamsChange({ ...params, limit, page: 1 })}
      />
    </div>
  )
}
