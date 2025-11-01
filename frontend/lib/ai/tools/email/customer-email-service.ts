/**
 * Sofia AI Email Tools - Customer Email Service - Buffr Host Implementation
 *
 * Purpose: Handles customer-facing email communications including welcome emails,
 * custom emails, and review requests with Namibian hospitality context.
 *
 * Location: /frontend/lib/ai/tools/email/customer-email-service.ts
 * Usage: Customer-facing email functionality for Buffr Host
 *
 * @author George Nekwaya (george@buffr.ai)
 * @version 1.0.0
 * @framework Buffr Host Framework
 */

import { EmailResponse } from '@/lib/types/email';
import { BaseEmailService } from './base-email-service';
import {
  WelcomeEmailParams,
  CustomEmailParams,
  ReviewRequestParams,
} from './types/email-config';
import { SofiaEmailTemplateGenerator } from './core/email-template-generator';

/**
 * Customer Email Service Class
 *
 * Handles customer-facing email communications for Buffr Host
 * with Namibian hospitality context and Sofia AI personalization.
 */
export class CustomerEmailService extends BaseEmailService {
  private templateGenerator: SofiaEmailTemplateGenerator;

  constructor(config: any) {
    super(config);
    this.templateGenerator = new SofiaEmailTemplateGenerator();
  }

  /**
   * Send welcome email to new customers
   */
  async sendWelcomeEmail(params: WelcomeEmailParams): Promise<EmailResponse> {
    this.logEmailAttempt(params.guestEmail, 'welcome');

    try {
      const validation = this.validateEmailParams(
        params.guestEmail,
        `Welcome to ${params.propertyName}!`
      );
      if (!validation.valid) {
        return this.createErrorResponse(
          new Error(validation.error),
          'Welcome email validation'
        );
      }

      const htmlContent = this.templateGenerator.generateWelcomeHTML(params);
      const textContent = this.templateGenerator.generateWelcomeText(params);

      const result = await this.mockEmailService({
        to: params.guestEmail,
        subject: `🏨 Welcome to ${params.propertyName} - Experience Namibia!`,
        htmlContent,
        textContent,
      });

      if (result.success) {
        console.log(
          `[Sofia AI] Welcome email sent to ${params.guestName} with Namibian hospitality context`
        );
        return this.createSuccessResponse(result.messageId, 'Welcome email');
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'Welcome email send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'Welcome email');
    }
  }

  /**
   * Send custom email to customers
   */
  async sendCustomEmail(params: CustomEmailParams): Promise<EmailResponse> {
    this.logEmailAttempt(params.to, 'custom');

    try {
      const validation = this.validateEmailParams(params.to, params.subject);
      if (!validation.valid) {
        return this.createErrorResponse(
          new Error(validation.error),
          'Custom email validation'
        );
      }

      // If HTML content is provided, use it; otherwise wrap text in template
      const htmlContent =
        params.html ||
        this.generateEmailTemplate(
          params.subject,
          `<div style="white-space: pre-line;">${params.html || params.text}</div>`
        );

      const result = await this.mockEmailService({
        to: params.to,
        subject: params.subject,
        htmlContent,
        textContent: params.text,
      });

      if (result.success) {
        return this.createSuccessResponse(result.messageId, 'Custom email');
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'Custom email send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'Custom email');
    }
  }

  /**
   * Send review request email
   */
  async sendReviewRequest(params: ReviewRequestParams): Promise<EmailResponse> {
    this.logEmailAttempt(params.guestEmail, 'review request');

    try {
      const validation = this.validateEmailParams(
        params.guestEmail,
        `How was your stay at ${params.propertyName}?`
      );
      if (!validation.valid) {
        return this.createErrorResponse(
          new Error(validation.error),
          'Review request validation'
        );
      }

      const htmlContent = this.generateReviewRequestHTML(params);
      const textContent = this.generateReviewRequestText(params);

      const result = await this.mockEmailService({
        to: params.guestEmail,
        subject: `⭐ How was your stay at ${params.propertyName}?`,
        htmlContent,
        textContent,
      });

      if (result.success) {
        console.log(
          `[Sofia AI] Review request sent to ${params.guestName} with Namibian hospitality context`
        );
        return this.createSuccessResponse(result.messageId, 'Review request');
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'Review request send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'Review request');
    }
  }

  /**
   * Send follow-up email after stay
   */
  async sendFollowUpEmail(params: {
    guestEmail: string;
    guestName: string;
    propertyName: string;
    bookingId: string;
    stayDates: { checkIn: string; checkOut: string };
    followUpReason:
      | 'satisfaction_check'
      | 'rebooking_offer'
      | 'feedback_request'
      | 'special_offer';
  }): Promise<EmailResponse> {
    this.logEmailAttempt(params.guestEmail, 'follow-up');

    try {
      const htmlContent = this.generateFollowUpHTML(params);
      const textContent = this.generateFollowUpText(params);

      const subjectMap = {
        satisfaction_check: `How was your stay at ${params.propertyName}?`,
        rebooking_offer: `Come back to ${params.propertyName} - Special offer!`,
        feedback_request: `We'd love your feedback about ${params.propertyName}`,
        special_offer: `Exclusive offer for returning guests at ${params.propertyName}`,
      };

      const result = await this.mockEmailService({
        to: params.guestEmail,
        subject: subjectMap[params.followUpReason],
        htmlContent,
        textContent,
      });

      if (result.success) {
        return this.createSuccessResponse(result.messageId, 'Follow-up email');
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'Follow-up email send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'Follow-up email');
    }
  }

  /**
   * Generate review request HTML content
   */
  private generateReviewRequestHTML(params: ReviewRequestParams): string {
    const brandColor = '#d4af86';
    const primaryColor = '#1f2937';

    return this.generateEmailTemplate(
      'Share Your Experience',
      `
        <h2>⭐ How was your stay?</h2>

        <p>Dear ${params.guestName},</p>

        <p>We hope you enjoyed your recent stay at ${params.propertyName}! Your feedback helps us maintain the highest standards of Namibian hospitality and ensures that every guest has an exceptional experience.</p>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; border-left: 4px solid ${brandColor};">
          <h3 style="color: ${primaryColor}; margin-bottom: 15px;">Share Your Experience</h3>
          <p style="margin-bottom: 20px;">Your honest feedback helps other travelers discover the best of Namibia's hospitality.</p>
          <a href="${params.reviewUrl}" class="button" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, ${brandColor} 0%, #8b7355 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Leave a Review</a>
        </div>

        <div class="highlight">
          <p><strong>💝 Why Your Review Matters:</strong> In Namibian culture, sharing experiences helps build community and ensures everyone has authentic, memorable experiences. Your review helps us maintain the "omutse" (respect) that defines our hospitality.</p>
        </div>

        <p>Whether your experience was exceptional or there's room for improvement, we genuinely want to hear from you. Your feedback directly contributes to making Namibia a world-class hospitality destination.</p>

        <p>Thank you for choosing ${params.propertyName} and for being part of our Namibian hospitality family.</p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 14px;">
          <p><strong>Need help with your review?</strong> Contact us anytime - we're here to assist.</p>
        </div>
      `,
      params.propertyName
    );
  }

  /**
   * Generate review request text content
   */
  private generateReviewRequestText(params: ReviewRequestParams): string {
    return `⭐ SHARE YOUR EXPERIENCE - ${params.propertyName}

Dear ${params.guestName},

We hope you enjoyed your recent stay! Your feedback helps us maintain the highest standards of Namibian hospitality.

SHARE YOUR EXPERIENCE:
${params.reviewUrl}

Why Your Review Matters:
In Namibian culture, sharing experiences helps build community. Your review helps us maintain the "omutse" (respect) that defines our hospitality.

Thank you for choosing ${params.propertyName} and for being part of our Namibian hospitality family.

Powered by Sofia AI - Your Namibian Hospitality Guide`;
  }

  /**
   * Generate follow-up HTML content
   */
  private generateFollowUpHTML(params: any): string {
    const contentMap = {
      satisfaction_check: `
        <h2>🌟 How was your Namibian experience?</h2>
        <p>We hope your stay at ${params.propertyName} lived up to the warmth and beauty of Namibia. We'd love to hear about your experience!</p>
        <div class="highlight">
          <p><strong>💝 Your feedback matters:</strong> In our culture, every guest's experience contributes to our collective story of hospitality.</p>
        </div>
      `,
      rebooking_offer: `
        <h2>🏨 Come Back to Namibia!</h2>
        <p>Missing the red dunes and warm hospitality already? We'd love to welcome you back to ${params.propertyName}.</p>
        <div class="highlight">
          <p><strong>🎁 Special Offer:</strong> As a returning guest, enjoy 15% off your next stay - because family always gets the best rates!</p>
        </div>
      `,
      feedback_request: `
        <h2>💬 Share Your Thoughts</h2>
        <p>Your experience at ${params.propertyName} is important to us. Every detail, positive or constructive, helps us grow.</p>
        <div class="highlight">
          <p><strong>🌱 Continuous Improvement:</strong> Your feedback helps us maintain Namibia's reputation for exceptional hospitality.</p>
        </div>
      `,
      special_offer: `
        <h2>⭐ Exclusive Offer for You</h2>
        <p>As someone who's experienced authentic Namibian hospitality, you deserve the very best on your next visit.</p>
        <div class="highlight">
          <p><strong>🎁 VIP Treatment:</strong> Enjoy complimentary upgrades and priority service on your next stay.</p>
        </div>
      `,
    };

    return this.generateEmailTemplate(
      'We Miss You Already',
      `
        <p>Dear ${params.guestName},</p>

        ${contentMap[params.followUpReason]}

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Your Recent Stay:</h3>
          <div class="detail-row">
            <span class="detail-label">Property:</span>
            <span class="detail-value">${params.propertyName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Booking ID:</span>
            <span class="detail-value">${params.bookingId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Check-in:</span>
            <span class="detail-value">${params.stayDates.checkIn}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Check-out:</span>
            <span class="detail-value">${params.stayDates.checkOut}</span>
          </div>
        </div>

        <p>Whether you'd like to share your experience, plan your next visit, or just say hello - we're here for you. In Namibia, hospitality never ends at check-out.</p>

        <div style="text-align: center;">
          <a href="#" class="button">Contact Us</a>
        </div>
      `,
      params.propertyName
    );
  }

  /**
   * Generate follow-up text content
   */
  private generateFollowUpText(params: any): string {
    const subjectMap = {
      satisfaction_check: 'How was your Namibian experience?',
      rebooking_offer: 'Come back to Namibia - Special offer!',
      feedback_request: "We'd love your feedback",
      special_offer: 'Exclusive offer for returning guests',
    };

    return `${subjectMap[params.followUpReason]} - ${params.propertyName}

Dear ${params.guestName},

${
  params.followUpReason === 'satisfaction_check'
    ? 'We hope your stay lived up to the warmth and beauty of Namibia!'
    : params.followUpReason === 'rebooking_offer'
      ? 'Missing the red dunes and warm hospitality? Come back to us!'
      : params.followUpReason === 'feedback_request'
        ? 'Your experience is important to us. Share your thoughts!'
        : "As someone who's experienced authentic Namibian hospitality, you deserve the best!"
}

Your Recent Stay:
• Property: ${params.propertyName}
• Booking ID: ${params.bookingId}
• Check-in: ${params.stayDates.checkIn}
• Check-out: ${params.stayDates.checkOut}

We're here for you anytime. In Namibia, hospitality never ends at check-out.

Powered by Sofia AI - Your Namibian Hospitality Guide`;
  }
}
