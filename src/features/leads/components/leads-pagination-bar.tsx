import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { PaginationMeta } from '@engancha/contracts'

export interface LeadsPaginationBarProps {
  meta: PaginationMeta
  isLoading: boolean
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

export function LeadsPaginationBar({
  meta,
  isLoading,
  onPageChange,
  onLimitChange,
}: LeadsPaginationBarProps) {
  const currentPage = meta.page
  const totalPages = meta.totalPages

  return (
    <div className="flex items-center justify-between px-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Select
          value={`${meta.limit}`}
          onValueChange={(value) => onLimitChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-17.5 text-xs">
            <SelectValue placeholder={meta.limit} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50, 100].map((pageSize) => (
              <SelectItem
                key={pageSize}
                value={`${pageSize}`}
              >
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs">
          Página {meta.total === 0 ? 0 : currentPage} de {totalPages} ({meta.total}{' '}
          {meta.total === 1 ? 'lead' : 'leads'})
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className="h-8 gap-1"
        >
          <ChevronLeft className="size-4" />
          <span>Anterior</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={totalPages === 0 || currentPage >= totalPages || isLoading}
          className="h-8 gap-1"
        >
          <span>Próxima</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
