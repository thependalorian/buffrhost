'use client';
/**
 * Property Owner Portal Landing Page
 *
 * Main landing page for property owners to access their management tools
 * Features: Quick access to CMS, property selection, management overview
 * Location: app/property-owner/page.tsx
 */

import { useState, useEffect } from 'react';
import {
  BuffrCard,
  BuffrCardBody,
  BuffrButton,
  BuffrBadge,
  BuffrIcon,
} from '@/components/ui';
interface Property {
  id: string;
  name: string;
  type: 'restaurant' | 'hotel';
  location: string;
  rating: number;
  totalOrders: number;
  totalRevenue: number;
  status: string;
  phone?: string;
  email?: string;
}

export default function PropertyOwnerPortalPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/properties');
      const data = await response.json();

      if (data.success) {
        setProperties(data.data);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPropertyIcon = (type: string) => {
    return type === 'restaurant' ? (
      <BuffrIcon name="utensils" className="h-6 w-6" />
    ) : (
      <BuffrIcon name="bed" className="h-6 w-6" />
    );
  };

  const getPropertyTypeColor = (type: string) => {
    return type === 'restaurant'
      ? 'bg-orange-100 text-orange-800'
      : 'bg-blue-100 text-blue-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: 'NAD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 to-nude-100">
      {/* Header */}
      <div className="bg-nude-50 shadow-nude-soft border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-nude-100 rounded-lg">
                <BuffrIcon
                  name="building-2"
                  size="lg"
                  className="text-nude-600"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-nude-900">
                  Property Owner Portal
                </h1>
                <p className="text-nude-600">
                  Manage your properties and business operations
                </p>
              </div>
            </div>
            <BuffrButton
              onClick={() => (window.location.href = '/property-owner/login')}
            >
              Access Dashboard
            </BuffrButton>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <BuffrCard>
            <BuffrCardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-nude-600">
                    Total Properties
                  </p>
                  <p className="text-2xl font-bold text-nude-900">
                    {properties.length}
                  </p>
                </div>
                <BuffrIcon
                  name="building-2"
                  size="lg"
                  className="text-nude-400"
                />
              </div>
            </BuffrCardBody>
          </BuffrCard>

          <BuffrCard>
            <BuffrCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-nude-600">
                    Restaurants
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {properties.filter((p) => p.type === 'restaurant').length}
                  </p>
                </div>
                <BuffrIcon
                  name="utensils"
                  className="h-8 w-8 text-orange-400"
                />
              </div>
            </BuffrCardContent>
          </BuffrCard>

          <BuffrCard>
            <BuffrCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-nude-600">Hotels</p>
                  <p className="text-2xl font-bold text-nude-700">
                    {properties.filter((p) => p.type === 'hotel').length}
                  </p>
                </div>
                <BuffrIcon name="bed" className="h-8 w-8 text-blue-400" />
              </div>
            </BuffrCardContent>
          </BuffrCard>

          <BuffrCard>
            <BuffrCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-nude-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-semantic-success">
                    {formatCurrency(
                      properties.reduce((sum, p) => sum + p.totalRevenue, 0)
                    )}
                  </p>
                </div>
                <BuffrIcon
                  name="bar-chart-3"
                  className="h-8 w-8 text-green-400"
                />
              </div>
            </BuffrCardContent>
          </BuffrCard>
        </div>

        {/* Management Features */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-nude-900 mb-4">
            Management Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <BuffrCard className="hover:shadow-luxury-strong transition-shadow duration-300 cursor-pointer">
              <BuffrCardContent className="p-6 text-center">
                <BuffrIcon
                  name="file-text"
                  className="h-8 w-8 text-nude-600 mx-auto mb-3"
                />
                <h3 className="font-semibold text-nude-900 mb-2">
                  Content Management
                </h3>
                <p className="text-sm text-nude-600 mb-4">
                  Manage menus, rooms, and property details
                </p>
                <BuffrButton variant="outline" size="sm" className="w-full">
                  <BuffrIcon name="arrow-right" className="h-4 w-4 mr-2" />
                  Access CMS
                </BuffrButton>
              </BuffrCardContent>
            </BuffrCard>

            <BuffrCard className="hover:shadow-luxury-strong transition-shadow duration-300 cursor-pointer">
              <BuffrCardContent className="p-6 text-center">
                <BuffrIcon
                  name="users"
                  className="h-8 w-8 text-nude-600 mx-auto mb-3"
                />
                <h3 className="font-semibold text-nude-900 mb-2">
                  Staff Management
                </h3>
                <p className="text-sm text-nude-600 mb-4">
                  Manage employees and schedules
                </p>
                <BuffrButton variant="outline" size="sm" className="w-full">
                  <BuffrIcon name="arrow-right" className="h-4 w-4 mr-2" />
                  Manage Staff
                </BuffrButton>
              </BuffrCardContent>
            </BuffrCard>

            <BuffrCard className="hover:shadow-luxury-strong transition-shadow duration-300 cursor-pointer">
              <BuffrCardContent className="p-6 text-center">
                <BuffrIcon
                  name="package"
                  className="h-8 w-8 text-nude-600 mx-auto mb-3"
                />
                <h3 className="font-semibold text-nude-900 mb-2">Inventory</h3>
                <p className="text-sm text-nude-600 mb-4">
                  Track stock and supplies
                </p>
                <BuffrButton variant="outline" size="sm" className="w-full">
                  <BuffrIcon name="arrow-right" className="h-4 w-4 mr-2" />
                  Manage Inventory
                </BuffrButton>
              </BuffrCardContent>
            </BuffrCard>

            <BuffrCard className="hover:shadow-luxury-strong transition-shadow duration-300 cursor-pointer">
              <BuffrCardContent className="p-6 text-center">
                <BuffrIcon
                  name="calendar"
                  className="h-8 w-8 text-nude-600 mx-auto mb-3"
                />
                <h3 className="font-semibold text-nude-900 mb-2">Bookings</h3>
                <p className="text-sm text-nude-600 mb-4">
                  Manage reservations and orders
                </p>
                <BuffrButton variant="outline" size="sm" className="w-full">
                  <BuffrIcon name="arrow-right" className="h-4 w-4 mr-2" />
                  View Bookings
                </BuffrButton>
              </BuffrCardContent>
            </BuffrCard>
          </div>
        </div>

        {/* Properties List */}
        <div>
          <h2 className="text-xl font-semibold text-nude-900 mb-4">
            Your Properties
          </h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nude-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <BuffrCard
                  key={property.id}
                  className="hover:shadow-luxury-strong transition-shadow duration-300"
                >
                  <BuffrCardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-nude-100 rounded-lg">
                          {getPropertyIcon(property.type)}
                        </div>
                        <div>
                          <BuffrCardTitle className="text-lg">
                            {property.name}
                          </BuffrCardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <BuffrIcon
                              name="map-pin"
                              className="h-4 w-4 text-nude-400"
                            />
                            <span className="text-sm text-nude-600">
                              {property.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <BuffrBadge
                        className={getPropertyTypeColor(property.type)}
                      >
                        {property.type}
                      </BuffrBadge>
                    </div>
                  </BuffrCardHeader>

                  <BuffrCardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <BuffrIcon
                            name="star"
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                          <span className="text-sm font-medium">
                            {property.rating}
                          </span>
                        </div>
                        <span className="text-sm text-nude-600">
                          {property.totalOrders} orders
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-nude-600">Revenue</span>
                        <span className="font-semibold text-semantic-success">
                          {formatCurrency(property.totalRevenue)}
                        </span>
                      </div>

                      {property.phone && (
                        <div className="flex items-center space-x-2">
                          <BuffrIcon
                            name="phone"
                            className="h-4 w-4 text-nude-400"
                          />
                          <span className="text-sm text-nude-600">
                            {property.phone}
                          </span>
                        </div>
                      )}

                      {property.email && (
                        <div className="flex items-center space-x-2">
                          <BuffrIcon
                            name="mail"
                            className="h-4 w-4 text-nude-400"
                          />
                          <span className="text-sm text-nude-600">
                            {property.email}
                          </span>
                        </div>
                      )}

                      <div className="pt-3 border-t">
                        <BuffrButton
                          className="w-full"
                          onClick={() =>
                            (window.location.href = `/property-dashboard/${property.id}`)
                          }
                        >
                          <BuffrIcon name="settings" className="h-4 w-4 mr-2" />
                          Manage Property
                        </BuffrButton>
                      </div>
                    </div>
                  </BuffrCardContent>
                </BuffrCard>
              ))}
            </div>
          )}
        </div>

        {/* Quick Access */}
        <div className="mt-8 bg-nude-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-nude-900 mb-4">
            Quick Access
          </h3>
          <div className="flex flex-wrap gap-4">
            <BuffrButton
              variant="outline"
              onClick={() => (window.location.href = '/property-owner/login')}
            >
              <BuffrIcon name="building-2" className="h-4 w-4 mr-2" />
              Property Dashboard
            </BuffrButton>
            <BuffrButton
              variant="outline"
              onClick={() => (window.location.href = '/protected/cms')}
            >
              <BuffrIcon name="file-text" className="h-4 w-4 mr-2" />
              Content Management
            </BuffrButton>
            <BuffrButton
              variant="outline"
              onClick={() => (window.location.href = '/restaurants')}
            >
              <BuffrIcon name="utensils" className="h-4 w-4 mr-2" />
              View Restaurants
            </BuffrButton>
            <BuffrButton
              variant="outline"
              onClick={() => (window.location.href = '/hotels')}
            >
              <BuffrIcon name="bed" className="h-4 w-4 mr-2" />
              View Hotels
            </BuffrButton>
          </div>
        </div>
      </div>
    </div>
  );
}
