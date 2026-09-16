import { Image as ImageIcon, Video } from 'lucide-react'
import type { ChannelMedia } from '@/types/api'
import { Badge } from '@/components/ui/badge'

interface CreateAutomationMediaItemProps {
  media: ChannelMedia
  isSelected: boolean
  onSelect: () => void
}

export function CreateAutomationMediaItem({
  media,
  isSelected,
  onSelect,
}: CreateAutomationMediaItemProps) {
  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-lg border p-2 transition-all hover:border-primary ${
        isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : ''
      }`}
    >
      <div className="aspect-square w-full rounded bg-muted overflow-hidden flex items-center justify-center relative">
        {media.thumbnailUrl ? (
          <img
            src={media.thumbnailUrl}
            alt={media.caption}
            className="h-full w-full object-cover"
          />
        ) : media.mediaType === 'REEL' ? (
          <Video className="size-8 text-muted-foreground" />
        ) : (
          <ImageIcon className="size-8 text-muted-foreground" />
        )}
        <Badge
          variant="secondary"
          className="absolute bottom-1 right-1 text-[10px] px-1 py-0"
        >
          {media.mediaType}
        </Badge>
      </div>
      <p
        className="mt-1 text-xs text-muted-foreground line-clamp-2"
        title={media.caption}
      >
        {media.caption || 'Sem legenda'}
      </p>
    </div>
  )
}
