import { MessageSquare, Send, Sparkles } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export interface CreateAutomationResponsesSectionProps {
  publicReplyText: string
  onPublicReplyChange: (text: string) => void
  privateReplyText: string
  onPrivateReplyChange: (text: string) => void
}

export function CreateAutomationResponsesSection({
  publicReplyText,
  onPublicReplyChange,
  privateReplyText,
  onPrivateReplyChange,
}: CreateAutomationResponsesSectionProps) {
  return (
    <div className="flex flex-col justify-between space-y-4 rounded-xl border bg-card p-5 shadow-xs">
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Respostas Automáticas</h4>
            <p className="text-xs text-muted-foreground">
              Configure o comentário público e a mensagem no Direct.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="size-3.5 text-muted-foreground" />
            <Label htmlFor="auto-public">Resposta Pública (Comentário)</Label>
          </div>
          <Textarea
            id="auto-public"
            placeholder="Ex: Te mandei uma mensagem no Direct! Dá uma olhada lá 😉"
            rows={3}
            value={publicReplyText}
            onChange={(e) => onPublicReplyChange(e.target.value)}
          />
          <p className="text-[11px] text-muted-foreground">
            Comentário respondido publicamente na publicação.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Send className="size-3.5 text-muted-foreground" />
            <Label htmlFor="auto-private">Resposta Privada (Direct Message)</Label>
          </div>
          <Textarea
            id="auto-private"
            placeholder="Ex: Olá! Aqui está o link exclusivo que você pediu: https://..."
            rows={3}
            value={privateReplyText}
            onChange={(e) => onPrivateReplyChange(e.target.value)}
          />
          <p className="text-[11px] text-muted-foreground">
            Mensagem enviada no Direct do usuário que comentou.
          </p>
        </div>
      </div>
    </div>
  )
}
