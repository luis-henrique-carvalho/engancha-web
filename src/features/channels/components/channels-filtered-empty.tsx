import { FilterX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface ChannelsFilteredEmptyProps {
  onReset: () => void
}

export function ChannelsFilteredEmpty({ onReset }: ChannelsFilteredEmptyProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-dashed py-14 text-center"
      data-testid="channels-filtered-empty"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
        <FilterX className="size-7" />
      </div>
      <div className="mt-4 max-w-sm space-y-1 px-4">
        <h3 className="text-sm font-semibold">Nenhum canal encontrado</h3>
        <p className="text-xs text-muted-foreground">
          Nenhum canal corresponde aos filtros ou busca selecionados. Tente ajustar os termos ou
          limpar os filtros.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="mt-5 text-xs"
      >
        Limpar Filtros
      </Button>
    </div>
  )
}
