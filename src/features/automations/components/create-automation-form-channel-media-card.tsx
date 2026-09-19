import type { ChannelConnection, ChannelMedia } from '@/types/api'
import { Label } from '@/components/ui/label'
import { CreateAutomationChannelPicker } from './create-automation-channel-picker'
import { CreateAutomationTargetMediaCard } from './create-automation-target-media-card'

export interface CreateAutomationFormChannelMediaCardProps {
  channels: ChannelConnection[]
  loadingChannels: boolean
  selectedConnectionId: string
  onSelectConnectionId: (id: string) => void
  selectedMedia: ChannelMedia | null
  onChangeMediaClick: () => void
}

export function CreateAutomationFormChannelMediaCard({
  channels,
  loadingChannels,
  selectedConnectionId,
  onSelectConnectionId,
  selectedMedia,
  onChangeMediaClick,
}: CreateAutomationFormChannelMediaCardProps) {
  return (
    <div className="space-y-3 rounded-2xl border bg-card p-4 shadow-xs">
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-foreground">Canal Conectado</Label>
        <CreateAutomationChannelPicker
          channels={channels}
          loadingChannels={loadingChannels}
          selectedConnectionId={selectedConnectionId}
          onSelectConnectionId={onSelectConnectionId}
        />
      </div>

      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-foreground">Publicação Alvo</Label>
          {selectedMedia && (
            <button
              type="button"
              onClick={onChangeMediaClick}
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Ver galeria
            </button>
          )}
        </div>
        <CreateAutomationTargetMediaCard
          media={selectedMedia}
          onChangeMediaClick={onChangeMediaClick}
        />
      </div>
    </div>
  )
}
