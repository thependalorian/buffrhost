'use client';
/**
 * Property Selection Page
 *
 * Landing page for property owners to select their property
 * Features: Property listing, access control, navigation to specific dashboards
 * Location: app/property-dashboard/page.tsx
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  StarIcon,
  ArrowRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';

interface Property {
  id: string;
  name: string;
  type: 'restaurant' | 'hotel' | 'cafe' | 'bar';
  address: string;
  city: string;
  status: 'active' | 'inactive' | 'pending';
  totalOrders: number;
  monthlyRevenue: number;
  averageRating: number;
  lastOrderDate: string;
}

export default function PropertySelectionPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthenticationAndLoadProperties();
  }, []);

  const checkAuthenticationAndLoadProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real app, this would check JWT tokens and user roles
      // For demo purposes, we'll simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsAuthenticated(true);

      // Load user's properties
      await loadUserProperties();
    } catch (error) {
      console.error('Authentication error:', error);
      setError(
        error instanceof Error ? error.message : 'Authentication failed'
      );
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProperties = async () => {
    try {
      // Get user ID from authentication context
      const userId = 'user_123'; // This should come from auth context
      const _tenantId = 'tenant_123'; // This should come from auth context

      // Fetch properties from Neon database via API
      const response = await fetch(
        `/api/secure/properties?owner_id=${userId}&tenant_id=${tenantId}&include_details=true`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load properties');
      }

      // Transform database data to component format
      const properties: Property[] = data.data.map((property: unknown) => ({
        id: property.id,
        name: property.name,
        type: property.type,
        address: property.address,
        city: property.location,
        status: property.status,
        totalOrders: property.total_orders || 0,
        monthlyRevenue: property.monthly_revenue || 0,
        averageRating: property.average_rating || 0,
        lastOrderDate: property.last_order_date || property.updated_at,
      }));

      setProperties(properties);
    } catch (error) {
      console.error('Error loading properties:', error);
      setError('Failed to load properties');
    }
  };

  const handlePropertySelect = (propertyId: string) => {
    router.push(`/property-dashboard/${propertyId}`);
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return 'R';
      case 'hotel':
        return 'H';
      case 'cafe':
        return 'C';
      case 'bar':
        return 'B';
      default:
        return 'P';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-nude-100 text-nude-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-nude-100 text-nude-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: 'NAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nude-600 mx-auto mb-4"></div>
          <p className="text-nude-600">Loading your properties...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-nude-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-nude-900">
              Access Denied
            </h2>
            <p className="mt-2 text-sm text-nude-600">
              You need to be logged in as a property owner to access this page.
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <BuffrButton
              onClick={() => (window.location.href = '/auth/login')}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Sign In
            </BuffrButton>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-nude-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="text-semantic-error text-6xl mb-4">!</div>
            <h2 className="mt-6 text-3xl font-extrabold text-nude-900">
              Error Loading Properties
            </h2>
            <p className="mt-2 text-sm text-nude-600">{error}</p>
          </div>
          <div className="mt-8 space-y-6">
            <BuffrButton
              onClick={loadUserProperties}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Try Again
            </BuffrButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nude-50">
      {/* Header - Responsive */}
      <header className="bg-nude-50 shadow-nude-soft border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 py-4 sm:py-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-nude-900 truncate">
                My Properties
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-nude-600 mt-1 break-words">
                Select a property to manage
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <BuffrButton
                onClick={loadUserProperties}
                variant="outline"
                size="md"
                className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-0 whitespace-nowrap"
              >
                Refresh
              </BuffrButton>
              <BuffrButton
                variant="primary"
                size="md"
                className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 min-h-[44px] sm:min-h-0 whitespace-nowrap"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Property</span>
              </BuffrButton>
            </div>
          </div>
        </div>
      </header>

      {/* Properties Grid - Responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {properties.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <BuildingOfficeIcon className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-nude-400" />
            <h3 className="mt-2 text-sm sm:text-base font-medium text-nude-900 truncate">
              No properties
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-nude-500 break-words px-4">
              Get started by adding your first property.
            </p>
            <div className="mt-4 sm:mt-6">
              <BuffrButton
                variant="primary"
                size="md"
                className="flex items-center justify-center mx-auto min-h-[44px] sm:min-h-0"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Property
              </BuffrButton>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                onClick={() => handlePropertySelect(property.id)}
                className="bg-nude-50 rounded-lg shadow-luxury-medium hover:shadow-luxury-strong transition-shadow duration-300 cursor-pointer border border-nude-200 hover:border-nude-300 overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      <div className="text-xl sm:text-2xl flex-shrink-0">
                        {getPropertyTypeIcon(property.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-nude-900 truncate">
                          {property.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-nude-500 capitalize truncate">
                          {property.type}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${getStatusColor(property.status)}`}
                    >
                      {property.status}
                    </span>
                  </div>

                  <div className="mt-3 sm:mt-4">
                    <div className="flex items-center text-xs sm:text-sm text-nude-500">
                      <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {property.address}, {property.city}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-nude-500 truncate">
                        Total Orders
                      </p>
                      <p className="text-base sm:text-lg font-semibold text-nude-900 truncate">
                        {property.totalOrders.toLocaleString()}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-nude-500 truncate">
                        Monthly Revenue
                      </p>
                      <p className="text-base sm:text-lg font-semibold text-semantic-success truncate">
                        {formatCurrency(property.monthlyRevenue)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-400 mr-1 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-nude-900">
                        {property.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-nude-500 truncate">
                      Last order: {formatDate(property.lastOrderDate)}
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 flex items-center justify-end">
                    <ArrowRightIcon className="w-5 h-5 text-nude-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
