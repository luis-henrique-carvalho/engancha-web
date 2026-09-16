import { z } from 'zod'
import type { WorkspaceMember } from '@/types/api'

export const userUiSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  role: z.enum(['owner', 'admin', 'member']),
  status: z.enum(['active', 'invited']),
  createdAt: z.string(),
})

export type User = WorkspaceMember
