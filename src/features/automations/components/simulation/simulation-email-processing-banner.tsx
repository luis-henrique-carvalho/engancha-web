import { RefreshCw } from 'lucide-react'

export interface SimulationEmailProcessingBannerProps {
  isProcessing: boolean
  isCompleted: boolean
}

export function SimulationEmailProcessingBanner({
  isProcessing,
  isCompleted,
}: SimulationEmailProcessingBannerProps) {
  if (!isProcessing || isCompleted) return null

  return (
    <div
      className="flex items-center gap-2 rounded-lg border border-dashed p-3 text-xs text-muted-foreground bg-muted/20"
      data-testid="simulation-email-processing-step"
    >
      <RefreshCw className="size-3.5 animate-spin text-primary" />
      <span>Processando resposta de e-mail e registrando contato...</span>
    </div>
  )
}
