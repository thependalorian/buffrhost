'use client';
import {
  BuffrIcon,
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrButton,
  BuffrInput,
  BuffrTabs,
  BuffrTabsContent,
  BuffrTabsList,
  BuffrTabsTrigger,
  BuffrBadge,
  BuffrSelect,
} from '@/components/ui';

import React, { useState, useEffect } from 'react';
import { PermissionGuard } from '@/components/features/rbac/PermissionGuard';
import { Permission } from '@/lib/types/rbac';
interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  total_spent: number;
  total_bookings: number;
  last_booking_date?: string;
  is_vip: boolean;
  tags?: string[];
  created_at: string;
  is_active: boolean;
}

interface CustomerAnalytics {
  total_customers: number;
  active_customers: number;
  vip_customers: number;
  new_customers: number;
  returning_customers: number;
  average_spending: number;
  total_revenue: number;
  retention_rate: number;
  churn_rate: number;
  growth_rate: number;
}

/**
 * Customers CRM Page
 * Customer Relationship Management interface
 */
export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [analytics, setAnalytics] = useState<CustomerAnalytics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVip, setFilterVip] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusOptions = [
    { value: 'all', label: 'All Customers' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const vipOptions = [
    { value: 'all', label: 'All Customers' },
    { value: 'vip', label: 'VIP Only' },
    { value: 'regular', label: 'Regular Only' },
  ];

  useEffect(() => {
    fetchCustomers();
    fetchAnalytics();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/customers');
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch customers'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/customers/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch analytics'
      );
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm));

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && customer.is_active) ||
      (filterStatus === 'inactive' && !customer.is_active);

    const matchesVip =
      filterVip === 'all' ||
      (filterVip === 'vip' && customer.is_vip) ||
      (filterVip === 'regular' && !customer.is_vip);

    return matchesSearch && matchesStatus && matchesVip;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-nude-600 to-nude-700 rounded-xl flex items-center justify-center shadow-luxury-soft">
              <BuffrIcon name="users" className="h-6 w-6 text-nude-50" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-nude-900">
                Customer Management
              </h1>
              <p className="text-nude-600 mt-1">
                Manage your customer relationships and loyalty programs
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BuffrButton
            variant="outline"
            className="border-nude-300 text-nude-700 hover:bg-nude-50"
          >
            <BuffrIcon name="download" className="h-4 w-4 mr-2" />
            Export
          </BuffrButton>
          <BuffrButton
            variant="outline"
            className="border-nude-300 text-nude-700 hover:bg-nude-50"
          >
            <BuffrIcon name="upload" className="h-4 w-4 mr-2" />
            Import
          </BuffrButton>
          <BuffrButton className="bg-nude-600 hover:bg-nude-700 text-nude-50 shadow-luxury-soft hover:shadow-luxury-medium">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </BuffrButton>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <BuffrCard className="border-nude-200 shadow-luxury-soft">
            <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <BuffrCardTitle className="text-sm font-medium text-nude-700">
                Total Customers
              </BuffrCardTitle>
              <BuffrIcon name="users" className="h-4 w-4 text-nude-500" />
            </BuffrCardHeader>
            <BuffrCardContent>
              <div className="text-2xl font-bold text-nude-900">
                {analytics.total_customers}
              </div>
              <p className="text-xs text-nude-500">
                {analytics.growth_rate > 0 ? '+' : ''}
                {analytics.growth_rate.toFixed(1)}% from last month
              </p>
            </BuffrCardContent>
          </BuffrCard>

          <BuffrCard className="border-nude-200 shadow-luxury-soft">
            <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <BuffrCardTitle className="text-sm font-medium text-nude-700">
                VIP Customers
              </BuffrCardTitle>
              <BuffrIcon name="star" className="h-4 w-4 text-nude-500" />
            </BuffrCardHeader>
            <BuffrCardContent>
              <div className="text-2xl font-bold text-nude-900">
                {analytics.vip_customers}
              </div>
              <p className="text-xs text-nude-500">
                {(
                  (analytics.vip_customers / analytics.total_customers) *
                  100
                ).toFixed(1)}
                % of total
              </p>
            </BuffrCardContent>
          </BuffrCard>

          <BuffrCard className="border-nude-200 shadow-luxury-soft">
            <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <BuffrCardTitle className="text-sm font-medium text-nude-700">
                Total Revenue
              </BuffrCardTitle>
              <BuffrIcon name="dollar-sign" className="h-4 w-4 text-nude-500" />
            </BuffrCardHeader>
            <BuffrCardContent>
              <div className="text-2xl font-bold text-nude-900">
                {formatCurrency(analytics.total_revenue)}
              </div>
              <p className="text-xs text-nude-500">
                Avg: {formatCurrency(analytics.average_spending)} per customer
              </p>
            </BuffrCardContent>
          </BuffrCard>

          <BuffrCard className="border-nude-200 shadow-luxury-soft">
            <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <BuffrCardTitle className="text-sm font-medium text-nude-700">
                Retention Rate
              </BuffrCardTitle>
              <BuffrIcon name="trending-up" className="h-4 w-4 text-nude-500" />
            </BuffrCardHeader>
            <BuffrCardContent>
              <div className="text-2xl font-bold text-nude-900">
                {analytics.retention_rate.toFixed(1)}%
              </div>
              <p className="text-xs text-nude-500">
                Churn: {analytics.churn_rate.toFixed(1)}%
              </p>
            </BuffrCardContent>
          </BuffrCard>
        </div>
      )}

      {/* Permission Guard */}
      <PermissionGuard
        permission={Permission.CUSTOMERS_READ}
        fallback={
          <BuffrCard>
            <BuffrCardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <BuffrIcon
                  name="users"
                  className="h-12 w-12 text-nude-400 mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-nude-900 mb-2">
                  Access Denied
                </h3>
                <p className="text-nude-600">
                  You don't have permission to access customer data.
                </p>
              </div>
            </BuffrCardContent>
          </BuffrCard>
        }
      >
        <BuffrTabs defaultValue="customers" className="space-y-6">
          <BuffrTabsList>
            <BuffrTabsTrigger value="customers">All Customers</BuffrTabsTrigger>
            <BuffrTabsTrigger value="vip">VIP Customers</BuffrTabsTrigger>
            <BuffrTabsTrigger value="segments">Segments</BuffrTabsTrigger>
            <BuffrTabsTrigger value="analytics">Analytics</BuffrTabsTrigger>
          </BuffrTabsList>

          {/* All Customers Tab */}
          <BuffrTabsContent value="customers" className="space-y-6">
            <BuffrCard>
              <BuffrCardHeader>
                <div className="flex items-center justify-between">
                  <BuffrCardTitle>Customer Database</BuffrCardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <BuffrIcon
                        name="search"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-nude-400"
                      />
                      <Input
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <BuffrSelect
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </BuffrSelect>
                    <BuffrSelect value={filterVip} onValueChange={setFilterVip}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {vipOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </BuffrSelect>
                    <BuffrButton variant="outline" size="sm">
                      <BuffrIcon name="filter" className="h-4 w-4 mr-2" />
                      Filter
                    </BuffrButton>
                  </div>
                </div>
              </BuffrCardHeader>
              <BuffrCardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nude-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCustomers.map((customer) => (
                      <BuffrCard
                        key={customer.id}
                        className="hover:shadow-luxury-strong transition-shadow duration-300"
                      >
                        <BuffrCardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-nude-100 rounded-full flex items-center justify-center">
                                <BuffrIcon
                                  name="users"
                                  className="h-6 w-6 text-nude-600"
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-nude-900">
                                    {customer.full_name}
                                  </h3>
                                  {customer.is_vip && (
                                    <BuffrBadge className="bg-yellow-100 text-yellow-800">
                                      <BuffrIcon
                                        name="star"
                                        className="h-3 w-3 mr-1"
                                      />
                                      VIP
                                    </BuffrBadge>
                                  )}
                                  <BuffrBadge
                                    variant={
                                      customer.is_active
                                        ? 'default'
                                        : 'secondary'
                                    }
                                  >
                                    {customer.is_active ? 'Active' : 'Inactive'}
                                  </BuffrBadge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-nude-600">
                                  <div className="flex items-center gap-1">
                                    <BuffrIcon
                                      name="mail"
                                      className="h-4 w-4"
                                    />
                                    {customer.email}
                                  </div>
                                  {customer.phone && (
                                    <div className="flex items-center gap-1">
                                      <BuffrIcon
                                        name="phone"
                                        className="h-4 w-4"
                                      />
                                      {customer.phone}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <div className="text-sm font-medium text-nude-900">
                                  {formatCurrency(customer.total_spent)}
                                </div>
                                <div className="text-xs text-nude-600">
                                  {customer.total_bookings} bookings
                                </div>
                              </div>

                              {customer.last_booking_date && (
                                <div className="text-right">
                                  <div className="text-sm text-nude-600">
                                    Last booking
                                  </div>
                                  <div className="text-xs text-nude-500">
                                    {formatDate(customer.last_booking_date)}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-1">
                                <BuffrButton variant="outline" size="sm">
                                  <BuffrIcon name="eye" className="h-4 w-4" />
                                </BuffrButton>
                                <BuffrButton variant="outline" size="sm">
                                  <BuffrIcon name="edit" className="h-4 w-4" />
                                </BuffrButton>
                                <BuffrButton variant="outline" size="sm">
                                  <BuffrIcon
                                    name="message-square"
                                    className="h-4 w-4"
                                  />
                                </BuffrButton>
                                <BuffrButton variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </BuffrButton>
                              </div>
                            </div>
                          </div>

                          {customer.tags && customer.tags.length > 0 && (
                            <div className="flex items-center gap-2 mt-4">
                              <Tag className="h-4 w-4 text-nude-500" />
                              <div className="flex gap-1">
                                {customer.tags.map((tag, index) => (
                                  <BuffrBadge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </BuffrBadge>
                                ))}
                              </div>
                            </div>
                          )}
                        </BuffrCardContent>
                      </BuffrCard>
                    ))}
                  </div>
                )}
              </BuffrCardContent>
            </BuffrCard>
          </BuffrTabsContent>

          {/* VIP Customers Tab */}
          <BuffrTabsContent value="vip" className="space-y-6">
            <BuffrCard>
              <BuffrCardHeader>
                <BuffrCardTitle>VIP Customer Program</BuffrCardTitle>
              </BuffrCardHeader>
              <BuffrCardContent>
                <div className="text-center py-8">
                  <BuffrIcon
                    name="star"
                    className="h-12 w-12 text-semantic-warning mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-nude-900 mb-2">
                    VIP Customer Management
                  </h3>
                  <p className="text-nude-600 mb-4">
                    Manage your VIP customers and loyalty programs
                  </p>
                  <BuffrButton>
                    <BuffrIcon name="star" className="h-4 w-4 mr-2" />
                    Manage VIP Program
                  </BuffrButton>
                </div>
              </BuffrCardContent>
            </BuffrCard>
          </BuffrTabsContent>

          {/* Customer Segments Tab */}
          <BuffrTabsContent value="segments" className="space-y-6">
            <BuffrCard>
              <BuffrCardHeader>
                <BuffrCardTitle>Customer Segments</BuffrCardTitle>
              </BuffrCardHeader>
              <BuffrCardContent>
                <div className="text-center py-8">
                  <BuffrIcon
                    name="users"
                    className="h-12 w-12 text-nude-400 mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-nude-900 mb-2">
                    Customer Segmentation
                  </h3>
                  <p className="text-nude-600 mb-4">
                    Create and manage customer segments for targeted marketing
                  </p>
                  <BuffrButton>
                    <BuffrIcon name="users" className="h-4 w-4 mr-2" />
                    Create Segment
                  </BuffrButton>
                </div>
              </BuffrCardContent>
            </BuffrCard>
          </BuffrTabsContent>

          {/* Analytics Tab */}
          <BuffrTabsContent value="analytics" className="space-y-6">
            <BuffrCard>
              <BuffrCardHeader>
                <BuffrCardTitle>Customer Analytics</BuffrCardTitle>
              </BuffrCardHeader>
              <BuffrCardContent>
                <div className="text-center py-8">
                  <BuffrIcon
                    name="trending-up"
                    className="h-12 w-12 text-nude-400 mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-nude-900 mb-2">
                    Advanced Analytics
                  </h3>
                  <p className="text-nude-600 mb-4">
                    Deep insights into customer behavior and trends
                  </p>
                  <BuffrButton>
                    <BuffrIcon name="trending-up" className="h-4 w-4 mr-2" />
                    View Analytics
                  </BuffrButton>
                </div>
              </BuffrCardContent>
            </BuffrCard>
          </BuffrTabsContent>
        </BuffrTabs>
      </PermissionGuard>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
