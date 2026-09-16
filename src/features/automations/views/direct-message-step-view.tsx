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
import { buildUpdatedActions, getPrivateReplyText } from '../data/automation-action-mappers'
import {
  automationDirectMessageSchema,
  type AutomationDirectMessageFormValues,
} from '../data/automation-step-schemas'
import { useAutomationMutations } from '../hooks/use-automation-mutations'
import { useUnsavedChanges } from '../hooks/use-unsaved-changes'
import { useStepViewContext } from '../hooks/use-step-view-context'

interface DirectMessageStepViewProps {
  workspaceId?: string
  automationId?: string
  automation?: AutomationResponse
  onNext?: () => void
}

export function DirectMessageStepView({
  workspaceId: propWorkspaceId,
  automationId: propAutomationId,
  automation: propAutomation,
  onNext: propOnNext,
}: DirectMessageStepViewProps = {}) {
  const { workspaceId, automationId, activeAutomation, navigate } = useStepViewContext({
    workspaceId: propWorkspaceId,
    automationId: propAutomationId,
    automation: propAutomation,
  })

  const currentActions = activeAutomation?.current?.actions ?? []
  const initialText = getPrivateReplyText(currentActions)
  const { patchAutomation, isSaving } = useAutomationMutations(workspaceId, automationId)

  const form = useForm<AutomationDirectMessageFormValues>({
    resolver: zodResolver(automationDirectMessageSchema),
    values: { text: initialText },
    defaultValues: { text: initialText },
  })

  const watchedText = form.watch('text') ?? ''
  const { UnsavedChangesDialog } = useUnsavedChanges({ isDirty: form.formState.isDirty })

  const onSubmit = async (values: AutomationDirectMessageFormValues) => {
    const updatedActions = buildUpdatedActions(currentActions, {
      privateReply: values.text,
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
      to: '/automations/$automationId/final-action',
      params: { automationId },
    })
  }

  return (
    <AutomationStepSection
      title="Mensagem direta (DM)"
      description="Defina o texto enviado diretamente no direct."
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
                  <FormLabel>Texto da mensagem privada (DM)</FormLabel>
                  <span
                    className="text-xs text-muted-foreground"
                    data-testid="automation-direct-message-char-count"
                  >
                    {watchedText.length}/1000 caracteres
                  </span>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Olá! Aqui está o seu acesso exclusivo:"
                    rows={4}
                    data-testid="automation-direct-message-input"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormDescription>
                  Esta mensagem privada será enviada diretamente para o usuário que interagir com a
                  publicação.
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
