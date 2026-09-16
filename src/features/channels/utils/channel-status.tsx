import React from 'react'
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react'

export type ChannelStatus = 'ACTIVE' | 'EXPIRED' | 'DISCONNECTED' | 'REVOKED' | 'ERROR' | string

export interface StatusConfig {
  label: string
  icon: React.ReactNode
  className: string
}

export function getStatusConfig(status: ChannelStatus): StatusConfig {
  switch (status) {
    case 'ACTIVE':
      return {
        label: 'Ativo',
        icon: <CheckCircle2 className="size-3" />,
        className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      }
    case 'EXPIRED':
      return {
        label: 'Expirado',
        icon: <AlertCircle className="size-3" />,
        className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20',
      }
    case 'DISCONNECTED':
    case 'REVOKED':
      return {
        label: status === 'REVOKED' ? 'Revogado' : 'Desconectado',
        icon: <XCircle className="size-3" />,
        className: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20',
      }
    default:
      return {
        label: status,
        icon: <AlertCircle className="size-3" />,
        className: 'bg-muted text-muted-foreground border-border',
      }
  }
}

export function formatChannelDate(date?: string | null) {
  if (!date) return null
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
