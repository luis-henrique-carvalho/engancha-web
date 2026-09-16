import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ChannelsApi } from '../services/channels-api'
import { ConnectChannelDialog } from '../components/connect-channel-dialog'
import { ChannelCard } from '../components/channel-card'
import { ChannelsSkeletonGrid } from '../components/channels-skeleton-grid'
import { ChannelsErrorState } from '../components/channels-error-state'
import { ChannelsEmptyState } from '../components/channels-empty-state'
import type { ChannelConnection } from '@/types/api'
import { TooltipProvider } from '@/components/ui/tooltip'

export function ChannelsView() {
  const queryClient = useQueryClient()
  const [reconnectingProvider, setReconnectingProvider] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['channels-connections'],
    queryFn: () => ChannelsApi.listConnections(),
  })

  const revalidateMutation = useMutation({
    mutationFn: (id: string) => ChannelsApi.revalidateConnection(id),
    onSuccess: () => {
      toast.success('Conexão revalidada com sucesso!')
      void queryClient.invalidateQueries({ queryKey: ['channels-connections'] })
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Falha ao revalidar conexão.')
    },
  })

  const disconnectMutation = useMutation({
    mutationFn: (id: string) => ChannelsApi.disconnectConnection(id),
    onSuccess: () => {
      toast.success('Canal desconectado com sucesso!')
      void queryClient.invalidateQueries({ queryKey: ['channels-connections'] })
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Falha ao desconectar canal.')
    },
  })

  const handleReconnect = async (provider: string) => {
    try {
      setReconnectingProvider(provider)
      const res = await ChannelsApi.getConnectURL(provider)
      if (res?.authorizationUrl) {
        window.location.href = res.authorizationUrl
      } else {
        throw new Error('URL de autorização inválida retornada pelo servidor.')
      }
    } catch (err: any) {
      setReconnectingProvider(null)
      toast.error(err?.message || `Falha ao iniciar reconexão com ${provider}.`)
    }
  }

  const items = data?.items ?? []

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Canais Conectados</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Gerencie as redes sociais integradas ao Engancha para automações e respostas.
            </p>
          </div>
          <ConnectChannelDialog />
        </div>

        {isLoading ? (
          <ChannelsSkeletonGrid />
        ) : error ? (
          <ChannelsErrorState />
        ) : items.length === 0 ? (
          <ChannelsEmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((channel: ChannelConnection) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                isRevalidating={revalidateMutation.isPending}
                isDisconnecting={disconnectMutation.isPending}
                isReconnecting={reconnectingProvider === channel.provider}
                onRevalidate={() => revalidateMutation.mutate(channel.id)}
                onDisconnect={() => disconnectMutation.mutate(channel.id)}
                onReconnect={() => handleReconnect(channel.provider)}
              />
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
