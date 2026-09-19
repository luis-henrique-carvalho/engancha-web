import { Sparkles } from 'lucide-react'
import type { ChannelMedia } from '@/types/api'
import { CreateAutomationPreviewComment } from './create-automation-preview-comment'
import { CreateAutomationPreviewDirect } from './create-automation-preview-direct'

export interface CreateAutomationLivePreviewProps {
  accountName?: string
  media: ChannelMedia | null
  keywords: string[]
  publicReplyText: string
  privateReplyText: string
}

export function CreateAutomationLivePreview({
  accountName = 'sua_conta',
  media,
  keywords,
  publicReplyText,
  privateReplyText,
}: CreateAutomationLivePreviewProps) {
  const sampleKeyword = keywords[0] || 'quero'
  const displayAccount = accountName.startsWith('@') ? accountName : `@${accountName}`

  return (
    <div className="flex h-full flex-col justify-between space-y-4 rounded-2xl border bg-card/60 p-5 shadow-xs backdrop-blur-xs">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground">Simulador em Tempo Real</h4>
            <p className="text-[11px] text-muted-foreground">
              Veja a experiência do seguidor ao interagir
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Preview
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CreateAutomationPreviewComment
          media={media}
          sampleKeyword={sampleKeyword}
          displayAccount={displayAccount}
          publicReplyText={publicReplyText}
        />
        <CreateAutomationPreviewDirect
          displayAccount={displayAccount}
          privateReplyText={privateReplyText}
        />
      </div>
    </div>
  )
}
