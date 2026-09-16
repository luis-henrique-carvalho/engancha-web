import { getStoredToken, getStoredWorkspaceId } from '@/stores/auth-store'

export const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export interface ApiClientErrorOptions {
  status: number
  code?: string
  issues?: unknown
  requestId?: string
}

export class ApiClientError extends Error {
  readonly status: number
  readonly code?: string
  readonly issues?: unknown
  readonly requestId?: string

  constructor(message: string, options: ApiClientErrorOptions | number) {
    super(message)
    this.name = 'ApiClientError'
    if (typeof options === 'number') {
      this.status = options
    } else {
      this.status = options.status
      this.code = options.code
      this.issues = options.issues
      this.requestId = options.requestId
    }
  }
}

interface ApiErrorPayload {
  error?: string
  message?: string
  statusCode?: number
  code?: string
  requestId?: string
  issues?: unknown
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getStoredToken()
  const workspaceId = getStoredWorkspaceId()

  const headers = new Headers(init?.headers)
  if (!headers.has('content-type') && !(init?.body instanceof FormData)) {
    headers.set('content-type', 'application/json')
  }

  if (token && !headers.has('authorization') && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (workspaceId && !headers.has('x-workspace-id') && !headers.has('X-Workspace-ID')) {
    headers.set('X-Workspace-ID', workspaceId)
  }

  // Se o caminho já inicia com /v1 ou http, usa direto; caso contrário, prefixa com /v1
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const targetPath =
    cleanPath.startsWith('/v1') || cleanPath.startsWith('/health') || cleanPath.startsWith('/ready')
      ? cleanPath
      : `/v1${cleanPath}`

  const response = await fetch(`${apiBaseUrl}${targetPath}`, {
    ...init,
    headers,
  })

  // Retornos 204 No Content
  if (response.status === 204) {
    return {} as T
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('text/plain')) {
    const text = await response.text()
    return text as unknown as T
  }

  const body = (await response.json().catch(() => ({}))) as T & ApiErrorPayload

  if (!response.ok) {
    const requestId = response.headers.get('x-request-id') ?? body.requestId
    const errorMessage = body.error || body.message || 'Não foi possível concluir a operação.'
    throw new ApiClientError(errorMessage, {
      status: response.status,
      code: body.code,
      issues: body.issues,
      requestId: requestId ?? undefined,
    })
  }

  return body as T
}
