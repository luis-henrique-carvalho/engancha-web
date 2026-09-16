import { WorkspaceProvider } from '../components/workspace-provider'
import { WorkspaceRouteContent } from '../components/workspace-route-content'

export function AuthenticatedWorkspaceRoute() {
  return (
    <WorkspaceProvider>
      <WorkspaceRouteContent />
    </WorkspaceProvider>
  )
}
