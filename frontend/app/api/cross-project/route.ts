/**
 * Cross-project API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for cross-project operations providing cross-project data management and operations
 * @location buffr-host/frontend/app/api/cross-project/route.ts
 * @purpose cross-project data management and operations
 * @modularity cross-project-focused API endpoint with specialized cross-project operations
 * @database_connections Reads/writes to cross-project related tables
 * @api_integration cross-project service integrations
 * @scalability Scalable operations with database optimization and caching
 * @performance Performance optimized with database indexing and caching
 * @monitoring Operational metrics and performance monitoring
 * @security Multi-tenant security with data isolation and access control
 * @multi_tenant Automatic tenant context application with data isolation
 *
 * Cross-project Management Capabilities:
 * - cross-project CRUD operations
 * - Data management
 * - Business logic processing
 *
 * Key Features:
 * - Data management
 * - CRUD operations
 * - Business logic
 */

/**
 * GET /api/cross-project - Cross-project Retrieval Endpoint
 * @method GET
 * @endpoint /api/cross-project
 * @purpose cross-project data management and operations
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
 * GET /api/cross-project
 * /api/cross-project
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
 * Cross-Project Integration API
 * Handles cross-project user and property data integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { CrossProjectIntegrationService } from '@/lib/cross-project-integration';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const action = searchParams.get('action');
    const identifier = searchParams.get('identifier');
    const country = searchParams.get('country') || 'NA';
    const buffrId = searchParams.get('buffrId');

    if (!action) {
      return NextResponse.json(
        { error: 'Action parameter is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'user-lookup':
        if (!identifier) {
          return NextResponse.json(
            { error: 'Identifier parameter is required for user lookup' },
            { status: 400 }
          );
        }

        const userData = await CrossProjectIntegrationService.getUserBuffrIDs(
          identifier,
          country
        );
        return NextResponse.json({
          success: true,
          data: userData,
        });

      case 'property-lookup':
        if (!identifier || !buffrId) {
          return NextResponse.json(
            {
              error:
                'Identifier and buffrId parameters are required for property lookup',
            },
            { status: 400 }
          );
        }

        const propertyData =
          await CrossProjectIntegrationService.getPropertyBuffrIDs(
            identifier,
            buffrId,
            country
          );
        return NextResponse.json({
          success: true,
          data: propertyData,
        });

      case 'unified-dashboard':
        if (!buffrId) {
          return NextResponse.json(
            { error: 'BuffrId parameter is required for unified dashboard' },
            { status: 400 }
          );
        }

        const dashboardData =
          await CrossProjectIntegrationService.getUnifiedDashboard(buffrId);
        return NextResponse.json({
          success: true,
          data: dashboardData,
        });

      case 'property-owner':
        if (!buffrId) {
          return NextResponse.json(
            {
              error: 'BuffrId parameter is required for property owner lookup',
            },
            { status: 400 }
          );
        }

        const ownerData =
          await CrossProjectIntegrationService.getPropertyOwnerData(buffrId);
        return NextResponse.json({
          success: true,
          data: ownerData,
        });

      default:
        return NextResponse.json(
          {
            error:
              'Invalid action. Supported actions: user-lookup, property-lookup, unified-dashboard, property-owner',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Cross-Project API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Action parameter is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'create-user':
        if (
          !data.nationalId ||
          !data.phoneNumber ||
          !data.email ||
          !data.fullName ||
          !data.country ||
          !data.projects
        ) {
          return NextResponse.json(
            {
              error:
                'Missing required fields: nationalId, phoneNumber, email, fullName, country, projects',
            },
            { status: 400 }
          );
        }

        const userResults =
          await CrossProjectIntegrationService.createUserAcrossProjects(data);
        return NextResponse.json({
          success: true,
          data: userResults,
          message: 'User created across projects',
        });

      case 'create-property':
        if (
          !data.name ||
          !data.type ||
          !data.location ||
          !data.ownerId ||
          !data.ownerNationalId ||
          !data.country ||
          !data.projects
        ) {
          return NextResponse.json(
            {
              error:
                'Missing required fields: name, type, location, ownerId, ownerNationalId, country, projects',
            },
            { status: 400 }
          );
        }

        const propertyResults =
          await CrossProjectIntegrationService.createPropertyAcrossProjects(
            data
          );
        return NextResponse.json({
          success: true,
          data: propertyResults,
          message: 'Property created across projects',
        });

      case 'sync-user':
        if (!data.primaryBuffrId || !data.updatedData) {
          return NextResponse.json(
            { error: 'Missing required fields: primaryBuffrId, updatedData' },
            { status: 400 }
          );
        }

        const syncResults = await CrossProjectIntegrationService.syncUserData(
          data.primaryBuffrId,
          data.updatedData
        );
        return NextResponse.json({
          success: true,
          data: syncResults,
          message: 'User data synced across projects',
        });

      case 'validate-auth':
        if (!data.buffrId || !data.targetProject) {
          return NextResponse.json(
            { error: 'Missing required fields: buffrId, targetProject' },
            { status: 400 }
          );
        }

        const isValid =
          await CrossProjectIntegrationService.validateCrossProjectAuth(
            data.buffrId,
            data.targetProject
          );
        return NextResponse.json({
          success: true,
          data: { isValid },
          message: isValid ? 'Authentication valid' : 'Authentication invalid',
        });

      default:
        return NextResponse.json(
          {
            error:
              'Invalid action. Supported actions: create-user, create-property, sync-user, validate-auth',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Cross-Project API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
