import { NextRequest, NextResponse } from 'next/server';
import { BusinessContext } from '@/lib/types/ids';
import { neonClient } from '@/lib/database/neon-client';
import { realpayService } from '@/lib/services/realpay-service';

// Mock business context extraction
function extractBusinessContext(request: NextRequest): BusinessContext {
  const url = new URL(request.url);
  const _tenantId = url.searchParams.get('tenant_id') || 'tenant_123';
  const businessId = url.searchParams.get('business_id') || 'business_456';
  const userId = url.searchParams.get('user_id') || 'user_789';

  return {
    tenantId,
    tenantType: 'restaurant',
    userId,
    role: 'admin',
    permissions: ['process_disbursement', 'view_disbursement'],
    businessId,
    businessGroupId: 'group_456',
  };
}

// POST - Process daily disbursement for a property
export async function POST(request: NextRequest) {
  try {
    const context = extractBusinessContext(request);
    const body = await request.json();
    const { property_id, tenant_id } = body;

    const targetPropertyId = property_id || context.businessId;
    const targetTenantId = tenant_id || context.tenantId;

    // Process disbursement using database function
    const disbursementResult = await neonClient.query(
      `SELECT * FROM process_daily_disbursement($1, $2)`,
      [targetPropertyId, targetTenantId]
    );

    if (disbursementResult.length === 0) {
      return NextResponse.json(
        { error: 'Failed to process disbursement' },
        { status: 500 }
      );
    }

    const disbursementId = disbursementResult[0].process_daily_disbursement;

    // Get disbursement details
    const disbursementDetails = await neonClient.query(
      `SELECT * FROM daily_disbursements WHERE id = $1`,
      [disbursementId]
    );

    if (disbursementDetails.length === 0) {
      return NextResponse.json(
        { error: 'Disbursement record not found' },
        { status: 404 }
      );
    }

    const disbursement = disbursementDetails[0];

    // Process RealPay disbursement if amount is sufficient
    if (disbursement.net_property_amount > 0) {
      try {
        // Get property owner bank details (in real implementation, this would come from property settings)
        const propertyResult = await neonClient.query(
          `SELECT * FROM properties WHERE id = $1`,
          [targetPropertyId]
        );

        if (propertyResult.length === 0) {
          return NextResponse.json(
            { error: 'Property not found' },
            { status: 404 }
          );
        }

        const property = propertyResult[0];

        // Process RealPay disbursement
        const realpayResult = await realpayService.processDisbursement({
          merchantReference: `DISP_${disbursementId}`,
          amount: disbursement.net_property_amount,
          beneficiaryName: property.owner_name || 'Property Owner',
          beneficiaryAccountNumber:
            property.bank_account_number || '1234567890',
          beneficiaryBankCode: property.bank_code || '001',
          beneficiaryBranchCode: property.branch_code,
          description: `Daily disbursement for ${property.name} - ${disbursement.disbursement_date}`,
          currency: 'NAD',
        });

        if (realpayResult.success) {
          // Update disbursement with RealPay transaction ID
          await neonClient.query(
            `UPDATE daily_disbursements SET 
              realpay_transaction_id = $1, status = 'processing'
             WHERE id = $2`,
            [realpayResult.transactionId, disbursementId]
          );

          // Update fund flows to disbursed
          await neonClient.query(
            `UPDATE fund_flows SET 
              flow_stage = 'disbursed', realpay_transaction_id = $1, processed_at = NOW()
             WHERE property_id = $2 AND tenant_id = $3 
             AND DATE(processed_at) = CURRENT_DATE`,
            [realpayResult.transactionId, targetPropertyId, targetTenantId]
          );
        } else {
          // Mark disbursement as failed
          await neonClient.query(
            `UPDATE daily_disbursements SET 
              status = 'failed', error_message = $1
             WHERE id = $2`,
            [realpayResult.error, disbursementId]
          );

          return NextResponse.json(
            {
              error: 'RealPay disbursement failed',
              details: realpayResult.error,
              disbursement_id: disbursementId,
            },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error('RealPay disbursement failed:', error);

        // Mark disbursement as failed
        await neonClient.query(
          `UPDATE daily_disbursements SET 
            status = 'failed', error_message = $1
           WHERE id = $2`,
          [
            error instanceof Error ? error.message : 'Unknown error',
            disbursementId,
          ]
        );

        return NextResponse.json(
          {
            error: 'Disbursement processing failed',
            disbursement_id: disbursementId,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        disbursement_id: disbursementId,
        property_id: targetPropertyId,
        tenant_id: targetTenantId,
        disbursement_date: disbursement.disbursement_date,
        total_transactions: disbursement.total_transactions,
        total_amount_collected: disbursement.total_amount_collected,
        total_vat_amount: disbursement.total_vat_amount,
        total_processing_fees: disbursement.total_processing_fees,
        total_buffr_fees: disbursement.total_buffr_fees,
        disbursement_fee: disbursement.disbursement_fee,
        net_property_amount: disbursement.net_property_amount,
        realpay_transaction_id: disbursement.realpay_transaction_id,
        status: disbursement.status,
        processed_at: disbursement.processed_at,
      },
      message: 'Daily disbursement processed successfully',
      security: {
        tenantId: context.tenantId,
        businessId: context.businessId,
        userId: context.userId,
      },
    });
  } catch (error) {
    console.error('[DISBURSEMENTS_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process disbursement' },
      { status: 500 }
    );
  }
}

// GET - Get disbursement history
export async function GET(request: NextRequest) {
  try {
    const context = extractBusinessContext(request);
    const url = new URL(request.url);
    const propertyId =
      url.searchParams.get('property_id') || context.businessId;
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const disbursements = await neonClient.query(
      `SELECT * FROM daily_disbursements 
       WHERE property_id = $1 AND tenant_id = $2
       ORDER BY disbursement_date DESC
       LIMIT $3 OFFSET $4`,
      [propertyId, context.tenantId, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: disbursements,
      pagination: {
        limit,
        offset,
        total: disbursements.length,
      },
      security: {
        tenantId: context.tenantId,
        businessId: context.businessId,
        userId: context.userId,
      },
    });
  } catch (error) {
    console.error('[DISBURSEMENTS_API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get disbursement history' },
      { status: 500 }
    );
  }
}
