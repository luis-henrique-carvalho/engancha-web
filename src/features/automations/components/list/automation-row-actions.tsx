import { useState } from 'react'
import { Play, MoreHorizontal, Pause, Trash2 } from 'lucide-react'
import type { Automation } from '@/types/api'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAutomationMutations } from '../../hooks/use-automation-mutations'

interface AutomationRowActionsProps {
  automation: Automation
  workspaceId?: string
}

export function AutomationRowActions({ automation, workspaceId = '' }: AutomationRowActionsProps) {
  const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { updateStatus, isUpdatingStatus, deleteAutomation, isDeleting } = useAutomationMutations(
    workspaceId,
    automation.id,
  )

  const isActive = automation.status === 'ACTIVE'

  const handleToggleStatus = async () => {
    await updateStatus(isActive ? 'PAUSED' : 'ACTIVE')
    setIsPauseDialogOpen(false)
  }

  const handleDelete = async () => {
    await deleteAutomation()
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-muted"
            aria-label="Abrir menu de ações"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[160px]"
        >
          {isActive ? (
            <DropdownMenuItem
              onClick={() => setIsPauseDialogOpen(true)}
              data-testid="automation-pause-action"
            >
              <Pause className="mr-2 size-4" />
              Pausar
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => void updateStatus('ACTIVE')}
              disabled={isUpdatingStatus}
              data-testid="automation-activate-action"
            >
              <Play className="mr-2 size-4" />
              Ativar
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <Trash2 className="mr-2 size-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={isPauseDialogOpen}
        onOpenChange={setIsPauseDialogOpen}
        title="Pausar automação"
        desc="Deseja pausar esta automação? Ela deixará de responder novos comentários e DMs imediatamente."
        confirmText="Pausar"
        cancelBtnText="Cancelar"
        destructive
        isLoading={isUpdatingStatus}
        handleConfirm={handleToggleStatus}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Excluir automação"
        desc="Tem certeza que deseja excluir esta automação? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelBtnText="Cancelar"
        destructive
        isLoading={isDeleting}
        handleConfirm={handleDelete}
      />
    </>
  )
}
