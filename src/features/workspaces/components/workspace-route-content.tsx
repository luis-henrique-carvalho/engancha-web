import { Outlet } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Button } from '@/components/ui/button'
import { useWorkspace } from './workspace-provider'
import { WorkspaceState } from './workspace-state'
import { ApiClientError } from '@/lib/api-client'

export function WorkspaceRouteContent() {
  const { error, isLoading, retry, setWorkspace, user, workspace } = useWorkspace()

  if (isLoading) {
    return <WorkspaceState title="Preparando seu workspace…" />
  }

  if (!workspace || !user || error) {
    const status = error instanceof ApiClientError ? error.status : undefined
    const title =
      status === 403
        ? 'Confirme seu e-mail para acessar o produto.'
        : status === 409
          ? 'Seu contexto de workspace ainda não está disponível.'
          : status === 401
            ? 'Entre novamente para continuar.'
            : 'Não foi possível carregar o workspace.'

    return (
      <WorkspaceState title={title}>
        <Button onClick={retry}>Tentar novamente</Button>
      </WorkspaceState>
    )
  }

  return (
    <AuthenticatedLayout
      user={user}
      workspace={workspace}
      onWorkspaceChange={setWorkspace}
    >
      <Outlet />
    </AuthenticatedLayout>
  )
}
