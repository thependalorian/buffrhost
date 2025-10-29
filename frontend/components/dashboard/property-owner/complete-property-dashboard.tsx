/**
 * Complete Property Dashboard Component - Modular Implementation
 *
 * Purpose: Comprehensive dashboard for all property types with modular architecture
 * Functionality: Property overview, analytics, management tabs, real-time updates
 * Location: /components/dashboard/property-owner/CompletePropertyDashboardModular.tsx
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

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import {
  Building,
  BarChart3,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

// Import modular components
import PropertyOverview from './PropertyOverview';
import PropertyAnalytics from './PropertyAnalytics';
import PropertyManagement from './PropertyManagement';

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

interface AnalyticsData {
  period: string;
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  orders: {
    current: number;
    previous: number;
    change: number;
  };
  customers: {
    current: number;
    previous: number;
    change: number;
  };
  averageOrderValue: {
    current: number;
    previous: number;
    change: number;
  };
  topItems: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
  hourlyData: {
    hour: string;
    orders: number;
    revenue: number;
  }[];
  dailyData: {
    date: string;
    orders: number;
    revenue: number;
  }[];
}

interface PropertyManagementProps {
  propertyId: string;
  tenantId?: string;
}

// Main Complete Property Dashboard Component
export const CompletePropertyDashboardModular: React.FC<
  PropertyManagementProps
> = ({ propertyId, tenantId = 'default-tenant' }) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'analytics' | 'management'
  >('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Refs for performance optimization
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load property data
  useEffect(() => {
    const loadPropertyData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load property information
        const propertyRes = await fetch(`/api/secure/properties/${propertyId}`);
        if (propertyRes.ok) {
          const propertyData = await propertyRes.json();
          setProperty(propertyData.data);
        }

        // Load analytics data
        const analyticsRes = await fetch(
          `/api/secure/properties/${propertyId}/analytics`
        );
        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          setAnalytics(analyticsData.data);
        }
      } catch (err) {
        console.error('Error loading property data:', err);
        setError('Failed to load property data');

        // Fallback mock data
        setProperty({
          id: propertyId,
          name: 'The Grand Buffr Hotel',
          type: 'hotel',
          location: 'Windhoek, Namibia',
          status: 'active',
          rating: 4.5,
          total_reviews: 128,
          property_code: 'GBH-001',
          capacity: 200,
          price_range: 'N$ 800 - N$ 2,500',
          cuisine_type: 'International',
          star_rating: 5,
          staff_count: 45,
          tables_count: 25,
          rooms_count: 80,
          orders_today: 156,
          revenue_today: 45000,
          inventory_items: 1200,
          low_stock_items: 8,
          active_bookings: 32,
          pending_orders: 12,
        });

        setAnalytics({
          period: '7d',
          revenue: {
            current: 315000,
            previous: 280000,
            change: 12.5,
          },
          orders: {
            current: 1092,
            previous: 980,
            change: 11.4,
          },
          customers: {
            current: 856,
            previous: 720,
            change: 18.9,
          },
          averageOrderValue: {
            current: 288.5,
            previous: 285.7,
            change: 1.0,
          },
          topItems: [
            { name: 'Grilled Salmon', quantity: 45, revenue: 8100 },
            { name: 'Caesar Salad', quantity: 38, revenue: 3610 },
            { name: 'Chocolate Cake', quantity: 32, revenue: 2080 },
          ],
          hourlyData: [],
          dailyData: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId) {
      loadPropertyData();
    }
  }, [propertyId, tenantId]);

  // Handle property edit
  const handleEditProperty = () => {
    console.log('Edit property:', propertyId);
    // This would typically open a property edit modal or navigate to edit page
  };

  // Handle view details
  const handleViewDetails = () => {
    console.log('View property details:', propertyId);
    // This would typically navigate to detailed property view
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as unknown);
  };

  // Handle analytics period change
  const handleAnalyticsPeriodChange = async (period: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/secure/properties/${propertyId}/analytics?period=${period}`
      );
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle analytics export
  const handleAnalyticsExport = () => {
    try {
      const data = {
        propertyId,
        property: property?.name,
        analytics,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `property-analytics-${propertyId}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting analytics:', error);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  if (isLoading && !property) {
    return (
      <div className="min-h-screen bg-base-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Property Dashboard
            </h1>
            <p className="text-base-content/70">
              {property ? property.name : 'Loading...'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
            <Button
              onClick={handleRefresh}
              className="btn-outline btn-sm"
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="alert alert-error mb-6">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
            <Button onClick={() => setError(null)} className="btn-sm btn-ghost">
              ×
            </Button>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-6">
            <CheckCircle className="w-4 h-4" />
            <span>{success}</span>
            <Button
              onClick={() => setSuccess(null)}
              className="btn-sm btn-ghost"
            >
              ×
            </Button>
          </div>
        )}

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Management
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {property && (
              <PropertyOverview
                property={property}
                onEditProperty={handleEditProperty}
                onViewDetails={handleViewDetails}
                isLoading={isLoading}
              />
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            {analytics && (
              <PropertyAnalytics
                propertyId={propertyId}
                analytics={analytics}
                onPeriodChange={handleAnalyticsPeriodChange}
                onExportData={handleAnalyticsExport}
                isLoading={isLoading}
              />
            )}
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management">
            {property && (
              <PropertyManagement
                property={property}
                onTabChange={handleTabChange}
                isLoading={isLoading}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompletePropertyDashboardModular;
