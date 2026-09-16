import type {
  ContentListResponse,
  ContentResponse,
  CreateContentRequest,
  PaginationRequest,
} from '@engancha/contracts'
import { apiFetch } from '@/lib/api-client'

export const SimulatedContentsApi = {
  async list(params: PaginationRequest = { page: 1, limit: 50 }): Promise<ContentListResponse> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', String(params.page))
    if (params.limit) searchParams.set('limit', String(params.limit))

    const query = searchParams.toString()
    const path = query ? `/simulated-contents?${query}` : '/simulated-contents'
    const data = await apiFetch<ContentListResponse>(path)
    return data
  },

  async create(body: CreateContentRequest): Promise<ContentResponse> {
    const data = await apiFetch<ContentResponse>('/simulated-contents', {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return data
  },
}
