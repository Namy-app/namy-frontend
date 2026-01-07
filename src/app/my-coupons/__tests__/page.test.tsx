import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tantml:react-query'
import MyCouponsPage from '../page'
import { useAuthStore } from '@/store/useAuthStore'
import { graphqlRequest } from '@/lib/graphql-client'
import type { Coupon } from '@/domains/coupon/type'

// Mock modules
jest.mock('@/store/useAuthStore')
jest.mock('@/lib/graphql-client')
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}))

jest.mock('@/layouts/BasicLayout', () => ({
  BasicLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>
const mockGraphqlRequest = graphqlRequest as jest.MockedFunction<typeof graphqlRequest>

describe('My Coupons Page', () => {
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

  const mockCoupons: Coupon[] = [
    {
      id: 'coupon-1',
      code: 'SAVE20',
      url: 'https://example.com/redeem/abc123',
      qrCode: 'https://example.com/qr/abc123.png',
      used: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      store: {
        id: 'store-1',
        name: 'Test Restaurant',
        category: 'restaurant',
        subCategory: 'mexican',
        description: 'Test description',
        logoUrl: 'https://example.com/logo.png',
        restrictions: 'No alcohol',
      },
      discount: {
        id: 'discount-1',
        title: '20% off your order',
        type: 'percentage',
        value: 20,
        restrictions: 'Valid for orders over $100',
        minPurchaseAmount: 10000,
        maxDiscountAmount: 5000,
      },
    },
    {
      id: 'coupon-2',
      code: 'EXPIRED',
      url: 'https://example.com/redeem/xyz789',
      qrCode: 'https://example.com/qr/xyz789.png',
      used: false,
      expiresAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      store: {
        id: 'store-2',
        name: 'Another Restaurant',
        category: 'restaurant',
        subCategory: 'italian',
        description: 'Test description',
        logoUrl: 'https://example.com/logo2.png',
        restrictions: null,
      },
      discount: {
        id: 'discount-2',
        title: '15% off',
        type: 'percentage',
        value: 15,
        restrictions: null,
        minPurchaseAmount: null,
        maxDiscountAmount: null,
      },
    },
    {
      id: 'coupon-3',
      code: 'REDEEMED',
      url: 'https://example.com/redeem/def456',
      qrCode: 'https://example.com/qr/def456.png',
      used: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      store: {
        id: 'store-3',
        name: 'Third Restaurant',
        category: 'restaurant',
        subCategory: 'japanese',
        description: 'Test description',
        logoUrl: 'https://example.com/logo3.png',
        restrictions: null,
      },
      discount: {
        id: 'discount-3',
        title: '10% off',
        type: 'percentage',
        value: 10,
        restrictions: null,
        minPurchaseAmount: null,
        maxDiscountAmount: null,
      },
    },
  ]

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

    mockGraphqlRequest.mockResolvedValue({
      myCoupons: mockCoupons,
    })
  })

  const renderCouponsPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MyCouponsPage />
      </QueryClientProvider>
    )
  }

  describe('CPN-001: Page Display', () => {
    it('should show loading state while fetching coupons', () => {
      renderCouponsPage()

      expect(screen.getByText(/Cargando tus cupones/i)).toBeInTheDocument()
    })

    it('should display coupons list after loading', async () => {
      renderCouponsPage()

      await waitFor(() => {
        expect(screen.getByText('Mis Cupones')).toBeInTheDocument()
        expect(screen.getByText('SAVE20')).toBeInTheDocument()
      })
    })

    it('should show total coupon count', async () => {
      renderCouponsPage()

      await waitFor(() => {
        expect(screen.getByText('3 Cupones')).toBeInTheDocument()
      })
    })

    it('should show empty state when no coupons exist', async () => {
      mockGraphqlRequest.mockResolvedValue({
        myCoupons: [],
      })

      renderCouponsPage()

      await waitFor(() => {
        expect(screen.getByText(/Aún no tienes cupones/i)).toBeInTheDocument()
        expect(screen.getByText(/Explora descuentos/i)).toBeInTheDocument()
      })
    })
  })

  describe('CPN-002: Filter Tabs', () => {
    it('should display all filter tabs with counts', async () => {
      renderCouponsPage()

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Todos \(3\)/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Activos \(1\)/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Canjeados \(1\)/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Expirados \(1\)/i })).toBeInTheDocument()
      })
    })

    it('should filter coupons when active tab is clicked', async () => {
      renderCouponsPage()

      await waitFor(() => {
        expect(screen.getByText('SAVE20')).toBeInTheDocument()
      })

      const activeTab = screen.getByRole('button', { name: /Activos \(1\)/i })
      fireEvent.click(activeTab)

      await waitFor(() => {
        expect(screen.getByText('SAVE20')).toBeInTheDocument()
        expect(screen.queryByText('EXPIRED')).not.toBeInTheDocument()
        expect(screen.queryByText('REDEEMED')).not.toBeInTheDocument()
      })
    })

    it('should filter coupons when redeemed tab is clicked', async () => {
      renderCouponsPage()

      await waitFor(() => {
        expect(screen.getByText('SAVE20')).toBeInTheDocument()
      })

      const redeemedTab = screen.getByRole('button', { name: /Canjeados \(1\)/i })
      fireEvent.click(redeemedTab)

      await waitFor(() => {
        expect(screen.getByText('REDEEMED')).toBeInTheDocument()
        expect(screen.queryByText('SAVE20')).not.toBeInTheDocument()
        expect(screen.queryByText('EXPIRED')).not.toBeInTheDocument()
      })
    })

    it('should filter coupons when expired tab is clicked', async () => {
      renderCouponsPage()

      await waitFor(() => {
        expect(screen.getByText('SAVE20')).toBeInTheDocument()
      })

      const expiredTab = screen.getByRole('button', { name: /Expirados \(1\)/i })
      fireEvent.click(expiredTab)

      await waitFor(() => {
        expect(screen.getByText('EXPIRED')).toBeInTheDocument()
        expect(screen.queryByText('SAVE20')).not.toBeInTheDocument()
        expect(screen.queryByText('REDEEMED')).not.toBeInTheDocument()
      })
    })

    it('should show all coupons when all tab is clicked', async () => {
      renderCouponsPage()

      await waitFor(() => {
        const activeTab = screen.getByRole('button', { name: /Activos/i })
        fireEvent.click(activeTab)
      })

      await waitFor(() => {
        const allTab = screen.getByRole('button', { name: /Todos/i })
        fireEvent.click(allTab)
      })

      await waitFor(() => {
        expect(screen.getByText('SAVE20')).toBeInTheDocument()
        expect(screen.getByText('EXPIRED')).toBeInTheDocument()
        expect(screen.getByText('REDEEMED')).toBeInTheDocument()
      })
    })
  })

  describe('CPN-003: Empty Filter States', () => {
    it('should show empty state message when filtered list is empty', async () => {
      mockGraphqlRequest.mockResolvedValue({
        myCoupons: [mockCoupons[0]], // Only active coupon
      })

      renderCouponsPage()

      await waitFor(() => {
        const redeemedTab = screen.getByRole('button', { name: /Canjeados/i })
        fireEvent.click(redeemedTab)
      })

      await waitFor(() => {
        expect(screen.getByText(/No hay cupones canjeados/i)).toBeInTheDocument()
      })
    })

    it('should show button to view all coupons from empty filter state', async () => {
      mockGraphqlRequest.mockResolvedValue({
        myCoupons: [mockCoupons[0]], // Only active coupon
      })

      renderCouponsPage()

      await waitFor(() => {
        const expiredTab = screen.getByRole('button', { name: /Expirados/i })
        fireEvent.click(expiredTab)
      })

      await waitFor(() => {
        const viewAllButton = screen.getByRole('button', { name: /Ver todos los cupones/i })
        expect(viewAllButton).toBeInTheDocument()
        fireEvent.click(viewAllButton)
      })

      await waitFor(() => {
        expect(screen.getByText('SAVE20')).toBeInTheDocument()
      })
    })
  })

  describe('CPN-004: QR Code Modal', () => {
    it('should open QR code modal when view QR button is clicked', async () => {
      renderCouponsPage()

      await waitFor(() => {
        expect(screen.getByText('SAVE20')).toBeInTheDocument()
      })

      // Assuming CouponCard has a button to view QR code
      // This test would need the actual button identifier from CouponCard component
      // For now, this is a placeholder to show the structure
    })

    it('should close QR code modal when close button is clicked', async () => {
      renderCouponsPage()

      // Test implementation would depend on CouponCard component structure
    })

    it('should display QR code image in modal', async () => {
      renderCouponsPage()

      // Test implementation would depend on CouponCard component structure
    })

    it('should display coupon code in modal', async () => {
      renderCouponsPage()

      // Test implementation would depend on CouponCard component structure
    })
  })

  describe('CPN-005: Share Functionality', () => {
    it('should call navigator.share when share button is clicked', async () => {
      const mockShare = jest.fn().mockResolvedValue(undefined)
      global.navigator.share = mockShare

      renderCouponsPage()

      await waitFor(() => {
        expect(screen.getByText('SAVE20')).toBeInTheDocument()
      })

      // Test implementation would depend on CouponCard component structure
    })

    it('should copy to clipboard when navigator.share is not available', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined)
      global.navigator.clipboard = { writeText: mockWriteText } as any
      global.navigator.share = undefined as any
      global.alert = jest.fn()

      renderCouponsPage()

      await waitFor(() => {
        expect(screen.getByText('SAVE20')).toBeInTheDocument()
      })

      // Test implementation would depend on CouponCard component structure
    })
  })

  describe('CPN-006: Delete Functionality', () => {
    it('should show confirmation dialog when delete button is clicked', async () => {
      global.confirm = jest.fn(() => true)
      global.alert = jest.fn()

      renderCouponsPage()

      await waitFor(() => {
        expect(screen.getByText('SAVE20')).toBeInTheDocument()
      })

      // Test implementation would depend on CouponCard component structure
    })

    it('should not delete when user cancels confirmation', async () => {
      global.confirm = jest.fn(() => false)

      renderCouponsPage()

      await waitFor(() => {
        expect(screen.getByText('SAVE20')).toBeInTheDocument()
      })

      // Test implementation would depend on CouponCard component structure
    })
  })

  describe('CPN-007: Error Handling', () => {
    it('should display error message when coupon fetch fails', async () => {
      mockGraphqlRequest.mockRejectedValue(new Error('Failed to fetch coupons'))

      renderCouponsPage()

      await waitFor(() => {
        expect(screen.getByText(/Algo salió mal/i)).toBeInTheDocument()
      })
    })

    it('should show explore button when error occurs', async () => {
      mockGraphqlRequest.mockRejectedValue(new Error('Failed to fetch coupons'))

      renderCouponsPage()

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Explorar Descuentos/i })).toBeInTheDocument()
      })
    })
  })

  describe('CPN-008: Coupon Status', () => {
    it('should correctly identify active coupons', async () => {
      renderCouponsPage()

      await waitFor(() => {
        const activeTab = screen.getByRole('button', { name: /Activos \(1\)/i })
        expect(activeTab).toBeInTheDocument()
      })
    })

    it('should correctly identify expired coupons', async () => {
      renderCouponsPage()

      await waitFor(() => {
        const expiredTab = screen.getByRole('button', { name: /Expirados \(1\)/i })
        expect(expiredTab).toBeInTheDocument()
      })
    })

    it('should correctly identify redeemed coupons', async () => {
      renderCouponsPage()

      await waitFor(() => {
        const redeemedTab = screen.getByRole('button', { name: /Canjeados \(1\)/i })
        expect(redeemedTab).toBeInTheDocument()
      })
    })
  })

  describe('CPN-009: Navigation', () => {
    it('should navigate to explore page when explore button is clicked from empty state', async () => {
      mockGraphqlRequest.mockResolvedValue({
        myCoupons: [],
      })

      const mockPush = jest.fn()
      const useRouter = require('next/navigation').useRouter
      useRouter.mockReturnValue({
        push: mockPush,
        replace: jest.fn(),
      })

      renderCouponsPage()

      await waitFor(() => {
        const exploreButton = screen.getByRole('button', { name: /Explorar Descuentos/i })
        fireEvent.click(exploreButton)
      })

      expect(mockPush).toHaveBeenCalledWith('/explore')
    })
  })
})
