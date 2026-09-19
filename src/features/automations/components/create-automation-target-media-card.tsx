import { ArrowRight, Image as ImageIcon, MessageCircle, Play } from 'lucide-react'
import type { ChannelMedia } from '@/types/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface CreateAutomationTargetMediaCardProps {
  media: ChannelMedia | null
  onChangeMediaClick: () => void
}

export function CreateAutomationTargetMediaCard({
  media,
  onChangeMediaClick,
}: CreateAutomationTargetMediaCardProps) {
  if (!media) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-4 text-center bg-muted/10">
        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
          <ImageIcon className="size-4" />
        </div>
        <p className="text-xs font-medium text-foreground">Nenhuma publicação selecionada</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Selecione uma publicação ao lado para vincular a esta automação.
        </p>
      </div>
    )
  }

  const isVideo = media.mediaType === 'REEL'

  return (
    <div className="group relative flex items-center gap-3.5 rounded-xl border bg-card p-3 shadow-xs transition-all hover:border-primary/40">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted border">
        {media.thumbnailUrl ? (
          <img
            src={media.thumbnailUrl}
            alt={media.caption || 'Publicação'}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
            <ImageIcon className="size-5" />
          </div>
        )}
        <div className="absolute top-1 left-1">
          <Badge
            variant="secondary"
            className="px-1 py-0 text-[9px] font-semibold bg-black/60 text-white border-0 backdrop-blur-xs"
          >
            {isVideo ? <Play className="mr-0.5 size-2.5 fill-current" /> : null}
            {media.mediaType.toLowerCase()}
          </Badge>
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <p className="line-clamp-2 text-xs font-medium text-foreground leading-relaxed">
          {media.caption || <span className="italic text-muted-foreground">Sem legenda</span>}
        </p>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <MessageCircle className="size-3 text-primary" />
            Post ativo
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onChangeMediaClick}
        className="shrink-0 text-xs text-primary hover:text-primary hover:bg-primary/10"
      >
        Trocar
        <ArrowRight className="ml-1 size-3" />
      </Button>
    </div>
  )
}
