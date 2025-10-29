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
