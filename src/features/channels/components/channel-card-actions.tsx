import { RefreshCw, Unlink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export interface ChannelCardActionsProps {
  isDisconnected: boolean
  isRevalidating: boolean
  isDisconnecting: boolean
  isReconnecting: boolean
  onRevalidate: () => void
  onDisconnect: () => void
  onReconnect: () => void
}

export function ChannelCardActions({
  isDisconnected,
  isRevalidating,
  isDisconnecting,
  isReconnecting,
  onRevalidate,
  onDisconnect,
  onReconnect,
}: ChannelCardActionsProps) {
  if (isDisconnected) {
    return (
      <div className="mt-auto flex items-center gap-2 border-t px-5 py-3">
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex-1 text-xs"
          onClick={onReconnect}
          disabled={isReconnecting}
        >
          {isReconnecting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <>
              <RefreshCw className="me-1.5 size-3.5" />
              Reconectar
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-auto flex items-center gap-2 border-t px-5 py-3">
      <Button
        variant="outline"
        size="sm"
        className="h-8 flex-1 text-xs"
        onClick={onRevalidate}
        disabled={isRevalidating}
      >
        {isRevalidating ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <>
            <RefreshCw className="me-1.5 size-3.5" />
            Revalidar
          </>
        )}
      </Button>

      <Separator
        orientation="vertical"
        className="h-5"
      />

      <Button
        variant="ghost"
        size="sm"
        className="h-8 flex-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={onDisconnect}
        disabled={isDisconnecting}
      >
        {isDisconnecting ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <>
            <Unlink className="me-1.5 size-3.5" />
            Desconectar
          </>
        )}
      </Button>
    </div>
  )
}
