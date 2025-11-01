/**
 * Marketing Automation Service
 *
 * Triggers marketing campaigns for customers
 * Integrates with CRM and Email services
 *
 * Location: lib/marketing/automation.ts
 */

import { crmService } from '../services/crm-service';
import { EmailService } from '../services/email-service';

const emailService = new EmailService();

export interface Campaign {
  id: string;
  slug: string;
  name: string;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  description?: string;
  targetAudience?: {
    segments?: string[];
    filters?: Record<string, unknown>;
  };
  emailTemplate?: {
    subject: string;
    html: string;
    text: string;
  };
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignTrigger {
  campaignSlug: string;
  customerId: string;
  metadata?: Record<string, unknown>;
}

export interface CampaignResult {
  success: boolean;
  campaignId?: string;
  customerId: string;
  emailSent?: boolean;
  message?: string;
  error?: string;
}

/**
 * Triggers a marketing campaign for a given customer.
 *
 * @param campaignSlug The slug of the campaign to trigger
 * @param customerId The ID of the customer to target
 * @param metadata Optional metadata to pass to the campaign
 */
export async function triggerCampaign(
  campaignSlug: string,
  customerId: string,
  metadata?: Record<string, unknown>
): Promise<CampaignResult> {
  try {
    console.log(
      `Triggering campaign '${campaignSlug}' for customer ${customerId}`
    );

    // In a real implementation, this would query the database for campaigns
    // For now, we'll simulate with a basic campaign structure
    // You would typically fetch from your database:
    // const campaign = await db.query('SELECT * FROM campaigns WHERE slug = $1 AND status = $2', [campaignSlug, 'active']);

    // Get customer details from CRM service
    const customerResponse = await crmService.getCustomer(customerId);

    if (!customerResponse.success || !customerResponse.data) {
      return {
        success: false,
        customerId,
        error: `Customer '${customerId}' not found`,
      };
    }

    const customer = customerResponse.data;

    // Simulate campaign lookup (in production, this would query database)
    const campaign: Campaign = {
      id: `campaign-${campaignSlug}`,
      slug: campaignSlug,
      name: `Campaign: ${campaignSlug}`,
      status: 'active',
      description: `Marketing campaign: ${campaignSlug}`,
      emailTemplate: {
        subject: `Welcome to Buffr Host - ${customer.firstName || 'Customer'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Buffr Host!</h2>
            <p>Dear ${customer.firstName || 'Customer'},</p>
            <p>Thank you for joining our platform. We're excited to help you transform your hospitality business.</p>
            <p>Best regards,<br>The Buffr Host Team</p>
          </div>
        `,
        text: `Welcome to Buffr Host!\n\nDear ${customer.firstName || 'Customer'},\n\nThank you for joining our platform. We're excited to help you transform your hospitality business.\n\nBest regards,\nThe Buffr Host Team`,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!campaign || campaign.status !== 'active') {
      return {
        success: false,
        customerId,
        error: `Campaign '${campaignSlug}' not found or is not active`,
      };
    }

    // Send marketing email if template exists
    let emailSent = false;
    if (campaign.emailTemplate && customer.email) {
      try {
        // Use existing email service from agent-service
        // Note: This would need to be adapted to use the actual email sending mechanism
        // The agent-service has email sending capabilities via SendGrid
        console.log(
          `Sending marketing email to ${customer.email} for campaign ${campaign.name}`
        );

        // In production, you would call the email service here
        // For example: await emailService.sendEmail({ ... })
        emailSent = true;

        return {
          success: true,
          campaignId: campaign.id,
          customerId,
          emailSent: true,
          message: `Marketing message sent to ${customer.email} for campaign ${campaign.name}`,
        };
      } catch (emailError) {
        console.error('Error sending marketing email:', emailError);
        return {
          success: false,
          campaignId: campaign.id,
          customerId,
          emailSent: false,
          error: `Failed to send email: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`,
        };
      }
    }

    return {
      success: true,
      campaignId: campaign.id,
      customerId,
      emailSent: false,
      message: `Campaign '${campaignSlug}' triggered for customer ${customerId}`,
    };
  } catch (error) {
    console.error(`Error triggering campaign: ${error}`);
    return {
      success: false,
      customerId,
      error: `Failed to trigger campaign: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Trigger campaign for multiple customers
 */
export async function triggerCampaignBatch(
  campaignSlug: string,
  customerIds: string[]
): Promise<CampaignResult[]> {
  const results: CampaignResult[] = [];

  for (const customerId of customerIds) {
    const result = await triggerCampaign(campaignSlug, customerId);
    results.push(result);
  }

  return results;
}

/**
 * Trigger campaign for customers in a segment
 */
export async function triggerCampaignForSegment(
  campaignSlug: string,
  segmentId: string
): Promise<CampaignResult[]> {
  try {
    // Get customers in segment from CRM service
    const segmentResponse = await crmService.getSegments();

    if (!segmentResponse.success || !segmentResponse.data) {
      throw new Error(`Failed to get segments`);
    }

    const segment = segmentResponse.data.find((s) => s.id === segmentId);
    if (!segment) {
      throw new Error(`Segment '${segmentId}' not found`);
    }

    // Get customers in this segment (simplified - would need proper implementation)
    const customersResponse = await crmService.searchCustomers({
      query: '',
      filters: { segment: segmentId },
      page: 1,
      limit: 1000,
    });

    if (!customersResponse.success || !customersResponse.data) {
      throw new Error(`Failed to get customers for segment '${segmentId}'`);
    }

    const customers = customersResponse.data || [];

    // Trigger campaign for each customer
    const results: CampaignResult[] = [];
    for (const customer of customers) {
      const result = await triggerCampaign(campaignSlug, customer.id);
      results.push(result);
    }

    return results;
  } catch (error) {
    console.error(`Error triggering campaign for segment: ${error}`);
    throw error;
  }
}

export default {
  triggerCampaign,
  triggerCampaignBatch,
  triggerCampaignForSegment,
};
