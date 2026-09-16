import { CheckCircle2 } from 'lucide-react'

export interface SimulationEmailCompletedBannerProps {
  isCompleted: boolean
}

export function SimulationEmailCompletedBanner({
  isCompleted,
}: SimulationEmailCompletedBannerProps) {
  if (!isCompleted) return null

  return (
    <div
      className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
      data-testid="simulation-email-completed-banner"
    >
      <CheckCircle2 className="size-4" />
      <span>E-mail capturado com sucesso! Lead registrado no workspace.</span>
    </div>
  )
}
