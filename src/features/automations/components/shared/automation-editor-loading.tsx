import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export function AutomationEditorLoading() {
  return (
    <div
      className="space-y-6"
      data-testid="automation-editor-loading"
    >
      <div className="flex items-center gap-4">
        <Skeleton className="size-9 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-6 md:flex-row">
        <Skeleton className="h-64 w-full md:w-56" />
        <Skeleton className="h-96 flex-1" />
      </div>
    </div>
  )
}
