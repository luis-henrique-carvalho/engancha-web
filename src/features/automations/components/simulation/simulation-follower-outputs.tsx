import { ExternalLink, MessageSquare, Send } from 'lucide-react'
import type { SimulationExecutionResponse } from '@engancha/contracts'
import { Badge } from '@/components/ui/badge'
import type { extractSimulationOutputs } from '../../data/simulation-view-mappers'
import {
  SimulationFollowerEmailCaptureSection,
  type SubmitEmailCaptureParams,
} from './simulation-follower-email-capture-section'

export interface SimulationFollowerOutputsProps {
  execution: SimulationExecutionResponse
  outputs: ReturnType<typeof extractSimulationOutputs>
  isSubmittingEmail: boolean
  emailCaptureError: Error | null
  onSubmitEmail?: (params: SubmitEmailCaptureParams) => Promise<unknown> | void
}

export function SimulationFollowerOutputs({
  execution,
  outputs,
  isSubmittingEmail,
  emailCaptureError,
  onSubmitEmail,
}: SimulationFollowerOutputsProps) {
  return (
    <>
      {outputs.publicReply && (
        <div
          className="rounded-lg border bg-blue-500/5 border-blue-500/20 p-3.5 space-y-2"
          data-testid="simulation-step-public-reply"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                <MessageSquare className="size-3.5" />
              </div>
              <span className="text-xs font-semibold text-foreground">Sua Conta</span>
            </div>
            <Badge
              variant="secondary"
              className="text-[10px] bg-blue-500/10 text-blue-700 dark:text-blue-300"
            >
              Resposta pública
            </Badge>
          </div>
          <p className="text-xs text-foreground">{outputs.publicReply.text}</p>
        </div>
      )}

      {outputs.privateReply && (
        <div
          className="rounded-lg border bg-purple-500/5 border-purple-500/20 p-3.5 space-y-2"
          data-testid="simulation-step-direct-message"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400">
                <Send className="size-3.5" />
              </div>
              <span className="text-xs font-semibold text-foreground">Mensagem direta (DM)</span>
            </div>
            <Badge
              variant="secondary"
              className="text-[10px] bg-purple-500/10 text-purple-700 dark:text-purple-300"
            >
              Direct
            </Badge>
          </div>
          <p className="text-xs text-foreground whitespace-pre-wrap">{outputs.privateReply.text}</p>
        </div>
      )}

      {outputs.linkDelivery && (
        <div
          className="rounded-lg border bg-emerald-500/5 border-emerald-500/20 p-3.5 space-y-2.5"
          data-testid="simulation-step-link-delivery"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <ExternalLink className="size-3.5" />
              </div>
              <span className="text-xs font-semibold text-foreground">Ação final: Link</span>
            </div>
            <Badge
              variant="secondary"
              className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            >
              Link de destino
            </Badge>
          </div>
          <div className="rounded border bg-background p-2.5 flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-foreground truncate">
              {outputs.linkDelivery.buttonText || 'Abrir link de destino'}
            </span>
            <Badge
              variant="outline"
              className="text-[10px] text-muted-foreground shrink-0 font-mono"
            >
              {outputs.linkDelivery.url}
            </Badge>
          </div>
        </div>
      )}

      {outputs.emailCapture && (
        <SimulationFollowerEmailCaptureSection
          execution={execution}
          prompt={outputs.emailCapture.prompt}
          isSubmittingEmail={isSubmittingEmail}
          emailCaptureError={emailCaptureError}
          onSubmitEmail={onSubmitEmail}
        />
      )}
    </>
  )
}
