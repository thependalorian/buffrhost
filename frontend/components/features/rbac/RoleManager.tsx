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
  BuffrCheckbox,
  BuffrSelect,
} from '@/components/ui';

import React, { useState, useEffect, useCallback } from 'react';
import { usePermissions, useRoles } from '@/hooks/usePermissions';
import { UserRole, Permission } from '@/lib/types/rbac';
interface RoleManagerUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

interface RoleManagerProps {
  propertyId?: string;
  tenantId?: string;
}

/**
 * RoleManager Component
 * Interface for managing user roles and permissions
 */
export const RoleManager: React.FC<RoleManagerProps> = ({
  propertyId,
  tenantId,
}) => {
  const { canManageUsers } = usePermissions();
  const { isAdmin, isSuperAdmin } = useRoles();

  const [users, setUsers] = useState<RoleManagerUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<RoleManagerUser | null>(
    null
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.GUEST);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Role definitions with descriptions
  const roleDefinitions = [
    {
      role: UserRole.SUPER_ADMIN,
      name: 'Super Admin',
      description: 'Full system access, can manage all tenants and users',
      color: 'bg-red-100 text-error',
      permissions: [
        Permission.USERS_MANAGE,
        Permission.ROLES_MANAGE,
        Permission.TENANTS_MANAGE,
        Permission.SETTINGS_MANAGE,
        Permission.ANALYTICS_MANAGE,
      ],
    },
    {
      role: UserRole.ADMIN,
      name: 'Admin',
      description: 'Tenant-level admin, can manage users and settings',
      color: 'bg-purple-100 text-purple-800',
      permissions: [
        Permission.USERS_MANAGE,
        Permission.PROPERTIES_MANAGE,
        Permission.ANALYTICS_MANAGE,
        Permission.SETTINGS_MANAGE,
      ],
    },
    {
      role: UserRole.MANAGER,
      name: 'Manager',
      description: 'Property manager, can manage bookings and staff',
      color: 'bg-nude-100 text-nude-800',
      permissions: [
        Permission.PROPERTIES_MANAGE,
        Permission.BOOKINGS_MANAGE,
        Permission.CUSTOMERS_MANAGE,
        Permission.STAFF_MANAGE,
        Permission.ANALYTICS_READ,
      ],
    },
    {
      role: UserRole.STAFF,
      name: 'Staff',
      description: 'Front desk and service staff',
      color: 'bg-green-100 text-success',
      permissions: [
        Permission.BOOKINGS_READ,
        Permission.BOOKINGS_WRITE,
        Permission.CUSTOMERS_READ,
        Permission.CUSTOMERS_WRITE,
      ],
    },
    {
      role: UserRole.GUEST,
      name: 'Guest',
      description: 'Limited access for guest users',
      color: 'bg-nude-100 text-nude-800',
      permissions: [Permission.BOOKINGS_READ, Permission.CUSTOMERS_READ],
    },
  ];

  // Permission categories for organization
  const permissionCategories = [
    {
      name: 'User Management',
      permissions: [
        Permission.USERS_READ,
        Permission.USERS_WRITE,
        Permission.USERS_DELETE,
        Permission.USERS_MANAGE,
      ],
    },
    {
      name: 'Property Management',
      permissions: [
        Permission.PROPERTIES_READ,
        Permission.PROPERTIES_WRITE,
        Permission.PROPERTIES_DELETE,
        Permission.PROPERTIES_MANAGE,
      ],
    },
    {
      name: 'Booking Management',
      permissions: [
        Permission.BOOKINGS_READ,
        Permission.BOOKINGS_WRITE,
        Permission.BOOKINGS_DELETE,
        Permission.BOOKINGS_MANAGE,
      ],
    },
    {
      name: 'Customer Management',
      permissions: [
        Permission.CUSTOMERS_READ,
        Permission.CUSTOMERS_WRITE,
        Permission.CUSTOMERS_DELETE,
        Permission.CUSTOMERS_MANAGE,
      ],
    },
    {
      name: 'Analytics & Reports',
      permissions: [
        Permission.ANALYTICS_READ,
        Permission.ANALYTICS_WRITE,
        Permission.ANALYTICS_MANAGE,
        Permission.REPORTS_READ,
        Permission.REPORTS_WRITE,
        Permission.REPORTS_MANAGE,
      ],
    },
    {
      name: 'System Management',
      permissions: [
        Permission.SETTINGS_READ,
        Permission.SETTINGS_WRITE,
        Permission.SETTINGS_MANAGE,
        Permission.ROLES_READ,
        Permission.ROLES_WRITE,
        Permission.ROLES_MANAGE,
      ],
    },
  ];

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/users?property_id=${propertyId}&tenant_id=${tenantId}`
      );
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, tenantId]);

  useEffect(() => {
    fetchUsers();
  }, [propertyId, tenantId, fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/rbac/assign-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          role: newRole,
          property_id: propertyId,
          tenant_id: tenantId,
        }),
      });

      if (!response.ok) throw new Error('Failed to assign role');

      setSuccess('Role assigned successfully');
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign role');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionToggle = (permission: Permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleAssignPermissions = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/rbac/assign-permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          permissions: selectedPermissions,
          property_id: propertyId,
          tenant_id: tenantId,
        }),
      });

      if (!response.ok) throw new Error('Failed to assign permissions');

      setSuccess('Permissions assigned successfully');
      setSelectedPermissions([]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to assign permissions'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!canManageUsers(propertyId) || (!isAdmin() && !isSuperAdmin())) {
    return (
      <Alert>
        <BuffrIcon name="x-circle" className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to manage roles and permissions.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-nude-900">
            Role & Permission Management
          </h2>
          <p className="text-nude-600">Manage user roles and permissions</p>
        </div>
      </div>

      {error && (
        <Alert variant="error">
          <BuffrIcon name="x-circle" className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <BuffrIcon name="check-circle" className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BuffrIcon name="user" className="h-5 w-5" />
            Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => {
                const roleDef = roleDefinitions.find(
                  (r) => r.role === user.role
                );
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between card-body border card"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">{user.full_name}</h3>
                        <p className="text-sm text-nude-600">{user.email}</p>
                      </div>
                      <Badge className={roleDef?.color}>{roleDef?.name}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={user.role}
                        onValueChange={(value) =>
                          handleRoleChange(user.id, value as UserRole)
                        }
                        disabled={
                          !canManageUsers(propertyId) ||
                          (!isAdmin() && !isSuperAdmin())
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleDefinitions.map((role) => (
                            <SelectItem key={role.role} value={role.role}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <BuffrIcon name="shield" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permission Assignment */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle>
              Assign Permissions to {selectedUser.full_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {permissionCategories.map((category) => (
                <div key={category.name}>
                  <h4 className="font-semibold mb-3">{category.name}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {category.permissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={permission}
                          checked={selectedPermissions.includes(permission)}
                          onCheckedChange={() =>
                            handlePermissionToggle(permission)
                          }
                        />
                        <Label htmlFor={permission} className="text-sm">
                          {permission.replace(':', ' ').replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                <Button
                  onClick={() => handleAssignPermissions(selectedUser.id)}
                  disabled={selectedPermissions.length === 0 || isLoading}
                >
                  Assign Permissions
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedUser(null);
                    setSelectedPermissions([]);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
