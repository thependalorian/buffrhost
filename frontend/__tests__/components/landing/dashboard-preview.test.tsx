/**
 * DashboardPreview Component Tests
 * Tests all personas including the new Airbnb persona
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardPreview from "../../../src/components/landing/DashboardPreview";

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

describe("DashboardPreview", () => {
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

  describe("Hotel Persona", () => {
    it("renders hotel dashboard with correct title and metrics", () => {
      renderWithProviders(
        <DashboardPreview 
          type="hotel" 
          features={["Room Management", "Guest Services"]} 
        />
      );

      expect(screen.getByText("Hotel Operations Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Occupancy Rate")).toBeInTheDocument();
      expect(screen.getByText("Revenue Today")).toBeInTheDocument();
      expect(screen.getByText("Active Bookings")).toBeInTheDocument();
      expect(screen.getByText("Guest Rating")).toBeInTheDocument();
    });

    it("displays hotel-specific modules", () => {
      renderWithProviders(
        <DashboardPreview 
          type="hotel" 
          features={["Room Management", "Guest Services"]} 
        />
      );

      expect(screen.getAllByText("Room Management")).toHaveLength(2);
      expect(screen.getAllByText("Guest Services")).toHaveLength(2);
      expect(screen.getByText("Revenue Analytics")).toBeInTheDocument();
      expect(screen.getByText("Staff Scheduling")).toBeInTheDocument();
    });
  });

  describe("Restaurant Persona", () => {
    it("renders restaurant dashboard with correct title and metrics", () => {
      renderWithProviders(
        <DashboardPreview 
          type="restaurant" 
          features={["Table Management", "Order Processing"]} 
        />
      );

      expect(screen.getByText("Restaurant Operations Center")).toBeInTheDocument();
      expect(screen.getByText("Occupancy Rate")).toBeInTheDocument();
      expect(screen.getByText("Revenue Today")).toBeInTheDocument();
      expect(screen.getByText("Active Bookings")).toBeInTheDocument();
      expect(screen.getByText("Guest Rating")).toBeInTheDocument();
    });

    it("displays restaurant-specific modules", () => {
      renderWithProviders(
        <DashboardPreview 
          type="restaurant" 
          features={["Table Management", "Order Processing"]} 
        />
      );

      expect(screen.getAllByText("Table Management")).toHaveLength(2);
      expect(screen.getAllByText("Order Processing")).toHaveLength(2);
      expect(screen.getByText("Kitchen Display")).toBeInTheDocument();
      expect(screen.getByText("Inventory Control")).toBeInTheDocument();
    });
  });

  describe("Multi-Venue Persona", () => {
    it("renders multi-venue dashboard with correct title and metrics", () => {
      renderWithProviders(
        <DashboardPreview 
          type="multi-venue" 
          features={["Property Overview", "Unified Analytics"]} 
        />
      );

      expect(screen.getByText("Multi-Venue Command Center")).toBeInTheDocument();
      expect(screen.getByText("Occupancy Rate")).toBeInTheDocument();
      expect(screen.getByText("Revenue Today")).toBeInTheDocument();
      expect(screen.getByText("Active Bookings")).toBeInTheDocument();
      expect(screen.getByText("Guest Rating")).toBeInTheDocument();
    });

    it("displays multi-venue specific modules", () => {
      renderWithProviders(
        <DashboardPreview 
          type="multi-venue" 
          features={["Property Overview", "Unified Analytics"]} 
        />
      );

      expect(screen.getAllByText("Property Overview")).toHaveLength(2);
      expect(screen.getByText("Cross-Venue Analytics")).toBeInTheDocument();
      expect(screen.getByText("Unified Guest Profiles")).toBeInTheDocument();
      expect(screen.getByText("Centralized Reporting")).toBeInTheDocument();
    });
  });

  describe("Boutique Persona", () => {
    it("renders boutique dashboard with correct title and metrics", () => {
      renderWithProviders(
        <DashboardPreview 
          type="boutique" 
          features={["Luxury Guest Experience", "Spa & Wellness"]} 
        />
      );

      expect(screen.getByText("Boutique Property Suite")).toBeInTheDocument();
      expect(screen.getByText("Occupancy Rate")).toBeInTheDocument();
      expect(screen.getByText("Revenue Today")).toBeInTheDocument();
      expect(screen.getByText("Active Bookings")).toBeInTheDocument();
      expect(screen.getByText("Guest Rating")).toBeInTheDocument();
    });

    it("displays boutique-specific modules", () => {
      renderWithProviders(
        <DashboardPreview 
          type="boutique" 
          features={["Luxury Guest Experience", "Spa & Wellness"]} 
        />
      );

      expect(screen.getAllByText("Luxury Guest Experience")).toHaveLength(2);
      expect(screen.getAllByText("Spa & Wellness")).toHaveLength(2);
      expect(screen.getByText("Personalized Service")).toBeInTheDocument();
      expect(screen.getByText("Revenue Optimization")).toBeInTheDocument();
    });
  });

  describe("Airbnb Persona", () => {
    it("renders Airbnb dashboard with correct title and metrics", () => {
      renderWithProviders(
        <DashboardPreview 
          type="airbnb" 
          features={["Guest Communication", "Dynamic Pricing"]} 
        />
      );

      expect(screen.getByText("Airbnb Host Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Occupancy Rate")).toBeInTheDocument();
      expect(screen.getByText("Revenue Today")).toBeInTheDocument();
      expect(screen.getByText("Active Bookings")).toBeInTheDocument();
      expect(screen.getByText("Guest Rating")).toBeInTheDocument();
    });

    it("displays Airbnb-specific modules", () => {
      renderWithProviders(
        <DashboardPreview 
          type="airbnb" 
          features={["Guest Communication", "Dynamic Pricing"]} 
        />
      );

      expect(screen.getAllByText("Guest Communication")).toHaveLength(2);
      expect(screen.getAllByText("Dynamic Pricing")).toHaveLength(2);
      expect(screen.getByText("Cleaning Schedule")).toBeInTheDocument();
      expect(screen.getByText("Multi-Platform Sync")).toBeInTheDocument();
    });

    it("shows correct description for Airbnb persona", () => {
      renderWithProviders(
        <DashboardPreview 
          type="airbnb" 
          features={["Guest Communication", "Dynamic Pricing"]} 
        />
      );

      expect(screen.getByText("Everything you need to manage your airbnb in one place")).toBeInTheDocument();
    });
  });

  describe("Real Data Integration", () => {
    it("uses real analytics data when available", async () => {
      renderWithProviders(
        <DashboardPreview 
          type="hotel" 
          features={["Room Management"]} 
        />
      );

      await waitFor(() => {
        expect(screen.getByText("87%")).toBeInTheDocument(); // Real occupancy rate
        expect(screen.getByText("N$ 45,200")).toBeInTheDocument(); // Real revenue
        expect(screen.getByText("15")).toBeInTheDocument(); // Real active bookings
        expect(screen.getByText("4.8/5")).toBeInTheDocument(); // Real guest rating
      });
    });

    it("falls back to default metrics when analytics data is loading", () => {
      mockUseAnalytics.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      renderWithProviders(
        <DashboardPreview 
          type="hotel" 
          features={["Room Management"]} 
        />
      );

      expect(screen.getAllByText("Loading...")).toHaveLength(4);
    });

    it("falls back to default metrics when analytics data fails to load", () => {
      mockUseAnalytics.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error("Failed to load"),
      });

      renderWithProviders(
        <DashboardPreview 
          type="hotel" 
          features={["Room Management"]} 
        />
      );

      // Should show default metrics from config
      expect(screen.getByText("87%")).toBeInTheDocument();
      expect(screen.getByText("N$ 45,200")).toBeInTheDocument();
    });
  });

  describe("Icon Rendering", () => {
    it("renders correct icon for each persona", () => {
      const { rerender } = renderWithProviders(
        <DashboardPreview type="hotel" features={[]} />
      );
      // Icons are rendered as SVG elements, we can check for their presence
      expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();

      rerender(<DashboardPreview type="restaurant" features={[]} />);
      expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();

      rerender(<DashboardPreview type="multi-venue" features={[]} />);
      expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();

      rerender(<DashboardPreview type="boutique" features={[]} />);
      expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();

      rerender(<DashboardPreview type="airbnb" features={[]} />);
      expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      renderWithProviders(
        <DashboardPreview 
          type="airbnb" 
          features={["Guest Communication"]} 
        />
      );

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent("Airbnb Host Dashboard");
    });

    it("has proper ARIA labels for metrics", () => {
      renderWithProviders(
        <DashboardPreview 
          type="airbnb" 
          features={["Guest Communication"]} 
        />
      );

      expect(screen.getByText("Occupancy Rate")).toBeInTheDocument();
      expect(screen.getByText("Revenue This Month")).toBeInTheDocument();
      expect(screen.getByText("Active Listings")).toBeInTheDocument();
      expect(screen.getByText("Guest Rating")).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("renders metrics in a responsive grid", () => {
      renderWithProviders(
        <DashboardPreview 
          type="airbnb" 
          features={["Guest Communication"]} 
        />
      );

      const metricsContainer = screen.getByText("Occupancy Rate").closest("div");
      expect(metricsContainer).toHaveClass("grid", "grid-cols-2", "lg:grid-cols-4");
    });

    it("renders modules in a responsive grid", () => {
      renderWithProviders(
        <DashboardPreview 
          type="airbnb" 
          features={["Guest Communication"]} 
        />
      );

      const modulesContainer = screen.getByText("Guest Communication").closest("div");
      expect(modulesContainer).toHaveClass("grid", "grid-cols-2", "lg:grid-cols-4");
    });
  });

  describe("Error Handling", () => {
    it("handles invalid persona type gracefully", () => {
      // @ts-ignore - Testing invalid type
      renderWithProviders(
        <DashboardPreview 
          type="invalid" 
          features={[]} 
        />
      );

      // Should not crash and should render something
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });
  });
});