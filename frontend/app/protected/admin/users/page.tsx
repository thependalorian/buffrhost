'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PermissionGuard } from '@/components/features/rbac/PermissionGuard';
import { Permission } from '@/lib/types/rbac';
import {
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrBadge,
  BuffrButton,
  BuffrInput,
  BuffrSelect,
  BuffrSelectContent,
  BuffrSelectItem,
  BuffrSelectTrigger,
  BuffrSelectValue,
  BuffrTable,
  BuffrTableBody,
  BuffrTableCell,
  BuffrTableHead,
  BuffrTableHeader,
  BuffrTableRow,
  BuffrTabs,
  BuffrTabsContent,
  BuffrTabsList,
  BuffrTabsTrigger,
  BuffrAlert,
  BuffrAlertDescription,
  BuffrIcon,
} from '@/components/ui';
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  tenant_id: string;
  tenant_name: string;
  last_login: string;
  created_at: string;
  login_count: number;
  ip_address: string;
  user_agent: string;
  permissions: string[];
  is_online: boolean;
}

interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  suspended_users: number;
  pending_users: number;
  online_users: number;
  users_by_role: Record<string, number>;
  recent_registrations: number;
  login_activity: number;
}

interface UserFilters {
  search: string;
  role: string;
  status: string;
  tenant: string;
  date_from: string;
  date_to: string;
}

/**
 * User Management Dashboard
 * Comprehensive user management and administration interface
 */
export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
    status: 'all',
    tenant: 'all',
    date_from: '',
    date_to: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const [usersResponse, statsResponse] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/users/stats'),
      ]);

      if (!usersResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const usersData = await usersResponse.json();
      const statsData = await statsResponse.json();

      setUsers(usersData.users || []);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...users];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(searchLower) ||
          user.first_name.toLowerCase().includes(searchLower) ||
          user.last_name.toLowerCase().includes(searchLower) ||
          user.tenant_name.toLowerCase().includes(searchLower)
      );
    }

    // Role filter
    if (filters.role !== 'all') {
      filtered = filtered.filter((user) => user.role === filters.role);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((user) => user.status === filters.status);
    }

    // Tenant filter
    if (filters.tenant !== 'all') {
      filtered = filtered.filter((user) => user.tenant_id === filters.tenant);
    }

    // Date filters
    if (filters.date_from) {
      filtered = filtered.filter(
        (user) => new Date(user.created_at) >= new Date(filters.date_from)
      );
    }

    if (filters.date_to) {
      filtered = filtered.filter(
        (user) => new Date(user.created_at) <= new Date(filters.date_to)
      );
    }

    setFilteredUsers(filtered);
  }, [users, filters]);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters, applyFilters]);

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-nude-100 text-nude-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
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
            size="sm"
            className="text-semantic-success"
          />
        );
      case 'inactive':
        return <BuffrIcon name="clock" size="sm" className="text-nude-600" />;
      case 'suspended':
        return (
          <BuffrIcon
            name="x-circle"
            size="sm"
            className="text-semantic-error"
          />
        );
      case 'pending':
        return (
          <BuffrIcon
            name="alert-triangle"
            size="sm"
            className="text-semantic-warning"
          />
        );
      default:
        return <BuffrIcon name="clock" size="sm" className="text-nude-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-nude-100 text-nude-800';
      case 'staff':
        return 'bg-green-100 text-green-800';
      case 'guest':
        return 'bg-nude-100 text-nude-800';
      default:
        return 'bg-nude-100 text-nude-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getUniqueValues = (key: keyof User) => {
    return Array.from(new Set(users.map((user) => user[key]).filter(Boolean)));
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-nude-900">User Management</h1>
          <p className="text-nude-600 mt-2">
            Manage users, roles, and permissions across all tenants
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BuffrButton
            variant="outline"
            size="sm"
            onClick={loadUserData}
            state={isLoading ? 'loading' : undefined}
          >
            <BuffrIcon name="refresh" size="sm" className="mr-2" />
            Refresh
          </BuffrButton>
          <BuffrButton size="sm">
            <BuffrIcon name="plus" size="sm" className="mr-2" />
            Add User
          </BuffrButton>
        </div>
      </div>

      {/* Stats Cards */}
      <PermissionGuard
        permission={Permission.USERS_READ}
        fallback={
          <BuffrCard>
            <BuffrCardBody className="flex items-center justify-center py-8">
              <div className="text-center">
                <BuffrIcon
                  name="shield"
                  size="xl"
                  className="text-nude-400 mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-nude-900 mb-2">
                  Access Denied
                </h3>
                <p className="text-nude-600">
                  You don't have permission to view user management.
                </p>
              </div>
            </BuffrCardBody>
          </BuffrCard>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <BuffrCard>
            <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <BuffrCardTitle className="text-sm font-medium">
                Total Users
              </BuffrCardTitle>
              <BuffrIcon
                name="users"
                size="sm"
                className="text-muted-foreground"
              />
            </BuffrCardHeader>
            <BuffrCardBody>
              <div className="text-2xl font-bold">
                {stats?.total_users || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                All registered users
              </p>
            </BuffrCardBody>
          </BuffrCard>

          <BuffrCard>
            <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <BuffrCardTitle className="text-sm font-medium">
                Active Users
              </BuffrCardTitle>
              <BuffrIcon
                name="check-circle"
                size="sm"
                className="text-semantic-success"
              />
            </BuffrCardHeader>
            <BuffrCardBody>
              <div className="text-2xl font-bold">
                {stats?.active_users || 0}
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </BuffrCardBody>
          </BuffrCard>

          <BuffrCard>
            <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <BuffrCardTitle className="text-sm font-medium">
                Online Users
              </BuffrCardTitle>
              <BuffrIcon name="activity" size="sm" className="text-nude-600" />
            </BuffrCardHeader>
            <BuffrCardBody>
              <div className="text-2xl font-bold">
                {stats?.online_users || 0}
              </div>
              <p className="text-xs text-muted-foreground">Currently online</p>
            </BuffrCardBody>
          </BuffrCard>

          <BuffrCard>
            <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <BuffrCardTitle className="text-sm font-medium">
                Recent Registrations
              </BuffrCardTitle>
              <BuffrIcon
                name="trending-up"
                size="sm"
                className="text-muted-foreground"
              />
            </BuffrCardHeader>
            <BuffrCardBody>
              <div className="text-2xl font-bold">
                {stats?.recent_registrations || 0}
              </div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </BuffrCardBody>
          </BuffrCard>
        </div>

        {/* User Management Tabs */}
        <BuffrTabs defaultValue="users" className="space-y-6">
          <BuffrTabsList>
            <BuffrTabsTrigger value="users">All Users</BuffrTabsTrigger>
            <BuffrTabsTrigger value="roles">By Role</BuffrTabsTrigger>
            <BuffrTabsTrigger value="activity">Activity</BuffrTabsTrigger>
            <BuffrTabsTrigger value="sessions">
              Active Sessions
            </BuffrTabsTrigger>
          </BuffrTabsList>

          {/* All Users Tab */}
          <BuffrTabsContent value="users" className="space-y-6">
            {/* Filters */}
            <BuffrCard>
              <BuffrCardHeader>
                <BuffrCardTitle className="flex items-center gap-2">
                  <BuffrIcon name="filter" size="sm" />
                  Filters
                </BuffrCardTitle>
              </BuffrCardHeader>
              <BuffrCardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Search
                    </label>
                    <div className="relative">
                      <BuffrIcon
                        name="search"
                        size="sm"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      />
                      <BuffrInput
                        placeholder="Search users..."
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange('search', e.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Role
                    </label>
                    <BuffrSelect
                      value={filters.role}
                      onValueChange={(value) =>
                        handleFilterChange('role', value)
                      }
                    >
                      <BuffrSelectTrigger>
                        <BuffrSelectValue />
                      </BuffrSelectTrigger>
                      <BuffrSelectContent>
                        <BuffrSelectItem value="all">All Roles</BuffrSelectItem>
                        {getUniqueValues('role').map((role, index) => (
                          <BuffrSelectItem
                            key={`${role}-${index}`}
                            value={String(role)}
                          >
                            {String(role)}
                          </BuffrSelectItem>
                        ))}
                      </BuffrSelectContent>
                    </BuffrSelect>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Status
                    </label>
                    <BuffrSelect
                      value={filters.status}
                      onValueChange={(value) =>
                        handleFilterChange('status', value)
                      }
                    >
                      <BuffrSelectTrigger>
                        <BuffrSelectValue />
                      </BuffrSelectTrigger>
                      <BuffrSelectContent>
                        <BuffrSelectItem value="all">
                          All Status
                        </BuffrSelectItem>
                        <BuffrSelectItem value="active">Active</BuffrSelectItem>
                        <BuffrSelectItem value="inactive">
                          Inactive
                        </BuffrSelectItem>
                        <BuffrSelectItem value="suspended">
                          Suspended
                        </BuffrSelectItem>
                        <BuffrSelectItem value="pending">
                          Pending
                        </BuffrSelectItem>
                      </BuffrSelectContent>
                    </BuffrSelect>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Tenant
                    </label>
                    <BuffrSelect
                      value={filters.tenant}
                      onValueChange={(value) =>
                        handleFilterChange('tenant', value)
                      }
                    >
                      <BuffrSelectTrigger>
                        <BuffrSelectValue />
                      </BuffrSelectTrigger>
                      <BuffrSelectContent>
                        <BuffrSelectItem value="all">
                          All Tenants
                        </BuffrSelectItem>
                        {getUniqueValues('tenant_name').map((tenant, index) => (
                          <BuffrSelectItem
                            key={`${tenant}-${index}`}
                            value={String(tenant)}
                          >
                            {String(tenant)}
                          </BuffrSelectItem>
                        ))}
                      </BuffrSelectContent>
                    </BuffrSelect>
                  </div>
                </div>
              </BuffrCardBody>
            </BuffrCard>

            {/* Users Table */}
            <BuffrCard>
              <BuffrCardHeader>
                <div className="flex items-center justify-between">
                  <BuffrCardTitle>
                    Users ({filteredUsers.length})
                  </BuffrCardTitle>
                  <div className="flex items-center gap-2">
                    <BuffrButton variant="outline" size="sm">
                      <BuffrIcon name="download" className="h-4 w-4 mr-2" />
                      Export
                    </BuffrButton>
                  </div>
                </div>
              </BuffrCardHeader>
              <BuffrCardBody>
                <div className="overflow-auto">
                  <BuffrTable>
                    <BuffrTableHeader>
                      <BuffrTableRow>
                        <BuffrTableHead>User</BuffrTableHead>
                        <BuffrTableHead>Role</BuffrTableHead>
                        <BuffrTableHead>Status</BuffrTableHead>
                        <BuffrTableHead>Tenant</BuffrTableHead>
                        <BuffrTableHead>Last Login</BuffrTableHead>
                        <BuffrTableHead>Online</BuffrTableHead>
                        <BuffrTableHead>Actions</BuffrTableHead>
                      </BuffrTableRow>
                    </BuffrTableHeader>
                    <BuffrTableBody>
                      {filteredUsers.map((user) => (
                        <BuffrTableRow key={user.id}>
                          <BuffrTableCell>
                            <div>
                              <p className="font-medium">
                                {user.first_name} {user.last_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </BuffrTableCell>
                          <BuffrTableCell>
                            <BuffrBadge className={getRoleColor(user.role)}>
                              {user.role}
                            </BuffrBadge>
                          </BuffrTableCell>
                          <BuffrTableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(user.status)}
                              <BuffrBadge
                                className={getStatusColor(user.status)}
                              >
                                {user.status}
                              </BuffrBadge>
                            </div>
                          </BuffrTableCell>
                          <BuffrTableCell>
                            <p className="text-sm">{user.tenant_name}</p>
                          </BuffrTableCell>
                          <BuffrTableCell>
                            <p className="text-sm">
                              {formatDate(user.last_login)}
                            </p>
                          </BuffrTableCell>
                          <BuffrTableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${user.is_online ? 'bg-semantic-success' : 'bg-nude-400'}`}
                              />
                              <span className="text-sm">
                                {user.is_online ? 'Online' : 'Offline'}
                              </span>
                            </div>
                          </BuffrTableCell>
                          <BuffrTableCell>
                            <div className="flex items-center gap-1">
                              <BuffrButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                <BuffrIcon name="eye" className="h-4 w-4" />
                              </BuffrButton>
                              <BuffrButton variant="ghost" size="sm">
                                <BuffrIcon name="edit" className="h-4 w-4" />
                              </BuffrButton>
                              <BuffrButton variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </BuffrButton>
                            </div>
                          </BuffrTableCell>
                        </BuffrTableRow>
                      ))}
                    </BuffrTableBody>
                  </BuffrTable>
                </div>
              </BuffrCardBody>
            </BuffrCard>
          </BuffrTabsContent>

          {/* By Role Tab */}
          <BuffrTabsContent value="roles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats?.users_by_role &&
                Object.entries(stats.users_by_role).map(([role, count]) => (
                  <BuffrCard key={role}>
                    <BuffrCardHeader>
                      <BuffrCardTitle className="flex items-center gap-2">
                        <BuffrBadge className={getRoleColor(role)}>
                          {role}
                        </BuffrBadge>
                      </BuffrCardTitle>
                    </BuffrCardHeader>
                    <BuffrCardBody>
                      <div className="text-2xl font-bold">{count}</div>
                      <p className="text-sm text-muted-foreground">
                        Users with this role
                      </p>
                    </BuffrCardBody>
                  </BuffrCard>
                ))}
            </div>
          </BuffrTabsContent>

          {/* Activity Tab */}
          <BuffrTabsContent value="activity" className="space-y-6">
            <BuffrCard>
              <BuffrCardHeader>
                <BuffrCardTitle>User Activity</BuffrCardTitle>
              </BuffrCardHeader>
              <BuffrCardBody>
                <div className="text-center py-8">
                  <BuffrIcon
                    name="activity"
                    className="h-12 w-12 text-nude-400 mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-nude-900 mb-2">
                    Activity Monitoring
                  </h3>
                  <p className="text-nude-600">
                    User activity tracking and analytics
                  </p>
                </div>
              </BuffrCardBody>
            </BuffrCard>
          </BuffrTabsContent>

          {/* Active Sessions Tab */}
          <BuffrTabsContent value="sessions" className="space-y-6">
            <BuffrCard>
              <BuffrCardHeader>
                <BuffrCardTitle>Active Sessions</BuffrCardTitle>
              </BuffrCardHeader>
              <BuffrCardBody>
                <div className="text-center py-8">
                  <BuffrIcon
                    name="clock"
                    className="h-12 w-12 text-nude-400 mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-nude-900 mb-2">
                    Session Management
                  </h3>
                  <p className="text-nude-600">
                    Monitor and manage active user sessions
                  </p>
                </div>
              </BuffrCardBody>
            </BuffrCard>
          </BuffrTabsContent>
        </BuffrTabs>

        {/* User Details Modal */}
        {selectedUser && (
          <BuffrCard>
            <BuffrCardHeader>
              <BuffrCardTitle>User Details</BuffrCardTitle>
            </BuffrCardHeader>
            <BuffrCardBody>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p className="text-sm">
                      {selectedUser.first_name} {selectedUser.last_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <BuffrBadge className={getRoleColor(selectedUser.role)}>
                      {selectedUser.role}
                    </BuffrBadge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <BuffrBadge className={getStatusColor(selectedUser.status)}>
                      {selectedUser.status}
                    </BuffrBadge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tenant</label>
                    <p className="text-sm">{selectedUser.tenant_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Login</label>
                    <p className="text-sm">
                      {formatDate(selectedUser.last_login)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Login Count</label>
                    <p className="text-sm">{selectedUser.login_count}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Created</label>
                    <p className="text-sm">
                      {formatDate(selectedUser.created_at)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Permissions</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedUser.permissions.map((permission) => (
                      <BuffrBadge
                        key={permission}
                        variant="outline"
                        className="text-xs"
                      >
                        {permission}
                      </BuffrBadge>
                    ))}
                  </div>
                </div>
              </div>
            </BuffrCardBody>
          </BuffrCard>
        )}
      </PermissionGuard>

      {error && (
        <BuffrAlert variant="error">
          <BuffrIcon name="alert-triangle" size="sm" />
          <BuffrAlertDescription>{error}</BuffrAlertDescription>
        </BuffrAlert>
      )}
    </div>
  );
}
