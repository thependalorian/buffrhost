'use client';

import React from 'react';
import { BuffrCard, BuffrCardContent, BuffrCardHeader, BuffrCardTitle } from '@/components/ui/cards/BuffrCard';
import { BuffrIcon, BuffrIconName } from '@/components/ui/icons/BuffrIcons';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';

/**
 * Guest Information Component
 * 
 * Displays guest details and contact information
 * Location: components/booking/GuestInfo.tsx
 */

interface GuestInfoProps {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  adults: number;
  children: number;
  specialRequests?: string;
  onEdit?: () => void;
  className?: string;
}

export const GuestInfo: React.FC<GuestInfoProps> = ({
  guestName,
  guestEmail,
  guestPhone,
  adults,
  children,
  specialRequests,
  onEdit,
  className = ''
}) => {
  return (
    <BuffrCard className={className}>
      <BuffrCardHeader>
        <div className="flex items-center justify-between">
          <BuffrCardTitle className="flex items-center gap-2">
            <BuffrIcon name="user" className="h-5 w-5" />
            Guest Information
          </BuffrCardTitle>
          {onEdit && (
            <BuffrButton variant="ghost" size="sm" onClick={onEdit}>
              <BuffrIcon name="edit" className="h-4 w-4 mr-2" />
              Edit
            </BuffrButton>
          )}
        </div>
      </BuffrCardHeader>
      <BuffrCardContent>
        <div className="space-y-4">
          {/* Guest Name */}
          <div className="flex items-center gap-3">
            <BuffrIcon name="user" className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{guestName}</p>
              <p className="text-xs text-gray-500">Primary Guest</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <BuffrIcon name="mail" className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">{guestEmail}</p>
                <p className="text-xs text-gray-500">Email</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BuffrIcon name="phone" className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">{guestPhone}</p>
                <p className="text-xs text-gray-500">Phone</p>
              </div>
            </div>
          </div>

          {/* Guest Count */}
          <div className="flex items-center gap-3">
            <BuffrIcon name="users" className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">
                {adults} {adults === 1 ? 'Adult' : 'Adults'}
                {children > 0 && `, ${children} ${children === 1 ? 'Child' : 'Children'}`}
              </p>
              <p className="text-xs text-gray-500">Party Size</p>
            </div>
          </div>

          {/* Special Requests */}
          {specialRequests && (
            <div className="flex items-start gap-3">
              <BuffrIcon name="message-square" className="h-4 w-4 text-gray-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">{specialRequests}</p>
                <p className="text-xs text-gray-500">Special Requests</p>
              </div>
            </div>
          )}
        </div>
      </BuffrCardContent>
    </BuffrCard>
  );
};