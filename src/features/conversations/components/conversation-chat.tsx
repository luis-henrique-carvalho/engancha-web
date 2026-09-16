import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Conversation, Message } from '@/types/api'
import { Instagram, MessageCircle, User } from 'lucide-react'

type Props = {
  conversation: Conversation
  messages: Message[]
}

import { ConversationMessageItem } from './conversation-message-item'

export function ConversationChat({ conversation, messages }: Props) {
  const contact = conversation.contact
  const contactName = contact?.username ? `@${contact.username}` : contact?.fullName || 'Contato'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna de Histórico de Mensagens */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Instagram className="size-5 text-pink-600" />
              </div>
              <div>
                <CardTitle className="text-base">{contactName}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Status: {conversation.status} • Canal: Instagram
                </p>
              </div>
            </div>
            <Badge variant={conversation.status === 'OPEN' ? 'default' : 'secondary'}>
              {conversation.status}
            </Badge>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <MessageCircle className="size-10 mb-2 stroke-1" />
                <p className="text-sm">Nenhuma mensagem registrada nesta conversa.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <ConversationMessageItem
                  key={msg.id}
                  msg={msg}
                  contactName={contactName}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Coluna de Detalhes do Contato */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="size-4" />
              Dados do Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div>
              <span className="text-muted-foreground">Nome de usuário:</span>
              <p className="font-semibold text-sm">{contactName}</p>
            </div>
            {contact?.fullName && (
              <div>
                <span className="text-muted-foreground">Nome completo:</span>
                <p className="font-medium text-foreground">{contact.fullName}</p>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">ID do Contato:</span>
              <p className="font-mono text-muted-foreground truncate">{conversation.contactId}</p>
            </div>
            <div>
              <span className="text-muted-foreground">ID da Conversa:</span>
              <p className="font-mono text-muted-foreground truncate">{conversation.id}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Iniciada em:</span>
              <p className="text-foreground">
                {new Date(conversation.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
