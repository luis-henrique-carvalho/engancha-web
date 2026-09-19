import { Loader2 } from 'lucide-react'
import type { ChannelConnection, ChannelMedia } from '@/types/api'
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
    <div className="space-y-6">
      <div className="max-w-md">
        <CreateAutomationChannelSelect
          channels={channels}
          loadingChannels={loadingChannels}
          selectedConnectionId={selectedConnectionId}
          onSelectConnectionId={onSelectConnectionId}
        />
      </div>

      {selectedConnectionId && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Publicação ou Conteúdo Alvo</h3>
              <p className="text-xs text-muted-foreground">
                Selecione o post ou reel onde os comentários serão monitorados.
              </p>
            </div>
            {mediaList.length > 0 && (
              <span className="text-xs text-muted-foreground font-medium">
                {mediaList.length} disponíveis
              </span>
            )}
          </div>

          {loadingMedia ? (
            <div className="flex flex-col items-center justify-center py-20 text-sm text-muted-foreground rounded-xl border border-dashed bg-muted/10">
              <Loader2 className="mb-2 size-6 animate-spin text-primary" />
              <span>Buscando publicações da conta conectada...</span>
            </div>
          ) : mediaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed text-muted-foreground bg-muted/10">
              <p className="text-sm font-medium text-foreground">
                Nenhuma publicação elegível encontrada
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Publique um post ou reel na sua conta conectada para vinculá-lo a esta automação.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 max-h-[520px] overflow-y-auto p-1">
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
