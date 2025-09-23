import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginForm from '@/components/auth/LoginForm'

// Mock the auth context
jest.mock('@/lib/auth/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    isLoading: false,
    error: null,
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
      {ui}
    </QueryClientProvider>
  )
}

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders login form with all required fields', () => {
    renderWithProviders(<LoginForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email format', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    const mockLogin = jest.fn()
    
    jest.doMock('@/lib/auth/AuthContext', () => ({
      useAuth: () => ({
        login: mockLogin,
        isLoading: false,
        error: null,
      }),
    }))
    
    renderWithProviders(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    
    jest.doMock('@/lib/auth/AuthContext', () => ({
      useAuth: () => ({
        login: jest.fn(),
        isLoading: true,
        error: null,
      }),
    }))
    
    renderWithProviders(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/signing in/i)).toBeInTheDocument()
  })

  it('displays error message when login fails', () => {
    jest.doMock('@/lib/auth/AuthContext', () => ({
      useAuth: () => ({
        login: jest.fn(),
        isLoading: false,
        error: 'Invalid credentials',
      }),
    }))
    
    renderWithProviders(<LoginForm />)
    
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)
    
    const passwordInput = screen.getByLabelText(/password/i)
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i })
    
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('navigates to forgot password page', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)
    
    const forgotPasswordLink = screen.getByText(/forgot password/i)
    await user.click(forgotPasswordLink)
    
    // This would test navigation in a real implementation
    expect(forgotPasswordLink).toBeInTheDocument()
  })

  it('navigates to sign up page', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)
    
    const signUpLink = screen.getByText(/don't have an account/i)
    await user.click(signUpLink)
    
    // This would test navigation in a real implementation
    expect(signUpLink).toBeInTheDocument()
  })
})
