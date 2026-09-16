import { Instagram, Play, Send } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SimulationTargetContentBadge } from './simulation-target-content-badge'
import { SimulationTestFormInputs } from './simulation-test-form-inputs'
import { useSimulationTestFormState } from '../../hooks/use-simulation-test-form-state'

export interface SimulationContentInfo {
  id: string
  externalId: string
  title: string
  type: 'POST' | 'VIDEO'
  thumbnailUrl?: string | null
}

export interface SimulationTestFormProps {
  content: SimulationContentInfo | null
  isSubmitting?: boolean
  onSubmit: (values: { author: string; text: string; commentId?: string }) => Promise<void> | void
}

export function SimulationTestForm({
  content,
  isSubmitting = false,
  onSubmit,
}: SimulationTestFormProps) {
  const {
    author,
    setAuthor,
    commentId,
    setCommentId,
    text,
    setText,
    validationError,
    handleSubmit,
  } = useSimulationTestFormState(onSubmit)

  return (
    <Card
      className="h-full"
      data-testid="simulation-test-form-card"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Simular comentário</CardTitle>
          <Badge
            variant="outline"
            className="gap-1 border-primary/30 text-primary"
          >
            <Instagram className="size-3" />
            Instagram
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Envie uma interação simulada para testar as respostas configuradas.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <SimulationTargetContentBadge content={content} />

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {validationError && (
            <Alert
              variant="destructive"
              className="py-2 text-xs"
              data-testid="simulation-form-error"
            >
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          <SimulationTestFormInputs
            author={author}
            onAuthorChange={setAuthor}
            commentId={commentId}
            onCommentIdChange={setCommentId}
            text={text}
            onTextChange={setText}
            isSubmitting={isSubmitting}
          />

          <Button
            type="submit"
            className="w-full gap-2 text-xs font-semibold"
            disabled={isSubmitting || !content}
            data-testid="simulation-submit-btn"
          >
            {isSubmitting ? (
              <>
                <Play className="size-3.5 animate-spin" />
                Enviando teste...
              </>
            ) : (
              <>
                <Send className="size-3.5" />
                Testar jornada do seguidor
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
