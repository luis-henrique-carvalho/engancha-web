import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Contact } from '@/types/api'
import { User as UserIcon } from 'lucide-react'
import { ChannelIcon } from '@/features/channels/components/channel-icon'

export const contactsColumns: ColumnDef<Contact>[] = [
  {
    accessorKey: 'identity',
    header: 'Identidade Social',
    cell: ({ row }) => {
      const contact = row.original
      const displayName = contact.username ? `@${contact.username}` : contact.fullName || contact.id
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage
              src={contact.profilePicUrl}
              alt={displayName}
            />
            <AvatarFallback>
              <UserIcon className="size-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">{displayName}</span>
            {contact.fullName && contact.username && (
              <span className="text-xs text-muted-foreground">{contact.fullName}</span>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'provider',
    header: 'Canal',
    cell: ({ row }) => {
      return (
        <Badge
          variant="outline"
          className="text-xs flex items-center gap-1.5 w-fit capitalize"
        >
          <ChannelIcon
            provider={row.original.provider}
            className="size-3.5"
          />
          {row.original.provider?.toLowerCase()}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'externalUserId',
    header: 'ID Externo',
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">{row.original.externalUserId}</span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Primeiro Contato',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleString('pt-BR')}
      </span>
    ),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Última Atividade',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {new Date(row.original.updatedAt).toLocaleString('pt-BR')}
      </span>
    ),
  },
]
