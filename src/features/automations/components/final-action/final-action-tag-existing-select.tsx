import type { TagResponse } from '@engancha/contracts'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface FinalActionTagExistingSelectProps {
  tags: TagResponse[]
  isLoadingTags?: boolean
  selectedTagId: string
  onSelectTagId: (tagId: string) => void
  onTagModeChange: (mode: 'none' | 'existing' | 'new') => void
}

export function FinalActionTagExistingSelect({
  tags,
  isLoadingTags,
  selectedTagId,
  onSelectTagId,
  onTagModeChange,
}: FinalActionTagExistingSelectProps) {
  return (
    <div
      className="space-y-2 pt-1"
      data-testid="existing-tag-selector"
    >
      <Label className="text-xs font-medium">Selecione uma tag</Label>
      {isLoadingTags ? (
        <p className="text-xs text-muted-foreground">Carregando tags...</p>
      ) : tags.length === 0 ? (
        <div className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
          Nenhuma tag encontrada no workspace.{' '}
          <button
            type="button"
            className="text-primary underline hover:opacity-80"
            onClick={() => onTagModeChange('new')}
          >
            Criar uma nova tag
          </button>
        </div>
      ) : (
        <Select
          value={selectedTagId}
          onValueChange={onSelectTagId}
        >
          <SelectTrigger data-testid="automation-tag-select">
            <SelectValue placeholder="Escolha uma tag..." />
          </SelectTrigger>
          <SelectContent>
            {tags.map((tag) => (
              <SelectItem
                key={tag.id}
                value={tag.id}
                data-testid={`tag-option-${tag.id}`}
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="font-mono text-[11px]"
                  >
                    #{tag.name}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
