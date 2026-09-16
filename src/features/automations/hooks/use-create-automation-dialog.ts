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
    queryFn: () => ChannelsApi.listEligibleMedia(formState.selectedConnectionId, 25),
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
    if (formState.step === 2 && (!formState.name.trim() || !formState.keywordsText.trim())) {
      toast.error('Preencha o nome e ao menos uma palavra-chave.')
      return
    }
    formState.setStep((s) => (s + 1) as 1 | 2 | 3)
  }

  const handleCreate = () => {
    if (!formState.selectedConnectionId || !formState.selectedMedia) {
      toast.error('Selecione um canal e uma mídia.')
      return
    }
    const name = formState.name.trim()
    if (!name) {
      toast.error('Informe um nome para a automação.')
      return
    }
    const keywords = formState.keywordsText
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)

    if (keywords.length === 0) {
      toast.error('Informe ao menos uma palavra-chave.')
      return
    }

    createMutation.mutate({
      channelConnectionId: formState.selectedConnectionId,
      name,
      externalMediaId: formState.selectedMedia.externalId,
      mediaType: formState.selectedMedia.mediaType,
      keywords,
      publicReplyText: formState.publicReplyText.trim(),
      privateReplyText: formState.privateReplyText.trim(),
    })
  }

  return {
    ...formState,
    channels: channelsData?.items ?? [],
    loadingChannels,
    mediaList: mediaData?.items ?? [],
    loadingMedia,
    createMutation,
    handleNextStep,
    handleCreate,
  }
}
