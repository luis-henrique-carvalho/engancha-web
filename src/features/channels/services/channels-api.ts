import type {
  ChannelConnection,
  ChannelConnectionPage,
  ChannelMedia,
  ChannelProvider,
  ListChannelsParams,
  OAuthCallbackRequest,
  OAuthConnectURL,
} from '@/types/api'
import { apiFetch } from '@/lib/api-client'

export const ChannelsApi = {
  listConnections(params?: ListChannelsParams): Promise<ChannelConnectionPage> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.query) searchParams.set('query', params.query)
    if (params?.status && params.status.length > 0) {
      params.status.forEach((s) => searchParams.append('status', s))
    }
    if (params?.provider && params.provider.length > 0) {
      params.provider.forEach((p) => searchParams.append('provider', p))
    }
    const queryString = searchParams.toString()
    return apiFetch<ChannelConnectionPage>(
      `/channels/connections${queryString ? `?${queryString}` : ''}`,
    )
  },

  getConnection(id: string): Promise<ChannelConnection> {
    return apiFetch<ChannelConnection>(`/channels/connections/${id}`)
  },

  getConnectURL(provider?: ChannelProvider | string): Promise<OAuthConnectURL> {
    const query = provider ? `?provider=${encodeURIComponent(provider)}` : ''
    return apiFetch<OAuthConnectURL>(`/channels/connect-url${query}`)
  },

  completeOAuth(data: OAuthCallbackRequest): Promise<ChannelConnection> {
    return apiFetch<ChannelConnection>('/channels/callback', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  revalidateConnection(id: string): Promise<ChannelConnection> {
    return apiFetch<ChannelConnection>(`/channels/connections/${id}/revalidate`, {
      method: 'POST',
    })
  },

  disconnectConnection(id: string): Promise<void> {
    return apiFetch<void>(`/channels/connections/${id}/disconnect`, {
      method: 'POST',
    })
  },

  listEligibleMedia(connectionId: string, limit = 25): Promise<{ items: ChannelMedia[] }> {
    return apiFetch<{ items: ChannelMedia[] }>(
      `/channels/connections/${connectionId}/media?limit=${limit}`,
    )
  },
}
