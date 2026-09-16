import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { normalizeTagName } from '@/lib/string-utils'

export interface FinalActionTagNewInputProps {
  newTagName: string
  onNewTagNameChange: (name: string) => void
}

export function FinalActionTagNewInput({
  newTagName,
  onNewTagNameChange,
}: FinalActionTagNewInputProps) {
  const normalizedPreview = newTagName.trim() ? normalizeTagName(newTagName) : ''

  return (
    <div
      className="space-y-2 pt-1"
      data-testid="new-tag-input-container"
    >
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">Nome da nova tag</Label>
        <span className="text-[11px] text-muted-foreground">{newTagName.length}/50 caracteres</span>
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
          #
        </span>
        <Input
          value={newTagName}
          onChange={(e) => onNewTagNameChange(e.target.value.slice(0, 50))}
          placeholder="ex: cliente-vip"
          className="pl-7 font-mono text-sm"
          data-testid="automation-new-tag-input"
        />
      </div>
      {normalizedPreview && (
        <p
          className="text-[11px] text-muted-foreground"
          data-testid="normalized-tag-preview"
        >
          Identificador normalizado:{' '}
          <span className="font-mono font-medium text-foreground">{normalizedPreview}</span>
        </p>
      )}
    </div>
  )
}
