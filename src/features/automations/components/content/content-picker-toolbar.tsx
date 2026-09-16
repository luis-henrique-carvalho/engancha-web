import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ContentPickerToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  onOpenDialog: () => void
  disabled?: boolean
  isLoading?: boolean
}

export function ContentPickerToolbar({
  search,
  onSearchChange,
  onOpenDialog,
  disabled = false,
  isLoading = false,
}: ContentPickerToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por título ou ID do post..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          data-testid="content-search-input"
          disabled={disabled || isLoading}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onOpenDialog}
        disabled={disabled}
        data-testid="open-create-content-dialog-button"
      >
        <Plus className="mr-2 size-4" />
        Novo conteúdo simulado
      </Button>
    </div>
  )
}
