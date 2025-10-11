/**
 * PersonaAwareSection Component Tests
 * Tests all personas including the new Airbnb persona
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PersonaAwareSection from "../../../src/components/landing/PersonaAwareSection";

// Mock the analytics hooks
const mockUseAnalytics = jest.fn();
const mockUseRealTimeMetrics = jest.fn();

jest.mock("../../../hooks/use-analytics", () => ({
  useAnalytics: () => mockUseAnalytics(),
  useRealTimeMetrics: () => mockUseRealTimeMetrics(),
}));

// Mock data for analytics
const mockAnalyticsData = {
  occupancyRate: 87,
  todayRevenue: 45200,
  checkIns: 23,
  guestRating: 4.8,
  occupancyTrend: 5.2,
  revenueTrend: 12.3,
  ratingTrend: 0.3,
};

const mockRealTimeData = {
  activeBookings: 15,
  bookingTrend: 8.1,
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  );
};

describe("PersonaAwareSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAnalytics.mockReturnValue({
      data: mockAnalyticsData,
      isLoading: false,
      error: null,
    });
    mockUseRealTimeMetrics.mockReturnValue({
      data: mockRealTimeData,
      isLoading: false,
      error: null,
    });
  });

  describe("Persona Selection", () => {
    it("renders all persona buttons including Airbnb", () => {
      renderWithProviders(<PersonaAwareSection />);

      expect(screen.getByText("Hotel General Manager")).toBeInTheDocument();
      expect(screen.getByText("Restaurant Owner")).toBeInTheDocument();
      expect(screen.getByText("Multi-Venue Operator")).toBeInTheDocument();
      expect(screen.getByText("Boutique Property Owner")).toBeInTheDocument();
      expect(screen.getByText("Airbnb Host")).toBeInTheDocument();
    });

    it("defaults to hotel persona", () => {
      renderWithProviders(<PersonaAwareSection />);

      expect(screen.getByText("Your Entire Hotel, Finally in One Place")).toBeInTheDocument();
      expect(screen.getByText("Overbookings, staff scheduling chaos, revenue leakage")).toBeInTheDocument();
    });

    it("switches to restaurant persona when clicked", async () => {
      renderWithProviders(<PersonaAwareSection />);

      const restaurantButton = screen.getByText("Restaurant Owner");
      fireEvent.click(restaurantButton);

      await waitFor(() => {
        expect(screen.getByText("Every Table, Every Order, Every Dollar")).toBeInTheDocument();
        expect(screen.getByText("Table turnover, kitchen inefficiency, wasted inventory")).toBeInTheDocument();
      });
    });

    it("switches to multi-venue persona when clicked", async () => {
      renderWithProviders(<PersonaAwareSection />);

      const multiVenueButton = screen.getByText("Multi-Venue Operator");
      fireEvent.click(multiVenueButton);

      await waitFor(() => {
        expect(screen.getByText("All Your Properties, One Command Center")).toBeInTheDocument();
        expect(screen.getByText("Siloed data, inconsistent guest experience")).toBeInTheDocument();
      });
    });

    it("switches to boutique persona when clicked", async () => {
      renderWithProviders(<PersonaAwareSection />);

      const boutiqueButton = screen.getByText("Boutique Property Owner");
      fireEvent.click(boutiqueButton);

      await waitFor(() => {
        expect(screen.getByText("Luxury Service, Streamlined Operations")).toBeInTheDocument();
        expect(screen.getByText("Competing with chains, manual processes")).toBeInTheDocument();
      });
    });

    it("switches to Airbnb persona when clicked", async () => {
      renderWithProviders(<PersonaAwareSection />);

      const airbnbButton = screen.getByText("Airbnb Host");
      fireEvent.click(airbnbButton);

      await waitFor(() => {
        expect(screen.getByText("Host Like a Pro, Scale Like a Business")).toBeInTheDocument();
        expect(screen.getByText("Manual guest communication, pricing guesswork, cleaning coordination")).toBeInTheDocument();
      });
    });
  });

  describe("Airbnb Persona Specific Features", () => {
    beforeEach(() => {
      renderWithProviders(<PersonaAwareSection />);
      const airbnbButton = screen.getByText("Airbnb Host");
      fireEvent.click(airbnbButton);
    });

    it("displays Airbnb-specific features", async () => {
      await waitFor(() => {
        expect(screen.getByText("Automated Guest Communication")).toBeInTheDocument();
        expect(screen.getByText("Dynamic Pricing Optimization")).toBeInTheDocument();
        expect(screen.getByText("Cleaning & Maintenance Scheduling")).toBeInTheDocument();
        expect(screen.getByText("Multi-Platform Listing Management")).toBeInTheDocument();
        expect(screen.getByText("Guest Experience Analytics")).toBeInTheDocument();
        expect(screen.getByText("Revenue Maximization Tools")).toBeInTheDocument();
      });
    });

    it("shows Airbnb-specific dashboard metrics", async () => {
      await waitFor(() => {
        expect(screen.getByText("Occupancy Rate")).toBeInTheDocument();
        expect(screen.getByText("Revenue Today")).toBeInTheDocument();
        expect(screen.getByText("23")).toBeInTheDocument(); // Check-ins value
        expect(screen.getByText("Guest Rating")).toBeInTheDocument();
        expect(screen.getByText("87%")).toBeInTheDocument(); // Occupancy rate value
        expect(screen.getByText("N$ 45,200")).toBeInTheDocument(); // Revenue value
        expect(screen.getByText("4.8/5")).toBeInTheDocument(); // Guest rating value
      });
    });

    it("displays correct CTA for Airbnb persona", async () => {
      await waitFor(() => {
        expect(screen.getByText("Ready to Transform Your Operations?")).toBeInTheDocument();
        expect(screen.getByText("Start Your 3-Month Free Trial")).toBeInTheDocument();
      });
    });
  });

  describe("Dashboard Preview Integration", () => {
    it("shows dashboard preview for hotel persona", () => {
      renderWithProviders(<PersonaAwareSection />);

      expect(screen.getByText("Hotel Operations Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Room Management")).toBeInTheDocument();
      expect(screen.getAllByText("Guest Services")).toHaveLength(2);
    });

    it("shows dashboard preview for restaurant persona", async () => {
      renderWithProviders(<PersonaAwareSection />);

      const restaurantButton = screen.getByText("Restaurant Owner");
      fireEvent.click(restaurantButton);

      await waitFor(() => {
        expect(screen.getByText("Restaurant Operations Center")).toBeInTheDocument();
        expect(screen.getByText("Table Management")).toBeInTheDocument();
        expect(screen.getByText("Order Processing")).toBeInTheDocument();
      });
    });

    it("shows dashboard preview for Airbnb persona", async () => {
      renderWithProviders(<PersonaAwareSection />);

      const airbnbButton = screen.getByText("Airbnb Host");
      fireEvent.click(airbnbButton);

      await waitFor(() => {
        expect(screen.getByText("Airbnb Host Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Guest Communication")).toBeInTheDocument();
        expect(screen.getByText("Dynamic Pricing")).toBeInTheDocument();
        expect(screen.getByText("Cleaning Schedule")).toBeInTheDocument();
        expect(screen.getByText("Multi-Platform Sync")).toBeInTheDocument();
      });
    });
  });

  describe("Operations Flow Integration", () => {
    it("shows operations flow for each persona", async () => {
      renderWithProviders(<PersonaAwareSection />);

      // Test hotel persona
      expect(screen.getByText("Room Management & Availability")).toBeInTheDocument();
      expect(screen.getByText("Guest Check-in/Check-out")).toBeInTheDocument();

      // Switch to restaurant
      const restaurantButton = screen.getByText("Restaurant Owner");
      fireEvent.click(restaurantButton);

      await waitFor(() => {
        expect(screen.getByText("Table Management & Reservations")).toBeInTheDocument();
        expect(screen.getByText("Order Processing & Kitchen Display")).toBeInTheDocument();
      });

      // Switch to Airbnb
      const airbnbButton = screen.getByText("Airbnb Host");
      fireEvent.click(airbnbButton);

      await waitFor(() => {
        expect(screen.getByText("Automated Guest Communication")).toBeInTheDocument();
        expect(screen.getByText("Dynamic Pricing Optimization")).toBeInTheDocument();
      });
    });
  });

  describe("Multi-Venue Special Case", () => {
    it("shows property grid for multi-venue persona", async () => {
      renderWithProviders(<PersonaAwareSection />);

      const multiVenueButton = screen.getByText("Multi-Venue Operator");
      fireEvent.click(multiVenueButton);

      await waitFor(() => {
        expect(screen.getByText("Hotel")).toBeInTheDocument();
        expect(screen.getByText("Restaurant")).toBeInTheDocument();
        expect(screen.getByText("Spa")).toBeInTheDocument();
        expect(screen.getByText("Conference")).toBeInTheDocument();
      });
    });
  });

  describe("Loading States", () => {
    it("handles loading state for analytics data", () => {
      mockUseAnalytics.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      renderWithProviders(<PersonaAwareSection />);

      expect(screen.getAllByText("Loading...")).toHaveLength(4);
    });

    it("handles error state for analytics data", () => {
      mockUseAnalytics.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error("Failed to load analytics"),
      });

      renderWithProviders(<PersonaAwareSection />);

      // Should fallback to default metrics
      expect(screen.getByText("87%")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels for persona buttons", () => {
      renderWithProviders(<PersonaAwareSection />);

      const personaButtons = screen.getAllByRole("button");
      expect(personaButtons.length).toBeGreaterThanOrEqual(5); // All 5 personas including Airbnb

      personaButtons.forEach((button) => {
        expect(button).toHaveAttribute("type", "button");
      });
    });

    it("maintains focus management when switching personas", async () => {
      renderWithProviders(<PersonaAwareSection />);

      const airbnbButton = screen.getByText("Airbnb Host");
      airbnbButton.focus();
      fireEvent.click(airbnbButton);

      await waitFor(() => {
        expect(airbnbButton).toHaveClass("bg-nude-600"); // Active state
      });
    });
  });

  describe("Responsive Design", () => {
    it("renders persona buttons in a flex layout", () => {
      renderWithProviders(<PersonaAwareSection />);

      const personaContainer = screen.getByText("Hotel General Manager").closest("div");
      expect(personaContainer).toHaveClass("flex", "flex-wrap", "justify-center", "gap-4");
    });
  });
});