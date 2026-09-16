import type { AutomationResponse } from '@engancha/contracts'
import { Hash, Image, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { AutomationStepId } from '../../data/automation-readiness'
import { AutomationStatusBadge } from '../shared/automation-status-badge'
import { SummaryCard } from './summary-card'
import { TargetCardContent } from './summary-target-card-content'

export interface SummaryBasicCardsProps {
  automation: AutomationResponse
  onNavigateStep?: (stepId: AutomationStepId) => void
}

export function SummaryBasicCards({ automation, onNavigateStep }: SummaryBasicCardsProps) {
  const current = automation.current ?? automation.draft ?? null

  return (
    <>
      <SummaryCard
        stepId="identification"
        title="1. Identificação"
        icon={Tag}
        testId="automation-review-summary-identification"
        editTestId="automation-review-edit-identification"
        onEdit={() => onNavigateStep?.('identification')}
      >
        <div className="text-base font-semibold truncate">
          {current?.name || (
            <span className="text-muted-foreground italic">Nome não informado</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <AutomationStatusBadge status={automation.status} />
          <span className="text-xs text-muted-foreground">Revisão #{current?.version ?? 1}</span>
        </div>
      </SummaryCard>

      <SummaryCard
        stepId="content"
        title="2. Conteúdo associado"
        icon={Image}
        testId="automation-review-summary-content"
        editTestId="automation-review-edit-content"
        onEdit={() => onNavigateStep?.('content')}
      >
        <TargetCardContent target={current?.target} />
      </SummaryCard>

      <SummaryCard
        stepId="keyword"
        title="3. Palavra-chave do gatilho"
        icon={Hash}
        testId="automation-review-summary-keyword"
        editTestId="automation-review-edit-keyword"
        onEdit={() => onNavigateStep?.('keyword')}
      >
        {current?.keyword ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Gatilho exato:</span>
              <Badge
                variant="secondary"
                className="font-mono text-xs"
              >
                {current.keyword}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Aciona quando o comentário no post contiver este termo.
            </p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground italic">Nenhuma palavra-chave configurada.</p>
        )}
      </SummaryCard>
    </>
  )
}
