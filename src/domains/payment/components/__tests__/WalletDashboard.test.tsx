import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletDashboard } from '../WalletDashboard'
import { useWallet, useWalletBalance, useWalletTransactions } from '../../hooks'
import { TransactionStatus } from '../../types'

// Mock the hooks
jest.mock('../../hooks', () => ({
  useWallet: jest.fn(),
  useWalletBalance: jest.fn(),
  useWalletTransactions: jest.fn(),
}))

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>
const mockUseWalletBalance = useWalletBalance as jest.MockedFunction<typeof useWalletBalance>
const mockUseWalletTransactions = useWalletTransactions as jest.MockedFunction<typeof useWalletTransactions>

describe('WalletDashboard', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const mockWallet = {
    id: 'wallet-123',
    userId: 'user-123',
    balance: 50000, // $500.00 MXN
    currency: 'MXN',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  }

  const mockBalance = {
    availableBalance: 45000, // $450.00 MXN
    pendingBalance: 5000,
    reservedBalance: 0,
  }

  const mockTransactions = {
    data: [
      {
        id: 'tx-1',
        walletId: 'wallet-123',
        type: 'deposit',
        amount: 10000,
        currency: 'MXN',
        status: TransactionStatus.COMPLETED,
        description: 'Wallet deposit',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z',
      },
      {
        id: 'tx-2',
        walletId: 'wallet-123',
        type: 'purchase',
        amount: 5000,
        currency: 'MXN',
        status: TransactionStatus.COMPLETED,
        description: 'Restaurant purchase',
        createdAt: '2024-01-14T15:30:00.000Z',
        updatedAt: '2024-01-14T15:30:00.000Z',
      },
      {
        id: 'tx-3',
        walletId: 'wallet-123',
        type: 'refund',
        amount: 2000,
        currency: 'MXN',
        status: TransactionStatus.PENDING,
        description: 'Order refund',
        createdAt: '2024-01-13T09:15:00.000Z',
        updatedAt: '2024-01-13T09:15:00.000Z',
      },
    ],
    paginationInfo: {
      page: 1,
      totalPages: 1,
      totalCount: 3,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderDashboard = (userId = 'user-123') => {
    return render(
      <QueryClientProvider client={queryClient}>
        <WalletDashboard userId={userId} />
      </QueryClientProvider>
    )
  }

  describe('WAL-005: Balance Display', () => {
    it('should display wallet balance correctly', () => {
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

      mockUseWalletTransactions.mockReturnValue({
        data: mockTransactions,
        isLoading: false,
        error: null,
      } as any)

      renderDashboard()

      expect(screen.getByText(/Wallet Balance/i)).toBeInTheDocument()
      expect(screen.getByText('$450.00MXN')).toBeInTheDocument()
    })

    it('should show wallet active status', () => {
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

      mockUseWalletTransactions.mockReturnValue({
        data: mockTransactions,
        isLoading: false,
        error: null,
      } as any)

      renderDashboard()

      expect(screen.getByText('Activo')).toBeInTheDocument()
    })

    it('should show inactive status when wallet is not active', () => {
      mockUseWallet.mockReturnValue({
        data: { ...mockWallet, isActive: false },
        isLoading: false,
        error: null,
      } as any)

      mockUseWalletBalance.mockReturnValue({
        data: mockBalance,
        isLoading: false,
        error: null,
      } as any)

      mockUseWalletTransactions.mockReturnValue({
        data: mockTransactions,
        isLoading: false,
        error: null,
      } as any)

      renderDashboard()

      expect(screen.getByText('Inactivo')).toBeInTheDocument()
    })

    it('should use wallet balance if available balance is not provided', () => {
      mockUseWallet.mockReturnValue({
        data: mockWallet,
        isLoading: false,
        error: null,
      } as any)

      mockUseWalletBalance.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as any)

      mockUseWalletTransactions.mockReturnValue({
        data: mockTransactions,
        isLoading: false,
        error: null,
      } as any)

      renderDashboard()

      expect(screen.getByText('$500.00MXN')).toBeInTheDocument()
    })
  })

  describe('WAL-006: Transaction History', () => {
    it('should display transaction history', () => {
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

      mockUseWalletTransactions.mockReturnValue({
        data: mockTransactions,
        isLoading: false,
        error: null,
      } as any)

      renderDashboard()

      expect(screen.getByText(/Transaction History/i)).toBeInTheDocument()
      expect(screen.getByText('Deposit')).toBeInTheDocument()
      expect(screen.getByText('Purchase')).toBeInTheDocument()
      expect(screen.getByText('Refund')).toBeInTheDocument()
    })

    it('should show correct transaction amounts with + for credits', () => {
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

      mockUseWalletTransactions.mockReturnValue({
        data: mockTransactions,
        isLoading: false,
        error: null,
      } as any)

      renderDashboard()

      expect(screen.getByText('+$100.00MXN')).toBeInTheDocument() // deposit
      expect(screen.getByText('+$20.00MXN')).toBeInTheDocument() // refund
    })

    it('should show correct transaction amounts with - for debits', () => {
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

      mockUseWalletTransactions.mockReturnValue({
        data: mockTransactions,
        isLoading: false,
        error: null,
      } as any)

      renderDashboard()

      expect(screen.getByText('-$50.00MXN')).toBeInTheDocument() // purchase
    })

    it('should show transaction status badges', () => {
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

      mockUseWalletTransactions.mockReturnValue({
        data: mockTransactions,
        isLoading: false,
        error: null,
      } as any)

      renderDashboard()

      const completedBadges = screen.getAllByText('completed')
      expect(completedBadges).toHaveLength(2)
      expect(screen.getByText('pending')).toBeInTheDocument()
    })

    it('should show transaction descriptions', () => {
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

      mockUseWalletTransactions.mockReturnValue({
        data: mockTransactions,
        isLoading: false,
        error: null,
      } as any)

      renderDashboard()

      expect(screen.getByText('Wallet deposit')).toBeInTheDocument()
      expect(screen.getByText('Restaurant purchase')).toBeInTheDocument()
      expect(screen.getByText('Order refund')).toBeInTheDocument()
    })

    it('should show empty state when no transactions', () => {
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

      mockUseWalletTransactions.mockReturnValue({
        data: {
          data: [],
          paginationInfo: {
            page: 1,
            totalPages: 0,
            totalCount: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
        isLoading: false,
        error: null,
      } as any)

      renderDashboard()

      expect(screen.getByText(/No transactions yet/i)).toBeInTheDocument()
    })
  })

  describe('WAL-007: Transaction Pagination', () => {
    it('should show pagination when multiple pages exist', () => {
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

      mockUseWalletTransactions.mockReturnValue({
        data: {
          ...mockTransactions,
          paginationInfo: {
            page: 1,
            totalPages: 3,
            totalCount: 30,
            hasNextPage: true,
            hasPreviousPage: false,
          },
        },
        isLoading: false,
        error: null,
      } as any)

      renderDashboard()

      expect(screen.getByText(/Page 1 of 3/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Previous/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument()
    })

    it('should disable previous button on first page', () => {
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

      mockUseWalletTransactions.mockReturnValue({
        data: {
          ...mockTransactions,
          paginationInfo: {
            page: 1,
            totalPages: 3,
            totalCount: 30,
            hasNextPage: true,
            hasPreviousPage: false,
          },
        },
        isLoading: false,
        error: null,
      } as any)

      renderDashboard()

      const prevButton = screen.getByRole('button', { name: /Previous/i })
      expect(prevButton).toBeDisabled()
    })

    it('should disable next button on last page', () => {
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

      mockUseWalletTransactions.mockReturnValue({
        data: {
          ...mockTransactions,
          paginationInfo: {
            page: 3,
            totalPages: 3,
            totalCount: 30,
            hasNextPage: false,
            hasPreviousPage: true,
          },
        },
        isLoading: false,
        error: null,
      } as any)

      renderDashboard()

      const nextButton = screen.getByRole('button', { name: /Next/i })
      expect(nextButton).toBeDisabled()
    })

    it('should not show pagination for single page', () => {
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

      mockUseWalletTransactions.mockReturnValue({
        data: mockTransactions,
        isLoading: false,
        error: null,
      } as any)

      renderDashboard()

      expect(screen.queryByRole('button', { name: /Previous/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Next/i })).not.toBeInTheDocument()
    })
  })

  describe('WAL-008: Loading States', () => {
    it('should show loading spinner while fetching wallet', () => {
      mockUseWallet.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any)

      mockUseWalletBalance.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
      } as any)

      mockUseWalletTransactions.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
      } as any)

      renderDashboard()

      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
    })

    it('should show loading spinner while fetching transactions', () => {
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

      mockUseWalletTransactions.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any)

      renderDashboard()

      const spinners = screen.getAllByRole('status', { hidden: true })
      expect(spinners.length).toBeGreaterThan(0)
    })
  })

  describe('WAL-009: Error States', () => {
    it('should show no wallet message when wallet is null', () => {
      mockUseWallet.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as any)

      mockUseWalletBalance.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as any)

      mockUseWalletTransactions.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as any)

      renderDashboard()

      expect(screen.getByText(/No Wallet Found/i)).toBeInTheDocument()
      expect(screen.getByText(/You don't have a wallet yet/i)).toBeInTheDocument()
    })
  })

  describe('WAL-010: Transaction Icons and Formatting', () => {
    it('should display transaction type icons', () => {
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

      mockUseWalletTransactions.mockReturnValue({
        data: mockTransactions,
        isLoading: false,
        error: null,
      } as any)

      const { container } = renderDashboard()

      // Icons are emojis in the implementation
      expect(container.textContent).toContain('➕') // deposit icon
      expect(container.textContent).toContain('🛒') // purchase icon
      expect(container.textContent).toContain('↩️') // refund icon
    })

    it('should format transaction dates correctly', () => {
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

      mockUseWalletTransactions.mockReturnValue({
        data: mockTransactions,
        isLoading: false,
        error: null,
      } as any)

      renderDashboard()

      // Check that date is formatted (exact format depends on locale)
      expect(screen.getByText(/Jan 15, 2024/i)).toBeInTheDocument()
      expect(screen.getByText(/Jan 14, 2024/i)).toBeInTheDocument()
      expect(screen.getByText(/Jan 13, 2024/i)).toBeInTheDocument()
    })
  })
})
