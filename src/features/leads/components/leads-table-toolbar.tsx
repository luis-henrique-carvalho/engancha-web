import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { LeadListQuery } from '@engancha/contracts'

export interface LeadsTableToolbarProps {
  params: Partial<LeadListQuery>
  hasActiveFilters: boolean
  onParamsChange: (params: Partial<LeadListQuery>) => void
}

export function LeadsTableToolbar({
  params,
  hasActiveFilters,
  onParamsChange,
}: LeadsTableToolbarProps) {
  const [searchInput, setSearchInput] = useState(params.query ?? '')

  useEffect(() => {
    setSearchInput(params.query ?? '')
  }, [params.query])

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim()
      if (trimmed !== (params.query ?? '')) {
        onParamsChange({
          ...params,
          query: trimmed || undefined,
          page: 1,
        })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput, params, onParamsChange])

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onParamsChange({
            ...params,
            query: searchInput.trim() || undefined,
            page: 1,
          })
        }}
        className="flex items-center gap-2 max-w-sm flex-1"
      >
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar lead por contato, @handle ou e-mail..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          className="h-9"
        >
          Buscar
        </Button>
      </form>

      <div className="flex items-center gap-2">
        <Select
          value={params.provider?.[0] ?? 'ALL'}
          onValueChange={(val) => {
            onParamsChange({
              ...params,
              provider: val === 'ALL' ? undefined : [val as 'INSTAGRAM' | 'TIKTOK'],
              page: 1,
            })
          }}
        >
          <SelectTrigger className="w-[140px] h-9 text-xs">
            <SelectValue placeholder="Canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos canais</SelectItem>
            <SelectItem value="INSTAGRAM">Instagram</SelectItem>
            <SelectItem value="TIKTOK">TikTok</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchInput('')
              onParamsChange({
                limit: params.limit,
                page: 1,
              })
            }}
            className="h-9 text-xs"
          >
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
