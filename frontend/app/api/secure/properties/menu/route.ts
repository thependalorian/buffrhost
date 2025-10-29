/**
 * Property Menu Management API Route
 *
 * Handles menu item creation and management for restaurants
 * Features: CRUD operations, categories, pricing, dietary info
 * Location: app/api/secure/properties/menu/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// GET - Fetch Property Menu Items
// =============================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const _propertyId = searchParams.get('property_id');
    const category = searchParams.get('category');
    const isAvailable = searchParams.get('is_available');
    const isFeatured = searchParams.get('is_featured');

    if (!propertyId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property ID is required',
        },
        { status: 400 }
      );
    }

    // Get menu items
    const menuItems = await DatabaseService.getPropertyMenuItems(propertyId, {
      category,
      isAvailable: isAvailable ? isAvailable === 'true' : undefined,
      isFeatured: isFeatured ? isFeatured === 'true' : undefined,
    });

    return NextResponse.json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    console.error('Property Menu API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Create New Menu Item
// =============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      property_id,
      category,
      name,
      description,
      price,
      currency,
      is_available,
      is_featured,
      allergens,
      dietary_info,
      preparation_time,
      spice_level,
      image_url,
      sort_order,
    } = body;

    // Validate required fields
    if (!property_id || !category || !name || !price) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: property_id, category, name, price',
        },
        { status: 400 }
      );
    }

    // Create menu item
    const newMenuItem = await DatabaseService.createPropertyMenuItem({
      property_id,
      category,
      name,
      description,
      price,
      currency,
      is_available,
      is_featured,
      allergens,
      dietary_info,
      preparation_time,
      spice_level,
      image_url,
      sort_order,
    });

    return NextResponse.json(
      {
        success: true,
        data: newMenuItem,
        message: 'Menu item created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Menu Item Creation Error:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}

// =============================================================================
// PUT - Update Menu Item
// =============================================================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Menu item ID is required',
        },
        { status: 400 }
      );
    }

    // Update menu item
    const updatedMenuItem = await DatabaseService.updatePropertyMenuItem(
      id,
      updateData
    );

    return NextResponse.json({
      success: true,
      data: updatedMenuItem,
      message: 'Menu item updated successfully',
    });
  } catch (error) {
    console.error('Menu Item Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Delete Menu Item
// =============================================================================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Menu item ID is required',
        },
        { status: 400 }
      );
    }

    // Delete menu item
    await DatabaseService.deletePropertyMenuItem(id);

    return NextResponse.json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    console.error('Menu Item Deletion Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}
