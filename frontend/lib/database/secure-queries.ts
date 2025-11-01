import { TenantContext, SecurityLevel } from '@/lib/types/ids';
import { tenantIsolation } from '@/lib/services/tenant-isolation';

export class SecureQueryBuilder {
  private context: TenantContext;
  private securityLevel: SecurityLevel;

  constructor(
    context: TenantContext,
    securityLevel: SecurityLevel = SecurityLevel.TENANT
  ) {
    this.context = context;
    this.securityLevel = securityLevel;
  }

  /**
   * Build a secure SELECT query
   */
  select(tableName: string, columns: string[] = ['*']) {
    const query = tenantIsolation.createSecureQuery(
      this.context,
      tableName,
      {},
      this.securityLevel
    );

    return {
      ...query,
      operation: 'SELECT',
      columns,
      // Add audit logging
      auditQuery: `
        INSERT INTO query_audit_log (
          user_id, tenant_id, table_name, operation, 
          security_level, timestamp, query_filters
        ) VALUES (
          '${this.context.userId}',
          '${this.context.tenantId}',
          '${tableName}',
          'SELECT',
          '${this.securityLevel}',
          NOW(),
          '${JSON.stringify(query.filters)}'
        )
      `,
    };
  }

  /**
   * Build a secure INSERT query
   */
  insert(tableName: string, data: Record<string, any>) {
    const query = tenantIsolation.createSecureQuery(
      this.context,
      tableName,
      {},
      this.securityLevel
    );

    // Ensure tenant_id is always included
    const secureData = {
      ...data,
      tenant_id: this.context.tenantId,
      created_by: this.context.userId,
      created_at: new Date().toISOString(),
    };

    return {
      ...query,
      operation: 'INSERT',
      data: secureData,
    };
  }

  /**
   * Build a secure UPDATE query
   */
  update(
    tableName: string,
    data: Record<string, any>,
    whereClause: Record<string, any> = {}
  ) {
    const query = tenantIsolation.createSecureQuery(
      this.context,
      tableName,
      whereClause,
      this.securityLevel
    );

    // Ensure tenant_id is always included in WHERE clause
    const secureWhere = {
      ...whereClause,
      tenant_id: this.context.tenantId,
    };

    const secureData = {
      ...data,
      updated_by: this.context.userId,
      updated_at: new Date().toISOString(),
    };

    return {
      ...query,
      operation: 'UPDATE',
      data: secureData,
      where: secureWhere,
    };
  }

  /**
   * Build a secure DELETE query
   */
  delete(tableName: string, whereClause: Record<string, any> = {}) {
    const query = tenantIsolation.createSecureQuery(
      this.context,
      tableName,
      whereClause,
      this.securityLevel
    );

    // Ensure tenant_id is always included in WHERE clause
    const secureWhere = {
      ...whereClause,
      tenant_id: this.context.tenantId,
    };

    return {
      ...query,
      operation: 'DELETE',
      where: secureWhere,
    };
  }
}

// Helper function to create secure query builder
export function createSecureQuery(
  context: TenantContext,
  securityLevel?: SecurityLevel
) {
  return new SecureQueryBuilder(context, securityLevel);
}

// Example usage patterns
export const QUERY_EXAMPLES = {
  // Get all bookings for a hotel
  getHotelBookings: (context: TenantContext, businessId: string) => {
    const query = createSecureQuery(context, SecurityLevel.BUSINESS);
    return query.select('bookings', [
      'id',
      'guest_id',
      'room_id',
      'check_in',
      'check_out',
      'status',
      'total_amount',
      'created_at',
    ]);
  },

  // Get menu items for a restaurant
  getRestaurantMenu: (context: TenantContext, businessId: string) => {
    const query = createSecureQuery(context, SecurityLevel.BUSINESS);
    return query.select('menu_items', [
      'id',
      'name',
      'description',
      'price',
      'category',
      'is_available',
      'created_at',
    ]);
  },

  // Get guest's cross-tenant bookings
  getGuestBookings: (context: TenantContext) => {
    const query = createSecureQuery(context, SecurityLevel.USER);
    return query.select('bookings', [
      'id',
      'business_id',
      'business_name',
      'check_in',
      'check_out',
      'status',
      'total_amount',
    ]);
  },
};
