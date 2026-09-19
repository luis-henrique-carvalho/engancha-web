import { Check, Image as ImageIcon, Video } from 'lucide-react'
import type { ChannelMedia } from '@/types/api'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary',
        isSelected
          ? 'border-primary bg-primary/5 ring-2 ring-primary shadow-sm'
          : 'border-border/70 bg-card hover:border-primary/50 hover:bg-accent/40',
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {media.thumbnailUrl ? (
          <img
            src={media.thumbnailUrl}
            alt={media.caption || 'Mídia do canal'}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            {media.mediaType === 'REEL' ? (
              <Video className="size-8" />
            ) : (
              <ImageIcon className="size-8" />
            )}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        <div
          className={cn(
            'absolute top-2 right-2 flex size-6 items-center justify-center rounded-full border transition-all',
            isSelected
              ? 'border-primary bg-primary text-primary-foreground shadow-sm'
              : 'border-white/50 bg-black/40 text-transparent opacity-0 group-hover:opacity-100',
          )}
        >
          <Check className="size-3.5 stroke-[3]" />
        </div>

        <Badge
          variant="secondary"
          className="absolute bottom-2 left-2 text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md bg-background/80"
        >
          {media.mediaType}
        </Badge>
      </div>

      <div className="p-2.5">
        <p
          className="text-xs font-medium text-foreground line-clamp-2 leading-snug"
          title={media.caption}
        >
          {media.caption || 'Sem legenda'}
        </p>
      </div>
    </button>
  )
}
