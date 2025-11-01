/**
 * Compliance Electronic-signatures API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for compliance operations providing compliance data management and operations
 * @location buffr-host/frontend/app/api/compliance/electronic-signatures/route.ts
 * @purpose compliance data management and operations
 * @modularity compliance-focused API endpoint with specialized electronic-signatures operations
 * @database_connections Reads/writes to compliance related tables
 * @api_integration compliance service integrations
 * @scalability Scalable operations with database optimization and caching
 * @performance Performance optimized with database indexing and caching
 * @monitoring Operational metrics and performance monitoring
 * @security Multi-tenant security with data isolation and access control
 * @multi_tenant Automatic tenant context application with data isolation
 *
 * Compliance Management Capabilities:
 * - compliance CRUD operations
 * - Data management
 * - Business logic processing
 *
 * Key Features:
 * - Data management
 * - CRUD operations
 * - Business logic
 */

/**
 * GET /api/compliance/electronic-signatures - Compliance Electronic-signatures Retrieval Endpoint
 * @method GET
 * @endpoint /api/compliance/electronic-signatures
 * @purpose compliance data management and operations
 * @authentication JWT authentication required - Bearer token in Authorization header
 * @authorization JWT authorization required - Bearer token in Authorization header
 * @permissions Appropriate permissions based on operation type
 * @rate_limit Standard API rate limiter applied
 * @caching Appropriate caching strategy applied
 * @returns {Promise<NextResponse>} API operation result with success status and data
 * @security Multi-tenant security with data isolation and access control
 * @database_queries Optimized database queries with appropriate indexing and performance
 * @performance Performance optimized with database indexing and caching
 * @example
 * GET /api/compliance/electronic-signatures
 * /api/compliance/electronic-signatures
 *
 * Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "result": "success"
 *   }
 * }
 *
 * Error Response (400/500):
 * {
 *   "success": false,
 *   "error": {
 *     "code": "ERROR_CODE",
 *     "message": "Error description"
 *   }
 * }
 */
/**
 * @fileoverview Electronic Signatures API Route
 * @description API endpoints for electronic signature compliance
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  ElectronicSignatureService,
  SignatureType,
} from '@/lib/services/electronic-signature-service';
import { createProtectedRoute } from '@/lib/middleware/api-wrapper';
import { apiSuccess, apiError } from '@/lib/middleware/api-wrapper';

/**
 * POST /api/compliance/electronic-signatures
 * Create a new electronic signature
 */
async function createSignature(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentContent, documentType, signatureType = 'advanced' } = body;

    // Get user ID from authenticated request
    const userId = (request as any).user?.id;
    if (!userId) {
      return apiError('Authentication required', 401);
    }

    if (!documentContent || !documentType) {
      return apiError('Document content and type are required', 400);
    }

    // Get client information
    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const signature = await ElectronicSignatureService.createSignature({
      signerId: userId,
      documentContent,
      documentType,
      signatureType,
      ipAddress,
      userAgent,
    });

    return apiSuccess(signature, 'Electronic signature created successfully');
  } catch (error) {
    console.error('Failed to create electronic signature:', error);
    return apiError('Failed to create electronic signature', 500);
  }
}

/**
 * GET /api/compliance/electronic-signatures
 * Get user's electronic signatures
 */
async function getUserSignatures(request: NextRequest) {
  try {
    const userId = (request as any).user?.id;
    if (!userId) {
      return apiError('Authentication required', 401);
    }

    const { searchParams } = new URL(request.url);
    const documentType = searchParams.get('documentType');
    const isValid =
      searchParams.get('isValid') === 'true'
        ? true
        : searchParams.get('isValid') === 'false'
          ? false
          : undefined;
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!)
      : undefined;

    const signatures = await ElectronicSignatureService.getUserSignatures(
      userId,
      {
        documentType: documentType || undefined,
        isValid,
        limit,
      }
    );

    return apiSuccess(
      signatures,
      'Electronic signatures retrieved successfully'
    );
  } catch (error) {
    console.error('Failed to get electronic signatures:', error);
    return apiError('Failed to retrieve electronic signatures', 500);
  }
}

/**
 * DELETE /api/compliance/electronic-signatures/[signatureId]
 * Revoke an electronic signature
 */
async function revokeSignature(
  request: NextRequest,
  { params }: { params: { signatureId: string } }
) {
  try {
    const userId = (request as any).user?.id;
    if (!userId) {
      return apiError('Authentication required', 401);
    }

    const { signatureId } = params;
    if (!signatureId) {
      return apiError('Signature ID is required', 400);
    }

    const success = await ElectronicSignatureService.revokeSignature(
      signatureId,
      userId
    );

    if (!success) {
      return apiError('Signature not found or could not be revoked', 404);
    }

    return apiSuccess(
      { revoked: true },
      'Electronic signature revoked successfully'
    );
  } catch (error) {
    console.error('Failed to revoke electronic signature:', error);
    return apiError('Failed to revoke electronic signature', 500);
  }
}

/**
 * POST /api/compliance/electronic-signatures/verify
 * Verify an electronic signature
 */
async function verifySignature(request: NextRequest) {
  try {
    const body = await request.json();
    const { signature, documentContent } = body;

    if (!signature || !documentContent) {
      return apiError('Signature and document content are required', 400);
    }

    const verification = await ElectronicSignatureService.verifySignature(
      signature,
      documentContent
    );

    return apiSuccess(verification, 'Signature verification completed');
  } catch (error) {
    console.error('Failed to verify electronic signature:', error);
    return apiError('Failed to verify electronic signature', 500);
  }
}

// Export protected route handlers
export const POST = createProtectedRoute(createSignature);
export const GET = createProtectedRoute(getUserSignatures);

// For signature verification (public endpoint for document verification)
export const PUT = verifySignature;

// DELETE handler for revoking signatures
export const DELETE = createProtectedRoute(revokeSignature);
