import { Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import type { Conversation } from '@/types/api'
import { ArrowRight, Instagram, User } from 'lucide-react'

export const conversationsColumns: ColumnDef<Conversation>[] = [
  {
    accessorKey: 'contact',
    header: 'Contato',
    cell: ({ row }) => {
      const contact = row.original.contact
      const displayName = contact?.username
        ? `@${contact.username}`
        : contact?.fullName || row.original.contactId
      return (
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-full bg-muted flex items-center justify-center">
            <User className="size-3.5 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm">{displayName}</span>
            {contact?.fullName && contact?.username && (
              <span className="text-xs text-muted-foreground">{contact.fullName}</span>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge
          variant={status === 'OPEN' ? 'default' : 'secondary'}
          className={status === 'OPEN' ? 'bg-emerald-600 hover:bg-emerald-700 text-xs' : 'text-xs'}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'channel',
    header: 'Canal',
    cell: () => (
      <Badge
        variant="outline"
        className="text-xs flex items-center gap-1 w-fit"
      >
        <Instagram className="size-3 text-pink-600" />
        Instagram
      </Badge>
    ),
  },
  {
    accessorKey: 'lastMessageAt',
    header: 'Última Mensagem',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {new Date(row.original.lastMessageAt).toLocaleString('pt-BR')}
      </span>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Link
        to="/conversations/$conversationId"
        params={{ conversationId: row.original.id }}
        className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent text-muted-foreground hover:text-foreground"
        title="Ver histórico de mensagens"
      >
        <ArrowRight className="size-4" />
      </Link>
    ),
  },
]
