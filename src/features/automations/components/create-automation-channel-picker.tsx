import { useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import type { ChannelConnection } from '@/types/api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectTrigger } from '@/components/ui/select'
import { CreateAutomationChannelSelectGroups } from './create-automation-channel-select-groups'
import { CreateAutomationChannelSelectTriggerContent } from './create-automation-channel-select-trigger-content'

export interface CreateAutomationChannelPickerProps {
  channels: ChannelConnection[]
  loadingChannels: boolean
  selectedConnectionId: string
  onSelectConnectionId: (id: string) => void
}

export function CreateAutomationChannelPicker({
  channels,
  loadingChannels,
  selectedConnectionId,
  onSelectConnectionId,
}: CreateAutomationChannelPickerProps) {
  const selectedChannel = useMemo(
    () => channels.find((c) => c.id === selectedConnectionId) ?? channels[0] ?? null,
    [channels, selectedConnectionId],
  )

  const groupedChannels = useMemo(() => {
    const groups: Record<string, { provider: string; items: ChannelConnection[] }> = {}
    for (const channel of channels) {
      const provider = channel.provider || 'outros'
      if (!groups[provider]) {
        groups[provider] = { provider, items: [] }
      }
      groups[provider].items.push(channel)
    }
    return Object.values(groups)
  }, [channels])

  if (loadingChannels) {
    return (
      <div className="flex h-14 items-center gap-3 rounded-xl border bg-muted/20 px-3 py-2 text-sm text-muted-foreground animate-pulse">
        <Loader2 className="size-4 animate-spin text-primary" />
        <span>Carregando canais conectados...</span>
      </div>
    )
  }

  if (channels.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-4 text-center">
        <p className="text-xs text-muted-foreground mb-2">
          Nenhuma conta ativa disponível no workspace.
        </p>
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <a href="/channels">Conectar novo canal</a>
        </Button>
      </div>
    )
  }

  return (
    <Select
      value={selectedChannel?.id ?? ''}
      onValueChange={onSelectConnectionId}
    >
      <SelectTrigger
        className={cn(
          'group flex h-auto w-full items-center justify-between gap-3 rounded-xl border border-input bg-card p-2.5 text-left shadow-xs transition-all',
          'hover:border-primary/40 hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring [&>svg:last-child]:hidden',
        )}
      >
        <CreateAutomationChannelSelectTriggerContent selectedChannel={selectedChannel} />
      </SelectTrigger>

      <SelectContent
        className="w-[320px] p-1.5"
        align="start"
      >
        <CreateAutomationChannelSelectGroups groupedChannels={groupedChannels} />
      </SelectContent>
    </Select>
  )
}
