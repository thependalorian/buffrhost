/**
 * Booking Hook for Buffr Host Frontend
 *
 * Custom hook for managing booking operations.
 */

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/contexts/auth-context";

export interface BookingData {
  property_id: string;
  room_id?: string;
  check_in: string;
  check_out: string;
  guests: number;
  special_requests?: string;
}

export interface Booking {
  id: string;
  property_id: string;
  room_id?: string;
  customer_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  total_amount: number;
  currency: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export function useBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const createBooking = useCallback(
    async (bookingData: BookingData): Promise<Booking | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create booking");
        }

        return data.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const updateBooking = useCallback(
    async (
      bookingId: string,
      updates: Partial<BookingData>,
    ): Promise<Booking | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/bookings/${bookingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update booking");
        }

        return data.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const cancelBooking = useCallback(
    async (bookingId: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to cancel booking");
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  return {
    createBooking,
    updateBooking,
    cancelBooking,
    loading,
    error,
  };
}
