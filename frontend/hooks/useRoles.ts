/**
 * useRoles Hook
 * Custom hook for role-based access control
 */

import { useRBAC } from '@/lib/contexts/RBACContext';
import { UserRole } from '@/lib/types/rbac';

// Helper function to get role hierarchy level
const getRoleLevel = (role: UserRole): number => {
  const roleLevels: Record<UserRole, number> = {
    [UserRole.GUEST]: 0,
    [UserRole.STAFF]: 1,
    [UserRole.MANAGER]: 2,
    [UserRole.ADMIN]: 3,
    [UserRole.SUPER_ADMIN]: 4,
  };
  return roleLevels[role] || 0;
};

export const useRoles = () => {
  const { hasRole, hasAnyRole, hasAllRoles, context, isLoading, error } =
    useRBAC();

  return {
    // Current role
    currentRole: context?.role || UserRole.GUEST,

    // Role checks
    isSuperAdmin: () => hasRole(UserRole.SUPER_ADMIN),
    isAdmin: () => hasRole(UserRole.ADMIN),
    isManager: () => hasRole(UserRole.MANAGER),
    isStaff: () => hasRole(UserRole.STAFF),
    isGuest: () => hasRole(UserRole.GUEST),

    // Combined role checks
    isAdminOrManager: () => hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]),
    isStaffOrAbove: () =>
      hasAnyRole([
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.STAFF,
      ]),
    isManagerOrAbove: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]),
    isAdminOrAbove: () => hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),

    // Role hierarchy checks
    canManageUsers: () => hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
    canManageRoles: () => hasRole(UserRole.SUPER_ADMIN),
    canManageTenants: () => hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
    canManageProperties: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]),
    canManageBookings: () =>
      hasAnyRole([
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.STAFF,
      ]),
    canManageCustomers: () =>
      hasAnyRole([
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.STAFF,
      ]),
    canManageStaff: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]),
    canViewAnalytics: () =>
      hasAnyRole([
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.STAFF,
      ]),
    canManageAnalytics: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]),
    canManageCMS: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]),
    canManageFinancial: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]),
    canManageSettings: () => hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),

    // Role-based UI access
    canAccessAdminPanel: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
    canAccessManagerPanel: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]),
    canAccessStaffPanel: () =>
      hasAnyRole([
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.STAFF,
      ]),
    canAccessGuestPanel: () =>
      hasAnyRole([
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.STAFF,
        UserRole.GUEST,
      ]),

    // Role-based feature access
    canCreateProperties: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]),
    canDeleteProperties: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
    canCreateBookings: () =>
      hasAnyRole([
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.STAFF,
      ]),
    canCancelBookings: () =>
      hasAnyRole([
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.STAFF,
      ]),
    canCreateCustomers: () =>
      hasAnyRole([
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.STAFF,
      ]),
    canDeleteCustomers: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]),
    canCreateStaff: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]),
    canDeleteStaff: () => hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
    canViewReports: () =>
      hasAnyRole([
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.STAFF,
      ]),
    canCreateReports: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]),
    canManageContent: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]),
    canManageMedia: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]),

    // Role-based data access
    canViewAllData: () => hasRole(UserRole.SUPER_ADMIN),
    canViewTenantData: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]),
    canViewPropertyData: () =>
      hasAnyRole([
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.STAFF,
      ]),
    canViewOwnData: () =>
      hasAnyRole([
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.STAFF,
        UserRole.GUEST,
      ]),

    // Role-based actions
    canAssignRoles: () => hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
    canRemoveRoles: () => hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
    canGrantPermissions: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
    canRevokePermissions: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
    canManageUserSessions: () =>
      hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
    canViewAuditLogs: () => hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),

    // Role hierarchy utilities
    getRoleLevel: (role: UserRole): number => {
      const roleLevels: Record<UserRole, number> = {
        [UserRole.SUPER_ADMIN]: 5,
        [UserRole.ADMIN]: 4,
        [UserRole.MANAGER]: 3,
        [UserRole.STAFF]: 2,
        [UserRole.GUEST]: 1,
      };
      return roleLevels[role];
    },

    canAccessRole: (targetRole: UserRole): boolean => {
      if (!context) return false;
      const currentLevel = getRoleLevel(context.role);
      const targetLevel = getRoleLevel(targetRole);
      return currentLevel >= targetLevel;
    },

    canManageRole: (targetRole: UserRole): boolean => {
      if (!context) return false;
      const currentLevel = getRoleLevel(context.role);
      const targetLevel = getRoleLevel(targetRole);
      return currentLevel > targetLevel;
    },

    // Role-based navigation
    getAvailableRoutes: (): string[] => {
      if (!context) return ['/guest'];

      const routes: Record<UserRole, string[]> = {
        [UserRole.SUPER_ADMIN]: [
          '/admin',
          '/manager',
          '/staff',
          '/guest',
          '/admin/users',
          '/admin/roles',
          '/admin/permissions',
          '/admin/tenants',
          '/admin/settings',
          '/admin/analytics',
        ],
        [UserRole.ADMIN]: [
          '/admin',
          '/manager',
          '/staff',
          '/guest',
          '/admin/users',
          '/admin/tenants',
          '/admin/settings',
          '/admin/analytics',
        ],
        [UserRole.MANAGER]: [
          '/manager',
          '/staff',
          '/guest',
          '/manager/properties',
          '/manager/bookings',
          '/manager/customers',
          '/manager/staff',
          '/manager/analytics',
          '/manager/cms',
        ],
        [UserRole.STAFF]: [
          '/staff',
          '/guest',
          '/staff/bookings',
          '/staff/customers',
          '/staff/analytics',
        ],
        [UserRole.GUEST]: ['/guest'],
      };

      return routes[context.role] || ['/guest'];
    },

    // State
    isLoading,
    error,
  };
};
