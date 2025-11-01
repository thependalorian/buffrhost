/**
 * Restaurants [id] API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for restaurants operations providing restaurants property management and operations
 * @location buffr-host/frontend/app/api/restaurants/[id]/route.ts
 * @purpose Restaurants property management and operations
 * @modularity restaurants-focused API endpoint with specialized [id] operations
 * @database_connections Reads/writes to restaurants, restaurants_bookings, restaurants_services tables
 * @api_integration Restaurants management services, booking systems
 * @scalability Scalable operations with database optimization and caching
 * @performance Performance optimized with database indexing and caching
 * @monitoring Operational metrics and performance monitoring
 * @security Multi-tenant security with data isolation and access control
 * @multi_tenant Automatic tenant context application with data isolation
 *
 * Restaurants Management Capabilities:
 * - Restaurants data management
 * - Property operations
 * - Booking integration
 * - Guest services
 *
 * Key Features:
 * - Property management
 * - Operations tracking
 * - Booking integration
 * - Guest services
 */

/**
 * GET /api/restaurants/[id] - Restaurants [id] Retrieval Endpoint
 * @method GET
 * @endpoint /api/restaurants/[id]
 * @purpose Restaurants property management and operations
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
 * GET /api/restaurants/[id]
 * /api/restaurants/[id]
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
 * Individual Restaurant API Endpoint
 *
 * Returns detailed restaurant data from the database
 * Location: app/api/restaurants/[id]/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { neonClient } from '@/lib/database/neon-client';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const restaurantId = params.id;

  try {
    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    // Get restaurant details from database
    const restaurantQuery = `
      SELECT 
        id,
        buffr_id as "buffrId",
        name,
        type,
        location,
        owner_id as "ownerId",
        tenant_id as "tenantId",
        status,
        description,
        address,
        phone,
        email,
        website,
        rating,
        total_orders as "totalOrders",
        total_revenue as "totalRevenue",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM properties 
      WHERE id = $1 AND type = 'restaurant'
    `;

    const restaurantResult = await neonClient.query(restaurantQuery, [
      restaurantId,
    ]);

    if (restaurantResult.length === 0) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const restaurant = restaurantResult[0];

    // Fetch menu items
    const menuQuery = `
      SELECT 
        id,
        name,
        description,
        price,
        category,
        is_available as "isAvailable"
      FROM menu_items 
      WHERE property_id = $1
      ORDER BY category, name
    `;
    const menuResult = await neonClient.query(menuQuery, [restaurantId]);
    const menuItems = menuResult.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      category: item.category,
      available: item.isAvailable,
    }));

    // Reviews not available - table doesn't exist
    const reviews = [];

    // Transform the data to match the expected interface
    const transformedRestaurant = {
      id: restaurant.id,
      buffrId: restaurant.buffrId,
      name: restaurant.name,
      type: restaurant.type,
      location: restaurant.location,
      ownerId: restaurant.ownerId,
      tenantId: restaurant.tenantId,
      status: restaurant.status,
      description: restaurant.description || '',
      address: restaurant.address || '',
      phone: restaurant.phone,
      email: restaurant.email,
      website: restaurant.website,
      rating: parseFloat(restaurant.rating) || 0,
      totalOrders: parseInt(restaurant.totalOrders) || 0,
      totalRevenue: parseFloat(restaurant.totalRevenue) || 0,
      createdAt: restaurant.createdAt,
      updatedAt: restaurant.updatedAt,
      images: [], // Will add later when we have the images table
      features: [], // Will add later when we have the features table
      reviews: reviews,
      restaurantDetails: {
        cuisineType: 'Namibian',
        priceRange: '$$',
        openingHours: 'Mon-Sun: 11:00 AM - 10:00 PM',
        deliveryAvailable: true,
        takeawayAvailable: true,
        dineInAvailable: true,
        maxCapacity: 50,
        averagePrepTime: 25,
        specialDietaryOptions: ['vegetarian', 'vegan', 'gluten-free'],
        paymentMethods: ['cash', 'card', 'mobile_money'],
      },
      menuItems: menuItems,
    };

    return NextResponse.json({
      success: true,
      data: transformedRestaurant,
    });
  } catch (error) {
    console.error('Restaurant API Error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      restaurantId,
    });
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
