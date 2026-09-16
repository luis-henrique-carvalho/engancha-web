import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useCreateAutomationDialog } from '../hooks/use-create-automation-dialog'
import { CreateAutomationStep1 } from './create-automation-step-1'
import { CreateAutomationStep2 } from './create-automation-step-2'
import { CreateAutomationStep3 } from './create-automation-step-3'
import { CreateAutomationFooter } from './create-automation-footer'

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

  const {
    selectedConnectionId,
    setSelectedConnectionId,
    selectedMedia,
    setSelectedMedia,
    name,
    setName,
    keywordsText,
    setKeywordsText,
    publicReplyText,
    setPublicReplyText,
    privateReplyText,
    setPrivateReplyText,
    step,
    setStep,
    channels,
    selectedChannel,
    loadingChannels,
    mediaList,
    loadingMedia,
    createMutation,
    resetForm,
    handleNextStep,
    handleCreate,
  } = useCreateAutomationDialog(workspaceId, open, setOpen)

  const dialogTitle = selectedChannel
    ? `Nova Automação — ${selectedChannel.accountName}`
    : 'Nova Automação'

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
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {step === 1 && 'Etapa 1: Selecione a conta conectada e o conteúdo alvo.'}
            {step === 2 && 'Etapa 2: Defina as palavras-chave de gatilho.'}
            {step === 3 && 'Etapa 3: Configure as respostas pública e privada.'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <CreateAutomationStep1
            channels={channels}
            loadingChannels={loadingChannels}
            selectedConnectionId={selectedConnectionId}
            onSelectConnectionId={(val) => {
              setSelectedConnectionId(val)
              setSelectedMedia(null)
            }}
            mediaList={mediaList}
            loadingMedia={loadingMedia}
            selectedMedia={selectedMedia}
            onSelectMedia={setSelectedMedia}
          />
        )}

        {step === 2 && (
          <CreateAutomationStep2
            name={name}
            onNameChange={setName}
            keywordsText={keywordsText}
            onKeywordsChange={setKeywordsText}
          />
        )}

        {step === 3 && (
          <CreateAutomationStep3
            publicReplyText={publicReplyText}
            onPublicReplyChange={setPublicReplyText}
            privateReplyText={privateReplyText}
            onPrivateReplyChange={setPrivateReplyText}
          />
        )}

        <CreateAutomationFooter
          step={step}
          isPending={createMutation.isPending}
          onBack={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
          onNext={handleNextStep}
          onCreate={handleCreate}
        />
      </DialogContent>
    </Dialog>
  )
}
