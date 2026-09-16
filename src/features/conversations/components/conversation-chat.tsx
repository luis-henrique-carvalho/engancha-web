import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Conversation, Message, MessageType } from '@/types/api'
import { ArrowDownLeft, ArrowUpRight, Instagram, MessageCircle, User } from 'lucide-react'

type Props = {
  conversation: Conversation
  messages: Message[]
}

function renderMessageLabel(type: MessageType) {
  switch (type) {
    case 'COMMENT':
      return 'Comentário público'
    case 'PUBLIC_REPLY':
      return 'Resposta pública no post'
    case 'PRIVATE_REPLY':
      return 'Resposta automática no Direct'
    case 'DIRECT_MESSAGE':
      return 'Mensagem direta'
    default:
      return type
  }
}

function ConversationMessageItem({ msg, contactName }: { msg: Message; contactName: string }) {
  const isInbound = msg.direction === 'INBOUND'

  return (
    <div className={`flex flex-col ${isInbound ? 'items-start' : 'items-end'}`}>
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
        {isInbound ? (
          <>
            <ArrowDownLeft className="size-3 text-blue-500" />
            <span className="font-medium">{contactName}</span>
          </>
        ) : (
          <>
            <ArrowUpRight className="size-3 text-emerald-500" />
            <span className="font-medium">Automação Engancha</span>
          </>
        )}
        <span>•</span>
        <span>{renderMessageLabel(msg.messageType)}</span>
        <span>•</span>
        <span>
          {new Date(msg.createdAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      <div
        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
          isInbound
            ? 'bg-muted text-foreground rounded-tl-sm border'
            : 'bg-primary text-primary-foreground rounded-tr-sm'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
      </div>
    </div>
  )
}

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
