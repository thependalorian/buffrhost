'use client';

import React from 'react';
import { BuffrCard, BuffrCardContent, BuffrCardHeader, BuffrCardTitle } from '@/components/ui/cards/BuffrCard';
import { BuffrIcon, BuffrIconName } from '@/components/ui/icons/BuffrIcons';
import { BuffrBadge } from '@/components/ui/feedback/BuffrBadge';

/**
 * Property Details Component
 * 
 * Displays property information, room/table details, and amenities
 * Location: components/booking/PropertyDetails.tsx
 */

interface PropertyDetailsProps {
  propertyName: string;
  propertyType: 'hotel' | 'restaurant';
  roomNumber?: string;
  roomType?: string;
  tableNumber?: string;
  checkInDate: Date;
  checkOutDate?: Date;
  checkInTime?: string;
  checkOutTime?: string;
  amenities?: string[];
  onViewProperty?: () => void;
  className?: string;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  propertyName,
  propertyType,
  roomNumber,
  roomType,
  tableNumber,
  checkInDate,
  checkOutDate,
  checkInTime,
  checkOutTime,
  amenities = [],
  onViewProperty,
  className = ''
}) => {
  const getPropertyIcon = (type: string): BuffrIconName => {
    switch (type) {
      case 'hotel':
        return 'home';
      case 'restaurant':
        return 'utensils';
      default:
        return 'building';
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string): string => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDuration = (): string => {
    if (!checkOutDate) return 'N/A';
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ${diffDays === 1 ? 'night' : 'nights'}`;
  };

  return (
    <BuffrCard className={className}>
      <BuffrCardHeader>
        <div className="flex items-center justify-between">
          <BuffrCardTitle className="flex items-center gap-2">
            <BuffrIcon name={getPropertyIcon(propertyType)} className="h-5 w-5" />
            Property Details
          </BuffrCardTitle>
          {onViewProperty && (
            <BuffrButton variant="ghost" size="sm" onClick={onViewProperty}>
              <BuffrIcon name="external-link" className="h-4 w-4 mr-2" />
              View Property
            </BuffrButton>
          )}
        </div>
      </BuffrCardHeader>
      <BuffrCardContent>
        <div className="space-y-4">
          {/* Property Name */}
          <div className="flex items-center gap-3">
            <BuffrIcon name="building" className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{propertyName}</p>
              <p className="text-xs text-gray-500 capitalize">{propertyType}</p>
            </div>
          </div>

          {/* Room/Table Details */}
          {(roomNumber || tableNumber) && (
            <div className="flex items-center gap-3">
              <BuffrIcon 
                name={propertyType === 'hotel' ? 'bed' : 'table'} 
                className="h-4 w-4 text-gray-500" 
              />
              <div>
                <p className="text-sm text-gray-600">
                  {propertyType === 'hotel' ? `Room ${roomNumber}` : `Table ${tableNumber}`}
                </p>
                {roomType && (
                  <p className="text-xs text-gray-500">{roomType}</p>
                )}
              </div>
            </div>
          )}

          {/* Dates and Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <BuffrIcon name="calendar" className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">{formatDate(checkInDate)}</p>
                <p className="text-xs text-gray-500">
                  {propertyType === 'hotel' ? 'Check-in' : 'Reservation'} Date
                </p>
              </div>
            </div>
            
            {checkOutDate && (
              <div className="flex items-center gap-3">
                <BuffrIcon name="calendar" className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">{formatDate(checkOutDate)}</p>
                  <p className="text-xs text-gray-500">Check-out Date</p>
                </div>
              </div>
            )}
          </div>

          {/* Times */}
          {(checkInTime || checkOutTime) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {checkInTime && (
                <div className="flex items-center gap-3">
                  <BuffrIcon name="clock" className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">{formatTime(checkInTime)}</p>
                    <p className="text-xs text-gray-500">
                      {propertyType === 'hotel' ? 'Check-in' : 'Arrival'} Time
                    </p>
                  </div>
                </div>
              )}
              
              {checkOutTime && (
                <div className="flex items-center gap-3">
                  <BuffrIcon name="clock" className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">{formatTime(checkOutTime)}</p>
                    <p className="text-xs text-gray-500">Check-out Time</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Duration */}
          {propertyType === 'hotel' && checkOutDate && (
            <div className="flex items-center gap-3">
              <BuffrIcon name="moon" className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">{getDuration()}</p>
                <p className="text-xs text-gray-500">Stay Duration</p>
              </div>
            </div>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="flex items-start gap-3">
              <BuffrIcon name="star" className="h-4 w-4 text-gray-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-1">
                  {amenities.map((amenity, index) => (
                    <BuffrBadge key={index} variant="neutral" size="sm">
                      {amenity}
                    </BuffrBadge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </BuffrCardContent>
    </BuffrCard>
  );
};