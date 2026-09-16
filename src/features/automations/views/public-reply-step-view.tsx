import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AutomationResponse } from '@engancha/contracts'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { AutomationSaveBar, AutomationStepSection } from '../components'
import { buildUpdatedActions, getPublicReplyText } from '../data/automation-action-mappers'
import {
  automationPublicReplySchema,
  type AutomationPublicReplyFormValues,
} from '../data/automation-step-schemas'
import { useAutomationMutations } from '../hooks/use-automation-mutations'
import { useUnsavedChanges } from '../hooks/use-unsaved-changes'
import { useStepViewContext } from '../hooks/use-step-view-context'

interface PublicReplyStepViewProps {
  workspaceId?: string
  automationId?: string
  automation?: AutomationResponse
  onNext?: () => void
}

export function PublicReplyStepView({
  workspaceId: propWorkspaceId,
  automationId: propAutomationId,
  automation: propAutomation,
  onNext: propOnNext,
}: PublicReplyStepViewProps = {}) {
  const { workspaceId, automationId, activeAutomation, navigate } = useStepViewContext({
    workspaceId: propWorkspaceId,
    automationId: propAutomationId,
    automation: propAutomation,
  })

  const currentActions = activeAutomation?.current?.actions ?? []
  const initialText = getPublicReplyText(currentActions)
  const { patchAutomation, isSaving } = useAutomationMutations(workspaceId, automationId)

  const form = useForm<AutomationPublicReplyFormValues>({
    resolver: zodResolver(automationPublicReplySchema),
    values: { text: initialText },
    defaultValues: { text: initialText },
  })

  const watchedText = form.watch('text') ?? ''
  const { UnsavedChangesDialog } = useUnsavedChanges({ isDirty: form.formState.isDirty })

  const onSubmit = async (values: AutomationPublicReplyFormValues) => {
    const updatedActions = buildUpdatedActions(currentActions, {
      publicReply: values.text,
    })
    await patchAutomation({ actions: updatedActions })
    form.reset(values)
  }

  const handleNext = () => {
    if (propOnNext) {
      propOnNext()
      return
    }

    void navigate({
      to: '/automations/$automationId/direct-message',
      params: { automationId },
    })
  }

  return (
    <AutomationStepSection
      title="Resposta pública"
      description="Defina o comentário de resposta visível no post."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Texto do comentário público</FormLabel>
                  <span
                    className="text-xs text-muted-foreground"
                    data-testid="automation-public-reply-char-count"
                  >
                    {watchedText.length}/1000 caracteres
                  </span>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Obrigado pelo comentário! Enviamos o link no seu direct 🚀"
                    rows={4}
                    data-testid="automation-public-reply-input"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormDescription>
                  Este comentário será publicado automaticamente em resposta aos comentários que
                  acionarem o gatilho.
                </FormDescription>
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
