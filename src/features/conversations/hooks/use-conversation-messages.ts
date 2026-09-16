import { useQuery } from '@tanstack/react-query'
import { ConversationsApi, conversationsQueryKeys } from '../services/conversations-api'

export function useConversationMessages(conversationId: string) {
  return useQuery({
    queryKey: conversationsQueryKeys.messages(conversationId),
    queryFn: () => ConversationsApi.listMessages(conversationId),
    enabled: Boolean(conversationId),
  })
}
