import React from 'react'
import { Instagram, MessageSquare, Globe } from 'lucide-react'
import { IconWhatsapp, IconTelegram } from '@/assets/brand-icons'
import { cn } from '@/lib/utils'

interface ChannelIconProps extends React.SVGProps<SVGSVGElement> {
  provider: string
  className?: string
}

export function ChannelIcon({ provider, className, ...props }: ChannelIconProps) {
  const p = provider?.toLowerCase() || ''

  switch (p) {
    case 'instagram':
      return <Instagram className={cn('size-4 text-pink-600 dark:text-pink-400', className)} {...props} />
    case 'whatsapp':
      return <IconWhatsapp className={cn('size-4 text-emerald-600 dark:text-emerald-400', className)} {...props} />
    case 'telegram':
      return <IconTelegram className={cn('size-4 text-blue-500 dark:text-blue-400', className)} {...props} />
    case 'twitter':
    case 'x':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cn('size-4 text-sky-500 dark:text-sky-400', className)}
          {...props}
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cn('size-4 text-neutral-900 dark:text-neutral-100', className)}
          {...props}
        >
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.32a6.34 6.34 0 0 0-.86-.06A6.33 6.33 0 0 0 3.15 15.6a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.81-.06 4.88 4.88 0 0 1-1.38-.4z" />
        </svg>
      )
    default:
      return <Globe className={cn('size-4 text-muted-foreground', className)} {...props} />
  }
}
