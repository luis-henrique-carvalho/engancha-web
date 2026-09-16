import { useState } from 'react'
import type { ChannelMedia } from '@/types/api'

export function useCreateAutomationFormState() {
  const [selectedConnectionId, setSelectedConnectionId] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<ChannelMedia | null>(null)
  const [name, setName] = useState('')
  const [keywordsText, setKeywordsText] = useState('')
  const [publicReplyText, setPublicReplyText] = useState('')
  const [privateReplyText, setPrivateReplyText] = useState('')
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const resetForm = () => {
    setSelectedConnectionId('')
    setSelectedMedia(null)
    setName('')
    setKeywordsText('')
    setPublicReplyText('')
    setPrivateReplyText('')
    setStep(1)
  }

  return {
    selectedConnectionId,
    setSelectedConnectionId,
    selectedMedia,
    setSelectedMedia,
    name,
    setName,
    keywordsText,
    setKeywordsText,
    publicReplyText,
    setPublicReplyText,
    privateReplyText,
    setPrivateReplyText,
    step,
    setStep,
    resetForm,
  }
}
