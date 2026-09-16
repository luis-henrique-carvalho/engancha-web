import type { SimulationExecutionResponse } from '@engancha/contracts'
import { Card, CardContent } from '@/components/ui/card'
import { extractSimulationOutputs } from '../../data/simulation-view-mappers'
import type { SseConnectionStatus } from '../../hooks/use-simulation-execution'
import { SimulationFollowerChatHeader } from './simulation-follower-chat-header'
import { SimulationFollowerChatBody } from './simulation-follower-chat-body'
import type { SubmitEmailCaptureParams } from './simulation-follower-email-capture-section'

export type { SubmitEmailCaptureParams }

export interface SimulationFollowerChatProps {
  execution: SimulationExecutionResponse | null
  isLoading?: boolean
  isSubmitting?: boolean
  isRetrying?: boolean
  isSubmittingEmail?: boolean
  isReconnecting?: boolean
  connectionStatus?: SseConnectionStatus
  error?: Error | null
  emailCaptureError?: Error | null
  onSubmitEmail?: (params: SubmitEmailCaptureParams) => Promise<unknown> | void
  onRetry?: () => Promise<unknown> | void
  onReset?: () => void
}

export function SimulationFollowerChat({
  execution,
  isLoading = false,
  isSubmitting = false,
  isRetrying = false,
  isSubmittingEmail = false,
  isReconnecting = false,
  error = null,
  emailCaptureError = null,
  onSubmitEmail,
  onRetry,
  onReset,
}: SimulationFollowerChatProps) {
  const outputs = execution ? extractSimulationOutputs(execution.outputs) : {}

  return (
    <Card
      className="h-full flex flex-col"
      data-testid="simulation-follower-chat-card"
    >
      <SimulationFollowerChatHeader
        isReconnecting={isReconnecting}
        showReset={Boolean(execution && onReset)}
        onReset={onReset}
      />

      <CardContent
        className="flex-1 p-4 space-y-4 overflow-y-auto"
        aria-live="polite"
        role="status"
        data-testid="simulation-follower-journey-content"
      >
        <SimulationFollowerChatBody
          execution={execution}
          outputs={outputs}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          isRetrying={isRetrying}
          isSubmittingEmail={isSubmittingEmail}
          error={error}
          emailCaptureError={emailCaptureError}
          onSubmitEmail={onSubmitEmail}
          onRetry={onRetry}
        />
      </CardContent>
    </Card>
  )
}
