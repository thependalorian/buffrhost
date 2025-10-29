'use client';

import React from 'react';
import { BuffrCard, BuffrCardContent, BuffrCardHeader, BuffrCardTitle } from '@/components/ui/cards/BuffrCard';
import { BuffrIcon, BuffrIconName } from '@/components/ui/icons/BuffrIcons';
import { BuffrBadge } from '@/components/ui/feedback/BuffrBadge';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';

/**
 * Property Overview Component
 * 
 * Displays property basic information, status, and quick actions
 * Location: components/property/PropertyOverview.tsx
 */

interface PropertyOverviewProps {
  propertyName: string;
  propertyType: 'hotel' | 'restaurant';
  status: 'active' | 'inactive' | 'maintenance' | 'suspended';
  location: string;
  totalRooms?: number;
  totalTables?: number;
  occupancyRate?: number;
  averageRating?: number;
  lastUpdated: Date;
  onEdit?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

export const PropertyOverview: React.FC<PropertyOverviewProps> = ({
  propertyName,
  propertyType,
  status,
  location,
  totalRooms,
  totalTables,
  occupancyRate,
  averageRating,
  lastUpdated,
  onEdit,
  onViewDetails,
  className = ''
}) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-100';
      case 'suspended':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'neutral';
      case 'maintenance':
        return 'warning';
      case 'suspended':
        return 'error';
      default:
        return 'neutral';
    }
  };

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

  const formatLastUpdated = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <BuffrCard className={className}>
      <BuffrCardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BuffrIcon 
              name={getPropertyIcon(propertyType)} 
              className="h-6 w-6 text-blue-600" 
            />
            <div>
              <BuffrCardTitle className="text-xl">
                {propertyName}
              </BuffrCardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {location}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BuffrBadge 
              variant={getStatusVariant(status)}
              size="lg"
            >
              {status.toUpperCase()}
            </BuffrBadge>
          </div>
        </div>
      </BuffrCardHeader>
      <BuffrCardContent>
        <div className="space-y-4">
          {/* Property Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {totalRooms && (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{totalRooms}</p>
                <p className="text-sm text-gray-600">Rooms</p>
              </div>
            )}
            {totalTables && (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{totalTables}</p>
                <p className="text-sm text-gray-600">Tables</p>
              </div>
            )}
            {occupancyRate !== undefined && (
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{occupancyRate}%</p>
                <p className="text-sm text-gray-600">Occupancy</p>
              </div>
            )}
            {averageRating !== undefined && (
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{averageRating}</p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
            )}
          </div>

          {/* Status and Last Updated */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <BuffrIcon name="clock" className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Last updated: {formatLastUpdated(lastUpdated)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <BuffrButton variant="outline" size="sm" onClick={onEdit}>
                  <BuffrIcon name="edit" className="h-4 w-4 mr-2" />
                  Edit
                </BuffrButton>
              )}
              {onViewDetails && (
                <BuffrButton variant="primary" size="sm" onClick={onViewDetails}>
                  <BuffrIcon name="external-link" className="h-4 w-4 mr-2" />
                  View Details
                </BuffrButton>
              )}
            </div>
          </div>
        </div>
      </BuffrCardContent>
    </BuffrCard>
  );
};