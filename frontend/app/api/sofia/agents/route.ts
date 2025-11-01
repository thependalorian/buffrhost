// /app/api/sofia/agents/route.ts

/**
 * Sofia Agents API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for sofia operations providing sofia data management and operations
 * @location buffr-host/frontend/app/api/sofia/agents/route.ts
 * @purpose sofia data management and operations
 * @modularity sofia-focused API endpoint with specialized agents operations
 * @database_connections Reads/writes to sofia related tables
 * @api_integration sofia service integrations
 * @scalability Scalable operations with database optimization and caching
 * @performance Performance optimized with database indexing and caching
 * @monitoring Operational metrics and performance monitoring
 * @security Multi-tenant security with data isolation and access control
 * @multi_tenant Automatic tenant context application with data isolation
 *
 * Sofia Management Capabilities:
 * - sofia CRUD operations
 * - Data management
 * - Business logic processing
 *
 * Key Features:
 * - Data management
 * - CRUD operations
 * - Business logic
 */

/**
 * GET /api/sofia/agents - Sofia Agents Retrieval Endpoint
 * @method GET
 * @endpoint /api/sofia/agents
 * @purpose sofia data management and operations
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
 * GET /api/sofia/agents
 * /api/sofia/agents
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
import { NextRequest, NextResponse } from 'next/server';
import { createProtectedRoute } from '@/lib/middleware/api-protection';
import { SofiaService } from '@/lib/services/sofiaService';

export const GET = createProtectedRoute(
  async (req: NextRequest, context: any) => {
    try {
      const { searchParams } = new URL(req.url);
      const propertyId = searchParams.get('propertyId');

      const sofiaService = new SofiaService();
      const result = await sofiaService.getAllAgents(
        context.tenantId,
        propertyId || undefined
      );

      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch Sofia agents' },
        { status: 500 }
      );
    }
  },
  { requiredIds: ['tenantId'], securityLevel: 'BUSINESS' }
);

export const POST = createProtectedRoute(
  async (req: NextRequest, context: any) => {
    try {
      const body = await req.json();
      const sofiaService = new SofiaService();
      const agent = await sofiaService.createAgent(body, context.tenantId);

      return NextResponse.json(agent, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to create Sofia agent' },
        { status: 500 }
      );
    }
  },
  { requiredIds: ['tenantId'], securityLevel: 'BUSINESS' }
);
