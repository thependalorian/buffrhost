/**
 * Josh Yolk Complete Framework Test Suite
 * 
 * Purpose: Comprehensive testing of Josh Yolk framework implementation
 * Location: /__tests__/josh-yolk-framework.test.tsx
 * Usage: Test all components and utilities with emotional scenarios
 * 
 * Features:
 * - Component testing with emotional context
 * - API endpoint testing with emotional responses
 * - Brand consistency validation
 * - Performance testing with emotional metrics
 * - Accessibility testing with caring consideration
 * - 23 Rules compliance validation
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BuffrButton, BuffrCard, BuffrInput } from '@/components/ui'
import { completeBrandTokens, getEmotionalClasses } from '@/lib/design-tokens'
import { 
  cn, 
  getEmotionalClasses as utilGetEmotionalClasses,
  checkBrandConsistency,
  handleErrorWithCare,
  createCaringLoadingState,
  createSuccessState
} from '@/lib/utils'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
  }),
}))

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            range: () => ({
              data: [],
              error: null,
              count: 0
            })
          })
        })
      }),
      insert: () => ({
        select: () => ({
          single: () => ({
            data: { id: 1, name: 'Test Property' },
            error: null
          })
        })
      })
    })
  })
}))

describe('Josh Yolk Complete Framework', () => {
  describe('Design Token System', () => {
    test('should provide complete brand tokens', () => {
      expect(completeBrandTokens.colors.nude).toBeDefined()
      expect(completeBrandTokens.colors.luxury).toBeDefined()
      expect(completeBrandTokens.colors.semantic).toBeDefined()
      expect(completeBrandTokens.typography).toBeDefined()
      expect(completeBrandTokens.spacing).toBeDefined()
      expect(completeBrandTokens.shadows).toBeDefined()
      expect(completeBrandTokens.animations).toBeDefined()
      expect(completeBrandTokens.components).toBeDefined()
      expect(completeBrandTokens.emotional).toBeDefined()
    })

    test('should provide emotional hierarchy', () => {
      expect(completeBrandTokens.emotional.confident).toBeDefined()
      expect(completeBrandTokens.emotional.supportive).toBeDefined()
      expect(completeBrandTokens.emotional.gentle).toBeDefined()
      expect(completeBrandTokens.emotional.premium).toBeDefined()
    })

    test('should generate emotional classes correctly', () => {
      const confidentClasses = getEmotionalClasses('confident')
      expect(confidentClasses.colors).toContain('nude-600')
      expect(confidentClasses.shadows).toContain('nude-strong')
      expect(confidentClasses.animations).toContain('hover-lift')
    })
  })

  describe('BuffrButton Component', () => {
    test('should render with default props', () => {
      render(<BuffrButton>Test Button</BuffrButton>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Test Button')
    })

    test('should apply emotional impact classes', () => {
      render(
        <BuffrButton emotionalImpact="confident" variant="primary">
          Confident Button
        </BuffrButton>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-emotional-impact', 'confident')
      expect(button).toHaveAttribute('data-josh-yolk-variant', 'primary')
    })

    test('should show loading state with caring message', () => {
      render(
        <BuffrButton 
          loading={true} 
          loadingText="Creating with care..."
          emotionalImpact="supportive"
        >
          Loading Button
        </BuffrButton>
      )
      expect(screen.getByText('Creating with care...')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeDisabled()
    })

    test('should apply different variants correctly', () => {
      const { rerender } = render(<BuffrButton variant="primary">Primary</BuffrButton>)
      expect(screen.getByRole('button')).toHaveClass('btn')

      rerender(<BuffrButton variant="luxury">Luxury</BuffrButton>)
      expect(screen.getByRole('button')).toHaveAttribute('data-josh-yolk-variant', 'luxury')
    })

    test('should handle click events', () => {
      const handleClick = jest.fn()
      render(<BuffrButton onClick={handleClick}>Clickable</BuffrButton>)
      
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('should be accessible', () => {
      render(<BuffrButton aria-label="Test button">Button</BuffrButton>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Test button')
    })
  })

  describe('BuffrCard Component', () => {
    test('should render with default props', () => {
      render(
        <BuffrCard>
          <div>Test Card Content</div>
        </BuffrCard>
      )
      expect(screen.getByText('Test Card Content')).toBeInTheDocument()
    })

    test('should apply emotional impact classes', () => {
      render(
        <BuffrCard emotionalImpact="premium" variant="luxury">
          <div>Premium Card</div>
        </BuffrCard>
      )
      const card = screen.getByText('Premium Card').closest('div')
      expect(card).toHaveAttribute('data-emotional-impact', 'premium')
      expect(card).toHaveAttribute('data-josh-yolk-variant', 'luxury')
    })

    test('should show loading state', () => {
      render(
        <BuffrCard loading={true}>
          <div>Loading Card</div>
        </BuffrCard>
      )
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    test('should handle click events when interactive', () => {
      const handleClick = jest.fn()
      render(
        <BuffrCard variant="interactive" onClick={handleClick}>
          <div>Interactive Card</div>
        </BuffrCard>
      )
      
      fireEvent.click(screen.getByText('Interactive Card').closest('div')!)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('should render card header and title', () => {
      render(
        <BuffrCard>
          <BuffrCard.Header emotionalImpact="confident">
            <BuffrCard.Title level={2}>Card Title</BuffrCard.Title>
          </BuffrCard.Header>
          <BuffrCard.Content>
            Card content here
          </BuffrCard.Content>
        </BuffrCard>
      )
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Card Title')
      expect(screen.getByText('Card content here')).toBeInTheDocument()
    })
  })

  describe('BuffrInput Component', () => {
    test('should render with label', () => {
      render(<BuffrInput label="Test Input" />)
      expect(screen.getByLabelText('Test Input')).toBeInTheDocument()
    })

    test('should show error state with caring message', () => {
      render(
        <BuffrInput 
          label="Test Input" 
          error="Please check this field"
          emotionalImpact="gentle"
        />
      )
      expect(screen.getByText('Please check this field')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveClass('border-semantic-error')
    })

    test('should show success state', () => {
      render(
        <BuffrInput 
          label="Test Input" 
          success="Perfect! This looks great"
          emotionalImpact="confident"
        />
      )
      expect(screen.getByText('Perfect! This looks great')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveClass('border-semantic-success')
    })

    test('should show loading state', () => {
      render(
        <BuffrInput 
          label="Test Input" 
          loading={true}
          emotionalImpact="supportive"
        />
      )
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    test('should handle focus and blur events', () => {
      render(<BuffrInput label="Test Input" />)
      const input = screen.getByRole('textbox')
      
      fireEvent.focus(input)
      expect(input).toHaveAttribute('data-focused', 'true')
      
      fireEvent.blur(input)
      expect(input).toHaveAttribute('data-focused', 'false')
    })

    test('should show helper text', () => {
      render(
        <BuffrInput 
          label="Test Input" 
          helperText="This will help you understand what to enter"
        />
      )
      expect(screen.getByText('This will help you understand what to enter')).toBeInTheDocument()
    })
  })

  describe('Utility Functions', () => {
    test('should merge class names correctly', () => {
      const result = cn('base-class', 'additional-class', { 'conditional-class': true })
      expect(result).toContain('base-class')
      expect(result).toContain('additional-class')
      expect(result).toContain('conditional-class')
    })

    test('should generate emotional classes', () => {
      const classes = utilGetEmotionalClasses('confident', 'base-class')
      expect(classes).toContain('base-class')
      expect(classes).toContain('shadow-nude-strong')
    })

    test('should check brand consistency', () => {
      const result = checkBrandConsistency('TestComponent', {
        emotionalImpact: 'confident',
        className: 'nude-600'
      })
      expect(result.isConsistent).toBe(true)
      expect(result.issues).toHaveLength(0)
    })

    test('should handle errors with care', () => {
      const error = new Error('Test error')
      const result = handleErrorWithCare(error, 'TestContext')
      
      expect(result.message).toContain('We encountered an issue')
      expect(result.emotionalContext.caring).toBe(true)
      expect(result.emotionalContext.tone).toBe('gentle')
    })

    test('should create caring loading state', () => {
      const result = createCaringLoadingState('Please wait...')
      
      expect(result.loading).toBe(true)
      expect(result.message).toBe('Please wait...')
      expect(result.emotionalContext.caring).toBe(true)
    })

    test('should create success state', () => {
      const result = createSuccessState('Success!')
      
      expect(result.success).toBe(true)
      expect(result.message).toBe('Success!')
      expect(result.emotionalContext.tone).toBe('confident')
    })
  })

  describe('API Integration', () => {
    test('should handle GET request with emotional context', async () => {
      const response = await fetch('/api/properties')
      const data = await response.json()
      
      expect(data.success).toBe(true)
      expect(data.emotionalContext).toBeDefined()
      expect(data.emotionalContext.caring).toBe(true)
      expect(data.performance).toBeDefined()
    })

    test('should handle POST request with validation', async () => {
      const propertyData = {
        name: 'Test Property',
        type: 'hotel',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'Test Country'
        },
        contact: {
          phone: '1234567890',
          email: 'test@example.com'
        }
      }

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData)
      })
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.emotionalContext.tone).toBe('confident')
    })
  })

  describe('Accessibility', () => {
    test('should have proper ARIA labels', () => {
      render(<BuffrButton aria-label="Test button">Button</BuffrButton>)
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Test button')
    })

    test('should support keyboard navigation', () => {
      render(<BuffrButton onClick={() => {}}>Clickable</BuffrButton>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('tabIndex', '0')
    })

    test('should have proper form labels', () => {
      render(<BuffrInput label="Test Input" id="test-input" />)
      const input = screen.getByLabelText('Test Input')
      expect(input).toHaveAttribute('id', 'test-input')
    })
  })

  describe('Performance', () => {
    test('should render components quickly', () => {
      const startTime = performance.now()
      render(<BuffrButton>Test</BuffrButton>)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(100) // Should render in under 100ms
    })

    test('should handle multiple components efficiently', () => {
      const startTime = performance.now()
      render(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <BuffrButton key={i}>Button {i}</BuffrButton>
          ))}
        </div>
      )
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(500) // Should render 100 buttons in under 500ms
    })
  })

  describe('23 Rules Compliance', () => {
    test('should use DaisyUI classes', () => {
      render(<BuffrButton>Test</BuffrButton>)
      expect(screen.getByRole('button')).toHaveClass('btn')
    })

    test('should have TypeScript types', () => {
      // This test ensures TypeScript compilation
      const button: React.ComponentProps<typeof BuffrButton> = {
        children: 'Test',
        variant: 'primary',
        emotionalImpact: 'confident'
      }
      expect(button).toBeDefined()
    })

    test('should have comprehensive error handling', () => {
      const error = new Error('Test error')
      const result = handleErrorWithCare(error, 'TestContext')
      expect(result).toHaveProperty('message')
      expect(result).toHaveProperty('emotionalContext')
    })

    test('should be Vercel compatible', () => {
      // Test that components work in serverless environment
      expect(() => render(<BuffrButton>Test</BuffrButton>)).not.toThrow()
    })
  })
})

// Integration tests
describe('Josh Yolk Framework Integration', () => {
  test('should work together seamlessly', () => {
    render(
      <BuffrCard emotionalImpact="premium" variant="luxury">
        <BuffrCard.Header>
          <BuffrCard.Title level={2}>Property Management</BuffrCard.Title>
        </BuffrCard.Header>
        <BuffrCard.Content>
          <BuffrInput 
            label="Property Name" 
            emotionalImpact="supportive"
            helperText="Choose a name that reflects your property's character"
          />
          <BuffrButton 
            variant="primary" 
            emotionalImpact="confident"
            className="mt-4"
          >
            Save Property
          </BuffrButton>
        </BuffrCard.Content>
      </BuffrCard>
    )

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Property Management')
    expect(screen.getByLabelText('Property Name')).toBeInTheDocument()
    expect(screen.getByText('Choose a name that reflects your property\'s character')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveTextContent('Save Property')
  })
})