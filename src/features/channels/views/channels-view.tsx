import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  RefreshCw,
  Unlink,
  Loader2,
  AlertTriangle,
  Radio,
  Plus,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { ChannelsApi } from '../services/channels-api'
import { getProviderMetadata } from '../config/providers'
import { ChannelIcon } from '../components/channel-icon'
import { ConnectChannelDialog } from '../components/connect-channel-dialog'
import type { ChannelConnection } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'


/* ─── Status helpers ─────────────────────────────────────── */

type ChannelStatus = 'ACTIVE' | 'EXPIRED' | 'DISCONNECTED' | 'ERROR' | string

interface StatusConfig {
  label: string
  icon: React.ReactNode
  className: string
}

function getStatusConfig(status: ChannelStatus): StatusConfig {
  switch (status) {
    case 'ACTIVE':
      return {
        label: 'Ativo',
        icon: <CheckCircle2 className="size-3" />,
        className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      }
    case 'EXPIRED':
      return {
        label: 'Expirado',
        icon: <AlertCircle className="size-3" />,
        className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20',
      }
    case 'DISCONNECTED':
      return {
        label: 'Desconectado',
        icon: <XCircle className="size-3" />,
        className: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20',
      }
    default:
      return {
        label: status,
        icon: <AlertCircle className="size-3" />,
        className: 'bg-muted text-muted-foreground border-border',
      }
  }
}

function fmt(date?: string | null) {
  if (!date) return null
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

/* ─── ChannelsView ──────────────────────────────────────── */

export function ChannelsView() {
  const queryClient = useQueryClient()

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

  const items = data?.items ?? []

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Canais Conectados</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Gerencie as redes sociais integradas ao Engancha para automações e respostas.
            </p>
          </div>
          <ConnectChannelDialog />
        </div>

        {/* States */}
        {isLoading ? (
          <SkeletonGrid />
        ) : error ? (
          <ErrorState />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          /* Channel grid — container-query aware */
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((channel: ChannelConnection) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                isRevalidating={revalidateMutation.isPending}
                isDisconnecting={disconnectMutation.isPending}
                onRevalidate={() => revalidateMutation.mutate(channel.id)}
                onDisconnect={() => disconnectMutation.mutate(channel.id)}
              />
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

/* ─── ChannelCard ───────────────────────────────────────── */

interface ChannelCardProps {
  channel: ChannelConnection
  isRevalidating: boolean
  isDisconnecting: boolean
  onRevalidate: () => void
  onDisconnect: () => void
}

function ChannelCard({
  channel,
  isRevalidating,
  isDisconnecting,
  onRevalidate,
  onDisconnect,
}: ChannelCardProps) {
  const meta = getProviderMetadata(channel.provider)
  const status = getStatusConfig(channel.status)
  const isActive = channel.status === 'ACTIVE'

  return (
    <div
      className={cn(
        '@container',
        'group flex flex-col rounded-xl border bg-card text-card-foreground',
        'transition-shadow duration-200 hover:shadow-md',
        !isActive && 'opacity-80',
      )}
    >
      {/* Top section */}
      <div className="flex items-start gap-4 p-5">
        {/* Profile picture — falls back to provider icon */}
        <Avatar className="size-12 shrink-0 rounded-2xl">
          <AvatarImage
            src={channel.profilePictureUrl ?? undefined}
            alt={channel.accountName}
            className="object-cover"
          />
          <AvatarFallback
            className={cn('rounded-2xl', meta.bgLightClass)}
          >
            <ChannelIcon provider={channel.provider} className="size-6" />
          </AvatarFallback>
        </Avatar>

        {/* Identity */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold leading-tight">
              {channel.accountName ?? '—'}
            </p>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-[10px] font-medium">
              {meta.shortName}
            </Badge>

            {/* Status pill */}
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

          {/* External ID */}
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="mt-1.5 cursor-default truncate text-[11px] text-muted-foreground/70 font-mono">
                {channel.externalAccountId}
              </p>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              ID externo: {channel.externalAccountId}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Metadata strip */}
      <div className="flex items-center gap-4 border-t px-5 py-3">
        {channel.createdAt && (
          <MetaItem
            icon={<CalendarDays className="size-3 shrink-0" />}
            label="Conectado"
            value={fmt(channel.createdAt)!}
          />
        )}
        {channel.tokenExpiresAt && (
          <>
            <div className="h-3 w-px bg-border" />
            <MetaItem
              icon={<Clock className="size-3 shrink-0" />}
              label="Expira"
              value={fmt(channel.tokenExpiresAt)!}
            />
          </>
        )}
      </div>

      {/* Error banner */}
      {channel.lastError && (
        <div className="flex items-start gap-2 border-t bg-destructive/5 px-5 py-2.5 text-destructive">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <p className="text-[11px] leading-snug line-clamp-2">{channel.lastError}</p>
        </div>
      )}

      {/* Footer actions */}
      <div className="mt-auto flex items-center gap-2 border-t px-5 py-3">
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex-1 text-xs"
          onClick={onRevalidate}
          disabled={isRevalidating}
        >
          {isRevalidating ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <>
              <RefreshCw className="me-1.5 size-3.5" />
              Revalidar
            </>
          )}
        </Button>

        <Separator orientation="vertical" className="h-5" />

        <Button
          variant="ghost"
          size="sm"
          className="h-8 flex-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onDisconnect}
          disabled={isDisconnecting}
        >
          {isDisconnecting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <>
              <Unlink className="me-1.5 size-3.5" />
              Desconectar
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

/* ─── MetaItem ──────────────────────────────────────────── */

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      {icon}
      <span className="text-[11px]">
        <span className="text-muted-foreground/60">{label}:</span>{' '}
        <span className="text-foreground/70 font-medium">{value}</span>
      </span>
    </div>
  )
}

/* ─── States ────────────────────────────────────────────── */

function SkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xl border bg-card p-5">
          <div className="flex gap-4">
            <Skeleton className="size-12 rounded-2xl" />
            <div className="flex-1 space-y-2 pt-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-px w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 flex-1" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 py-14 text-center">
      <AlertTriangle className="size-8 text-destructive/70" />
      <div>
        <p className="font-medium text-destructive">Não foi possível carregar os canais</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Verifique sua conexão e tente novamente.
        </p>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <Radio className="size-8 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-base font-semibold">Nenhum canal conectado</h3>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
          Conecte Instagram, WhatsApp e outros canais para ativar automações e respostas inteligentes.
        </p>
      </div>
      <ConnectChannelDialog
        trigger={
          <Button>
            <Plus className="me-2 size-4" />
            Conectar Novo Canal
          </Button>
        }
      />
    </div>
  )
}
