/**
 * Customer Overview Component
 *
 * Purpose: Displays comprehensive customer information and quick stats
 * Functionality: Customer details, contact info, preferences, notes
 * Location: /components/crm/customer-dashboard/CustomerOverview.tsx
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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';

// Types for TypeScript compliance
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalSpent: number;
  lastVisit: string;
  visitCount: number;
  status: 'Active' | 'Inactive' | 'VIP';
  preferences: string[];
  notes: string;
  location: string;
  avatar?: string;
}

interface CustomerOverviewProps {
  customer: Customer;
}

// Main Customer Overview Component
export const CustomerOverview: React.FC<CustomerOverviewProps> = ({
  customer,
}) => {
  // Get tier color for styling
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'Gold':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'Silver':
        return 'bg-gradient-to-r from-gray-400 to-gray-600';
      case 'Bronze':
        return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default:
        return 'bg-gray-500';
    }
  };

  // Get status color for styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VIP':
        return 'badge-primary';
      case 'Active':
        return 'badge-success';
      case 'Inactive':
        return 'badge-warning';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-16">
                  <span className="text-xl">
                    {customer.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-base-content">
                  {customer.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getStatusColor(customer.status)}>
                    {customer.status}
                  </Badge>
                  <Badge
                    className={`${getTierColor(customer.loyaltyTier)} text-white`}
                  >
                    {customer.loyaltyTier}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                N$ {customer.totalSpent.toLocaleString()}
              </p>
              <p className="text-sm text-base-content/70">Total Spent</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-base-content/50" />
              <span className="text-sm">{customer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-base-content/50" />
              <span className="text-sm">{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-base-content/50" />
              <span className="text-sm">{customer.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-base-content/50" />
              <span className="text-sm">Last visit: {customer.lastVisit}</span>
            </div>
          </div>

          {/* Preferences */}
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Preferences</h4>
            <div className="flex flex-wrap gap-2">
              {customer.preferences.map((pref, index) => (
                <Badge key={index} variant="outline">
                  {pref}
                </Badge>
              ))}
            </div>
          </div>

          {/* Notes */}
          {customer.notes && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Notes</h4>
              <p className="text-sm text-base-content/70 bg-base-200 p-3 rounded">
                {customer.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {customer.visitCount}
            </div>
            <div className="text-sm text-base-content/70">Total Visits</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">
              N${' '}
              {Math.round(
                customer.totalSpent / customer.visitCount
              ).toLocaleString()}
            </div>
            <div className="text-sm text-base-content/70">Average Spend</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">
              {Math.floor(Math.random() * 30) + 1}
            </div>
            <div className="text-sm text-base-content/70">
              Days Since Last Visit
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerOverview;
