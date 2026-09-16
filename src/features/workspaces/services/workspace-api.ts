import type {
  ActiveWorkspace,
  Invitation,
  InviteMemberRequest,
  PaginationParams,
  WorkspaceMemberPage,
  WorkspacePage,
  WorkspaceSession,
} from '@/types/api'
import { apiFetch } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'

export async function bootstrapWorkspace(): Promise<ActiveWorkspace> {
  const session = await apiFetch<WorkspaceSession>('/workspaces/bootstrap', { method: 'POST' })
  if (session.token) {
    useAuthStore.getState().auth.setAccessToken(session.token)
  }
  if (session.workspace?.id) {
    useAuthStore.getState().auth.setActiveWorkspaceId(session.workspace.id)
  }
  return session.workspace
}

export function listWorkspaces(params?: PaginationParams) {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.limit) searchParams.set('limit', String(params.limit))
  if (params?.query?.trim()) searchParams.set('query', params.query.trim())
  const qs = searchParams.toString()
  return apiFetch<WorkspacePage>(`/workspaces${qs ? `?${qs}` : ''}`)
}

export function getActiveWorkspace() {
  return apiFetch<ActiveWorkspace>('/workspaces/active')
}

export async function setActiveWorkspace(workspaceId: string): Promise<ActiveWorkspace> {
  const session = await apiFetch<WorkspaceSession>('/workspaces/active', {
    method: 'POST',
    body: JSON.stringify({ workspaceId }),
  })
  if (session.token) {
    useAuthStore.getState().auth.setAccessToken(session.token)
  }
  if (session.workspace?.id) {
    useAuthStore.getState().auth.setActiveWorkspaceId(session.workspace.id)
  }
  return session.workspace
}

export async function createWorkspace(name: string): Promise<ActiveWorkspace> {
  const session = await apiFetch<WorkspaceSession>('/workspaces', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  if (session.token) {
    useAuthStore.getState().auth.setAccessToken(session.token)
  }
  if (session.workspace?.id) {
    useAuthStore.getState().auth.setActiveWorkspaceId(session.workspace.id)
  }
  return session.workspace
}

export interface ListMembersParams extends PaginationParams {
  role?: string[]
  status?: string[]
}

export function listMembers(params?: ListMembersParams) {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.limit) searchParams.set('limit', String(params.limit))
  if (params?.query?.trim()) searchParams.set('query', params.query.trim())
  if (params?.role) {
    params.role.forEach((r) => searchParams.append('role', r))
  }
  if (params?.status) {
    params.status.forEach((s) => searchParams.append('status', s))
  }
  const qs = searchParams.toString()
  return apiFetch<WorkspaceMemberPage>(`/workspaces/active/members${qs ? `?${qs}` : ''}`)
}

export function inviteMember(data: InviteMemberRequest) {
  return apiFetch<Invitation>('/workspaces/active/invitations', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function removeMember(id: string) {
  return apiFetch<void>(`/workspaces/active/members/${id}`, {
    method: 'DELETE',
  })
}

export function cancelInvitation(id: string) {
  return apiFetch<void>(`/workspaces/active/invitations/${id}`, {
    method: 'DELETE',
  })
}

export async function acceptInvitation(id: string): Promise<WorkspaceSession> {
  const session = await apiFetch<WorkspaceSession>(`/workspaces/invitations/${id}/accept`, {
    method: 'POST',
  })
  if (session.token) {
    useAuthStore.getState().auth.setAccessToken(session.token)
  }
  if (session.workspace?.id) {
    useAuthStore.getState().auth.setActiveWorkspaceId(session.workspace.id)
  }
  return session
}
