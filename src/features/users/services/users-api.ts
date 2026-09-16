import type {
  Invitation,
  InviteMemberRequest,
  PaginationParams,
  WorkspaceMemberPage,
} from '@/types/api'
import { apiFetch } from '@/lib/api-client'

export interface ListUsersParams extends PaginationParams {
  role?: string[]
  status?: string[]
}

export const UsersApi = {
  list(params: ListUsersParams): Promise<WorkspaceMemberPage> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', String(params.page))
    if (params.limit) searchParams.set('limit', String(params.limit))
    if (params.query?.trim()) searchParams.set('query', params.query.trim())
    if (params.role) {
      params.role.forEach((r) => searchParams.append('role', r))
    }
    if (params.status) {
      params.status.forEach((s) => searchParams.append('status', s))
    }
    const qs = searchParams.toString()
    return apiFetch<WorkspaceMemberPage>(`/workspaces/active/members${qs ? `?${qs}` : ''}`)
  },

  invite(data: InviteMemberRequest | string): Promise<Invitation> {
    const payload = typeof data === 'string' ? { email: data } : data
    return apiFetch<Invitation>('/workspaces/active/invitations', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  remove(id: string): Promise<void> {
    return apiFetch<void>(`/workspaces/active/members/${id}`, {
      method: 'DELETE',
    })
  },

  cancelInvitation(id: string): Promise<void> {
    return apiFetch<void>(`/workspaces/active/invitations/${id}`, {
      method: 'DELETE',
    })
  },
}
