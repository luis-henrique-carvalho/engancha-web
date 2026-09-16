import { User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function SimulationFollowerCommentCard({ author, text }: { author: string; text: string }) {
  return (
    <div
      className="rounded-lg border bg-card p-3.5 space-y-2 shadow-xs"
      data-testid="simulation-step-comment"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="size-3.5" />
          </div>
          <span className="text-xs font-semibold text-foreground">{author}</span>
        </div>
        <Badge
          variant="outline"
          className="text-[10px]"
        >
          Comentário publicado
        </Badge>
      </div>
      <p className="text-xs text-foreground bg-muted/30 rounded p-2.5">"{text}"</p>
    </div>
  )
}
