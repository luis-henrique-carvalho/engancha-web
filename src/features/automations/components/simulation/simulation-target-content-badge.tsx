import { Instagram } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { SimulationContentInfo } from './simulation-test-form'

interface SimulationTargetContentBadgeProps {
  content: SimulationContentInfo | null
}

export function SimulationTargetContentBadge({ content }: SimulationTargetContentBadgeProps) {
  if (!content) {
    return (
      <Alert
        variant="destructive"
        className="py-2 text-xs"
      >
        <AlertTitle>Conteúdo não vinculado</AlertTitle>
        <AlertDescription>
          Esta automação não possui uma publicação de destino configurada.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div
      className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3 text-xs"
      data-testid="simulation-target-content"
    >
      {content.thumbnailUrl ? (
        <img
          src={content.thumbnailUrl}
          alt="Miniatura do post"
          className="size-12 rounded object-cover"
        />
      ) : (
        <div className="flex size-12 items-center justify-center rounded bg-muted text-muted-foreground">
          <Instagram className="size-5" />
        </div>
      )}
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-foreground">
            {content.type === 'VIDEO' ? 'Reel / Vídeo' : 'Post publicado'}
          </span>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0"
          >
            Simulado
          </Badge>
        </div>
        <p className="line-clamp-2 text-muted-foreground">{content.title || 'Sem título'}</p>
      </div>
    </div>
  )
}
