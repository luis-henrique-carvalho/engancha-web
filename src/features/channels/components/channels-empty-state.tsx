import { Radio, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConnectChannelDialog } from './connect-channel-dialog'

export function ChannelsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <Radio className="size-8 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-base font-semibold">Nenhum canal conectado</h3>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
          Conecte Instagram, WhatsApp e outros canais para ativar automações e respostas
          inteligentes.
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
