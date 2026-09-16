import { Link } from '@tanstack/react-router'
import { Activity, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function AutomationActivityEmpty({ automationId }: { automationId: string }) {
  return (
    <Card
      className="border-dashed bg-muted/10 text-center py-8"
      data-testid="automation-activity-empty"
    >
      <CardHeader className="space-y-2">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Activity className="size-6" />
        </div>
        <CardTitle className="text-base font-semibold">Nenhuma atividade registrada</CardTitle>
        <CardDescription className="text-xs max-w-sm mx-auto">
          As interações simuladas com a publicação aparecerão aqui em ordem cronológica após o
          primeiro teste.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          asChild
          size="sm"
          className="gap-1.5 text-xs font-semibold"
        >
          <Link to={`/automations/${automationId}/test` as any}>
            <Play className="size-3.5" />
            Fazer um teste agora
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
