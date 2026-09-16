import { useState } from 'react'
import type { ContentResponse } from '@engancha/contracts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCreateSimulatedContent } from '../../hooks/use-create-simulated-content'
import { SimulatedContentFormFields } from './simulated-content-form-fields'

interface CreateSimulatedContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  onCreated?: (content: ContentResponse) => void
}

export function CreateSimulatedContentDialog({
  open,
  onOpenChange,
  workspaceId,
  onCreated,
}: CreateSimulatedContentDialogProps) {
  const [title, setTitle] = useState('')
  const [externalContentId, setExternalContentId] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { createSimulatedContent, isCreating } = useCreateSimulatedContent(workspaceId)

  const handleClose = () => {
    setTitle('')
    setExternalContentId('')
    setError(null)
    onOpenChange(false)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const trimmedTitle = title.trim()
    const trimmedId = externalContentId.trim()

    if (!trimmedTitle) {
      setError('O título do conteúdo é obrigatório.')
      return
    }

    if (!trimmedId) {
      setError('O identificador externo do post é obrigatório.')
      return
    }

    try {
      const created = await createSimulatedContent({
        title: trimmedTitle,
        externalContentId: trimmedId,
        provider: 'INSTAGRAM',
        mode: 'SIMULATED',
        contentType: 'POST',
      })

      handleClose()
      onCreated?.(created)
    } catch {
      // Error handled by mutation hook via toast
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => (!val ? handleClose() : onOpenChange(val))}
    >
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Criar conteúdo simulado</DialogTitle>
          <DialogDescription>
            Cadastre uma publicação ou reel simulado para associar e testar sua automação.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <SimulatedContentFormFields
            title={title}
            onTitleChange={setTitle}
            externalContentId={externalContentId}
            onExternalContentIdChange={setExternalContentId}
            error={error}
          />

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              data-testid="submit-create-simulated-content"
              disabled={isCreating}
            >
              {isCreating ? 'Criando…' : 'Criar conteúdo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
