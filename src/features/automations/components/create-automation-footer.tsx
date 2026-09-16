import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'

interface CreateAutomationFooterProps {
  step: 1 | 2 | 3
  isPending: boolean
  onBack: () => void
  onNext: () => void
  onCreate: () => void
}

export function CreateAutomationFooter({
  step,
  isPending,
  onBack,
  onNext,
  onCreate,
}: CreateAutomationFooterProps) {
  return (
    <DialogFooter className="flex items-center justify-between sm:justify-between pt-4 border-t">
      {step > 1 ? (
        <Button
          variant="outline"
          onClick={onBack}
        >
          Voltar
        </Button>
      ) : (
        <div />
      )}

      {step < 3 ? (
        <Button onClick={onNext}>Avançar</Button>
      ) : (
        <Button
          onClick={onCreate}
          disabled={isPending}
        >
          {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
          Criar e Salvar Automação
        </Button>
      )}
    </DialogFooter>
  )
}
