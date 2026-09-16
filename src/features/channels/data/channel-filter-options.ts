import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import type { ChannelStatus } from '@/types/api'
import { CHANNEL_PROVIDERS } from '../config/providers'

export const channelStatusOptions: {
  label: string
  value: ChannelStatus
  icon?: React.ComponentType<{ className?: string }>
}[] = [
  {
    label: 'Ativo',
    value: 'ACTIVE',
    icon: CheckCircle2,
  },
  {
    label: 'Expirado',
    value: 'EXPIRED',
    icon: AlertCircle,
  },
  {
    label: 'Desconectado',
    value: 'DISCONNECTED',
    icon: XCircle,
  },
  {
    label: 'Revogado',
    value: 'REVOKED',
    icon: XCircle,
  },
  {
    label: 'Erro',
    value: 'ERROR',
    icon: AlertCircle,
  },
]

export const channelProviderOptions = CHANNEL_PROVIDERS.map((p) => ({
  label: p.shortName,
  value: p.id,
}))
