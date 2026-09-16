import { createFileRoute } from '@tanstack/react-router'
import { ContactsHeader } from '@/features/contacts/components/contacts-header'
import { ContactsListView } from '@/features/contacts/views'
import { WorkspaceShell } from '@/features/workspaces/workspace-shell'
import type { ListContactsParams } from '@/features/contacts/services/contacts-api'

export const Route = createFileRoute('/_authenticated/contacts')({
  validateSearch: (search: Record<string, unknown>): Partial<ListContactsParams> => ({
    page: typeof search.page === 'number' ? search.page : 1,
    limit: typeof search.limit === 'number' ? search.limit : 20,
    query: typeof search.query === 'string' ? search.query : undefined,
    provider: Array.isArray(search.provider)
      ? (search.provider as string[])
      : typeof search.provider === 'string'
        ? [search.provider]
        : undefined,
  }),
  component: ContactsPage,
})

function ContactsPage() {
  const params = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <WorkspaceShell
      header={<ContactsHeader />}
      mainClassName="flex flex-1 flex-col gap-4 sm:gap-6"
    >
      {(workspace) => (
        <ContactsListView
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
