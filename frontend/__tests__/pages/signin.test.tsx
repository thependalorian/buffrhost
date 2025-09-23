import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignInPage from '@/app/signin/page'

// Mock fetch for API calls
global.fetch = jest.fn()

describe('SignInPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear localStorage
    localStorage.clear()
  })

  it('renders sign in form with all required fields', () => {
    render(<SignInPage />)
    
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    render(<SignInPage />)
    
    const passwordInput = screen.getByLabelText('Password')
    const toggleButton = screen.getByLabelText('Toggle password visibility')
    
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('shows loading state during form submission', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ access_token: 'fake-token', user: { email: 'test@example.com' } })
      }), 100))
    )
    
    render(<SignInPage />)
    
    await act(async () => {
      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByDisplayValue(''), 'password123') // Password input
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)
    })
    
    expect(screen.getByText(/signing in/i)).toBeInTheDocument()
    const submitButton = screen.getByRole('button', { name: /signing in/i })
    expect(submitButton).toBeDisabled()
  })

  it('handles successful login', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ 
        access_token: 'fake-token', 
        user: { email: 'test@example.com' } 
      })
    }
    ;(fetch as jest.Mock).mockResolvedValue(mockResponse)
    
    // Mock window.location.href
    delete (window as any).location
    window.location = { href: '' } as any
    
    render(<SignInPage />)
    
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await user.type(screen.getByDisplayValue(''), 'password123') // Password input
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        })
      )
    })
    
    await waitFor(() => {
      expect(localStorage.getItem('access_token')).toBe('fake-token')
    })
  })

  it('displays error message on login failure', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ detail: 'Invalid credentials' })
    }
    ;(fetch as jest.Mock).mockResolvedValue(mockResponse)
    
    render(<SignInPage />)
    
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await user.type(screen.getByDisplayValue(''), 'wrongpassword') // Password input
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('clears error when user starts typing', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ detail: 'Invalid credentials' })
    }
    ;(fetch as jest.Mock).mockResolvedValue(mockResponse)
    
    render(<SignInPage />)
    
    // First, trigger an error
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrongpassword')
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
    
    // Then start typing again
    await user.type(screen.getByDisplayValue('test@example.com'), 'x')
    
    await waitFor(() => {
      expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument()
    })
  })

  it('renders social login buttons', () => {
    render(<SignInPage />)
    
    expect(screen.getByText(/google/i)).toBeInTheDocument()
    expect(screen.getByText(/facebook/i)).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<SignInPage />)
    
    // Check for multiple instances of "Buffr Host" (header and navigation)
    expect(screen.getAllByText(/buffr host/i)).toHaveLength(2)
    expect(screen.getByText(/home/i)).toBeInTheDocument()
    expect(screen.getByText(/features/i)).toBeInTheDocument()
    expect(screen.getByText(/solutions/i)).toBeInTheDocument()
    expect(screen.getByText(/pricing/i)).toBeInTheDocument()
  })

  it('renders sign up link', () => {
    render(<SignInPage />)
    
    const signUpLink = screen.getByText(/sign up for free/i)
    expect(signUpLink).toBeInTheDocument()
    expect(signUpLink.closest('a')).toHaveAttribute('href', '/signup')
  })

  it('renders forgot password link', () => {
    render(<SignInPage />)
    
    const forgotPasswordLink = screen.getByText(/forgot your password/i)
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/forgot-password')
  })
})
