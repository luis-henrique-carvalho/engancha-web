import type {
  SimulationCommentRequest,
  SimulationCommentResponse,
  SimulationExecutionListQuery,
  SimulationExecutionListResponse,
  SimulationExecutionResponse,
} from '@engancha/contracts'
import { apiFetch } from '@/lib/api-client'
import { apiBaseUrl } from '@/lib/auth-client'

export const SimulationsApi = {
  async submitComment(body: SimulationCommentRequest): Promise<SimulationCommentResponse> {
    const data = await apiFetch<SimulationCommentResponse>('/simulations/comments', {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return data
  },

  async getExecution(executionId: string): Promise<SimulationExecutionResponse> {
    const data = await apiFetch<SimulationExecutionResponse>(
      `/simulations/executions/${executionId}`,
    )
    return data
  },

  async listExecutions(
    params: SimulationExecutionListQuery = { page: 1, limit: 50 },
  ): Promise<SimulationExecutionListResponse> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', String(params.page))
    if (params.limit) searchParams.set('limit', String(params.limit))
    if (params.status) searchParams.set('status', params.status)
    if (params.automationId) searchParams.set('automationId', params.automationId)
    if (params.contentId) searchParams.set('contentId', params.contentId)

    const query = searchParams.toString()
    const path = query ? `/simulations/executions?${query}` : '/simulations/executions'
    const data = await apiFetch<SimulationExecutionListResponse>(path)
    return data
  },

  getExecutionStreamUrl(executionId: string): string {
    return `${apiBaseUrl()}/simulations/executions/${executionId}/stream`
  },

  async retryExecution(executionId: string): Promise<SimulationExecutionResponse> {
    const data = await apiFetch<SimulationExecutionResponse>(
      `/simulations/executions/${executionId}/retry`,
      {
        method: 'POST',
      },
    )
    return data
  },

  getEventsUrl(executionId: string): string {
    return `${apiBaseUrl()}/simulations/executions/${executionId}/events`
  },

  async submitEmailCaptureResponse(
    conversationId: string,
    captureId: string,
    body: { email: string; idempotencyKey: string },
  ) {
    return await apiFetch<unknown>(
      `/conversations/${conversationId}/email-captures/${captureId}/responses`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    )
  },
}
