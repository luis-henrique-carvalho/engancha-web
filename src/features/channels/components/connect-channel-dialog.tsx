import React, { useState } from 'react'
import { Plus, ShieldCheck } from 'lucide-react'
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
import { CHANNEL_PROVIDERS, type ChannelProviderMetadata } from '../config/providers'
import { ChannelsApi } from '../services/channels-api'

import { ProviderRow } from './provider-row'

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
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
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
