import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'

interface LeadsEmptyStateProps {
  hasActiveFilters: boolean
  onResetFilters: () => void
}

export function LeadsEmptyState({ hasActiveFilters, onResetFilters }: LeadsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
      <Users className="size-8 opacity-40" />
      <p className="text-sm font-medium">
        {hasActiveFilters
          ? 'Nenhum lead encontrado com os filtros aplicados.'
          : 'Nenhum lead registrado ainda neste workspace.'}
      </p>
      {hasActiveFilters && (
        <Button
          variant="link"
          size="sm"
          onClick={onResetFilters}
        >
          Redefinir filtros
        </Button>
      )}
    </div>
  )
}
