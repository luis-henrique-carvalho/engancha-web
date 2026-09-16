import { Link } from '@tanstack/react-router'
import { ArrowLeft, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AutomationEditorNotFound() {
  return (
    <div
      className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
      role="alert"
      data-testid="automation-editor-not-found"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Bot className="size-7" />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight">Automação não encontrada</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        A automação solicitada não existe ou não pertence a este workspace.
      </p>
      <Button
        className="mt-6"
        asChild
      >
        <Link
          to="/automations"
          search={{ page: 1, limit: 20 }}
        >
          <ArrowLeft className="mr-2 size-4" />
          Voltar para automações
        </Link>
      </Button>
    </div>
  )
}
