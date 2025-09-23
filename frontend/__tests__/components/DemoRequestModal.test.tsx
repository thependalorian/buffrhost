import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DemoRequestModal from '@/app/components/DemoRequestModal'

// Mock the modal component since it exists in the actual codebase
describe('DemoRequestModal', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders modal when isOpen is true', () => {
    render(<DemoRequestModal isOpen={true} onClose={mockOnClose} />)
    
    expect(screen.getByText(/request a demo/i)).toBeInTheDocument()
  })

  it('does not render modal when isOpen is false', () => {
    render(<DemoRequestModal isOpen={false} onClose={mockOnClose} />)
    
    expect(screen.queryByText(/request a demo/i)).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<DemoRequestModal isOpen={true} onClose={mockOnClose} />)
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    render(<DemoRequestModal isOpen={true} onClose={mockOnClose} />)
    
    const backdrop = screen.getByTestId('modal-backdrop')
    await user.click(backdrop)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('renders form fields correctly', () => {
    render(<DemoRequestModal isOpen={true} onClose={mockOnClose} />)
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/business name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/business type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    
    // Mock fetch for successful submission
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Demo request submitted successfully' }),
    })
    
    render(<DemoRequestModal isOpen={true} onClose={mockOnClose} />)
    
    // Fill out the form with actual field names from the component
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone number/i), '1234567890')
    await user.type(screen.getByLabelText(/business name/i), 'Test Company')
    await user.selectOptions(screen.getByLabelText(/business type/i), 'hotel')
    await user.type(screen.getByLabelText(/location/i), 'Windhoek, Namibia')
    
    const submitButton = screen.getByRole('button', { name: /request demo/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/thank you for your interest/i)).toBeInTheDocument()
    })
  })

  it('shows error message on submission failure', async () => {
    const user = userEvent.setup()
    
    // Mock fetch for failed submission
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    })
    
    render(<DemoRequestModal isOpen={true} onClose={mockOnClose} />)
    
    // Fill out required fields
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/business name/i), 'Test Company')
    await user.selectOptions(screen.getByLabelText(/business type/i), 'hotel')
    await user.type(screen.getByLabelText(/location/i), 'Windhoek, Namibia')
    
    const submitButton = screen.getByRole('button', { name: /request demo/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to submit demo request/i)).toBeInTheDocument()
    })
  })
})
