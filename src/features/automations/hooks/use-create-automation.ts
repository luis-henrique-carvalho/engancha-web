import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateAutomationRequest } from '@/types/api'
import { AutomationsApi } from '../services/automations-api'
import { automationsKeys } from '../services/automations-query-keys'

export function useCreateAutomation(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateAutomationRequest) => AutomationsApi.create(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: automationsKeys.lists(workspaceId) })
    },
  })
}
