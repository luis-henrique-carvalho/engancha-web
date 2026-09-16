import { Plus } from 'lucide-react'
import type { TagResponse } from '@engancha/contracts'

export interface FinalActionTagModeSelectorProps {
  tagMode: 'none' | 'existing' | 'new'
  onTagModeChange: (mode: 'none' | 'existing' | 'new') => void
  tags: TagResponse[]
}

export function FinalActionTagModeSelector({
  tagMode,
  onTagModeChange,
  tags,
}: FinalActionTagModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <button
        type="button"
        data-testid="tag-mode-none"
        onClick={() => onTagModeChange('none')}
        className={`flex flex-col items-start justify-between rounded-md border p-3 text-left transition-colors ${
          tagMode === 'none'
            ? 'border-primary bg-primary/5 text-foreground'
            : 'border-border text-muted-foreground hover:bg-accent/50'
        }`}
      >
        <span className="text-xs font-semibold">Sem tag</span>
        <span className="text-[11px] text-muted-foreground">Não categorizar o contato</span>
      </button>

      <button
        type="button"
        data-testid="tag-mode-existing"
        onClick={() => onTagModeChange('existing')}
        className={`flex flex-col items-start justify-between rounded-md border p-3 text-left transition-colors ${
          tagMode === 'existing'
            ? 'border-primary bg-primary/5 text-foreground'
            : 'border-border text-muted-foreground hover:bg-accent/50'
        }`}
      >
        <span className="text-xs font-semibold">Tag existente</span>
        <span className="text-[11px] text-muted-foreground">
          {tags.length > 0 ? `${tags.length} tag(s) disponível(is)` : 'Selecionar do workspace'}
        </span>
      </button>

      <button
        type="button"
        data-testid="tag-mode-new"
        onClick={() => onTagModeChange('new')}
        className={`flex flex-col items-start justify-between rounded-md border p-3 text-left transition-colors ${
          tagMode === 'new'
            ? 'border-primary bg-primary/5 text-foreground'
            : 'border-border text-muted-foreground hover:bg-accent/50'
        }`}
      >
        <span className="text-xs font-semibold flex items-center gap-1">
          <Plus className="h-3 w-3" /> Criar nova tag
        </span>
        <span className="text-[11px] text-muted-foreground">Adicionar tag inline</span>
      </button>
    </div>
  )
}
