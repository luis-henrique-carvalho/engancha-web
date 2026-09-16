import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { authClient, webCallbackUrl } from '@/lib/auth-client'

export const userAuthFormSchema = z.object({
  email: z.email({
    error: (issue) => (issue.input === '' ? 'Informe seu e-mail.' : 'Informe um e-mail válido.'),
  }),
  password: z.string().min(1, 'Informe sua senha.'),
})

export type UserAuthFormValues = z.infer<typeof userAuthFormSchema>

export function useUserAuthForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const form = useForm<UserAuthFormValues>({
    resolver: zodResolver(userAuthFormSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: UserAuthFormValues) {
    setIsLoading(true)
    setError('')
    try {
      await authClient.login(data)
      await navigate({ to: '/' })
    } catch (err: any) {
      setError(err?.message || 'Não foi possível entrar. Verifique os dados ou credenciais.')
    } finally {
      setIsLoading(false)
    }
  }

  async function signInWithGoogle() {
    setError('')
    const result = await authClient.signIn.social({
      provider: 'google',
      callbackURL: webCallbackUrl('/workspace'),
    })
    if (result.error) setError('O acesso com Google não pôde ser concluído.')
  }

  return {
    form,
    isLoading,
    error,
    onSubmit,
    signInWithGoogle,
  }
}
