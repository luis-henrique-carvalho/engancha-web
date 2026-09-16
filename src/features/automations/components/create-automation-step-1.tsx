import { Loader2 } from 'lucide-react'
import type { ChannelConnection, ChannelMedia } from '@/types/api'
import { Label } from '@/components/ui/label'
import { CreateAutomationChannelSelect } from './create-automation-channel-select'
import { CreateAutomationMediaItem } from './create-automation-media-item'

export interface CreateAutomationStep1Props {
  channels: ChannelConnection[]
  loadingChannels: boolean
  selectedConnectionId: string
  onSelectConnectionId: (id: string) => void
  mediaList: ChannelMedia[]
  loadingMedia: boolean
  selectedMedia: ChannelMedia | null
  onSelectMedia: (media: ChannelMedia) => void
}

export function CreateAutomationStep1({
  channels,
  loadingChannels,
  selectedConnectionId,
  onSelectConnectionId,
  mediaList,
  loadingMedia,
  selectedMedia,
  onSelectMedia,
}: CreateAutomationStep1Props) {
  return (
    <div className="space-y-4 py-2">
      <CreateAutomationChannelSelect
        channels={channels}
        loadingChannels={loadingChannels}
        selectedConnectionId={selectedConnectionId}
        onSelectConnectionId={onSelectConnectionId}
      />

      {selectedConnectionId && (
        <div className="space-y-2">
          <Label>Publicação ou Conteúdo Alvo</Label>
          {loadingMedia ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              <Loader2 className="me-2 size-6 animate-spin" /> Buscando mídias disponíveis...
            </div>
          ) : mediaList.length === 0 ? (
            <p className="text-sm italic text-muted-foreground">
              Nenhuma mídia encontrada para esta conta.
            </p>
          ) : (
            <div className="grid max-h-64 grid-cols-2 gap-3 overflow-y-auto p-1 sm:grid-cols-3">
              {mediaList.map((m) => (
                <CreateAutomationMediaItem
                  key={m.externalId}
                  media={m}
                  isSelected={selectedMedia?.externalId === m.externalId}
                  onSelect={() => onSelectMedia(m)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
