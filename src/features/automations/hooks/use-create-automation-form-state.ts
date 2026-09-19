import { useState } from 'react'
import type { ChannelMedia, CreateAutomationRequest } from '@/types/api'

export function useCreateAutomationFormState() {
  const [selectedConnectionId, setSelectedConnectionId] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<ChannelMedia | null>(null)
  const [name, setName] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [publicReplyText, setPublicReplyText] = useState('')
  const [privateReplyText, setPrivateReplyText] = useState('')
  const [step, setStep] = useState<1 | 2>(1)

  const resetForm = () => {
    setSelectedConnectionId('')
    setSelectedMedia(null)
    setName('')
    setKeywords([])
    setPublicReplyText('')
    setPrivateReplyText('')
    setStep(1)
  }

  const buildPayload = (): CreateAutomationRequest | null => {
    if (!selectedConnectionId || !selectedMedia) return null
    const trimmedName = name.trim()
    const validKeywords = keywords.map((k) => k.trim()).filter(Boolean)

    if (!trimmedName || validKeywords.length === 0) return null

    return {
      channelConnectionId: selectedConnectionId,
      name: trimmedName,
      externalMediaId: selectedMedia.externalId,
      mediaType: selectedMedia.mediaType,
      keywords: validKeywords,
      publicReplyText: publicReplyText.trim(),
      privateReplyText: privateReplyText.trim(),
    }
  }

  return {
    selectedConnectionId,
    setSelectedConnectionId,
    selectedMedia,
    setSelectedMedia,
    name,
    setName,
    keywords,
    setKeywords,
    publicReplyText,
    setPublicReplyText,
    privateReplyText,
    setPrivateReplyText,
    step,
    setStep,
    resetForm,
    buildPayload,
  }
}
