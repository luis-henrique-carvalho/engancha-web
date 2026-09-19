import { Check } from 'lucide-react'
import type { ChannelConnection } from '@/types/api'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export interface CreateAutomationChannelPickerItemProps {
  channel: ChannelConnection
  isSelected: boolean
  onSelect: () => void
}

function getInitials(name?: string): string {
  if (!name) return 'CH'
  return name.replace(/^@/, '').trim().slice(0, 2).toUpperCase()
}

export function CreateAutomationChannelPickerItem({
  channel,
  isSelected,
  onSelect,
}: CreateAutomationChannelPickerItemProps) {
  return (
    <DropdownMenuItem
      onSelect={onSelect}
      onClick={onSelect}
      className={cn(
        'flex items-center justify-between gap-2.5 rounded-lg px-2 py-2 cursor-pointer',
        isSelected && 'bg-accent font-medium',
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Avatar className="size-7 rounded-md">
          <AvatarImage
            src={channel.profilePictureUrl ?? undefined}
            alt={channel.accountName}
          />
          <AvatarFallback className="text-[10px] bg-muted font-semibold">
            {getInitials(channel.accountName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-xs text-foreground">{channel.accountName}</p>
        </div>
      </div>

      {isSelected && <Check className="size-4 shrink-0 text-primary" />}
    </DropdownMenuItem>
  )
}
