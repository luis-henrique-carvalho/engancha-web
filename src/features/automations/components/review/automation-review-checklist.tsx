import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AutomationReadinessResult, AutomationStepId } from '../../data/automation-readiness'
import { AutomationReviewChecklistItem } from './automation-review-checklist-item'

export interface AutomationReviewChecklistProps {
  readiness: AutomationReadinessResult
  onNavigateStep?: (stepId: AutomationStepId) => void
}

export function AutomationReviewChecklist({
  readiness,
  onNavigateStep,
}: AutomationReviewChecklistProps) {
  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Sparkles className="h-5 w-5 text-primary shrink-0" />
              Checklist de prontidão para publicação
            </CardTitle>
            <CardDescription>
              Revise os requisitos antes de ativar a automação no seu workspace.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={readiness.isReady ? 'default' : 'secondary'}
              data-testid="automation-readiness-badge"
            >
              {readiness.completedCount} de {readiness.totalCount} etapas preenchidas
            </Badge>
            <span
              className={cn(
                'text-xs font-medium',
                readiness.isReady ? 'text-primary' : 'text-amber-600 dark:text-amber-400',
              )}
              data-testid="automation-readiness-status"
            >
              {readiness.isReady ? 'Pronta para publicação' : 'Pendências encontradas'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {readiness.items.map((item) => (
            <AutomationReviewChecklistItem
              key={item.id}
              item={item}
              onNavigateStep={onNavigateStep}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
