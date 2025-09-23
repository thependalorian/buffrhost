import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.goto('/')
    
    // Mock successful login
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token')
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        email: 'admin@buffr.ai',
        name: 'Admin User',
        role: 'admin'
      }))
    })
    
    await page.goto('/dashboard')
  })

  test('displays dashboard with key metrics', async ({ page }) => {
    // Wait for dashboard to load
    await expect(page.locator('h1')).toContainText('Dashboard')
    
    // Check for key metrics
    await expect(page.locator('[data-testid="total-bookings"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-revenue"]')).toBeVisible()
    await expect(page.locator('[data-testid="occupancy-rate"]')).toBeVisible()
    await expect(page.locator('[data-testid="average-rating"]')).toBeVisible()
  })

  test('shows recent bookings table', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Recent Bookings')
    await expect(page.locator('[data-testid="bookings-table"]')).toBeVisible()
    
    // Check table headers
    await expect(page.locator('th')).toContainText(['Guest Name', 'Check-in', 'Check-out', 'Status', 'Amount'])
  })

  test('displays revenue chart', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Revenue Overview')
    await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible()
  })

  test('navigates to bookings page', async ({ page }) => {
    await page.click('[data-testid="view-all-bookings"]')
    await expect(page).toHaveURL('/bookings')
  })

  test('refreshes dashboard data', async ({ page }) => {
    // Mock API response
    await page.route('**/api/dashboard', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          totalBookings: 200,
          totalRevenue: 60000,
          occupancyRate: 90,
          averageRating: 4.8
        })
      })
    })
    
    await page.click('[data-testid="refresh-dashboard"]')
    
    // Wait for data to update
    await expect(page.locator('[data-testid="total-bookings"]')).toContainText('200')
  })

  test('shows loading state', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/dashboard', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({})
      })
    })
    
    await page.reload()
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible()
  })

  test('handles error state', async ({ page }) => {
    // Mock API error
    await page.route('**/api/dashboard', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      })
    })
    
    await page.reload()
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Failed to load dashboard data')
  })

  test('is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check that dashboard adapts to mobile view
    await expect(page.locator('[data-testid="mobile-dashboard"]')).toBeVisible()
    
    // Check that metrics are stacked vertically
    const metrics = page.locator('[data-testid="metric-card"]')
    await expect(metrics.first()).toBeVisible()
  })
})

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    
    // Mock authentication
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token')
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        email: 'admin@buffr.ai',
        name: 'Admin User',
        role: 'admin'
      }))
    })
  })

  test('navigates to room management', async ({ page }) => {
    await page.goto('/dashboard')
    await page.click('[data-testid="nav-rooms"]')
    await expect(page).toHaveURL('/rooms')
  })

  test('navigates to menu management', async ({ page }) => {
    await page.goto('/dashboard')
    await page.click('[data-testid="nav-menu"]')
    await expect(page).toHaveURL('/menu')
  })

  test('navigates to staff management', async ({ page }) => {
    await page.goto('/dashboard')
    await page.click('[data-testid="nav-staff"]')
    await expect(page).toHaveURL('/staff')
  })

  test('navigates to inventory management', async ({ page }) => {
    await page.goto('/dashboard')
    await page.click('[data-testid="nav-inventory"]')
    await expect(page).toHaveURL('/inventory')
  })

  test('navigates to analytics', async ({ page }) => {
    await page.goto('/dashboard')
    await page.click('[data-testid="nav-analytics"]')
    await expect(page).toHaveURL('/analytics')
  })
})
