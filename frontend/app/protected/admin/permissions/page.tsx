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
  BuffrTabs,
  BuffrTabsContent,
  BuffrTabsList,
  BuffrTabsTrigger,
  BuffrBadge,
  BuffrAlert,
  BuffrCheckbox,
} from '@/components/ui';

import React, { useState, useEffect } from 'react';
import { PermissionGuard } from '@/components/features/rbac/PermissionGuard';
import { Permission } from '@/lib/types/rbac';

interface PermissionAudit {
  id: string;
  user_id: string;
  user_name: string;
  permission: Permission;
  granted: boolean;
  source: string;
  granted_at: string;
  granted_by: string;
}

interface PermissionStats {
  total_permissions: number;
  active_permissions: number;
  recent_grants: number;
  recent_revokes: number;
}

/**
 * Admin Permissions Page
 * Permission management and audit interface
 */
export default function AdminPermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [auditLog, setAuditLog] = useState<PermissionAudit[]>([]);
  const [stats, setStats] = useState<PermissionStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  // Permission categories
  const permissionCategories = [
    {
      name: 'User Management',
      permissions: [
        'users:read',
        'users:write',
        'users:delete',
        'users:manage',
      ],
    },
    {
      name: 'Property Management',
      permissions: [
        'properties:read',
        'properties:write',
        'properties:delete',
        'properties:manage',
      ],
    },
    {
      name: 'Booking Management',
      permissions: [
        'bookings:read',
        'bookings:write',
        'bookings:delete',
        'bookings:manage',
      ],
    },
    {
      name: 'Customer Management',
      permissions: [
        'customers:read',
        'customers:write',
        'customers:delete',
        'customers:manage',
      ],
    },
    {
      name: 'Analytics & Reports',
      permissions: [
        'analytics:read',
        'analytics:write',
        'analytics:manage',
        'reports:read',
        'reports:write',
        'reports:manage',
      ],
    },
    {
      name: 'System Management',
      permissions: [
        'settings:read',
        'settings:write',
        'settings:manage',
        'roles:read',
        'roles:write',
        'roles:manage',
      ],
    },
    {
      name: 'Content Management',
      permissions: ['cms:read', 'cms:write', 'cms:delete', 'cms:manage'],
    },
    {
      name: 'Financial Management',
      permissions: [
        'financial:read',
        'financial:write',
        'financial:delete',
        'financial:manage',
      ],
    },
    {
      name: 'Staff Management',
      permissions: [
        'staff:read',
        'staff:write',
        'staff:delete',
        'staff:manage',
      ],
    },
    {
      name: 'Menu & Orders',
      permissions: [
        'menu:read',
        'menu:write',
        'menu:delete',
        'menu:manage',
        'orders:read',
        'orders:write',
        'orders:delete',
        'orders:manage',
      ],
    },
    {
      name: 'Payment Management',
      permissions: [
        'payments:read',
        'payments:write',
        'payments:delete',
        'payments:manage',
      ],
    },
    {
      name: 'Loyalty Program',
      permissions: [
        'loyalty:read',
        'loyalty:write',
        'loyalty:delete',
        'loyalty:manage',
      ],
    },
    {
      name: 'Inventory Management',
      permissions: [
        'inventory:read',
        'inventory:write',
        'inventory:delete',
        'inventory:manage',
      ],
    },
    {
      name: 'Marketing & Communications',
      permissions: [
        'marketing:read',
        'marketing:write',
        'marketing:manage',
        'communications:read',
        'communications:write',
        'communications:manage',
      ],
    },
    {
      name: 'Integration Management',
      permissions: [
        'integrations:read',
        'integrations:write',
        'integrations:manage',
      ],
    },
    {
      name: 'Security & Compliance',
      permissions: [
        'security:read',
        'security:write',
        'security:manage',
        'compliance:read',
        'compliance:write',
        'compliance:manage',
      ],
    },
  ];

  useEffect(() => {
    loadPermissions();
    loadAuditLog();
    loadStats();
  }, []);

  const loadPermissions = async () => {
    try {
      const response = await fetch('/api/admin/permissions');
      const data = await response.json();
      if (data.success) {
        setPermissions(data.permissions);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
      setError('Failed to load permissions');
    }
  };

  const loadAuditLog = async () => {
    try {
      const response = await fetch('/api/admin/permissions/audit');
      const data = await response.json();
      if (data.success) {
        setAuditLog(data.auditLog);
      }
    } catch (error) {
      console.error('Error loading audit log:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/permissions/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleGrantPermission = async (
    userId: string,
    permission: Permission
  ) => {
    try {
      const response = await fetch('/api/admin/permissions/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, permission }),
      });

      if (response.ok) {
        loadPermissions();
        loadAuditLog();
        loadStats();
      }
    } catch (error) {
      console.error('Error granting permission:', error);
    }
  };

  const handleRevokePermission = async (
    userId: string,
    permission: Permission
  ) => {
    try {
      const response = await fetch('/api/admin/permissions/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, permission }),
      });

      if (response.ok) {
        loadPermissions();
        loadAuditLog();
        loadStats();
      }
    } catch (error) {
      console.error('Error revoking permission:', error);
    }
  };

  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch = permission
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      permissionCategories
        .find((cat) => cat.name === selectedCategory)
        ?.permissions.includes(permission);
    return matchesSearch && matchesCategory;
  });

  const filteredAuditLog = auditLog.filter(
    (audit) =>
      audit.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.permission.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-nude-900">
            Permission Management
          </h1>
          <p className="text-nude-600 mt-1">
            Manage user permissions and audit access
          </p>
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
                  <BuffrIcon name="shield" className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-nude-600">
                    Total Permissions
                  </p>
                  <p className="text-2xl font-bold text-nude-900">
                    {stats.total_permissions}
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
                    name="check-circle"
                    className="h-6 w-6 text-green-600"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-nude-600">
                    Active Permissions
                  </p>
                  <p className="text-2xl font-bold text-nude-900">
                    {stats.active_permissions}
                  </p>
                </div>
              </div>
            </BuffrCardBody>
          </BuffrCard>

          <BuffrCard>
            <BuffrCardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <BuffrIcon
                    name="trending-up"
                    className="h-6 w-6 text-yellow-600"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-nude-600">
                    Recent Grants
                  </p>
                  <p className="text-2xl font-bold text-nude-900">
                    {stats.recent_grants}
                  </p>
                </div>
              </div>
            </BuffrCardBody>
          </BuffrCard>

          <BuffrCard>
            <BuffrCardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <BuffrIcon
                    name="trending-down"
                    className="h-6 w-6 text-red-600"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-nude-600">
                    Recent Revokes
                  </p>
                  <p className="text-2xl font-bold text-nude-900">
                    {stats.recent_revokes}
                  </p>
                </div>
              </div>
            </BuffrCardBody>
          </BuffrCard>
        </div>
      )}

      {/* Search and Filters */}
      <BuffrCard>
        <BuffrCardBody className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <BuffrLabel htmlFor="search">Search Permissions</BuffrLabel>
              <BuffrInput
                id="search"
                type="text"
                placeholder="Search permissions or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="md:w-64">
              <BuffrLabel htmlFor="category">Category</BuffrLabel>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {permissionCategories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </BuffrCardBody>
      </BuffrCard>

      {/* Permissions and Audit Tabs */}
      <BuffrTabs defaultValue="permissions" className="space-y-6">
        <BuffrTabsList className="grid w-full grid-cols-2">
          <BuffrTabsTrigger value="permissions">Permissions</BuffrTabsTrigger>
          <BuffrTabsTrigger value="audit">Audit Log</BuffrTabsTrigger>
        </BuffrTabsList>

        <BuffrTabsContent value="permissions" className="space-y-4">
          <BuffrCard>
            <BuffrCardHeader>
              <BuffrCardTitle>Available Permissions</BuffrCardTitle>
            </BuffrCardHeader>
            <BuffrCardBody>
              <div className="space-y-2">
                {filteredPermissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center justify-between p-3 border border-nude-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <BuffrIcon
                        name="shield"
                        className="h-4 w-4 text-nude-600 mr-2"
                      />
                      <span className="font-medium text-nude-900">
                        {permission}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BuffrButton
                        size="sm"
                        onClick={() =>
                          handleGrantPermission('user-id', permission)
                        }
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Grant
                      </BuffrButton>
                      <BuffrButton
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleRevokePermission('user-id', permission)
                        }
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Revoke
                      </BuffrButton>
                    </div>
                  </div>
                ))}
              </div>
            </BuffrCardBody>
          </BuffrCard>
        </BuffrTabsContent>

        <BuffrTabsContent value="audit" className="space-y-4">
          <BuffrCard>
            <BuffrCardHeader>
              <BuffrCardTitle>Permission Audit Log</BuffrCardTitle>
            </BuffrCardHeader>
            <BuffrCardBody>
              <div className="space-y-2">
                {filteredAuditLog.map((audit) => (
                  <div
                    key={audit.id}
                    className="flex items-center justify-between p-3 border border-nude-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <BuffrIcon
                        name={audit.granted ? 'check-circle' : 'x-circle'}
                        className={`h-4 w-4 mr-2 ${audit.granted ? 'text-green-600' : 'text-red-600'}`}
                      />
                      <div>
                        <span className="font-medium text-nude-900">
                          {audit.user_name}
                        </span>
                        <span className="text-nude-600 ml-2">
                          {audit.permission}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-nude-500">
                      {new Date(audit.granted_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </BuffrCardBody>
          </BuffrCard>
        </BuffrTabsContent>
      </BuffrTabs>
    </div>
  );
}
