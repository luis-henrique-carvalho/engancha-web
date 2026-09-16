import type { ExecutionStatus, SimulationExecutionResponse } from '@engancha/contracts'

export interface ExtractedSimulationOutputs {
  publicReply?: {
    id: string
    text: string
    createdAt: string
  }
  privateReply?: {
    id: string
    text: string
    createdAt: string
  }
  linkDelivery?: {
    id: string
    url: string
    buttonText?: string
    createdAt: string
  }
  emailCapture?: {
    id: string
    prompt: string
    createdAt: string
  }
}

type OutputItem = SimulationExecutionResponse['outputs'][number]

function applyOutputItem(result: ExtractedSimulationOutputs, out: OutputItem) {
  if (out.type === 'PUBLIC_REPLY') {
    result.publicReply = {
      id: out.id,
      text: String(out.payload?.text ?? ''),
      createdAt: out.createdAt,
    }
  } else if (out.type === 'PRIVATE_REPLY') {
    result.privateReply = {
      id: out.id,
      text: String(out.payload?.text ?? ''),
      createdAt: out.createdAt,
    }
  } else if (out.type === 'LINK_DELIVERY') {
    result.linkDelivery = {
      id: out.id,
      url: String(out.payload?.url ?? ''),
      buttonText: out.payload?.buttonText ? String(out.payload.buttonText) : undefined,
      createdAt: out.createdAt,
    }
  } else if (out.type === 'EMAIL_CAPTURE_REQUEST') {
    result.emailCapture = {
      id: out.id,
      prompt: String(out.payload?.prompt ?? ''),
      createdAt: out.createdAt,
    }
  }
}

export function extractSimulationOutputs(
  outputs: SimulationExecutionResponse['outputs'],
): ExtractedSimulationOutputs {
  const result: ExtractedSimulationOutputs = {}
  for (const out of outputs) {
    applyOutputItem(result, out)
  }
  return result
}

export interface ExecutionStatusViewModel {
  status: ExecutionStatus
  label: string
  description: string
  variant: 'default' | 'secondary' | 'outline' | 'destructive'
}

export function getExecutionStatusViewModel(
  status: ExecutionStatus,
  _matched: boolean | null,
  error?: { code: string; message: string } | null,
): ExecutionStatusViewModel {
  const STATUS_MAP: Record<ExecutionStatus, ExecutionStatusViewModel> = {
    PENDING: {
      status: 'PENDING',
      label: 'Aguardando',
      description: 'Comentário recebido, aguardando início da análise.',
      variant: 'outline',
    },
    PROCESSING: {
      status: 'PROCESSING',
      label: 'Processando',
      description: 'Analisando comentário e preparando respostas...',
      variant: 'secondary',
    },
    COMPLETED: {
      status: 'COMPLETED',
      label: 'Concluído',
      description: 'Simulação da jornada concluída com sucesso.',
      variant: 'default',
    },
    IGNORED: {
      status: 'IGNORED',
      label: 'Ignorado',
      description:
        'Nenhuma automação ativa reconheceu a palavra-chave configurada para esta publicação.',
      variant: 'outline',
    },
    FAILED: {
      status: 'FAILED',
      label: 'Falhou',
      description: error?.message || 'A simulação não pôde ser concluída.',
      variant: 'destructive',
    },
  }

  return (
    STATUS_MAP[status] ?? {
      status: 'PENDING',
      label: 'Aguardando',
      description: 'Aguardando processamento.',
      variant: 'outline',
    }
  )
}
