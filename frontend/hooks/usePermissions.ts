/**
 * usePermissions Hook
 * Custom hook for permission-based access control
 */

import { useRBAC } from '@/lib/contexts/RBACContext';
import { Permission, UserRole } from '@/lib/types/rbac';

export const usePermissions = () => {
  const {
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    canAccessResource,
    isLoading,
    error,
  } = useRBAC();

  return {
    // Permission checks
    canRead: (resource: string, resourceId?: string) =>
      hasPermission(getReadPermission(resource), resourceId),

    canWrite: (resource: string, resourceId?: string) =>
      hasPermission(getWritePermission(resource), resourceId),

    canDelete: (resource: string, resourceId?: string) =>
      hasPermission(getDeletePermission(resource), resourceId),

    canManage: (resource: string, resourceId?: string) =>
      hasPermission(getManagePermission(resource), resourceId),

    // Specific permission checks
    canManageUsers: (resourceId?: string) =>
      hasPermission(Permission.USERS_MANAGE, resourceId),

    canManageProperties: (resourceId?: string) =>
      hasPermission(Permission.PROPERTIES_MANAGE, resourceId),

    canManageBookings: (resourceId?: string) =>
      hasPermission(Permission.BOOKINGS_MANAGE, resourceId),

    canManageCustomers: (resourceId?: string) =>
      hasPermission(Permission.CUSTOMERS_MANAGE, resourceId),

    canManageStaff: (resourceId?: string) =>
      hasPermission(Permission.STAFF_MANAGE, resourceId),

    canViewAnalytics: (resourceId?: string) =>
      hasPermission(Permission.ANALYTICS_READ, resourceId),

    canManageAnalytics: (resourceId?: string) =>
      hasPermission(Permission.ANALYTICS_MANAGE, resourceId),

    canManageCMS: (resourceId?: string) =>
      hasPermission(Permission.CMS_MANAGE, resourceId),

    canManageFinancial: (resourceId?: string) =>
      hasPermission(Permission.FINANCIAL_MANAGE, resourceId),

    canManageSettings: (resourceId?: string) =>
      hasPermission(Permission.SETTINGS_MANAGE, resourceId),

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

    // Resource access checks
    canAccessUsers: (resourceId?: string) =>
      canAccessResource('users', resourceId),
    canAccessProperties: (resourceId?: string) =>
      canAccessResource('properties', resourceId),
    canAccessBookings: (resourceId?: string) =>
      canAccessResource('bookings', resourceId),
    canAccessCustomers: (resourceId?: string) =>
      canAccessResource('customers', resourceId),
    canAccessStaff: (resourceId?: string) =>
      canAccessResource('staff', resourceId),
    canAccessAnalytics: (resourceId?: string) =>
      canAccessResource('analytics', resourceId),
    canAccessCMS: (resourceId?: string) => canAccessResource('cms', resourceId),
    canAccessFinancial: (resourceId?: string) =>
      canAccessResource('financial', resourceId),
    canAccessSettings: (resourceId?: string) =>
      canAccessResource('settings', resourceId),

    // Utility functions
    hasAnyPermission: (permissions: Permission[], resourceId?: string) =>
      permissions.some((permission) => hasPermission(permission, resourceId)),

    hasAllPermissions: (permissions: Permission[], resourceId?: string) =>
      permissions.every((permission) => hasPermission(permission, resourceId)),

    // State
    isLoading,
    error,
  };
};

// Helper functions to map resources to permissions
const getReadPermission = (resource: string): Permission => {
  const permissionMap: Record<string, Permission> = {
    users: Permission.USERS_READ,
    properties: Permission.PROPERTIES_READ,
    bookings: Permission.BOOKINGS_READ,
    customers: Permission.CUSTOMERS_READ,
    staff: Permission.STAFF_READ,
    analytics: Permission.ANALYTICS_READ,
    cms: Permission.CMS_READ,
    financial: Permission.FINANCIAL_READ,
    settings: Permission.SETTINGS_READ,
    menu: Permission.MENU_READ,
    orders: Permission.ORDERS_READ,
    payments: Permission.PAYMENTS_READ,
    loyalty: Permission.LOYALTY_READ,
    inventory: Permission.INVENTORY_READ,
    calendar: Permission.CALENDAR_READ,
    spa: Permission.SPA_READ,
    conference: Permission.CONFERENCE_READ,
    transportation: Permission.TRANSPORTATION_READ,
    ai: Permission.AI_READ,
    reports: Permission.REPORTS_READ,
    notifications: Permission.NOTIFICATIONS_READ,
    email: Permission.EMAIL_READ,
    files: Permission.FILES_READ,
  };

  return permissionMap[resource] || Permission.USERS_READ;
};

const getWritePermission = (resource: string): Permission => {
  const permissionMap: Record<string, Permission> = {
    users: Permission.USERS_WRITE,
    properties: Permission.PROPERTIES_WRITE,
    bookings: Permission.BOOKINGS_WRITE,
    customers: Permission.CUSTOMERS_WRITE,
    staff: Permission.STAFF_WRITE,
    analytics: Permission.ANALYTICS_WRITE,
    cms: Permission.CMS_WRITE,
    financial: Permission.FINANCIAL_WRITE,
    settings: Permission.SETTINGS_WRITE,
    menu: Permission.MENU_WRITE,
    orders: Permission.ORDERS_WRITE,
    payments: Permission.PAYMENTS_WRITE,
    loyalty: Permission.LOYALTY_WRITE,
    inventory: Permission.INVENTORY_WRITE,
    calendar: Permission.CALENDAR_WRITE,
    spa: Permission.SPA_WRITE,
    conference: Permission.CONFERENCE_WRITE,
    transportation: Permission.TRANSPORTATION_WRITE,
    ai: Permission.AI_WRITE,
    reports: Permission.REPORTS_WRITE,
    notifications: Permission.NOTIFICATIONS_WRITE,
    email: Permission.EMAIL_WRITE,
    files: Permission.FILES_WRITE,
  };

  return permissionMap[resource] || Permission.USERS_WRITE;
};

const getDeletePermission = (resource: string): Permission => {
  const permissionMap: Record<string, Permission> = {
    users: Permission.USERS_DELETE,
    properties: Permission.PROPERTIES_DELETE,
    bookings: Permission.BOOKINGS_DELETE,
    customers: Permission.CUSTOMERS_DELETE,
    staff: Permission.STAFF_DELETE,
    cms: Permission.CMS_DELETE,
    financial: Permission.FINANCIAL_DELETE,
    menu: Permission.MENU_DELETE,
    orders: Permission.ORDERS_DELETE,
    payments: Permission.PAYMENTS_DELETE,
    loyalty: Permission.LOYALTY_DELETE,
    inventory: Permission.INVENTORY_DELETE,
    calendar: Permission.CALENDAR_DELETE,
    spa: Permission.SPA_DELETE,
    conference: Permission.CONFERENCE_DELETE,
    transportation: Permission.TRANSPORTATION_DELETE,
    files: Permission.FILES_DELETE,
  };

  return permissionMap[resource] || Permission.USERS_DELETE;
};

const getManagePermission = (resource: string): Permission => {
  const permissionMap: Record<string, Permission> = {
    users: Permission.USERS_MANAGE,
    properties: Permission.PROPERTIES_MANAGE,
    bookings: Permission.BOOKINGS_MANAGE,
    customers: Permission.CUSTOMERS_MANAGE,
    staff: Permission.STAFF_MANAGE,
    analytics: Permission.ANALYTICS_MANAGE,
    cms: Permission.CMS_MANAGE,
    financial: Permission.FINANCIAL_MANAGE,
    settings: Permission.SETTINGS_MANAGE,
    menu: Permission.MENU_MANAGE,
    orders: Permission.ORDERS_MANAGE,
    payments: Permission.PAYMENTS_MANAGE,
    loyalty: Permission.LOYALTY_MANAGE,
    inventory: Permission.INVENTORY_MANAGE,
    calendar: Permission.CALENDAR_MANAGE,
    spa: Permission.SPA_MANAGE,
    conference: Permission.CONFERENCE_MANAGE,
    transportation: Permission.TRANSPORTATION_MANAGE,
    ai: Permission.AI_MANAGE,
    reports: Permission.REPORTS_MANAGE,
    notifications: Permission.NOTIFICATIONS_MANAGE,
    email: Permission.EMAIL_MANAGE,
    files: Permission.FILES_MANAGE,
  };

  return permissionMap[resource] || Permission.USERS_MANAGE;
};

// Role management hook
export const useRoles = () => {
  const { hasRole, hasAnyRole, hasAllRoles } = useRBAC();

  const isSuperAdmin = (): boolean => {
    return hasRole(UserRole.SUPER_ADMIN);
  };

  const isAdmin = (): boolean => {
    return hasRole(UserRole.ADMIN) || hasRole(UserRole.SUPER_ADMIN);
  };

  const isManager = (): boolean => {
    return hasRole(UserRole.MANAGER);
  };

  const isStaff = (): boolean => {
    return hasRole(UserRole.STAFF);
  };

  const isGuest = (): boolean => {
    return hasRole(UserRole.GUEST);
  };

  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isSuperAdmin,
    isAdmin,
    isManager,
    isStaff,
    isGuest,
  };
};
