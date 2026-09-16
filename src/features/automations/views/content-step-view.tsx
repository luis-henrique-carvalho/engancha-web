import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AutomationResponse } from '@engancha/contracts'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { AutomationSaveBar, AutomationStepSection, ContentPicker } from '../components'
import {
  automationContentSchema,
  type AutomationContentFormValues,
} from '../data/automation-step-schemas'
import { useAutomationMutations } from '../hooks/use-automation-mutations'
import { useUnsavedChanges } from '../hooks/use-unsaved-changes'
import { useStepViewContext } from '../hooks/use-step-view-context'

interface ContentStepViewProps {
  workspaceId?: string
  automationId?: string
  automation?: AutomationResponse
  onNext?: () => void
}

export function ContentStepView({
  workspaceId: propWorkspaceId,
  automationId: propAutomationId,
  automation: propAutomation,
  onNext: propOnNext,
}: ContentStepViewProps = {}) {
  const { workspaceId, automationId, activeAutomation, navigate } = useStepViewContext({
    workspaceId: propWorkspaceId,
    automationId: propAutomationId,
    automation: propAutomation,
  })

  const currentTargetId = activeAutomation?.current?.target?.id ?? ''
  const { patchAutomation, isSaving } = useAutomationMutations(workspaceId, automationId)

  const form = useForm<AutomationContentFormValues>({
    resolver: zodResolver(automationContentSchema),
    values: { targetId: currentTargetId },
    resetOptions: { keepDirtyValues: true },
    defaultValues: { targetId: currentTargetId },
  })

  const { UnsavedChangesDialog } = useUnsavedChanges({ isDirty: form.formState.isDirty })

  const onSubmit = async (values: AutomationContentFormValues) => {
    const targetId = values.targetId?.trim()
    await patchAutomation({
      targetId: targetId ? targetId : null,
    })
    form.reset(values)
  }

  const handleNext = () => {
    if (propOnNext) {
      propOnNext()
      return
    }

    void navigate({
      to: '/automations/$automationId/keyword',
      params: { automationId },
    })
  }

  return (
    <AutomationStepSection
      title="Conteúdo"
      description="Selecione a publicação, reel ou mídia do canal associado."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="targetId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ContentPicker
                    workspaceId={workspaceId}
                    value={field.value ?? null}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
