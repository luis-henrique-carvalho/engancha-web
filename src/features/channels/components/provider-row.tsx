import { Loader2, ArrowRight, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { type ChannelProviderMetadata } from '../config/providers'
import { ChannelIcon } from './channel-icon'

export interface ProviderRowProps {
  provider: ChannelProviderMetadata
  isConnecting: boolean
  onConnect: (p: ChannelProviderMetadata) => void
}

export function ProviderRow({ provider, isConnecting, onConnect }: ProviderRowProps) {
  const unavailable = !provider.isAvailable

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-xl border px-4 py-3 transition-all',
        unavailable
          ? 'border-border/40 bg-muted/20 opacity-60'
          : 'border-border/70 bg-card hover:border-primary/40 hover:bg-accent/30',
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex items-center justify-center rounded-xl size-10 shrink-0',
          provider.bgLightClass,
        )}
      >
        <ChannelIcon
          provider={provider.id}
          className="size-5"
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium leading-tight truncate">{provider.name}</span>
          {unavailable && (
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 shrink-0"
            >
              Em breve
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{provider.description}</p>
        {provider.scopesInfo && (
          <p className="text-[10px] text-muted-foreground/60 mt-0.5 line-clamp-1">
            {provider.scopesInfo}
          </p>
        )}
      </div>

      {/* Action */}
      {unavailable ? (
        <Lock className="size-4 text-muted-foreground/40 shrink-0" />
      ) : (
        <Button
          size="sm"
          className="shrink-0 h-8 px-3 text-xs"
          disabled={isConnecting}
          onClick={() => onConnect(provider)}
        >
          {isConnecting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <>
              Conectar
              <ArrowRight className="ms-1 size-3" />
            </>
          )}
        </Button>
      )}
    </div>
  )
}
