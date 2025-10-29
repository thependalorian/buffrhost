import { NextRequest, NextResponse } from 'next/server';
import { BusinessContext } from '@/lib/types/ids';
import { neonClient } from '@/lib/database/neon-client';

// Mock business context extraction
function extractBusinessContext(request: NextRequest): BusinessContext {
  const url = new URL(request.url);
  const tenantId = url.searchParams.get('tenant_id') || 'tenant_123';
  const businessId = url.searchParams.get('business_id') || 'business_456';
  const userId = url.searchParams.get('user_id') || 'user_789';

  return {
    tenantId,
    tenantType: 'restaurant',
    userId,
    role: 'guest',
    permissions: ['create_order', 'process_payment'],
    businessId,
    businessGroupId: 'group_456',
  };
}

// POST - Create order and process checkout
export async function POST(request: NextRequest) {
  try {
    const context = extractBusinessContext(request);
    const body = await request.json();
    const {
      session_id,
      order_type = 'dine_in',
      table_number,
      guest_name,
      guest_email,
      guest_phone,
      special_requests = '',
      payment_method,
      discount_code,
    } = body;

    if (!session_id || !guest_name || !payment_method) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: session_id, guest_name, payment_method',
        },
        { status: 400 }
      );
    }

    // Get cart
    const cartResult = await neonClient.query(
      `SELECT * FROM shopping_carts 
       WHERE session_id = $1 AND tenant_id = $2 AND property_id = $3 
       AND status = 'active'`,
      [session_id, context.tenantId, context.businessId]
    );

    if (cartResult.length === 0) {
      return NextResponse.json(
        { error: 'Cart not found or expired' },
        { status: 404 }
      );
    }

    const cart = cartResult[0];
    const cartItems = cart.cart_items || [];

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Generate order number
    const orderNumberResult = await neonClient.query(
      'SELECT generate_order_number()'
    );
    const orderNumber = orderNumberResult[0].generate_order_number;

    // Calculate discount if code provided
    let discountAmount = 0;
    if (discount_code) {
      const discountResult = await neonClient.query(
        `SELECT * FROM discounts 
         WHERE discount_code = $1 AND property_id = $2 AND tenant_id = $3 
         AND is_active = true AND valid_from <= NOW() 
         AND (valid_until IS NULL OR valid_until >= NOW())
         AND (usage_limit IS NULL OR used_count < usage_limit)
         AND minimum_order_amount <= $4`,
        [discount_code, context.businessId, context.tenantId, cart.subtotal]
      );

      if (discountResult.length > 0) {
        const discount = discountResult[0];
        if (discount.discount_type === 'percentage') {
          discountAmount = cart.subtotal * (discount.discount_value / 100);
          if (discount.maximum_discount_amount) {
            discountAmount = Math.min(
              discountAmount,
              discount.maximum_discount_amount
            );
          }
        } else {
          discountAmount = discount.discount_value;
        }

        // Update discount usage
        await neonClient.query(
          `UPDATE discounts SET used_count = used_count + 1 WHERE id = $1`,
          [discount.id]
        );
      }
    }

    const finalSubtotal = cart.subtotal - discountAmount;
    const finalTotal = cart.tax_amount + cart.service_charge + finalSubtotal;

    // Create order
    const orderResult = await neonClient.query(
      `INSERT INTO orders (
        order_number, session_id, user_id, property_id, tenant_id,
        order_type, table_number, guest_name, guest_email, guest_phone,
        order_items, subtotal, tax_amount, service_charge, discount_amount,
        total_amount, currency, special_requests, status, payment_status, payment_method
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *`,
      [
        orderNumber,
        session_id,
        context.userId,
        context.businessId,
        context.tenantId,
        order_type,
        table_number,
        guest_name,
        guest_email,
        guest_phone,
        JSON.stringify(cartItems),
        finalSubtotal,
        cart.tax_amount,
        cart.service_charge,
        discountAmount,
        finalTotal,
        cart.currency,
        special_requests,
        'pending',
        'pending',
        payment_method,
      ]
    );

    const order = orderResult[0];

    // Mark cart as converted
    await neonClient.query(
      `UPDATE shopping_carts SET status = 'converted', updated_at = NOW() WHERE id = $1`,
      [cart.id]
    );

    // Record order status change
    await neonClient.query(
      `INSERT INTO order_status_history (order_id, status, changed_by, reason)
       VALUES ($1, $2, $3, $4)`,
      [order.id, 'pending', context.userId, 'Order created']
    );

    // Process payment based on method
    let paymentResult: any = null;
    if (payment_method === 'card') {
      // For digital payments, we'll create a payment intent
      // In real implementation, this would integrate with Stripe
      paymentResult = {
        payment_intent_id: `pi_${Date.now()}`,
        client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        status: 'requires_payment_method',
      };
    } else if (payment_method === 'cash') {
      // For cash payments, mark as pending
      paymentResult = {
        status: 'pending',
        message: 'Payment to be collected at front desk',
      };
    }

    // Create payment record
    if (paymentResult) {
      await neonClient.query(
        `INSERT INTO payments (
          order_id, payment_intent_id, amount, currency, payment_method,
          payment_status, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          order.id,
          paymentResult.payment_intent_id || null,
          finalTotal,
          cart.currency,
          payment_method,
          paymentResult.status,
          JSON.stringify(paymentResult),
        ]
      );
    }

    // Trigger Sofia's order processing
    // This would call Sofia's restaurant order tools
    const sofiaOrderData = {
      orderId: order.id,
      guestName: guest_name,
      tableNumber: table_number || 'N/A',
      orderItems: cartItems,
      totalAmount: finalTotal,
      specialRequests: special_requests,
      orderType: order_type,
    };

    // In real implementation, this would trigger Sofia's order processing
    console.log('Sofia Order Processing:', sofiaOrderData);

    return NextResponse.json({
      success: true,
      data: {
        order: {
          id: order.id,
          order_number: order.order_number,
          status: order.status,
          payment_status: order.payment_status,
          total_amount: order.total_amount,
          currency: order.currency,
          created_at: order.created_at,
        },
        payment: paymentResult,
        cart_items: cartItems,
        totals: {
          subtotal: finalSubtotal,
          tax_amount: cart.tax_amount,
          service_charge: cart.service_charge,
          discount_amount: discountAmount,
          total_amount: finalTotal,
        },
        next_steps:
          payment_method === 'card'
            ? ['Complete payment', 'Order confirmation', 'Kitchen notification']
            : [
                'Payment collection',
                'Order confirmation',
                'Kitchen notification',
              ],
      },
      message: 'Order created successfully',
      security: {
        tenantId: context.tenantId,
        businessId: context.businessId,
        userId: context.userId,
      },
    });
  } catch (error) {
    console.error('[CHECKOUT_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
}

// GET - Get checkout summary
export async function GET(request: NextRequest) {
  try {
    const context = extractBusinessContext(request);
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get cart
    const cartResult = await neonClient.query(
      `SELECT * FROM shopping_carts 
       WHERE session_id = $1 AND tenant_id = $2 AND property_id = $3 
       AND status = 'active'`,
      [sessionId, context.tenantId, context.businessId]
    );

    if (cartResult.length === 0) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const cart = cartResult[0];

    // Get available payment methods
    const paymentMethodsResult = await neonClient.query(
      `SELECT * FROM payment_methods 
       WHERE property_id = $1 AND tenant_id = $2 AND is_enabled = true
       ORDER BY display_name`,
      [context.businessId, context.tenantId]
    );

    // Get available discounts
    const discountsResult = await neonClient.query(
      `SELECT discount_code, discount_name, discount_type, discount_value, minimum_order_amount
       FROM discounts 
       WHERE property_id = $1 AND tenant_id = $2 AND is_active = true
       AND valid_from <= NOW() AND (valid_until IS NULL OR valid_until >= NOW())
       AND (usage_limit IS NULL OR used_count < usage_limit)
       AND minimum_order_amount <= $3`,
      [context.businessId, context.tenantId, cart.subtotal]
    );

    return NextResponse.json({
      success: true,
      data: {
        cart: {
          id: cart.id,
          items: cart.cart_items || [],
          subtotal: cart.subtotal,
          tax_amount: cart.tax_amount,
          service_charge: cart.service_charge,
          total_amount: cart.total_amount,
          currency: cart.currency,
          item_count: (cart.cart_items || []).reduce(
            (sum: number, item: { quantity: number }) => sum + item.quantity,
            0
          ),
        },
        payment_methods: paymentMethodsResult,
        available_discounts: discountsResult,
        checkout_ready: (cart.cart_items || []).length > 0,
      },
      security: {
        tenantId: context.tenantId,
        businessId: context.businessId,
        userId: context.userId,
      },
    });
  } catch (error) {
    console.error('[CHECKOUT_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get checkout summary' },
      { status: 500 }
    );
  }
}
