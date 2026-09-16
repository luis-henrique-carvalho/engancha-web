import type { AutomationResponse } from '@engancha/contracts'
import { Form } from '@/components/ui/form'
import {
  AutomationSaveBar,
  AutomationStepSection,
  FinalActionEmailFields,
  FinalActionLinkFields,
  FinalActionTagField,
  FinalActionTypeSelector,
} from '../components'
import { useAutomationMutations } from '../hooks/use-automation-mutations'
import { useTags } from '../hooks/use-tags'
import { useUnsavedChanges } from '../hooks/use-unsaved-changes'
import { useStepViewContext } from '../hooks/use-step-view-context'
import { useFinalActionStepState } from '../hooks/use-final-action-step-state'

interface FinalActionStepViewProps {
  workspaceId?: string
  automationId?: string
  automation?: AutomationResponse
  onNext?: () => void
}

export function FinalActionStepView({
  workspaceId: propWorkspaceId,
  automationId: propAutomationId,
  automation: propAutomation,
  onNext: propOnNext,
}: FinalActionStepViewProps = {}) {
  const { workspaceId, automationId, activeAutomation, navigate } = useStepViewContext({
    workspaceId: propWorkspaceId,
    automationId: propAutomationId,
    automation: propAutomation,
  })

  const currentActions = activeAutomation?.current?.actions ?? []
  const { patchAutomation, isSaving } = useAutomationMutations(workspaceId, automationId)
  const { tags, isLoading: isLoadingTags } = useTags(workspaceId)

  const {
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
  } = useFinalActionStepState(currentActions, patchAutomation)

  const { UnsavedChangesDialog } = useUnsavedChanges({
    isDirty: form.formState.isDirty || isTagDirty,
  })

  const handleNext = () => {
    if (propOnNext) {
      propOnNext()
      return
    }

    void navigate({
      to: '/automations/$automationId/review',
      params: { automationId },
    })
  }

  return (
    <AutomationStepSection
      title="Ação final"
      description="Configure o link de destino ou captura de e-mail."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FinalActionTypeSelector
            selectedType={selectedType}
            onSelectType={handleModeChange}
          />

          {selectedType === 'LINK' && (
            <FinalActionLinkFields
              form={form}
              watchedLabel={watchedLabel}
            />
          )}

          {selectedType === 'CAPTURE_EMAIL' && (
            <FinalActionEmailFields
              form={form}
              watchedPrompt={watchedPrompt}
            />
          )}

          <FinalActionTagField
            tags={tags}
            isLoadingTags={isLoadingTags}
            tagMode={tagMode}
            onTagModeChange={setTagMode}
            selectedTagId={selectedTagId}
            onSelectTagId={setSelectedTagId}
            newTagName={newTagName}
            onNewTagNameChange={setNewTagName}
          />

          <AutomationSaveBar
            onSave={form.handleSubmit(onSubmit)}
            isSaving={isSaving}
            saveLabel="Salvar etapa"
            onNext={handleNext}
            nextLabel="Próxima etapa"
            showNext={true}
          />
        </form>
      </Form>
      <UnsavedChangesDialog />
    </AutomationStepSection>
  )
}
