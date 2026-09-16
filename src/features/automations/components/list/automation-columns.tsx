import type { ColumnDef } from '@tanstack/react-table'
import type { Automation } from '@/types/api'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { Badge } from '@/components/ui/badge'
import { AutomationStatusBadge } from '../shared/automation-status-badge'
import { AutomationRowActions } from './automation-row-actions'

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return dateString
  }
}

export function createAutomationColumns(workspaceId?: string): ColumnDef<Automation>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Nome"
        />
      ),
      cell: ({ row }) => (
        <span
          className="font-medium text-foreground"
          data-testid="automation-name"
        >
          {row.original.name || 'Sem nome'}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
        />
      ),
      cell: ({ row }) => <AutomationStatusBadge status={row.original.status} />,
      enableSorting: false,
    },
    {
      accessorKey: 'mediaType',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Tipo de Mídia"
        />
      ),
      cell: ({ row }) => <Badge variant="outline">{row.original.mediaType}</Badge>,
      enableSorting: false,
    },
    {
      id: 'keywords',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Palavras-chave"
        />
      ),
      cell: ({ row }) => {
        const kw = row.original.keywords?.join(', ') || '—'
        return <span className="text-muted-foreground text-xs">{kw}</span>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Atualização"
        />
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(row.original.updatedAt)}
        </span>
      ),
      enableSorting: false,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <AutomationRowActions
          automation={row.original}
          workspaceId={workspaceId}
        />
      ),
    },
  ]
}

export const automationColumns: ColumnDef<Automation>[] = createAutomationColumns()
