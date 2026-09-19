import { Send } from 'lucide-react'

export interface CreateAutomationPreviewDirectProps {
  displayAccount: string
  privateReplyText: string
}

export function CreateAutomationPreviewDirect({
  displayAccount,
  privateReplyText,
}: CreateAutomationPreviewDirectProps) {
  return (
    <div className="flex flex-col rounded-xl border bg-background/80 p-3.5 shadow-xs">
      <div className="mb-2.5 flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <Send className="size-3.5 text-blue-500" />
          <span>Direct Message (Privado)</span>
        </div>
        <span className="text-[10px] font-medium text-muted-foreground">Chat 1:1</span>
      </div>

      <div className="flex flex-col justify-end space-y-2 flex-1 min-h-[140px]">
        <div className="flex items-end gap-2">
          <div className="size-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
            A
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-bl-xs border border-primary/20 bg-primary/10 p-2.5 text-xs leading-relaxed text-foreground shadow-xs">
            <p className="text-[10px] font-semibold text-primary mb-0.5">{displayAccount}</p>
            <p className="whitespace-pre-line">
              {privateReplyText || (
                <span className="italic text-muted-foreground">
                  (Nenhuma mensagem de direct configurada)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
