import { RefreshCw } from 'lucide-react'

export function SimulationFollowerSubmittingState() {
  return (
    <div
      className="flex min-h-[250px] flex-col items-center justify-center gap-3 text-center"
      data-testid="simulation-submitting-state"
    >
      <RefreshCw className="size-6 animate-spin text-primary" />
      <div className="space-y-1">
        <p className="text-xs font-semibold">Enviando comentário de teste...</p>
        <p className="text-[11px] text-muted-foreground">
          Iniciando simulação da experiência do seguidor.
        </p>
      </div>
    </div>
  )
}
