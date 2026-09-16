import { useQuery } from '@tanstack/react-query'
import { AutomationsApi, type ListAutomationsParams } from '../services/automations-api'
import { automationsKeys } from '../services/automations-query-keys'

export function useAutomationsList(
  workspaceId: string,
  params: ListAutomationsParams = { page: 1, limit: 20 },
) {
  return useQuery({
    queryKey: automationsKeys.list(workspaceId, params),
    queryFn: () => AutomationsApi.list(params),
    enabled: Boolean(workspaceId),
  })
}
