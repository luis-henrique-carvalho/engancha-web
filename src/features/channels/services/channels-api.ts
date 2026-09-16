import type {
  ChannelConnection,
  ChannelMedia,
  OAuthCallbackRequest,
  OAuthConnectURL,
} from '@/types/api'
import { apiFetch } from '@/lib/api-client'

export const ChannelsApi = {
  listConnections(): Promise<{ items: ChannelConnection[] }> {
    return apiFetch<{ items: ChannelConnection[] }>('/channels/connections')
  },

  getConnection(id: string): Promise<ChannelConnection> {
    return apiFetch<ChannelConnection>(`/channels/connections/${id}`)
  },

  getConnectURL(): Promise<OAuthConnectURL> {
    return apiFetch<OAuthConnectURL>('/channels/connect-url')
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
