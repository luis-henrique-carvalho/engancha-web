import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  useAutomationEditor,
  SimulationFollowerChat,
  SimulationTestForm,
  type SimulationContentInfo,
} from '../components'
import { AutomationTestStatusCard } from '../components/simulation/automation-test-status-card'
import { useSimulationExecution } from '../hooks/use-simulation-execution'

export interface AutomationTestTabViewProps {
  automationId: string
}

export function AutomationTestTabView({ automationId }: AutomationTestTabViewProps) {
  const { automation } = useAutomationEditor()

  const {
    execution,
    isLoading,
    isSubmitting,
    isRetrying,
    isSubmittingEmail,
    isReconnecting,
    connectionStatus,
    error,
    emailCaptureError,
    submitComment,
    submitEmailResponse,
    retry,
    reset,
  } = useSimulationExecution()

  if (automation.status === 'DRAFT' || automation.status === 'PAUSED') {
    return (
      <AutomationTestStatusCard
        status={automation.status}
        automationId={automationId}
      />
    )
  }

  const publishedRevision = automation.published
  const targetContent = publishedRevision?.target

  if (!publishedRevision || !targetContent) {
    return (
      <Alert
        variant="destructive"
        data-testid="automation-test-no-target-alert"
      >
        <AlertCircle className="size-4" />
        <AlertTitle>Nenhum conteúdo vinculado</AlertTitle>
        <AlertDescription className="text-xs">
          A versão publicada não possui uma publicação vinculada para simulação. Configure a etapa
          de conteúdo e publique uma nova versão.
        </AlertDescription>
      </Alert>
    )
  }

  const contentInfo: SimulationContentInfo = {
    id: targetContent.id,
    externalId: targetContent.externalContentId,
    title: targetContent.title,
    type: targetContent.contentType,
  }

  const handleFormSubmit = async (values: { author: string; text: string; commentId?: string }) => {
    await submitComment({
      contentId: targetContent.id,
      provider: 'INSTAGRAM',
      author: values.author,
      text: values.text,
      commentId: values.commentId,
      originAutomationId: automationId,
    })
  }

  return (
    <div
      className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start"
      data-testid="automation-test-tab-view"
    >
      <div className="lg:col-span-5">
        <SimulationTestForm
          content={contentInfo}
          isSubmitting={isSubmitting}
          onSubmit={handleFormSubmit}
        />
      </div>

      <div className="lg:col-span-7">
        <SimulationFollowerChat
          execution={execution}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          isRetrying={isRetrying}
          isSubmittingEmail={isSubmittingEmail}
          isReconnecting={isReconnecting}
          connectionStatus={connectionStatus}
          error={error}
          emailCaptureError={emailCaptureError}
          onSubmitEmail={submitEmailResponse}
          onRetry={retry}
          onReset={reset}
        />
      </div>
    </div>
  )
}
