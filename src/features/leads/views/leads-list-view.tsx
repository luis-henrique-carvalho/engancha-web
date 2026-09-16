import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import type { LeadListQuery } from '@engancha/contracts'
import { useLeadsList } from '../hooks/use-leads-list'
import { LeadsTable } from '../components/leads-table'

export function LeadsHeader() {
  return (
    <Header fixed>
      <Search className="me-auto" />
      <ThemeSwitch />
      <ConfigDrawer />
      <ProfileDropdown />
    </Header>
  )
}

type Props = {
  workspaceId: string
  params: Partial<LeadListQuery>
  onParamsChange: (params: Partial<LeadListQuery>) => void
}

export function LeadsListView({ params, onParamsChange }: Props) {
  const { data, isLoading, isError, error, refetch } = useLeadsList(params)

  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Leads</h2>
          <p className="text-muted-foreground">
            Acompanhe contatos convertidos com e-mail capturado, primeira atribuição e tags.
          </p>
        </div>
      </div>

      {isError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive flex items-center justify-between">
          <span>Falha ao carregar leads: {(error as Error)?.message || 'Erro inesperado'}</span>
          <button
            onClick={() => void refetch()}
            className="underline font-medium hover:opacity-80"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <LeadsTable
        data={data?.items ?? []}
        isLoading={isLoading}
        meta={
          data?.meta ?? {
            page: params.page ?? 1,
            limit: params.limit ?? 20,
            total: 0,
            totalPages: 0,
          }
        }
        params={params}
        onParamsChange={onParamsChange}
      />
    </div>
  )
}
