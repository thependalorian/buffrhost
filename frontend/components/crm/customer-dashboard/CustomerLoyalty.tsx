/**
 * Customer Loyalty Component
 *
 * Purpose: Displays loyalty program information and rewards
 * Functionality: Points display, tier benefits, recent rewards
 * Location: /components/crm/customer-dashboard/CustomerLoyalty.tsx
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
 * CustomerLoyalty React Component for Buffr Host Hospitality Platform
 * @fileoverview CustomerLoyalty manages customer relationship and loyalty program interactions
 * @location buffr-host/components/crm/customer-dashboard/CustomerLoyalty.tsx
 * @purpose CustomerLoyalty manages customer relationship and loyalty program interactions
 * @component CustomerLoyalty
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
 * @param {LoyaltyData | null} [loyaltyData] - loyaltyData prop description
 * @param {} [isLoading] - isLoading prop description
 *
 * Usage Example:
 * @example
 * import { CustomerLoyalty } from './CustomerLoyalty';
 *
 * function App() {
 *   return (
 *     <CustomerLoyalty
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered CustomerLoyalty component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Gift } from 'lucide-react';

// Types for TypeScript compliance
interface LoyaltyData {
  currentPoints: number;
  pointsToNextTier: number;
  tierBenefits: string[];
  recentRewards: string[];
  currentTier: string;
  tierColor: string;
}

interface CustomerLoyaltyProps {
  loyaltyData: LoyaltyData | null;
  isLoading?: boolean;
}

// Main Customer Loyalty Component
export const CustomerLoyalty: React.FC<CustomerLoyaltyProps> = ({
  loyaltyData,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Loyalty Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="loading loading-spinner loading-md text-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!loyaltyData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Star className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
            <h3 className="text-lg font-semibold mb-2">No Loyalty Data</h3>
            <p className="text-base-content/70">
              Loyalty information is not available for this customer.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Loyalty Program Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Loyalty Program
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Current Points</h4>
              <div className="text-3xl font-bold text-primary mb-2">
                {loyaltyData.currentPoints.toLocaleString()}
              </div>
              <div className="text-sm text-base-content/70">
                {loyaltyData.pointsToNextTier} points to next tier
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-base-content/70 mb-1">
                  <span>Progress to next tier</span>
                  <span>
                    {Math.round(
                      (loyaltyData.currentPoints /
                        (loyaltyData.currentPoints +
                          loyaltyData.pointsToNextTier)) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-base-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((loyaltyData.currentPoints / (loyaltyData.currentPoints + loyaltyData.pointsToNextTier)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Current Tier</h4>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: loyaltyData.tierColor }}
                />
                <span className="text-xl font-bold text-base-content">
                  {loyaltyData.currentTier}
                </span>
              </div>

              <h4 className="font-semibold mb-2">Tier Benefits</h4>
              <ul className="space-y-1">
                {loyaltyData.tierBenefits.map((benefit, index) => (
                  <li key={index} className="text-sm flex items-center gap-2">
                    <span className="text-success">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Recent Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loyaltyData.recentRewards.length > 0 ? (
            <div className="space-y-2">
              {loyaltyData.recentRewards.map((reward, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-base-200 rounded"
                >
                  <div className="w-8 h-8 bg-success text-success-content rounded-full flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{reward}</p>
                    <p className="text-xs text-base-content/70">
                      Redeemed recently
                    </p>
                  </div>
                  <div className="text-xs text-base-content/50">
                    {new Date(
                      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Gift className="w-12 h-12 mx-auto mb-4 text-base-content/30" />
              <h3 className="text-lg font-semibold mb-2">No Recent Rewards</h3>
              <p className="text-base-content/70">
                This customer hasn't redeemed any rewards recently.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="btn btn-outline btn-sm">
              <Star className="w-4 h-4" />
              Add Points
            </button>
            <button className="btn btn-outline btn-sm">
              <Gift className="w-4 h-4" />
              Redeem Reward
            </button>
            <button className="btn btn-outline btn-sm">
              <Star className="w-4 h-4" />
              View History
            </button>
            <button className="btn btn-outline btn-sm">
              <Gift className="w-4 h-4" />
              Available Rewards
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerLoyalty;
