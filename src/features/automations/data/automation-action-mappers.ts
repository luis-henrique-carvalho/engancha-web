import type { AutomationAction } from '@engancha/contracts'

export type FinalAutomationAction =
  (AutomationAction & { type: 'LINK' }) | (AutomationAction & { type: 'CAPTURE_EMAIL' })

export type TagAutomationAction = AutomationAction & { type: 'APPLY_TAG' }

export function getPublicReplyText(actions: AutomationAction[] | null | undefined): string {
  if (!actions) return ''
  const action = actions.find((item) => item.type === 'PUBLIC_REPLY')
  return action && action.type === 'PUBLIC_REPLY' ? action.text : ''
}

export function getPrivateReplyText(actions: AutomationAction[] | null | undefined): string {
  if (!actions) return ''
  const action = actions.find((item) => item.type === 'PRIVATE_REPLY')
  return action && action.type === 'PRIVATE_REPLY' ? action.text : ''
}

export function getTagAction(
  actions: AutomationAction[] | null | undefined,
): TagAutomationAction | undefined {
  if (!actions) return undefined
  const action = actions.find((item) => item.type === 'APPLY_TAG')
  return action as TagAutomationAction | undefined
}

export function getFinalAction(
  actions: AutomationAction[] | null | undefined,
): FinalAutomationAction | undefined {
  if (!actions) return undefined
  const action = actions.find((item) => item.type === 'LINK' || item.type === 'CAPTURE_EMAIL')
  return action as FinalAutomationAction | undefined
}

export function orderAutomationActions(actions: AutomationAction[]): AutomationAction[] {
  const publicReply = actions.find((action) => action.type === 'PUBLIC_REPLY')
  const privateReply = actions.find((action) => action.type === 'PRIVATE_REPLY')
  const tagAction = actions.find((action) => action.type === 'APPLY_TAG')
  const finalAction = actions.find(
    (action) => action.type === 'LINK' || action.type === 'CAPTURE_EMAIL',
  )

  const ordered: AutomationAction[] = []
  if (publicReply) ordered.push(publicReply)
  if (privateReply) ordered.push(privateReply)
  if (tagAction) ordered.push(tagAction)
  if (finalAction) ordered.push(finalAction)

  return ordered
}

export interface BuildActionsOptions {
  publicReply?: string | null
  privateReply?: string | null
  tagAction?: TagAutomationAction | null
  finalAction?: FinalAutomationAction | null
}

function resolveTextAction(
  existing: AutomationAction | undefined,
  type: 'PUBLIC_REPLY' | 'PRIVATE_REPLY',
  value: string | null | undefined,
  hasKey: boolean,
): AutomationAction | undefined {
  if (!hasKey) return existing
  const trimmed = value?.trim()
  return trimmed ? { type, text: trimmed } : undefined
}

function resolveGenericAction<T>(
  existing: T | undefined,
  value: T | null | undefined,
  hasKey: boolean,
): T | undefined {
  if (!hasKey) return existing
  return value ?? undefined
}

export function buildUpdatedActions(
  currentActions: AutomationAction[] | null | undefined,
  update: BuildActionsOptions,
): AutomationAction[] {
  const existing = currentActions ?? []

  const publicReply = resolveTextAction(
    existing.find((a) => a.type === 'PUBLIC_REPLY'),
    'PUBLIC_REPLY',
    update.publicReply,
    'publicReply' in update,
  )

  const privateReply = resolveTextAction(
    existing.find((a) => a.type === 'PRIVATE_REPLY'),
    'PRIVATE_REPLY',
    update.privateReply,
    'privateReply' in update,
  )

  const tagAction = resolveGenericAction(
    existing.find((a) => a.type === 'APPLY_TAG') as TagAutomationAction | undefined,
    update.tagAction,
    'tagAction' in update,
  )

  const finalAction = resolveGenericAction(
    existing.find((a) => a.type === 'LINK' || a.type === 'CAPTURE_EMAIL') as
      FinalAutomationAction | undefined,
    update.finalAction,
    'finalAction' in update,
  )

  return [publicReply, privateReply, tagAction, finalAction].filter(
    (action): action is AutomationAction => Boolean(action),
  )
}
