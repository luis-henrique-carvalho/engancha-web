import { createFileRoute } from '@tanstack/react-router'
import type { AutomationStatus } from '@/types/api'
import type { ListAutomationsParams } from '@/features/automations/services/automations-api'
import { WorkspaceShell } from '@/features/workspaces/workspace-shell'
import { AutomationsHeader } from '@/features/automations/components'

function selectedStatuses(value: unknown): AutomationStatus[] | undefined {
  const allowed: AutomationStatus[] = ['ACTIVE', 'DRAFT', 'PAUSED', 'ARCHIVED']
  const values = Array.isArray(value) ? value : [value]
  const selected = values.filter(
    (item): item is AutomationStatus =>
      typeof item === 'string' && allowed.includes(item as AutomationStatus),
  )
  return selected.length ? selected : undefined
}

export const Route = createFileRoute('/_authenticated/automations/')({
  validateSearch: (search: Record<string, unknown>): ListAutomationsParams => ({
    page: typeof search.page === 'number' ? search.page : 1,
    limit: typeof search.limit === 'number' ? search.limit : 20,
    query: typeof search.query === 'string' ? search.query : undefined,
    status: selectedStatuses(search.status),
  }),
  component: AutomationsIndexPage,
})

import { AutomationsPageContent } from '@/features/automations/components/automations-page-content'

function AutomationsIndexPage() {
  const params = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <WorkspaceShell
      header={<AutomationsHeader />}
      mainClassName="flex flex-1 flex-col gap-4 sm:gap-6"
    >
      {(workspace) => (
        <AutomationsPageContent
          workspaceId={workspace.id}
          params={params}
          navigate={navigate}
        />
      )}
    </WorkspaceShell>
  )
}
