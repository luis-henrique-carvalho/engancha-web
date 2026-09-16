import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface CreateAutomationStep2Props {
  name: string
  onNameChange: (name: string) => void
  keywordsText: string
  onKeywordsChange: (keywords: string) => void
}

export function CreateAutomationStep2({
  name,
  onNameChange,
  keywordsText,
  onKeywordsChange,
}: CreateAutomationStep2Props) {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="auto-name">Nome da Automação</Label>
        <Input
          id="auto-name"
          placeholder="Ex: Campanha Reels Março"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="auto-keywords">Palavras-chave de Gatilho (separadas por vírgula)</Label>
        <Input
          id="auto-keywords"
          placeholder="Ex: quero, eu quero, preco, cupom"
          value={keywordsText}
          onChange={(e) => onKeywordsChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Quando um usuário comentar qualquer uma destas palavras, a automação responderá.
        </p>
      </div>
    </div>
  )
}
