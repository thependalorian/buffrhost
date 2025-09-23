import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MenuItem from '@/components/menu/MenuItem'

// Mock the menu hooks
jest.mock('@/hooks/useMenu', () => ({
  useMenu: () => ({
    updateMenuItem: jest.fn(),
    deleteMenuItem: jest.fn(),
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

const mockMenuItem = {
  id: 1,
  name: 'Caesar Salad',
  description: 'Fresh romaine lettuce with caesar dressing',
  price: 12.99,
  category: 'Appetizers',
  preparationTime: 10,
  status: 'active',
  imageUrl: '/images/caesar-salad.jpg',
  allergens: ['dairy', 'gluten'],
  isVegetarian: true,
  isVegan: false,
  calories: 250,
  ingredients: ['romaine lettuce', 'parmesan cheese', 'croutons', 'caesar dressing'],
}

describe('MenuItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders menu item with all details', () => {
    renderWithProviders(<MenuItem item={mockMenuItem} />)
    
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument()
    expect(screen.getByText('Fresh romaine lettuce with caesar dressing')).toBeInTheDocument()
    expect(screen.getByText('N$12.99')).toBeInTheDocument()
    expect(screen.getByText('Appetizers')).toBeInTheDocument()
    expect(screen.getByText('10 min')).toBeInTheDocument()
  })

  it('displays vegetarian and vegan badges correctly', () => {
    renderWithProviders(<MenuItem item={mockMenuItem} />)
    
    expect(screen.getByText('Vegetarian')).toBeInTheDocument()
    expect(screen.queryByText('Vegan')).not.toBeInTheDocument()
  })

  it('shows allergens information', () => {
    renderWithProviders(<MenuItem item={mockMenuItem} />)
    
    expect(screen.getByText('Contains: dairy, gluten')).toBeInTheDocument()
  })

  it('displays nutritional information', () => {
    renderWithProviders(<MenuItem item={mockMenuItem} />)
    
    expect(screen.getByText('250 cal')).toBeInTheDocument()
  })

  it('shows ingredients on hover', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MenuItem item={mockMenuItem} />)
    
    const itemCard = screen.getByTestId('menu-item-1')
    await user.hover(itemCard)
    
    await waitFor(() => {
      expect(screen.getByText('Ingredients:')).toBeInTheDocument()
      expect(screen.getByText('romaine lettuce')).toBeInTheDocument()
      expect(screen.getByText('parmesan cheese')).toBeInTheDocument()
    })
  })

  it('handles edit mode', async () => {
    const user = userEvent.setup()
    const mockOnEdit = jest.fn()
    
    renderWithProviders(<MenuItem item={mockMenuItem} onEdit={mockOnEdit} />)
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockMenuItem)
  })

  it('handles delete confirmation', async () => {
    const user = userEvent.setup()
    const mockOnDelete = jest.fn()
    
    renderWithProviders(<MenuItem item={mockMenuItem} onDelete={mockOnDelete} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)
    
    // Should show confirmation dialog
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
    
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    await user.click(confirmButton)
    
    expect(mockOnDelete).toHaveBeenCalledWith(mockMenuItem.id)
  })

  it('cancels delete when user clicks cancel', async () => {
    const user = userEvent.setup()
    const mockOnDelete = jest.fn()
    
    renderWithProviders(<MenuItem item={mockMenuItem} onDelete={mockOnDelete} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)
    
    expect(mockOnDelete).not.toHaveBeenCalled()
    expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument()
  })

  it('toggles availability status', async () => {
    const user = userEvent.setup()
    const mockOnToggleStatus = jest.fn()
    
    renderWithProviders(<MenuItem item={mockMenuItem} onToggleStatus={mockOnToggleStatus} />)
    
    const statusToggle = screen.getByRole('switch', { name: /availability/i })
    await user.click(statusToggle)
    
    expect(mockOnToggleStatus).toHaveBeenCalledWith(mockMenuItem.id, 'inactive')
  })

  it('shows loading state during operations', () => {
    jest.doMock('@/hooks/useMenu', () => ({
      useMenu: () => ({
        updateMenuItem: jest.fn(),
        deleteMenuItem: jest.fn(),
        isLoading: true,
        error: null,
      }),
    }))
    
    renderWithProviders(<MenuItem item={mockMenuItem} />)
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('displays error message when operation fails', () => {
    jest.doMock('@/hooks/useMenu', () => ({
      useMenu: () => ({
        updateMenuItem: jest.fn(),
        deleteMenuItem: jest.fn(),
        isLoading: false,
        error: 'Failed to update menu item',
      }),
    }))
    
    renderWithProviders(<MenuItem item={mockMenuItem} />)
    
    expect(screen.getByText('Failed to update menu item')).toBeInTheDocument()
  })

  it('formats price correctly for different currencies', () => {
    const itemWithUSD = { ...mockMenuItem, price: 12.99, currency: 'USD' }
    
    renderWithProviders(<MenuItem item={itemWithUSD} />)
    
    expect(screen.getByText('$12.99')).toBeInTheDocument()
  })

  it('handles missing image gracefully', () => {
    const itemWithoutImage = { ...mockMenuItem, imageUrl: null }
    
    renderWithProviders(<MenuItem item={itemWithoutImage} />)
    
    expect(screen.getByTestId('placeholder-image')).toBeInTheDocument()
  })

  it('shows preparation time in different formats', () => {
    const quickItem = { ...mockMenuItem, preparationTime: 5 }
    const slowItem = { ...mockMenuItem, preparationTime: 45 }
    
    const { rerender } = renderWithProviders(<MenuItem item={quickItem} />)
    expect(screen.getByText('5 min')).toBeInTheDocument()
    
    rerender(<MenuItem item={slowItem} />)
    expect(screen.getByText('45 min')).toBeInTheDocument()
  })

  it('displays customizations if available', () => {
    const itemWithCustomizations = {
      ...mockMenuItem,
      customizations: [
        { name: 'Dressing', options: ['Caesar', 'Ranch', 'Italian'] },
        { name: 'Extra', options: ['Chicken', 'Shrimp', 'Bacon'] }
      ]
    }
    
    renderWithProviders(<MenuItem item={itemWithCustomizations} />)
    
    expect(screen.getByText('Customizations Available')).toBeInTheDocument()
  })

  it('shows popularity indicator for popular items', () => {
    const popularItem = { ...mockMenuItem, isPopular: true, orderCount: 150 }
    
    renderWithProviders(<MenuItem item={popularItem} />)
    
    expect(screen.getByText('Popular')).toBeInTheDocument()
    expect(screen.getByText('150 orders')).toBeInTheDocument()
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MenuItem item={mockMenuItem} />)
    
    const itemCard = screen.getByTestId('menu-item-1')
    itemCard.focus()
    
    await user.keyboard('{Enter}')
    // Should trigger edit mode or show details
    
    await user.keyboard('{Escape}')
    // Should close any open modals
  })

  it('is accessible with proper ARIA labels', () => {
    renderWithProviders(<MenuItem item={mockMenuItem} />)
    
    expect(screen.getByRole('article')).toHaveAttribute('aria-label', 'Caesar Salad menu item')
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })
})
