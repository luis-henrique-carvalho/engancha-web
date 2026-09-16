import { useQuery } from '@tanstack/react-query'
import { UsersApi, type ListUsersParams } from '../services/users-api'
import { usersQueryKeys } from '../services/users-query-keys'

export function useUsersList(workspaceId: string, params: ListUsersParams, enabled: boolean) {
  return useQuery({
    queryKey: usersQueryKeys.list(workspaceId, params),
    queryFn: () => UsersApi.list(params),
    enabled,
  })
}
