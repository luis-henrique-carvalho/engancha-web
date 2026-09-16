import { useNavigate } from '@tanstack/react-router'
import type { AutomationResponse } from '@engancha/contracts'
import { useOptionalAutomationEditor } from '../components'
import { useAutomation } from './use-automation'

interface StepViewContextProps {
  workspaceId?: string
  automationId?: string
  automation?: AutomationResponse
}

export function useStepViewContext({
  workspaceId: propWorkspaceId,
  automationId: propAutomationId,
  automation: propAutomation,
}: StepViewContextProps = {}) {
  const context = useOptionalAutomationEditor()
  const navigate = useNavigate()

  const workspaceId = propWorkspaceId ?? context?.workspaceId ?? ''
  const automationId = propAutomationId ?? context?.automationId ?? ''

  const { data: fetchedAutomation } = useAutomation(
    propAutomation ? '' : workspaceId,
    propAutomation ? '' : automationId,
  )

  const activeAutomation = propAutomation ?? context?.automation ?? fetchedAutomation

  return {
    workspaceId,
    automationId,
    activeAutomation,
    navigate,
  }
}
