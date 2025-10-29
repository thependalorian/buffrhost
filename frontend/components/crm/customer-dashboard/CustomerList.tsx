/**
 * Customer List Component
 *
 * Purpose: Displays a searchable and filterable list of customers
 * Functionality: Search, filter by tier, customer selection
 * Location: /components/crm/customer-dashboard/CustomerList.tsx
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

import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui';
import { Users, Search, Filter } from 'lucide-react';

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

interface CustomerListProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onCustomerSelect: (customer: Customer) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterTier: string;
  onFilterTierChange: (tier: string) => void;
  isLoading?: boolean;
}

// Main Customer List Component
export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  selectedCustomer,
  onCustomerSelect,
  searchTerm,
  onSearchChange,
  filterTier,
  onFilterTierChange,
  isLoading = false,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter customers based on search and tier
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier =
      filterTier === 'all' ||
      customer.loyaltyTier.toLowerCase() === filterTier.toLowerCase();
    return matchesSearch && matchesTier;
  });

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

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="p-8 text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Customers ({filteredCustomers.length})
        </CardTitle>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search customers..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <select
            className="select select-bordered w-full"
            value={filterTier}
            onChange={(e) => onFilterTierChange(e.target.value)}
          >
            <option value="all">All Tiers</option>
            <option value="platinum">Platinum</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className={`p-4 border-b border-base-300 cursor-pointer hover:bg-base-200 transition-colors ${
                selectedCustomer?.id === customer.id
                  ? 'bg-primary/10 border-l-4 border-l-primary'
                  : ''
              }`}
              onClick={() => onCustomerSelect(customer)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-base-content">
                  {customer.name}
                </h3>
                <Badge className={getStatusColor(customer.status)}>
                  {customer.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Badge
                  className={`${getTierColor(customer.loyaltyTier)} text-white`}
                >
                  {customer.loyaltyTier}
                </Badge>
                <span className="text-sm text-base-content/70">
                  {customer.visitCount} visits
                </span>
              </div>

              <p className="text-sm text-base-content/70 truncate">
                {customer.email}
              </p>
              <p className="text-sm font-medium text-primary">
                N$ {customer.totalSpent.toLocaleString()}
              </p>
            </div>
          ))}

          {filteredCustomers.length === 0 && (
            <div className="p-8 text-center text-base-content/50">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No customers found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerList;
