import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { ChannelsApi } from '@/features/channels/services/channels-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getProviderMetadata } from '@/features/channels/config/providers'
import { ChannelIcon } from '@/features/channels/components/channel-icon'

export const Route = createFileRoute('/oauth/$provider/callback')({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === 'string' ? search.code : '',
    state: typeof search.state === 'string' ? search.state : '',
    error: typeof search.error === 'string' ? search.error : '',
    error_description: typeof search.error_description === 'string' ? search.error_description : '',
  }),
  component: ProviderCallbackPage,
})

function ProviderCallbackPage() {
  const { provider } = Route.useParams()
  const { code, state, error, error_description } = Route.useSearch()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  const providerMeta = getProviderMetadata(provider || 'instagram')

  useEffect(() => {
    if (error || error_description) {
      setStatus('error')
      setErrorMessage(
        error_description ||
          error ||
          `A autorização com o ${providerMeta.name} foi recusada ou cancelada.`,
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

    ChannelsApi.completeOAuth({ provider: provider || 'instagram', code: cleanCode, state })
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
          let msg = err?.message || `Falha ao concluir conexão com ${providerMeta.name}.`
          if (err?.code === 'EXTERNAL_ACCOUNT_CONFLICT' || msg.includes('already connected')) {
            msg = `Esta conta do ${providerMeta.name} já está conectada a outro workspace. Desconecte-a no outro workspace para poder conectá-la aqui.`
          }
          setErrorMessage(msg)
        }
      })

    return () => {
      cancelled = true
    }
  }, [code, state, error, error_description, provider, providerMeta.name, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 p-3 rounded-full bg-muted/60 w-fit">
            <ChannelIcon
              provider={provider || 'instagram'}
              className="size-8"
            />
          </div>
          <CardTitle>Conectar {providerMeta.name}</CardTitle>
          <CardDescription>Finalizando conexão da sua conta</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="size-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Conectando sua conta com {providerMeta.name}...
              </p>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle2 className="size-10 text-emerald-600" />
              <p className="text-sm font-medium">
                Conta do {providerMeta.name} conectada com sucesso!
              </p>
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
