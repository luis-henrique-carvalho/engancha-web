import { Search } from 'lucide-react'
import type { MediaType } from '@/types/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export type MediaTypeFilter = 'ALL' | MediaType

export interface CreateAutomationGalleryFilterBarProps {
  search: string
  onSearchChange: (val: string) => void
  filterType: MediaTypeFilter
  onFilterTypeChange: (val: MediaTypeFilter) => void
}

export function CreateAutomationGalleryFilterBar({
  search,
  onSearchChange,
  filterType,
  onFilterTypeChange,
}: CreateAutomationGalleryFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="relative flex-1 min-w-[180px]">
        <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
        <Input
          placeholder="Buscar por legenda..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8.5 pl-8 text-xs bg-background/60"
        />
      </div>

      <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-0.5 text-xs">
        <Button
          type="button"
          variant={filterType === 'ALL' ? 'secondary' : 'ghost'}
          size="sm"
          className="h-7 px-2 text-[11px]"
          onClick={() => onFilterTypeChange('ALL')}
        >
          Todos
        </Button>
        <Button
          type="button"
          variant={filterType === 'REEL' ? 'secondary' : 'ghost'}
          size="sm"
          className="h-7 px-2 text-[11px]"
          onClick={() => onFilterTypeChange('REEL')}
        >
          Reels
        </Button>
        <Button
          type="button"
          variant={filterType === 'POST' ? 'secondary' : 'ghost'}
          size="sm"
          className="h-7 px-2 text-[11px]"
          onClick={() => onFilterTypeChange('POST')}
        >
          Posts
        </Button>
      </div>
    </div>
  )
}
