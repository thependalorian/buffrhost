/**
 * Order Management API Route
 *
 * Handles order creation and management for restaurants and services
 * Features: CRUD operations, order status tracking, payment processing
 * Location: app/api/secure/orders/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// GET - Fetch Orders
// =============================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const _propertyId = searchParams.get('property_id');
    const status = searchParams.get('status');
    const orderType = searchParams.get('order_type');
    const date = searchParams.get('date');

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
    if (status) filters.status = status;
    if (orderType) filters.order_type = orderType;
    if (date) filters.date = date;

    const orders = await DatabaseService.getOrders(propertyId, filters);

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Orders API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Create New Order
// =============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      property_id,
      customer_name,
      customer_phone,
      customer_email,
      table_id,
      order_type,
      special_instructions,
      staff_id,
      chef_id,
      items,
    } = body;

    if (!property_id || !order_type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: property_id, order_type',
        },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newOrder = await DatabaseService.createOrder({
      property_id,
      order_number: orderNumber,
      customer_name,
      customer_phone,
      customer_email,
      table_id,
      order_type,
      special_instructions,
      staff_id,
      chef_id,
    });

    // Add order items if provided
    if (items && items.length > 0) {
      let totalAmount = 0;

      for (const item of items) {
        const orderItem = await DatabaseService.addOrderItem({
          order_id: newOrder.id,
          menu_item_id: item.menu_item_id,
          item_name: item.item_name,
          item_description: item.item_description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
          special_instructions: item.special_instructions,
        });

        totalAmount += orderItem.total_price;
      }

      // Update order total
      // await DatabaseService.updateOrderTotal(newOrder.id, totalAmount);
    }

    return NextResponse.json(
      {
        success: true,
        data: newOrder,
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order Creation Error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// =============================================================================
// PUT - Update Order Status
// =============================================================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order ID and status are required',
        },
        { status: 400 }
      );
    }

    const updatedOrder = await DatabaseService.updateOrderStatus(id, status);

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order status updated successfully',
    });
  } catch (error) {
    console.error('Order Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
