import { CreateAutomationTriggersSection } from './create-automation-triggers-section'
import { CreateAutomationResponsesSection } from './create-automation-responses-section'

export interface CreateAutomationStep2Props {
  name: string
  onNameChange: (name: string) => void
  keywords: string[]
  onKeywordsChange: (keywords: string[]) => void
  publicReplyText: string
  onPublicReplyChange: (text: string) => void
  privateReplyText: string
  onPrivateReplyChange: (text: string) => void
}

export function CreateAutomationStep2({
  name,
  onNameChange,
  keywords,
  onKeywordsChange,
  publicReplyText,
  onPublicReplyChange,
  privateReplyText,
  onPrivateReplyChange,
}: CreateAutomationStep2Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
      </div>
    </div>
  )
}
