import { AlertCircle } from 'lucide-react'
import type { ChannelConnection, ChannelMedia } from '@/types/api'
import { CreateAutomationFormChannelMediaCard } from './create-automation-form-channel-media-card'
import { CreateAutomationTriggersSection } from './create-automation-triggers-section'
import { CreateAutomationResponsesSection } from './create-automation-responses-section'

export interface CreateAutomationSidebarFormProps {
  channels: ChannelConnection[]
  loadingChannels: boolean
  selectedConnectionId: string
  onSelectConnectionId: (id: string) => void
  selectedMedia: ChannelMedia | null
  onChangeMediaClick: () => void
  name: string
  onNameChange: (val: string) => void
  keywords: string[]
  onKeywordsChange: (val: string[]) => void
  publicReplyText: string
  onPublicReplyChange: (val: string) => void
  privateReplyText: string
  onPrivateReplyChange: (val: string) => void
  isFormValid: boolean
}

export function CreateAutomationSidebarForm({
  channels,
  loadingChannels,
  selectedConnectionId,
  onSelectConnectionId,
  selectedMedia,
  onChangeMediaClick,
  name,
  onNameChange,
  keywords,
  onKeywordsChange,
  publicReplyText,
  onPublicReplyChange,
  privateReplyText,
  onPrivateReplyChange,
  isFormValid,
}: CreateAutomationSidebarFormProps) {
  return (
    <div className="flex flex-col space-y-4">
      <CreateAutomationFormChannelMediaCard
        channels={channels}
        loadingChannels={loadingChannels}
        selectedConnectionId={selectedConnectionId}
        onSelectConnectionId={onSelectConnectionId}
        selectedMedia={selectedMedia}
        onChangeMediaClick={onChangeMediaClick}
      />

      <CreateAutomationTriggersSection
        name={name}
        onNameChange={onNameChange}
        keywords={keywords}
        onKeywordsChange={onKeywordsChange}
      />

      <CreateAutomationResponsesSection
        publicReplyText={publicReplyText}
        onPublicReplyChange={onPublicReplyChange}
        privateReplyText={privateReplyText}
        onPrivateReplyChange={onPrivateReplyChange}
      />

      {!isFormValid && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
          <AlertCircle className="size-4 shrink-0" />
          <span>
            Selecione uma publicação, dê um nome, insira palavras-chave e pelo menos uma resposta.
          </span>
        </div>
      )}
    </div>
  )
}
