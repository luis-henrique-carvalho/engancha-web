import React, { useState } from 'react'
import { Loader2, Plus, ArrowRight, ShieldCheck, Lock } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { CHANNEL_PROVIDERS, type ChannelProviderMetadata } from '../config/providers'
import { ChannelIcon } from './channel-icon'
import { ChannelsApi } from '../services/channels-api'

interface ConnectChannelDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function ConnectChannelDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}: ConnectChannelDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = isControlled ? setControlledOpen! : setUncontrolledOpen

  const [connectingProvider, setConnectingProvider] = useState<string | null>(null)

  const handleConnect = async (provider: ChannelProviderMetadata) => {
    if (!provider.isAvailable) return

    try {
      setConnectingProvider(provider.id)
      const res = await ChannelsApi.getConnectURL(provider.id)
      if (res?.authorizationUrl) {
        window.location.href = res.authorizationUrl
      } else {
        throw new Error('URL de autorização inválida retornada pelo servidor.')
      }
    } catch (err: any) {
      setConnectingProvider(null)
      toast.error(err?.message || `Falha ao iniciar conexão com ${provider.name}.`)
    }
  }

  const available = CHANNEL_PROVIDERS.filter((p) => p.isAvailable)
  const comingSoon = CHANNEL_PROVIDERS.filter((p) => !p.isAvailable)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button>
            <Plus className="me-2 size-4" />
            Adicionar Canal
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-lg gap-0 p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-lg">Conectar Canal</DialogTitle>
          <DialogDescription className="text-sm">
            Escolha uma plataforma para integrar automações ao seu workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Available providers */}
          {available.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-1">
                Disponível
              </p>
              <div className="space-y-2">
                {available.map((provider) => (
                  <ProviderRow
                    key={provider.id}
                    provider={provider}
                    isConnecting={connectingProvider === provider.id}
                    onConnect={handleConnect}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Coming soon */}
          {comingSoon.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-1">
                Em breve
              </p>
              <div className="space-y-2">
                {comingSoon.map((provider) => (
                  <ProviderRow
                    key={provider.id}
                    provider={provider}
                    isConnecting={false}
                    onConnect={handleConnect}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border/50 bg-muted/30 flex items-center gap-2">
          <ShieldCheck className="size-3.5 text-muted-foreground shrink-0" />
          <p className="text-[11px] text-muted-foreground">
            Suas credenciais são armazenadas com criptografia e nunca compartilhadas.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ─── ProviderRow ─────────────────────────────────────────── */

interface ProviderRowProps {
  provider: ChannelProviderMetadata
  isConnecting: boolean
  onConnect: (p: ChannelProviderMetadata) => void
}

function ProviderRow({ provider, isConnecting, onConnect }: ProviderRowProps) {
  const unavailable = !provider.isAvailable

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-xl border px-4 py-3 transition-all',
        unavailable
          ? 'border-border/40 bg-muted/20 opacity-60'
          : 'border-border/70 bg-card hover:border-primary/40 hover:bg-accent/30',
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex items-center justify-center rounded-xl size-10 shrink-0',
          provider.bgLightClass,
        )}
      >
        <ChannelIcon provider={provider.id} className="size-5" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium leading-tight truncate">{provider.name}</span>
          {unavailable && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
              Em breve
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{provider.description}</p>
        {provider.scopesInfo && (
          <p className="text-[10px] text-muted-foreground/60 mt-0.5 line-clamp-1">
            {provider.scopesInfo}
          </p>
        )}
      </div>

      {/* Action */}
      {unavailable ? (
        <Lock className="size-4 text-muted-foreground/40 shrink-0" />
      ) : (
        <Button
          size="sm"
          className="shrink-0 h-8 px-3 text-xs"
          disabled={isConnecting}
          onClick={() => onConnect(provider)}
        >
          {isConnecting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <>
              Conectar
              <ArrowRight className="ms-1 size-3" />
            </>
          )}
        </Button>
      )}
    </div>
  )
}
