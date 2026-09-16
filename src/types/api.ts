/**
 * Types derivados 1:1 do OpenAPI 3.1.1 da Go API (engancha-api).
 * Substitui integralmente o antigo pacote @engancha/contracts.
 */

export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: string
  updatedAt: string
}

export interface Workspace {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export type WorkspaceRole = 'owner' | 'admin' | 'member'
export type WorkspaceMemberStatus = 'active' | 'invited'

export interface ActiveWorkspace {
  id: string
  name: string
  slug: string
  role: WorkspaceRole
}

export interface WorkspaceSession {
  workspace: ActiveWorkspace
  token: string
}

export interface AuthResult {
  user: User
  workspace: Workspace
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface CreateWorkspaceRequest {
  name: string
}

export interface SetActiveWorkspaceRequest {
  workspaceId?: string
  organizationId?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  limit?: number
  query?: string
}

export interface WorkspacePage {
  items: ActiveWorkspace[]
  meta: PaginationMeta
}

export interface WorkspaceMember {
  id: string
  name: string
  email: string
  emailVerified: boolean
  role: WorkspaceRole
  status: WorkspaceMemberStatus
  createdAt: string
}

export interface WorkspaceMemberPage {
  items: WorkspaceMember[]
  meta: PaginationMeta
}

export interface InviteMemberRequest {
  email: string
}

export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'canceled'

export interface Invitation {
  id: string
  workspaceId: string
  email: string
  role: WorkspaceRole
  status: InvitationStatus
  expiresAt: string
  inviterId: string
  createdAt: string
  updatedAt: string
}

// Canais & Mídias
export type ChannelProvider =
  'instagram' | 'whatsapp' | 'twitter' | 'tiktok' | 'telegram' | 'messenger' | (string & {})
export type ChannelStatus = 'ACTIVE' | 'ERROR' | 'EXPIRED' | 'REVOKED' | 'DISCONNECTED'
export type MediaType = 'POST' | 'REEL'

export interface OAuthConnectURL {
  authorizationUrl: string
  state: string
}

export interface OAuthCallbackRequest {
  provider?: ChannelProvider | string
  code: string
  state: string
}

export interface ChannelConnection {
  id: string
  workspaceId: string
  provider: ChannelProvider
  externalAccountId: string
  accountName: string
  profilePictureUrl?: string | null
  scopes: string[]
  tokenExpiresAt: string | null
  isExpired: boolean
  status: ChannelStatus
  lastError: string
  createdAt: string
  updatedAt: string
}

export interface ChannelConnectionPage {
  items: ChannelConnection[]
  meta: PaginationMeta
}

export interface ListChannelsParams extends PaginationParams {
  status?: ChannelStatus[]
  provider?: string[]
}

export interface ChannelMedia {
  id: string
  externalId: string
  caption: string
  mediaType: MediaType
  mediaProductType: string
  permalink: string
  thumbnailUrl: string
  timestamp: string
  isEligible: boolean
}

// Automações
export type AutomationStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED'

export interface CreateAutomationRequest {
  channelConnectionId: string
  name: string
  externalMediaId: string
  mediaType: MediaType
  keywords: string[]
  publicReplyText: string
  privateReplyText: string
}

export interface UpdateAutomationStatusRequest {
  status: AutomationStatus
}

export interface Automation {
  id: string
  workspaceId: string
  channelConnectionId: string
  name: string
  externalMediaId: string
  mediaType: MediaType
  keywords?: string[]
  publicReplyText: string
  privateReplyText: string
  status: AutomationStatus
  createdAt: string
  updatedAt: string
}

export interface AutomationPage {
  items: Automation[]
  meta: PaginationMeta
}

// Histórico de Relacionamento (Conversas, Mensagens, Contatos)
export interface Contact {
  id: string
  workspaceId: string
  channelConnectionId: string
  provider: string
  externalUserId: string
  username: string
  fullName: string
  profilePicUrl: string
  createdAt: string
  updatedAt: string
}

export interface ContactPage {
  items: Contact[]
  meta: PaginationMeta
}

export type ConversationStatus = 'OPEN' | 'CLOSED'

export interface Conversation {
  id: string
  workspaceId: string
  contactId: string
  channelConnectionId: string
  status: ConversationStatus
  lastMessageAt: string
  createdAt: string
  updatedAt: string
  contact?: Contact
}

export interface ConversationPage {
  items: Conversation[]
  meta: PaginationMeta
}

export type MessageDirection = 'INBOUND' | 'OUTBOUND'
export type MessageType = 'COMMENT' | 'PUBLIC_REPLY' | 'DIRECT_MESSAGE' | 'PRIVATE_REPLY'

export interface Message {
  id: string
  workspaceId: string
  conversationId: string
  contactId: string | null
  direction: MessageDirection
  messageType: MessageType
  content: string
  externalId: string | null
  createdAt: string
}

export interface ApiError {
  error: string
}
