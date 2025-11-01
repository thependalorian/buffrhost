/**
 * RBAC Zod Schemas
 * Validation schemas for Role-Based Access Control
 */

import { z } from 'zod';

export const PermissionSchema = z.enum([
  'users:read',
  'users:write',
  'users:delete',
  'users:manage',
  'roles:read',
  'roles:write',
  'roles:delete',
  'roles:manage',
  'permissions:read',
  'permissions:write',
  'permissions:manage',
  'tenants:read',
  'tenants:write',
  'tenants:delete',
  'tenants:manage',
  'properties:read',
  'properties:write',
  'properties:delete',
  'properties:manage',
  'hotel_configuration:read',
  'hotel_configuration:write',
  'hotel_configuration:delete',
  'hotel_configuration:manage',
  'bookings:read',
  'bookings:write',
  'bookings:delete',
  'bookings:manage',
  'financial:read',
  'financial:write',
  'financial:delete',
  'financial:manage',
  'settings:read',
  'settings:write',
  'settings:manage',
  'analytics:read',
  'analytics:write',
  'analytics:manage',
  'customers:read',
  'customers:write',
  'customers:delete',
  'customers:manage',
  'staff:read',
  'staff:write',
  'staff:delete',
  'staff:manage',
  'menu:read',
  'menu:write',
  'menu:delete',
  'menu:manage',
  'orders:read',
  'orders:write',
  'orders:delete',
  'orders:manage',
  'payments:read',
  'payments:write',
  'payments:delete',
  'payments:manage',
  'cms:read',
  'cms:write',
  'cms:delete',
  'cms:manage',
  'loyalty:read',
  'loyalty:write',
  'loyalty:delete',
  'loyalty:manage',
  'inventory:read',
  'inventory:write',
  'inventory:delete',
  'inventory:manage',
  'calendar:read',
  'calendar:write',
  'calendar:delete',
  'calendar:manage',
  'spa:read',
  'spa:write',
  'spa:delete',
  'spa:manage',
  'conference:read',
  'conference:write',
  'conference:delete',
  'conference:manage',
  'transportation:read',
  'transportation:write',
  'transportation:delete',
  'transportation:manage',
  'ai:read',
  'ai:write',
  'ai:manage',
  'reports:read',
  'reports:write',
  'reports:manage',
  'notifications:read',
  'notifications:write',
  'notifications:manage',
  'email:read',
  'email:write',
  'email:manage',
  'files:read',
  'files:write',
  'files:delete',
  'files:manage',
]);

export const RoleSchema = z.enum([
  'super_admin',
  'admin',
  'manager',
  'staff',
  'guest',
]);

export const UserRoleSchema = z.enum([
  'super_admin',
  'admin',
  'manager',
  'staff',
  'guest',
]);

export const PermissionScopeSchema = z.enum([
  'global',
  'tenant',
  'property',
  'user',
]);

export const UserPermissionSchema = z.object({
  permission: PermissionSchema,
  granted: z.boolean(),
  source: z.string(),
});

export const UserRoleAssignmentSchema = z.object({
  user_id: z.string().uuid(),
  role: UserRoleSchema,
  assigned_by: z.string().uuid(),
  assigned_at: z.date(),
});

export const RolePermissionSchema = z.object({
  role: RoleSchema,
  permissions: z.array(PermissionSchema),
  scope: PermissionScopeSchema,
});

export const PermissionCheckSchema = z.object({
  user_id: z.string().uuid(),
  permission: PermissionSchema,
  resource_id: z.string().optional(),
  scope: PermissionScopeSchema.optional(),
});

export const RBACContextSchema = z.object({
  user_id: z.string().uuid(),
  role: UserRoleSchema,
  permissions: z.array(PermissionSchema),
  tenant_id: z.string().uuid().optional(),
  property_id: z.string().uuid().optional(),
});

export const RoleCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  permissions: z.array(PermissionSchema),
  scope: PermissionScopeSchema,
});

export const RoleUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  permissions: z.array(PermissionSchema).optional(),
  scope: PermissionScopeSchema.optional(),
});

export const PermissionGrantSchema = z.object({
  user_id: z.string().uuid(),
  permission: PermissionSchema,
  resource_id: z.string().optional(),
  scope: PermissionScopeSchema,
  expires_at: z.date().optional(),
});

export const PermissionRevokeSchema = z.object({
  user_id: z.string().uuid(),
  permission: PermissionSchema,
  resource_id: z.string().optional(),
});

export const RoleAssignmentSchema = z.object({
  user_id: z.string().uuid(),
  role: UserRoleSchema,
  assigned_by: z.string().uuid(),
  expires_at: z.date().optional(),
});

export const RoleRemovalSchema = z.object({
  user_id: z.string().uuid(),
  role: UserRoleSchema,
  removed_by: z.string().uuid(),
});

export const PermissionAuditSchema = z.object({
  user_id: z.string().uuid(),
  action: z.enum(['grant', 'revoke', 'assign', 'remove']),
  permission: PermissionSchema.optional(),
  role: UserRoleSchema.optional(),
  resource_id: z.string().optional(),
  performed_by: z.string().uuid(),
  timestamp: z.date(),
});

export const RBACSearchSchema = z.object({
  user_id: z.string().uuid().optional(),
  role: UserRoleSchema.optional(),
  permission: PermissionSchema.optional(),
  scope: PermissionScopeSchema.optional(),
  tenant_id: z.string().uuid().optional(),
  property_id: z.string().uuid().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const RBACStatsSchema = z.object({
  total_users: z.number().int(),
  total_roles: z.number().int(),
  total_permissions: z.number().int(),
  role_distribution: z.record(z.string(), z.number().int()),
  permission_usage: z.record(z.string(), z.number().int()),
  recent_assignments: z.number().int(),
});
