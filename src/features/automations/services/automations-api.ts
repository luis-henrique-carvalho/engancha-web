import type {
  Automation,
  AutomationPage,
  AutomationStatus,
  CreateAutomationRequest,
  PaginationParams,
  UpdateAutomationStatusRequest,
} from '@/types/api'
import { apiFetch } from '@/lib/api-client'

export interface ListAutomationsParams extends PaginationParams {
  status?: AutomationStatus[]
}

export const AutomationsApi = {
  list(params: ListAutomationsParams = { page: 1, limit: 20 }): Promise<AutomationPage> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', String(params.page))
    if (params.limit) searchParams.set('limit', String(params.limit))
    if (params.query?.trim()) searchParams.set('query', params.query.trim())
    if (params.status) {
      params.status.forEach((st) => searchParams.append('status', st))
    }
    const qs = searchParams.toString()
    return apiFetch<AutomationPage>(`/automations${qs ? `?${qs}` : ''}`)
  },

  getById(id: string): Promise<Automation> {
    return apiFetch<Automation>(`/automations/${id}`)
  },

  create(data: CreateAutomationRequest): Promise<Automation> {
    return apiFetch<Automation>('/automations', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateStatus(id: string, status: AutomationStatus): Promise<Automation> {
    const payload: UpdateAutomationStatusRequest = { status }
    return apiFetch<Automation>(`/automations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },

  delete(id: string): Promise<void> {
    return apiFetch<void>(`/automations/${id}`, {
      method: 'DELETE',
    })
  },

  listTags(): Promise<any> {
    return Promise.resolve([])
  },

  createTag(_body: any): Promise<any> {
    return Promise.resolve({})
  },
}
