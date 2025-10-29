'use client';

/**
 * Pricing Override Management Page
 * Manual pricing override controls and management
 */

import { useState, useEffect } from 'react';
import {
  BuffrCard,
  BuffrCardBody,
  BuffrButton,
  BuffrBadge,
  BuffrIcon,
} from '@/components/ui';

interface PricingOverride {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyType: string;
  serviceName: string;
  originalPrice: number;
  overridePrice: number;
  status: 'active' | 'inactive' | 'expired';
  validUntil: string;
  reason: string;
  createdBy: string;
  createdAt: string;
}

export default function PricingOverridePage() {
  const [overrides, setOverrides] = useState<PricingOverride[]>([]);
  const [filteredOverrides, setFilteredOverrides] = useState<PricingOverride[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOverride] = useState<PricingOverride | null>(null);
  const [filters, setFilters] = useState({
    property: '',
    status: '',
    search: '',
  });

  useEffect(() => {
    loadOverrides();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [overrides, filters]);

  const loadOverrides = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/pricing-overrides');
      const data = await response.json();

      if (data.success) {
        setOverrides(data.data);
      }
    } catch (error) {
      console.error('Error loading overrides:', error);
      setError('Failed to load pricing overrides');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...overrides];

    if (filters.property) {
      filtered = filtered.filter(
        (override) => override.propertyId === filters.property
      );
    }

    if (filters.status) {
      filtered = filtered.filter(
        (override) => override.status === filters.status
      );
    }

    if (filters.search) {
      filtered = filtered.filter(
        (override) =>
          override.propertyName
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          override.serviceName
            .toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }

    setFilteredOverrides(filtered);
  };

  const handleEdit = (override: PricingOverride) => {
    // Handle edit logic
    console.log('Edit override:', override);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/pricing-overrides/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadOverrides();
      }
    } catch (error) {
      console.error('Error deleting override:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-nude-100 text-nude-800';
      case 'revoked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-nude-100 text-nude-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <BuffrIcon
            name="check-circle"
            className="h-4 w-4 text-semantic-success"
          />
        );
      case 'expired':
        return <BuffrIcon name="clock" className="h-4 w-4 text-nude-600" />;
      case 'revoked':
        return (
          <BuffrIcon name="x-circle" className="h-4 w-4 text-semantic-error" />
        );
      default:
        return <BuffrIcon name="clock" className="h-4 w-4 text-nude-600" />;
    }
  };

  const getModifierIcon = (modifier: number) => {
    if (modifier > 0)
      return (
        <BuffrIcon name="trending-up" className="h-4 w-4 text-semantic-error" />
      );
    if (modifier < 0)
      return (
        <BuffrIcon
          name="trending-down"
          className="h-4 w-4 text-semantic-success"
        />
      );
    return <BuffrIcon name="target" className="h-4 w-4 text-nude-600" />;
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-nude-900">
            Pricing Overrides
          </h1>
          <p className="text-nude-600 mt-1">
            Manage manual pricing overrides for properties
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BuffrButton
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-nude-600 text-white rounded-lg hover:bg-nude-700 transition-colors"
          >
            <BuffrIcon name="plus" className="h-4 w-4 mr-2 inline" />
            Add Override
          </BuffrButton>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <BuffrIcon
              name="alert-circle"
              className="h-5 w-5 text-red-500 mr-2"
            />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <BuffrCard>
        <BuffrCardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-nude-700 mb-2">
                Property
              </label>
              <select
                value={filters.property}
                onChange={(e) =>
                  setFilters({ ...filters, property: e.target.value })
                }
                className="w-full px-3 py-2 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-500 focus:border-transparent"
              >
                <option value="">All Properties</option>
                {/* Add property options here */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-nude-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-nude-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search overrides..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full px-3 py-2 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-500 focus:border-transparent"
              />
            </div>
          </div>
        </BuffrCardBody>
      </BuffrCard>

      {/* Overrides Table */}
      <BuffrCard>
        <BuffrCardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-nude-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Original Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Override Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Valid Until
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nude-200">
                {filteredOverrides.map((override) => (
                  <tr key={override.id} className="hover:bg-nude-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-nude-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-nude-600 font-medium text-sm">
                            {override.propertyName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-nude-900">
                            {override.propertyName}
                          </p>
                          <p className="text-sm text-nude-500">
                            {override.propertyType}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-nude-900">
                        {override.serviceName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-nude-900">
                        {formatCurrency(override.originalPrice)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-nude-900">
                        {formatCurrency(override.overridePrice)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <BuffrBadge
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(override.status)}`}
                      >
                        {override.status}
                      </BuffrBadge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-nude-900">
                        {formatDate(override.validUntil)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(override)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(override.id)}
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
      {filteredOverrides.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <BuffrIcon
            name="file-text"
            className="h-12 w-12 text-nude-400 mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-nude-900 mb-2">
            No overrides found
          </h3>
          <p className="text-nude-600 mb-4">
            Create your first pricing override to get started
          </p>
          <BuffrButton
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-nude-600 text-white rounded-lg hover:bg-nude-700 transition-colors"
          >
            <BuffrIcon name="plus" className="h-4 w-4 mr-2 inline" />
            Add Override
          </BuffrButton>
        </div>
      )}
    </div>
  );
}
