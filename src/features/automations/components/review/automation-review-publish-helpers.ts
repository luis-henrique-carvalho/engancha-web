import type { AutomationStatus } from '@engancha/contracts'

export function getPublishBarTitle(
  isActive: boolean,
  isPaused: boolean,
  hasUnpublishedChanges: boolean,
): string {
  if (isActive) {
    return hasUnpublishedChanges
      ? 'Automação ativa com alterações pendentes'
      : 'Automação ativa no workspace'
  }
  if (isPaused) {
    return 'Automação pausada'
  }
  return 'Pronto para ativar sua automação?'
}

export function getPublishBarDescription(
  isActive: boolean,
  isPaused: boolean,
  hasUnpublishedChanges: boolean,
  isReady: boolean,
): string {
  if (isActive) {
    return hasUnpublishedChanges
      ? 'A versão atualmente em execução continua respondendo no Instagram até que você publique as alterações.'
      : 'Esta automação está atualmente ativa respondendo aos comentários e mensagens.'
  }
  if (isPaused) {
    return 'Esta automação está pausada e não está processando comentários. Publique novamente para reativar.'
  }
  if (isReady) {
    return 'Ao publicar, a automação começará a responder interações para este conteúdo imediatamente.'
  }
  return 'Complete as pendências indicadas no checklist acima para habilitar a publicação.'
}

export function getPublishButtonLabel(
  status: AutomationStatus,
  hasUnpublishedChanges: boolean,
): string {
  if (status === 'ACTIVE') {
    return hasUnpublishedChanges ? 'Publicar alterações' : 'Republicar automação'
  }
  if (status === 'PAUSED') {
    return 'Reativar automação'
  }
  return 'Publicar automação'
}
