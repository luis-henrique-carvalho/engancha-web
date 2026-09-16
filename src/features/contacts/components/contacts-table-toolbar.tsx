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
import type { ListContactsParams } from '../services/contacts-api'

export interface ContactsTableToolbarProps {
  params: Partial<ListContactsParams>
  onParamsChange: (params: Partial<ListContactsParams>) => void
}

export function ContactsTableToolbar({ params, onParamsChange }: ContactsTableToolbarProps) {
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
            placeholder="Buscar por @handle, nome ou e-mail..."
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
            const provider = val === 'ALL' ? undefined : [val]
            onParamsChange({ ...params, provider, page: 1 })
          }}
        >
          <SelectTrigger className="h-9 w-[140px] text-xs">
            <SelectValue placeholder="Canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os canais</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="twitter">X (Twitter)</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="telegram">Telegram</SelectItem>
          </SelectContent>
        </Select>

        {(params.query || params.provider?.length) && (
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
