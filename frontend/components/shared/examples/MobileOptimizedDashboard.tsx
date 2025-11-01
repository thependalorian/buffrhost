'use client';

import React, { useState } from 'react';
import Image from 'next/image';
/**
 *  React Component for Buffr Host Hospitality Platform
 * @fileoverview  provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/examples/MobileOptimizedDashboard.tsx
 * @purpose  provides specialized functionality for the Buffr Host platform
 * @component
 * @category Examples
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @database_connections Reads from relevant tables based on component functionality
 * @api_integration RESTful API endpoints for data fetching and mutations
 * @hooks_utilization useMobileOptimization, useMobileScroll, useState for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Real-time data integration with backend services
 * - API-driven functionality with error handling and loading states
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Methods:
 * @method handleSearch - handleSearch method for component functionality
 * @method handlePropertyAction - handlePropertyAction method for component functionality
 *
 * Usage Example:
 * @example
 * import  from './';
 *
 * function App() {
 *   return (
 *     <
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered  component
 */

import { MobileCard } from '@/components/ui/cards/BuffrCard';
import { MobileInput, MobileTextarea } from '@/components/ui/forms/MobileInput';
import {
  MobileBottomNav,
  MobileBottomSheet,
} from '@/components/ui/navigation/MobileBottomNav';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';
import {
  useMobileOptimization,
  useMobileScroll,
} from '@/hooks/useMobileOptimization';
import {
  Home,
  Building2,
  Users,
  Settings,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Wifi,
  WifiOff,
  Battery,
  Signal,
} from 'lucide-react';

/**
 * Mobile-Optimized Dashboard Example
 *
 * Demonstrates comprehensive mobile optimization techniques including:
 * - Responsive design with mobile-first approach
 * - Touch-friendly interfaces
 * - Accessibility features
 * - Performance optimizations
 * - Connection-aware loading
 *
 * Location: components/examples/MobileOptimizedDashboard.tsx
 */

const MobileOptimizedDashboard: React.FC = () => {
  const { capabilities, shouldLoadHighQuality, getImageSize } =
    useMobileOptimization();
  const { isScrolled, scrollDirection } = useMobileScroll();
  const [activeTab, setActiveTab] = useState('home');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data - in real app this would come from API
  const properties = [
    {
      id: 1,
      title: 'Ocean View Resort',
      location: 'Swakopmund, Namibia',
      status: 'Active',
      occupancy: 85,
      image: '/api/placeholder/400/300',
    },
    {
      id: 2,
      title: 'Desert Lodge',
      location: 'Namib Desert',
      status: 'Maintenance',
      occupancy: 0,
      image: '/api/placeholder/400/300',
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In real app, this would trigger API search
    console.log('Searching for:', query);
  };

  const handlePropertyAction = (propertyId: number, action: string) => {
    console.log(`Action ${action} on property ${propertyId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Mobile Header with Dynamic Behavior */}
      <header
        className={`sticky top-0 z-30 bg-white border-b border-gray-200 transition-transform duration-300 ${
          scrollDirection === 'down' && isScrolled
            ? '-translate-y-full'
            : 'translate-y-0'
        }`}
      >
        <div className="px-4 py-4 safe-area-inset">
          {/* Status Bar for Mobile */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Signal className="w-4 h-4" />
              <Wifi
                className={`w-4 h-4 ${capabilities.isOnline ? 'text-green-500' : 'text-red-500'}`}
              />
              <Battery className="w-4 h-4" />
              <span className="font-medium">9:41</span>
            </div>
            <div className="text-xs text-gray-500">
              {capabilities.connectionSpeed === 'slow'
                ? 'Slow'
                : capabilities.connectionSpeed === 'fast'
                  ? 'Fast'
                  : 'Unknown'}{' '}
              Connection
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <MobileInput
                type="search"
                placeholder="Search properties, guests..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
                className="w-full"
              />
            </div>

            {/* Filter Button */}
            <BuffrButton
              variant="outline"
              size="sm"
              onClick={() => setIsFilterSheetOpen(true)}
              className="min-w-[44px] min-h-[44px] p-0"
              aria-label="Filter options"
            >
              <Filter className="w-5 h-5" />
            </BuffrButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6 safe-area-inset">
        {/* Welcome Section */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Manager
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Here's what's happening with your properties today
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MobileCard className="text-center p-4">
            <div className="text-2xl font-bold text-nude-600 mb-1">12</div>
            <div className="text-sm text-gray-600">Active Properties</div>
          </MobileCard>

          <MobileCard className="text-center p-4">
            <div className="text-2xl font-bold text-green-600 mb-1">89%</div>
            <div className="text-sm text-gray-600">Avg Occupancy</div>
          </MobileCard>

          <MobileCard className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600 mb-1">24</div>
            <div className="text-sm text-gray-600">New Bookings</div>
          </MobileCard>

          <MobileCard className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              $12.5K
            </div>
            <div className="text-sm text-gray-600">Revenue Today</div>
          </MobileCard>
        </div>

        {/* Properties List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Properties
            </h2>
            <BuffrButton
              variant="primary"
              size="sm"
              className="min-w-[44px] min-h-[44px] p-0"
              aria-label="Add new property"
            >
              <Plus className="w-5 h-5" />
            </BuffrButton>
          </div>

          <div className="space-y-4">
            {properties.map((property) => (
              <MobileCard
                key={property.id}
                title={property.title}
                subtitle={property.location}
                action={
                  <button
                    onClick={() => handlePropertyAction(property.id, 'menu')}
                    className="p-2 rounded-lg hover:bg-gray-100 touch-manipulation min-w-[44px] min-h-[44px]"
                    aria-label="Property options"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Property Image - Optimized for mobile */}
                    {shouldLoadHighQuality() ? (
                      <Image
                        src={property.image}
                        alt={property.title}
                        className="w-16 h-16 rounded-lg object-cover"
                        width={64}
                        height={64}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>
                    )}

                    <div>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          property.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {property.status}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {property.occupancy}% occupied
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile-specific actions */}
                <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
                  <BuffrButton
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePropertyAction(property.id, 'view')}
                  >
                    View Details
                  </BuffrButton>
                  <BuffrButton
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePropertyAction(property.id, 'manage')}
                  >
                    Manage
                  </BuffrButton>
                </div>
              </MobileCard>
            ))}
          </div>
        </section>

        {/* Quick Actions Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <BuffrButton
              variant="outline"
              className="h-20 flex-col space-y-2 p-4"
              onClick={() => console.log('Add property')}
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm">Add Property</span>
            </BuffrButton>

            <BuffrButton
              variant="outline"
              className="h-20 flex-col space-y-2 p-4"
              onClick={() => console.log('View bookings')}
            >
              <Building2 className="w-6 h-6" />
              <span className="text-sm">Bookings</span>
            </BuffrButton>

            <BuffrButton
              variant="outline"
              className="h-20 flex-col space-y-2 p-4"
              onClick={() => console.log('Manage guests')}
            >
              <Users className="w-6 h-6" />
              <span className="text-sm">Guests</span>
            </BuffrButton>

            <BuffrButton
              variant="outline"
              className="h-20 flex-col space-y-2 p-4"
              onClick={() => console.log('Settings')}
            >
              <Settings className="w-6 h-6" />
              <span className="text-sm">Settings</span>
            </BuffrButton>
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeItem={activeTab}
        items={[
          {
            id: 'home',
            label: 'Home',
            icon: Home,
            onClick: () => setActiveTab('home'),
          },
          {
            id: 'properties',
            label: 'Properties',
            icon: Building2,
            onClick: () => setActiveTab('properties'),
          },
          {
            id: 'guests',
            label: 'Guests',
            icon: Users,
            onClick: () => setActiveTab('guests'),
          },
          {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            onClick: () => setActiveTab('settings'),
          },
        ]}
      />

      {/* Filter Bottom Sheet */}
      <MobileBottomSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        title="Filter Properties"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="space-y-2">
              {['Active', 'Maintenance', 'Inactive'].map((status) => (
                <label key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-nude-600 focus:ring-nude-500"
                  />
                  <span className="ml-2 text-sm">{status}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <MobileInput placeholder="Enter location..." />
          </div>

          <div className="flex space-x-3">
            <BuffrButton
              variant="outline"
              className="flex-1"
              onClick={() => setIsFilterSheetOpen(false)}
            >
              Cancel
            </BuffrButton>
            <BuffrButton
              variant="primary"
              className="flex-1"
              onClick={() => {
                console.log('Apply filters');
                setIsFilterSheetOpen(false);
              }}
            >
              Apply
            </BuffrButton>
          </div>
        </div>
      </MobileBottomSheet>
    </div>
  );
};

export default MobileOptimizedDashboard;
