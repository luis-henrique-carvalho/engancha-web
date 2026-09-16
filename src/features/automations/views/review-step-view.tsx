import { useState } from 'react'
import type { AutomationResponse } from '@engancha/contracts'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { AutomationReview, AutomationStepSection } from '../components'
import type { AutomationStepId } from '../data/automation-readiness'
import { useAutomationMutations } from '../hooks/use-automation-mutations'
import { useStepViewContext } from '../hooks/use-step-view-context'
import { useReviewStepPublish } from '../hooks/use-review-step-publish'

export interface ReviewStepViewProps {
  workspaceId?: string
  automationId?: string
  automation?: AutomationResponse
  onNavigateStep?: (stepId: AutomationStepId) => void
  onPublished?: () => void
  onPaused?: () => void
}

export function ReviewStepView({
  workspaceId: propWorkspaceId,
  automationId: propAutomationId,
  automation: propAutomation,
  onNavigateStep: propOnNavigateStep,
  onPublished: propOnPublished,
  onPaused: propOnPaused,
}: ReviewStepViewProps = {}) {
  const { workspaceId, automationId, activeAutomation, navigate } = useStepViewContext({
    workspaceId: propWorkspaceId,
    automationId: propAutomationId,
    automation: propAutomation,
  })

  const { publishAutomation, isPublishing, pauseAutomation, isPausing } = useAutomationMutations(
    workspaceId,
    automationId,
  )

  const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false)
  const { publishIssues, publishErrorMessage, handlePublish } = useReviewStepPublish(
    publishAutomation,
    propOnPublished,
  )

  const handleNavigateStep = (stepId: AutomationStepId) => {
    if (propOnNavigateStep) {
      propOnNavigateStep(stepId)
      return
    }

    void navigate({
      to: `/automations/$automationId/${stepId}`,
      params: { automationId },
    })
  }

  const handleConfirmPause = async () => {
    try {
      await pauseAutomation()
      setIsPauseDialogOpen(false)
      propOnPaused?.()
    } catch {
      // Handled by toast in useAutomationMutations
    }
  }

  if (!activeAutomation) {
    return (
      <AutomationStepSection
        title="Revisão e publicação"
        description="Valide a integridade do fluxo e publique a automação."
      >
        <div className="text-sm text-muted-foreground">Carregando automação...</div>
      </AutomationStepSection>
    )
  }

  return (
    <>
      <AutomationStepSection
        title="Revisão e publicação"
        description="Valide a integridade do fluxo e publique a automação."
      >
        <AutomationReview
          automation={activeAutomation}
          workspaceId={workspaceId}
          automationId={automationId}
          onNavigateStep={handleNavigateStep}
          onPublish={handlePublish}
          onPause={() => setIsPauseDialogOpen(true)}
          isPublishing={isPublishing}
          isPausing={isPausing}
          publishIssues={publishIssues}
          publishErrorMessage={publishErrorMessage}
        />
      </AutomationStepSection>

      <ConfirmDialog
        open={isPauseDialogOpen}
        onOpenChange={setIsPauseDialogOpen}
        title="Pausar automação"
        desc="Deseja pausar esta automação? Ela deixará de responder novos comentários e DMs imediatamente."
        confirmText="Pausar"
        cancelBtnText="Cancelar"
        destructive
        isLoading={isPausing}
        handleConfirm={handleConfirmPause}
      />
    </>
  )
}
