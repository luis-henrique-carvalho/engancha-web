import React from 'react'

export interface ChannelCardMetaItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

export function ChannelCardMetaItem({ icon, label, value }: ChannelCardMetaItemProps) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      {icon}
      <span className="text-[11px]">
        <span className="text-muted-foreground/60">{label}:</span>{' '}
        <span className="text-foreground/70 font-medium">{value}</span>
      </span>
    </div>
  )
}
