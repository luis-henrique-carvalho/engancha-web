import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ConversationDetailResponse } from '@engancha/contracts'
import { CheckCircle2, Clock, Mail } from 'lucide-react'

export function ConversationEmailCapturesCard({
  captures,
}: {
  captures: ConversationDetailResponse['emailCaptures']
}) {
  if (!captures.length) return null

  return (
    <Card>
      <CardHeader className="py-4 px-6 border-b">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Mail className="size-4" />
          Capturas de E-mail
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {captures.map((ec: any) => (
          <div
            key={ec.id}
            className="rounded-md border p-3 text-xs space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">Solicitação</span>
              {ec.status === 'COMPLETED' && (
                <Badge
                  variant="default"
                  className="bg-emerald-600 text-[10px] gap-1 py-0"
                >
                  <CheckCircle2 className="size-2.5" /> Concluída
                </Badge>
              )}
              {ec.status === 'PENDING' && (
                <Badge
                  variant="outline"
                  className="text-amber-600 border-amber-300 text-[10px] gap-1 py-0"
                >
                  <Clock className="size-2.5" /> Aguardando resposta
                </Badge>
              )}
              {ec.status === 'PROCESSING' && (
                <Badge
                  variant="secondary"
                  className="text-[10px] gap-1 py-0"
                >
                  Processando
                </Badge>
              )}
              {ec.status === 'SUPERSEDED' && (
                <Badge
                  variant="secondary"
                  className="text-muted-foreground text-[10px] py-0"
                >
                  Substituída por mais recente
                </Badge>
              )}
            </div>
            <div className="text-muted-foreground">
              Enviada em {new Date(ec.createdAt).toLocaleString('pt-BR')}
            </div>
            {ec.completedAt && (
              <div className="text-muted-foreground">
                Concluída em {new Date(ec.completedAt).toLocaleString('pt-BR')}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
