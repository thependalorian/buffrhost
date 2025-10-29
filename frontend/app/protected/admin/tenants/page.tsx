'use client';

import {
  BuffrIcon,
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrButton,
  BuffrInput,
  BuffrLabel,
  BuffrBadge,
  BuffrAlert,
  BuffrTable,
} from '@/components/ui';

import React, { useState, useEffect, useCallback } from 'react';
import { PermissionGuard } from '@/components/features/rbac/PermissionGuard';
import { Permission } from '@/lib/types/rbac';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: string;
  created_at: string;
  updated_at: string;
  user_count: number;
  property_count: number;
  subscription_status: 'active' | 'trial' | 'expired' | 'cancelled';
  last_activity: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

interface TenantStats {
  total_tenants: number;
  active_tenants: number;
  trial_tenants: number;
  total_users: number;
  total_properties: number;
  total_revenue: number;
  monthly_revenue: number;
}

interface Filters {
  search: string;
  status: string;
  plan: string;
  subscription: string;
}

/**
 * Tenant Management Page
 * Multi-tenant system management and monitoring
 */
export default function TenantManagementPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [stats, setStats] = useState<TenantStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: '',
    plan: '',
    subscription: '',
  });

  useEffect(() => {
    loadTenants();
    loadStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tenants, filters]);

  const loadTenants = async () => {
    try {
      setIsLoading(true);
      const [tenantsResponse, statsResponse] = await Promise.all([
        fetch('/api/admin/tenants'),
        fetch('/api/admin/tenants/stats'),
      ]);

      if (!tenantsResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch tenant data');
      }

      const tenantsData = await tenantsResponse.json();
      const statsData = await statsResponse.json();

      setTenants(tenantsData.tenants || []);
      setStats(statsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load tenant data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/tenants/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading tenant stats:', error);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...tenants];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (tenant) =>
          tenant.name.toLowerCase().includes(searchLower) ||
          tenant.domain.toLowerCase().includes(searchLower) ||
          tenant.owner.name.toLowerCase().includes(searchLower) ||
          tenant.owner.email.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      filtered = filtered.filter((tenant) => tenant.status === filters.status);
    }

    if (filters.plan) {
      filtered = filtered.filter((tenant) => tenant.plan === filters.plan);
    }

    if (filters.subscription) {
      filtered = filtered.filter(
        (tenant) => tenant.subscription_status === filters.subscription
      );
    }

    setFilteredTenants(filtered);
  }, [tenants, filters]);

  const handleTenantAction = async (tenantId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/${action}`, {
        method: 'POST',
      });

      if (response.ok) {
        loadTenants();
        loadStats();
      }
    } catch (error) {
      console.error(`Error ${action} tenant:`, error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-nude-100 text-nude-800';
    }
  };

  const getSubscriptionColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-nude-100 text-nude-800';
      default:
        return 'bg-nude-100 text-nude-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-nude-900">
            Tenant Management
          </h1>
          <p className="text-nude-600 mt-1">
            Manage multi-tenant system and monitor usage
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BuffrButton
            onClick={loadTenants}
            disabled={isLoading}
            className="px-4 py-2 bg-nude-600 text-white rounded-lg hover:bg-nude-700 transition-colors disabled:opacity-50"
          >
            <BuffrIcon
              name="refresh-cw"
              className={`h-4 w-4 mr-2 inline ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </BuffrButton>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <BuffrAlert className="bg-red-50 border-red-200 text-red-800">
          <BuffrIcon name="alert-circle" className="h-4 w-4" />
          {error}
        </BuffrAlert>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <BuffrCard>
            <BuffrCardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BuffrIcon name="users" className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-nude-600">
                    Total Tenants
                  </p>
                  <p className="text-2xl font-bold text-nude-900">
                    {stats.total_tenants}
                  </p>
                  <p className="text-xs text-nude-500">
                    {stats.active_tenants} active
                  </p>
                </div>
              </div>
            </BuffrCardBody>
          </BuffrCard>

          <BuffrCard>
            <BuffrCardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BuffrIcon
                    name="user-check"
                    className="h-6 w-6 text-green-600"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-nude-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-nude-900">
                    {stats.total_users}
                  </p>
                  <p className="text-xs text-nude-500">Across all tenants</p>
                </div>
              </div>
            </BuffrCardBody>
          </BuffrCard>

          <BuffrCard>
            <BuffrCardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BuffrIcon
                    name="building"
                    className="h-6 w-6 text-purple-600"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-nude-600">
                    Properties
                  </p>
                  <p className="text-2xl font-bold text-nude-900">
                    {stats.total_properties}
                  </p>
                  <p className="text-xs text-nude-500">Total properties</p>
                </div>
              </div>
            </BuffrCardBody>
          </BuffrCard>

          <BuffrCard>
            <BuffrCardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BuffrIcon
                    name="dollar-sign"
                    className="h-6 w-6 text-orange-600"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-nude-600">
                    Monthly Revenue
                  </p>
                  <p className="text-2xl font-bold text-nude-900">
                    {formatCurrency(stats.monthly_revenue)}
                  </p>
                  <p className="text-xs text-nude-500">This month</p>
                </div>
              </div>
            </BuffrCardBody>
          </BuffrCard>
        </div>
      )}

      {/* Filters */}
      <BuffrCard>
        <BuffrCardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <BuffrLabel htmlFor="search">Search</BuffrLabel>
              <BuffrInput
                id="search"
                type="text"
                placeholder="Search tenants..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <BuffrLabel htmlFor="status">Status</BuffrLabel>
              <select
                id="status"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <BuffrLabel htmlFor="plan">Plan</BuffrLabel>
              <select
                id="plan"
                value={filters.plan}
                onChange={(e) =>
                  setFilters({ ...filters, plan: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-500 focus:border-transparent"
              >
                <option value="">All Plans</option>
                <option value="basic">Basic</option>
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <BuffrLabel htmlFor="subscription">Subscription</BuffrLabel>
              <select
                id="subscription"
                value={filters.subscription}
                onChange={(e) =>
                  setFilters({ ...filters, subscription: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-500 focus:border-transparent"
              >
                <option value="">All Subscriptions</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </BuffrCardBody>
      </BuffrCard>

      {/* Tenants Table */}
      <BuffrCard>
        <BuffrCardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-nude-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nude-200">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-nude-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-nude-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-nude-600 font-medium text-sm">
                            {tenant.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-nude-900">
                            {tenant.name}
                          </p>
                          <p className="text-sm text-nude-500">
                            {tenant.domain}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-nude-900">
                          {tenant.owner.name}
                        </p>
                        <p className="text-sm text-nude-500">
                          {tenant.owner.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <BuffrBadge
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}
                        >
                          {tenant.status}
                        </BuffrBadge>
                        <BuffrBadge
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionColor(tenant.subscription_status)}`}
                        >
                          {tenant.subscription_status}
                        </BuffrBadge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-nude-900 capitalize">
                        {tenant.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-nude-900">
                        <p>{tenant.user_count} users</p>
                        <p>{tenant.property_count} properties</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-nude-500">
                      {formatDate(tenant.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleTenantAction(tenant.id, 'suspend')
                          }
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          Suspend
                        </button>
                        <button
                          onClick={() =>
                            handleTenantAction(tenant.id, 'activate')
                          }
                          className="text-green-600 hover:text-green-800"
                        >
                          Activate
                        </button>
                        <button
                          onClick={() =>
                            handleTenantAction(tenant.id, 'delete')
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BuffrCardBody>
      </BuffrCard>

      {/* Empty State */}
      {filteredTenants.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <BuffrIcon
            name="users"
            className="h-12 w-12 text-nude-400 mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-nude-900 mb-2">
            No tenants found
          </h3>
          <p className="text-nude-600 mb-4">
            No tenants match your current filters
          </p>
          <BuffrButton
            onClick={() =>
              setFilters({ search: '', status: '', plan: '', subscription: '' })
            }
            className="px-4 py-2 bg-nude-600 text-white rounded-lg hover:bg-nude-700 transition-colors"
          >
            Clear Filters
          </BuffrButton>
        </div>
      )}
    </div>
  );
}
