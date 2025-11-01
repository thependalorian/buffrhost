/**
 * Sofia AI Email Tools - Management Email Service - Buffr Host Implementation
 *
 * Purpose: Handles management and administrative email communications including service requests,
 * loyalty programs, and property owner onboarding with professional Namibian context.
 *
 * Location: /frontend/lib/ai/tools/email/management-email-service.ts
 * Usage: Management-specific email functionality for Buffr Host
 *
 * @author George Nekwaya (george@buffr.ai)
 * @version 1.0.0
 * @framework Buffr Host Framework
 */

import { EmailResponse } from '@/lib/types/email';
import { BaseEmailService } from './base-email-service';
import {
  ServiceRequestParams,
  LoyaltyProgramParams,
  PropertyOwnerOnboardingParams,
} from './types/email-config';

/**
 * Management Email Service Class
 *
 * Handles management and administrative email communications for Buffr Host
 * with professional Namibian business context and Sofia AI personalization.
 */
export class ManagementEmailService extends BaseEmailService {
  /**
   * Send service request confirmation email
   */
  async sendServiceRequestConfirmation(
    params: ServiceRequestParams
  ): Promise<EmailResponse> {
    this.logEmailAttempt(params.customerEmail, 'service request confirmation');

    try {
      const validation = this.validateEmailParams(
        params.customerEmail,
        `Service Request Confirmation - ${params.serviceType}`
      );
      if (!validation.valid) {
        return this.createErrorResponse(
          new Error(validation.error),
          'Service request validation'
        );
      }

      const htmlContent = this.generateServiceRequestConfirmationHTML(params);
      const textContent = this.generateServiceRequestConfirmationText(params);

      const result = await this.mockEmailService({
        to: params.customerEmail,
        subject: `🔧 Service Request Confirmed - ${params.serviceType}`,
        htmlContent,
        textContent,
      });

      if (result.success) {
        console.log(
          `[Sofia AI] Service request confirmation sent for ${params.serviceType}`
        );
        return this.createSuccessResponse(
          result.messageId,
          'Service request confirmation'
        );
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'Service request send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'Service request confirmation');
    }
  }

  /**
   * Send loyalty program email
   */
  async sendLoyaltyProgramEmail(
    params: LoyaltyProgramParams
  ): Promise<EmailResponse> {
    this.logEmailAttempt(params.customerEmail, 'loyalty program');

    try {
      const validation = this.validateEmailParams(
        params.customerEmail,
        `${params.programName} Update`
      );
      if (!validation.valid) {
        return this.createErrorResponse(
          new Error(validation.error),
          'Loyalty program validation'
        );
      }

      const htmlContent = this.generateLoyaltyProgramHTML(params);
      const textContent = this.generateLoyaltyProgramText(params);

      const result = await this.mockEmailService({
        to: params.customerEmail,
        subject: `⭐ ${params.programName} - ${params.tierLevel} Member Update`,
        htmlContent,
        textContent,
      });

      if (result.success) {
        console.log(
          `[Sofia AI] Loyalty program email sent to ${params.customerName}`
        );
        return this.createSuccessResponse(
          result.messageId,
          'Loyalty program email'
        );
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'Loyalty program send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'Loyalty program email');
    }
  }

  /**
   * Send property owner onboarding email
   */
  async sendPropertyOwnerOnboarding(
    params: PropertyOwnerOnboardingParams
  ): Promise<EmailResponse> {
    this.logEmailAttempt(params.ownerEmail, 'property owner onboarding');

    try {
      const validation = this.validateEmailParams(
        params.ownerEmail,
        `Welcome to Buffr Host - ${params.propertyName}`
      );
      if (!validation.valid) {
        return this.createErrorResponse(
          new Error(validation.error),
          'Property owner validation'
        );
      }

      const htmlContent = this.generatePropertyOwnerOnboardingHTML(params);
      const textContent = this.generatePropertyOwnerOnboardingText(params);

      const result = await this.mockEmailService({
        to: params.ownerEmail,
        subject: `🏨 Welcome to Buffr Host - ${params.propertyName} Setup`,
        htmlContent,
        textContent,
      });

      if (result.success) {
        console.log(
          `[Sofia AI] Property owner onboarding email sent to ${params.ownerName}`
        );
        return this.createSuccessResponse(
          result.messageId,
          'Property owner onboarding'
        );
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'Property owner onboarding send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'Property owner onboarding');
    }
  }

  /**
   * Send maintenance request update
   */
  async sendMaintenanceUpdate(params: {
    propertyOwnerEmail: string;
    propertyOwnerName: string;
    propertyName: string;
    requestId: string;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    technicianName?: string;
    estimatedCompletion?: string;
    notes?: string;
  }): Promise<EmailResponse> {
    this.logEmailAttempt(params.propertyOwnerEmail, 'maintenance update');

    try {
      const htmlContent = this.generateMaintenanceUpdateHTML(params);
      const textContent = this.generateMaintenanceUpdateText(params);

      const statusText = {
        scheduled: 'Scheduled',
        in_progress: 'In Progress',
        completed: 'Completed',
        cancelled: 'Cancelled',
      }[params.status];

      const result = await this.mockEmailService({
        to: params.propertyOwnerEmail,
        subject: `🔧 Maintenance Update - ${params.propertyName} (${statusText})`,
        htmlContent,
        textContent,
      });

      if (result.success) {
        return this.createSuccessResponse(
          result.messageId,
          'Maintenance update'
        );
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'Maintenance update send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'Maintenance update');
    }
  }

  /**
   * Generate service request confirmation HTML content
   */
  private generateServiceRequestConfirmationHTML(
    params: ServiceRequestParams
  ): string {
    const contactInfo = [];
    if (params.contactInfo.phone)
      contactInfo.push(`Phone: ${params.contactInfo.phone}`);
    if (params.contactInfo.preferredTime)
      contactInfo.push(`Preferred Time: ${params.contactInfo.preferredTime}`);
    const contactDetails =
      contactInfo.length > 0
        ? contactInfo.join(' • ')
        : 'Email contact preferred';

    return this.generateEmailTemplate(
      'Service Request Confirmed',
      `
        <h2>🔧 Service Request Confirmed</h2>

        <p>Dear ${params.customerName},</p>

        <p>Thank you for reaching out to Buffr Host. We've received your service request and our team is ready to assist you with the highest standards of Namibian hospitality and professionalism.</p>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #d4af86;">
          <h3 style="color: #1f2937; margin-bottom: 20px;">🔧 Service Request Details</h3>
          <div class="detail-row">
            <span class="detail-label">Service Type:</span>
            <span class="detail-value">${params.serviceType}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Request ID:</span>
            <span class="detail-value">${params.requestId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Request Details:</span>
            <span class="detail-value">${params.requestDetails}</span>
          </div>
          ${
            params.estimatedCompletion
              ? `<div class="detail-row">
            <span class="detail-label">Estimated Completion:</span>
            <span class="detail-value">${params.estimatedCompletion}</span>
          </div>`
              : ''
          }
          <div class="detail-row">
            <span class="detail-label">Contact Information:</span>
            <span class="detail-value">${contactDetails}</span>
          </div>
        </div>

        <div class="highlight">
          <p><strong>💼 Professional Service Guarantee:</strong> Our team is committed to resolving your request efficiently and professionally. In Namibia, we believe that "omutse" (respect) extends to how we handle every service interaction.</p>
        </div>

        <p>We'll keep you updated on the progress of your service request. If you have any additional information or questions, please don't hesitate to contact us.</p>

        <div style="text-align: center;">
          <a href="#" class="button">Track Service Request</a>
        </div>
      `,
      'Buffr Host'
    );
  }

  /**
   * Generate service request confirmation text content
   */
  private generateServiceRequestConfirmationText(
    params: ServiceRequestParams
  ): string {
    return `🔧 SERVICE REQUEST CONFIRMED - Buffr Host

Dear ${params.customerName},

Thank you for reaching out to Buffr Host. We've received your service request.

🔧 SERVICE REQUEST DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Service Type: ${params.serviceType}
• Request ID: ${params.requestId}
• Request Details: ${params.requestDetails}
${params.estimatedCompletion ? `• Estimated Completion: ${params.estimatedCompletion}` : ''}
• Contact: ${params.contactInfo.phone || 'Email contact preferred'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Our team is committed to professional service.

We'll keep you updated on progress.

Powered by Sofia AI - Your Namibian Service Partner`;
  }

  /**
   * Generate loyalty program HTML content
   */
  private generateLoyaltyProgramHTML(params: LoyaltyProgramParams): string {
    const benefitsList = params.benefits
      .map((benefit) => `<li style="margin: 5px 0;">${benefit}</li>`)
      .join('');

    return this.generateEmailTemplate(
      'Loyalty Program Update',
      `
        <h2>⭐ ${params.programName} Update</h2>

        <p>Dear ${params.customerName},</p>

        <p>Thank you for being a valued member of our loyalty program. Your continued support helps us maintain the highest standards of Namibian hospitality.</p>

        <div style="background: linear-gradient(135deg, #d4af86 0%, #8b7355 100%); color: white; padding: 30px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <h3 style="margin: 0 0 15px 0; color: white;">🏆 ${params.tierLevel} Member</h3>
          <p style="margin: 0; font-size: 24px; font-weight: bold;">${params.currentPoints.toLocaleString()} points</p>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Keep earning to unlock more benefits!</p>
        </div>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #1f2937; margin-bottom: 15px;">🎁 Your ${params.tierLevel} Benefits:</h3>
          <ul style="color: #333; padding-left: 20px;">
            ${benefitsList}
          </ul>
        </div>

        ${
          params.nextReward
            ? `<div class="highlight">
          <p><strong>🎯 Next Reward:</strong> ${params.nextReward} - Keep earning to unlock this exclusive benefit!</p>
        </div>`
            : ''
        }

        ${
          params.expiryDate
            ? `<div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p><strong>⏰ Points Expiry:</strong> Your points are valid until ${new Date(params.expiryDate).toLocaleDateString()}. Use them to enhance your Namibian experiences!</p>
        </div>`
            : ''
        }

        <p>In Namibian culture, loyalty is a cherished value. Your continued partnership with Buffr Host means the world to us and our commitment to exceptional hospitality.</p>

        <div style="text-align: center;">
          <a href="#" class="button">View Loyalty Dashboard</a>
        </div>
      `,
      'Buffr Host'
    );
  }

  /**
   * Generate loyalty program text content
   */
  private generateLoyaltyProgramText(params: LoyaltyProgramParams): string {
    const benefitsList = params.benefits
      .map((benefit) => `• ${benefit}`)
      .join('\n');

    return `⭐ ${params.programName.toUpperCase()} UPDATE - Buffr Host

Dear ${params.customerName},

Thank you for being a valued loyalty member.

🏆 ${params.tierLevel.toUpperCase()} MEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current Points: ${params.currentPoints.toLocaleString()}

🎁 YOUR ${params.tierLevel.toUpperCase()} BENEFITS:
${benefitsList}

${params.nextReward ? `🎯 Next Reward: ${params.nextReward}` : ''}

${params.expiryDate ? `⏰ Points expire: ${new Date(params.expiryDate).toLocaleDateString()}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Thank you for your loyalty!

Powered by Sofia AI - Your Namibian Loyalty Partner`;
  }

  /**
   * Generate property owner onboarding HTML content
   */
  private generatePropertyOwnerOnboardingHTML(
    params: PropertyOwnerOnboardingParams
  ): string {
    const stepsList = params.onboardingSteps
      .map(
        (step) => `
        <div style="background: ${step.completed ? '#d4edda' : '#f8f9fa'}; padding: 15px; border-radius: 6px; margin: 10px 0; border-left: 4px solid ${step.completed ? '#28a745' : '#d4af86'};">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: ${step.completed ? '#155724' : '#1f2937'};">${step.step}</span>
            <span style="background: ${step.completed ? '#28a745' : '#6c757d'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">
              ${step.completed ? '✓ Completed' : 'Pending'}
            </span>
          </div>
          ${step.dueDate ? `<p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Due: ${new Date(step.dueDate).toLocaleDateString()}</p>` : ''}
        </div>`
      )
      .join('');

    const nextSteps = params.nextSteps
      .map((step) => `<li style="margin: 5px 0;">${step}</li>`)
      .join('');

    return this.generateEmailTemplate(
      'Welcome to Buffr Host!',
      `
        <h2>🏨 Welcome to Buffr Host, ${params.ownerName}!</h2>

        <p>Thank you for choosing Buffr Host as your hospitality management partner. We're excited to help you showcase ${params.propertyName} to the world and provide exceptional Namibian hospitality experiences.</p>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #d4af86;">
          <h3 style="color: #1f2937; margin-bottom: 20px;">📋 Your Onboarding Progress</h3>
          ${stepsList}
        </div>

        <div class="highlight">
          <p><strong>🎯 Next Steps to Get Started:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            ${nextSteps}
          </ul>
        </div>

        <div style="background: #e8f5e9; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #155724; margin-bottom: 15px;">📞 Your Support Team</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${params.supportContact.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${params.supportContact.email}</p>
          ${params.supportContact.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${params.supportContact.phone}</p>` : ''}
          <p style="margin: 15px 0 0 0; font-style: italic;">We're here to support you every step of the way!</p>
        </div>

        <p>In Namibia, we believe that partnership is built on trust and mutual respect. We're committed to helping you succeed and providing your guests with unforgettable experiences that reflect the true warmth of Namibian hospitality.</p>

        <div style="text-align: center;">
          <a href="#" class="button">Access Your Dashboard</a>
        </div>
      `,
      'Buffr Host'
    );
  }

  /**
   * Generate property owner onboarding text content
   */
  private generatePropertyOwnerOnboardingText(
    params: PropertyOwnerOnboardingParams
  ): string {
    const stepsList = params.onboardingSteps
      .map(
        (step) =>
          `${step.completed ? '✓' : '○'} ${step.step}${step.dueDate ? ` (Due: ${new Date(step.dueDate).toLocaleDateString()})` : ''}`
      )
      .join('\n');

    const nextSteps = params.nextSteps.map((step) => `• ${step}`).join('\n');

    return `🏨 WELCOME TO BUFFR HOST - ${params.propertyName}

Dear ${params.ownerName},

Thank you for choosing Buffr Host! We're excited to partner with you.

📋 YOUR ONBOARDING PROGRESS:
${stepsList}

🎯 NEXT STEPS:
${nextSteps}

📞 SUPPORT CONTACT:
• Name: ${params.supportContact.name}
• Email: ${params.supportContact.email}
${params.supportContact.phone ? `• Phone: ${params.supportContact.phone}` : ''}

We're here to support you every step!

Powered by Sofia AI - Your Namibian Hospitality Partner`;
  }

  /**
   * Generate maintenance update HTML content
   */
  private generateMaintenanceUpdateHTML(params: any): string {
    const statusInfo = {
      scheduled: {
        color: '#ffc107',
        text: 'Your maintenance request has been scheduled.',
      },
      in_progress: { color: '#17a2b8', text: 'Work is currently in progress.' },
      completed: {
        color: '#28a745',
        text: 'Maintenance work has been completed successfully.',
      },
      cancelled: {
        color: '#dc3545',
        text: 'The maintenance request has been cancelled.',
      },
    };

    const status = statusInfo[params.status];

    return this.generateEmailTemplate(
      'Maintenance Update',
      `
        <h2>🔧 Maintenance Update - ${params.propertyName}</h2>

        <p>Dear ${params.propertyOwnerName},</p>

        <div style="background: ${status.color}20; border: 2px solid ${status.color}; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="color: ${status.color.replace('20', '')}; margin: 0;">${status.text}</h3>
        </div>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #1f2937; margin-bottom: 15px;">📋 Maintenance Details</h3>
          <div class="detail-row">
            <span class="detail-label">Request ID:</span>
            <span class="detail-value">${params.requestId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Property:</span>
            <span class="detail-value">${params.propertyName}</span>
          </div>
          ${
            params.technicianName
              ? `<div class="detail-row">
            <span class="detail-label">Technician:</span>
            <span class="detail-value">${params.technicianName}</span>
          </div>`
              : ''
          }
          ${
            params.estimatedCompletion
              ? `<div class="detail-row">
            <span class="detail-label">Estimated Completion:</span>
            <span class="detail-value">${params.estimatedCompletion}</span>
          </div>`
              : ''
          }
        </div>

        ${
          params.notes
            ? `<div class="highlight">
          <p><strong>📝 Additional Notes:</strong> ${params.notes}</p>
        </div>`
            : ''
        }

        <p>If you have any questions about this maintenance update or need further assistance, please don't hesitate to contact our support team.</p>
      `,
      'Buffr Host'
    );
  }

  /**
   * Generate maintenance update text content
   */
  private generateMaintenanceUpdateText(params: any): string {
    const statusText = {
      scheduled: 'scheduled',
      in_progress: 'in progress',
      completed: 'completed successfully',
      cancelled: 'cancelled',
    }[params.status];

    return `🔧 MAINTENANCE UPDATE - ${params.propertyName}

Dear ${params.propertyOwnerName},

Your maintenance request has been ${statusText}.

📋 MAINTENANCE DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Request ID: ${params.requestId}
• Property: ${params.propertyName}
${params.technicianName ? `• Technician: ${params.technicianName}` : ''}
${params.estimatedCompletion ? `• Estimated Completion: ${params.estimatedCompletion}` : ''}
${params.notes ? `• Notes: ${params.notes}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contact us if you have any questions.

Powered by Sofia AI - Your Namibian Maintenance Partner`;
  }
}
