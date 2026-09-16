import { flexRender } from '@tanstack/react-table'
import type { Automation, AutomationStatus } from '@/types/api'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { automationStatusOptions } from '../../data/automation-status-options'
import { useAutomationTable } from '../../hooks/use-automation-table'

type Filters = { query?: string; status?: AutomationStatus[] }

interface AutomationTableProps {
  data: Automation[]
  workspaceId?: string
  isLoading?: boolean
  meta: { page: number; limit: number; total: number; totalPages: number }
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (limit: number) => void
}

export function AutomationTable({
  data,
  workspaceId,
  isLoading = false,
  meta,
  filters,
  onFiltersChange,
  onPageChange,
  onPageSizeChange,
}: AutomationTableProps) {
  const { table, columns } = useAutomationTable({
    data,
    workspaceId,
    meta,
    filters,
    onFiltersChange,
    onPageChange,
    onPageSizeChange,
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchPlaceholder="Buscar por nome ou palavra-chave..."
        onReset={() => onFiltersChange({ query: undefined, status: undefined })}
        filters={[
          {
            columnId: 'status',
            title: 'Status',
            options: automationStatusOptions,
          },
        ]}
      />

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                  >
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
              <TableRow data-testid="automation-table-loading">
                <TableCell
                  colSpan={columns.length}
                  className="p-4"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  data-testid="automation-row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow data-testid="automation-table-empty">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhuma automação cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
