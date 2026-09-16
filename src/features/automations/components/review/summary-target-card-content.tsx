import { Badge } from '@/components/ui/badge'
import type { AutomationResponse } from '@engancha/contracts'

export function TargetCardContent({
  target,
}: {
  target: NonNullable<AutomationResponse['current']>['target'] | undefined
}) {
  if (!target) {
    return (
      <p className="text-xs text-muted-foreground italic">
        Nenhum conteúdo associado a esta automação.
      </p>
    )
  }

  return (
    <>
      <div className="font-semibold text-sm truncate">{target.title}</div>
      <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
        <Badge
          variant="outline"
          className="text-[10px]"
        >
          {target.provider}
        </Badge>
        <Badge
          variant="outline"
          className="text-[10px]"
        >
          {target.contentType}
        </Badge>
        <Badge
          variant="outline"
          className="text-[10px]"
        >
          {target.mode === 'SIMULATED' ? 'Simulado' : 'Real'}
        </Badge>
      </div>
    </>
  )
}
