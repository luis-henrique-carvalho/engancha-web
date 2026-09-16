import { createFileRoute } from '@tanstack/react-router'
import { ChannelsView } from '@/features/channels/views/channels-view'
import { WorkspaceShell } from '@/features/workspaces/workspace-shell'

export const Route = createFileRoute('/_authenticated/channels')({
  component: ChannelsPage,
})

function ChannelsPage() {
  return (
    <WorkspaceShell mainClassName="flex flex-1 flex-col gap-6">
      {() => <ChannelsView />}
    </WorkspaceShell>
  )
}
