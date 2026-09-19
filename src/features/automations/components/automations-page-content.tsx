import type { ListAutomationsParams } from '../services/automations-api'
import { AutomationsListView } from '../views/automations-list-view'

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
  return (
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
      onCreateClick={() => {
        void navigate({ to: '/automations/create' })
      }}
    />
  )
}
