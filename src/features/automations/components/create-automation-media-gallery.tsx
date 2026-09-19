import { useState, useMemo } from 'react'
import { Filter, Loader2 } from 'lucide-react'
import type { ChannelMedia } from '@/types/api'
import { Badge } from '@/components/ui/badge'
import { CreateAutomationMediaItem } from './create-automation-media-item'
import {
  CreateAutomationGalleryFilterBar,
  type MediaTypeFilter,
} from './create-automation-gallery-filter-bar'

export interface CreateAutomationMediaGalleryProps {
  mediaList: ChannelMedia[]
  loadingMedia: boolean
  selectedMedia: ChannelMedia | null
  onSelectMedia: (media: ChannelMedia) => void
}

export function CreateAutomationMediaGallery({
  mediaList,
  loadingMedia,
  selectedMedia,
  onSelectMedia,
}: CreateAutomationMediaGalleryProps) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<MediaTypeFilter>('ALL')

  const filteredList = useMemo(() => {
    return mediaList.filter((m) => {
      const matchCaption =
        !search || (m.caption && m.caption.toLowerCase().includes(search.toLowerCase()))
      if (!matchCaption) return false

      if (filterType !== 'ALL') {
        return m.mediaType === filterType
      }
      return true
    })
  }, [mediaList, search, filterType])

  return (
    <div className="flex h-full flex-col space-y-4 rounded-2xl border bg-card p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Galeria de Publicações</h3>
          <p className="text-xs text-muted-foreground">
            Escolha o post ou reel onde a automação vai atuar
          </p>
        </div>

        <Badge
          variant="outline"
          className="text-xs font-normal"
        >
          {mediaList.length} publicações
        </Badge>
      </div>

      <CreateAutomationGalleryFilterBar
        search={search}
        onSearchChange={setSearch}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
      />

      <div className="flex-1 overflow-y-auto min-h-[360px] pr-1">
        {loadingMedia ? (
          <div className="flex flex-col items-center justify-center py-20 text-xs text-muted-foreground">
            <Loader2 className="mb-2 size-6 animate-spin text-primary" />
            <span>Buscando publicações da conta conectada...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground rounded-xl border border-dashed bg-muted/5">
            <Filter className="mb-2 size-6 text-muted-foreground/60" />
            <p className="text-xs font-medium text-foreground">Nenhuma publicação encontrada</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs">
              Tente ajustar o termo de busca ou o filtro aplicado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
            {filteredList.map((m) => (
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
    </div>
  )
}
