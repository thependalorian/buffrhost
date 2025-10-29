'use client';

import React from 'react';
import { BuffrCard, BuffrCardContent, BuffrCardHeader, BuffrCardTitle } from '@/components/ui/cards/BuffrCard';
import { BuffrIcon, BuffrIconName } from '@/components/ui/icons/BuffrIcons';
import { BuffrBadge } from '@/components/ui/feedback/BuffrBadge';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';

/**
 * Property Bookings Component
 * 
 * Displays recent bookings and reservation management
 * Location: components/property/PropertyBookings.tsx
 */

interface Booking {
  id: string;
  guestName: string;
  checkIn: Date;
  checkOut?: Date;
  roomNumber?: string;
  tableNumber?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'checked-in' | 'checked-out';
  amount: number;
  currency: string;
}

interface PropertyBookingsProps {
  bookings: Booking[];
  propertyType: 'hotel' | 'restaurant';
  maxItems?: number;
  onViewAll?: () => void;
  onViewBooking?: (bookingId: string) => void;
  className?: string;
}

export const PropertyBookings: React.FC<PropertyBookingsProps> = ({
  bookings,
  propertyType,
  maxItems = 5,
  onViewAll,
  onViewBooking,
  className = ''
}) => {
  const displayBookings = bookings.slice(0, maxItems);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'checked-in':
        return 'text-blue-600 bg-blue-100';
      case 'checked-out':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'checked-in':
        return 'info';
      case 'checked-out':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  };

  return (
    <BuffrCard className={className}>
      <BuffrCardHeader>
        <div className="flex items-center justify-between">
          <BuffrCardTitle className="flex items-center gap-2">
            <BuffrIcon 
              name={propertyType === 'hotel' ? 'bed' : 'table'} 
              className="h-5 w-5" 
            />
            Recent {propertyType === 'hotel' ? 'Bookings' : 'Reservations'}
          </BuffrCardTitle>
          {onViewAll && (
            <BuffrButton variant="ghost" size="sm" onClick={onViewAll}>
              View All
            </BuffrButton>
          )}
        </div>
      </BuffrCardHeader>
      <BuffrCardContent>
        <div className="space-y-4">
          {displayBookings.length > 0 ? (
            displayBookings.map((booking) => (
              <BookingItem 
                key={booking.id} 
                booking={booking} 
                propertyType={propertyType}
                onViewBooking={onViewBooking}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BuffrIcon 
                name={propertyType === 'hotel' ? 'bed' : 'table'} 
                className="h-12 w-12 mx-auto mb-2 text-gray-300" 
              />
              <p>No recent {propertyType === 'hotel' ? 'bookings' : 'reservations'}</p>
            </div>
          )}
        </div>
      </BuffrCardContent>
    </BuffrCard>
  );
};

interface BookingItemProps {
  booking: Booking;
  propertyType: 'hotel' | 'restaurant';
  onViewBooking?: (bookingId: string) => void;
}

const BookingItem: React.FC<BookingItemProps> = ({ 
  booking, 
  propertyType, 
  onViewBooking 
}) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'checked-in':
        return 'text-blue-600 bg-blue-100';
      case 'checked-out':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'checked-in':
        return 'info';
      case 'checked-out':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  };

  return (
    <div 
      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onViewBooking?.(booking.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <p className="text-sm font-medium text-gray-900 truncate">
                {booking.guestName}
              </p>
              <p className="text-sm text-gray-600">
                {propertyType === 'hotel' ? `Room ${booking.roomNumber}` : `Table ${booking.tableNumber}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BuffrIcon name="calendar" className="h-4 w-4" />
              <span>{formatDate(booking.checkIn)}</span>
            </div>
            {booking.checkOut && (
              <div className="flex items-center gap-1">
                <BuffrIcon name="calendar" className="h-4 w-4" />
                <span>{formatDate(booking.checkOut)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 ml-4">
          <BuffrBadge 
            variant={getStatusVariant(booking.status)}
            size="sm"
          >
            {booking.status.replace('-', ' ').toUpperCase()}
          </BuffrBadge>
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(booking.amount, booking.currency)}
          </span>
        </div>
      </div>
    </div>
  );
};