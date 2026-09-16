import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ChannelsApi } from '../services/channels-api'

export function useChannelsMutations() {
  const queryClient = useQueryClient()
  const [reconnectingProvider, setReconnectingProvider] = useState<string | null>(null)

  const revalidateMutation = useMutation({
    mutationFn: (id: string) => ChannelsApi.revalidateConnection(id),
    onSuccess: () => {
      toast.success('Conexão revalidada com sucesso!')
      void queryClient.invalidateQueries({ queryKey: ['channels-connections'] })
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Falha ao revalidar conexão.'
      toast.error(message)
    },
  })

  const disconnectMutation = useMutation({
    mutationFn: (id: string) => ChannelsApi.disconnectConnection(id),
    onSuccess: () => {
      toast.success('Canal desconectado com sucesso!')
      void queryClient.invalidateQueries({ queryKey: ['channels-connections'] })
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Falha ao desconectar canal.'
      toast.error(message)
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
    } catch (err: unknown) {
      setReconnectingProvider(null)
      const message =
        err instanceof Error ? err.message : `Falha ao iniciar reconexão com ${provider}.`
      toast.error(message)
    }
  }

  return {
    revalidateMutation,
    disconnectMutation,
    reconnectingProvider,
    handleReconnect,
  }
}
