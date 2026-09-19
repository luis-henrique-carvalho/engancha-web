import { z } from 'zod'
import { apiFetch } from '@/lib/api-client'

export const leadStatusSchema = z.enum([
  'IDENTIFIED',
  'CONTACT_REQUESTED',
  'CONTACT_INFO_PROVIDED',
  'FOLLOW_UP_SCHEDULED',
  'CONVERTED',
  'DISQUALIFIED',
])
export type LeadStatus = z.infer<typeof leadStatusSchema>

export const leadSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  contactId: z.string(),
  username: z.string(),
  status: leadStatusSchema,
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  lastInteractionAt: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
export type Lead = z.infer<typeof leadSchema>

export const leadListResponseSchema = z.object({
  items: z.array(leadSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
})
export type LeadListResponse = z.infer<typeof leadListResponseSchema>

export interface LeadListQuery {
  page?: number
  limit?: number
  status?: LeadStatus | LeadStatus[]
  query?: string
}

export const leadsQueryKeys = {
  all: ['leads'] as const,
  list: (params?: Partial<LeadListQuery>) => [...leadsQueryKeys.all, 'list', params] as const,
}

export const LeadsApi = {
  async list(query?: Partial<LeadListQuery>): Promise<LeadListResponse> {
    const params = new URLSearchParams(
      Object.entries(query ?? {})
        .filter(([, value]) => value !== undefined && value !== '')
        .flatMap(([key, value]) =>
          Array.isArray(value) ? value.map((item) => [key, String(item)]) : [[key, String(value)]],
        ),
    )

    const queryString = params.toString()
    const path = queryString ? `/leads?${queryString}` : '/leads'

    const data = await apiFetch<unknown>(path)
    return leadListResponseSchema.parse(data)
  },
}
