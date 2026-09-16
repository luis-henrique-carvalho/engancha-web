import { AlertTriangle, CalendarDays, Clock } from 'lucide-react'
import type { ChannelConnection } from '@/types/api'
import { cn } from '@/lib/utils'
import { ChannelCardHeader } from './channel-card-header'
import { ChannelCardMetaItem } from './channel-card-meta-item'
import { ChannelCardActions } from './channel-card-actions'
import { formatChannelDate } from '../utils/channel-status'

export interface ChannelCardProps {
  channel: ChannelConnection
  isRevalidating: boolean
  isDisconnecting: boolean
  isReconnecting: boolean
  onRevalidate: () => void
  onDisconnect: () => void
  onReconnect: () => void
}

export function ChannelCard({
  channel,
  isRevalidating,
  isDisconnecting,
  isReconnecting,
  onRevalidate,
  onDisconnect,
  onReconnect,
}: ChannelCardProps) {
  const isActive = channel.status === 'ACTIVE'
  const isDisconnected = channel.status === 'DISCONNECTED' || channel.status === 'REVOKED'

  return (
    <div
      className={cn(
        '@container group flex flex-col rounded-xl border bg-card text-card-foreground transition-shadow duration-200 hover:shadow-md',
        !isActive && 'opacity-80',
      )}
    >
      <ChannelCardHeader channel={channel} />

      <div className="flex items-center gap-4 border-t px-5 py-3">
        {channel.createdAt && (
          <ChannelCardMetaItem
            icon={<CalendarDays className="size-3 shrink-0" />}
            label="Conectado"
            value={formatChannelDate(channel.createdAt)!}
          />
        )}
        {channel.tokenExpiresAt && (
          <>
            <div className="h-3 w-px bg-border" />
            <ChannelCardMetaItem
              icon={<Clock className="size-3 shrink-0" />}
              label="Expira"
              value={formatChannelDate(channel.tokenExpiresAt)!}
            />
          </>
        )}
      </div>

      {channel.lastError && (
        <div className="flex items-start gap-2 border-t bg-destructive/5 px-5 py-2.5 text-destructive">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <p className="text-[11px] leading-snug line-clamp-2">{channel.lastError}</p>
        </div>
      )}

      <ChannelCardActions
        isDisconnected={isDisconnected}
        isRevalidating={isRevalidating}
        isDisconnecting={isDisconnecting}
        isReconnecting={isReconnecting}
        onRevalidate={onRevalidate}
        onDisconnect={onDisconnect}
        onReconnect={onReconnect}
      />
    </div>
  )
}
