import { Tag as TagIcon } from 'lucide-react'
import type { TagResponse } from '@engancha/contracts'
import { Label } from '@/components/ui/label'
import { FinalActionTagModeSelector } from './final-action-tag-mode-selector'
import { FinalActionTagExistingSelect } from './final-action-tag-existing-select'
import { FinalActionTagNewInput } from './final-action-tag-new-input'

export interface FinalActionTagFieldProps {
  tags: TagResponse[]
  isLoadingTags?: boolean
  tagMode: 'none' | 'existing' | 'new'
  onTagModeChange: (mode: 'none' | 'existing' | 'new') => void
  selectedTagId: string
  onSelectTagId: (tagId: string) => void
  newTagName: string
  onNewTagNameChange: (name: string) => void
}

export function FinalActionTagField({
  tags,
  isLoadingTags,
  tagMode,
  onTagModeChange,
  selectedTagId,
  onSelectTagId,
  newTagName,
  onNewTagNameChange,
}: FinalActionTagFieldProps) {
  return (
    <div
      className="space-y-4 rounded-lg border p-4"
      data-testid="automation-final-action-tag-section"
    >
      <div className="flex items-center gap-2">
        <TagIcon className="h-4 w-4 text-primary shrink-0" />
        <div>
          <Label className="text-sm font-semibold">Tag do contato (opcional)</Label>
          <p className="text-xs text-muted-foreground">
            Associe uma tag para segmentar o contato quando esta automação for executada.
          </p>
        </div>
      </div>

      <FinalActionTagModeSelector
        tagMode={tagMode}
        onTagModeChange={onTagModeChange}
        tags={tags}
      />

      {tagMode === 'existing' && (
        <FinalActionTagExistingSelect
          tags={tags}
          isLoadingTags={isLoadingTags}
          selectedTagId={selectedTagId}
          onSelectTagId={onSelectTagId}
          onTagModeChange={onTagModeChange}
        />
      )}

      {tagMode === 'new' && (
        <FinalActionTagNewInput
          newTagName={newTagName}
          onNewTagNameChange={onNewTagNameChange}
        />
      )}
    </div>
  )
}
