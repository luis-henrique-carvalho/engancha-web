import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ConversationDetailResponse } from '@engancha/contracts'
import { Tag as TagIcon, User } from 'lucide-react'

export function ConversationContactCard({
  conversation,
}: {
  conversation: ConversationDetailResponse
}) {
  const { contact, tags } = conversation
  const contactName = contact.username ? `@${contact.username}` : (contact.name ?? 'Contato')

  return (
    <Card>
      <CardHeader className="py-4 px-6 border-b">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <User className="size-4" />
          Identidade do Contato
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3 text-sm">
        <div>
          <span className="text-xs text-muted-foreground block">Identificador social</span>
          <span className="font-medium text-foreground">{contactName}</span>
        </div>
        <div>
          <span className="text-xs text-muted-foreground block">E-mail verificado</span>
          <span className="font-medium text-foreground">
            {contact.email ?? <span className="text-muted-foreground italic">Não fornecido</span>}
          </span>
        </div>
        {contact.name && (
          <div>
            <span className="text-xs text-muted-foreground block">Nome exibido</span>
            <span className="font-medium text-foreground">{contact.name}</span>
          </div>
        )}
        <div>
          <span className="text-xs text-muted-foreground block mb-1">Tags associadas</span>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {tags.map((t: any) => (
                <Badge
                  key={t.id}
                  variant="secondary"
                  className="text-xs gap-1"
                >
                  <TagIcon className="size-3" />
                  {t.name}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground italic">Nenhuma tag</span>
          )}
        </div>
        {conversation.automation && (
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Automação originária</span>
            <Link
              to="/automations/$automationId"
              params={{ automationId: conversation.automation.id }}
              className="inline-flex items-center"
              title={`Ver automação: ${conversation.automation.name ?? 'Automação'}`}
            >
              <Badge
                variant="outline"
                className="text-xs font-normal cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {conversation.automation.name ?? 'Automação'}
              </Badge>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
