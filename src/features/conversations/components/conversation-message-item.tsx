import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import type { Message, MessageType } from '@/types/api'

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

export interface ConversationMessageItemProps {
  msg: Message
  contactName: string
}

export function ConversationMessageItem({ msg, contactName }: ConversationMessageItemProps) {
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
