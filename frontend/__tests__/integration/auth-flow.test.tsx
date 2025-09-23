import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import AuthFlow from '@/components/auth/AuthFlow'

// Mock the auth service
const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn(),
}

jest.mock('@/lib/services/authService', () => mockAuthService)

// Mock the auth context
jest.mock('@/lib/auth/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isLoading: false,
    error: null,
    login: mockAuthService.login,
    register: mockAuthService.register,
    logout: mockAuthService.logout,
  }),
}))

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('Auth Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Login Flow', () => {
    it('completes successful login flow', async () => {
      const user = userEvent.setup()
      mockAuthService.login.mockResolvedValue({
        user: { id: 1, email: 'test@example.com', name: 'Test User' },
        token: 'mock-jwt-token',
      })

      renderWithProviders(<AuthFlow />)

      // Navigate to login
      const loginButton = screen.getByText(/sign in/i)
      await user.click(loginButton)

      // Fill login form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      
      // Submit login
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockAuthService.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        })
      })

      // Should redirect to dashboard after successful login
      await waitFor(() => {
        expect(screen.getByText(/welcome, test user/i)).toBeInTheDocument()
      })
    })

    it('handles login failure gracefully', async () => {
      const user = userEvent.setup()
      mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'))

      renderWithProviders(<AuthFlow />)

      // Navigate to login
      const loginButton = screen.getByText(/sign in/i)
      await user.click(loginButton)

      // Fill login form with invalid credentials
      await user.type(screen.getByLabelText(/email/i), 'invalid@example.com')
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
      
      // Submit login
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      })

      // Should remain on login page
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })
  })

  describe('Registration Flow', () => {
    it('completes successful registration flow', async () => {
      const user = userEvent.setup()
      mockAuthService.register.mockResolvedValue({
        user: { id: 2, email: 'newuser@example.com', name: 'New User' },
        token: 'mock-jwt-token',
      })

      renderWithProviders(<AuthFlow />)

      // Navigate to registration
      const registerButton = screen.getByText(/sign up/i)
      await user.click(registerButton)

      // Fill registration form
      await user.type(screen.getByLabelText(/full name/i), 'New User')
      await user.type(screen.getByLabelText(/email/i), 'newuser@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')
      
      // Submit registration
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockAuthService.register).toHaveBeenCalledWith({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        })
      })

      // Should redirect to dashboard after successful registration
      await waitFor(() => {
        expect(screen.getByText(/welcome, new user/i)).toBeInTheDocument()
      })
    })

    it('validates password confirmation', async () => {
      const user = userEvent.setup()

      renderWithProviders(<AuthFlow />)

      // Navigate to registration
      const registerButton = screen.getByText(/sign up/i)
      await user.click(registerButton)

      // Fill registration form with mismatched passwords
      await user.type(screen.getByLabelText(/full name/i), 'New User')
      await user.type(screen.getByLabelText(/email/i), 'newuser@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'differentpassword')
      
      // Submit registration
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
      })

      // Should not call register service
      expect(mockAuthService.register).not.toHaveBeenCalled()
    })
  })

  describe('Logout Flow', () => {
    it('completes logout flow', async () => {
      const user = userEvent.setup()
      mockAuthService.logout.mockResolvedValue(undefined)

      // Mock authenticated state
      jest.doMock('@/lib/auth/AuthContext', () => ({
        useAuth: () => ({
          user: { id: 1, email: 'test@example.com', name: 'Test User' },
          isLoading: false,
          error: null,
          login: mockAuthService.login,
          register: mockAuthService.register,
          logout: mockAuthService.logout,
        }),
      }))

      renderWithProviders(<AuthFlow />)

      // Should show authenticated state
      expect(screen.getByText(/welcome, test user/i)).toBeInTheDocument()

      // Click logout
      const logoutButton = screen.getByText(/logout/i)
      await user.click(logoutButton)

      await waitFor(() => {
        expect(mockAuthService.logout).toHaveBeenCalled()
      })

      // Should redirect to login page
      await waitFor(() => {
        expect(screen.getByText(/sign in/i)).toBeInTheDocument()
      })
    })
  })

  describe('Protected Route Flow', () => {
    it('redirects unauthenticated users to login', () => {
      renderWithProviders(<AuthFlow />)

      // Should show login page for unauthenticated users
      expect(screen.getByText(/sign in/i)).toBeInTheDocument()
      expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument()
    })

    it('allows authenticated users to access protected routes', () => {
      // Mock authenticated state
      jest.doMock('@/lib/auth/AuthContext', () => ({
        useAuth: () => ({
          user: { id: 1, email: 'test@example.com', name: 'Test User' },
          isLoading: false,
          error: null,
          login: mockAuthService.login,
          register: mockAuthService.register,
          logout: mockAuthService.logout,
        }),
      }))

      renderWithProviders(<AuthFlow />)

      // Should show dashboard for authenticated users
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
      expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('displays network error messages', async () => {
      const user = userEvent.setup()
      mockAuthService.login.mockRejectedValue(new Error('Network error'))

      renderWithProviders(<AuthFlow />)

      // Navigate to login
      const loginButton = screen.getByText(/sign in/i)
      await user.click(loginButton)

      // Fill and submit login form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument()
      })
    })

    it('handles server validation errors', async () => {
      const user = userEvent.setup()
      mockAuthService.register.mockRejectedValue({
        message: 'Validation failed',
        errors: {
          email: 'Email already exists',
          password: 'Password too weak',
        },
      })

      renderWithProviders(<AuthFlow />)

      // Navigate to registration
      const registerButton = screen.getByText(/sign up/i)
      await user.click(registerButton)

      // Fill and submit registration form
      await user.type(screen.getByLabelText(/full name/i), 'Test User')
      await user.type(screen.getByLabelText(/email/i), 'existing@example.com')
      await user.type(screen.getByLabelText(/password/i), 'weak')
      await user.type(screen.getByLabelText(/confirm password/i), 'weak')
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
        expect(screen.getByText(/password too weak/i)).toBeInTheDocument()
      })
    })
  })
})
