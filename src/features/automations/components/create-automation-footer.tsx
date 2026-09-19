import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CreateAutomationFooterProps {
  step: 1 | 2
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
    <div className="flex items-center justify-between pt-4 border-t">
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

      {step === 1 ? (
        <Button onClick={onNext}>Avançar para Configurações</Button>
      ) : (
        <Button
          onClick={onCreate}
          disabled={isPending}
        >
          {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
          Criar e Salvar Automação
        </Button>
      )}
    </div>
  )
}
