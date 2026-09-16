import { ChannelsSkeletonGrid } from './channels-skeleton-grid'
import { ChannelsErrorState } from './channels-error-state'
import { ChannelsEmptyState } from './channels-empty-state'
import { ChannelsFilteredEmpty } from './channels-filtered-empty'
import { ChannelCard } from './channel-card'
import { ChannelsPagination } from './channels-pagination'
import type { ChannelConnection, PaginationMeta } from '@/types/api'

export interface ChannelsContentProps {
  isLoading: boolean
  hasError: boolean
  items: ChannelConnection[]
  meta: PaginationMeta
  isFiltered: boolean
  isRevalidating: boolean
  isDisconnecting: boolean
  reconnectingProvider: string | null
  onRevalidate: (id: string) => void
  onDisconnect: (id: string) => void
  onReconnect: (provider: string) => void
  onResetFilters: () => void
  onPageChange: (page: number) => void
  onPageSizeChange: (limit: number) => void
}

export function ChannelsContent({
  isLoading,
  hasError,
  items,
  meta,
  isFiltered,
  isRevalidating,
  isDisconnecting,
  reconnectingProvider,
  onRevalidate,
  onDisconnect,
  onReconnect,
  onResetFilters,
  onPageChange,
  onPageSizeChange,
}: ChannelsContentProps) {
  if (isLoading) return <ChannelsSkeletonGrid />
  if (hasError) return <ChannelsErrorState />

  if (items.length === 0) {
    return isFiltered ? <ChannelsFilteredEmpty onReset={onResetFilters} /> : <ChannelsEmptyState />
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            isRevalidating={isRevalidating}
            isDisconnecting={isDisconnecting}
            isReconnecting={reconnectingProvider === channel.provider}
            onRevalidate={() => onRevalidate(channel.id)}
            onDisconnect={() => onDisconnect(channel.id)}
            onReconnect={() => onReconnect(channel.provider)}
          />
        ))}
      </div>

      {meta.total > 0 && (
        <ChannelsPagination
          page={meta.page}
          limit={meta.limit}
          total={meta.total}
          totalPages={meta.totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  )
}
