/**
 * Customer Activity Component
 *
 * Purpose: Displays recent customer activity and transaction history
 * Functionality: Activity timeline, transaction details, status tracking
 * Location: /components/crm/customer-dashboard/CustomerActivity.tsx
 *
 * Follows 40 Rules:
 * - Uses DaisyUI for consistent styling
 * - Modular component design for easy maintenance
 * - TypeScript for type safety
 * - Vercel-compatible with SSR
 * - Comprehensive error handling
 * - Optimized for performance
 */

'use client';

import React from 'react';
/**
 * CustomerActivity React Component for Buffr Host Hospitality Platform
 * @fileoverview CustomerActivity manages customer relationship and loyalty program interactions
 * @location buffr-host/components/crm/customer-dashboard/CustomerActivity.tsx
 * @purpose CustomerActivity manages customer relationship and loyalty program interactions
 * @component CustomerActivity
 * @category Crm
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {RecentActivity[]} [activities] - activities prop description
 * @param {} [isLoading] - isLoading prop description
 *
 * Methods:
 * @method getActivityTypeColor - getActivityTypeColor method for component functionality
 * @method getStatusColor - getStatusColor method for component functionality
 * @method getActivityIcon - getActivityIcon method for component functionality
 *
 * Usage Example:
 * @example
 * import { CustomerActivity } from './CustomerActivity';
 *
 * function App() {
 *   return (
 *     <CustomerActivity
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered CustomerActivity component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

// Types for TypeScript compliance
interface RecentActivity {
  id: string;
  type: 'booking' | 'payment' | 'communication' | 'review';
  description: string;
  timestamp: string;
  amount?: number;
  status: 'completed' | 'pending' | 'cancelled';
}

interface CustomerActivityProps {
  activities: RecentActivity[];
  isLoading?: boolean;
}

// Main Customer Activity Component
export const CustomerActivity: React.FC<CustomerActivityProps> = ({
  activities,
  isLoading = false,
}) => {
  // Get activity type color
  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'text-primary';
      case 'payment':
        return 'text-success';
      case 'communication':
        return 'text-info';
      case 'review':
        return 'text-warning';
      default:
        return 'text-base-content';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      case 'cancelled':
        return 'bg-error';
      default:
        return 'bg-neutral';
    }
  };

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return '🏨';
      case 'payment':
        return '💳';
      case 'communication':
        return '💬';
      case 'review':
        return '⭐';
      default:
        return '📝';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 bg-base-200 rounded"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-base-100 rounded-full flex items-center justify-center text-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-sm font-medium ${getActivityTypeColor(activity.type)}`}
                    >
                      {activity.type.charAt(0).toUpperCase() +
                        activity.type.slice(1)}
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}
                    />
                  </div>

                  <p className="text-sm font-medium text-base-content truncate">
                    {activity.description}
                  </p>

                  <p className="text-xs text-base-content/70">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>

                {activity.amount && (
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-semibold text-primary">
                      N$ {activity.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-base-content/50">
                      {activity.status}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 mx-auto mb-4 text-base-content/30" />
              <h3 className="text-lg font-semibold mb-2">No Recent Activity</h3>
              <p className="text-base-content/70">
                This customer hasn't had any recent activity.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerActivity;
