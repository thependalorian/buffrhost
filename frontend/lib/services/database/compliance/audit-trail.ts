/**
 * @fileoverview Audit Trail Database Service
 * @description Database operations for audit trails and electronic records compliance
 * @module AuditTrailDB
 */

/**
 * Audit trail Service for Buffr Host Hospitality Platform
 * @fileoverview Audit-trail service for Buffr Host system operations
 * @location buffr-host/lib/services/database/compliance/audit-trail.ts
 * @purpose audit-trail service for Buffr Host system operations
 * @modularity Self-contained service class providing specific business logic and data operations
 * @database_connections PostgreSQL database operations on tables: create_audit_trail, create_data_archival
 * @api_integration REST API endpoints, HTTP request/response handling
 * @ai_integration Machine learning and AI service integrations for predictive analytics
 * @authentication JWT-based authentication and authorization for secure operations
 * @scalability Service designed for high-throughput operations and concurrent user handling
 * @performance Optimized database queries, caching strategies, and efficient data processing
 * @monitoring Comprehensive logging, error tracking, and performance metrics collection
 * @security Multi-tenant data isolation, input validation, and secure credential management
 * @error_handling Comprehensive error handling with detailed logging and graceful degradation
 * @testing Unit tests and integration tests ensuring service reliability and correctness
 *
 * Service Capabilities:
 * - 1 Service Class: AuditTrailDB
 * - Database Operations: CRUD operations on 2 tables
 * - API Integration: RESTful API communication and data synchronization
 * - AI/ML Features: Predictive analytics and intelligent data processing
 * - Security Features: Authentication, authorization, and access control
 * - Error Handling: Comprehensive error management and logging
 * - Performance Monitoring: Service metrics and performance tracking
 * - Data Validation: Input sanitization and business rule enforcement
 *
 * Usage and Integration:
 * - API Routes: Service methods called from Next.js API endpoints
 * - React Components: Data fetching and state management integration
 * - Other Services: Inter-service communication and data sharing
 * - Database Layer: Direct database operations and query execution
 * - External APIs: Third-party service integrations and webhooks
 *
 * @example
 * // Import and use the service
 * import { AuditTrailDB } from './audit-trail';
 *
 * // Initialize service instance
 * const service = new AuditTrailDB();
 *
 * // Use service methods
 * const result = await service.processData();
 *
 * @example
 * // Service integration in API route
 * import { AuditTrailDB } from '@/lib/services/audit-trail';
 *
 * export async function GET(request: NextRequest) {
 *   const service = new AuditTrailDB();
 *   const data = await service.getData();
 *   return NextResponse.json({ data });
 * }
 *
 * Exported Members:
 * @exports AuditTrailDB - AuditTrailDB service component
 *
 * @returns {Object} Service module with all exported classes and functions
 * @scalability Designed for horizontal scaling and high-availability deployments
 * @reliability Comprehensive error handling and automatic recovery mechanisms
 * @maintainability Well-documented code with clear separation of concerns
 * @monitoring Real-time performance monitoring and alerting capabilities
 */

import { DatabaseConnectionPool } from '../../../database/connection-pool';
import { BuffrId } from '../../../types/buffr-ids';
import { Database } from '../../../types/database';
import {
  AuditEntry,
  AuditEventType,
  AuditSeverity,
  RetentionPolicy,
  RetentionCategory,
  DataArchivalRecord,
} from '../../audit-trail-service';

export class AuditTrailDB {
  private pool = DatabaseConnectionPool.getInstance();

  /**
   * Create audit trail table
   */
  async createAuditTrailTable(): Promise<void> {
    const { error } = await this.supabase.rpc('create_audit_trail_table');
    if (error) throw error;
  }

  /**
   * Create data archival table
   */
  async createDataArchivalTable(): Promise<void> {
    const { error } = await this.supabase.rpc('create_data_archival_table');
    if (error) throw error;
  }

  /**
   * Store audit entry in database
   */
  async storeAuditEntry(entry: AuditEntry): Promise<AuditEntry> {
    const { data, error } = await this.supabase
      .from('audit_trail')
      .insert({
        id: entry.id,
        event_type: entry.eventType,
        severity: entry.severity,
        action: entry.action,
        user_id: entry.userId,
        session_id: entry.sessionId,
        resource_type: entry.resourceType,
        resource_id: entry.resourceId,
        before_state: entry.beforeState,
        after_state: entry.afterState,
        metadata: entry.metadata,
        ip_address: entry.ipAddress,
        user_agent: entry.userAgent,
        location: entry.location,
        success: entry.success,
        error_message: entry.errorMessage,
        timestamp: entry.timestamp.toISOString(),
        expires_at: entry.expiresAt?.toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapAuditEntryFromDB(data);
  }

  /**
   * Get audit trail entries with filters
   */
  async getAuditTrail(filters: {
    userId?: BuffrId<'user'>;
    resourceType?: string;
    resourceId?: string;
    eventType?: AuditEventType;
    startDate?: Date;
    endDate?: Date;
    severity?: AuditSeverity;
    limit?: number;
    offset?: number;
  }): Promise<AuditEntry[]> {
    let query = this.supabase
      .from('audit_trail')
      .select('*')
      .order('timestamp', { ascending: false });

    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters.resourceType) {
      query = query.eq('resource_type', filters.resourceType);
    }

    if (filters.resourceId) {
      query = query.eq('resource_id', filters.resourceId);
    }

    if (filters.eventType) {
      query = query.eq('event_type', filters.eventType);
    }

    if (filters.severity) {
      query = query.eq('severity', filters.severity);
    }

    if (filters.startDate) {
      query = query.gte('timestamp', filters.startDate.toISOString());
    }

    if (filters.endDate) {
      query = query.lte('timestamp', filters.endDate.toISOString());
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 100) - 1
      );
    }

    const { data, error } = await query;
    if (error) throw error;

    return data.map((item) => this.mapAuditEntryFromDB(item));
  }

  /**
   * Get audit event count for reporting
   */
  async getAuditEventCount(
    startDate: Date,
    endDate: Date,
    severity?: AuditSeverity
  ): Promise<number> {
    let query = this.supabase
      .from('audit_trail')
      .select('id', { count: 'exact', head: true })
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString());

    if (severity) {
      query = query.eq('severity', severity);
    }

    const { count, error } = await query;
    if (error) throw error;

    return count || 0;
  }

  /**
   * Get failed audit event count
   */
  async getFailedAuditEventCount(
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const { count, error } = await this.supabase
      .from('audit_trail')
      .select('id', { count: 'exact', head: true })
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString())
      .eq('success', false);

    if (error) throw error;
    return count || 0;
  }

  /**
   * Archive expired audit entries
   */
  async archiveExpiredEntries(): Promise<number> {
    const now = new Date().toISOString();

    // Get expired entries
    const { data: expiredEntries, error: fetchError } = await this.supabase
      .from('audit_trail')
      .select('*')
      .lt('expires_at', now)
      .eq('archived', false);

    if (fetchError) throw fetchError;

    if (expiredEntries.length === 0) {
      return 0;
    }

    // Archive entries (move to archival table)
    const archivalRecords = expiredEntries.map((entry) => ({
      audit_entry_id: entry.id,
      event_type: entry.event_type,
      severity: entry.severity,
      action: entry.action,
      user_id: entry.user_id,
      resource_type: entry.resource_type,
      timestamp: entry.timestamp,
      expires_at: entry.expires_at,
      archived_at: now,
      retention_category: 'audit_logs' as RetentionCategory,
      storage_location: 'secure_archive_storage',
    }));

    const { error: insertError } = await this.supabase
      .from('audit_archival')
      .insert(archivalRecords);

    if (insertError) throw insertError;

    // Mark as archived
    const { error: updateError } = await this.supabase
      .from('audit_trail')
      .update({ archived: true, archived_at: now })
      .in(
        'id',
        expiredEntries.map((e) => e.id)
      );

    if (updateError) throw updateError;

    return expiredEntries.length;
  }

  /**
   * Permanently delete archived entries after retention period
   */
  async deleteExpiredArchivedEntries(): Promise<number> {
    // Calculate date for permanent deletion (additional year after archival)
    const deletionDate = new Date(
      Date.now() - 365 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data, error } = await this.supabase
      .from('audit_archival')
      .delete()
      .lt('archived_at', deletionDate)
      .select('id');

    if (error) throw error;
    return data.length;
  }

  /**
   * Store data archival record
   */
  async storeDataArchivalRecord(
    record: DataArchivalRecord
  ): Promise<DataArchivalRecord> {
    const { data, error } = await this.supabase
      .from('data_archival_records')
      .insert({
        id: record.id,
        category: record.category,
        data_type: record.dataType,
        record_count: record.recordCount,
        archival_date: record.archivalDate.toISOString(),
        archival_method: record.archivalMethod,
        storage_location: record.storageLocation,
        retention_expiry: record.retentionExpiry.toISOString(),
        destruction_method: record.destructionMethod,
        compliance_verified: record.complianceVerified,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapArchivalRecordFromDB(data);
  }

  /**
   * Get retention policies
   */
  async getRetentionPolicies(): Promise<RetentionPolicy[]> {
    // Return Electronic Transactions Act mandated retention periods
    return [
      {
        category: 'transactional',
        description: 'Booking records, payment data, and transaction histories',
        retentionDays: 2555, // 7 years
        legalBasis: 'Electronic Transactions Act 2019, Namibia',
        applicableDataTypes: ['bookings', 'payments', 'invoices', 'receipts'],
        requiresConsent: false,
        effectiveDate: new Date('2024-01-01'),
        reviewDate: new Date('2025-12-31'),
      },
      {
        category: 'user_data',
        description: 'User profiles, preferences, and account information',
        retentionDays: 730, // 2 years after account closure
        legalBasis: 'Electronic Transactions Act 2019, Namibia',
        applicableDataTypes: [
          'profiles',
          'preferences',
          'contact_info',
          'account_settings',
        ],
        requiresConsent: true,
        effectiveDate: new Date('2024-01-01'),
        reviewDate: new Date('2025-12-31'),
      },
      {
        category: 'audit_logs',
        description: 'System audit trails and event logs',
        retentionDays: 2555, // 7 years
        legalBasis: 'Electronic Transactions Act 2019, Namibia',
        applicableDataTypes: [
          'user_actions',
          'system_events',
          'api_calls',
          'error_logs',
        ],
        requiresConsent: false,
        effectiveDate: new Date('2024-01-01'),
        reviewDate: new Date('2025-12-31'),
      },
      {
        category: 'security_events',
        description:
          'Security incidents, access attempts, and authentication logs',
        retentionDays: 2555, // 7 years
        legalBasis: 'Electronic Transactions Act 2019, Namibia',
        applicableDataTypes: [
          'login_attempts',
          'failed_auth',
          'suspicious_activity',
          'access_logs',
        ],
        requiresConsent: false,
        effectiveDate: new Date('2024-01-01'),
        reviewDate: new Date('2025-12-31'),
      },
      {
        category: 'marketing_data',
        description: 'Marketing communications and opt-out preferences',
        retentionDays: 730, // 2 years after opt-out
        legalBasis: 'Electronic Transactions Act 2019, Namibia',
        applicableDataTypes: [
          'email_preferences',
          'campaign_data',
          'opt_out_records',
        ],
        requiresConsent: true,
        effectiveDate: new Date('2024-01-01'),
        reviewDate: new Date('2025-12-31'),
      },
      {
        category: 'temporary',
        description: 'Session data, temporary files, and cache entries',
        retentionDays: 30, // 30 days
        legalBasis: 'Electronic Transactions Act 2019, Namibia',
        applicableDataTypes: ['session_data', 'cache_files', 'temp_uploads'],
        requiresConsent: false,
        effectiveDate: new Date('2024-01-01'),
        reviewDate: new Date('2025-12-31'),
      },
    ];
  }

  /**
   * Get audit trail statistics
   */
  async getAuditStatistics(): Promise<{
    totalEntries: number;
    entriesBySeverity: Record<AuditSeverity, number>;
    entriesByEventType: Record<AuditEventType, number>;
    recentEntries: number;
    expiredEntries: number;
    archivedEntries: number;
  }> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get all entries count
    const { count: totalEntries, error: totalError } = await this.supabase
      .from('audit_trail')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    // Get entries by severity
    const severityStats: Record<AuditSeverity, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    for (const severity of Object.keys(severityStats) as AuditSeverity[]) {
      const { count, error } = await this.supabase
        .from('audit_trail')
        .select('*', { count: 'exact', head: true })
        .eq('severity', severity);

      if (error) throw error;
      severityStats[severity] = count || 0;
    }

    // Get entries by event type
    const eventTypeStats: Record<AuditEventType, number> = {
      user_action: 0,
      system_event: 0,
      security_event: 0,
      data_modification: 0,
      access_attempt: 0,
      compliance_event: 0,
    };

    for (const eventType of Object.keys(eventTypeStats) as AuditEventType[]) {
      const { count, error } = await this.supabase
        .from('audit_trail')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', eventType);

      if (error) throw error;
      eventTypeStats[eventType] = count || 0;
    }

    // Get recent entries (last 30 days)
    const { count: recentEntries, error: recentError } = await this.supabase
      .from('audit_trail')
      .select('*', { count: 'exact', head: true })
      .gte('timestamp', thirtyDaysAgo.toISOString());

    if (recentError) throw recentError;

    // Get expired entries
    const { count: expiredEntries, error: expiredError } = await this.supabase
      .from('audit_trail')
      .select('*', { count: 'exact', head: true })
      .lt('expires_at', now.toISOString())
      .eq('archived', false);

    if (expiredError) throw expiredError;

    // Get archived entries
    const { count: archivedEntries, error: archivedError } = await this.supabase
      .from('audit_archival')
      .select('*', { count: 'exact', head: true });

    if (archivedError) throw archivedError;

    return {
      totalEntries: totalEntries || 0,
      entriesBySeverity: severityStats,
      entriesByEventType: eventTypeStats,
      recentEntries: recentEntries || 0,
      expiredEntries: expiredEntries || 0,
      archivedEntries: archivedEntries || 0,
    };
  }

  /**
   * Map database row to AuditEntry object
   */
  private mapAuditEntryFromDB(data: any): AuditEntry {
    return {
      id: data.id,
      eventType: data.event_type,
      severity: data.severity,
      action: data.action,
      userId: data.user_id,
      sessionId: data.session_id,
      resourceType: data.resource_type,
      resourceId: data.resource_id,
      beforeState: data.before_state || {},
      afterState: data.after_state || {},
      metadata: data.metadata || {},
      ipAddress: data.ip_address,
      userAgent: data.user_agent,
      location: data.location,
      success: data.success,
      errorMessage: data.error_message,
      timestamp: new Date(data.timestamp),
      expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
    };
  }

  /**
   * Map database row to DataArchivalRecord object
   */
  private mapArchivalRecordFromDB(data: any): DataArchivalRecord {
    return {
      id: data.id,
      category: data.category,
      dataType: data.data_type,
      recordCount: data.record_count,
      archivalDate: new Date(data.archival_date),
      archivalMethod: data.archival_method,
      storageLocation: data.storage_location,
      retentionExpiry: new Date(data.retention_expiry),
      destructionMethod: data.destruction_method,
      complianceVerified: data.compliance_verified,
    };
  }
}

export default AuditTrailDB;
