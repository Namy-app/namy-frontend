import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import WalletPage from '../page'
import { useAuthStore } from '@/store/useAuthStore'
import { useWallet, useCreateWallet } from '@/domains/payment/hooks'

// Mock the modules
jest.mock('@/store/useAuthStore')
jest.mock('@/domains/payment/hooks', () => ({
  useWallet: jest.fn(),
  useCreateWallet: jest.fn(),
  useWalletBalance: jest.fn(),
  useWalletTransactions: jest.fn(),
}))

jest.mock('@/domains/payment/components', () => ({
  WalletDashboard: jest.fn(({ userId }) => (
    <div data-testid="wallet-dashboard">Wallet Dashboard for {userId}</div>
  )),
  DepositForm: jest.fn(({ onSuccess, onCancel }) => (
    <div data-testid="deposit-form">
      <button onClick={onSuccess}>Success</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )),
}))

jest.mock('@/components/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('@/layouts/BasicLayout', () => ({
  BasicLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>
const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>
const mockUseCreateWallet = useCreateWallet as jest.MockedFunction<typeof useCreateWallet>

describe('Wallet Page', () => {
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
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  }

  const mockWallet = {
    id: 'wallet-123',
    userId: 'user-123',
    balance: 50000, // $500.00 MXN
    currency: 'MXN',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
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

    mockUseCreateWallet.mockReturnValue({
      mutateAsync: jest.fn().mockResolvedValue(mockWallet),
      isPending: false,
      isError: false,
      isSuccess: false,
      error: null,
      data: undefined,
      mutate: jest.fn(),
      reset: jest.fn(),
      status: 'idle',
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isIdle: true,
      isPaused: false,
      submittedAt: 0,
    })
  })

  const renderWalletPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <WalletPage />
      </QueryClientProvider>
    )
  }

  describe('WAL-001: Wallet Display', () => {
    it('should show loading state while fetching wallet', () => {
      mockUseWallet.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: false,
        status: 'pending',
        dataUpdatedAt: 0,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        fetchStatus: 'fetching',
        isFetching: true,
        isFetched: false,
        isFetchedAfterMount: false,
        isLoadingError: false,
        isPaused: false,
        isPlaceholderData: false,
        isRefetchError: false,
        isRefetching: false,
        isStale: false,
        isInitialLoading: true,
      })

      renderWalletPage()

      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
    })

    it('should display wallet dashboard when user has a wallet', () => {
      mockUseWallet.mockReturnValue({
        data: mockWallet,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: true,
        status: 'success',
        dataUpdatedAt: Date.now(),
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        fetchStatus: 'idle',
        isInitialLoading: false,
        isFetching: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoadingError: false,
        isPaused: false,
        isPlaceholderData: false,
        isRefetchError: false,
        isRefetching: false,
        isStale: false,
      })

      renderWalletPage()

      expect(screen.getByTestId('wallet-dashboard')).toBeInTheDocument()
      expect(screen.getByText(/Wallet Dashboard for user-123/i)).toBeInTheDocument()
    })

    it('should show create wallet option when no wallet exists', () => {
      mockUseWallet.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: true,
        status: 'success',
        dataUpdatedAt: Date.now(),
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        fetchStatus: 'idle',
        isInitialLoading: false,
        isFetching: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoadingError: false,
        isPaused: false,
        isPlaceholderData: false,
        isRefetchError: false,
        isRefetching: false,
        isStale: false,
      })

      renderWalletPage()

      expect(screen.getByText(/No Wallet Found/i)).toBeInTheDocument()
      expect(screen.getByText(/You don't have a wallet yet/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Crear Billetera/i })).toBeInTheDocument()
    })

    it('should show error when user information is unavailable', () => {
      mockUseAuthStore.mockReturnValue({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        rememberMe: false,
        expiresAt: null,
        setAuth: jest.fn(),
        clearAuth: jest.fn(),
        updateUser: jest.fn(),
        checkExpiration: jest.fn(),
      })

      mockUseWallet.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: false,
        status: 'success',
        dataUpdatedAt: 0,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        fetchStatus: 'idle',
        isInitialLoading: false,
        isFetching: false,
        isFetched: false,
        isFetchedAfterMount: false,
        isLoadingError: false,
        isPaused: false,
        isPlaceholderData: false,
        isRefetchError: false,
        isRefetching: false,
        isStale: false,
      })

      renderWalletPage()

      expect(screen.getByText(/Unable to load user information/i)).toBeInTheDocument()
    })
  })

  describe('WAL-002: Create Wallet', () => {
    it('should create wallet when create button is clicked', async () => {
      const mockMutateAsync = jest.fn().mockResolvedValue(mockWallet)
      const mockRefetch = jest.fn()

      mockUseWallet.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
        isError: false,
        isSuccess: true,
        status: 'success',
        dataUpdatedAt: Date.now(),
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        fetchStatus: 'idle',
        isInitialLoading: false,
        isFetching: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoadingError: false,
        isPaused: false,
        isPlaceholderData: false,
        isRefetchError: false,
        isRefetching: false,
        isStale: false,
      })

      mockUseCreateWallet.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false,
        isError: false,
        isSuccess: false,
        error: null,
        data: undefined,
        mutate: jest.fn(),
        reset: jest.fn(),
        status: 'idle',
        variables: undefined,
        context: undefined,
        failureCount: 0,
        failureReason: null,
        isIdle: true,
        isPaused: false,
        submittedAt: 0,
      })

      renderWalletPage()

      const createButton = screen.getByRole('button', { name: /Crear Billetera/i })
      fireEvent.click(createButton)

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          userId: mockUser.id,
          currency: 'MXN',
        })
      })

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled()
      })
    })

    it('should show loading state while creating wallet', () => {
      mockUseWallet.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: true,
        status: 'success',
        dataUpdatedAt: Date.now(),
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        fetchStatus: 'idle',
        isInitialLoading: false,
        isFetching: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoadingError: false,
        isPaused: false,
        isPlaceholderData: false,
        isRefetchError: false,
        isRefetching: false,
        isStale: false,
      })

      mockUseCreateWallet.mockReturnValue({
        mutateAsync: jest.fn(),
        isPending: true,
        isError: false,
        isSuccess: false,
        error: null,
        data: undefined,
        mutate: jest.fn(),
        reset: jest.fn(),
        status: 'pending',
        variables: undefined,
        context: undefined,
        failureCount: 0,
        failureReason: null,
        isIdle: false,
        isPaused: false,
        submittedAt: Date.now(),
      })

      renderWalletPage()

      const createButton = screen.getByRole('button', { name: /Creando.../i })
      expect(createButton).toBeDisabled()
    })
  })

  describe('WAL-003: Add Funds Flow', () => {
    it('should show add funds button when wallet exists', () => {
      mockUseWallet.mockReturnValue({
        data: mockWallet,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: true,
        status: 'success',
        dataUpdatedAt: Date.now(),
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        fetchStatus: 'idle',
        isInitialLoading: false,
        isFetching: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoadingError: false,
        isPaused: false,
        isPlaceholderData: false,
        isRefetchError: false,
        isRefetching: false,
        isStale: false,
      })

      renderWalletPage()

      expect(screen.getByRole('button', { name: /Añadir Fondos/i })).toBeInTheDocument()
    })

    it('should show deposit form when add funds button is clicked', () => {
      mockUseWallet.mockReturnValue({
        data: mockWallet,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: true,
        status: 'success',
        dataUpdatedAt: Date.now(),
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        fetchStatus: 'idle',
        isInitialLoading: false,
        isFetching: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoadingError: false,
        isPaused: false,
        isPlaceholderData: false,
        isRefetchError: false,
        isRefetching: false,
        isStale: false,
      })

      renderWalletPage()

      const addFundsButton = screen.getByRole('button', { name: /Añadir Fondos/i })
      fireEvent.click(addFundsButton)

      expect(screen.getByTestId('deposit-form')).toBeInTheDocument()
    })

    it('should hide deposit form and show wallet when cancel is clicked', () => {
      mockUseWallet.mockReturnValue({
        data: mockWallet,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: true,
        status: 'success',
        dataUpdatedAt: Date.now(),
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        fetchStatus: 'idle',
        isInitialLoading: false,
        isFetching: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoadingError: false,
        isPaused: false,
        isPlaceholderData: false,
        isRefetchError: false,
        isRefetching: false,
        isStale: false,
      })

      renderWalletPage()

      // Open deposit form
      const addFundsButton = screen.getByRole('button', { name: /Añadir Fondos/i })
      fireEvent.click(addFundsButton)

      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      fireEvent.click(cancelButton)

      expect(screen.queryByTestId('deposit-form')).not.toBeInTheDocument()
      expect(screen.getByTestId('wallet-dashboard')).toBeInTheDocument()
    })

    it('should refetch wallet after successful deposit', async () => {
      const mockRefetch = jest.fn()

      mockUseWallet.mockReturnValue({
        data: mockWallet,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
        isError: false,
        isSuccess: true,
        status: 'success',
        dataUpdatedAt: Date.now(),
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        fetchStatus: 'idle',
        isInitialLoading: false,
        isFetching: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoadingError: false,
        isPaused: false,
        isPlaceholderData: false,
        isRefetchError: false,
        isRefetching: false,
        isStale: false,
      })

      renderWalletPage()

      // Open deposit form
      const addFundsButton = screen.getByRole('button', { name: /Añadir Fondos/i })
      fireEvent.click(addFundsButton)

      // Click success
      const successButton = screen.getByRole('button', { name: /Success/i })
      fireEvent.click(successButton)

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled()
      })
    })
  })

  describe('WAL-004: Protected Route', () => {
    it('should render within protected route wrapper', () => {
      mockUseWallet.mockReturnValue({
        data: mockWallet,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: true,
        status: 'success',
        dataUpdatedAt: Date.now(),
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        fetchStatus: 'idle',
        isInitialLoading: false,
        isFetching: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isLoadingError: false,
        isPaused: false,
        isPlaceholderData: false,
        isRefetchError: false,
        isRefetching: false,
        isStale: false,
      })

      const { container } = renderWalletPage()

      expect(container).toBeInTheDocument()
      expect(screen.getByText(/Wallet & Payments/i)).toBeInTheDocument()
    })
  })
})
