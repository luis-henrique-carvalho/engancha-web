import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface SimulationTestFormInputsProps {
  author: string
  onAuthorChange: (val: string) => void
  commentId: string
  onCommentIdChange: (val: string) => void
  text: string
  onTextChange: (val: string) => void
  isSubmitting: boolean
}

export function SimulationTestFormInputs({
  author,
  onAuthorChange,
  commentId,
  onCommentIdChange,
  text,
  onTextChange,
  isSubmitting,
}: SimulationTestFormInputsProps) {
  return (
    <>
      <div className="space-y-1.5">
        <Label
          htmlFor="sim-author"
          className="text-xs"
        >
          Autor do comentário <span className="text-destructive">*</span>
        </Label>
        <Input
          id="sim-author"
          value={author}
          onChange={(e) => onAuthorChange(e.target.value)}
          placeholder="@seu_seguidor"
          maxLength={120}
          disabled={isSubmitting}
          className="h-9 text-xs"
          data-testid="simulation-input-author"
        />
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="sim-comment-id"
          className="text-xs"
        >
          Identificador do comentário (opcional)
        </Label>
        <Input
          id="sim-comment-id"
          value={commentId}
          onChange={(e) => onCommentIdChange(e.target.value)}
          placeholder="ex: comment_123"
          maxLength={255}
          disabled={isSubmitting}
          className="h-9 text-xs"
          data-testid="simulation-input-comment-id"
        />
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="sim-text"
          className="text-xs"
        >
          Comentário na publicação <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="sim-text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Digite o comentário que ativará a automação (ex: Quero o link)..."
          rows={3}
          maxLength={1000}
          disabled={isSubmitting}
          className="resize-none text-xs"
          data-testid="simulation-input-text"
        />
        <p className="text-[11px] text-muted-foreground">
          {text.length}/1000 caracteres. Insira a palavra-chave configurada.
        </p>
      </div>
    </>
  )
}
