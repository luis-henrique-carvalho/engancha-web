import { ArrowLeft, Check, Loader2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import type { ChannelConnection } from '@/types/api'

export interface CreateAutomationPageHeaderProps {
  selectedChannel: ChannelConnection | null
  isFormValid: boolean
  isPending: boolean
  onCreate: () => void
}

export function CreateAutomationPageHeader({
  selectedChannel,
  isFormValid,
  isPending,
  onCreate,
}: CreateAutomationPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          asChild
          aria-label="Voltar para a listagem"
        >
          <Link
            to="/automations"
            search={{ page: 1, limit: 20 }}
          >
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Criar Nova Automação
            </h2>
            {selectedChannel && (
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                {selectedChannel.accountName}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Configure respostas automáticas para comentários nas suas publicações.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          asChild
          disabled={isPending}
        >
          <Link
            to="/automations"
            search={{ page: 1, limit: 20 }}
          >
            Cancelar
          </Link>
        </Button>
        <Button
          size="sm"
          onClick={onCreate}
          disabled={!isFormValid || isPending}
          className="gap-1.5"
        >
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Criando automação...</span>
            </>
          ) : (
            <>
              <Check className="size-3.5" />
              <span>Criar Automação</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
