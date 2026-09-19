import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ChannelMedia } from '@/types/api'
import { CreateAutomationMediaGallery } from './create-automation-media-gallery'
import { CreateAutomationLivePreview } from './create-automation-live-preview'

export interface CreateAutomationPreviewTabsProps {
  activeTab: 'gallery' | 'preview'
  onActiveTabChange: (tab: 'gallery' | 'preview') => void
  mediaList: ChannelMedia[]
  loadingMedia: boolean
  selectedMedia: ChannelMedia | null
  onSelectMedia: (media: ChannelMedia) => void
  accountName?: string
  keywords: string[]
  publicReplyText: string
  privateReplyText: string
}

export function CreateAutomationPreviewTabs({
  activeTab,
  onActiveTabChange,
  mediaList,
  loadingMedia,
  selectedMedia,
  onSelectMedia,
  accountName,
  keywords,
  publicReplyText,
  privateReplyText,
}: CreateAutomationPreviewTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => onActiveTabChange(val as 'gallery' | 'preview')}
      className="w-full"
    >
      <div className="flex items-center justify-between pb-2">
        <TabsList className="grid grid-cols-2 w-[280px]">
          <TabsTrigger
            value="gallery"
            className="text-xs"
          >
            Galeria de Mídias
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="text-xs"
          >
            Live Preview
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="gallery"
        className="mt-0 focus-visible:outline-hidden"
      >
        <CreateAutomationMediaGallery
          mediaList={mediaList}
          loadingMedia={loadingMedia}
          selectedMedia={selectedMedia}
          onSelectMedia={onSelectMedia}
        />
      </TabsContent>

      <TabsContent
        value="preview"
        className="mt-0 focus-visible:outline-hidden"
      >
        <div className="space-y-4">
          <CreateAutomationLivePreview
            accountName={accountName}
            media={selectedMedia}
            keywords={keywords}
            publicReplyText={publicReplyText}
            privateReplyText={privateReplyText}
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}
