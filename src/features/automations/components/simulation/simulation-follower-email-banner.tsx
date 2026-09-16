import { Info, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function SimulationFollowerEmailBanner({ prompt }: { prompt: string }) {
  return (
    <div className="rounded-lg border bg-amber-500/5 border-amber-500/20 p-3.5 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Mail className="size-3.5" />
          </div>
          <span className="text-xs font-semibold text-foreground">
            Ação final: Captura de e-mail
          </span>
        </div>
        <Badge
          variant="secondary"
          className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300"
        >
          Solicitação de e-mail
        </Badge>
      </div>
      <p className="text-xs text-foreground">{prompt}</p>
      <div
        className="rounded border border-dashed border-amber-500/40 bg-amber-500/5 p-2 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5"
        data-testid="simulation-email-notice"
      >
        <Info className="size-3.5 shrink-0" />
        <span>
          Simulação interativa: responda com um e-mail para testar a captura e a criação do lead.
        </span>
      </div>
    </div>
  )
}
