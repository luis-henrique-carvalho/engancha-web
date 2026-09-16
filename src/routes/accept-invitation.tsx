import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { acceptInvitation } from '@/features/workspaces/services/workspace-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/accept-invitation')({
  validateSearch: (search: Record<string, unknown>) => ({
    invitationId: typeof search.invitationId === 'string' ? search.invitationId : '',
  }),
  component: AcceptInvitationPage,
})

function AcceptInvitationPage() {
  const { invitationId } = Route.useSearch()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!invitationId) {
      setStatus('error')
      setErrorMessage('Identificador do convite não fornecido.')
      return
    }

    let cancelled = false

    acceptInvitation(invitationId)
      .then(() => {
        if (!cancelled) {
          setStatus('success')
          setTimeout(() => {
            void navigate({ to: '/' })
          }, 1500)
        }
      })
      .catch((err: any) => {
        if (!cancelled) {
          setStatus('error')
          setErrorMessage(err?.message || 'Não foi possível aceitar o convite.')
        }
      })

    return () => {
      cancelled = true
    }
  }, [invitationId, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Convite de Workspace</CardTitle>
          <CardDescription>Processando aceitação de convite</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="size-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Entrando no workspace...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle2 className="size-10 text-emerald-600" />
              <p className="text-sm font-medium">Convite aceito com sucesso!</p>
              <p className="text-xs text-muted-foreground">Redirecionando para o dashboard...</p>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="size-10 text-destructive" />
              <p className="text-sm text-destructive">{errorMessage}</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => void navigate({ to: '/' })}
              >
                Ir para o início
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
