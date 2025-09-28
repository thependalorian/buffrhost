"use client";

import React from "react";
import { useState, useEffect } from "react";

interface Booking {
  id: string;
  user_id: string;
  resource_id: string;
  resource_type: string;
  start_time: string;
  end_time: string;
  status: string;
}

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // In a real application, this would fetch from your FastAPI backend
        // For now, using mock data
        const mockBookings: Booking[] = [
          {
            id: "b1",
            user_id: "user1",
            resource_id: "room101",
            resource_type: "room",
            start_time: "2025-10-26T10:00",
            end_time: "2025-10-26T12:00",
            status: "confirmed",
          },
          {
            id: "b2",
            user_id: "user2",
            resource_id: "confRoomA",
            resource_type: "service",
            start_time: "2025-10-27T14:00",
            end_time: "2025-10-27T16:00",
            status: "pending",
          },
        ];
        setBookings(mockBookings);
      } catch (err) {
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="booking-list">
      <h2>Booking List</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            {booking.resource_type} {booking.resource_id} from{" "}
            {booking.start_time} to {booking.end_time} ({booking.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingList;
