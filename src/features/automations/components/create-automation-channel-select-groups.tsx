import type { ChannelConnection } from '@/types/api'
import { SelectGroup, SelectItem, SelectLabel } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChannelIcon } from '@/features/channels/components/channel-icon'
import { getProviderMetadata } from '@/features/channels/config/providers'

export interface CreateAutomationChannelSelectGroupsProps {
  groupedChannels: Array<{ provider: string; items: ChannelConnection[] }>
}

function getInitials(name?: string): string {
  if (!name) return 'CH'
  return name.replace(/^@/, '').trim().slice(0, 2).toUpperCase()
}

export function CreateAutomationChannelSelectGroups({
  groupedChannels,
}: CreateAutomationChannelSelectGroupsProps) {
  return (
    <>
      {groupedChannels.map((group) => {
        const meta = getProviderMetadata(group.provider)
        return (
          <SelectGroup key={group.provider}>
            <SelectLabel className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
              <ChannelIcon
                provider={group.provider}
                className="size-3"
              />
              <span>{meta.name}</span>
            </SelectLabel>

            {group.items.map((c) => (
              <SelectItem
                key={c.id}
                value={c.id}
                className="flex items-center justify-between gap-2.5 rounded-lg px-2 py-2 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar className="size-7 rounded-md">
                    <AvatarImage
                      src={c.profilePictureUrl ?? undefined}
                      alt={c.accountName}
                    />
                    <AvatarFallback className="text-[10px] bg-muted font-semibold">
                      {getInitials(c.accountName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-xs text-foreground font-medium">{c.accountName}</p>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )
      })}
    </>
  )
}
