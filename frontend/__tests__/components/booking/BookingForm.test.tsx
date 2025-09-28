import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BookingForm from "@/components/booking/BookingForm";

// Mock the booking hooks
jest.mock("@/hooks/useBooking", () => ({
  useBooking: () => ({
    createBooking: jest.fn(),
    isLoading: false,
    error: null,
  }),
}));

jest.mock("@/hooks/useRooms", () => ({
  useRooms: () => ({
    data: [
      { id: 1, name: "Standard Room", price: 500, available: true },
      { id: 2, name: "Deluxe Room", price: 750, available: true },
      { id: 3, name: "Suite", price: 1200, available: false },
    ],
    isLoading: false,
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

describe("BookingForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders booking form with all required fields", () => {
    renderWithProviders(<BookingForm />);

    expect(screen.getByLabelText(/guest name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/check-in date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/check-out date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/room type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
  });

  it("shows validation errors for empty required fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookingForm />);

    const submitButton = screen.getByRole("button", {
      name: /create booking/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/guest name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/check-in date is required/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/check-out date is required/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/room type is required/i)).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookingForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "invalid-email");

    const submitButton = screen.getByRole("button", {
      name: /create booking/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it("validates phone number format", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookingForm />);

    const phoneInput = screen.getByLabelText(/phone/i);
    await user.type(phoneInput, "123");

    const submitButton = screen.getByRole("button", {
      name: /create booking/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid phone number/i)).toBeInTheDocument();
    });
  });

  it("validates check-out date is after check-in date", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookingForm />);

    const checkInInput = screen.getByLabelText(/check-in date/i);
    const checkOutInput = screen.getByLabelText(/check-out date/i);

    await user.type(checkInInput, "2024-01-20");
    await user.type(checkOutInput, "2024-01-15");

    const submitButton = screen.getByRole("button", {
      name: /create booking/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/check-out date must be after check-in date/i),
      ).toBeInTheDocument();
    });
  });

  it("validates number of guests is positive", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookingForm />);

    const guestsInput = screen.getByLabelText(/number of guests/i);
    await user.type(guestsInput, "0");

    const submitButton = screen.getByRole("button", {
      name: /create booking/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/number of guests must be at least 1/i),
      ).toBeInTheDocument();
    });
  });

  it("populates room type dropdown with available rooms", () => {
    renderWithProviders(<BookingForm />);

    const roomSelect = screen.getByLabelText(/room type/i);
    expect(roomSelect).toBeInTheDocument();

    // Check that only available rooms are shown
    expect(screen.getByText("Standard Room - N$500")).toBeInTheDocument();
    expect(screen.getByText("Deluxe Room - N$750")).toBeInTheDocument();
    expect(screen.queryByText("Suite - N$1200")).not.toBeInTheDocument();
  });

  it("calculates total price when room is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookingForm />);

    const roomSelect = screen.getByLabelText(/room type/i);
    const checkInInput = screen.getByLabelText(/check-in date/i);
    const checkOutInput = screen.getByLabelText(/check-out date/i);

    await user.selectOptions(roomSelect, "1"); // Standard Room
    await user.type(checkInInput, "2024-01-15");
    await user.type(checkOutInput, "2024-01-17");

    await waitFor(() => {
      expect(screen.getByText(/total: n\$1,000/i)).toBeInTheDocument(); // 2 nights × N$500
    });
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    const mockCreateBooking = jest.fn();

    jest.doMock("@/hooks/useBooking", () => ({
      useBooking: () => ({
        createBooking: mockCreateBooking,
        isLoading: false,
        error: null,
      }),
    }));

    renderWithProviders(<BookingForm />);

    // Fill in all required fields
    await user.type(screen.getByLabelText(/guest name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/phone/i), "+264811234567");
    await user.type(screen.getByLabelText(/check-in date/i), "2024-01-15");
    await user.type(screen.getByLabelText(/check-out date/i), "2024-01-17");
    await user.selectOptions(screen.getByLabelText(/room type/i), "1");
    await user.type(screen.getByLabelText(/number of guests/i), "2");

    const submitButton = screen.getByRole("button", {
      name: /create booking/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateBooking).toHaveBeenCalledWith({
        guestName: "John Doe",
        email: "john@example.com",
        phone: "+264811234567",
        checkIn: "2024-01-15",
        checkOut: "2024-01-17",
        roomId: 1,
        numberOfGuests: 2,
        totalAmount: 1000,
      });
    });
  });

  it("shows loading state during submission", async () => {
    const user = userEvent.setup();

    jest.doMock("@/hooks/useBooking", () => ({
      useBooking: () => ({
        createBooking: jest.fn(),
        isLoading: true,
        error: null,
      }),
    }));

    renderWithProviders(<BookingForm />);

    const submitButton = screen.getByRole("button", {
      name: /creating booking/i,
    });
    expect(submitButton).toBeDisabled();
  });

  it("displays error message when booking creation fails", () => {
    jest.doMock("@/hooks/useBooking", () => ({
      useBooking: () => ({
        createBooking: jest.fn(),
        isLoading: false,
        error: "Room not available for selected dates",
      }),
    }));

    renderWithProviders(<BookingForm />);

    expect(
      screen.getByText(/room not available for selected dates/i),
    ).toBeInTheDocument();
  });

  it("shows success message after successful booking", async () => {
    const user = userEvent.setup();

    jest.doMock("@/hooks/useBooking", () => ({
      useBooking: () => ({
        createBooking: jest.fn().mockResolvedValue({ id: 123 }),
        isLoading: false,
        error: null,
      }),
    }));

    renderWithProviders(<BookingForm />);

    // Fill form and submit
    await user.type(screen.getByLabelText(/guest name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/phone/i), "+264811234567");
    await user.type(screen.getByLabelText(/check-in date/i), "2024-01-15");
    await user.type(screen.getByLabelText(/check-out date/i), "2024-01-17");
    await user.selectOptions(screen.getByLabelText(/room type/i), "1");
    await user.type(screen.getByLabelText(/number of guests/i), "2");

    const submitButton = screen.getByRole("button", {
      name: /create booking/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/booking created successfully/i),
      ).toBeInTheDocument();
    });
  });

  it("resets form after successful submission", async () => {
    const user = userEvent.setup();

    jest.doMock("@/hooks/useBooking", () => ({
      useBooking: () => ({
        createBooking: jest.fn().mockResolvedValue({ id: 123 }),
        isLoading: false,
        error: null,
      }),
    }));

    renderWithProviders(<BookingForm />);

    // Fill form and submit
    await user.type(screen.getByLabelText(/guest name/i), "John Doe");
    await user.click(screen.getByRole("button", { name: /create booking/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/guest name/i)).toHaveValue("");
    });
  });
});
