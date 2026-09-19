import { Tag } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { KeywordsTagInput } from './keywords-tag-input'

export interface CreateAutomationTriggersSectionProps {
  name: string
  onNameChange: (name: string) => void
  keywords: string[]
  onKeywordsChange: (keywords: string[]) => void
}

export function CreateAutomationTriggersSection({
  name,
  onNameChange,
  keywords,
  onKeywordsChange,
}: CreateAutomationTriggersSectionProps) {
  return (
    <div className="flex flex-col justify-between space-y-4 rounded-xl border bg-card p-5 shadow-xs">
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Tag className="size-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Identificação e Gatilho</h4>
            <p className="text-xs text-muted-foreground">
              Dê um nome e defina as palavras que ativam a resposta.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="auto-name">Nome da Automação</Label>
          <Input
            id="auto-name"
            placeholder="Ex: Campanha Reels Março"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
          <p className="text-[11px] text-muted-foreground">Nome interno para organização.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="auto-keywords">Palavras-chave de Gatilho</Label>
          <KeywordsTagInput
            value={keywords}
            onChange={onKeywordsChange}
            placeholder="Ex: quero, preco, cupom..."
          />
          <p className="text-[11px] text-muted-foreground">
            Quando o seguidor comentar estas palavras, a resposta dispara.
          </p>
        </div>
      </div>
    </div>
  )
}
