'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BookingHeader } from '@/components/booking/BookingHeader';
import { GuestInfo } from '@/components/booking/GuestInfo';
import { PropertyDetails } from '@/components/booking/PropertyDetails';
import { PaymentInfo } from '@/components/booking/PaymentInfo';
import {
  BuffrTabs,
  BuffrTabsContent,
  BuffrTabsList,
  BuffrTabsTrigger,
} from '@/components/ui/tabs/BuffrTabs';

/**
 * Refactored Booking Details Page
 *
 * Modular booking details using smaller, reusable components
 * Location: app/bookings/[id]/page-refactored.tsx
 */

interface Booking {
  id: string;
  confirmationNumber: string;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  type: 'hotel' | 'restaurant' | 'spa' | 'event';
  propertyId: string;
  propertyName: string;
  propertyType: 'hotel' | 'restaurant';
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: Date;
  checkOutDate: Date;
  checkInTime?: string;
  checkOutTime?: string;
  adults: number;
  children: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  currency: string;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  paymentMethod: string;
  specialRequests?: string;
  roomNumber?: string;
  roomType?: string;
  tableNumber?: string;
  amenities?: string[];
}

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadBooking = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock booking data
        const mockBooking: Booking = {
          id: params.id as string,
          confirmationNumber: 'BK-2024-001234',
          status: 'confirmed',
          type: 'hotel',
          propertyId: 'prop-123',
          propertyName: 'Grand Hotel & Spa',
          propertyType: 'hotel',
          guestId: 'guest-456',
          guestName: 'John Doe',
          guestEmail: 'john.doe@example.com',
          guestPhone: '+1 (555) 123-4567',
          checkInDate: new Date('2024-02-15'),
          checkOutDate: new Date('2024-02-17'),
          checkInTime: '15:00',
          checkOutTime: '11:00',
          adults: 2,
          children: 1,
          totalAmount: 450.0,
          paidAmount: 450.0,
          balance: 0,
          currency: 'USD',
          paymentStatus: 'paid',
          paymentMethod: 'Credit Card',
          specialRequests: 'High floor room, late checkout requested',
          roomNumber: '205',
          roomType: 'Deluxe Suite',
          amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant'],
        };

        setBooking(mockBooking);
      } catch (error) {
        console.error('Error loading booking:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadBooking();
    }
  }, [params.id]);

  const handleEdit = () => {
    console.log('Edit booking');
    // Navigate to edit page
  };

  const handleCancel = () => {
    console.log('Cancel booking');
    // Show cancel confirmation modal
  };

  const handleCheckIn = () => {
    console.log('Check in');
    // Process check-in
  };

  const handleCheckOut = () => {
    console.log('Check out');
    // Process check-out
  };

  const handleEditGuest = () => {
    console.log('Edit guest info');
    // Navigate to guest edit page
  };

  const handleViewProperty = () => {
    console.log('View property');
    // Navigate to property page
  };

  const handlePayBalance = () => {
    console.log('Pay balance');
    // Navigate to payment page
  };

  const handleViewReceipt = () => {
    console.log('View receipt');
    // Navigate to receipt page
  };

  const handleRefund = () => {
    console.log('Process refund');
    // Show refund confirmation modal
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Booking Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The booking you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push('/bookings')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky on Mobile */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <button
                onClick={() => router.push('/bookings')}
                className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 mb-2 flex items-center gap-1"
              >
                [BuffrIcon name="arrow-left"] Back to Bookings
              </button>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
                Booking Details
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Booking Header */}
        <div className="mb-4 sm:mb-6">
          <BookingHeader
            confirmationNumber={booking.confirmationNumber}
            status={booking.status}
            type={booking.type}
            propertyName={booking.propertyName}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        </div>

        {/* Tabs - Horizontal Scroll on Mobile */}
        <BuffrTabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 sm:space-y-6"
        >
          <div className="overflow-x-auto border-b">
            <BuffrTabsList className="grid w-full grid-cols-4 min-w-max sm:min-w-0">
              <BuffrTabsTrigger
                value="overview"
                className="text-xs sm:text-sm whitespace-nowrap"
              >
                Overview
              </BuffrTabsTrigger>
              <BuffrTabsTrigger
                value="guest"
                className="text-xs sm:text-sm whitespace-nowrap"
              >
                Guest Info
              </BuffrTabsTrigger>
              <BuffrTabsTrigger
                value="property"
                className="text-xs sm:text-sm whitespace-nowrap"
              >
                Property
              </BuffrTabsTrigger>
              <BuffrTabsTrigger
                value="payment"
                className="text-xs sm:text-sm whitespace-nowrap"
              >
                Payment
              </BuffrTabsTrigger>
            </BuffrTabsList>
          </div>

          {/* Overview Tab */}
          <BuffrTabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <GuestInfo
                guestName={booking.guestName}
                guestEmail={booking.guestEmail}
                guestPhone={booking.guestPhone}
                adults={booking.adults}
                children={booking.children}
                specialRequests={booking.specialRequests}
                onEdit={handleEditGuest}
              />
              <PropertyDetails
                propertyName={booking.propertyName}
                propertyType={booking.propertyType}
                roomNumber={booking.roomNumber}
                roomType={booking.roomType}
                tableNumber={booking.tableNumber}
                checkInDate={booking.checkInDate}
                checkOutDate={booking.checkOutDate}
                checkInTime={booking.checkInTime}
                checkOutTime={booking.checkOutTime}
                amenities={booking.amenities}
                onViewProperty={handleViewProperty}
              />
            </div>
            <PaymentInfo
              totalAmount={booking.totalAmount}
              paidAmount={booking.paidAmount}
              balance={booking.balance}
              currency={booking.currency}
              paymentStatus={booking.paymentStatus}
              paymentMethod={booking.paymentMethod}
              onPayBalance={handlePayBalance}
              onViewReceipt={handleViewReceipt}
              onRefund={handleRefund}
            />
          </BuffrTabsContent>

          {/* Guest Info Tab */}
          <BuffrTabsContent value="guest">
            <GuestInfo
              guestName={booking.guestName}
              guestEmail={booking.guestEmail}
              guestPhone={booking.guestPhone}
              adults={booking.adults}
              children={booking.children}
              specialRequests={booking.specialRequests}
              onEdit={handleEditGuest}
            />
          </BuffrTabsContent>

          {/* Property Tab */}
          <BuffrTabsContent value="property">
            <PropertyDetails
              propertyName={booking.propertyName}
              propertyType={booking.propertyType}
              roomNumber={booking.roomNumber}
              roomType={booking.roomType}
              tableNumber={booking.tableNumber}
              checkInDate={booking.checkInDate}
              checkOutDate={booking.checkOutDate}
              checkInTime={booking.checkInTime}
              checkOutTime={booking.checkOutTime}
              amenities={booking.amenities}
              onViewProperty={handleViewProperty}
            />
          </BuffrTabsContent>

          {/* Payment Tab */}
          <BuffrTabsContent value="payment">
            <PaymentInfo
              totalAmount={booking.totalAmount}
              paidAmount={booking.paidAmount}
              balance={booking.balance}
              currency={booking.currency}
              paymentStatus={booking.paymentStatus}
              paymentMethod={booking.paymentMethod}
              onPayBalance={handlePayBalance}
              onViewReceipt={handleViewReceipt}
              onRefund={handleRefund}
            />
          </BuffrTabsContent>
        </BuffrTabs>
      </div>
    </div>
  );
}
