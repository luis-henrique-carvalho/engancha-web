import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from '@tanstack/react-table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table'
import type { Conversation, PaginationMeta } from '@/types/api'
import type { ListConversationsParams } from '../services/conversations-api'
import { conversationsColumns } from './conversations-columns'
import { ConversationsTableToolbar } from './conversations-table-toolbar'
import { MessageSquare } from 'lucide-react'

type Props = {
  data: Conversation[]
  isLoading: boolean
  meta: PaginationMeta
  params: Partial<ListConversationsParams>
  onParamsChange: (params: Partial<ListConversationsParams>) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (limit: number) => void
}

export function ConversationsTable({
  data,
  isLoading,
  meta,
  params,
  onParamsChange,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const pagination: PaginationState = {
    pageIndex: Math.max(0, meta.page - 1),
    pageSize: meta.limit,
  }

  const table = useReactTable({
    data,
    columns: conversationsColumns,
    state: { pagination },
    rowCount: meta.total,
    manualPagination: true,
    onPaginationChange: (next) => {
      const resolved = typeof next === 'function' ? next(pagination) : next
      if (resolved.pageSize !== pagination.pageSize) onPageSizeChange(resolved.pageSize)
      else onPageChange(resolved.pageIndex + 1)
    },
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <ConversationsTableToolbar
        params={params}
        onParamsChange={onParamsChange}
      />

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
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
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-4"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <MessageSquare className="size-6 text-muted-foreground/60" />
                    <span>
                      {params.query || params.status?.length || params.automationId
                        ? 'Nenhuma conversa encontrada para os filtros aplicados.'
                        : 'Nenhuma conversa registrada ainda neste workspace.'}
                    </span>
                  </div>
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
