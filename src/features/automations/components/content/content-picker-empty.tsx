import { Image as ImageIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface ContentPickerEmptyProps {
  search: string
  disabled: boolean
  onOpenDialog: () => void
}

export function ContentPickerEmpty({ search, disabled, onOpenDialog }: ContentPickerEmptyProps) {
  return (
    <div
      className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center"
      data-testid="content-picker-empty"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <ImageIcon className="size-6" />
      </div>
      <h4 className="mt-3 text-sm font-semibold">Nenhum conteúdo simulado encontrado</h4>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
        {search.trim()
          ? 'Tente buscar com outro termo ou cadastre um novo conteúdo.'
          : 'Crie seu primeiro conteúdo simulado para associar a esta automação.'}
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={onOpenDialog}
        disabled={disabled}
      >
        <Plus className="mr-2 size-3.5" />
        Criar conteúdo simulado
      </Button>
    </div>
  )
}
