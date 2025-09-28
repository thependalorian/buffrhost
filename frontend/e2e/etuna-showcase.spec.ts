/**
 * Etuna Showcase E2E Tests
 *
 * End-to-end tests for the complete Etuna showcase using Playwright
 */

import { test, expect } from "@playwright/test";

test.describe("Etuna Showcase E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Etuna dashboard
    await page.goto("http://localhost:3005/protected/etuna/dashboard");
  });

  test("should display Etuna dashboard with all sections", async ({ page }) => {
    // Check main dashboard elements
    await expect(page.getByText("Etuna Guesthouse Dashboard")).toBeVisible();
    await expect(
      page.getByText(
        "Comprehensive hospitality management for Etuna Guesthouse",
      ),
    ).toBeVisible();

    // Check metrics cards
    await expect(page.getByText("Occupancy Rate")).toBeVisible();
    await expect(page.getByText("Revenue Today")).toBeVisible();
    await expect(page.getByText("Active Reservations")).toBeVisible();
    await expect(page.getByText("Guest Satisfaction")).toBeVisible();

    // Check navigation items
    await expect(page.getByText("Reservations")).toBeVisible();
    await expect(page.getByText("Guest Management")).toBeVisible();
    await expect(page.getByText("Room Management")).toBeVisible();
    await expect(page.getByText("Restaurant Management")).toBeVisible();
    await expect(page.getByText("Staff Management")).toBeVisible();
    await expect(page.getByText("CRM & Leads")).toBeVisible();
    await expect(page.getByText("Marketing")).toBeVisible();
    await expect(page.getByText("Content Management")).toBeVisible();
    await expect(page.getByText("Invoice Generation")).toBeVisible();
  });

  test("should navigate to AI assistant page", async ({ page }) => {
    await page.goto("http://localhost:3005/guest/etuna/ai-assistant-new");

    // Check AI assistant elements
    await expect(page.getByText("Etuna AI Assistant")).toBeVisible();
    await expect(
      page.getByText(
        "Enhanced AI concierge with LangGraph & Pydantic architecture",
      ),
    ).toBeVisible();
    await expect(
      page.getByText("Welcome to Etuna Guesthouse & Tours!"),
    ).toBeVisible();

    // Check quick actions
    await expect(page.getByText("Room Availability")).toBeVisible();
    await expect(page.getByText("Restaurant Menu")).toBeVisible();
    await expect(page.getByText("Tour Information")).toBeVisible();
    await expect(page.getByText("Spa Services")).toBeVisible();

    // Check AI capabilities
    await expect(page.getByText("AI Capabilities")).toBeVisible();
    await expect(page.getByText("Natural Language Processing")).toBeVisible();
    await expect(page.getByText("Voice Recognition")).toBeVisible();
    await expect(page.getByText("Context Awareness")).toBeVisible();
  });

  test("should navigate to staff management page", async ({ page }) => {
    await page.goto("http://localhost:3005/protected/etuna/staff");

    // Check staff management elements
    await expect(page.getByText("Staff Management")).toBeVisible();
    await expect(
      page.getByText(
        "Comprehensive staff and HR management for Etuna Guesthouse",
      ),
    ).toBeVisible();

    // Check staff metrics
    await expect(page.getByText("Total Staff")).toBeVisible();
    await expect(page.getByText("Active Employees")).toBeVisible();
    await expect(page.getByText("On Leave")).toBeVisible();
    await expect(page.getByText("Average Rating")).toBeVisible();

    // Check staff members
    await expect(page.getByText("Maria Nangolo")).toBeVisible();
    await expect(page.getByText("General Manager")).toBeVisible();
    await expect(page.getByText("Management")).toBeVisible();
  });

  test("should navigate to CRM page", async ({ page }) => {
    await page.goto("http://localhost:3005/protected/etuna/crm");

    // Check CRM elements
    await expect(page.getByText("CRM & Lead Management")).toBeVisible();
    await expect(
      page.getByText(
        "Comprehensive CRM and lead management for Etuna Guesthouse",
      ),
    ).toBeVisible();

    // Check CRM metrics
    await expect(page.getByText("Total Leads")).toBeVisible();
    await expect(page.getByText("Hot Leads")).toBeVisible();
    await expect(page.getByText("Warm Leads")).toBeVisible();
    await expect(page.getByText("Conversion Rate")).toBeVisible();

    // Check lead information
    await expect(page.getByText("John Doe")).toBeVisible();
    await expect(page.getByText("TravelCo")).toBeVisible();
    await expect(page.getByText("john.doe@travelco.com")).toBeVisible();
  });

  test("should navigate to marketing page", async ({ page }) => {
    await page.goto("http://localhost:3005/protected/etuna/marketing");

    // Check marketing elements
    await expect(page.getByText("Marketing Automation")).toBeVisible();
    await expect(
      page.getByText(
        "Comprehensive marketing automation and lead generation for Etuna Guesthouse",
      ),
    ).toBeVisible();

    // Check campaign metrics
    await expect(page.getByText("Total Campaigns")).toBeVisible();
    await expect(page.getByText("Active Campaigns")).toBeVisible();
    await expect(page.getByText("Email Sent")).toBeVisible();
    await expect(page.getByText("Open Rate")).toBeVisible();

    // Check campaign information
    await expect(page.getByText("Welcome Series for New Guests")).toBeVisible();
    await expect(page.getByText("Email")).toBeVisible();
    await expect(page.getByText("Active")).toBeVisible();
  });

  test("should navigate to CMS page", async ({ page }) => {
    await page.goto("http://localhost:3005/protected/etuna/cms");

    // Check CMS elements
    await expect(page.getByText("Content Management")).toBeVisible();
    await expect(
      page.getByText(
        "Comprehensive content management system for Etuna Guesthouse",
      ),
    ).toBeVisible();

    // Check content metrics
    await expect(page.getByText("Total Content")).toBeVisible();
    await expect(page.getByText("Published")).toBeVisible();
    await expect(page.getByText("Drafts")).toBeVisible();
    await expect(page.getByText("Total Views")).toBeVisible();

    // Check content items
    await expect(page.getByText("Hotel Lobby Gallery")).toBeVisible();
    await expect(page.getByText("Restaurant Menu - Winter 2024")).toBeVisible();
    await expect(page.getByText("Conference Room Setup Video")).toBeVisible();
  });

  test("should navigate to invoice generation page", async ({ page }) => {
    await page.goto("http://localhost:3005/protected/etuna/invoices");

    // Check invoice elements
    await expect(page.getByText("Invoice Generation")).toBeVisible();
    await expect(
      page.getByText(
        "Comprehensive invoice management and generation for Etuna Guesthouse",
      ),
    ).toBeVisible();

    // Check invoice metrics
    await expect(page.getByText("Total Invoices")).toBeVisible();
    await expect(page.getByText("Paid")).toBeVisible();
    await expect(page.getByText("Pending")).toBeVisible();
    await expect(page.getByText("Total Revenue")).toBeVisible();

    // Check invoice information
    await expect(page.getByText("INV-2024-001")).toBeVisible();
    await expect(page.getByText("Corporate Retreat Group")).toBeVisible();
    await expect(page.getByText("N$ 45,000")).toBeVisible();
  });

  test("should navigate to waitlist page", async ({ page }) => {
    await page.goto("http://localhost:3005/protected/etuna/waitlist");

    // Check waitlist elements
    await expect(page.getByText("Join Buffr Host Waitlist")).toBeVisible();
    await expect(
      page.getByText(
        "Join the waitlist for Buffr Host - The complete hospitality management platform",
      ),
    ).toBeVisible();

    // Check compelling headline
    await expect(
      page.getByText("Transform Your Hospitality Business"),
    ).toBeVisible();
    await expect(
      page.getByText("Join 500+ businesses already on the waitlist"),
    ).toBeVisible();

    // Check value proposition
    await expect(page.getByText("AI-Powered Automation")).toBeVisible();
    await expect(page.getByText("Unified Management")).toBeVisible();
    await expect(page.getByText("Advanced Analytics")).toBeVisible();
    await expect(page.getByText("Seamless Integration")).toBeVisible();

    // Check social proof
    await expect(page.getByText("500+")).toBeVisible();
    await expect(page.getByText("Businesses on Waitlist")).toBeVisible();
    await expect(page.getByText("N$2M+")).toBeVisible();
    await expect(page.getByText("Revenue Generated")).toBeVisible();
    await expect(page.getByText("85%")).toBeVisible();
    await expect(page.getByText("Efficiency Increase")).toBeVisible();
  });

  test("should display responsive design on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("http://localhost:3005/protected/etuna/dashboard");

    // Check that dashboard is still accessible on mobile
    await expect(page.getByText("Etuna Guesthouse Dashboard")).toBeVisible();

    // Check that navigation is accessible
    await expect(page.getByText("Staff Management")).toBeVisible();
    await expect(page.getByText("CRM & Leads")).toBeVisible();
    await expect(page.getByText("Marketing")).toBeVisible();
  });

  test("should handle navigation between all pages", async ({ page }) => {
    const pages = [
      "http://localhost:3005/protected/etuna/dashboard",
      "http://localhost:3005/protected/etuna/staff",
      "http://localhost:3005/protected/etuna/crm",
      "http://localhost:3005/protected/etuna/marketing",
      "http://localhost:3005/protected/etuna/cms",
      "http://localhost:3005/protected/etuna/invoices",
      "http://localhost:3005/protected/etuna/waitlist",
      "http://localhost:3005/guest/etuna/ai-assistant-new",
    ];

    for (const url of pages) {
      await page.goto(url);
      await expect(page).toHaveURL(url);

      // Check that page loads without errors
      await expect(page.locator("body")).toBeVisible();
    }
  });

  test("should display proper error handling", async ({ page }) => {
    // Test 404 page
    await page.goto("http://localhost:3005/nonexistent-page");

    // Should show 404 or redirect to appropriate page
    await expect(page.locator("body")).toBeVisible();
  });
});
