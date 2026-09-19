import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ChannelsApi } from '@/features/channels/services/channels-api'
import { AutomationsApi } from '../services/automations-api'
import { automationsKeys } from '../services/automations-query-keys'
import type { CreateAutomationRequest } from '@/types/api'
import { useCreateAutomationFormState } from './use-create-automation-form-state'

export function useCreateAutomationDialog(
  workspaceId: string,
  open: boolean,
  setOpen: (open: boolean) => void,
) {
  const queryClient = useQueryClient()
  const formState = useCreateAutomationFormState()

  const { data: channelsData, isLoading: loadingChannels } = useQuery({
    queryKey: ['channels-connections'],
    queryFn: () => ChannelsApi.listConnections(),
    enabled: open,
  })

  const { data: mediaData, isLoading: loadingMedia } = useQuery({
    queryKey: ['channels-media', formState.selectedConnectionId],
    queryFn: () => ChannelsApi.listEligibleMedia(formState.selectedConnectionId, 50),
    enabled: Boolean(formState.selectedConnectionId),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateAutomationRequest) => AutomationsApi.create(data),
    onSuccess: () => {
      toast.success('Automação criada com sucesso!')
      void queryClient.invalidateQueries({ queryKey: automationsKeys.lists(workspaceId) })
      setOpen(false)
      formState.resetForm()
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Falha ao criar automação.')
    },
  })

  const handleNextStep = () => {
    if (formState.step === 1 && (!formState.selectedConnectionId || !formState.selectedMedia)) {
      toast.error('Selecione uma conta e uma publicação.')
      return
    }
    formState.setStep(2)
  }

  const handleCreate = () => {
    if (!formState.name.trim()) {
      toast.error('Informe o nome da automação.')
      return
    }
    if (formState.keywords.length === 0) {
      toast.error('Adicione ao menos uma palavra-chave de gatilho.')
      return
    }
    if (!formState.publicReplyText.trim() && !formState.privateReplyText.trim()) {
      toast.error('Preencha ao menos uma resposta (pública ou privada).')
      return
    }

    const payload = formState.buildPayload()
    if (!payload) {
      toast.error('Preencha todos os campos obrigatórios.')
      return
    }
    createMutation.mutate(payload)
  }

  const activeChannels = (channelsData?.items ?? []).filter((c) => c.status === 'ACTIVE')
  const selectedChannel =
    (channelsData?.items ?? []).find((c) => c.id === formState.selectedConnectionId) ?? null

  return {
    ...formState,
    channels: activeChannels,
    allChannels: channelsData?.items ?? [],
    selectedChannel,
    loadingChannels,
    mediaList: mediaData?.items ?? [],
    loadingMedia,
    createMutation,
    handleNextStep,
    handleCreate,
  }
}
