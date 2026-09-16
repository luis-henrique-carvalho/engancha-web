import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Instagram,
  RefreshCw,
  Unlink,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import { ChannelsApi } from '../services/channels-api'
import type { ChannelConnection } from '@/types/api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ChannelsView() {
  const queryClient = useQueryClient()
  const [connecting, setConnecting] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['channels-connections'],
    queryFn: () => ChannelsApi.listConnections(),
  })

  const connectMutation = useMutation({
    mutationFn: () => ChannelsApi.getConnectURL(),
    onSuccess: (res) => {
      window.location.href = res.authorizationUrl
    },
    onError: (err: any) => {
      setConnecting(false)
      toast.error(err?.message || 'Erro ao gerar link de conexão com o Instagram.')
    },
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

  const handleConnect = () => {
    setConnecting(true)
    connectMutation.mutate()
  }

  const items = data?.items ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Canais Conectados</h2>
          <p className="text-muted-foreground">
            Gerencie suas contas profissionais do Instagram integradas ao Engancha.
          </p>
        </div>
        <Button
          onClick={handleConnect}
          disabled={connecting || connectMutation.isPending}
        >
          {connecting || connectMutation.isPending ? (
            <Loader2 className="me-2 size-4 animate-spin" />
          ) : (
            <Instagram className="me-2 size-4" />
          )}
          Conectar Instagram
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 p-6 text-center text-destructive">
          Não foi possível carregar as conexões de canais.
        </div>
      ) : items.length === 0 ? (
        <Card className="border-dashed py-12 text-center">
          <CardContent className="space-y-3">
            <Instagram className="mx-auto size-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Nenhum canal conectado</h3>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground">
              Conecte sua conta profissional do Instagram para ativar respostas automáticas em posts
              e reels.
            </p>
            <Button
              onClick={handleConnect}
              className="mt-4"
              disabled={connecting}
            >
              Conectar Conta Profissional
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((channel: ChannelConnection) => (
            <Card
              key={channel.id}
              className="flex flex-col justify-between"
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Instagram className="size-5 text-pink-600" />
                    {channel.accountName}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    ID: {channel.externalAccountId}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    channel.status === 'ACTIVE'
                      ? 'default'
                      : channel.status === 'EXPIRED'
                        ? 'outline'
                        : 'destructive'
                  }
                >
                  {channel.status}
                </Badge>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                {channel.lastError && (
                  <p className="text-destructive flex items-center gap-1">
                    <AlertTriangle className="size-3" />
                    {channel.lastError}
                  </p>
                )}
                <p>Conectado em: {new Date(channel.createdAt).toLocaleDateString()}</p>
                {channel.tokenExpiresAt && (
                  <p>Expira em: {new Date(channel.tokenExpiresAt).toLocaleDateString()}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => revalidateMutation.mutate(channel.id)}
                  disabled={revalidateMutation.isPending}
                >
                  <RefreshCw className="me-1 size-3" />
                  Revalidar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => disconnectMutation.mutate(channel.id)}
                  disabled={disconnectMutation.isPending}
                >
                  <Unlink className="me-1 size-3" />
                  Desconectar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
