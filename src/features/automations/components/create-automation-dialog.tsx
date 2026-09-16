import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Instagram, Image as ImageIcon, Video, AlertCircle, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { ChannelsApi } from '@/features/channels/services/channels-api'
import { AutomationsApi } from '../services/automations-api'
import { automationsKeys } from '../services/automations-query-keys'
import type { ChannelMedia, CreateAutomationRequest, MediaType } from '@/types/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface CreateAutomationDialogProps {
  workspaceId: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function CreateAutomationDialog({
  workspaceId,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}: CreateAutomationDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = isControlled ? setControlledOpen! : setUncontrolledOpen

  const queryClient = useQueryClient()

  // Form State
  const [selectedConnectionId, setSelectedConnectionId] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<ChannelMedia | null>(null)
  const [name, setName] = useState('')
  const [keywordsText, setKeywordsText] = useState('')
  const [publicReplyText, setPublicReplyText] = useState('')
  const [privateReplyText, setPrivateReplyText] = useState('')
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Channels
  const { data: channelsData, isLoading: loadingChannels } = useQuery({
    queryKey: ['channels-connections'],
    queryFn: () => ChannelsApi.listConnections(),
    enabled: open,
  })

  // Media
  const { data: mediaData, isLoading: loadingMedia } = useQuery({
    queryKey: ['channels-media', selectedConnectionId],
    queryFn: () => ChannelsApi.listEligibleMedia(selectedConnectionId, 25),
    enabled: Boolean(selectedConnectionId),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateAutomationRequest) => AutomationsApi.create(data),
    onSuccess: () => {
      toast.success('Automação criada com sucesso!')
      void queryClient.invalidateQueries({ queryKey: automationsKeys.lists(workspaceId) })
      setOpen(false)
      resetForm()
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Falha ao criar automação.')
    },
  })

  const resetForm = () => {
    setSelectedConnectionId('')
    setSelectedMedia(null)
    setName('')
    setKeywordsText('')
    setPublicReplyText('')
    setPrivateReplyText('')
    setStep(1)
  }

  const handleCreate = () => {
    if (!selectedConnectionId || !selectedMedia) {
      toast.error('Selecione um canal e uma mídia.')
      return
    }
    if (!name.trim()) {
      toast.error('Informe um nome para a automação.')
      return
    }
    const keywords = keywordsText
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)

    if (keywords.length === 0) {
      toast.error('Informe ao menos uma palavra-chave.')
      return
    }

    createMutation.mutate({
      channelConnectionId: selectedConnectionId,
      name: name.trim(),
      externalMediaId: selectedMedia.externalId,
      mediaType: selectedMedia.mediaType,
      keywords,
      publicReplyText: publicReplyText.trim(),
      privateReplyText: privateReplyText.trim(),
    })
  }

  const channels = channelsData?.items ?? []
  const mediaList = mediaData?.items ?? []

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (!val) resetForm()
      }}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Automação do Instagram</DialogTitle>
          <DialogDescription>
            {step === 1 && 'Etapa 1: Selecione a conta do Instagram e o post/reel alvo.'}
            {step === 2 && 'Etapa 2: Defina as palavras-chave de gatilho.'}
            {step === 3 && 'Etapa 3: Configure as respostas pública e privada.'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Canal Conectado</Label>
              {loadingChannels ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" /> Carregando contas...
                </div>
              ) : channels.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Nenhuma conta do Instagram conectada neste workspace.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href="/channels">Ir para Canais</a>
                  </Button>
                </div>
              ) : (
                <Select
                  value={selectedConnectionId}
                  onValueChange={(val) => {
                    setSelectedConnectionId(val)
                    setSelectedMedia(null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma conta profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {channels.map((c) => (
                      <SelectItem
                        key={c.id}
                        value={c.id}
                      >
                        {c.accountName} ({c.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedConnectionId && (
              <div className="space-y-2">
                <Label>Publicação ou Reel Elegível</Label>
                {loadingMedia ? (
                  <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                    <Loader2 className="size-6 animate-spin me-2" /> Buscando mídias na Meta...
                  </div>
                ) : mediaList.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    Nenhuma mídia encontrada para esta conta.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1">
                    {mediaList.map((m) => {
                      const isSelected = selectedMedia?.externalId === m.externalId
                      return (
                        <div
                          key={m.externalId}
                          onClick={() => setSelectedMedia(m)}
                          className={`group relative cursor-pointer rounded-lg border p-2 transition-all hover:border-primary ${
                            isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : ''
                          }`}
                        >
                          <div className="aspect-square w-full rounded bg-muted overflow-hidden flex items-center justify-center relative">
                            {m.thumbnailUrl ? (
                              <img
                                src={m.thumbnailUrl}
                                alt={m.caption}
                                className="h-full w-full object-cover"
                              />
                            ) : m.mediaType === 'REEL' ? (
                              <Video className="size-8 text-muted-foreground" />
                            ) : (
                              <ImageIcon className="size-8 text-muted-foreground" />
                            )}
                            <Badge
                              variant="secondary"
                              className="absolute bottom-1 right-1 text-[10px] px-1 py-0"
                            >
                              {m.mediaType}
                            </Badge>
                          </div>
                          <p
                            className="mt-1 text-xs text-muted-foreground line-clamp-2"
                            title={m.caption}
                          >
                            {m.caption || 'Sem legenda'}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="auto-name">Nome da Automação</Label>
              <Input
                id="auto-name"
                placeholder="Ex: Campanha Reels Março"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auto-keywords">
                Palavras-chave de Gatilho (separadas por vírgula)
              </Label>
              <Input
                id="auto-keywords"
                placeholder="Ex: quero, eu quero, preco, cupom"
                value={keywordsText}
                onChange={(e) => setKeywordsText(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Quando um usuário comentar qualquer uma destas palavras, a automação responderá.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="auto-public">Resposta Pública (Comentário)</Label>
              <Textarea
                id="auto-public"
                placeholder="Ex: Te mandei uma mensagem no Direct! Dá uma olhada lá 😉"
                rows={3}
                value={publicReplyText}
                onChange={(e) => setPublicReplyText(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Comentário público respondido na publicação.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="auto-private">Resposta Privada (Direct Message)</Label>
              <Textarea
                id="auto-private"
                placeholder="Ex: Olá! Aqui está o link exclusivo que você pediu: https://..."
                rows={4}
                value={privateReplyText}
                onChange={(e) => setPrivateReplyText(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Mensagem enviada automaticamente no direct do usuário.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between sm:justify-between pt-4 border-t">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep((s) => (s - 1) as any)}
            >
              Voltar
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              onClick={() => {
                if (step === 1 && (!selectedConnectionId || !selectedMedia)) {
                  toast.error('Selecione uma conta e uma publicação.')
                  return
                }
                if (step === 2 && (!name.trim() || !keywordsText.trim())) {
                  toast.error('Preencha o nome e ao menos uma palavra-chave.')
                  return
                }
                setStep((s) => (s + 1) as any)
              }}
            >
              Avançar
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending && <Loader2 className="me-2 size-4 animate-spin" />}
              Criar e Salvar Automação
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
