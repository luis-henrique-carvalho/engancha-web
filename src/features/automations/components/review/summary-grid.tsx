import type { AutomationResponse } from '@engancha/contracts'
import type { AutomationStepId } from '../../data/automation-readiness'
import { SummaryActionCards } from './summary-action-cards'
import { SummaryBasicCards } from './summary-basic-cards'

export interface SummaryGridProps {
  automation: AutomationResponse
  onNavigateStep?: (stepId: AutomationStepId) => void
}

export function SummaryGrid({ automation, onNavigateStep }: SummaryGridProps) {
  const current = automation.current ?? automation.draft ?? null
  const actions = current?.actions ?? []

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <SummaryBasicCards
        automation={automation}
        onNavigateStep={onNavigateStep}
      />
      <SummaryActionCards
        actions={actions}
        onNavigateStep={onNavigateStep}
      />
    </div>
  )
}
