/**
 * Cart Management API
 *
 * Handles shopping cart operations for checkout flow
 * Features: Create, update, retrieve cart with Neon PostgreSQL
 * Location: app/api/secure/cart/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { neonClient } from '@/lib/database/neon-client';

// POST - Create or update cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      propertyId,
      tenantId = 'default-tenant',
      cartItems = [],
      subtotal = 0,
      taxAmount = 0,
      serviceCharge = 0,
      totalAmount = 0,
      currency = 'NAD',
    } = body;

    if (!sessionId || !propertyId) {
      return NextResponse.json(
        { error: 'Session ID and Property ID are required' },
        { status: 400 }
      );
    }

    // Check if cart already exists
    const existingCart = await neonClient.query(
      `SELECT * FROM shopping_carts 
       WHERE session_id = $1 AND property_id = $2 AND tenant_id = $3 AND status = 'active'`,
      [sessionId, propertyId, tenantId]
    );

    if (existingCart.length > 0) {
      // Update existing cart
      const updatedCart = await neonClient.query(
        `UPDATE shopping_carts 
         SET cart_items = $1, subtotal = $2, tax_amount = $3, service_charge = $4, 
             total_amount = $5, currency = $6, updated_at = NOW()
         WHERE id = $7
         RETURNING *`,
        [
          JSON.stringify(cartItems),
          subtotal,
          taxAmount,
          serviceCharge,
          totalAmount,
          currency,
          existingCart[0].id,
        ]
      );

      return NextResponse.json({
        success: true,
        data: updatedCart[0],
        message: 'Cart updated successfully',
      });
    } else {
      // Create new cart
      const newCart = await neonClient.query(
        `INSERT INTO shopping_carts (
          session_id, property_id, tenant_id, cart_items, subtotal, 
          tax_amount, service_charge, total_amount, currency, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          sessionId,
          propertyId,
          tenantId,
          JSON.stringify(cartItems),
          subtotal,
          taxAmount,
          serviceCharge,
          totalAmount,
          currency,
          'active',
        ]
      );

      return NextResponse.json({
        success: true,
        data: newCart[0],
        message: 'Cart created successfully',
      });
    }
  } catch (error) {
    console.error('[CART_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process cart operation' },
      { status: 500 }
    );
  }
}

// GET - Retrieve cart
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id');
    const propertyId = url.searchParams.get('property_id');
    const tenantId = url.searchParams.get('tenant_id') || 'default-tenant';

    if (!sessionId || !propertyId) {
      return NextResponse.json(
        { error: 'Session ID and Property ID are required' },
        { status: 400 }
      );
    }

    const cart = await neonClient.query(
      `SELECT * FROM shopping_carts 
       WHERE session_id = $1 AND property_id = $2 AND tenant_id = $3 AND status = 'active'`,
      [sessionId, propertyId, tenantId]
    );

    if (cart.length === 0) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: cart[0],
    });
  } catch (error) {
    console.error('[CART_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve cart' },
      { status: 500 }
    );
  }
}

// DELETE - Clear cart
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id');
    const propertyId = url.searchParams.get('property_id');
    const tenantId = url.searchParams.get('tenant_id') || 'default-tenant';

    if (!sessionId || !propertyId) {
      return NextResponse.json(
        { error: 'Session ID and Property ID are required' },
        { status: 400 }
      );
    }

    await neonClient.query(
      `UPDATE shopping_carts 
       SET status = 'cancelled', updated_at = NOW()
       WHERE session_id = $1 AND property_id = $2 AND tenant_id = $3 AND status = 'active'`,
      [sessionId, propertyId, tenantId]
    );

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    console.error('[CART_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
