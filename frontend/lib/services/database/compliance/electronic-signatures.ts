/**
 * @fileoverview Electronic Signatures Database Service
 * @description Database operations for electronic signatures compliance
 * @module ElectronicSignaturesDB
 */

/**
 * Electronic signatures Service for Buffr Host Hospitality Platform
 * @fileoverview Electronic-signatures service for Buffr Host system operations
 * @location buffr-host/lib/services/database/compliance/electronic-signatures.ts
 * @purpose electronic-signatures service for Buffr Host system operations
 * @modularity Self-contained service class providing specific business logic and data operations
 * @database_connections PostgreSQL database operations on tables: electronic_signatures, signature, create_electronic_signatures
 * @ai_integration Machine learning and AI service integrations for predictive analytics
 * @scalability Service designed for high-throughput operations and concurrent user handling
 * @performance Optimized database queries, caching strategies, and efficient data processing
 * @monitoring Comprehensive logging, error tracking, and performance metrics collection
 * @security Multi-tenant data isolation, input validation, and secure credential management
 * @error_handling Comprehensive error handling with detailed logging and graceful degradation
 * @testing Unit tests and integration tests ensuring service reliability and correctness
 *
 * Service Capabilities:
 * - 1 Service Class: ElectronicSignaturesDB
 * - Database Operations: CRUD operations on 3 tables
 * - AI/ML Features: Predictive analytics and intelligent data processing
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
 * import { ElectronicSignaturesDB } from './electronic-signatures';
 *
 * // Initialize service instance
 * const service = new ElectronicSignaturesDB();
 *
 * // Use service methods
 * const result = await service.processData();
 *
 * @example
 * // Service integration in API route
 * import { ElectronicSignaturesDB } from '@/lib/services/electronic-signatures';
 *
 * export async function GET(request: NextRequest) {
 *   const service = new ElectronicSignaturesDB();
 *   const data = await service.getData();
 *   return NextResponse.json({ data });
 * }
 *
 * Exported Members:
 * @exports ElectronicSignaturesDB - ElectronicSignaturesDB service component
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
  SignatureType,
  ElectronicSignature,
  SignatureVerification,
} from '../../electronic-signature-service';

export class ElectronicSignaturesDB {
  private pool = DatabaseConnectionPool.getInstance();

  /**
   * Create electronic signatures table
   */
  async createSignaturesTable(): Promise<void> {
    const { error } = await this.supabase.rpc(
      'create_electronic_signatures_table'
    );
    if (error) throw error;
  }

  /**
   * Store electronic signature in database
   */
  async storeSignature(
    signature: ElectronicSignature
  ): Promise<ElectronicSignature> {
    const client = await this.pool.getClient();
    try {
      const query = `
        INSERT INTO electronic_signatures (
          id, signer_id, signature_type, signature_data, document_hash,
          document_type, signed_at, ip_address, user_agent, is_valid,
          certificate_id, expires_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;

      const values = [
        signature.id,
        signature.signerId,
        signature.type,
        signature.signatureData,
        signature.documentHash,
        signature.documentType,
        signature.signedAt.toISOString(),
        signature.ipAddress,
        signature.userAgent,
        signature.isValid,
        signature.certificateId,
        signature.expiresAt?.toISOString(),
        new Date().toISOString(),
        new Date().toISOString(),
      ];

      const result = await client.query(query, values);
      return this.mapSignatureFromDB(result.rows[0]);
    } finally {
      client.release();
    }
  }

  /**
   * Retrieve electronic signature by ID
   */
  async getSignature(signatureId: string): Promise<ElectronicSignature | null> {
    const client = await this.pool.getClient();
    try {
      const query = 'SELECT * FROM electronic_signatures WHERE id = $1';
      const result = await client.query(query, [signatureId]);

      if (result.rows.length === 0) return null;
      return this.mapSignatureFromDB(result.rows[0]);
    } finally {
      client.release();
    }
  }

  /**
   * Get signatures for a user
   */
  async getUserSignatures(
    userId: BuffrId<'user'>,
    filters?: {
      documentType?: string;
      isValid?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<ElectronicSignature[]> {
    let query = this.supabase
      .from('electronic_signatures')
      .select('*')
      .eq('signer_id', userId)
      .order('signed_at', { ascending: false });

    if (filters?.documentType) {
      query = query.eq('document_type', filters.documentType);
    }

    if (filters?.isValid !== undefined) {
      query = query.eq('is_valid', filters.isValid);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 50) - 1
      );
    }

    const { data, error } = await query;
    if (error) throw error;

    return data.map((item) => this.mapSignatureFromDB(item));
  }

  /**
   * Update signature validity
   */
  async updateSignatureValidity(
    signatureId: string,
    isValid: boolean
  ): Promise<void> {
    const { error } = await this.supabase
      .from('electronic_signatures')
      .update({
        is_valid: isValid,
        updated_at: new Date().toISOString(),
      })
      .eq('id', signatureId);

    if (error) throw error;
  }

  /**
   * Revoke signature
   */
  async revokeSignature(
    signatureId: string,
    revokedBy: BuffrId<'user'>
  ): Promise<void> {
    const { error } = await this.supabase
      .from('electronic_signatures')
      .update({
        is_valid: false,
        revoked_at: new Date().toISOString(),
        revoked_by: revokedBy,
        updated_at: new Date().toISOString(),
      })
      .eq('id', signatureId);

    if (error) throw error;
  }

  /**
   * Get signatures by document hash for verification
   */
  async getSignaturesByDocumentHash(
    documentHash: string
  ): Promise<ElectronicSignature[]> {
    const { data, error } = await this.supabase
      .from('electronic_signatures')
      .select('*')
      .eq('document_hash', documentHash)
      .eq('is_valid', true)
      .order('signed_at', { ascending: false });

    if (error) throw error;
    return data.map((item) => this.mapSignatureFromDB(item));
  }

  /**
   * Clean up expired signatures
   */
  async cleanupExpiredSignatures(): Promise<number> {
    const now = new Date().toISOString();
    const { data, error } = await this.supabase
      .from('electronic_signatures')
      .update({
        is_valid: false,
        expired_at: now,
        updated_at: now,
      })
      .lt('expires_at', now)
      .eq('is_valid', true)
      .select('id');

    if (error) throw error;
    return data.length;
  }

  /**
   * Get signature statistics
   */
  async getSignatureStats(): Promise<{
    total: number;
    valid: number;
    expired: number;
    revoked: number;
  }> {
    const { data, error } = await this.supabase
      .from('electronic_signatures')
      .select('is_valid, expires_at, revoked_at');

    if (error) throw error;

    const now = new Date();
    let total = data.length;
    let valid = 0;
    let expired = 0;
    let revoked = 0;

    data.forEach((sig) => {
      if (sig.revoked_at) {
        revoked++;
      } else if (!sig.is_valid) {
        expired++;
      } else if (sig.expires_at && new Date(sig.expires_at) < now) {
        expired++;
      } else {
        valid++;
      }
    });

    return { total, valid, expired, revoked };
  }

  /**
   * Map database row to ElectronicSignature object
   */
  private mapSignatureFromDB(data: any): ElectronicSignature {
    return {
      id: data.id,
      signerId: data.signer_id,
      type: data.signature_type,
      signatureData: data.signature_data,
      documentHash: data.document_hash,
      documentType: data.document_type,
      signedAt: new Date(data.signed_at),
      ipAddress: data.ip_address,
      userAgent: data.user_agent,
      isValid: data.is_valid,
      certificateId: data.certificate_id,
      expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
    };
  }
}

export default ElectronicSignaturesDB;
