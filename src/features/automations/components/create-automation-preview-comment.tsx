import { Instagram, MessageSquare } from 'lucide-react'
import type { ChannelMedia } from '@/types/api'

export interface CreateAutomationPreviewCommentProps {
  media: ChannelMedia | null
  sampleKeyword: string
  displayAccount: string
  publicReplyText: string
}

export function CreateAutomationPreviewComment({
  media,
  sampleKeyword,
  displayAccount,
  publicReplyText,
}: CreateAutomationPreviewCommentProps) {
  return (
    <div className="flex flex-col rounded-xl border bg-background/80 p-3.5 shadow-xs">
      <div className="mb-2.5 flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <Instagram className="size-3.5 text-pink-500" />
          <span>Comentário no Post</span>
        </div>
        {media && (
          <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
            {media.mediaType.toLowerCase()}
          </span>
        )}
      </div>

      <div className="space-y-2.5 text-xs flex-1">
        <div className="flex items-start gap-2">
          <div className="size-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
            U
          </div>
          <div className="flex-1 rounded-lg bg-muted/40 p-2 text-foreground">
            <p className="font-semibold text-[11px] text-muted-foreground">@seguidor</p>
            <p className="mt-0.5">
              Eu <span className="font-bold text-primary underline">{sampleKeyword}</span> muito
              esse conteúdo! 🔥
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 pl-4">
          <div className="size-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
            A
          </div>
          <div className="flex-1 rounded-lg border border-primary/20 bg-primary/5 p-2">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-primary">
              <MessageSquare className="size-3" />
              <span>{displayAccount}</span>
              <span className="text-[10px] font-normal text-muted-foreground ml-auto">Agora</span>
            </div>
            <p className="mt-1 text-foreground leading-relaxed">
              {publicReplyText || (
                <span className="italic text-muted-foreground">
                  (Nenhuma resposta pública configurada)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
