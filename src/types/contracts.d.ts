/**
 * Declaração de compatibilidade transitória para @engancha/contracts.
 * Mapeia os novos contratos de @/types/api e provê fallbacks para tipos de simulação obsoletos.
 */

declare module '@engancha/contracts' {
  export * from '@/types/api'

  export type AutomationListRequest = any
  export type AutomationListResponse = any
  export type AutomationResponse = any
  export type PatchAutomationRequest = any
  export type TagListResponse = any
  export type TagResponse = any
  export type CreateTagRequest = any
  export type CreateContentRequest = any
  export type ContentResponse = any
  export type ContentListResponse = any
  export type PaginationRequest = any
  export type SimulationExecutionResponse = any
  export type SimulationExecutionListQuery = any
  export type SimulationExecutionListResponse = any
  export type SimulationCommentRequest = any
  export type SimulationCommentResponse = any
  export type ExecutionStatus = any
  export type AutomationAction = any
  export type ContactListQuery = any
  export type ContactListResponse = any
  export type ContactSummary = any
  export type ConversationListQuery = any
  export type ConversationListResponse = any
  export type ConversationDetailResponse = any
  export type ConversationSummary = any
  export type ConversationMessage = any
  export type LeadListQuery = any
  export type LeadListResponse = any
  export type LeadSummary = any
  export type WorkspaceMembersListRequest = any
  export type WorkspaceMembersListResponse = any
  export type ActiveWorkspaceResponse = any

  export type ContentMode = any
  export const ContentMode: any
  export type ContentProvider = any
  export const ContentProvider: any
  export type ContentType = any
  export const ContentType: any
  export type ExecutionOutputType = any
  export const ExecutionOutputType: any

  export const automationListResponseSchema: any
  export const automationResponseSchema: any
  export const tagListResponseSchema: any
  export const tagSchema: any
  export const workspaceMemberSchema: any
  export const contactListResponseSchema: any
  export const conversationListResponseSchema: any
  export const conversationDetailResponseSchema: any
  export const leadListResponseSchema: any
  export const contentListResponseSchema: any
  export const contentResponseSchema: any
  export const simulationCommentResponseSchema: any
  export const simulationExecutionListResponseSchema: any
  export const simulationExecutionResponseSchema: any
  export const normalizeAutomationKeyword: (kw: string) => string
  export const normalizeTagName: (tag: string) => string
}
