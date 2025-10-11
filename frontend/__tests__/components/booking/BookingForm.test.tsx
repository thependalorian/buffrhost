import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BookingForm from "@/src/components/booking/BookingForm";

// Mock the booking hooks
const mockCreateBooking = jest.fn();
const mockUseBooking = jest.fn();

jest.mock("@/src/hooks/useBooking", () => ({
  useBooking: () => ({
    createBooking: mockCreateBooking,
    loading: false,
    error: null,
  }),
}));

// Mock rooms data directly in the test
const mockRooms = [
  { id: 1, name: "Standard Room", price: 500, available: true },
  { id: 2, name: "Deluxe Room", price: 750, available: true },
  { id: 3, name: "Suite", price: 1200, available: false },
];

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

describe("BookingForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders booking form with all required fields", () => {
    renderWithProviders(<BookingForm propertyId="test-property" />);

    expect(screen.getByLabelText(/check in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/check out/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/special requests/i)).toBeInTheDocument();
  });

  it("submits form with required fields", async () => {
    const user = userEvent.setup();
    mockCreateBooking.mockResolvedValue({ id: "123" });

    renderWithProviders(<BookingForm propertyId="test-property" />);

    // Fill in required fields using fireEvent for more reliable testing
    const checkInInput = screen.getByLabelText(/check in/i);
    const checkOutInput = screen.getByLabelText(/check out/i);
    const guestsInput = screen.getByLabelText(/number of guests/i);

    fireEvent.change(checkInInput, { target: { value: "2024-01-15" } });
    fireEvent.change(checkOutInput, { target: { value: "2024-01-17" } });
    fireEvent.change(guestsInput, { target: { value: "2" } });

    const submitButton = screen.getByRole("button", {
      name: /create booking/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateBooking).toHaveBeenCalledWith({
        property_id: "test-property",
        check_in: "2024-01-15",
        check_out: "2024-01-17",
        guests: 2,
        special_requests: "",
      });
    });
  });

  it("handles form submission with special requests", async () => {
    mockCreateBooking.mockResolvedValue({ id: "123" });

    renderWithProviders(<BookingForm propertyId="test-property" />);

    // Fill in all fields including special requests
    const checkInInput = screen.getByLabelText(/check in/i);
    const checkOutInput = screen.getByLabelText(/check out/i);
    const guestsInput = screen.getByLabelText(/number of guests/i);
    const specialRequestsInput = screen.getByLabelText(/special requests/i);

    fireEvent.change(checkInInput, { target: { value: "2024-01-15" } });
    fireEvent.change(checkOutInput, { target: { value: "2024-01-17" } });
    fireEvent.change(guestsInput, { target: { value: "2" } });
    fireEvent.change(specialRequestsInput, { target: { value: "Late checkout please" } });

    const submitButton = screen.getByRole("button", {
      name: /create booking/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateBooking).toHaveBeenCalledWith({
        property_id: "test-property",
        check_in: "2024-01-15",
        check_out: "2024-01-17",
        guests: 2,
        special_requests: "Late checkout please",
      });
    });
  });

  it("calls createBooking when form is submitted", async () => {
    mockCreateBooking.mockResolvedValue({ id: "123" });

    renderWithProviders(<BookingForm propertyId="test-property" />);

    // Fill in required fields
    const checkInInput = screen.getByLabelText(/check in/i);
    const checkOutInput = screen.getByLabelText(/check out/i);
    const guestsInput = screen.getByLabelText(/number of guests/i);

    fireEvent.change(checkInInput, { target: { value: "2024-01-15" } });
    fireEvent.change(checkOutInput, { target: { value: "2024-01-17" } });
    fireEvent.change(guestsInput, { target: { value: "2" } });

    const submitButton = screen.getByRole("button", {
      name: /create booking/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateBooking).toHaveBeenCalledTimes(1);
    });
  });

  it("resets form after successful submission", async () => {
    mockCreateBooking.mockResolvedValue({ id: "123" });

    renderWithProviders(<BookingForm propertyId="test-property" />);

    // Fill form and submit
    const checkInInput = screen.getByLabelText(/check in/i);
    const checkOutInput = screen.getByLabelText(/check out/i);
    const guestsInput = screen.getByLabelText(/number of guests/i);

    fireEvent.change(checkInInput, { target: { value: "2024-01-15" } });
    fireEvent.change(checkOutInput, { target: { value: "2024-01-17" } });
    fireEvent.change(guestsInput, { target: { value: "2" } });
    
    fireEvent.click(screen.getByRole("button", { name: /create booking/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/check in/i)).toHaveValue("");
      expect(screen.getByLabelText(/check out/i)).toHaveValue("");
      expect(screen.getByLabelText(/number of guests/i)).toHaveValue(1);
    });
  });

  describe("Airbnb-specific booking scenarios", () => {
    it("handles Airbnb property booking with special requirements", async () => {
      mockCreateBooking.mockResolvedValue({ id: "airbnb-123" });

      renderWithProviders(<BookingForm propertyId="airbnb-property" />);

      const checkInInput = screen.getByLabelText(/check in/i);
      const checkOutInput = screen.getByLabelText(/check out/i);
      const guestsInput = screen.getByLabelText(/number of guests/i);
      const specialRequestsInput = screen.getByLabelText(/special requests/i);

      fireEvent.change(checkInInput, { target: { value: "2024-01-15" } });
      fireEvent.change(checkOutInput, { target: { value: "2024-01-17" } });
      fireEvent.change(guestsInput, { target: { value: "4" } });
      fireEvent.change(specialRequestsInput, { 
        target: { value: "Late checkout, pet-friendly accommodation needed" } 
      });

      const submitButton = screen.getByRole("button", { name: /create booking/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateBooking).toHaveBeenCalledWith({
          property_id: "airbnb-property",
          check_in: "2024-01-15",
          check_out: "2024-01-17",
          guests: 4,
          special_requests: "Late checkout, pet-friendly accommodation needed",
        });
      });
    });

    it("validates guest count limits for Airbnb properties", async () => {
      renderWithProviders(<BookingForm propertyId="airbnb-property" />);

      const guestsInput = screen.getByLabelText(/number of guests/i);
      const submitButton = screen.getByRole("button", { name: /create booking/i });

      // Test maximum guest limit
      fireEvent.change(guestsInput, { target: { value: "20" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/maximum guests exceeded/i)).toBeInTheDocument();
      });
    });

    it("handles Airbnb instant booking confirmation", async () => {
      mockCreateBooking.mockResolvedValue({ 
        id: "airbnb-123",
        instant_booking: true,
        confirmation_code: "ABC123"
      });

      renderWithProviders(<BookingForm propertyId="airbnb-property" />);

      const checkInInput = screen.getByLabelText(/check in/i);
      const checkOutInput = screen.getByLabelText(/check out/i);
      const guestsInput = screen.getByLabelText(/number of guests/i);

      fireEvent.change(checkInInput, { target: { value: "2024-01-15" } });
      fireEvent.change(checkOutInput, { target: { value: "2024-01-17" } });
      fireEvent.change(guestsInput, { target: { value: "2" } });

      const submitButton = screen.getByRole("button", { name: /create booking/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument();
        expect(screen.getByText(/confirmation code: ABC123/i)).toBeInTheDocument();
      });
    });
  });
});
