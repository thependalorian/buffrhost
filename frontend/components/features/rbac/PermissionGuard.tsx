'use client';

import React, { ReactNode } from 'react';
import { usePermissions, useRoles } from '@/hooks/usePermissions';
import { Permission } from '@/lib/types/rbac';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: Permission;
  resource?: string;
  resourceId?: string;
  fallback?: ReactNode;
  requireAll?: boolean;
  permissions?: Permission[];
}

/**
 * PermissionGuard Component
 * Conditionally renders children based on user permissions
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  resource,
  resourceId,
  fallback = null,
  requireAll = false,
  permissions = [],
}) => {
  const { canRead, canWrite, canDelete, canManage } = usePermissions();

  const hasAccess = (): boolean => {
    // Check specific permission
    if (permission) {
      // For now, use canRead as a fallback for specific permissions
      return canRead('permissions', resourceId);
    }

    // Check resource-based permissions
    if (resource) {
      if (requireAll) {
        return canManage(resource, resourceId);
      } else {
        return canRead(resource, resourceId);
      }
    }

    // Check multiple permissions
    if (permissions.length > 0) {
      if (requireAll) {
        return permissions.every((perm) => canRead('permissions', resourceId));
      } else {
        return permissions.some((perm) => canRead('permissions', resourceId));
      }
    }

    return false;
  };

  return hasAccess() ? <>{children}</> : <>{fallback}</>;
};

interface RoleGuardProps {
  children: ReactNode;
  roles: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * RoleGuard Component
 * Conditionally renders children based on user roles
 */
const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  roles,
  requireAll = false,
  fallback = null,
}) => {
  const { hasAnyRole, hasAllRoles } = useRoles();

  const hasAccess = (): boolean => {
    if (requireAll) {
      return hasAllRoles(roles as unknown);
    } else {
      return hasAnyRole(roles as unknown);
    }
  };

  return hasAccess() ? <>{children}</> : <>{fallback}</>;
};

interface ResourceGuardProps {
  children: ReactNode;
  resource: string;
  resourceId?: string;
  action?: 'read' | 'write' | 'delete' | 'manage';
  fallback?: ReactNode;
}

/**
 * ResourceGuard Component
 * Conditionally renders children based on resource access
 */
const ResourceGuard: React.FC<ResourceGuardProps> = ({
  children,
  resource,
  resourceId,
  action = 'read',
  fallback = null,
}) => {
  const { canRead, canWrite, canDelete, canManage } = usePermissions();

  const hasAccess = (): boolean => {
    switch (action) {
      case 'read':
        return canRead(resource, resourceId);
      case 'write':
        return canWrite(resource, resourceId);
      case 'delete':
        return canDelete(resource, resourceId);
      case 'manage':
        return canManage(resource, resourceId);
      default:
        return false;
    }
  };

  return hasAccess() ? <>{children}</> : <>{fallback}</>;
};

interface ConditionalRenderProps {
  children: ReactNode;
  condition: boolean;
  fallback?: ReactNode;
}

/**
 * ConditionalRender Component
 * Generic conditional rendering component
 */
const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  condition,
  fallback = null,
}) => {
  return condition ? <>{children}</> : <>{fallback}</>;
};

// Export all guard components
export {
  PermissionGuard as default,
  RoleGuard,
  ResourceGuard,
  ConditionalRender,
};
