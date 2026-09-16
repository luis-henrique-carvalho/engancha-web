import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { getPageNumbers } from '@/lib/utils'

interface AutomationActivityPageButtonsProps {
  currentPage: number
  safeTotalPages: number
  onPageChange: (page: number) => void
}

export function AutomationActivityPageButtons({
  currentPage,
  safeTotalPages,
  onPageChange,
}: AutomationActivityPageButtonsProps) {
  const pageNumbers = getPageNumbers(currentPage, safeTotalPages)

  return (
    <div className="flex items-center space-x-1.5">
      <Button
        variant="outline"
        className="size-8 p-0 @max-md/content:hidden"
        onClick={() => onPageChange(1)}
        disabled={currentPage <= 1}
        data-testid="activity-first-page-button"
      >
        <span className="sr-only">Primeira página</span>
        <DoubleArrowLeftIcon className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        className="size-8 p-0"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        data-testid="activity-prev-page-button"
      >
        <span className="sr-only">Página anterior</span>
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>

      {pageNumbers.map((pageNumber, index) => (
        <div
          key={`${pageNumber}-${index}`}
          className="flex items-center"
        >
          {pageNumber === '...' ? (
            <span className="px-1 text-xs text-muted-foreground">...</span>
          ) : (
            <Button
              variant={currentPage === pageNumber ? 'default' : 'outline'}
              className="h-8 min-w-8 px-2 text-xs"
              onClick={() => onPageChange(pageNumber as number)}
              data-testid={`activity-page-${pageNumber}-button`}
            >
              <span className="sr-only">Página {pageNumber}</span>
              {pageNumber}
            </Button>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        className="size-8 p-0"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= safeTotalPages}
        data-testid="activity-next-page-button"
      >
        <span className="sr-only">Próxima página</span>
        <ChevronRightIcon className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        className="size-8 p-0 @max-md/content:hidden"
        onClick={() => onPageChange(safeTotalPages)}
        disabled={currentPage >= safeTotalPages}
        data-testid="activity-last-page-button"
      >
        <span className="sr-only">Última página</span>
        <DoubleArrowRightIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
