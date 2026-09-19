import { createFileRoute } from '@tanstack/react-router'
import { AutomationsHeader } from '@/features/automations/components'
import { CreateAutomationPageView } from '@/features/automations/views/create-automation-page-view'
import { WorkspaceShell } from '@/features/workspaces/workspace-shell'

export const Route = createFileRoute('/_authenticated/automations/create')({
  component: CreateAutomationPage,
})

function CreateAutomationPage() {
  return (
    <WorkspaceShell
      header={<AutomationsHeader />}
      mainClassName="flex flex-1 flex-col gap-4 sm:gap-6"
    >
      {(workspace) => <CreateAutomationPageView workspaceId={workspace.id} />}
    </WorkspaceShell>
  )
}
