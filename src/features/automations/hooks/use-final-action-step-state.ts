import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  automationFinalActionSchema,
  type AutomationFinalActionFormValues,
} from '../data/automation-step-schemas'
import {
  buildUpdatedActions,
  getFinalAction,
  getTagAction,
  type FinalAutomationAction,
  type TagAutomationAction,
} from '../data/automation-action-mappers'

function extractFinalAction(values: AutomationFinalActionFormValues): FinalAutomationAction | null {
  if (values.actionType === 'LINK') {
    const trimmedUrl = values.url?.trim()
    if (trimmedUrl) {
      return {
        type: 'LINK',
        url: trimmedUrl,
        label: values.label?.trim() || 'Abrir link',
      }
    }
  } else if (values.actionType === 'CAPTURE_EMAIL') {
    const trimmedPrompt = values.prompt?.trim()
    if (trimmedPrompt) {
      return {
        type: 'CAPTURE_EMAIL',
        prompt: trimmedPrompt,
      }
    }
  }
  return null
}

function extractTagAction(
  tagMode: 'none' | 'existing' | 'new',
  selectedTagId: string,
  newTagName: string,
): TagAutomationAction | null {
  if (tagMode === 'existing' && selectedTagId) {
    return { type: 'APPLY_TAG', tagId: selectedTagId }
  }
  if (tagMode === 'new' && newTagName.trim()) {
    return { type: 'APPLY_TAG', name: newTagName.trim() }
  }
  return null
}

function buildFormValues(
  type: 'LINK' | 'CAPTURE_EMAIL',
  initialFinalAction: ReturnType<typeof getFinalAction>,
): AutomationFinalActionFormValues {
  if (type === 'LINK') {
    return {
      actionType: 'LINK',
      url: initialFinalAction?.type === 'LINK' ? initialFinalAction.url : '',
      label: initialFinalAction?.type === 'LINK' ? initialFinalAction.label : 'Abrir link',
    }
  }
  return {
    actionType: 'CAPTURE_EMAIL',
    prompt: initialFinalAction?.type === 'CAPTURE_EMAIL' ? initialFinalAction.prompt : '',
  }
}

function getInitialActionType(
  finalAction: ReturnType<typeof getFinalAction>,
): 'LINK' | 'CAPTURE_EMAIL' {
  return finalAction?.type === 'CAPTURE_EMAIL' ? 'CAPTURE_EMAIL' : 'LINK'
}

function getInitialTagMode(
  tagAction: ReturnType<typeof getTagAction>,
): 'none' | 'existing' | 'new' {
  if (tagAction?.tagId) return 'existing'
  if (tagAction?.name) return 'new'
  return 'none'
}

function computeTagDirty(
  tagMode: 'none' | 'existing' | 'new',
  initialTagMode: 'none' | 'existing' | 'new',
  selectedTagId: string,
  initialTagId: string,
  newTagName: string,
  initialTagName: string,
): boolean {
  if (tagMode !== initialTagMode) return true
  if (tagMode === 'existing' && selectedTagId !== initialTagId) return true
  if (tagMode === 'new' && newTagName !== initialTagName) return true
  return false
}

export function useFinalActionStepState(
  currentActions: any[],
  patchAutomation: (data: any) => Promise<any>,
) {
  const initialFinalAction = getFinalAction(currentActions)
  const initialTagAction = getTagAction(currentActions)
  const initialActionType = getInitialActionType(initialFinalAction)
  const initialTagMode = getInitialTagMode(initialTagAction)

  const [selectedType, setSelectedType] = useState<'LINK' | 'CAPTURE_EMAIL'>(initialActionType)
  const [tagMode, setTagMode] = useState<'none' | 'existing' | 'new'>(initialTagMode)
  const [selectedTagId, setSelectedTagId] = useState<string>(initialTagAction?.tagId || '')
  const [newTagName, setNewTagName] = useState<string>(initialTagAction?.name || '')

  const form = useForm<AutomationFinalActionFormValues>({
    resolver: zodResolver(automationFinalActionSchema),
    values: buildFormValues(selectedType, initialFinalAction),
    defaultValues: buildFormValues(initialActionType, initialFinalAction),
  })

  const watchedValues = form.watch()
  const watchedPrompt =
    watchedValues.actionType === 'CAPTURE_EMAIL' ? watchedValues.prompt || '' : ''
  const watchedLabel = watchedValues.actionType === 'LINK' ? watchedValues.label || '' : ''

  const isTagDirty = computeTagDirty(
    tagMode,
    initialTagMode,
    selectedTagId,
    initialTagAction?.tagId || '',
    newTagName,
    initialTagAction?.name || '',
  )

  const handleModeChange = (newType: 'LINK' | 'CAPTURE_EMAIL') => {
    setSelectedType(newType)
    form.reset(buildFormValues(newType, initialFinalAction))
  }

  const onSubmit = async (values: AutomationFinalActionFormValues) => {
    const finalAction = extractFinalAction(values)
    const tagAction = extractTagAction(tagMode, selectedTagId, newTagName)
    const updatedActions = buildUpdatedActions(currentActions, {
      finalAction,
      tagAction,
    })

    await patchAutomation({ actions: updatedActions })
    form.reset(values)
  }

  return {
    form,
    selectedType,
    tagMode,
    setTagMode,
    selectedTagId,
    setSelectedTagId,
    newTagName,
    setNewTagName,
    watchedPrompt,
    watchedLabel,
    isTagDirty,
    handleModeChange,
    onSubmit,
  }
}
