import { apiFetch } from './api-client'
import { useAuthStore } from '@/stores/auth-store'
import type { AuthResult, LoginRequest, RegisterRequest, User } from '@/types/api'

export const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export function webCallbackUrl(path: string): string {
  const webOrigin =
    import.meta.env.VITE_WEB_ORIGIN ??
    (typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin)

  return new URL(path, webOrigin).toString()
}

export async function login(data: LoginRequest): Promise<AuthResult> {
  const result = await apiFetch<AuthResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  useAuthStore.getState().auth.setAuth(result.user, result.token)
  if (result.workspace?.id) {
    useAuthStore.getState().auth.setActiveWorkspaceId(result.workspace.id)
  }
  return result
}

export async function register(data: RegisterRequest): Promise<AuthResult> {
  const result = await apiFetch<AuthResult>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  useAuthStore.getState().auth.setAuth(result.user, result.token)
  if (result.workspace?.id) {
    useAuthStore.getState().auth.setActiveWorkspaceId(result.workspace.id)
  }
  return result
}

export async function getMe(): Promise<User> {
  const user = await apiFetch<User>('/auth/me', {
    method: 'GET',
  })
  useAuthStore.getState().auth.setUser(user)
  return user
}

export function logout(): void {
  useAuthStore.getState().auth.reset()
}

/**
 * Cliente de autenticação nativo compatível com as telas existentes
 */
export const authClient = {
  login,
  register,
  getMe,
  logout,
  signIn: {
    email: async (data: LoginRequest) => {
      try {
        const result = await login(data)
        return { data: result, error: null }
      } catch (err: any) {
        return { data: null, error: { message: err?.message ?? 'Erro ao autenticar' } }
      }
    },
    social: async (_opts: any) => {
      return { data: null, error: { message: 'Login social não configurado.' } }
    },
  },
  signUp: {
    email: async (data: RegisterRequest) => {
      try {
        const result = await register(data)
        return { data: result, error: null }
      } catch (err: any) {
        return { data: null, error: { message: err?.message ?? 'Erro ao cadastrar' } }
      }
    },
  },
  signOut: async () => {
    logout()
    return { data: true, error: null }
  },
  useSession: () => {
    const user = useAuthStore((s) => s.auth.user)
    const token = useAuthStore((s) => s.auth.accessToken)
    return {
      data: user ? { user, session: { token } } : null,
      isPending: false,
      error: null,
    }
  },
  requestPasswordReset: async (_opts: { email: string; redirectTo?: string }) => {
    return { data: true, error: null }
  },
  resetPassword: async (_opts: { newPassword: string; token?: string }) => {
    return { data: true, error: null }
  },
  verifyEmail: async (_opts: { query: { token: string } }) => {
    return { data: true, error: null }
  },
  sendVerificationEmail: async (_opts: { email: string; callbackURL?: string }) => {
    return { data: true, error: null }
  },
}
