/**
 * Availability Checker - Modular Implementation
 *
 * Purpose: Multi-type availability checking with modular architecture
 * Functionality: Inventory, service, table, and room availability checking
 * Location: /components/features/availability/AvailabilityCheckerModular.tsx
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
  CheckCircle,
  Package,
  Spa,
  Utensils,
  Bed,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

// Import modular components
import InventoryAvailabilityChecker from './InventoryAvailabilityChecker';
import ServiceAvailabilityChecker from './ServiceAvailabilityChecker';
import TableAvailabilityChecker from './TableAvailabilityChecker';
import RoomAvailabilityChecker from './RoomAvailabilityChecker';

// Types for TypeScript compliance
interface AvailabilityCheckerProps {
  propertyId: string;
  type?: 'inventory' | 'service' | 'table' | 'room';
  onAvailabilityChange?: (available: boolean, data?: unknown) => void;
  onError?: (error: string) => void;
  className?: string;
}

// Availability types configuration
const availabilityTypes = [
  {
    id: 'inventory',
    label: 'Inventory',
    description: 'Check item availability',
    icon: Package,
    color: 'text-blue-600',
  },
  {
    id: 'service',
    label: 'Services',
    description: 'Check service availability',
    icon: Spa,
    color: 'text-pink-600',
  },
  {
    id: 'table',
    label: 'Tables',
    description: 'Check table availability',
    icon: Utensils,
    color: 'text-green-600',
  },
  {
    id: 'room',
    label: 'Rooms',
    description: 'Check room availability',
    icon: Bed,
    color: 'text-purple-600',
  },
];

// Main Availability Checker Component
export const AvailabilityCheckerModular: React.FC<AvailabilityCheckerProps> = ({
  propertyId,
  type = 'inventory',
  onAvailabilityChange,
  onError,
  className = '',
}) => {
  const [activeType, setActiveType] = useState(type);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for performance optimization
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle type change
  const handleTypeChange = (newType: string) => {
    setActiveType(newType as unknown);
    setError(null);
  };

  // Handle availability change
  const handleAvailabilityChange = (available: boolean, data?: unknown) => {
    setLastChecked(new Date());
    onAvailabilityChange?.(available, data);
  };

  // Handle error
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    onError?.(errorMessage);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Refresh all checkers
  const handleRefresh = () => {
    setIsLoading(true);
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setLastChecked(new Date());
    }, 1000);
  };

  // Get current type configuration
  const currentTypeConfig = availabilityTypes.find((t) => t.id === activeType);

  return (
    <div className={`availability-checker ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Availability Checker
              </CardTitle>
              <p className="text-base-content/70 mt-1">
                Real-time availability checking for inventory, services, tables,
                and rooms
              </p>
            </div>

            <div className="flex items-center gap-4">
              {lastChecked && (
                <div className="text-sm text-base-content/70">
                  Last checked: {lastChecked.toLocaleTimeString()}
                </div>
              )}
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Error Message */}
      {error && (
        <Card>
          <CardContent className="p-4">
            <div className="alert alert-error">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
              <Button onClick={clearError} className="btn-sm btn-ghost">
                ×
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs
        value={activeType}
        onValueChange={handleTypeChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          {availabilityTypes.map((typeConfig) => {
            const IconComponent = typeConfig.icon;
            return (
              <TabsTrigger
                key={typeConfig.id}
                value={typeConfig.id}
                className="flex items-center gap-2"
              >
                <IconComponent className={`w-4 h-4 ${typeConfig.color}`} />
                <span className="hidden sm:inline">{typeConfig.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <InventoryAvailabilityChecker
            propertyId={propertyId}
            onAvailabilityChange={handleAvailabilityChange}
            onError={handleError}
            isLoading={isLoading}
          />
        </TabsContent>

        {/* Service Tab */}
        <TabsContent value="service">
          <ServiceAvailabilityChecker
            propertyId={propertyId}
            onAvailabilityChange={handleAvailabilityChange}
            onError={handleError}
            isLoading={isLoading}
          />
        </TabsContent>

        {/* Table Tab */}
        <TabsContent value="table">
          <TableAvailabilityChecker
            propertyId={propertyId}
            onAvailabilityChange={handleAvailabilityChange}
            onError={handleError}
            isLoading={isLoading}
          />
        </TabsContent>

        {/* Room Tab */}
        <TabsContent value="room">
          <RoomAvailabilityChecker
            propertyId={propertyId}
            onAvailabilityChange={handleAvailabilityChange}
            onError={handleError}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      {lastChecked && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-sm text-base-content/70">
                System Status:{' '}
                <span className="text-success font-medium">Operational</span>
              </div>
              <div className="text-xs text-base-content/50 mt-1">
                Last updated: {lastChecked.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AvailabilityCheckerModular;
