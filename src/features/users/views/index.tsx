import { UsersDialogs } from '../components/users-dialogs'
import { UsersProvider } from '../components/users-provider'
import { UsersTable } from '../components/users-table'
import { UsersHeader } from '../components/users-header'
import { useUsersList } from '../hooks/use-users'
import { userUiSchema } from '../data/schema'
import type { ListUsersParams } from '../services/users-api'

export type UsersViewProps = {
  canManage: boolean
  workspaceId: string
  params: ListUsersParams
  onParamsChange: (params: ListUsersParams) => void
}

export function UsersView({ canManage, workspaceId, params, onParamsChange }: UsersViewProps) {
  const members = useUsersList(workspaceId, params, canManage)
  const users = userUiSchema.array().parse(members.data?.items ?? [])

  if (!canManage) return null

  return (
    <UsersProvider workspaceId={workspaceId}>
      <UsersHeader />

      <UsersTable
        data={users}
        isLoading={members.isLoading}
        meta={
          members.data?.meta ?? {
            page: params.page ?? 1,
            limit: params.limit ?? 20,
            total: 0,
            totalPages: 0,
          }
        }
        filters={params}
        onFiltersChange={(filters) => onParamsChange({ ...params, ...filters, page: 1 })}
        onPageChange={(page) => onParamsChange({ ...params, page })}
        onPageSizeChange={(limit) => onParamsChange({ ...params, limit, page: 1 })}
      />

      <UsersDialogs />
    </UsersProvider>
  )
}
