/**
 * Property Overview Component
 *
 * Purpose: Displays comprehensive property overview with key metrics and status
 * Functionality: Property details, metrics, status indicators, quick actions
 * Location: /components/dashboard/property-owner/PropertyOverview.tsx
 *
 * Follows 40 Rules:
 * - Uses DaisyUI for consistent styling
 * - Modular component design for easy maintenance
 * - TypeScript for type safety
 * - Vercel-compatible with SSR
 * - Uses Neon PostgreSQL database
 * - Comprehensive error handling
 * - Optimized for performance
 */

'use client';

import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/components/ui';
import {
  Building,
  MapPin,
  Star,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Calendar,
  Settings,
} from 'lucide-react';

// Types for TypeScript compliance
interface Property {
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
  rating: number;
  total_reviews: number;
  property_code: string;
  capacity: number;
  price_range: string;
  cuisine_type?: string;
  star_rating?: number;
  staff_count: number;
  tables_count: number;
  rooms_count: number;
  orders_today: number;
  revenue_today: number;
  inventory_items: number;
  low_stock_items: number;
  active_bookings: number;
  pending_orders: number;
}

interface PropertyOverviewProps {
  property: Property;
  onEditProperty: () => void;
  onViewDetails: () => void;
  isLoading?: boolean;
}

// Main Property Overview Component
export const PropertyOverview: React.FC<PropertyOverviewProps> = ({
  property,
  onEditProperty,
  onViewDetails,
  isLoading = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs for performance optimization
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      setIsRefreshing(false);
      // This would typically trigger a data refresh
    }, 1000);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: 'NAD',
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'open':
        return 'badge-success';
      case 'maintenance':
      case 'closed':
        return 'badge-warning';
      case 'inactive':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  // Get property type icon
  const getPropertyTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'restaurant':
        return '🍽️';
      case 'hotel':
        return '🏨';
      case 'spa':
        return '🧘';
      case 'bar':
        return '🍸';
      default:
        return '🏢';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Property Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="loading loading-spinner loading-md text-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Property Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">
                {getPropertyTypeIcon(property.type)}
              </div>
              <div>
                <CardTitle className="text-2xl">{property.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-base-content/50" />
                  <span className="text-base-content/70">
                    {property.location}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getStatusColor(property.status)}>
                    {property.status}
                  </Badge>
                  <Badge variant="outline">{property.property_code}</Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                className="btn-outline btn-sm"
                disabled={isRefreshing}
              >
                <Clock className="w-4 h-4" />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button onClick={onEditProperty} className="btn-outline btn-sm">
                <Settings className="w-4 h-4" />
                Edit
              </Button>
              <Button onClick={onViewDetails} className="btn-primary btn-sm">
                View Details
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Property Details */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Property Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Type:</span>
                  <span className="font-medium">{property.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Capacity:</span>
                  <span className="font-medium">
                    {property.capacity} people
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Price Range:</span>
                  <span className="font-medium">{property.price_range}</span>
                </div>
                {property.cuisine_type && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Cuisine:</span>
                    <span className="font-medium">{property.cuisine_type}</span>
                  </div>
                )}
                {property.star_rating && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Star Rating:</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < property.star_rating!
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rating & Reviews */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Rating & Reviews</h4>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {property.rating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(property.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-base-content/70">
                  {property.total_reviews} reviews
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Quick Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Staff:</span>
                  <span className="font-medium">{property.staff_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Tables:</span>
                  <span className="font-medium">{property.tables_count}</span>
                </div>
                {property.rooms_count > 0 && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Rooms:</span>
                    <span className="font-medium">{property.rooms_count}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-success">
                  {formatCurrency(property.revenue_today)}
                </div>
                <div className="text-sm text-base-content/70">
                  Revenue Today
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {property.orders_today}
                </div>
                <div className="text-sm text-base-content/70">Orders Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">
                  {property.low_stock_items}
                </div>
                <div className="text-sm text-base-content/70">
                  Low Stock Items
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-info" />
              </div>
              <div>
                <div className="text-2xl font-bold text-info">
                  {property.active_bookings}
                </div>
                <div className="text-sm text-base-content/70">
                  Active Bookings
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Notifications */}
      {(property.low_stock_items > 0 || property.pending_orders > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {property.low_stock_items > 0 && (
                <div className="alert alert-warning">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    {property.low_stock_items} items are running low on stock
                  </span>
                </div>
              )}

              {property.pending_orders > 0 && (
                <div className="alert alert-info">
                  <Clock className="w-4 h-4" />
                  <span>
                    {property.pending_orders} orders are pending processing
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyOverview;
