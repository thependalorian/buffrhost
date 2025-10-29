/**
 * Inventory Management API Route
 *
 * Handles inventory management for all property types
 * Features: CRUD operations, stock tracking, low stock alerts, supplier management
 * Location: app/api/secure/inventory/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// GET - Fetch Inventory Items
// =============================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const _propertyId = searchParams.get('property_id');
    const category = searchParams.get('category');
    const isActive = searchParams.get('is_active');
    const lowStock = searchParams.get('low_stock');

    if (!propertyId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property ID is required',
        },
        { status: 400 }
      );
    }

    const filters: unknown = {};
    if (category) filters.category = category;
    if (isActive !== null) filters.is_active = isActive === 'true';
    if (lowStock === 'true') filters.low_stock = true;

    const items = await DatabaseService.getInventoryItems(propertyId, filters);

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Inventory API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Create New Inventory Item
// =============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      property_id,
      item_code,
      item_name,
      category,
      subcategory,
      description,
      unit_of_measure,
      current_stock,
      minimum_stock,
      maximum_stock,
      unit_cost,
      selling_price,
      supplier,
      supplier_contact,
      reorder_point,
      reorder_quantity,
      expiry_date,
      storage_location,
      is_perishable,
    } = body;

    if (
      !property_id ||
      !item_code ||
      !item_name ||
      !category ||
      !unit_of_measure ||
      !unit_cost
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: property_id, item_code, item_name, category, unit_of_measure, unit_cost',
        },
        { status: 400 }
      );
    }

    const newItem = await DatabaseService.createInventoryItem({
      property_id,
      item_code,
      item_name,
      category,
      subcategory,
      description,
      unit_of_measure,
      current_stock: current_stock || 0,
      minimum_stock: minimum_stock || 0,
      maximum_stock,
      unit_cost,
      selling_price,
      supplier,
      supplier_contact,
      reorder_point,
      reorder_quantity,
      expiry_date,
      storage_location,
      is_perishable: is_perishable || false,
    });

    return NextResponse.json(
      {
        success: true,
        data: newItem,
        message: 'Inventory item created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Inventory Item Creation Error:', error);
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}

// =============================================================================
// PUT - Update Inventory Stock
// =============================================================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { item_id, quantity, reason, staff_id } = body;

    if (!item_id || quantity === undefined || !reason) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: item_id, quantity, reason',
        },
        { status: 400 }
      );
    }

    await DatabaseService.updateInventoryStock(
      item_id,
      quantity,
      reason,
      staff_id
    );

    return NextResponse.json({
      success: true,
      message: 'Inventory stock updated successfully',
    });
  } catch (error) {
    console.error('Inventory Stock Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update inventory stock' },
      { status: 500 }
    );
  }
}
