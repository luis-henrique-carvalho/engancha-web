import { Link } from '@tanstack/react-router'
import { CheckCircle2, FileEdit, PauseCircle, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AutomationTestStatusCardProps {
  status: 'DRAFT' | 'PAUSED'
  automationId: string
}

export function AutomationTestStatusCard({ status, automationId }: AutomationTestStatusCardProps) {
  if (status === 'DRAFT') {
    return (
      <Card
        className="border-dashed bg-muted/20"
        data-testid="automation-test-draft-guidance"
      >
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FileEdit className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base">Automação em rascunho</CardTitle>
              <CardDescription className="text-xs">
                Esta automação ainda não foi publicada.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-xs text-muted-foreground">
          <p>
            Para testar a jornada do seguidor, conclua a configuração das etapas e publique uma
            versão ativa.
          </p>
          <Button
            asChild
            size="sm"
            className="gap-1.5 text-xs font-semibold"
          >
            <Link to={`/automations/${automationId}/review` as any}>
              <CheckCircle2 className="size-3.5" />
              Ir para Revisão e Publicação
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className="border-dashed bg-muted/20"
      data-testid="automation-test-paused-guidance"
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <PauseCircle className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base">Automação pausada</CardTitle>
            <CardDescription className="text-xs">
              As respostas automáticas estão desativadas no canal.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-xs text-muted-foreground">
        <p>
          Para simular comentários e testar o fluxo de respostas, reative a automação na aba de
          configuração.
        </p>
        <Button
          asChild
          size="sm"
          className="gap-1.5 text-xs font-semibold"
        >
          <Link to={`/automations/${automationId}/review` as any}>
            <Play className="size-3.5" />
            Ir para Configuração
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
