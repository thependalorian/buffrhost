/**
 * Admin Manual Email API Route for Buffr Host
 * 
 * Handles manual email sending requests from administrators
 * with booking-specific conflict detection and mitigation.
 * 
 * @author Buffr Host Team
 * @version 1.0.0
 */

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AdminEmailControlsService } from '@/lib/services/email/admin-email-controls';
import { BuffrHostEmailService } from '@/lib/services/email/buffrhost-email-service';
import { EmailTemplateEngine } from '@/lib/services/email/template-engine';
import { emailConfig } from '@/lib/config/email-config';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      to,
      subject,
      htmlContent,
      textContent,
      templateType,
      metadata = {},
      bypassAutomatedChecks = false,
      bookingId,
      propertyId
    } = body;

    // Validate required fields
    if (!to || !subject || !htmlContent || !textContent) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, htmlContent, textContent' },
        { status: 400 }
      );
    }

    // Initialize services
    const emailService = new BuffrHostEmailService();
    const adminEmailService = new AdminEmailControlsService(supabase, emailService);

    // Send manual email
    const result = await adminEmailService.sendManualEmail(user.id, {
      to,
      subject,
      htmlContent,
      textContent,
      templateType,
      metadata,
      bypassAutomatedChecks,
      bookingId,
      propertyId
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Manual email sent successfully'
    });

  } catch (error: any) {
    console.error('Error in manual email API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send manual email',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const adminId = searchParams.get('adminId');

    // Initialize services
    const emailService = new BuffrHostEmailService();
    const adminEmailService = new AdminEmailControlsService(supabase, emailService);

    // Fetch manual email logs
    const result = await adminEmailService.getManualEmailLogs(
      page,
      limit,
      adminId || undefined
    );

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('Error fetching manual email logs:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch manual email logs',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
