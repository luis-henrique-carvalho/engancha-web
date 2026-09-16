import { Bot, Contact, LayoutDashboard, MessageSquare, Share2, UsersRound } from 'lucide-react'
import type { ActiveWorkspace } from '@/types/api'
import type { SidebarData, User } from '../types'

type SidebarDataInput = {
  user: User
  workspace: ActiveWorkspace
}

export function createSidebarData({ user, workspace }: SidebarDataInput): SidebarData {
  return {
    user,
    workspace,
    navGroups: [
      {
        title: 'Geral',
        items: [
          {
            title: 'Workspace',
            url: '/workspace',
            icon: LayoutDashboard,
          },
          {
            title: 'Automações',
            url: '/automations',
            icon: Bot,
          },
          {
            title: 'Canais',
            url: '/channels',
            icon: Share2,
          },
          {
            title: 'Conversas',
            url: '/conversations',
            icon: MessageSquare,
          },
          {
            title: 'Contatos',
            url: '/contacts',
            icon: Contact,
          },
          {
            title: 'Membros',
            url: '/users',
            icon: UsersRound,
          },
        ],
      },
    ],
  }
}
