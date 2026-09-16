import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SimulatedContentFormFieldsProps {
  title: string
  onTitleChange: (val: string) => void
  externalContentId: string
  onExternalContentIdChange: (val: string) => void
  error: string | null
}

export function SimulatedContentFormFields({
  title,
  onTitleChange,
  externalContentId,
  onExternalContentIdChange,
  error,
}: SimulatedContentFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="simulated-content-title">Título do conteúdo</Label>
        <Input
          id="simulated-content-title"
          data-testid="create-simulated-content-title"
          placeholder="Ex: Foto de Lançamento de Produto"
          value={title}
          maxLength={160}
          onChange={(e) => onTitleChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="simulated-content-external-id">
          Identificador do post (ID ou permalink)
        </Label>
        <Input
          id="simulated-content-external-id"
          data-testid="create-simulated-content-id"
          placeholder="Ex: post_insta_2026_01"
          value={externalContentId}
          maxLength={255}
          onChange={(e) => onExternalContentIdChange(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
