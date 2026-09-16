import type { ActiveWorkspaceResponse, WorkspaceListResponse } from '@engancha/contracts'

import { apiFetch } from '@/lib/api-client'

export function bootstrapWorkspace() {
  return apiFetch<ActiveWorkspaceResponse>('/workspaces/bootstrap', { method: 'POST' })
}

export function listWorkspaces(params?: { page?: number; limit?: number; query?: string }) {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.limit) searchParams.set('limit', String(params.limit))
  if (params?.query?.trim()) searchParams.set('query', params.query.trim())
  const qs = searchParams.toString()
  return apiFetch<WorkspaceListResponse>(`/workspaces${qs ? `?${qs}` : ''}`)
}

export function setActiveWorkspace(organizationId: string) {
  return apiFetch<ActiveWorkspaceResponse>('/workspaces/active', {
    method: 'POST',
    body: JSON.stringify({ organizationId }),
  })
}

export function createWorkspace(name: string) {
  return apiFetch<ActiveWorkspaceResponse>('/workspaces', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}
