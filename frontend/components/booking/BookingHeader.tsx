'use client';

import React from 'react';
import { BuffrCard, BuffrCardContent, BuffrCardHeader, BuffrCardTitle } from '@/components/ui/cards/BuffrCard';
import { BuffrIcon, BuffrIconName } from '@/components/ui/icons/BuffrIcons';
import { BuffrBadge } from '@/components/ui/feedback/BuffrBadge';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';

/**
 * Booking Header Component
 * 
 * Displays booking confirmation number, status, and primary actions
 * Location: components/booking/BookingHeader.tsx
 */

interface BookingHeaderProps {
  confirmationNumber: string;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  type: 'hotel' | 'restaurant' | 'spa' | 'event';
  propertyName: string;
  onEdit?: () => void;
  onCancel?: () => void;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
  className?: string;
}

export const BookingHeader: React.FC<BookingHeaderProps> = ({
  confirmationNumber,
  status,
  type,
  propertyName,
  onEdit,
  onCancel,
  onCheckIn,
  onCheckOut,
  className = ''
}) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'checked-in':
        return 'text-blue-600 bg-blue-100';
      case 'checked-out':
        return 'text-gray-600 bg-gray-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'checked-in':
        return 'info';
      case 'checked-out':
        return 'neutral';
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const getTypeIcon = (type: string): BuffrIconName => {
    switch (type) {
      case 'hotel':
        return 'home';
      case 'restaurant':
        return 'utensils';
      case 'spa':
        return 'spa';
      case 'event':
        return 'calendar';
      default:
        return 'calendar';
    }
  };

  const getAvailableActions = () => {
    const actions: (string | number)[] = [];
    
    if (status === 'confirmed' || status === 'pending') {
      actions.push(
        <BuffrButton key="edit" variant="outline" size="sm" onClick={onEdit}>
          <BuffrIcon name="edit" className="h-4 w-4 mr-2" />
          Edit
        </BuffrButton>
      );
    }
    
    if (status === 'confirmed' || status === 'checked-in') {
      actions.push(
        <BuffrButton key="cancel" variant="outline" size="sm" onClick={onCancel}>
          <BuffrIcon name="x" className="h-4 w-4 mr-2" />
          Cancel
        </BuffrButton>
      );
    }
    
    if (status === 'confirmed') {
      actions.push(
        <BuffrButton key="checkin" variant="primary" size="sm" onClick={onCheckIn}>
          <BuffrIcon name="log-in" className="h-4 w-4 mr-2" />
          Check In
        </BuffrButton>
      );
    }
    
    if (status === 'checked-in') {
      actions.push(
        <BuffrButton key="checkout" variant="primary" size="sm" onClick={onCheckOut}>
          <BuffrIcon name="log-out" className="h-4 w-4 mr-2" />
          Check Out
        </BuffrButton>
      );
    }
    
    return actions;
  };

  return (
    <BuffrCard className={className}>
      <BuffrCardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BuffrIcon 
              name={getTypeIcon(type)} 
              className="h-6 w-6 text-blue-600" 
            />
            <div>
              <BuffrCardTitle className="text-xl">
                Booking #{confirmationNumber}
              </BuffrCardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {propertyName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BuffrBadge 
              variant={getStatusVariant(status)}
              size="lg"
            >
              {status.replace('-', ' ').toUpperCase()}
            </BuffrBadge>
          </div>
        </div>
      </BuffrCardHeader>
      <BuffrCardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Type:</span> {type.charAt(0).toUpperCase() + type.slice(1)}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Status:</span> 
              <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                {status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getAvailableActions()}
          </div>
        </div>
      </BuffrCardContent>
    </BuffrCard>
  );
};