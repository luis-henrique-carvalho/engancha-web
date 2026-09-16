import { Check, Film, Image as ImageIcon } from 'lucide-react'
import type { ContentResponse } from '@engancha/contracts'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface ContentPickerCardProps {
  item: ContentResponse
  isSelected: boolean
  disabled: boolean
  onSelect: (item: ContentResponse) => void
}

export function ContentPickerCard({
  item,
  isSelected,
  disabled,
  onSelect,
}: ContentPickerCardProps) {
  return (
    <button
      type="button"
      data-testid={`content-card-${item.id}`}
      onClick={() => onSelect(item)}
      disabled={disabled}
      className={cn(
        'group relative flex flex-col justify-between rounded-lg border p-4 text-left transition-all hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isSelected
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-border bg-card hover:bg-accent/40',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold',
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground group-hover:bg-muted/80',
            )}
          >
            {item.contentType === 'VIDEO' ? (
              <Film className="size-4" />
            ) : (
              <ImageIcon className="size-4" />
            )}
          </div>
          <div>
            <h5 className="line-clamp-1 text-sm font-medium text-foreground">{item.title}</h5>
            <span className="line-clamp-1 text-xs text-muted-foreground font-mono">
              {item.externalContentId}
            </span>
          </div>
        </div>

        <div
          className={cn(
            'flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors',
            isSelected
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted-foreground/30 group-hover:border-muted-foreground',
          )}
        >
          {isSelected && <Check className="size-3 stroke-[3]" />}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-border/50">
        <Badge
          variant="secondary"
          className="text-[10px] px-1.5 py-0 uppercase"
        >
          {item.provider}
        </Badge>
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 uppercase"
        >
          {item.mode}
        </Badge>
      </div>
    </button>
  )
}
