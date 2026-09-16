import { useState } from 'react'
import type { SimulationExecutionResponse } from '@engancha/contracts'
import { EmailCaptureAlerts } from './email-capture-alerts'
import { EmailCaptureForm } from './email-capture-form'
import { SimulationEmailCompletedBanner } from './simulation-email-completed-banner'
import { SimulationEmailProcessingBanner } from './simulation-email-processing-banner'
import { SimulationFollowerEmailBanner } from './simulation-follower-email-banner'
import { SimulationFollowerEmailBubble } from './simulation-follower-email-bubble'

export interface SubmitEmailCaptureParams {
  conversationId: string
  captureId: string
  email: string
  idempotencyKey?: string
  executionId: string
}

export interface SimulationFollowerEmailCaptureSectionProps {
  execution: SimulationExecutionResponse
  prompt: string
  isSubmittingEmail: boolean
  emailCaptureError: Error | null
  onSubmitEmail?: (params: SubmitEmailCaptureParams) => Promise<unknown> | void
}

export function SimulationFollowerEmailCaptureSection({
  execution,
  prompt,
  isSubmittingEmail,
  emailCaptureError,
  onSubmitEmail,
}: SimulationFollowerEmailCaptureSectionProps) {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const [idempotencyKey] = useState(() => crypto.randomUUID())

  const emailCapture = execution.emailCapture
  const isCompleted = emailCapture?.status === 'COMPLETED'
  const isProcessing = emailCapture?.status === 'PROCESSING' || isSubmittingEmail
  const isSuperseded = emailCapture?.status === 'SUPERSEDED'
  const isIdentityConflict = emailCapture?.errorCode === 'IDENTITY_CONFLICT'

  const handleSubmit = async (email: string) => {
    if (!execution.conversationId || !emailCapture?.id || !onSubmitEmail) return
    setSubmittedEmail(email)
    try {
      await onSubmitEmail({
        conversationId: execution.conversationId,
        captureId: emailCapture.id,
        email,
        idempotencyKey,
        executionId: execution.id,
      })
    } catch {
      // Capturado via hook
    }
  }

  const canShowForm =
    execution.status === 'COMPLETED' &&
    !isCompleted &&
    !isSuperseded &&
    Boolean(execution.conversationId) &&
    Boolean(emailCapture?.id)

  return (
    <div
      className="space-y-3"
      data-testid="simulation-step-email-capture"
    >
      <SimulationFollowerEmailBanner prompt={prompt} />

      {(submittedEmail || isCompleted) && (
        <SimulationFollowerEmailBubble
          author={execution.input.author}
          submittedEmail={submittedEmail}
        />
      )}

      <SimulationEmailProcessingBanner
        isProcessing={isProcessing}
        isCompleted={isCompleted}
      />

      <EmailCaptureAlerts
        emailCapture={emailCapture}
        emailCaptureError={emailCaptureError}
        isIdentityConflict={isIdentityConflict}
        isSuperseded={isSuperseded}
        isSubmittingEmail={isSubmittingEmail}
        onRetry={() => {
          if (submittedEmail) void handleSubmit(submittedEmail)
        }}
      />

      <SimulationEmailCompletedBanner isCompleted={isCompleted} />

      {canShowForm && (
        <EmailCaptureForm
          onSubmit={handleSubmit}
          isProcessing={isProcessing}
        />
      )}
    </div>
  )
}
