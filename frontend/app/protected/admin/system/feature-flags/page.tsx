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
  BuffrToggle,
} from '@/components/ui';

import React, { useState, useEffect, useCallback } from 'react';
import { PermissionGuard } from '@/components/features/rbac/PermissionGuard';
import { Permission } from '@/lib/types/rbac';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  tenant_id?: string;
  tenant_name?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  rollout_percentage: number;
  target_users?: string[];
  conditions?: Record<string, any>;
  tags: string[];
  environment: 'development' | 'staging' | 'production';
  type: 'boolean' | 'string' | 'number' | 'json';
  default_value: unknown;
  current_value: unknown;
}

interface FeatureFlagForm {
  name: string;
  description: string;
  enabled: boolean;
  tenant_id: string;
  rollout_percentage: number;
  target_users: string[];
  conditions: Record<string, any>;
  tags: string[];
  environment: 'development' | 'staging' | 'production';
  type: 'boolean' | 'string' | 'number' | 'json';
  default_value: unknown;
  current_value: unknown;
}

interface Filters {
  search: string;
  environment: string;
  tenant: string;
  enabled: string;
  tags: string;
}

/**
 * Feature Flag Management Page
 * System-wide feature flag control and management
 */
export default function FeatureFlagPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [filteredFlags, setFilteredFlags] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const [formData, setFormData] = useState<FeatureFlagForm>({
    name: '',
    description: '',
    enabled: false,
    tenant_id: '',
    rollout_percentage: 100,
    target_users: [],
    conditions: {},
    tags: [],
    environment: 'development',
    type: 'boolean',
    default_value: false,
    current_value: false,
  });
  const [filters, setFilters] = useState<Filters>({
    search: '',
    environment: '',
    tenant: '',
    enabled: '',
    tags: '',
  });

  useEffect(() => {
    loadFlags();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [flags, filters]);

  const loadFlags = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/feature-flags');
      const data = await response.json();

      if (data.success) {
        setFlags(data.flags);
      }
    } catch (error) {
      console.error('Error loading feature flags:', error);
      setError('Failed to load feature flags');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...flags];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (flag) =>
          flag.name.toLowerCase().includes(searchLower) ||
          flag.description.toLowerCase().includes(searchLower) ||
          flag.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.environment) {
      filtered = filtered.filter(
        (flag) => flag.environment === filters.environment
      );
    }

    if (filters.tenant) {
      filtered = filtered.filter((flag) => flag.tenant_id === filters.tenant);
    }

    if (filters.enabled) {
      filtered = filtered.filter(
        (flag) => flag.enabled === (filters.enabled === 'enabled')
      );
    }

    if (filters.tags) {
      filtered = filtered.filter((flag) => flag.tags.includes(filters.tags));
    }

    setFilteredFlags(filtered);
  }, [flags, filters]);

  const handleCreateFlag = async () => {
    try {
      const response = await fetch('/api/admin/feature-flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        loadFlags();
        setShowForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating feature flag:', error);
    }
  };

  const handleUpdateFlag = async (
    id: string,
    updates: Partial<FeatureFlag>
  ) => {
    try {
      const response = await fetch(`/api/admin/feature-flags/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        loadFlags();
      }
    } catch (error) {
      console.error('Error updating feature flag:', error);
    }
  };

  const handleDeleteFlag = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/feature-flags/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadFlags();
      }
    } catch (error) {
      console.error('Error deleting feature flag:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      enabled: false,
      tenant_id: '',
      rollout_percentage: 100,
      target_users: [],
      conditions: {},
      tags: [],
      environment: 'development',
      type: 'boolean',
      default_value: false,
      current_value: false,
    });
    setEditingFlag(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'boolean':
        return <BuffrIcon name="toggle-left" className="h-4 w-4" />;
      case 'string':
        return <BuffrIcon name="target" className="h-4 w-4" />;
      case 'number':
        return <BuffrIcon name="zap" className="h-4 w-4" />;
      case 'json':
        return <BuffrIcon name="settings" className="h-4 w-4" />;
      default:
        return <BuffrIcon name="settings" className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-nude-900">Feature Flags</h1>
          <p className="text-nude-600 mt-1">
            Manage system-wide feature flags and toggles
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BuffrButton
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-nude-600 text-white rounded-lg hover:bg-nude-700 transition-colors"
          >
            <BuffrIcon name="plus" className="h-4 w-4 mr-2 inline" />
            Create Flag
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

      {/* Filters */}
      <BuffrCard>
        <BuffrCardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <BuffrLabel htmlFor="search">Search</BuffrLabel>
              <BuffrInput
                id="search"
                type="text"
                placeholder="Search flags..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <BuffrLabel htmlFor="environment">Environment</BuffrLabel>
              <select
                id="environment"
                value={filters.environment}
                onChange={(e) =>
                  setFilters({ ...filters, environment: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-500 focus:border-transparent"
              >
                <option value="">All Environments</option>
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>
            <div>
              <BuffrLabel htmlFor="enabled">Status</BuffrLabel>
              <select
                id="enabled"
                value={filters.enabled}
                onChange={(e) =>
                  setFilters({ ...filters, enabled: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div>
              <BuffrLabel htmlFor="tenant">Tenant</BuffrLabel>
              <select
                id="tenant"
                value={filters.tenant}
                onChange={(e) =>
                  setFilters({ ...filters, tenant: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-500 focus:border-transparent"
              >
                <option value="">All Tenants</option>
                {/* Add tenant options here */}
              </select>
            </div>
            <div>
              <BuffrLabel htmlFor="tags">Tags</BuffrLabel>
              <select
                id="tags"
                value={filters.tags}
                onChange={(e) =>
                  setFilters({ ...filters, tags: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-500 focus:border-transparent"
              >
                <option value="">All Tags</option>
                {/* Add tag options here */}
              </select>
            </div>
          </div>
        </BuffrCardBody>
      </BuffrCard>

      {/* Feature Flags Table */}
      <BuffrCard>
        <BuffrCardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-nude-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Flag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Environment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Rollout
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
                {filteredFlags.map((flag) => (
                  <tr key={flag.id} className="hover:bg-nude-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-nude-900">
                          {flag.name}
                        </p>
                        <p className="text-sm text-nude-500">
                          {flag.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {flag.tags.map((tag, index) => (
                            <BuffrBadge
                              key={index}
                              className="text-xs bg-nude-100 text-nude-600"
                            >
                              {tag}
                            </BuffrBadge>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(flag.type)}
                        <span className="ml-2 text-sm text-nude-900">
                          {flag.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <BuffrBadge className="bg-blue-100 text-blue-800">
                        {flag.environment}
                      </BuffrBadge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <BuffrToggle
                        checked={flag.enabled}
                        onChange={(checked) =>
                          handleUpdateFlag(flag.id, { enabled: checked })
                        }
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-nude-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-nude-600 h-2 rounded-full"
                            style={{ width: `${flag.rollout_percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-nude-600">
                          {flag.rollout_percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-nude-500">
                      {formatDate(flag.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingFlag(flag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFlag(flag.id)}
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
      {filteredFlags.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <BuffrIcon
            name="flag"
            className="h-12 w-12 text-nude-400 mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-nude-900 mb-2">
            No feature flags found
          </h3>
          <p className="text-nude-600 mb-4">
            Create your first feature flag to get started
          </p>
          <BuffrButton
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-nude-600 text-white rounded-lg hover:bg-nude-700 transition-colors"
          >
            <BuffrIcon name="plus" className="h-4 w-4 mr-2 inline" />
            Create Flag
          </BuffrButton>
        </div>
      )}
    </div>
  );
}
