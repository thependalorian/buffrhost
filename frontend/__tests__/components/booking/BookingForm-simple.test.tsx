/**
 * Simplified BookingForm Test
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BookingForm from "@/src/components/booking/BookingForm";

// Mock the booking hooks
const mockCreateBooking = jest.fn();

jest.mock("@/src/hooks/useBooking", () => ({
  useBooking: () => ({
    createBooking: mockCreateBooking,
    loading: false,
    error: null,
  }),
}));

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

describe("BookingForm - Simple Test", () => {
  it("renders booking form with basic fields", () => {
    renderWithProviders(
      <BookingForm propertyId="test-property" />
    );

    expect(screen.getByRole("heading", { name: "Create Booking" })).toBeInTheDocument();
    expect(screen.getByText("Fill in the details to create a new booking")).toBeInTheDocument();
  });
});