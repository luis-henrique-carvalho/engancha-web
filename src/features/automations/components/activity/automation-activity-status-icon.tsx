import { AlertCircle, Bot, HelpCircle, MessageCircle, RefreshCw } from 'lucide-react'
import type { ExecutionStatus } from '@engancha/contracts'
import { cn } from '@/lib/utils'

export function AutomationActivityStatusIcon({ status }: { status: ExecutionStatus }) {
  return (
    <div
      className={cn(
        'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full',
        status === 'COMPLETED' && 'bg-primary/10 text-primary',
        status === 'PROCESSING' && 'bg-secondary text-secondary-foreground',
        status === 'PENDING' && 'bg-muted text-muted-foreground',
        status === 'IGNORED' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        status === 'FAILED' && 'bg-destructive/10 text-destructive',
      )}
    >
      {status === 'COMPLETED' && <Bot className="size-4" />}
      {status === 'PROCESSING' && <RefreshCw className="size-4 animate-spin" />}
      {status === 'PENDING' && <MessageCircle className="size-4" />}
      {status === 'IGNORED' && <HelpCircle className="size-4" />}
      {status === 'FAILED' && <AlertCircle className="size-4" />}
    </div>
  )
}
