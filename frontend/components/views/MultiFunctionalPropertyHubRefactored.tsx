/**
 * Multi-Functional Property Hub - Refactored Modular Implementation
 *
 * Purpose: Main property management hub with modular architecture
 * Location: /src/admin/components/views/multi-functional/MultiFunctionalPropertyHubRefactored.tsx
 * Usage: Centralized property management with separated concerns
 *
 * @author George Nekwaya (pendanek@gmail.com)
 * @version 2.0.0
 * @framework Buffr Host Framework
 */

import React, { useState, useEffect } from 'react';
import { useDocumentInfo } from '@payloadcms/ui/providers/DocumentInfo';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PropertyDataService } from './services/property-data-service';
import { OverviewDashboard } from './components/OverviewDashboard';
import {
  Property,
  PropertyHubState,
  TabConfig,
} from './types/property-hub-types';

/**
 * Multi-Functional Property Hub Component - Refactored
 *
 * Main property management hub with modular architecture following the 40 rules.
 * Separated into smaller, manageable components for better maintainability.
 */
export const MultiFunctionalPropertyHubRefactored: React.FC = () => {
  const { id: propertyId } = useDocumentInfo();
  const [state, setState] = useState<PropertyHubState>({
    property: null,
    hotelData: { bookings: [], roomTypes: [], roomAvailability: [] },
    restaurantData: {
      menuItems: [],
      tables: [],
      reservations: [],
      orders: [],
      inventory: [],
    },
    amenities: {},
    loading: true,
    error: null,
  });

  const dataService = new PropertyDataService();

  useEffect(() => {
    const fetchData = async () => {
      if (!propertyId) return;

      try {
        const data = await dataService.fetchMultiFunctionalData(propertyId);
        setState(data);
      } catch (error) {
        console.error('Error fetching property data:', error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error ? error.message : 'Unknown error occurred',
        }));
      }
    };

    fetchData();
  }, [propertyId]);

  // Define tab configurations
  const tabConfigs: TabConfig[] = [
    {
      value: 'overview',
      label: 'Overview Dashboard',
      enabled: true,
      component: OverviewDashboard,
    },
    {
      value: 'hotel',
      label: 'Hotel Operations',
      enabled: state.amenities.hotel || false,
      component: () => <div>Hotel Operations Component</div>,
    },
    {
      value: 'restaurant',
      label: 'Restaurant Operations',
      enabled: state.amenities.restaurant || false,
      component: () => <div>Restaurant Operations Component</div>,
    },
    {
      value: 'bar',
      label: 'Bar Operations',
      enabled: state.amenities.bar || false,
      component: () => <div>Bar Operations Component</div>,
    },
    {
      value: 'room-service',
      label: 'Room Service',
      enabled: state.amenities.room_service || false,
      component: () => <div>Room Service Component</div>,
    },
    {
      value: 'amenities',
      label: 'Amenities Management',
      enabled: true,
      component: () => <div>Amenities Management Component</div>,
    },
    {
      value: 'analytics',
      label: 'Unified Analytics',
      enabled: true,
      component: () => <div>Unified Analytics Component</div>,
    },
    {
      value: 'staff',
      label: 'Staff Management',
      enabled: true,
      component: () => <div>Staff Management Component</div>,
    },
  ];

  // Filter enabled tabs
  const enabledTabs = tabConfigs.filter((tab) => tab.enabled);

  if (state.loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading multi-functional property data...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="error-container">
        <div className="error-state">
          <h2>Error Loading Property Data</h2>
          <p>{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!state.property) {
    return (
      <div className="error-container">
        <div className="error-state">
          <h2>Property Not Found</h2>
          <p>The requested property could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="multi-functional-property-hub">
      <PropertyHubHeader
        property={state.property}
        amenities={state.amenities}
        onRefresh={() => dataService.refreshPropertyData(propertyId)}
      />

      <Tabs defaultValue="overview">
        <TabsList>
          {enabledTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {enabledTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <tab.component
              property={state.property}
              hotelData={state.hotelData}
              restaurantData={state.restaurantData}
              amenities={state.amenities}
              onDataUpdate={(data) =>
                setState((prev) => ({ ...prev, ...data }))
              }
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

/**
 * Property Hub Header Component
 */
interface PropertyHubHeaderProps {
  property: Property;
  amenities: Record<string, boolean>;
  onRefresh: () => void;
}

const PropertyHubHeader: React.FC<PropertyHubHeaderProps> = ({
  property,
  amenities,
  onRefresh,
}) => {
  const activeAmenities = Object.entries(amenities)
    .filter(([key, value]) => value === true)
    .map(([key]) => key);

  return (
    <div className="hub-header">
      <div className="header-content">
        <div className="header-title">
          <h1>{property.name} - Multi-Functional Property Management</h1>
          <p>Complete hotel and restaurant operations management</p>
        </div>

        <div className="header-actions">
          <button
            onClick={onRefresh}
            className="refresh-button"
            title="Refresh Data"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="amenities-badge">
        {activeAmenities.map((amenity) => (
          <AmenityBadge key={amenity} amenity={amenity} />
        ))}
      </div>
    </div>
  );
};

/**
 * Amenity Badge Component
 */
interface AmenityBadgeProps {
  amenity: string;
}

const AmenityBadge: React.FC<AmenityBadgeProps> = ({ amenity }) => {
  const amenityIcons: Record<string, string> = {
    hotel: '🏨',
    restaurant: '🍽️',
    bar: '🍸',
    spa: '🧘',
    gym: '💪',
    pool: '🏊',
    room_service: '🚪',
    delivery: '🚚',
    takeaway: '🥡',
  };

  return (
    <span className="amenity-tag">
      <span className="amenity-icon">{amenityIcons[amenity] || '⭐'}</span>
      <span className="amenity-text">
        {amenity.replace('_', ' ').toUpperCase()}
      </span>
    </span>
  );
};
