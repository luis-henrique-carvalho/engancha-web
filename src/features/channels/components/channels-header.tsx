import { ConnectChannelDialog } from './connect-channel-dialog'

export function ChannelsHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Canais Conectados</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie as redes sociais integradas ao Engancha para automações e respostas.
        </p>
      </div>
      <ConnectChannelDialog />
    </div>
  )
}
