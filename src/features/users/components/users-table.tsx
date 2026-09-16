import { flexRender } from '@tanstack/react-table'
import type { ListUsersParams } from '../services/users-api'
import { DataTablePagination, DataTableToolbar } from '#/components/data-table'
import { Skeleton } from '#/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { roles } from '../data/data'
import type { User } from '../data/schema'
import { useUsersTable } from '../hooks/use-users-table'

type Props = {
  data: User[]
  isLoading: boolean
  meta: { page: number; limit: number; total: number; totalPages: number }
  filters: Pick<ListUsersParams, 'query' | 'role' | 'status'>
  onFiltersChange: (filters: Pick<ListUsersParams, 'query' | 'role' | 'status'>) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (limit: number) => void
}

export function UsersTable({
  data,
  isLoading,
  meta,
  filters,
  onFiltersChange,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const { table } = useUsersTable({
    data,
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
        searchPlaceholder="Buscar por nome ou e-mail..."
        onReset={() =>
          onFiltersChange({
            query: undefined,
            role: undefined,
            status: undefined,
          })
        }
        filters={[
          {
            columnId: 'role',
            title: 'Papel',
            options: roles.map(({ label, value, icon }) => ({ label, value, icon })),
          },
          {
            columnId: 'status',
            title: 'Estado',
            options: [
              { label: 'Ativo', value: 'active' },
              { label: 'Convite pendente', value: 'invited' },
            ],
          },
        ]}
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
                <TableCell colSpan={3}>
                  <Skeleton className="h-9 w-full" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
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
                  colSpan={3}
                  className="h-24 text-center text-muted-foreground"
                >
                  Ainda não há membros ou convites pendentes.
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
