import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AutomationStepId } from '../../data/automation-readiness'

export interface SummaryCardProps {
  stepId: AutomationStepId
  title: string
  icon: React.ComponentType<{ className?: string }>
  testId: string
  editTestId: string
  onEdit?: () => void
  children: React.ReactNode
}

export function SummaryCard({
  title,
  icon: Icon,
  testId,
  editTestId,
  onEdit,
  children,
}: SummaryCardProps) {
  return (
    <Card data-testid={testId}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary shrink-0" />
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          data-testid={editTestId}
          onClick={onEdit}
        >
          Editar
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  )
}
