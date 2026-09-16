import { Loader2 } from 'lucide-react'
import type { ChannelConnection, ChannelMedia } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
      <div className="space-y-2">
        <Label>Canal Conectado</Label>
        {loadingChannels ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Carregando contas...
          </div>
        ) : channels.length === 0 ? (
          <div className="rounded-lg border border-dashed p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Nenhuma conta do Instagram conectada neste workspace.
            </p>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href="/channels">Ir para Canais</a>
            </Button>
          </div>
        ) : (
          <Select
            value={selectedConnectionId}
            onValueChange={onSelectConnectionId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma conta profissional" />
            </SelectTrigger>
            <SelectContent>
              {channels.map((c) => (
                <SelectItem
                  key={c.id}
                  value={c.id}
                >
                  {c.accountName} ({c.status})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedConnectionId && (
        <div className="space-y-2">
          <Label>Publicação ou Reel Elegível</Label>
          {loadingMedia ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              <Loader2 className="size-6 animate-spin me-2" /> Buscando mídias na Meta...
            </div>
          ) : mediaList.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              Nenhuma mídia encontrada para esta conta.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1">
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
