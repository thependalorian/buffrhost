/**
 * Booking Form Component for The Shandi Frontend
 *
 * Form component for creating and managing bookings.
 */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBooking, BookingData } from "@/hooks/useBooking";

interface BookingFormProps {
  propertyId: string;
  onSuccess?: (booking: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function BookingForm({
  propertyId,
  onSuccess,
  onError,
  className,
}: BookingFormProps) {
  const [formData, setFormData] = useState<BookingData>({
    property_id: propertyId,
    check_in: "",
    check_out: "",
    guests: 1,
    special_requests: "",
  });

  const { createBooking, loading, error } = useBooking();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const booking = await createBooking(formData);

    if (booking) {
      onSuccess?.(booking);
      // Reset form
      setFormData({
        property_id: propertyId,
        check_in: "",
        check_out: "",
        guests: 1,
        special_requests: "",
      });
    } else {
      onError?.(error || "Failed to create booking");
    }
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader>
        <CardTitle>Create Booking</CardTitle>
        <CardDescription>
          Fill in the details to create a new booking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="check_in">Check In</Label>
              <Input
                id="check_in"
                name="check_in"
                type="date"
                value={formData.check_in}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="check_out">Check Out</Label>
              <Input
                id="check_out"
                name="check_out"
                type="date"
                value={formData.check_out}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="guests">Number of Guests</Label>
            <Input
              id="guests"
              name="guests"
              type="number"
              min="1"
              value={formData.guests}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="special_requests">
              Special Requests (Optional)
            </Label>
            <textarea
              id="special_requests"
              name="special_requests"
              value={formData.special_requests}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-base"
              rows={3}
            />
          </div>

          {error && (
            <div className="text-red-600 text-xs sm:text-sm">{error}</div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating Booking..." : "Create Booking"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default BookingForm;
