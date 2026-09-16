import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { ChannelsApi } from '@/features/channels/services/channels-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/oauth/instagram/callback')({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === 'string' ? search.code : '',
    state: typeof search.state === 'string' ? search.state : '',
    error: typeof search.error === 'string' ? search.error : '',
    error_description: typeof search.error_description === 'string' ? search.error_description : '',
  }),
  component: InstagramCallbackPage,
})

function InstagramCallbackPage() {
  const { code, state, error, error_description } = Route.useSearch()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (error || error_description) {
      setStatus('error')
      setErrorMessage(
        error_description || error || 'A autorização com o Instagram foi recusada ou cancelada.',
      )
      return
    }

    const cleanCode = code ? code.replace(/#_$/, '').trim() : ''

    if (!cleanCode || !state) {
      setStatus('error')
      setErrorMessage('Parâmetros de autorização (code ou state) não fornecidos.')
      return
    }

    let cancelled = false

    ChannelsApi.completeOAuth({ code: cleanCode, state })
      .then(() => {
        if (!cancelled) {
          setStatus('success')
          setTimeout(() => {
            void navigate({ to: '/channels' })
          }, 1500)
        }
      })
      .catch((err: any) => {
        if (!cancelled) {
          setStatus('error')
          let msg = err?.message || 'Falha ao concluir conexão com o Instagram.'
          if (err?.code === 'EXTERNAL_ACCOUNT_CONFLICT' || msg.includes('already connected')) {
            msg =
              'Esta conta do Instagram já está conectada a outro workspace. Desconecte-a no outro workspace para poder conectá-la aqui.'
          }
          setErrorMessage(msg)
        }
      })

    return () => {
      cancelled = true
    }
  }, [code, state, error, error_description, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Conectar Instagram</CardTitle>
          <CardDescription>Finalizando conexão da conta profissional</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="size-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Conectando sua conta da Meta...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle2 className="size-10 text-emerald-600" />
              <p className="text-sm font-medium">Conta do Instagram conectada com sucesso!</p>
              <p className="text-xs text-muted-foreground">Redirecionando para seus canais...</p>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="size-10 text-destructive" />
              <p className="text-sm text-destructive">{errorMessage}</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => void navigate({ to: '/channels' })}
              >
                Voltar aos Canais
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
