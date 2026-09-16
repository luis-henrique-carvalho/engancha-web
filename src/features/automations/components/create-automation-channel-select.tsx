import { useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import type { ChannelConnection, ChannelProvider } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getProviderMetadata } from '@/features/channels/config/providers'
import { ChannelIcon } from '@/features/channels/components/channel-icon'

export interface CreateAutomationChannelSelectProps {
  channels: ChannelConnection[]
  loadingChannels: boolean
  selectedConnectionId: string
  onSelectConnectionId: (id: string) => void
}

export function CreateAutomationChannelSelect({
  channels,
  loadingChannels,
  selectedConnectionId,
  onSelectConnectionId,
}: CreateAutomationChannelSelectProps) {
  const groupedChannels = useMemo(() => {
    const groups: Record<string, { provider: ChannelProvider; items: ChannelConnection[] }> = {}
    for (const channel of channels) {
      const provider = channel.provider || 'outros'
      if (!groups[provider]) {
        groups[provider] = { provider: channel.provider, items: [] }
      }
      groups[provider].items.push(channel)
    }
    return Object.values(groups)
  }, [channels])

  if (loadingChannels) {
    return (
      <div className="space-y-2">
        <Label>Canal Conectado</Label>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Carregando contas ativas...
        </div>
      </div>
    )
  }

  if (channels.length === 0) {
    return (
      <div className="space-y-2">
        <Label>Canal Conectado</Label>
        <div className="rounded-lg border border-dashed p-4 text-center">
          <p className="mb-2 text-sm text-muted-foreground">
            Nenhuma conta ativa conectada neste workspace.
          </p>
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a href="/channels">Ir para Canais Conectados</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label>Canal Conectado</Label>
      <Select
        value={selectedConnectionId}
        onValueChange={onSelectConnectionId}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um canal ativo" />
        </SelectTrigger>
        <SelectContent>
          {groupedChannels.map((group) => {
            const meta = getProviderMetadata(group.provider)
            return (
              <SelectGroup key={group.provider}>
                <SelectLabel className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  <ChannelIcon
                    provider={group.provider}
                    className="size-3.5"
                  />
                  {meta.name}
                </SelectLabel>
                {group.items.map((c) => (
                  <SelectItem
                    key={c.id}
                    value={c.id}
                  >
                    <div className="flex items-center gap-2">
                      <ChannelIcon
                        provider={c.provider}
                        className="size-4 shrink-0"
                      />
                      <span className="font-medium">{c.accountName}</span>
                      {c.externalAccountId && (
                        <span className="font-mono text-xs text-muted-foreground">
                          ({c.externalAccountId})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
