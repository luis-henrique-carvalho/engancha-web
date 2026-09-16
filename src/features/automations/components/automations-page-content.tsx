import { useState } from 'react'
import type { ListAutomationsParams } from '../services/automations-api'
import { AutomationsListView } from '../views/automations-list-view'
import { CreateAutomationDialog } from './create-automation-dialog'

export interface AutomationsPageContentProps {
  workspaceId: string
  params: ListAutomationsParams
  navigate: (opts: any) => Promise<void>
}

export function AutomationsPageContent({
  workspaceId,
  params,
  navigate,
}: AutomationsPageContentProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  return (
    <>
      <AutomationsListView
        workspaceId={workspaceId}
        params={params}
        onParamsChange={(next) =>
          void navigate({
            search: {
              page: next.page,
              limit: next.limit,
              query: next.query,
              status: next.status,
            },
          })
        }
        onCreateClick={() => setCreateDialogOpen(true)}
      />

      <CreateAutomationDialog
        workspaceId={workspaceId}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  )
}
