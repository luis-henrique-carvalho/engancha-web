import { Link } from '@tanstack/react-router'
import { Activity, Play, Sliders } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AutomationDetailTabs({
  automationId,
  isConfigTab,
  isTestTab,
  isActivityTab,
}: {
  automationId: string
  isConfigTab: boolean
  isTestTab: boolean
  isActivityTab: boolean
}) {
  return (
    <div
      className="flex items-center gap-1 border-b pb-2 sm:gap-2"
      role="tablist"
      aria-label="Navegação da automação"
      data-testid="automation-detail-tabs"
    >
      <Link
        to={`/automations/${automationId}/identification` as any}
        role="tab"
        aria-selected={isConfigTab}
        className={cn(
          buttonVariants({ variant: isConfigTab ? 'secondary' : 'ghost', size: 'sm' }),
          isConfigTab ? 'bg-secondary font-semibold text-foreground' : 'text-muted-foreground',
          'gap-2 text-xs h-8 px-3',
        )}
        data-testid="tab-link-config"
      >
        <Sliders className="size-3.5" />
        Configuração
      </Link>
      <Link
        to={`/automations/${automationId}/test` as any}
        role="tab"
        aria-selected={isTestTab}
        className={cn(
          buttonVariants({ variant: isTestTab ? 'secondary' : 'ghost', size: 'sm' }),
          isTestTab ? 'bg-secondary font-semibold text-foreground' : 'text-muted-foreground',
          'gap-2 text-xs h-8 px-3',
        )}
        data-testid="tab-link-test"
      >
        <Play className="size-3.5" />
        Testar
      </Link>
      <Link
        to={`/automations/${automationId}/activity` as any}
        role="tab"
        aria-selected={isActivityTab}
        className={cn(
          buttonVariants({ variant: isActivityTab ? 'secondary' : 'ghost', size: 'sm' }),
          isActivityTab ? 'bg-secondary font-semibold text-foreground' : 'text-muted-foreground',
          'gap-2 text-xs h-8 px-3',
        )}
        data-testid="tab-link-activity"
      >
        <Activity className="size-3.5" />
        Atividade
      </Link>
    </div>
  )
}
