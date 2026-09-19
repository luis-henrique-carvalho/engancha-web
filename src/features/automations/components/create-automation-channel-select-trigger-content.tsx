import { ChevronDown, Globe } from 'lucide-react'
import type { ChannelConnection } from '@/types/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ChannelIcon } from '@/features/channels/components/channel-icon'
import { getProviderMetadata } from '@/features/channels/config/providers'

export interface CreateAutomationChannelSelectTriggerContentProps {
  selectedChannel: ChannelConnection | null
}

function getInitials(name?: string): string {
  if (!name) return 'CH'
  return name.replace(/^@/, '').trim().slice(0, 2).toUpperCase()
}

export function CreateAutomationChannelSelectTriggerContent({
  selectedChannel,
}: CreateAutomationChannelSelectTriggerContentProps) {
  return (
    <>
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative size-9 shrink-0">
          <Avatar className="size-9 rounded-lg border border-border">
            <AvatarImage
              src={selectedChannel?.profilePictureUrl ?? undefined}
              alt={selectedChannel?.accountName}
            />
            <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-bold text-primary">
              {getInitials(selectedChannel?.accountName)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-background ring-1 ring-border shadow-xs">
            {selectedChannel ? (
              <ChannelIcon
                provider={selectedChannel.provider}
                className="size-2.5"
              />
            ) : (
              <Globe className="size-2.5 text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-foreground">
              {selectedChannel?.accountName ?? 'Selecione uma conta'}
            </span>
            <Badge
              variant="secondary"
              className="px-1.5 py-0 text-[10px] font-normal h-4"
            >
              Ativo
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground capitalize">
            {selectedChannel ? getProviderMetadata(selectedChannel.provider).name : 'Canal'}
          </p>
        </div>
      </div>

      <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
    </>
  )
}
