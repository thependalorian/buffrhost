/**
 * Sofia AI Email Tools - Booking Email Service - Buffr Host Implementation
 *
 * Purpose: Handles all booking-related email communications including confirmations,
 * modifications, and cancellations with Namibian hospitality context.
 *
 * Location: /frontend/lib/ai/tools/email/booking-email-service.ts
 * Usage: Booking-specific email functionality for Buffr Host
 *
 * @author George Nekwaya (george@buffr.ai)
 * @version 1.0.0
 * @framework Buffr Host Framework
 */

import { EmailResponse } from '@/lib/types/email';
import { BaseEmailService } from './base-email-service';
import { BookingConfirmationParams } from './types/email-config';
import { SofiaEmailTemplateGenerator } from './core/email-template-generator';

/**
 * Booking Email Service Class
 *
 * Handles all booking-related email communications for Buffr Host
 * with Namibian hospitality context and Sofia AI personalization.
 */
export class BookingEmailService extends BaseEmailService {
  private templateGenerator: SofiaEmailTemplateGenerator;

  constructor(config: any) {
    super(config);
    this.templateGenerator = new SofiaEmailTemplateGenerator();
  }

  /**
   * Send booking confirmation email via SendGrid
   */
  async sendBookingConfirmation(
    params: BookingConfirmationParams
  ): Promise<EmailResponse> {
    this.logEmailAttempt(params.guestEmail, 'booking confirmation');

    try {
      // Validate parameters
      const validation = this.validateEmailParams(
        params.guestEmail,
        `Booking Confirmation - ${params.hotelName || 'Buffr Host Property'}`
      );
      if (!validation.valid) {
        return this.createErrorResponse(
          new Error(validation.error),
          'Booking confirmation validation'
        );
      }

      // Generate email content using Sofia templates
      const htmlContent =
        this.templateGenerator.generateBookingConfirmationHTML(params);
      const textContent =
        this.templateGenerator.generateBookingConfirmationText(params);

      // Mock email service call - replace with actual SendGrid implementation
      const result = await this.mockEmailService({
        to: params.guestEmail,
        subject: `🏨 Booking Confirmed - ${params.hotelName || 'Buffr Host Property'}`,
        htmlContent,
        textContent,
      });

      if (result.success) {
        // Log successful send with Sofia context
        console.log(
          `[Sofia AI] Booking confirmation sent to ${params.guestName} with Namibian hospitality context`
        );
        return this.createSuccessResponse(
          result.messageId,
          'Booking confirmation'
        );
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'Booking confirmation send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'Booking confirmation');
    }
  }

  /**
   * Send booking modification confirmation
   */
  async sendBookingModification(params: {
    guestEmail: string;
    guestName: string;
    bookingId: string;
    originalCheckIn: string;
    originalCheckOut: string;
    newCheckIn: string;
    newCheckOut: string;
    hotelName?: string;
  }): Promise<EmailResponse> {
    this.logEmailAttempt(params.guestEmail, 'booking modification');

    try {
      const htmlContent = this.generateBookingModificationHTML(params);
      const textContent = this.generateBookingModificationText(params);

      const result = await this.mockEmailService({
        to: params.guestEmail,
        subject: `📝 Booking Modified - ${params.hotelName || 'Buffr Host Property'}`,
        htmlContent,
        textContent,
      });

      if (result.success) {
        return this.createSuccessResponse(
          result.messageId,
          'Booking modification'
        );
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'Booking modification send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'Booking modification');
    }
  }

  /**
   * Send booking cancellation confirmation
   */
  async sendBookingCancellation(params: {
    guestEmail: string;
    guestName: string;
    bookingId: string;
    checkInDate: string;
    checkOutDate: string;
    cancellationFee?: number;
    refundAmount?: number;
    hotelName?: string;
  }): Promise<EmailResponse> {
    this.logEmailAttempt(params.guestEmail, 'booking cancellation');

    try {
      const htmlContent = this.generateBookingCancellationHTML(params);
      const textContent = this.generateBookingCancellationText(params);

      const result = await this.mockEmailService({
        to: params.guestEmail,
        subject: `❌ Booking Cancelled - ${params.hotelName || 'Buffr Host Property'}`,
        htmlContent,
        textContent,
      });

      if (result.success) {
        return this.createSuccessResponse(
          result.messageId,
          'Booking cancellation'
        );
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'Booking cancellation send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'Booking cancellation');
    }
  }

  /**
   * Generate booking modification HTML content
   */
  private generateBookingModificationHTML(params: any): string {
    const brandColor = '#d4af86';
    const primaryColor = '#1f2937';

    return this.generateEmailTemplate(
      'Booking Modified',
      `
        <h2>📝 Your Booking Has Been Modified</h2>

        <p>Dear ${params.guestName},</p>

        <p>Your booking at ${params.hotelName || 'our property'} has been successfully modified. Here are the updated details:</p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${brandColor};">
          <h3 style="color: ${primaryColor};">Previous Details:</h3>
          <div class="detail-row">
            <span class="detail-label">Check-in:</span>
            <span class="detail-value">${params.originalCheckIn}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Check-out:</span>
            <span class="detail-value">${params.originalCheckOut}</span>
          </div>

          <h3 style="color: ${primaryColor}; margin-top: 20px;">New Details:</h3>
          <div class="detail-row">
            <span class="detail-label">Check-in:</span>
            <span class="detail-value" style="color: ${brandColor}; font-weight: bold;">${params.newCheckIn}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Check-out:</span>
            <span class="detail-value" style="color: ${brandColor}; font-weight: bold;">${params.newCheckOut}</span>
          </div>
        </div>

        <div class="highlight">
          <p><strong>💝 Namibian Hospitality:</strong> We're committed to making your stay perfect. If these changes don't meet your needs, please contact us immediately.</p>
        </div>

        <p>If you have any questions about your modified booking, please don't hesitate to contact our team.</p>

        <div style="text-align: center;">
          <a href="#" class="button">View Updated Booking</a>
        </div>
      `,
      params.hotelName
    );
  }

  /**
   * Generate booking modification text content
   */
  private generateBookingModificationText(params: any): string {
    return `📝 BOOKING MODIFIED - ${params.hotelName || 'Buffr Host Property'}

Dear ${params.guestName},

Your booking has been successfully modified.

PREVIOUS DETAILS:
• Check-in: ${params.originalCheckIn}
• Check-out: ${params.originalCheckOut}

NEW DETAILS:
• Check-in: ${params.newCheckIn}
• Check-out: ${params.newCheckOut}

If you have any questions, please contact our team.

Powered by Sofia AI - Your Namibian Hospitality Assistant`;
  }

  /**
   * Generate booking cancellation HTML content
   */
  private generateBookingCancellationHTML(params: any): string {
    const refundInfo = params.refundAmount
      ? `<div class="detail-row">
        <span class="detail-label">Refund Amount:</span>
        <span class="detail-value" style="color: #28a745;">N$${params.refundAmount.toFixed(2)}</span>
      </div>`
      : '';

    const feeInfo = params.cancellationFee
      ? `<div class="detail-row">
        <span class="detail-label">Cancellation Fee:</span>
        <span class="detail-value" style="color: #dc3545;">N$${params.cancellationFee.toFixed(2)}</span>
      </div>`
      : '';

    return this.generateEmailTemplate(
      'Booking Cancelled',
      `
        <h2>❌ Booking Cancellation Confirmed</h2>

        <p>Dear ${params.guestName},</p>

        <p>Your booking at ${params.hotelName || 'our property'} has been cancelled as requested.</p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Cancellation Details:</h3>
          <div class="detail-row">
            <span class="detail-label">Booking ID:</span>
            <span class="detail-value">${params.bookingId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Original Check-in:</span>
            <span class="detail-value">${params.checkInDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Original Check-out:</span>
            <span class="detail-value">${params.checkOutDate}</span>
          </div>
          ${feeInfo}
          ${refundInfo}
        </div>

        <div class="highlight">
          <p><strong>💝 We're Here to Help:</strong> We understand plans can change. If you'd like to rebook for a different date or need assistance with alternative arrangements, our team is here to help make your Namibian experience happen.</p>
        </div>

        <p>We hope to welcome you to Namibia and ${params.hotelName || 'our property'} in the future.</p>
      `,
      params.hotelName
    );
  }

  /**
   * Generate booking cancellation text content
   */
  private generateBookingCancellationText(params: any): string {
    return `❌ BOOKING CANCELLED - ${params.hotelName || 'Buffr Host Property'}

Dear ${params.guestName},

Your booking has been cancelled as requested.

CANCELLATION DETAILS:
• Booking ID: ${params.bookingId}
• Original Check-in: ${params.checkInDate}
• Original Check-out: ${params.checkOutDate}
${params.cancellationFee ? `• Cancellation Fee: N$${params.cancellationFee.toFixed(2)}` : ''}
${params.refundAmount ? `• Refund Amount: N$${params.refundAmount.toFixed(2)}` : ''}

We hope to welcome you in the future.

Powered by Sofia AI - Your Namibian Hospitality Assistant`;
  }
}
