import type { ChannelProvider } from '@/types/api'

export interface ChannelProviderMetadata {
  id: ChannelProvider
  name: string
  shortName: string
  description: string
  colorClass: string
  bgLightClass: string
  isAvailable: boolean
  tag?: string
  scopesInfo: string
}

export const CHANNEL_PROVIDERS: ChannelProviderMetadata[] = [
  {
    id: 'instagram',
    name: 'Instagram Professional',
    shortName: 'Instagram',
    description: 'Automatize respostas públicas em posts/reels e envie DMs instantâneas.',
    colorClass: 'text-pink-600 dark:text-pink-400',
    bgLightClass: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    isAvailable: true,
    scopesInfo: 'Contas profissionais (Business ou Creator) com permissão de mensagens.',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    shortName: 'WhatsApp',
    description: 'Integre fluxos de conversa e disparo de mensagens via Cloud API.',
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgLightClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    isAvailable: false,
    tag: 'Em breve',
    scopesInfo: 'Requer número cadastrado na Meta Cloud API.',
  },
  {
    id: 'twitter',
    name: 'X (antigo Twitter)',
    shortName: 'X / Twitter',
    description: 'Responda a menções e envie DMs automatizadas a seguidores.',
    colorClass: 'text-sky-500 dark:text-sky-400',
    bgLightClass: 'bg-sky-500/10 text-sky-500 dark:text-sky-400',
    isAvailable: false,
    tag: 'Em breve',
    scopesInfo: 'Permissões de leitura e envio de tweets e DMs.',
  },
  {
    id: 'tiktok',
    name: 'TikTok for Business',
    shortName: 'TikTok',
    description: 'Engaje leads e responda automaticamente a comentários em vídeos.',
    colorClass: 'text-neutral-900 dark:text-neutral-100',
    bgLightClass: 'bg-neutral-500/10 text-neutral-900 dark:text-neutral-100',
    isAvailable: false,
    tag: 'Em breve',
    scopesInfo: 'Contas comerciais TikTok.',
  },
  {
    id: 'telegram',
    name: 'Telegram Bot',
    shortName: 'Telegram',
    description: 'Conecte bots para atendimento rápido e canais de relacionamento.',
    colorClass: 'text-blue-500 dark:text-blue-400',
    bgLightClass: 'bg-blue-500/10 text-blue-500 dark:text-blue-400',
    isAvailable: false,
    tag: 'Em breve',
    scopesInfo: 'Token de bot via BotFather.',
  },
]

export function getProviderMetadata(provider: string): ChannelProviderMetadata {
  const found = CHANNEL_PROVIDERS.find((p) => p.id.toLowerCase() === provider?.toLowerCase())
  if (found) return found

  const normalized = provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : 'Canal'
  return {
    id: provider as ChannelProvider,
    name: normalized,
    shortName: normalized,
    description: `Canal ${normalized} integrado.`,
    colorClass: 'text-primary',
    bgLightClass: 'bg-primary/10 text-primary',
    isAvailable: true,
    scopesInfo: '',
  }
}
