import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AutomationStatus } from '@/types/api'
import { toast } from 'sonner'
import { AutomationsApi } from '../services/automations-api'
import { automationsKeys } from '../services/automations-query-keys'

export function useAutomationMutations(workspaceId: string, automationId: string) {
  const queryClient = useQueryClient()

  const statusMutation = useMutation({
    mutationFn: (status: AutomationStatus) => AutomationsApi.updateStatus(automationId, status),
    onSuccess: (updatedAutomation) => {
      queryClient.setQueryData(automationsKeys.detail(workspaceId, automationId), updatedAutomation)
      void queryClient.invalidateQueries({ queryKey: automationsKeys.lists(workspaceId) })
      toast.success(`Automação atualizada para ${updatedAutomation.status}`)
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Não foi possível atualizar o status da automação',
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => AutomationsApi.delete(automationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: automationsKeys.lists(workspaceId) })
      toast.success('Automação excluída com sucesso')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Não foi possível excluir a automação')
    },
  })

  return {
    updateStatus: statusMutation.mutateAsync,
    isUpdatingStatus: statusMutation.isPending,
    publishAutomation: () => statusMutation.mutateAsync('ACTIVE'),
    isPublishing: statusMutation.isPending,
    pauseAutomation: () => statusMutation.mutateAsync('PAUSED'),
    isPausing: statusMutation.isPending,
    deleteAutomation: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    patchAutomation: async (_body?: any) => ({}) as any,
    isSaving: false,
  }
}
