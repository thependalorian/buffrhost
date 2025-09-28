import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;

  console.log("🚀 Starting global setup...");

  // Start the application if needed
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for the application to be ready
    console.log("⏳ Waiting for application to be ready...");
    await page.goto(baseURL || "http://localhost:3000");
    await page.waitForLoadState("networkidle");

    // Check if the application is running
    const title = await page.title();
    console.log(`✅ Application is running with title: ${title}`);

    // Set up test data if needed
    await setupTestData(page);

    // Set up authentication tokens
    await setupAuthTokens(page);

    console.log("✅ Global setup completed successfully");
  } catch (error) {
    console.error("❌ Global setup failed:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function setupTestData(page: any) {
  console.log("📊 Setting up test data...");

  // Mock API responses for consistent testing
  await page.route("**/api/v1/properties/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 1,
          name: "Test Hotel",
          property_type: "hotel",
          status: "active",
          address: "123 Test Street",
          city: "Windhoek",
          country: "Namibia",
        },
      ]),
    });
  });

  await page.route("**/api/v1/rooms/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 1,
          name: "Standard Room",
          price: 500,
          available: true,
          amenities: ["WiFi", "TV", "Air Conditioning"],
        },
        {
          id: 2,
          name: "Deluxe Room",
          price: 750,
          available: true,
          amenities: ["WiFi", "TV", "Air Conditioning", "Mini Bar"],
        },
      ]),
    });
  });

  await page.route("**/api/v1/bookings/**", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          id: 123,
          bookingNumber: "BK-2024-001",
          status: "confirmed",
          totalAmount: 1000,
        }),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            guestName: "John Doe",
            checkIn: "2024-02-15",
            checkOut: "2024-02-17",
            status: "confirmed",
            totalAmount: 1000,
          },
        ]),
      });
    }
  });

  await page.route("**/api/v1/dashboard/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        totalBookings: 150,
        totalRevenue: 45000,
        occupancyRate: 85,
        averageRating: 4.5,
        recentBookings: [
          {
            id: 1,
            guestName: "John Doe",
            checkIn: "2024-01-15",
            checkOut: "2024-01-17",
            status: "confirmed",
            totalAmount: 300,
          },
        ],
      }),
    });
  });

  await page.route("**/api/v1/staff/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 1,
          firstName: "Jane",
          lastName: "Doe",
          email: "jane.doe@hotel.com",
          position: "Housekeeper",
          status: "active",
        },
      ]),
    });
  });

  await page.route("**/api/v1/menu/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 1,
          name: "Caesar Salad",
          description: "Fresh romaine lettuce with caesar dressing",
          price: 12.99,
          category: "Appetizers",
        },
      ]),
    });
  });

  await page.route("**/api/v1/inventory/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 1,
          name: "Towels",
          currentStock: 100,
          minimumStock: 20,
          unitPrice: 25.0,
        },
      ]),
    });
  });

  console.log("✅ Test data setup completed");
}

async function setupAuthTokens(page: any) {
  console.log("🔐 Setting up authentication tokens...");

  // Set up mock authentication tokens in localStorage
  await page.evaluate(() => {
    localStorage.setItem("auth_token", "mock-jwt-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: 1,
        email: "admin@buffr.ai",
        name: "Admin User",
        role: "admin",
      }),
    );
  });

  // Mock authentication endpoints
  await page.route("**/api/v1/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access_token: "mock-jwt-token",
        user: {
          id: 1,
          email: "admin@buffr.ai",
          name: "Admin User",
          role: "admin",
        },
      }),
    });
  });

  await page.route("**/api/v1/auth/register", async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        access_token: "mock-jwt-token",
        user: {
          id: 2,
          email: "newuser@buffr.ai",
          name: "New User",
          role: "customer",
        },
      }),
    });
  });

  await page.route("**/api/v1/auth/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        email: "admin@buffr.ai",
        name: "Admin User",
        role: "admin",
      }),
    });
  });

  console.log("✅ Authentication tokens setup completed");
}

export default globalSetup;
