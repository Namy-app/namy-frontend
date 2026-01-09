import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SubscriptionPage from '../page'
import { useAuthStore } from '@/store/useAuthStore'
import {
  useSubscriptionStatus,
  useCreateCheckout,
  useCancelSubscription,
  useToggleAutoRenew,
  usePayPremiumWithWallet,
} from '@/domains/subscription/hooks'
import { useWallet, useWalletBalance } from '@/domains/payment/hooks'

// Mock modules
jest.mock('@/store/useAuthStore')
jest.mock('@/domains/subscription/hooks')
jest.mock('@/domains/payment/hooks')
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(() => null),
  })),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}))

jest.mock('@/components/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('@/layouts/BasicLayout', () => ({
  BasicLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}))

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>
const mockUseSubscriptionStatus = useSubscriptionStatus as jest.MockedFunction<typeof useSubscriptionStatus>
const mockUseCreateCheckout = useCreateCheckout as jest.MockedFunction<typeof useCreateCheckout>
const mockUseCancelSubscription = useCancelSubscription as jest.MockedFunction<typeof useCancelSubscription>
const mockUseToggleAutoRenew = useToggleAutoRenew as jest.MockedFunction<typeof useToggleAutoRenew>
const mockUsePayPremiumWithWallet = usePayPremiumWithWallet as jest.MockedFunction<typeof usePayPremiumWithWallet>
const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>
const mockUseWalletBalance = useWalletBalance as jest.MockedFunction<typeof useWalletBalance>

describe('Subscription Page', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    phoneNumber: '+1234567890',
    isPremium: false,
    premiumEndDate: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  }

  const mockWallet = {
    id: 'wallet-123',
    userId: 'user-123',
    balance: 20000, // $200.00 MXN
    currency: 'MXN',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  }

  const mockBalance = {
    availableBalance: 20000,
    pendingBalance: 0,
    reservedBalance: 0,
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      accessToken: 'test-token',
      isAuthenticated: true,
      rememberMe: false,
      expiresAt: Date.now() + 86400000,
      setAuth: jest.fn(),
      clearAuth: jest.fn(),
      updateUser: jest.fn(),
      checkExpiration: jest.fn(),
    })

    mockUseWallet.mockReturnValue({
      data: mockWallet,
      isLoading: false,
      error: null,
    } as any)

    mockUseWalletBalance.mockReturnValue({
      data: mockBalance,
      isLoading: false,
      error: null,
    } as any)

    mockUseSubscriptionStatus.mockReturnValue({
      data: {
        mySubscriptionStatus: {
          isPremium: false,
          premiumEndDate: null,
          premiumStartDate: null,
          autoRenew: true,
        },
      },
      isLoading: false,
      error: null,
    } as any)

    mockUseCreateCheckout.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    } as any)

    mockUseCancelSubscription.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    } as any)

    mockUseToggleAutoRenew.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    } as any)

    mockUsePayPremiumWithWallet.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    } as any)
  })

  const renderSubscriptionPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <SubscriptionPage />
      </QueryClientProvider>
    )
  }

  describe('SUB-001: Page Display', () => {
    it('should display subscription page header', async () => {
      renderSubscriptionPage()

      await waitFor(() => {
        expect(screen.getByText('Ñamy Premium')).toBeInTheDocument()
        expect(screen.getByText(/Unlock instant discounts/i)).toBeInTheDocument()
      })
    })

    it('should display pricing information', async () => {
      renderSubscriptionPage()

      await waitFor(() => {
        expect(screen.getByText('$ 99 MXN')).toBeInTheDocument()
        expect(screen.getByText('/month')).toBeInTheDocument()
      })
    })

    it('should display premium features list', async () => {
      renderSubscriptionPage()

      await waitFor(() => {
        expect(screen.getByText(/Instant Coupon Generation/i)).toBeInTheDocument()
        expect(screen.getByText(/Maximum Discounts Available/i)).toBeInTheDocument()
        expect(screen.getByText(/Priority Support/i)).toBeInTheDocument()
        expect(screen.getByText(/Early Access to New Features/i)).toBeInTheDocument()
      })
    })

    it('should display free plan limitations', async () => {
      renderSubscriptionPage()

      await waitFor(() => {
        expect(screen.getByText(/Free Plan Limitations/i)).toBeInTheDocument()
        expect(screen.getByText(/Limited coupon generation/i)).toBeInTheDocument()
        expect(screen.getByText(/Lower discount tiers/i)).toBeInTheDocument()
      })
    })
  })

  describe('SUB-002: Active Subscription Display', () => {
    it('should show active subscription status when user is premium', async () => {
      const premiumEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

      mockUseSubscriptionStatus.mockReturnValue({
        data: {
          mySubscriptionStatus: {
            isPremium: true,
            premiumEndDate,
            premiumStartDate: new Date().toISOString(),
            autoRenew: true,
          },
        },
        isLoading: false,
        error: null,
      } as any)

      renderSubscriptionPage()

      await waitFor(() => {
        expect(screen.getByText('Active Subscription')).toBeInTheDocument()
        expect(screen.getByText(/Next billing date/i)).toBeInTheDocument()
      })
    })

    it('should show auto-renew checkbox when subscription is active', async () => {
      mockUseSubscriptionStatus.mockReturnValue({
        data: {
          mySubscriptionStatus: {
            isPremium: true,
            premiumEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            premiumStartDate: new Date().toISOString(),
            autoRenew: true,
          },
        },
        isLoading: false,
        error: null,
      } as any)

      renderSubscriptionPage()

      await waitFor(() => {
        const checkbox = screen.getByLabelText(/Auto-renew subscription/i)
        expect(checkbox).toBeInTheDocument()
        expect(checkbox).toBeChecked()
      })
    })

    it('should show cancel subscription button when subscription is active', async () => {
      mockUseSubscriptionStatus.mockReturnValue({
        data: {
          mySubscriptionStatus: {
            isPremium: true,
            premiumEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            premiumStartDate: new Date().toISOString(),
            autoRenew: true,
          },
        },
        isLoading: false,
        error: null,
      } as any)

      renderSubscriptionPage()

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Cancel Subscription/i })).toBeInTheDocument()
      })
    })

    it('should show premium member badge when subscription is active', async () => {
      mockUseSubscriptionStatus.mockReturnValue({
        data: {
          mySubscriptionStatus: {
            isPremium: true,
            premiumEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            premiumStartDate: new Date().toISOString(),
            autoRenew: true,
          },
        },
        isLoading: false,
        error: null,
      } as any)

      renderSubscriptionPage()

      await waitFor(() => {
        expect(screen.getByText(/You're a Premium Member/i)).toBeInTheDocument()
      })
    })
  })

  describe('SUB-003: Payment Method Selection', () => {
    it('should show card payment and wallet payment tabs', async () => {
      renderSubscriptionPage()

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Card Payment/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Wallet Payment/i })).toBeInTheDocument()
      })
    })

    it('should display wallet balance', async () => {
      renderSubscriptionPage()

      await waitFor(() => {
        expect(screen.getByText(/Wallet Balance/i)).toBeInTheDocument()
        expect(screen.getByText('$200.00MXN')).toBeInTheDocument()
      })
    })

    it('should show insufficient balance warning when wallet has less than premium cost', async () => {
      mockUseWalletBalance.mockReturnValue({
        data: { availableBalance: 5000, pendingBalance: 0, reservedBalance: 0 },
        isLoading: false,
        error: null,
      } as any)

      renderSubscriptionPage()

      await waitFor(() => {
        expect(screen.getByText(/Insufficient balance/i)).toBeInTheDocument()
      })
    })

    it('should switch between payment methods when tabs are clicked', async () => {
      renderSubscriptionPage()

      await waitFor(() => {
        const walletTab = screen.getByRole('button', { name: /Wallet Payment/i })
        fireEvent.click(walletTab)
      })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Pay from Wallet/i })).toBeInTheDocument()
      })

      await waitFor(() => {
        const cardTab = screen.getByRole('button', { name: /Card Payment/i })
        fireEvent.click(cardTab)
      })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Pay with Card/i })).toBeInTheDocument()
      })
    })
  })

  describe('SUB-004: Card Payment Flow', () => {
    it('should call create checkout when pay with card button is clicked', async () => {
      const mockMutateAsync = jest.fn().mockResolvedValue({
        url: 'https://checkout.stripe.com/test',
        sessionId: 'session-123',
      })

      mockUseCreateCheckout.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false,
      } as any)

      // Mock window.location.href
      delete (window as any).location
      window.location = { href: '' } as any

      renderSubscriptionPage()

      await waitFor(() => {
        const payButton = screen.getByRole('button', { name: /Pay with Card/i })
        fireEvent.click(payButton)
      })

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalled()
      })
    })

    it('should show loading state while processing card payment', async () => {
      mockUseCreateCheckout.mockReturnValue({
        mutateAsync: jest.fn().mockImplementation(() => new Promise(() => {})),
        isPending: true,
      } as any)

      renderSubscriptionPage()

      await waitFor(() => {
        const payButton = screen.getByRole('button', { name: /Pay with Card/i })
        fireEvent.click(payButton)
      })

      await waitFor(() => {
        expect(screen.getByText(/Processing.../i)).toBeInTheDocument()
      })
    })
  })

  describe('SUB-005: Wallet Payment Flow', () => {
    it('should call pay with wallet when wallet payment button is clicked', async () => {
      const mockMutateAsync = jest.fn().mockResolvedValue({
        success: true,
        message: 'Premium activated successfully!',
      })

      mockUsePayPremiumWithWallet.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false,
      } as any)

      renderSubscriptionPage()

      await waitFor(() => {
        const walletTab = screen.getByRole('button', { name: /Wallet Payment/i })
        fireEvent.click(walletTab)
      })

      await waitFor(() => {
        const payButton = screen.getByRole('button', { name: /Pay from Wallet/i })
        fireEvent.click(payButton)
      })

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalled()
      })
    })

    it('should disable wallet payment button when insufficient balance', async () => {
      mockUseWalletBalance.mockReturnValue({
        data: { availableBalance: 5000, pendingBalance: 0, reservedBalance: 0 },
        isLoading: false,
        error: null,
      } as any)

      renderSubscriptionPage()

      await waitFor(() => {
        const walletTab = screen.getByRole('button', { name: /Wallet Payment/i })
        fireEvent.click(walletTab)
      })

      await waitFor(() => {
        const payButton = screen.getByRole('button', { name: /Pay from Wallet/i })
        expect(payButton).toBeDisabled()
      })
    })
  })

  describe('SUB-006: Cancel Subscription', () => {
    it('should show confirmation dialog when cancel button is clicked', async () => {
      global.confirm = jest.fn(() => true)

      mockUseSubscriptionStatus.mockReturnValue({
        data: {
          mySubscriptionStatus: {
            isPremium: true,
            premiumEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            premiumStartDate: new Date().toISOString(),
            autoRenew: true,
          },
        },
        isLoading: false,
        error: null,
      } as any)

      const mockMutateAsync = jest.fn().mockResolvedValue({})

      mockUseCancelSubscription.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false,
      } as any)

      renderSubscriptionPage()

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /Cancel Subscription/i })
        fireEvent.click(cancelButton)
      })

      expect(global.confirm).toHaveBeenCalled()
      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalled()
      })
    })

    it('should not cancel subscription when user cancels confirmation', async () => {
      global.confirm = jest.fn(() => false)

      mockUseSubscriptionStatus.mockReturnValue({
        data: {
          mySubscriptionStatus: {
            isPremium: true,
            premiumEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            premiumStartDate: new Date().toISOString(),
            autoRenew: true,
          },
        },
        isLoading: false,
        error: null,
      } as any)

      const mockMutateAsync = jest.fn()

      mockUseCancelSubscription.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false,
      } as any)

      renderSubscriptionPage()

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /Cancel Subscription/i })
        fireEvent.click(cancelButton)
      })

      expect(global.confirm).toHaveBeenCalled()
      expect(mockMutateAsync).not.toHaveBeenCalled()
    })
  })

  describe('SUB-007: Auto-Renew Toggle', () => {
    it('should toggle auto-renew when checkbox is clicked', async () => {
      mockUseSubscriptionStatus.mockReturnValue({
        data: {
          mySubscriptionStatus: {
            isPremium: true,
            premiumEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            premiumStartDate: new Date().toISOString(),
            autoRenew: true,
          },
        },
        isLoading: false,
        error: null,
      } as any)

      const mockMutateAsync = jest.fn().mockResolvedValue({})

      mockUseToggleAutoRenew.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false,
      } as any)

      renderSubscriptionPage()

      await waitFor(() => {
        const checkbox = screen.getByLabelText(/Auto-renew subscription/i)
        fireEvent.click(checkbox)
      })

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('SUB-008: Loading States', () => {
    it('should show loading overlay while fetching subscription status', async () => {
      mockUseSubscriptionStatus.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any)

      renderSubscriptionPage()

      await waitFor(() => {
        expect(screen.getByText(/Loading subscription details/i)).toBeInTheDocument()
      })
    })
  })

  describe('SUB-009: FAQ Section', () => {
    it('should display FAQ section', async () => {
      renderSubscriptionPage()

      await waitFor(() => {
        expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument()
        expect(screen.getByText(/Can I cancel anytime/i)).toBeInTheDocument()
        expect(screen.getByText(/What payment methods do you accept/i)).toBeInTheDocument()
        expect(screen.getByText(/How does instant coupon generation work/i)).toBeInTheDocument()
      })
    })
  })
})
