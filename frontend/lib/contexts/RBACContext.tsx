'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  RBACContext as RBACContextType,
  Permission,
  UserRole,
} from '@/lib/types/rbac';
import { useAuth } from '@/hooks/useAuth';

interface RBACProviderProps {
  children: ReactNode;
}

interface RBACContextValue {
  context: RBACContextType | null;
  hasPermission: (permission: Permission, resourceId?: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasAllRoles: (roles: UserRole[]) => boolean;
  canAccessResource: (resourceType: string, resourceId?: string) => boolean;
  isLoading: boolean;
  error: string | null;
  refreshPermissions: () => Promise<void>;
}

const RBACContext = createContext<RBACContextValue | null>(null);

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};

export const RBACProvider: React.FC<RBACProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [context, setContext] = useState<RBACContextType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPermissions = useCallback(async () => {
    if (!user || !isAuthenticated) {
      setContext(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch real RBAC context from API
      const response = await fetch(`/api/rbac/user/${user.id}/permissions`);

      if (!response.ok) {
        throw new Error(`Failed to fetch permissions: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setContext({
          role: user.role as unknown,
          permissions: data.data.permissions || [],
          userId: user.id,
          lastUpdated: data.data.lastUpdated || new Date().toISOString(),
        });
      } else {
        throw new Error(data.error || 'Failed to fetch permissions');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch permissions'
      );
      console.error('RBAC Error:', err);

      // Fallback to mock data for development
      const mockContext = {
        role: user.role as unknown,
        permissions: user.permissions as unknown[],
        userId: user.id,
        lastUpdated: new Date().toISOString(),
      };
      setContext(mockContext);
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    fetchUserPermissions();
  }, [user, isAuthenticated, fetchUserPermissions]);

  const hasPermission = (
    permission: Permission,
    resourceId?: string
  ): boolean => {
    if (!context) return false;

    // Check if user has the specific permission
    const hasSpecificPermission = context.permissions.includes(permission);

    if (!hasSpecificPermission) return false;

    // If resourceId is provided, check resource-specific access
    if (resourceId) {
      // This would need to be implemented based on your resource access logic
      // For now, we'll assume global permissions apply to all resources
      return true;
    }

    return true;
  };

  const hasRole = (role: UserRole): boolean => {
    if (!context) return false;
    return context.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!context) return false;
    return roles.includes(context.role);
  };

  const hasAllRoles = (roles: UserRole[]): boolean => {
    if (!context) return false;
    // For single role system, this checks if user has the primary role
    return roles.includes(context.role);
  };

  const canAccessResource = (
    resourceType: string,
    resourceId?: string
  ): boolean => {
    if (!context) return false;

    // Map resource types to permissions
    const resourcePermissionMap: Record<string, Permission> = {
      users: Permission.USERS_READ,
      properties: Permission.PROPERTIES_READ,
      bookings: Permission.BOOKINGS_READ,
      customers: Permission.CUSTOMERS_READ,
      staff: Permission.STAFF_READ,
      analytics: Permission.ANALYTICS_READ,
      cms: Permission.CMS_READ,
      financial: Permission.FINANCIAL_READ,
      settings: Permission.SETTINGS_READ,
    };

    const requiredPermission = resourcePermissionMap[resourceType];
    if (!requiredPermission) return false;

    return hasPermission(requiredPermission, resourceId);
  };

  const refreshPermissions = async () => {
    await fetchUserPermissions();
  };

  const value: RBACContextValue = {
    context,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    canAccessResource,
    isLoading,
    error,
    refreshPermissions,
  };

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
};
