import type { AutomationAction } from '@engancha/contracts'
import { Link as LinkIcon, Mail, MessageSquare, Send, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  getFinalAction,
  getPrivateReplyText,
  getPublicReplyText,
  getTagAction,
} from '../../data/automation-action-mappers'
import type { AutomationStepId } from '../../data/automation-readiness'
import { FinalActionCardContent } from './summary-final-action-card-content'
import { SummaryCard } from './summary-card'

export interface SummaryActionCardsProps {
  actions: AutomationAction[]
  onNavigateStep?: (stepId: AutomationStepId) => void
}

export function SummaryActionCards({ actions, onNavigateStep }: SummaryActionCardsProps) {
  const publicReplyText = getPublicReplyText(actions)
  const privateReplyText = getPrivateReplyText(actions)
  const tagAction = getTagAction(actions)
  const finalAction = getFinalAction(actions)

  return (
    <>
      <SummaryCard
        stepId="public-reply"
        title="4. Resposta pública"
        icon={MessageSquare}
        testId="automation-review-summary-public-reply"
        editTestId="automation-review-edit-public-reply"
        onEdit={() => onNavigateStep?.('public-reply')}
      >
        {publicReplyText ? (
          <div className="rounded bg-muted/50 p-2.5 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
            {publicReplyText}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Nenhuma resposta pública configurada.
          </p>
        )}
      </SummaryCard>

      <SummaryCard
        stepId="direct-message"
        title="5. Mensagem direta (DM)"
        icon={Send}
        testId="automation-review-summary-direct-message"
        editTestId="automation-review-edit-direct-message"
        onEdit={() => onNavigateStep?.('direct-message')}
      >
        {privateReplyText ? (
          <div className="rounded bg-muted/50 p-2.5 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
            {privateReplyText}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Nenhuma mensagem direta configurada.
          </p>
        )}
      </SummaryCard>

      <SummaryCard
        stepId="final-action"
        title="6. Ação final"
        icon={finalAction?.type === 'CAPTURE_EMAIL' ? Mail : LinkIcon}
        testId="automation-review-summary-final-action"
        editTestId="automation-review-edit-final-action"
        onEdit={() => onNavigateStep?.('final-action')}
      >
        <FinalActionCardContent finalAction={finalAction} />
      </SummaryCard>

      <SummaryCard
        stepId="final-action"
        title="Tag do contato"
        icon={Tag}
        testId="automation-review-summary-tag"
        editTestId="automation-review-edit-tag"
        onEdit={() => onNavigateStep?.('final-action')}
      >
        {tagAction ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="font-mono text-xs"
              >
                {tagAction.name ? `#${tagAction.name}` : tagAction.tagId ? `#tag` : 'Tag ativa'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Aplicada ao contato quando esta automação é executada.
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">Nenhuma tag configurada.</p>
        )}
      </SummaryCard>
    </>
  )
}
