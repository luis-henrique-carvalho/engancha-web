import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export interface CreateAutomationStep3Props {
  publicReplyText: string
  onPublicReplyChange: (text: string) => void
  privateReplyText: string
  onPrivateReplyChange: (text: string) => void
}

export function CreateAutomationStep3({
  publicReplyText,
  onPublicReplyChange,
  privateReplyText,
  onPrivateReplyChange,
}: CreateAutomationStep3Props) {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="auto-public">Resposta Pública (Comentário)</Label>
        <Textarea
          id="auto-public"
          placeholder="Ex: Te mandei uma mensagem no Direct! Dá uma olhada lá 😉"
          rows={3}
          value={publicReplyText}
          onChange={(e) => onPublicReplyChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Comentário público respondido na publicação.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="auto-private">Resposta Privada (Direct Message)</Label>
        <Textarea
          id="auto-private"
          placeholder="Ex: Olá! Aqui está o link exclusivo que você pediu: https://..."
          rows={4}
          value={privateReplyText}
          onChange={(e) => onPrivateReplyChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Mensagem enviada automaticamente no direct do usuário.
        </p>
      </div>
    </div>
  )
}
