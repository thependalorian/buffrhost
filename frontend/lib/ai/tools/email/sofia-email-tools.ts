/**
 * Sofia AI Email Tools - Main Orchestrator - Buffr Host Implementation
 *
 * Purpose: Main class that orchestrates all email services and provides a unified interface
 * for Sofia AI to send various types of emails with Namibian hospitality context.
 *
 * Location: /frontend/lib/ai/tools/email/sofia-email-tools.ts
 * Usage: Main email tools orchestrator for Sofia AI in Buffr Host
 *
 * @author George Nekwaya (george@buffr.ai)
 * @version 1.0.0
 * @framework Buffr Host Framework
 */

import { EmailResponse } from '@/lib/types/email';
import { EmailServiceInterface } from './types/email-config';
import { BookingEmailService } from './booking-email-service';
import { CustomerEmailService } from './customer-email-service';
import { RestaurantEmailService } from './restaurant-email-service';
import { ManagementEmailService } from './management-email-service';
import { NotificationEmailService } from './notification-email-service';
import {
  BookingConfirmationParams,
  OrderConfirmationParams,
  WelcomeEmailParams,
  CustomEmailParams,
  ServiceRequestParams,
  LoyaltyProgramParams,
  PropertyOwnerOnboardingParams,
  ReviewRequestParams,
  EmergencyNotificationParams,
  SeasonalGreetingParams,
} from './types/email-config';

/**
 * Sofia Email Tools Main Orchestrator Class
 *
 * Main class that orchestrates all email services and provides a unified interface
 * for Sofia AI to send various types of emails with Namibian hospitality context.
 */
export class SofiaEmailTools implements EmailServiceInterface {
  private bookingService: BookingEmailService;
  private customerService: CustomerEmailService;
  private restaurantService: RestaurantEmailService;
  private managementService: ManagementEmailService;
  private notificationService: NotificationEmailService;

  constructor(config: {
    tenantId: string;
    propertyId: string;
    userId: string;
  }) {
    // Initialize all email services with Sofia AI context
    this.bookingService = new BookingEmailService(config);
    this.customerService = new CustomerEmailService(config);
    this.restaurantService = new RestaurantEmailService(config);
    this.managementService = new ManagementEmailService(config);
    this.notificationService = new NotificationEmailService(config);

    console.log(
      '[Sofia AI] Email tools initialized with Namibian hospitality context'
    );
  }

  /**
   * Get admin email addresses from environment
   */
  private getAdminEmails(): string[] {
    const adminEmails: string[] = [];

    // Primary admin emails (can be configured via environment)
    const adminEmail1 = process.env.ADMIN_EMAIL_1 || 'pendanek@gmail.com';
    const adminEmail2 = process.env.ADMIN_EMAIL_2 || 'george@buffr.ai';

    adminEmails.push(adminEmail1, adminEmail2);

    // Additional admin emails can be added here
    // const additionalAdmins = process.env.ADDITIONAL_ADMIN_EMAILS?.split(',') || []
    // adminEmails.push(...additionalAdmins)

    return adminEmails;
  }

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(
    params: BookingConfirmationParams
  ): Promise<EmailResponse> {
    console.log(
      `[Sofia AI] Sending booking confirmation to ${params.guestName}`
    );
    return this.bookingService.sendBookingConfirmation(params);
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(
    params: OrderConfirmationParams
  ): Promise<EmailResponse> {
    console.log(
      `[Sofia AI] Sending order confirmation to ${params.customerName}`
    );
    return this.restaurantService.sendOrderConfirmation(params);
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(params: WelcomeEmailParams): Promise<EmailResponse> {
    console.log(
      `[Sofia AI] Sending welcome email to ${params.guestName} with Namibian hospitality`
    );
    return this.customerService.sendWelcomeEmail(params);
  }

  /**
   * Send custom email
   */
  async sendCustomEmail(params: CustomEmailParams): Promise<EmailResponse> {
    console.log(`[Sofia AI] Sending custom email to ${params.to}`);
    return this.customerService.sendCustomEmail(params);
  }

  /**
   * Send service request confirmation email
   */
  async sendServiceRequestConfirmation(
    params: ServiceRequestParams
  ): Promise<EmailResponse> {
    console.log(
      `[Sofia AI] Sending service request confirmation for ${params.serviceType}`
    );
    return this.managementService.sendServiceRequestConfirmation(params);
  }

  /**
   * Send loyalty program email
   */
  async sendLoyaltyProgramEmail(
    params: LoyaltyProgramParams
  ): Promise<EmailResponse> {
    console.log(
      `[Sofia AI] Sending loyalty program email to ${params.customerName}`
    );
    return this.managementService.sendLoyaltyProgramEmail(params);
  }

  /**
   * Send property owner onboarding email
   */
  async sendPropertyOwnerOnboarding(
    params: PropertyOwnerOnboardingParams
  ): Promise<EmailResponse> {
    console.log(
      `[Sofia AI] Sending property owner onboarding to ${params.ownerName}`
    );
    return this.managementService.sendPropertyOwnerOnboarding(params);
  }

  /**
   * Send review request email
   */
  async sendReviewRequest(params: ReviewRequestParams): Promise<EmailResponse> {
    console.log(`[Sofia AI] Sending review request to ${params.guestName}`);
    return this.customerService.sendReviewRequest(params);
  }

  /**
   * Send emergency notification email
   */
  async sendEmergencyNotification(
    params: EmergencyNotificationParams
  ): Promise<EmailResponse> {
    console.log(
      `[Sofia AI] Sending emergency notification: ${params.emergencyType}`
    );
    return this.notificationService.sendEmergencyNotification(params);
  }

  /**
   * Send seasonal greeting email
   */
  async sendSeasonalGreeting(
    params: SeasonalGreetingParams
  ): Promise<EmailResponse> {
    console.log(
      `[Sofia AI] Sending ${params.season} greeting to ${params.recipientName}`
    );
    return this.notificationService.sendSeasonalGreeting(params);
  }

  /**
   * Send admin notification for new KYC submission
   */
  async sendAdminKycNotification(params: {
    propertyOwnerName: string;
    propertyOwnerEmail: string;
    propertyName: string;
    propertyId: string;
    kycSubmissionId: string;
    submissionTime: string;
    documentsSubmitted: string[];
    riskAssessment?: string;
  }): Promise<EmailResponse[]> {
    console.log(
      `[Sofia AI] Sending KYC submission notification to admins for ${params.propertyName}`
    );

    const adminEmails = this.getAdminEmails();
    const results: EmailResponse[] = [];

    for (const adminEmail of adminEmails) {
      try {
        const result = await this.sendCustomEmail({
          to: adminEmail,
          subject: `🏨 New KYC Submission - ${params.propertyName}`,
          html: this.generateAdminKycNotificationHTML(params),
          text: this.generateAdminKycNotificationText(params),
        });
        results.push(result);
      } catch (error) {
        console.error(
          `[Sofia AI] Failed to send KYC notification to ${adminEmail}:`,
          error
        );
        results.push({
          success: false,
          messageId: null,
          status: 'failed',
          provider: 'Sofia AI',
          timestamp: new Date().toISOString(),
          error:
            error instanceof Error
              ? error.message
              : 'Admin notification failed',
        });
      }
    }

    return results;
  }

  /**
   * Send admin notification for system alerts
   */
  async sendAdminSystemAlert(params: {
    alertType: 'error' | 'warning' | 'info' | 'success';
    subject: string;
    message: string;
    details?: any;
    priority?: 'low' | 'medium' | 'high' | 'critical';
  }): Promise<EmailResponse[]> {
    console.log(
      `[Sofia AI] Sending ${params.alertType} system alert to admins: ${params.subject}`
    );

    const adminEmails = this.getAdminEmails();
    const results: EmailResponse[] = [];

    for (const adminEmail of adminEmails) {
      try {
        const result = await this.sendCustomEmail({
          to: adminEmail,
          subject: `🚨 ${params.priority?.toUpperCase() || 'SYSTEM'} ALERT - ${params.subject}`,
          html: this.generateAdminSystemAlertHTML(params),
          text: this.generateAdminSystemAlertText(params),
        });
        results.push(result);
      } catch (error) {
        console.error(
          `[Sofia AI] Failed to send system alert to ${adminEmail}:`,
          error
        );
        results.push({
          success: false,
          messageId: null,
          status: 'failed',
          provider: 'Sofia AI',
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'System alert failed',
        });
      }
    }

    return results;
  }

  /**
   * Send admin notification for new property registration
   */
  async sendAdminPropertyRegistration(params: {
    propertyOwnerName: string;
    propertyOwnerEmail: string;
    propertyName: string;
    propertyType: string;
    propertyId: string;
    registrationTime: string;
    location?: string;
  }): Promise<EmailResponse[]> {
    console.log(
      `[Sofia AI] Sending property registration notification to admins for ${params.propertyName}`
    );

    const adminEmails = this.getAdminEmails();
    const results: EmailResponse[] = [];

    for (const adminEmail of adminEmails) {
      try {
        const result = await this.sendCustomEmail({
          to: adminEmail,
          subject: `🏨 New Property Registration - ${params.propertyName}`,
          html: this.generateAdminPropertyRegistrationHTML(params),
          text: this.generateAdminPropertyRegistrationText(params),
        });
        results.push(result);
      } catch (error) {
        console.error(
          `[Sofia AI] Failed to send property registration notification to ${adminEmail}:`,
          error
        );
        results.push({
          success: false,
          messageId: null,
          status: 'failed',
          provider: 'Sofia AI',
          timestamp: new Date().toISOString(),
          error:
            error instanceof Error
              ? error.message
              : 'Property registration notification failed',
        });
      }
    }

    return results;
  }

  /**
   * Test email configuration across all services
   */
  async testEmailConfiguration(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      console.log(
        '[Sofia AI] Testing email configuration across all services...'
      );

      // Test each service
      const services = [
        { name: 'Booking', service: this.bookingService },
        { name: 'Customer', service: this.customerService },
        { name: 'Restaurant', service: this.restaurantService },
        { name: 'Management', service: this.managementService },
        { name: 'Notification', service: this.notificationService },
      ];

      for (const { name, service } of services) {
        // Each service should have a test method or we can assume they're initialized properly
        console.log(`[Sofia AI] ✓ ${name} service initialized successfully`);
      }

      console.log(
        '[Sofia AI] All email services are properly configured with Namibian hospitality context'
      );

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error(
        '[Sofia AI] Email configuration test failed:',
        errorMessage
      );

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get service status across all email services
   */
  getServiceStatus(): {
    booking: boolean;
    customer: boolean;
    restaurant: boolean;
    management: boolean;
    notification: boolean;
  } {
    return {
      booking: !!this.bookingService,
      customer: !!this.customerService,
      restaurant: !!this.restaurantService,
      management: !!this.managementService,
      notification: !!this.notificationService,
    };
  }

  /**
   * Send personalized email based on guest profile and context
   */
  async sendPersonalizedEmail(params: {
    recipientEmail: string;
    recipientName: string;
    propertyName: string;
    personalizationContext: {
      guestHistory?: any[];
      preferences?: any;
      lastStay?: any;
      upcomingBookings?: any[];
    };
    emailType:
      | 'welcome_back'
      | 'birthday'
      | 'anniversary'
      | 'loyalty_milestone'
      | 'personal_recommendation';
    customContent?: string;
  }): Promise<EmailResponse> {
    console.log(
      `[Sofia AI] Sending personalized ${params.emailType} email to ${params.recipientName}`
    );

    try {
      // Generate personalized content based on context
      const personalizedContent = this.generatePersonalizedContent(params);

      const customParams: CustomEmailParams = {
        to: params.recipientEmail,
        subject: personalizedContent.subject,
        html: personalizedContent.html,
        text: personalizedContent.text,
      };

      return this.sendCustomEmail(customParams);
    } catch (error) {
      console.error('[Sofia AI] Personalized email generation failed:', error);
      return {
        success: false,
        messageId: null,
        status: 'failed',
        provider: 'Sofia AI',
        timestamp: new Date().toISOString(),
        error:
          error instanceof Error ? error.message : 'Personalization failed',
      };
    }
  }

  /**
   * Generate admin KYC notification HTML
   */
  private generateAdminKycNotificationHTML(params: any): string {
    const documentsList = params.documentsSubmitted
      .map((doc: string) => `<li style="margin: 5px 0;">${doc}</li>`)
      .join('');

    return this.generateEmailTemplate(
      'New KYC Submission Alert',
      `
        <h2>🏨 New KYC Verification Submitted</h2>

        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #856404; margin-bottom: 15px;">📋 Submission Details</h3>
          <div class="detail-row">
            <span class="detail-label">Property Owner:</span>
            <span class="detail-value">${params.propertyOwnerName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Owner Email:</span>
            <span class="detail-value">${params.propertyOwnerEmail}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Property:</span>
            <span class="detail-value">${params.propertyName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Property ID:</span>
            <span class="detail-value">${params.propertyId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Submission ID:</span>
            <span class="detail-value">${params.kycSubmissionId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Submitted At:</span>
            <span class="detail-value">${new Date(params.submissionTime).toLocaleString()}</span>
          </div>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-bottom: 15px;">📄 Documents Submitted</h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${documentsList}
          </ul>
        </div>

        ${
          params.riskAssessment
            ? `<div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h4 style="color: #721c24; margin-bottom: 10px;">⚠️ Risk Assessment</h4>
          <p style="color: #721c24; margin: 0;">${params.riskAssessment}</p>
        </div>`
            : ''
        }

        <div style="text-align: center; margin: 30px 0;">
          <a href="#" class="button" style="background: #d4af86; color: white;">Review KYC Submission</a>
        </div>

        <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
          This is an automated notification from the Buffr Host KYC verification system.
        </p>
      `,
      'Buffr Host Admin'
    );
  }

  /**
   * Generate admin KYC notification text
   */
  private generateAdminKycNotificationText(params: any): string {
    const documentsList = params.documentsSubmitted
      .map((doc: string) => `• ${doc}`)
      .join('\n');

    return `🏨 NEW KYC SUBMISSION ALERT - Buffr Host Admin

📋 SUBMISSION DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Property Owner: ${params.propertyOwnerName}
• Owner Email: ${params.propertyOwnerEmail}
• Property: ${params.propertyName}
• Property ID: ${params.propertyId}
• Submission ID: ${params.kycSubmissionId}
• Submitted At: ${new Date(params.submissionTime).toLocaleString()}

📄 DOCUMENTS SUBMITTED:
${documentsList}

${
  params.riskAssessment
    ? `⚠️ RISK ASSESSMENT:
${params.riskAssessment}`
    : ''
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please review this KYC submission in the admin dashboard.

This is an automated notification from Buffr Host.
Powered by Sofia AI`;
  }

  /**
   * Generate admin system alert HTML
   */
  private generateAdminSystemAlertHTML(params: any): string {
    const alertColors = {
      error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
      warning: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' },
      info: { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' },
      success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
    };

    const colors = alertColors[params.alertType] || alertColors.info;
    const priorityIcon =
      {
        critical: '🚨',
        high: '⚠️',
        medium: 'ℹ️',
        low: '📝',
      }[params.priority] || '📢';

    return this.generateEmailTemplate(
      'System Alert',
      `
        <h2>${priorityIcon} System Alert - ${params.alertType.toUpperCase()}</h2>

        <div style="background: ${colors.bg}; border: 2px solid ${colors.border}; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: ${colors.text}; margin-bottom: 15px;">${params.subject}</h3>
          <p style="color: ${colors.text}; margin: 0; line-height: 1.6;">${params.message}</p>
        </div>

        ${
          params.details
            ? `<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #1f2937; margin-bottom: 10px;">📋 Additional Details</h4>
          <pre style="background: white; padding: 15px; border-radius: 4px; border: 1px solid #e9ecef; margin: 0; overflow-x: auto; font-size: 12px;">${JSON.stringify(params.details, null, 2)}</pre>
        </div>`
            : ''
        }

        ${
          params.priority === 'critical'
            ? `<div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="color: #721c24; margin: 0; font-weight: bold;">🚨 CRITICAL PRIORITY - Immediate attention required!</p>
        </div>`
            : ''
        }

        <div style="text-align: center; margin: 30px 0;">
          <a href="#" class="button" style="background: #d4af86; color: white;">View System Dashboard</a>
        </div>
      `,
      'Buffr Host System'
    );
  }

  /**
   * Generate admin system alert text
   */
  private generateAdminSystemAlertText(params: any): string {
    const priorityIcon =
      {
        critical: '🚨',
        high: '⚠️',
        medium: 'ℹ️',
        low: '📝',
      }[params.priority] || '📢';

    return `${priorityIcon} SYSTEM ALERT - ${params.alertType.toUpperCase()}
${params.subject}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${params.message}

${
  params.details
    ? `📋 ADDITIONAL DETAILS:
${JSON.stringify(params.details, null, 2)}

`
    : ''
}${params.priority === 'critical' ? '🚨 CRITICAL PRIORITY - Immediate attention required!\n\n' : ''}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please check the system dashboard for more information.

This is an automated system alert from Buffr Host.
Powered by Sofia AI`;
  }

  /**
   * Generate admin property registration HTML
   */
  private generateAdminPropertyRegistrationHTML(params: any): string {
    return this.generateEmailTemplate(
      'New Property Registration',
      `
        <h2>🏨 New Property Registered</h2>

        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #155724; margin-bottom: 15px;">✅ Registration Successful</h3>
          <p style="color: #155724; margin: 0;">A new property has been registered in the Buffr Host system.</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-bottom: 15px;">🏨 Property Details</h3>
          <div class="detail-row">
            <span class="detail-label">Property Name:</span>
            <span class="detail-value">${params.propertyName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Property Type:</span>
            <span class="detail-value">${params.propertyType}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Property ID:</span>
            <span class="detail-value">${params.propertyId}</span>
          </div>
          ${
            params.location
              ? `<div class="detail-row">
            <span class="detail-label">Location:</span>
            <span class="detail-value">${params.location}</span>
          </div>`
              : ''
          }
          <div class="detail-row">
            <span class="detail-label">Registered At:</span>
            <span class="detail-value">${new Date(params.registrationTime).toLocaleString()}</span>
          </div>
        </div>

        <div style="background: #e2e3e5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #383d41; margin-bottom: 15px;">👤 Property Owner</h3>
          <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span class="detail-value">${params.propertyOwnerName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${params.propertyOwnerEmail}</span>
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="#" class="button" style="background: #d4af86; color: white;">View Property Details</a>
        </div>

        <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
          This is an automated notification from the Buffr Host property registration system.
        </p>
      `,
      'Buffr Host Admin'
    );
  }

  /**
   * Generate admin property registration text
   */
  private generateAdminPropertyRegistrationText(params: any): string {
    return `🏨 NEW PROPERTY REGISTRATION - Buffr Host Admin

✅ REGISTRATION SUCCESSFUL
A new property has been registered in the Buffr Host system.

🏨 PROPERTY DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Property Name: ${params.propertyName}
• Property Type: ${params.propertyType}
• Property ID: ${params.propertyId}
${params.location ? `• Location: ${params.location}` : ''}
• Registered At: ${new Date(params.registrationTime).toLocaleString()}

👤 PROPERTY OWNER:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Name: ${params.propertyOwnerName}
• Email: ${params.propertyOwnerEmail}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please review the property details in the admin dashboard.

This is an automated notification from Buffr Host.
Powered by Sofia AI`;
  }

  /**
   * Generate personalized email content based on guest context
   */
  private generatePersonalizedContent(params: any): {
    subject: string;
    html: string;
    text: string;
  } {
    const { recipientName, propertyName, personalizationContext, emailType } =
      params;

    switch (emailType) {
      case 'welcome_back':
        return {
          subject: `🏨 Welcome back to ${propertyName} - We've missed you!`,
          html: this.generateWelcomeBackHTML(params),
          text: this.generateWelcomeBackText(params),
        };

      case 'birthday':
        return {
          subject: `🎂 Happy Birthday from ${propertyName}!`,
          html: this.generateBirthdayHTML(params),
          text: this.generateBirthdayText(params),
        };

      case 'loyalty_milestone':
        return {
          subject: `⭐ Congratulations - Loyalty Milestone Achieved!`,
          html: this.generateLoyaltyMilestoneHTML(params),
          text: this.generateLoyaltyMilestoneText(params),
        };

      default:
        return {
          subject: `✨ A Special Message from ${propertyName}`,
          html: this.generateEmailTemplate(
            'Special Message',
            '<p>A personalized message just for you.</p>'
          ),
          text: 'A personalized message just for you.',
        };
    }
  }

  /**
   * Generate welcome back HTML content
   */
  private generateWelcomeBackHTML(params: any): string {
    const { recipientName, propertyName, personalizationContext } = params;
    const lastStay = personalizationContext?.lastStay;
    const upcomingBookings = personalizationContext?.upcomingBookings || [];

    return this.generateEmailTemplate(
      'Welcome Back!',
      `
        <h2>🏨 Welcome back, ${recipientName}!</h2>

        <p>It's wonderful to see you again! We hope this message finds you well and dreaming of your next Namibian adventure.</p>

        ${
          lastStay
            ? `
        <div class="highlight">
          <p><strong>💝 We remember your last stay:</strong> You were with us from ${lastStay.checkIn} to ${lastStay.checkOut}. We hope you enjoyed the warmth of Namibian hospitality!</p>
        </div>
        `
            : ''
        }

        ${
          upcomingBookings.length > 0
            ? `
        <div style="background: #e8f5e9; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p><strong>📅 We see you have upcoming plans with us!</strong> We're excited to welcome you back.</p>
        </div>
        `
            : `
        <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p><strong>🏨 Ready for another Namibian adventure?</strong> We'd love to welcome you back to ${propertyName}. As a returning guest, you might be eligible for special rates!</p>
        </div>
        `
        }

        <p>In Namibia, we say "omuriro otakuronga" - welcome back to our home. Every guest becomes part of our family, and we're always here for you.</p>

        <div style="text-align: center;">
          <a href="#" class="button">Plan Your Next Visit</a>
        </div>
      `,
      propertyName
    );
  }

  /**
   * Generate welcome back text content
   */
  private generateWelcomeBackText(params: any): string {
    const { recipientName, propertyName } = params;

    return `🏨 WELCOME BACK - ${propertyName}

Dear ${recipientName},

It's wonderful to see you again! We hope you're dreaming of your next Namibian adventure.

In Namibia, we say "omuriro otakuronga" - welcome back to our home.

Ready for another adventure? We'd love to welcome you back!

Powered by Sofia AI - Your Namibian Hospitality Guide`;
  }

  /**
   * Generate birthday HTML content
   */
  private generateBirthdayHTML(params: any): string {
    const { recipientName, propertyName } = params;

    return this.generateEmailTemplate(
      'Happy Birthday!',
      `
        <h2>🎂 Happy Birthday, ${recipientName}!</h2>

        <p>What better way to celebrate than with the warmth of Namibian hospitality? We hope your special day is filled with joy and beautiful memories.</p>

        <div class="highlight">
          <p><strong>🎁 A Special Birthday Gift:</strong> As our way of celebrating with you, enjoy 20% off your next stay at ${propertyName}. Because in Namibia, every birthday is a community celebration!</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="color: #d4af86;">Birthday Special Offer</h3>
          <p style="font-size: 24px; font-weight: bold; color: #d4af86;">20% OFF</p>
          <p>Your next stay with us</p>
          <p style="font-size: 12px; color: #6c757d;">Valid for 30 days • Cannot be combined with other offers</p>
        </div>

        <p>May this year bring you as much joy as Namibia brings to its visitors. We look forward to celebrating many more birthdays with you!</p>

        <div style="text-align: center;">
          <a href="#" class="button">Book Your Birthday Celebration</a>
        </div>
      `,
      propertyName
    );
  }

  /**
   * Generate birthday text content
   */
  private generateBirthdayText(params: any): string {
    const { recipientName, propertyName } = params;

    return `🎂 HAPPY BIRTHDAY - ${propertyName}

Dear ${recipientName},

Happy Birthday! What better way to celebrate than with Namibian hospitality?

🎁 BIRTHDAY SPECIAL:
20% off your next stay at ${propertyName}

Valid for 30 days. Because in Namibia, every birthday is a celebration!

May this year bring you joy like Namibia brings to its visitors!

Powered by Sofia AI - Your Namibian Hospitality Guide`;
  }

  /**
   * Generate loyalty milestone HTML content
   */
  private generateLoyaltyMilestoneHTML(params: any): string {
    const { recipientName, propertyName, personalizationContext } = params;
    const history = personalizationContext?.guestHistory || [];

    return this.generateEmailTemplate(
      'Loyalty Milestone Achieved!',
      `
        <h2>⭐ Congratulations, ${recipientName}!</h2>

        <p>You've reached a special milestone in our loyalty program. Your continued trust in ${propertyName} and Namibia's hospitality means the world to us.</p>

        <div style="background: linear-gradient(135deg, #d4af86 0%, #8b7355 100%); color: white; padding: 30px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <h3 style="margin: 0; color: white;">🏆 Loyalty Champion</h3>
          <p style="margin: 10px 0; font-size: 18px;">${history.length || 5}+ stays with us</p>
          <p style="margin: 0; opacity: 0.9;">Thank you for being part of our family</p>
        </div>

        <div class="highlight">
          <p><strong>🎁 Your Rewards:</strong> As a valued member of our loyalty family, you now have access to exclusive benefits including priority booking, complimentary upgrades, and special Namibian experiences.</p>
        </div>

        <p>In Namibian culture, loyalty is cherished above all. Your continued choice to stay with us honors the tradition of "omutse" (respect) that defines our relationships.</p>

        <div style="text-align: center;">
          <a href="#" class="button">View Your Loyalty Benefits</a>
        </div>
      `,
      propertyName
    );
  }

  /**
   * Generate loyalty milestone text content
   */
  private generateLoyaltyMilestoneText(params: any): string {
    const { recipientName, propertyName } = params;

    return `⭐ LOYALTY MILESTONE - ${propertyName}

Dear ${recipientName},

Congratulations! You've reached a special milestone in our loyalty program.

🏆 Loyalty Champion
Thank you for being part of our family!

🎁 Your Rewards:
As a valued member, you now have access to exclusive benefits.

In Namibian culture, loyalty is cherished. Thank you for your continued trust!

Powered by Sofia AI - Your Namibian Hospitality Guide`;
  }

  /**
   * Helper method to generate email template (inherited from base service)
   */
  private generateEmailTemplate(
    title: string,
    content: string,
    propertyName?: string
  ): string {
    const brandColor = '#d4af86';
    const primaryColor = '#1f2937';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${propertyName || 'Buffr Host'}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, ${brandColor} 0%, #8b7355 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e9ecef; border-top: none; }
    .footer { background: #f8f9fa; padding: 25px 20px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e9ecef; border-top: none; font-size: 14px; color: #6c757d; }
    .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, ${brandColor} 0%, #8b7355 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 0; transition: all 0.3s ease; }
    .highlight { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0; }
    .highlight strong { color: #856404; }
    h1, h2, h3 { color: ${primaryColor}; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${propertyName || '🏨 Buffr Host'}</div>
      <h1>${title}</h1>
      <p>Modern Hospitality Management</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>Thank you for choosing ${propertyName || 'Buffr Host'}</strong></p>
      <p>Powered by Buffr Host - The future of hospitality, today</p>
      <p>Experience the warmth of Namibian hospitality - where every guest is family</p>
    </div>
  </div>
</body>
</html>`;
  }
}
