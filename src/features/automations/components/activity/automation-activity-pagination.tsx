import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { AutomationActivityPageButtons } from './automation-activity-page-buttons'

export interface AutomationActivityPaginationProps {
  page: number
  limit: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
  onPageSizeChange: (limit: number) => void
  className?: string
}

export function AutomationActivityPagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  className,
}: AutomationActivityPaginationProps) {
  const currentPage = Math.max(1, page)
  const safeTotalPages = Math.max(1, totalPages)

  return (
    <div
      className={cn(
        'flex items-center justify-between overflow-clip px-2',
        '@max-2xl/content:flex-col-reverse @max-2xl/content:gap-4',
        className,
      )}
      style={{ overflowClipMargin: 1 }}
      data-testid="activity-pagination"
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex w-25 items-center justify-center text-xs font-medium text-muted-foreground @2xl/content:hidden">
          Página {currentPage} de {safeTotalPages} ({total} itens)
        </div>

        <div className="flex items-center gap-2 @max-2xl/content:flex-row-reverse">
          <Select
            value={`${limit}`}
            onValueChange={(value) => {
              onPageSizeChange(Number(value))
            }}
          >
            <SelectTrigger
              className="h-8 w-17.5 text-xs"
              data-testid="activity-page-size-trigger"
            >
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={`${pageSize}`}
                  className="text-xs"
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="hidden text-xs font-medium text-muted-foreground sm:block">
            Itens por página
          </p>
        </div>
      </div>

      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex w-36 items-center justify-center text-xs font-medium text-muted-foreground @max-3xl/content:hidden">
          Página {currentPage} de {safeTotalPages} ({total} itens)
        </div>

        <AutomationActivityPageButtons
          currentPage={currentPage}
          safeTotalPages={safeTotalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}
