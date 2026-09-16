import { Instagram } from 'lucide-react'

export function SimulationFollowerEmptyState() {
  return (
    <div
      className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center"
      data-testid="simulation-empty-state"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Instagram className="size-6" />
      </div>
      <h4 className="mt-3 text-sm font-semibold">Nenhum teste em execução</h4>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
        Envie um comentário pelo formulário ao lado para acompanhar a resposta pública, a mensagem
        direta e a ação final.
      </p>
    </div>
  )
}
