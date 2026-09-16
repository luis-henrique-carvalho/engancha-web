import { FilterX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function AutomationActivityFilteredEmpty({ onReset }: { onReset: () => void }) {
  return (
    <Card
      className="border-dashed bg-muted/10 text-center py-8"
      data-testid="automation-activity-filtered-empty"
    >
      <CardHeader className="space-y-2">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FilterX className="size-6" />
        </div>
        <CardTitle className="text-base font-semibold">Nenhuma atividade encontrada</CardTitle>
        <CardDescription className="text-xs max-w-sm mx-auto">
          Nenhuma interação corresponde aos critérios e filtros selecionados no momento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          size="sm"
          variant="outline"
          onClick={onReset}
          className="gap-1.5 text-xs font-semibold"
          data-testid="activity-empty-reset-button"
        >
          Limpar filtros
        </Button>
      </CardContent>
    </Card>
  )
}
