import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { ChannelConnection } from '@/types/api'
import { getProviderMetadata } from '../config/providers'
import { ChannelIcon } from './channel-icon'
import { getStatusConfig } from '../utils/channel-status'

interface ChannelCardHeaderProps {
  channel: ChannelConnection
}

export function ChannelCardHeader({ channel }: ChannelCardHeaderProps) {
  const meta = getProviderMetadata(channel.provider)
  const status = getStatusConfig(channel.status)

  return (
    <div className="flex items-start gap-4 p-5">
      <Avatar className="size-12 shrink-0 rounded-2xl">
        <AvatarImage
          src={channel.profilePictureUrl ?? undefined}
          alt={channel.accountName}
          className="object-cover"
        />
        <AvatarFallback className={cn('rounded-2xl', meta.bgLightClass)}>
          <ChannelIcon
            provider={channel.provider}
            className="size-6"
          />
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold leading-tight">
            {channel.accountName ?? '—'}
          </p>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <Badge
            variant="secondary"
            className="rounded-md px-1.5 py-0 text-[10px] font-medium"
          >
            {meta.shortName}
          </Badge>

          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium',
              status.className,
            )}
          >
            {status.icon}
            {status.label}
          </span>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <p className="mt-1.5 cursor-default truncate text-[11px] text-muted-foreground/70 font-mono">
              {channel.externalAccountId}
            </p>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="text-xs"
          >
            ID externo: {channel.externalAccountId}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
