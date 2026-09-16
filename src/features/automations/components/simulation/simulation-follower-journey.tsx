import { CheckCircle2, RefreshCw } from 'lucide-react'
import type { SimulationExecutionResponse } from '@engancha/contracts'
import type { extractSimulationOutputs } from '../../data/simulation-view-mappers'
import { SimulationFollowerOutputs } from './simulation-follower-outputs'
import { SimulationFollowerCommentCard } from './simulation-follower-comment-card'
import { SimulationFollowerStatusAlert } from './simulation-follower-status-alert'
import type { SubmitEmailCaptureParams } from './simulation-follower-email-capture-section'

export interface SimulationFollowerJourneyProps {
  execution: SimulationExecutionResponse
  outputs: ReturnType<typeof extractSimulationOutputs>
  isRetrying: boolean
  isSubmittingEmail: boolean
  emailCaptureError: Error | null
  onSubmitEmail?: (params: SubmitEmailCaptureParams) => Promise<unknown> | void
  onRetry?: () => Promise<unknown> | void
}

export function SimulationFollowerJourney({
  execution,
  outputs,
  isRetrying,
  isSubmittingEmail,
  emailCaptureError,
  onSubmitEmail,
  onRetry,
}: SimulationFollowerJourneyProps) {
  return (
    <div className="space-y-4">
      <SimulationFollowerCommentCard
        author={execution.input.author}
        text={execution.input.text}
      />

      <SimulationFollowerStatusAlert
        execution={execution}
        isRetrying={isRetrying}
        onRetry={onRetry}
      />

      <SimulationFollowerOutputs
        execution={execution}
        outputs={outputs}
        isSubmittingEmail={isSubmittingEmail}
        emailCaptureError={emailCaptureError}
        onSubmitEmail={onSubmitEmail}
      />

      {(execution.status === 'PENDING' || execution.status === 'PROCESSING') && (
        <div
          className="flex items-center gap-2 rounded-lg border border-dashed p-3 text-xs text-muted-foreground bg-muted/20"
          data-testid="simulation-processing-step"
        >
          <RefreshCw className="size-3.5 animate-spin text-primary" />
          <span>Analisando comentário e preparando respostas...</span>
        </div>
      )}

      {execution.status === 'COMPLETED' && !outputs.emailCapture && (
        <div
          className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400"
          data-testid="simulation-completed-banner"
        >
          <CheckCircle2 className="size-4" />
          <span>Simulação da jornada concluída com sucesso</span>
        </div>
      )}
    </div>
  )
}
