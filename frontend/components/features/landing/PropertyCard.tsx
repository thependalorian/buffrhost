'use client';
import {
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrButton,
  BuffrBadge,
} from '@/components/ui';
/**
 * Property Card Component
 *
 * Displays property information with Buffr ID support for cross-project integration
 * Features: Property details, Buffr ID display, cross-project actions
 * Location: components/features/landing/PropertyCard.tsx
 */

import React from 'react';
import { Property, PropertyType, PropertyStatus } from '@/lib/types/properties';
import {
  MapPinIcon,
  StarIcon,
  PhoneIcon,
  GlobeAltIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
interface PropertyCardProps {
  property: Property;
  showBuffrId?: boolean;
  onViewDetails?: (property: Property) => void;
  onCrossProjectAction?: (buffrId: string) => void;
  className?: string;
}

export default function PropertyCard({
  property,
  showBuffrId = false,
  onViewDetails,
  onCrossProjectAction,
  className = '',
}: PropertyCardProps) {
  const {
    id,
    buffrId,
    name,
    type,
    location,
    address,
    phone,
    email,
    website,
    rating,
    totalOrders,
    totalRevenue,
    status,
    description,
  } = property;

  const getPropertyTypeColor = (type: PropertyType): string => {
    const colors = {
      hotel: 'bg-nude-100 text-nude-700 border-nude-200',
      restaurant: 'bg-nude-100 text-nude-700 border-nude-200',
      cafe: 'bg-nude-100 text-nude-700 border-nude-200',
      bar: 'bg-nude-100 text-nude-700 border-nude-200',
      spa: 'bg-nude-100 text-nude-700 border-nude-200',
      conference_center: 'bg-nude-100 text-nude-700 border-nude-200',
    };
    return colors[type] || 'bg-nude-100 text-nude-700 border-nude-200';
  };

  const getStatusColor = (status: PropertyStatus): string => {
    const colors = {
      active:
        'bg-semantic-success/10 text-semantic-success border-semantic-success/20',
      pending:
        'bg-semantic-warning/10 text-semantic-warning border-semantic-warning/20',
      suspended:
        'bg-semantic-error/10 text-semantic-error border-semantic-error/20',
      inactive: 'bg-nude-100 text-nude-600 border-nude-200',
    };
    return colors[status] || 'bg-nude-100 text-nude-600 border-nude-200';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: 'NAD',
    }).format(amount);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(property);
    }
  };

  const handleCrossProjectAction = () => {
    if (onCrossProjectAction && buffrId) {
      onCrossProjectAction(buffrId);
    }
  };

  return (
    <Card
      className={`hover:shadow-2xl-luxury-medium transition-all duration-300 duration-300 hover:-translate-y-1 ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-nude-900 mb-1">
              {name}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getPropertyTypeColor(type)}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
              <Badge className={getStatusColor(status)}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>
            {showBuffrId && buffrId && (
              <div className="mb-2">
                <Badge
                  variant="outline"
                  className="text-xs font-mono border-nude-300 text-nude-600"
                >
                  {buffrId}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <StarIcon className="h-4 w-4 text-nude-500 fill-current" />
            <span className="text-sm font-medium text-nude-700">
              {Number(rating).toFixed(1)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Location */}
          <div className="flex items-start gap-2">
            <MapPinIcon className="h-4 w-4 text-nude-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-nude-700">{location}</p>
              <p className="text-xs text-nude-600 truncate">{address}</p>
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-nude-600 line-clamp-2">{description}</p>
          )}

          {/* Contact Information */}
          <div className="space-y-1">
            {phone && (
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-3 w-3 text-nude-500" />
                <a
                  href={`tel:${phone}`}
                  className="text-xs text-nude-600 hover:text-nude-700 hover:underline"
                >
                  {phone}
                </a>
              </div>
            )}
            {website && (
              <div className="flex items-center gap-2">
                <GlobeAltIcon className="h-3 w-3 text-nude-500" />
                <a
                  href={`https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-nude-600 hover:text-nude-700 hover:underline truncate"
                >
                  {website}
                </a>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-nude-200">
            <div className="text-center">
              <p className="text-xs text-nude-500">Orders</p>
              <p className="text-sm font-semibold text-nude-900">
                {totalOrders}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-nude-500">Revenue</p>
              <p className="text-sm font-semibold text-nude-900">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-nude-200">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="flex-1 border-nude-300 text-nude-700 hover:bg-nude-50 hover:border-nude-400"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            View Details
          </Button>
          {showBuffrId && buffrId && onCrossProjectAction && (
            <Button
              variant="default"
              size="sm"
              onClick={handleCrossProjectAction}
              className="flex-1 bg-nude-600 hover:bg-nude-700 text-white shadow-2xl-luxury-soft hover:shadow-2xl-luxury-medium"
            >
              Cross-Project
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

// Property Grid Component
interface PropertyGridProps {
  properties: Property[];
  showBuffrIds?: boolean;
  onPropertyClick?: (property: Property) => void;
  onCrossProjectAction?: (buffrId: string) => void;
  className?: string;
}

export function PropertyGrid({
  properties,
  showBuffrIds = false,
  onPropertyClick,
  onCrossProjectAction,
  className = '',
}: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-nude-500">No properties found</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          showBuffrId={showBuffrIds}
          {...(onPropertyClick && { onViewDetails: onPropertyClick })}
          {...(onCrossProjectAction && { onCrossProjectAction })}
        />
      ))}
    </div>
  );
}

// Property List Component
interface PropertyListProps {
  properties: Property[];
  showBuffrIds?: boolean;
  onPropertyClick?: (property: Property) => void;
  onCrossProjectAction?: (buffrId: string) => void;
  className?: string;
}

export function PropertyList({
  properties,
  showBuffrIds = false,
  onPropertyClick,
  onCrossProjectAction,
  className = '',
}: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-nude-500">No properties found</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          showBuffrId={showBuffrIds}
          {...(onPropertyClick && { onViewDetails: onPropertyClick })}
          {...(onCrossProjectAction && { onCrossProjectAction })}
          className="w-full"
        />
      ))}
    </div>
  );
}
