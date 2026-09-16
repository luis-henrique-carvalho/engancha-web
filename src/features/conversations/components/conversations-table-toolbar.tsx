import { useState } from 'react'
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
import type { ListConversationsParams } from '../services/conversations-api'

export interface ConversationsTableToolbarProps {
  params: Partial<ListConversationsParams>
  onParamsChange: (params: Partial<ListConversationsParams>) => void
}

export function ConversationsTableToolbar({
  params,
  onParamsChange,
}: ConversationsTableToolbarProps) {
  const [searchInput, setSearchInput] = useState(params.query ?? '')

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onParamsChange({ ...params, query: searchInput.trim() || undefined, page: 1 })
        }}
        className="flex items-center gap-2 max-w-sm flex-1"
      >
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por contato, e-mail ou mensagem..."
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
          value={params.status?.[0] ?? 'ALL'}
          onValueChange={(val) => {
            const status = val === 'ALL' ? undefined : [val as any]
            onParamsChange({ ...params, status, page: 1 })
          }}
        >
          <SelectTrigger className="h-9 w-[150px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os status</SelectItem>
            <SelectItem value="OPEN">Aberta</SelectItem>
            <SelectItem value="CLOSED">Fechada</SelectItem>
          </SelectContent>
        </Select>

        {(params.query || params.status?.length) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchInput('')
              onParamsChange({ page: 1, limit: params.limit })
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
