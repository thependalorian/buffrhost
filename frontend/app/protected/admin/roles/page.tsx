'use client';
import {
  BuffrIcon,
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrButton,
  BuffrBadge,
} from '@/components/ui';

import React from 'react';
import { RoleManager } from '@/components/features/rbac/RoleManager';
import { PermissionGuard } from '@/components/features/rbac/PermissionGuard';
import { Permission } from '@/lib/types/rbac';
/**
 * Admin Roles Page
 * Role and permission management interface
 */
export default function AdminRolesPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-nude-900">Role Management</h1>
          <p className="text-nude-600 mt-2">
            Manage user roles and permissions across your organization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BuffrBadge variant="outline" className="text-nude-600">
            <BuffrIcon name="shield" className="h-4 w-4 mr-1" />
            Admin Access
          </BuffrBadge>
        </div>
      </div>

      {/* Role Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Super Admins
            </BuffrCardTitle>
            <BuffrIcon
              name="shield"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Full system access</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Admins
            </BuffrCardTitle>
            <BuffrIcon name="users" className="h-4 w-4 text-muted-foreground" />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Tenant-level access</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Managers
            </BuffrCardTitle>
            <BuffrIcon
              name="settings"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Property management</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Staff
            </BuffrCardTitle>
            <BuffrIcon name="users" className="h-4 w-4 text-muted-foreground" />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              Front desk & service
            </p>
          </BuffrCardContent>
        </BuffrCard>
      </div>

      {/* Permission Guard for Role Management */}
      <PermissionGuard
        permission={Permission.USERS_MANAGE}
        fallback={
          <BuffrCard>
            <BuffrCardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <BuffrIcon
                  name="alert-triangle"
                  className="h-12 w-12 text-nude-400 mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-nude-900 mb-2">
                  Access Denied
                </h3>
                <p className="text-nude-600">
                  You don't have permission to manage roles and permissions.
                </p>
              </div>
            </BuffrCardContent>
          </BuffrCard>
        }
      >
        <RoleManager />
      </PermissionGuard>

      {/* Role Definitions */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Role Definitions</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BuffrBadge className="bg-red-100 text-red-800">
                    Super Admin
                  </BuffrBadge>
                </div>
                <p className="text-sm text-nude-600 mb-2">
                  Full system access, can manage all tenants and users
                </p>
                <div className="text-xs text-nude-500">
                  Permissions: All system permissions
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BuffrBadge className="bg-purple-100 text-purple-800">
                    Admin
                  </BuffrBadge>
                </div>
                <p className="text-sm text-nude-600 mb-2">
                  Tenant-level admin, can manage users and settings
                </p>
                <div className="text-xs text-nude-500">
                  Permissions: User management, property management, analytics
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BuffrBadge className="bg-nude-100 text-nude-800">
                    Manager
                  </BuffrBadge>
                </div>
                <p className="text-sm text-nude-600 mb-2">
                  Property manager, can manage bookings and staff
                </p>
                <div className="text-xs text-nude-500">
                  Permissions: Property management, booking management, staff
                  management
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BuffrBadge className="bg-green-100 text-green-800">
                    Staff
                  </BuffrBadge>
                </div>
                <p className="text-sm text-nude-600 mb-2">
                  Front desk and service staff
                </p>
                <div className="text-xs text-nude-500">
                  Permissions: Booking management, customer management
                </div>
              </div>
            </div>
          </div>
        </BuffrCardContent>
      </BuffrCard>

      {/* Quick Actions */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Quick Actions</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="flex flex-wrap gap-2">
            <BuffrButton variant="outline" size="sm">
              <BuffrIcon name="shield" className="h-4 w-4 mr-2" />
              View Permission Audit
            </BuffrButton>
            <BuffrButton variant="outline" size="sm">
              <BuffrIcon name="users" className="h-4 w-4 mr-2" />
              Export User Roles
            </BuffrButton>
            <BuffrButton variant="outline" size="sm">
              <BuffrIcon name="settings" className="h-4 w-4 mr-2" />
              Role Templates
            </BuffrButton>
          </div>
        </BuffrCardContent>
      </BuffrCard>
    </div>
  );
}
