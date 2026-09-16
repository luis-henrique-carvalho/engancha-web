import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChannelsApi } from '../services/channels-api'
import { ChannelsHeader } from '../components/channels-header'
import { ChannelsToolbar, type ChannelFilters } from '../components/channels-toolbar'
import { ChannelsContent } from '../components/channels-content'
import { useChannelsMutations } from '../hooks/use-channels-mutations'
import type { ListChannelsParams } from '@/types/api'
import { TooltipProvider } from '@/components/ui/tooltip'

export function ChannelsView() {
  const [params, setParams] = useState<ListChannelsParams>({
    page: 1,
    limit: 12,
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['channels-connections', params],
    queryFn: () => ChannelsApi.listConnections(params),
  })

  const { revalidateMutation, disconnectMutation, reconnectingProvider, handleReconnect } =
    useChannelsMutations()

  const items = data?.items ?? []
  const meta = data?.meta ?? {
    page: params.page ?? 1,
    limit: params.limit ?? 12,
    total: 0,
    totalPages: 0,
  }

  const isFiltered = Boolean(
    params.query ||
    (params.status && params.status.length > 0) ||
    (params.provider && params.provider.length > 0),
  )

  const handleResetFilters = () =>
    setParams((prev) => ({
      ...prev,
      query: undefined,
      status: undefined,
      provider: undefined,
      page: 1,
    }))

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className="space-y-6"
        data-testid="channels-view"
      >
        <ChannelsHeader />

        <ChannelsToolbar
          filters={{
            query: params.query,
            status: params.status,
            provider: params.provider,
          }}
          onFiltersChange={(filters: ChannelFilters) =>
            setParams((prev) => ({ ...prev, ...filters, page: 1 }))
          }
          onReset={handleResetFilters}
        />

        <ChannelsContent
          isLoading={isLoading}
          hasError={Boolean(error)}
          items={items}
          meta={meta}
          isFiltered={isFiltered}
          isRevalidating={revalidateMutation.isPending}
          isDisconnecting={disconnectMutation.isPending}
          reconnectingProvider={reconnectingProvider}
          onRevalidate={(id) => revalidateMutation.mutate(id)}
          onDisconnect={(id) => disconnectMutation.mutate(id)}
          onReconnect={handleReconnect}
          onResetFilters={handleResetFilters}
          onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
          onPageSizeChange={(limit) => setParams((prev) => ({ ...prev, limit, page: 1 }))}
        />
      </div>
    </TooltipProvider>
  )
}
