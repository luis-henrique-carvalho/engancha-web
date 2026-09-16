import { useState, useMemo } from 'react'
import type { ContentResponse } from '@engancha/contracts'
import { Skeleton } from '@/components/ui/skeleton'
import { useSimulatedContents } from '../../hooks/use-simulated-contents'
import { CreateSimulatedContentDialog } from '../simulation/create-simulated-content-dialog'
import { ContentPickerCard } from './content-picker-card'
import { ContentPickerEmpty } from './content-picker-empty'
import { ContentPickerToolbar } from './content-picker-toolbar'

interface ContentPickerProps {
  workspaceId: string
  value?: string | null
  onChange: (contentId: string | null) => void
  disabled?: boolean
}

export function ContentPicker({
  workspaceId,
  value,
  onChange,
  disabled = false,
}: ContentPickerProps) {
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data, isLoading, isError } = useSimulatedContents(workspaceId)
  const items = data?.items ?? []

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items
    const query = search.toLowerCase()
    return items.filter(
      (item: ContentResponse) =>
        item.title.toLowerCase().includes(query) ||
        item.externalContentId.toLowerCase().includes(query),
    )
  }, [items, search])

  const handleSelect = (item: ContentResponse) => {
    if (disabled) return
    onChange(value === item.id ? null : item.id)
  }

  const handleCreated = (createdItem: ContentResponse) => {
    onChange(createdItem.id)
  }

  return (
    <div
      className="space-y-4"
      data-testid="content-picker"
    >
      <ContentPickerToolbar
        search={search}
        onSearchChange={setSearch}
        onOpenDialog={() => setIsDialogOpen(true)}
        disabled={disabled}
        isLoading={isLoading}
      />

      {isLoading && (
        <div
          className="space-y-2"
          data-testid="content-picker-loading"
        >
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Não foi possível carregar os conteúdos simulados.
        </div>
      )}

      {!isLoading && !isError && filteredItems.length === 0 && (
        <ContentPickerEmpty
          search={search}
          disabled={disabled}
          onOpenDialog={() => setIsDialogOpen(true)}
        />
      )}

      {!isLoading && !isError && filteredItems.length > 0 && (
        <div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          data-testid="content-picker-list"
        >
          {filteredItems.map((item: ContentResponse) => (
            <ContentPickerCard
              key={item.id}
              item={item}
              isSelected={value === item.id}
              disabled={disabled}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      <CreateSimulatedContentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        workspaceId={workspaceId}
        onCreated={handleCreated}
      />
    </div>
  )
}
