import { create } from 'zustand'
import type { User } from '@/types/api'

const TOKEN_KEY = 'engancha_token'
const USER_KEY = 'engancha_user'
const WORKSPACE_ID_KEY = 'engancha_workspace_id'

export function getStoredToken(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(TOKEN_KEY) ?? ''
}

export function getStoredWorkspaceId(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(WORKSPACE_ID_KEY) ?? ''
}

export function setStoredWorkspaceId(workspaceId: string): void {
  if (typeof window === 'undefined') return
  if (workspaceId) {
    localStorage.setItem(WORKSPACE_ID_KEY, workspaceId)
  } else {
    localStorage.removeItem(WORKSPACE_ID_KEY)
  }
}

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

interface AuthState {
  auth: {
    user: User | null
    accessToken: string
    activeWorkspaceId: string
    setUser: (user: User | null) => void
    setAccessToken: (accessToken: string) => void
    setActiveWorkspaceId: (workspaceId: string) => void
    setAuth: (user: User, accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const initToken = getStoredToken()
  const initUser = getStoredUser()
  const initWorkspaceId = getStoredWorkspaceId()

  return {
    auth: {
      user: initUser,
      accessToken: initToken,
      activeWorkspaceId: initWorkspaceId,
      setUser: (user) =>
        set((state) => {
          if (typeof window !== 'undefined') {
            if (user) {
              localStorage.setItem(USER_KEY, JSON.stringify(user))
            } else {
              localStorage.removeItem(USER_KEY)
            }
          }
          return { ...state, auth: { ...state.auth, user } }
        }),
      setAccessToken: (accessToken) =>
        set((state) => {
          if (typeof window !== 'undefined') {
            if (accessToken) {
              localStorage.setItem(TOKEN_KEY, accessToken)
            } else {
              localStorage.removeItem(TOKEN_KEY)
            }
          }
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      setActiveWorkspaceId: (activeWorkspaceId) =>
        set((state) => {
          setStoredWorkspaceId(activeWorkspaceId)
          return { ...state, auth: { ...state.auth, activeWorkspaceId } }
        }),
      setAuth: (user, accessToken) =>
        set((state) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(USER_KEY, JSON.stringify(user))
            localStorage.setItem(TOKEN_KEY, accessToken)
          }
          return { ...state, auth: { ...state.auth, user, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY)
          }
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY)
            localStorage.removeItem(USER_KEY)
            localStorage.removeItem(WORKSPACE_ID_KEY)
          }
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '', activeWorkspaceId: '' },
          }
        }),
    },
  }
})
