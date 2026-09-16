import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { ArrowLeft, Info } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AutomationEditorProvider } from '../components/shared/automation-editor-provider'
import { AutomationStatusBadge } from '../components/shared/automation-status-badge'
import { AutomationStepNav } from '../components/shared/automation-step-nav'
import { AutomationEditorLoading } from '../components/shared/automation-editor-loading'
import { AutomationEditorNotFound } from '../components/shared/automation-editor-not-found'
import { AutomationEditorArchived } from '../components/shared/automation-editor-archived'
import { AutomationDetailTabs } from '../components/shared/automation-detail-tabs'
import { useAutomation } from '../hooks/use-automation'

interface AutomationEditorLayoutViewProps {
  workspaceId: string
  automationId: string
  children?: React.ReactNode
}

export function AutomationEditorLayoutView({
  workspaceId,
  automationId,
  children,
}: AutomationEditorLayoutViewProps) {
  const { data: automation, isLoading, isError } = useAutomation(workspaceId, automationId)
  const { pathname } = useLocation()

  if (isLoading) return <AutomationEditorLoading />
  if (isError || !automation) return <AutomationEditorNotFound />
  if (automation.status === 'ARCHIVED') return <AutomationEditorArchived />

  const name =
    (automation as any).name || (automation as any).current?.name?.trim() || 'Rascunho de automação'
  const isTestTab = pathname.endsWith('/test')
  const isActivityTab = pathname.endsWith('/activity')
  const isConfigTab = !isTestTab && !isActivityTab

  return (
    <AutomationEditorProvider
      workspaceId={workspaceId}
      automationId={automationId}
      automation={automation}
    >
      <div
        className="space-y-6"
        data-testid="automation-editor-layout"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label="Voltar para a listagem"
            >
              <Link
                to="/automations"
                search={{ page: 1, limit: 20 }}
              >
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2.5">
                <h2
                  className="text-2xl font-bold tracking-tight"
                  data-testid="automation-editor-title"
                >
                  {name}
                </h2>
                <AutomationStatusBadge
                  status={automation.status}
                  hasUnpublishedChanges={(automation as any).hasUnpublishedChanges}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Configure cada etapa antes de publicar no canal.
              </p>
            </div>
          </div>
        </div>

        {automation.status === 'ACTIVE' && (automation as any).hasUnpublishedChanges && (
          <Alert
            className="border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200"
            data-testid="automation-active-unpublished-banner"
          >
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle>Alterações não publicadas</AlertTitle>
            <AlertDescription className="text-xs">
              Esta automação está ativa com alterações pendentes de publicação. A versão anterior
              continua ativa no canal até que uma nova versão seja publicada.
            </AlertDescription>
          </Alert>
        )}

        <AutomationDetailTabs
          automationId={automationId}
          isConfigTab={isConfigTab}
          isTestTab={isTestTab}
          isActivityTab={isActivityTab}
        />

        {isConfigTab ? (
          <div className="flex flex-1 flex-col space-y-6 md:space-y-6 lg:flex-row lg:space-y-0 lg:space-x-8">
            <aside className="top-0 shrink-0 lg:sticky lg:w-60">
              <AutomationStepNav automationId={automationId} />
            </aside>
            <div className="min-w-0 flex-1">{children ?? <Outlet />}</div>
          </div>
        ) : (
          <div
            className="min-w-0 flex-1"
            data-testid="automation-tab-content"
          >
            {children ?? <Outlet />}
          </div>
        )}
      </div>
    </AutomationEditorProvider>
  )
}
