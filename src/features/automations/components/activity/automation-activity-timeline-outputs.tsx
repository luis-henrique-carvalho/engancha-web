import {
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Mail,
  MessageCircle,
  MessageSquare,
} from 'lucide-react'
import type { SimulationExecutionResponse } from '@engancha/contracts'
import type { extractSimulationOutputs } from '../../data/simulation-view-mappers'

export interface AutomationActivityTimelineOutputsProps {
  execution: SimulationExecutionResponse
  outputs: ReturnType<typeof extractSimulationOutputs>
}

export function AutomationActivityTimelineOutputs({
  execution,
  outputs,
}: AutomationActivityTimelineOutputsProps) {
  return (
    <>
      {outputs.publicReply && (
        <div className="relative">
          <div className="absolute -left-6 top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <MessageSquare className="size-2.5" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">Resposta pública simulada</p>
            <div className="rounded-md border bg-background p-2.5 text-xs text-foreground">
              {outputs.publicReply.text}
            </div>
          </div>
        </div>
      )}

      {outputs.privateReply && (
        <div className="relative">
          <div className="absolute -left-6 top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <MessageCircle className="size-2.5" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">Mensagem direta simulada (DM)</p>
            <div className="rounded-md border bg-background p-2.5 text-xs text-foreground">
              {outputs.privateReply.text}
            </div>
          </div>
        </div>
      )}

      {outputs.linkDelivery && (
        <div className="relative">
          <div className="absolute -left-6 top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ExternalLink className="size-2.5" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">Ação final: Entrega de link</p>
            <div className="flex items-center gap-2 rounded-md border bg-background p-2.5 text-xs text-primary">
              <span className="font-medium">
                {outputs.linkDelivery.buttonText || 'Acessar Link'}
              </span>
              <ArrowRight className="size-3" />
              <span className="text-muted-foreground truncate">{outputs.linkDelivery.url}</span>
            </div>
          </div>
        </div>
      )}

      {outputs.emailCapture && (
        <div className="relative">
          <div className="absolute -left-6 top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Mail className="size-2.5" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">Ação final: Solicitação de e-mail</p>
            <div className="rounded-md border bg-background p-2.5 text-xs text-foreground">
              <p className="font-medium mb-1">{outputs.emailCapture.prompt}</p>
              <p className="text-[11px] text-muted-foreground italic">
                Nota: A captura efetiva do endereço será realizada nas próximas fases.
              </p>
            </div>
          </div>
        </div>
      )}

      {execution.status === 'FAILED' && execution.error && (
        <div className="relative">
          <div className="absolute -left-6 top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
            <AlertCircle className="size-2.5" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-destructive">Motivo da falha</p>
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive">
              {execution.error.message}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
