import { Cross2Icon } from '@radix-ui/react-icons'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ChannelStatus } from '@/types/api'
import { channelProviderOptions, channelStatusOptions } from '../data/channel-filter-options'

export interface ChannelFilters {
  query?: string
  status?: ChannelStatus[]
  provider?: string[]
}

export interface ChannelsToolbarProps {
  filters: ChannelFilters
  onFiltersChange: (filters: ChannelFilters) => void
  onReset: () => void
}

export function ChannelsToolbar({ filters, onFiltersChange, onReset }: ChannelsToolbarProps) {
  const isFiltered = Boolean(
    filters.query ||
    (filters.status && filters.status.length > 0) ||
    (filters.provider && filters.provider.length > 0),
  )

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-2"
      data-testid="channels-toolbar"
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Buscar canal por nome..."
          value={filters.query || ''}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              query: event.target.value || undefined,
            })
          }
          className="h-8 w-44 text-xs lg:w-64"
          data-testid="channels-search-input"
        />

        <DataTableFacetedFilter
          title="Status"
          options={channelStatusOptions}
          selectedValues={filters.status}
          onValuesChange={(status) =>
            onFiltersChange({
              ...filters,
              status: status as ChannelStatus[] | undefined,
            })
          }
        />

        <DataTableFacetedFilter
          title="Provedor"
          options={channelProviderOptions}
          selectedValues={filters.provider}
          onValuesChange={(provider) =>
            onFiltersChange({
              ...filters,
              provider: provider as string[] | undefined,
            })
          }
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={onReset}
            className="h-8 px-2 text-xs lg:px-3"
            data-testid="channels-reset-filters"
          >
            Limpar filtros
            <Cross2Icon className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
