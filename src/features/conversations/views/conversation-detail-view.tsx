import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useConversationDetail } from '../hooks/use-conversation-detail'
import { useConversationMessages } from '../hooks/use-conversation-messages'
import { ConversationChat } from '../components/conversation-chat'
import { ConversationDetailHeader } from '../components/conversation-detail-header'

export { ConversationDetailHeader }

type Props = {
  workspaceId: string
  conversationId: string
}

export function ConversationDetailView({ conversationId }: Props) {
  const { data: conversation, isLoading, isError, refetch } = useConversationDetail(conversationId)
  const { data: messages = [], isLoading: loadingMessages } =
    useConversationMessages(conversationId)

  if (isLoading || loadingMessages) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-md" />
      </div>
    )
  }

  if (isError || !conversation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center min-h-[350px]">
        <h3 className="text-lg font-semibold">Conversa não encontrada</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          A conversa solicitada não existe ou não pertence a este workspace.
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            asChild
            size="sm"
          >
            <Link to="/conversations">Voltar para a lista</Link>
          </Button>
          <Button
            variant="secondary"
            onClick={() => void refetch()}
            size="sm"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  const contact = conversation.contact
  const contactName = contact?.username ? `@${contact.username}` : contact?.fullName || 'Contato'

  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="size-8"
        >
          <Link to="/conversations">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Conversa com {contactName}</h2>
          <p className="text-xs text-muted-foreground">
            Iniciada em {new Date(conversation.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      <ConversationChat
        conversation={conversation}
        messages={messages}
      />
    </div>
  )
}
