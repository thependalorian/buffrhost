'use client';
export const dynamic = 'force-dynamic';
import React from 'react';
import BookingList from '@/components/calendar/BookingList';
import BookingForm from '@/components/calendar/BookingForm';

const BookingsPage: React.FC = () => {
  const handleAddBooking = (data: any) => {
    console.log('Adding booking:', data);
    // In a real app, send data to backend
  };

  return (
    <div className="bookings-page">
      <h1>Booking Management</h1>
      <BookingList />
      <h2>Create New Booking</h2>
      <BookingForm onSubmit={handleAddBooking} />
    </div>
  );
};

export default BookingsPage;
