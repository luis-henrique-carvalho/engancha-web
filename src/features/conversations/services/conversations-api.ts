import type {
  Conversation,
  ConversationPage,
  ConversationStatus,
  Message,
  PaginationParams,
} from '@/types/api'
import { apiFetch } from '@/lib/api-client'

export interface ListConversationsParams extends PaginationParams {
  status?: ConversationStatus[]
  startDate?: string
  endDate?: string
  automationId?: string
}

export const conversationsQueryKeys = {
  all: ['conversations'] as const,
  list: (params?: Partial<ListConversationsParams>) =>
    [...conversationsQueryKeys.all, 'list', params] as const,
  detail: (id: string) => [...conversationsQueryKeys.all, 'detail', id] as const,
  messages: (id: string) => [...conversationsQueryKeys.all, 'detail', id, 'messages'] as const,
}

export const ConversationsApi = {
  list(params: ListConversationsParams = { page: 1, limit: 20 }): Promise<ConversationPage> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', String(params.page))
    if (params.limit) searchParams.set('limit', String(params.limit))
    if (params.query?.trim()) searchParams.set('query', params.query.trim())
    if (params.status) {
      params.status.forEach((st) => searchParams.append('status', st))
    }
    if (params.startDate) searchParams.set('startDate', params.startDate)
    if (params.endDate) searchParams.set('endDate', params.endDate)
    if (params.automationId) searchParams.set('automationId', params.automationId)

    const qs = searchParams.toString()
    return apiFetch<ConversationPage>(`/conversations${qs ? `?${qs}` : ''}`)
  },

  getById(id: string): Promise<Conversation> {
    return apiFetch<Conversation>(`/conversations/${id}`)
  },

  listMessages(id: string): Promise<Message[]> {
    return apiFetch<Message[]>(`/conversations/${id}/messages`)
  },
}
