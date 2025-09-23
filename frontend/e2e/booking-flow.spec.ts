import { test, expect } from '@playwright/test'

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock room data
    await page.route('**/api/rooms', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            name: 'Standard Room',
            price: 500,
            available: true,
            amenities: ['WiFi', 'TV', 'Air Conditioning']
          },
          {
            id: 2,
            name: 'Deluxe Room',
            price: 750,
            available: true,
            amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar']
          }
        ])
      })
    })
  })

  test('completes successful booking flow', async ({ page }) => {
    await page.goto('/booking')

    // Fill guest information
    await page.fill('[data-testid="guest-name"]', 'John Doe')
    await page.fill('[data-testid="guest-email"]', 'john@example.com')
    await page.fill('[data-testid="guest-phone"]', '+264811234567')

    // Select dates
    await page.fill('[data-testid="check-in-date"]', '2024-02-15')
    await page.fill('[data-testid="check-out-date"]', '2024-02-17')

    // Select room
    await page.selectOption('[data-testid="room-select"]', '1')
    await page.fill('[data-testid="number-of-guests"]', '2')

    // Verify total calculation
    await expect(page.locator('[data-testid="total-amount"]')).toContainText('N$1,000')

    // Mock successful booking creation
    await page.route('**/api/bookings', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 123,
            bookingNumber: 'BK-2024-001',
            status: 'confirmed'
          })
        })
      }
    })

    // Submit booking
    await page.click('[data-testid="submit-booking"]')

    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Booking confirmed')

    // Verify booking details
    await expect(page.locator('[data-testid="booking-number"]')).toContainText('BK-2024-001')
  })

  test('validates required fields', async ({ page }) => {
    await page.goto('/booking')

    // Try to submit without filling required fields
    await page.click('[data-testid="submit-booking"]')

    // Check validation errors
    await expect(page.locator('[data-testid="guest-name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="guest-email-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="check-in-date-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="check-out-date-error"]')).toBeVisible()
  })

  test('validates email format', async ({ page }) => {
    await page.goto('/booking')

    await page.fill('[data-testid="guest-email"]', 'invalid-email')
    await page.click('[data-testid="submit-booking"]')

    await expect(page.locator('[data-testid="guest-email-error"]')).toContainText('Invalid email format')
  })

  test('validates check-out date is after check-in date', async ({ page }) => {
    await page.goto('/booking')

    await page.fill('[data-testid="check-in-date"]', '2024-02-20')
    await page.fill('[data-testid="check-out-date"]', '2024-02-15')
    await page.click('[data-testid="submit-booking"]')

    await expect(page.locator('[data-testid="check-out-date-error"]')).toContainText('Check-out date must be after check-in date')
  })

  test('validates number of guests', async ({ page }) => {
    await page.goto('/booking')

    await page.fill('[data-testid="number-of-guests"]', '0')
    await page.click('[data-testid="submit-booking"]')

    await expect(page.locator('[data-testid="guests-error"]')).toContainText('Number of guests must be at least 1')
  })

  test('shows room availability', async ({ page }) => {
    await page.goto('/booking')

    // Check that available rooms are shown
    await expect(page.locator('[data-testid="room-option-1"]')).toBeVisible()
    await expect(page.locator('[data-testid="room-option-2"]')).toBeVisible()

    // Check room details
    await expect(page.locator('[data-testid="room-name-1"]')).toContainText('Standard Room')
    await expect(page.locator('[data-testid="room-price-1"]')).toContainText('N$500')
  })

  test('calculates total price correctly', async ({ page }) => {
    await page.goto('/booking')

    // Select dates and room
    await page.fill('[data-testid="check-in-date"]', '2024-02-15')
    await page.fill('[data-testid="check-out-date"]', '2024-02-18') // 3 nights
    await page.selectOption('[data-testid="room-select"]', '2') // Deluxe Room N$750

    // Verify total calculation (3 nights × N$750 = N$2,250)
    await expect(page.locator('[data-testid="total-amount"]')).toContainText('N$2,250')
  })

  test('handles booking creation error', async ({ page }) => {
    await page.goto('/booking')

    // Fill form
    await page.fill('[data-testid="guest-name"]', 'John Doe')
    await page.fill('[data-testid="guest-email"]', 'john@example.com')
    await page.fill('[data-testid="guest-phone"]', '+264811234567')
    await page.fill('[data-testid="check-in-date"]', '2024-02-15')
    await page.fill('[data-testid="check-out-date"]', '2024-02-17')
    await page.selectOption('[data-testid="room-select"]', '1')
    await page.fill('[data-testid="number-of-guests"]', '2')

    // Mock booking creation error
    await page.route('**/api/bookings', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Room not available for selected dates' })
      })
    })

    await page.click('[data-testid="submit-booking"]')

    // Verify error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Room not available for selected dates')
  })

  test('shows loading state during submission', async ({ page }) => {
    await page.goto('/booking')

    // Fill form
    await page.fill('[data-testid="guest-name"]', 'John Doe')
    await page.fill('[data-testid="guest-email"]', 'john@example.com')
    await page.fill('[data-testid="guest-phone"]', '+264811234567')
    await page.fill('[data-testid="check-in-date"]', '2024-02-15')
    await page.fill('[data-testid="check-out-date"]', '2024-02-17')
    await page.selectOption('[data-testid="room-select"]', '1')
    await page.fill('[data-testid="number-of-guests"]', '2')

    // Mock slow API response
    await page.route('**/api/bookings', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 123 })
      })
    })

    await page.click('[data-testid="submit-booking"]')

    // Verify loading state
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible()
    await expect(page.locator('[data-testid="submit-booking"]')).toBeDisabled()
  })

  test('resets form after successful booking', async ({ page }) => {
    await page.goto('/booking')

    // Fill form
    await page.fill('[data-testid="guest-name"]', 'John Doe')
    await page.fill('[data-testid="guest-email"]', 'john@example.com')
    await page.fill('[data-testid="guest-phone"]', '+264811234567')
    await page.fill('[data-testid="check-in-date"]', '2024-02-15')
    await page.fill('[data-testid="check-out-date"]', '2024-02-17')
    await page.selectOption('[data-testid="room-select"]', '1')
    await page.fill('[data-testid="number-of-guests"]', '2')

    // Mock successful booking
    await page.route('**/api/bookings', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 123 })
      })
    })

    await page.click('[data-testid="submit-booking"]')

    // Wait for success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()

    // Click "New Booking" button
    await page.click('[data-testid="new-booking"]')

    // Verify form is reset
    await expect(page.locator('[data-testid="guest-name"]')).toHaveValue('')
    await expect(page.locator('[data-testid="guest-email"]')).toHaveValue('')
    await expect(page.locator('[data-testid="guest-phone"]')).toHaveValue('')
  })
})
