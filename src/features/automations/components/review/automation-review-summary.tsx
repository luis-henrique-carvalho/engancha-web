import type { AutomationResponse } from '@engancha/contracts'
import type { AutomationStepId } from '../../data/automation-readiness'
import { SummaryGrid } from './summary-grid'

export interface AutomationReviewSummaryProps {
  automation: AutomationResponse
  onNavigateStep?: (stepId: AutomationStepId) => void
}

export function AutomationReviewSummary({
  automation,
  onNavigateStep,
}: AutomationReviewSummaryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold tracking-tight text-foreground">
        Resumo consolidado da automação
      </h3>

      <SummaryGrid
        automation={automation}
        onNavigateStep={onNavigateStep}
      />
    </div>
  )
}
