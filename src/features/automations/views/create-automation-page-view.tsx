import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCreateAutomationDialog } from '../hooks/use-create-automation-dialog'
import { CreateAutomationPageHeader } from '../components/create-automation-page-header'
import { CreateAutomationSidebarForm } from '../components/create-automation-sidebar-form'
import { CreateAutomationPreviewTabs } from '../components/create-automation-preview-tabs'

export interface CreateAutomationPageViewProps {
  workspaceId: string
}

export function CreateAutomationPageView({ workspaceId }: CreateAutomationPageViewProps) {
  const navigate = useNavigate()
  const form = useCreateAutomationDialog(workspaceId, true, (open) => {
    if (!open) {
      void navigate({ to: '/automations', search: { page: 1, limit: 20 } })
    }
  })

  const [activeTab, setActiveTab] = useState<'gallery' | 'preview'>('gallery')

  const handleSelectMedia = (media: typeof form.selectedMedia) => {
    form.setSelectedMedia(media)
    setActiveTab('preview')
  }

  const isFormValid =
    Boolean(form.selectedConnectionId) &&
    Boolean(form.selectedMedia) &&
    form.name.trim().length > 0 &&
    form.keywords.length > 0 &&
    (form.publicReplyText.trim().length > 0 || form.privateReplyText.trim().length > 0)

  return (
    <div
      className="flex flex-1 flex-col space-y-5"
      data-testid="create-automation-page"
    >
      <CreateAutomationPageHeader
        selectedChannel={form.selectedChannel}
        isFormValid={isFormValid}
        isPending={form.createMutation.isPending}
        onCreate={form.handleCreate}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 flex-1 items-start">
        <div className="flex flex-col space-y-4 lg:col-span-5">
          <CreateAutomationSidebarForm
            channels={form.channels}
            loadingChannels={form.loadingChannels}
            selectedConnectionId={form.selectedConnectionId}
            onSelectConnectionId={(val) => {
              form.setSelectedConnectionId(val)
              form.setSelectedMedia(null)
              setActiveTab('gallery')
            }}
            selectedMedia={form.selectedMedia}
            onChangeMediaClick={() => setActiveTab('gallery')}
            name={form.name}
            onNameChange={form.setName}
            keywords={form.keywords}
            onKeywordsChange={form.setKeywords}
            publicReplyText={form.publicReplyText}
            onPublicReplyChange={form.setPublicReplyText}
            privateReplyText={form.privateReplyText}
            onPrivateReplyChange={form.setPrivateReplyText}
            isFormValid={isFormValid}
          />
        </div>

        <div className="flex flex-col space-y-3 lg:col-span-7">
          <CreateAutomationPreviewTabs
            activeTab={activeTab}
            onActiveTabChange={setActiveTab}
            mediaList={form.mediaList}
            loadingMedia={form.loadingMedia}
            selectedMedia={form.selectedMedia}
            onSelectMedia={handleSelectMedia}
            accountName={form.selectedChannel?.accountName}
            keywords={form.keywords}
            publicReplyText={form.publicReplyText}
            privateReplyText={form.privateReplyText}
          />
        </div>
      </div>
    </div>
  )
}
