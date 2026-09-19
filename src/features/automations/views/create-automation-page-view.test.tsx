import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { ChannelsApi } from '@/features/channels/services/channels-api'
import { CreateAutomationPageView } from './create-automation-page-view'

const navigateMock = vi.fn()

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useNavigate: () => navigateMock,
    Link: ({ children, to, ...props }: any) => (
      <a
        href={typeof to === 'string' ? to : '#'}
        {...props}
      >
        {children}
      </a>
    ),
  }
})

vi.mock('@/features/channels/services/channels-api', () => ({
  ChannelsApi: {
    listConnections: vi.fn(),
    listEligibleMedia: vi.fn(),
  },
}))

vi.mock('../services/automations-api', () => ({
  AutomationsApi: {
    create: vi.fn(),
  },
}))

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  })
}

function renderWithClient(ui: React.ReactElement) {
  const queryClient = createTestQueryClient()
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('CreateAutomationPageView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders creation page and form elements', async () => {
    vi.mocked(ChannelsApi.listConnections).mockResolvedValue({
      items: [
        {
          id: 'conn-1',
          workspaceId: 'ws-1',
          provider: 'instagram',
          status: 'ACTIVE',
          accountName: 'Engancha Store',
          externalAccountId: 'ig-123',
          tokenExpiresAt: '2027-01-01T00:00:00Z',
          scopes: ['instagram_manage_comments'],
          isExpired: false,
          lastError: '',
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
      ],
      meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
    })

    vi.mocked(ChannelsApi.listEligibleMedia).mockResolvedValue({
      items: [
        {
          id: 'med-1',
          externalId: 'ext-med-1',
          mediaType: 'POST',
          mediaProductType: 'FEED',
          thumbnailUrl: 'https://exemplo.com/thumb.jpg',
          caption: 'Promoção de Inverno',
          permalink: 'https://instagram.com/p/123',
          timestamp: '2026-06-01T00:00:00Z',
          isEligible: true,
        },
      ],
    })

    await renderWithClient(<CreateAutomationPageView workspaceId="ws-1" />)

    await expect.element(page.getByText('Criar Nova Automação')).toBeInTheDocument()
    await expect.element(page.getByText('Canal Conectado')).toBeInTheDocument()
    await expect.element(page.getByText('Galeria de Publicações')).toBeInTheDocument()
  })
})
