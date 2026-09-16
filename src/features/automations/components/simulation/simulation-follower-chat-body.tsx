import { AlertCircle } from 'lucide-react'
import type { SimulationExecutionResponse } from '@engancha/contracts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { extractSimulationOutputs } from '../../data/simulation-view-mappers'
import { SimulationFollowerEmptyState } from './simulation-follower-empty-state'
import { SimulationFollowerSubmittingState } from './simulation-follower-submitting-state'
import { SimulationFollowerJourney } from './simulation-follower-journey'
import type { SubmitEmailCaptureParams } from './simulation-follower-email-capture-section'

interface SimulationFollowerChatBodyProps {
  execution: SimulationExecutionResponse | null
  outputs: ReturnType<typeof extractSimulationOutputs>
  isLoading: boolean
  isSubmitting: boolean
  isRetrying: boolean
  isSubmittingEmail: boolean
  error: Error | null
  emailCaptureError: Error | null
  onSubmitEmail?: (params: SubmitEmailCaptureParams) => Promise<unknown> | void
  onRetry?: () => Promise<unknown> | void
}

export function SimulationFollowerChatBody({
  execution,
  outputs,
  isLoading,
  isSubmitting,
  isRetrying,
  isSubmittingEmail,
  error,
  emailCaptureError,
  onSubmitEmail,
  onRetry,
}: SimulationFollowerChatBodyProps) {
  return (
    <>
      {!execution && !isSubmitting && !isLoading && <SimulationFollowerEmptyState />}

      {(isSubmitting || (isLoading && !execution)) && <SimulationFollowerSubmittingState />}

      {error && (
        <Alert
          variant="destructive"
          className="py-2.5 text-xs"
          data-testid="simulation-error-banner"
        >
          <AlertCircle className="size-4" />
          <AlertTitle>Erro na simulação</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {execution && (
        <SimulationFollowerJourney
          execution={execution}
          outputs={outputs}
          isRetrying={isRetrying}
          isSubmittingEmail={isSubmittingEmail}
          emailCaptureError={emailCaptureError}
          onSubmitEmail={onSubmitEmail}
          onRetry={onRetry}
        />
      )}
    </>
  )
}
