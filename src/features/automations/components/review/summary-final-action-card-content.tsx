import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { getFinalAction } from '../../data/automation-action-mappers'

export function FinalActionCardContent({
  finalAction,
}: {
  finalAction: ReturnType<typeof getFinalAction>
}) {
  if (!finalAction) {
    return <p className="text-xs text-muted-foreground italic">Nenhuma ação final configurada.</p>
  }

  if (finalAction.type === 'LINK') {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-[10px]"
          >
            Link externo
          </Badge>
          <span className="text-xs font-semibold">{finalAction.label || 'Abrir link'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground break-all">
          <ExternalLink className="h-3 w-3 shrink-0" />
          <span>{finalAction.url}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="text-[10px]"
        >
          Captura de e-mail
        </Badge>
      </div>
      <div className="rounded bg-muted/50 p-2 text-xs text-foreground whitespace-pre-wrap">
        {finalAction.prompt}
      </div>
    </div>
  )
}
