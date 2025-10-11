/**
 * Landing Page Personas Integration Tests
 * Tests the complete landing page with all personas including Airbnb
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "../../app/page";

// Mock Next.js components
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock the analytics hooks
const mockUseAnalytics = jest.fn();
const mockUseRealTimeMetrics = jest.fn();

jest.mock("../../hooks/use-analytics", () => ({
  useAnalytics: () => mockUseAnalytics(),
  useRealTimeMetrics: () => mockUseRealTimeMetrics(),
}));

// Mock data
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

describe("Landing Page Personas Integration", () => {
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

  describe("Hero Section Persona Rotation", () => {
    it("renders all persona hero sections", () => {
      renderWithProviders(<HomePage />);

      // Check all persona titles are present
      expect(screen.getByText("Your Entire Hotel, Finally in One Place")).toBeInTheDocument();
      expect(screen.getByText("Every Table, Every Order, Every Dollar")).toBeInTheDocument();
      expect(screen.getByText("All Your Properties, One Command Center")).toBeInTheDocument();
      expect(screen.getByText("Luxury Service, Streamlined Operations")).toBeInTheDocument();
      expect(screen.getByText("Host Like a Pro, Scale Like a Business")).toBeInTheDocument();
    });

    it("displays correct subtitles for each persona", () => {
      renderWithProviders(<HomePage />);

      expect(screen.getByText("Unified operations dashboard for hotel general managers")).toBeInTheDocument();
      expect(screen.getByText("Streamlined F&B operations for restaurant owners")).toBeInTheDocument();
      expect(screen.getByText("Centralized management for multi-venue operators")).toBeInTheDocument();
      expect(screen.getByText("Premium experience management for boutique properties")).toBeInTheDocument();
      expect(screen.getByText("Professional hosting tools for Airbnb and short-term rental hosts")).toBeInTheDocument();
    });

    it("shows correct pain points for each persona", () => {
      renderWithProviders(<HomePage />);

      expect(screen.getByText("Overbookings, staff chaos, revenue leakage")).toBeInTheDocument();
      expect(screen.getByText("Table turnover, kitchen inefficiency, wasted inventory")).toBeInTheDocument();
      expect(screen.getByText("Siloed data, inconsistent guest experience")).toBeInTheDocument();
      expect(screen.getByText("Competing with chains, manual processes")).toBeInTheDocument();
      expect(screen.getByText("Manual guest communication, pricing guesswork, cleaning coordination")).toBeInTheDocument();
    });
  });

  describe("PersonaAwareSection Integration", () => {
    it("renders persona selector with all options including Airbnb", () => {
      renderWithProviders(<HomePage />);

      expect(screen.getByText("Built for Every Hospitality Professional")).toBeInTheDocument();
      expect(screen.getByText("Hotel General Manager")).toBeInTheDocument();
      expect(screen.getByText("Restaurant Owner")).toBeInTheDocument();
      expect(screen.getByText("Multi-Venue Operator")).toBeInTheDocument();
      expect(screen.getByText("Boutique Property Owner")).toBeInTheDocument();
      expect(screen.getByText("Airbnb Host")).toBeInTheDocument();
    });

    it("switches between all personas correctly", async () => {
      renderWithProviders(<HomePage />);

      // Test hotel persona (default)
      expect(screen.getByText("Your Entire Hotel, Finally in One Place")).toBeInTheDocument();

      // Switch to restaurant
      const restaurantButton = screen.getByText("Restaurant Owner");
      fireEvent.click(restaurantButton);

      await waitFor(() => {
        expect(screen.getByText("Every Table, Every Order, Every Dollar")).toBeInTheDocument();
      });

      // Switch to multi-venue
      const multiVenueButton = screen.getByText("Multi-Venue Operator");
      fireEvent.click(multiVenueButton);

      await waitFor(() => {
        expect(screen.getByText("All Your Properties, One Command Center")).toBeInTheDocument();
      });

      // Switch to boutique
      const boutiqueButton = screen.getByText("Boutique Property Owner");
      fireEvent.click(boutiqueButton);

      await waitFor(() => {
        expect(screen.getByText("Luxury Service, Streamlined Operations")).toBeInTheDocument();
      });

      // Switch to Airbnb
      const airbnbButton = screen.getByText("Airbnb Host");
      fireEvent.click(airbnbButton);

      await waitFor(() => {
        expect(screen.getByText("Host Like a Pro, Scale Like a Business")).toBeInTheDocument();
      });
    });
  });

  describe("Airbnb Persona Specific Features", () => {
    beforeEach(() => {
      renderWithProviders(<HomePage />);
      const airbnbButton = screen.getByText("Airbnb Host");
      fireEvent.click(airbnbButton);
    });

    it("displays Airbnb-specific dashboard metrics", async () => {
      await waitFor(() => {
        expect(screen.getByText("Occupancy Rate")).toBeInTheDocument();
        expect(screen.getByText("Revenue This Month")).toBeInTheDocument();
        expect(screen.getByText("Active Listings")).toBeInTheDocument();
        expect(screen.getByText("Guest Rating")).toBeInTheDocument();
      });
    });

    it("shows Airbnb-specific modules", async () => {
      await waitFor(() => {
        expect(screen.getByText("Automated Guest Communication")).toBeInTheDocument();
        expect(screen.getByText("Dynamic Pricing Optimization")).toBeInTheDocument();
        expect(screen.getByText("Cleaning & Maintenance Scheduling")).toBeInTheDocument();
        expect(screen.getByText("Multi-Platform Listing Management")).toBeInTheDocument();
        expect(screen.getByText("Guest Experience Analytics")).toBeInTheDocument();
        expect(screen.getByText("Revenue Maximization Tools")).toBeInTheDocument();
      });
    });

    it("displays correct CTA for Airbnb persona", async () => {
      await waitFor(() => {
        expect(screen.getByText("Ready to Transform Your Operations?")).toBeInTheDocument();
        expect(screen.getByText("Start Your 3-Month Free Trial")).toBeInTheDocument();
      });
    });
  });

  describe("Feature Showcase Integration", () => {
    it("renders feature showcase for all personas", () => {
      renderWithProviders(<HomePage />);

      // Check for AI Concierge feature
      expect(screen.getByText("AI Concierge")).toBeInTheDocument();
      expect(screen.getByText("24/7 intelligent assistance for guests")).toBeInTheDocument();

      // Check for other key features
      expect(screen.getByText("Real-time Analytics")).toBeInTheDocument();
      expect(screen.getByText("Multi-Platform Integration")).toBeInTheDocument();
      expect(screen.getByText("Revenue Optimization")).toBeInTheDocument();
    });

    it("shows AI Concierge capabilities", () => {
      renderWithProviders(<HomePage />);

      expect(screen.getByText("Book services & rooms")).toBeInTheDocument();
      expect(screen.getByText("Answer questions instantly")).toBeInTheDocument();
      expect(screen.getByText("Generate invoices automatically")).toBeInTheDocument();
      expect(screen.getByText("Handle calls professionally")).toBeInTheDocument();
    });
  });

  describe("Waitlist Integration", () => {
    it("renders waitlist form", () => {
      renderWithProviders(<HomePage />);

      expect(screen.getByText("Join the Waitlist")).toBeInTheDocument();
      expect(screen.getByText("Be the first to experience the future of hospitality")).toBeInTheDocument();
    });

    it("opens waitlist modal when CTA is clicked", async () => {
      renderWithProviders(<HomePage />);

      const waitlistButton = screen.getByText("Start Free Trial");
      fireEvent.click(waitlistButton);

      await waitFor(() => {
        expect(screen.getByText("Join the Waitlist")).toBeInTheDocument();
      });
    });
  });

  describe("Navigation Integration", () => {
    it("renders navigation with all sections", () => {
      renderWithProviders(<HomePage />);

      expect(screen.getByText("Buffr Host")).toBeInTheDocument();
      expect(screen.getByText("Solutions")).toBeInTheDocument();
      expect(screen.getByText("Features")).toBeInTheDocument();
      expect(screen.getByText("Pricing")).toBeInTheDocument();
    });

    it("shows mobile menu toggle", () => {
      renderWithProviders(<HomePage />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      expect(menuButton).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("renders persona buttons in responsive layout", () => {
      renderWithProviders(<HomePage />);

      const personaContainer = screen.getByText("Hotel General Manager").closest("div");
      expect(personaContainer).toHaveClass("flex", "flex-wrap", "justify-center", "gap-4");
    });

    it("renders metrics in responsive grid", () => {
      renderWithProviders(<HomePage />);

      const metricsContainer = screen.getByText("Occupancy Rate").closest("div");
      expect(metricsContainer).toHaveClass("grid", "grid-cols-2", "lg:grid-cols-4");
    });
  });

  describe("Data Integration", () => {
    it("uses real analytics data when available", async () => {
      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText("87%")).toBeInTheDocument();
        expect(screen.getByText("N$ 45,200")).toBeInTheDocument();
        expect(screen.getByText("23")).toBeInTheDocument();
        expect(screen.getByText("4.8/5")).toBeInTheDocument();
      });
    });

    it("handles loading states gracefully", () => {
      mockUseAnalytics.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      renderWithProviders(<HomePage />);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("handles error states gracefully", () => {
      mockUseAnalytics.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error("Failed to load"),
      });

      renderWithProviders(<HomePage />);

      // Should fallback to default values
      expect(screen.getByText("87%")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      renderWithProviders(<HomePage />);

      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toBeInTheDocument();

      const h2s = screen.getAllByRole("heading", { level: 2 });
      expect(h2s.length).toBeGreaterThan(0);
    });

    it("has proper ARIA labels for interactive elements", () => {
      renderWithProviders(<HomePage />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("type", "button");
      });
    });

    it("maintains focus management", async () => {
      renderWithProviders(<HomePage />);

      const airbnbButton = screen.getByText("Airbnb Host");
      airbnbButton.focus();
      fireEvent.click(airbnbButton);

      await waitFor(() => {
        expect(airbnbButton).toHaveClass("bg-nude-500");
      });
    });
  });
});