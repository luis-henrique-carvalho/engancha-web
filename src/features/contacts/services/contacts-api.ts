import type { ContactPage, PaginationParams } from '@/types/api'
import { apiFetch } from '@/lib/api-client'

export interface ListContactsParams extends PaginationParams {
  provider?: string[]
}

export const contactsQueryKeys = {
  all: ['contacts'] as const,
  list: (params?: Partial<ListContactsParams>) =>
    [...contactsQueryKeys.all, 'list', params] as const,
}

export const ContactsApi = {
  list(params: ListContactsParams = { page: 1, limit: 20 }): Promise<ContactPage> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', String(params.page))
    if (params.limit) searchParams.set('limit', String(params.limit))
    if (params.query?.trim()) searchParams.set('query', params.query.trim())
    if (params.provider) {
      params.provider.forEach((p) => searchParams.append('provider', p))
    }
    const qs = searchParams.toString()
    return apiFetch<ContactPage>(`/contacts${qs ? `?${qs}` : ''}`)
  },
}
