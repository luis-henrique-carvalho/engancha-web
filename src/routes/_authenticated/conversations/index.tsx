import { createFileRoute } from '@tanstack/react-router'
import { ConversationsHeader } from '@/features/conversations/components/conversations-list-header'
import { ConversationsListView } from '@/features/conversations/views'
import { WorkspaceShell } from '@/features/workspaces/workspace-shell'
import type { ListConversationsParams } from '@/features/conversations/services/conversations-api'
import type { ConversationStatus } from '@/types/api'

export const Route = createFileRoute('/_authenticated/conversations/')({
  validateSearch: (search: Record<string, unknown>): Partial<ListConversationsParams> => ({
    page: typeof search.page === 'number' ? search.page : 1,
    limit: typeof search.limit === 'number' ? search.limit : 20,
    query: typeof search.query === 'string' ? search.query : undefined,
    status:
      search.status === 'OPEN' || search.status === 'CLOSED'
        ? [search.status as ConversationStatus]
        : Array.isArray(search.status)
          ? (search.status as ConversationStatus[])
          : undefined,
    automationId: typeof search.automationId === 'string' ? search.automationId : undefined,
    startDate: typeof search.startDate === 'string' ? search.startDate : undefined,
    endDate: typeof search.endDate === 'string' ? search.endDate : undefined,
  }),
  component: ConversationsPage,
})

function ConversationsPage() {
  const params = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <WorkspaceShell
      header={<ConversationsHeader />}
      mainClassName="flex flex-1 flex-col gap-4 sm:gap-6"
    >
      {(workspace) => (
        <ConversationsListView
          workspaceId={workspace.id}
          params={params}
          onParamsChange={(next) =>
            void navigate({
              search: next,
            })
          }
        />
      )}
    </WorkspaceShell>
  )
}
