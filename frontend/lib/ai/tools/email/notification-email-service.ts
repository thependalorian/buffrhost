/**
 * Sofia AI Email Tools - Notification Email Service - Buffr Host Implementation
 *
 * Purpose: Handles notification and emergency email communications including emergency alerts,
 * seasonal greetings, and system notifications with appropriate urgency levels.
 *
 * Location: /frontend/lib/ai/tools/email/notification-email-service.ts
 * Usage: Notification-specific email functionality for Buffr Host
 *
 * @author George Nekwaya (george@buffr.ai)
 * @version 1.0.0
 * @framework Buffr Host Framework
 */

import { EmailResponse } from '@/lib/types/email';
import { BaseEmailService } from './base-email-service';
import {
  EmergencyNotificationParams,
  SeasonalGreetingParams,
} from './types/email-config';

/**
 * Notification Email Service Class
 *
 * Handles notification and emergency email communications for Buffr Host
 * with appropriate urgency levels and Namibian context awareness.
 */
export class NotificationEmailService extends BaseEmailService {
  /**
   * Send emergency notification email
   */
  async sendEmergencyNotification(
    params: EmergencyNotificationParams
  ): Promise<EmailResponse> {
    this.logEmailAttempt(params.recipientEmail, `emergency ${params.severity}`);

    try {
      const validation = this.validateEmailParams(
        params.recipientEmail,
        `Emergency: ${params.emergencyType}`
      );
      if (!validation.valid) {
        return this.createErrorResponse(
          new Error(validation.error),
          'Emergency notification validation'
        );
      }

      const htmlContent = this.generateEmergencyNotificationHTML(params);
      const textContent = this.generateEmergencyNotificationText(params);

      const priority = this.getEmergencyPriority(params.severity);
      const subject = this.generateEmergencySubject(params);

      const result = await this.mockEmailService({
        to: params.recipientEmail,
        subject,
        htmlContent,
        textContent,
        priority,
      });

      if (result.success) {
        console.log(
          `[Sofia AI] Emergency notification sent: ${params.emergencyType} (${params.severity})`
        );
        return this.createSuccessResponse(
          result.messageId,
          'Emergency notification'
        );
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'Emergency notification send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'Emergency notification');
    }
  }

  /**
   * Send seasonal greeting email
   */
  async sendSeasonalGreeting(
    params: SeasonalGreetingParams
  ): Promise<EmailResponse> {
    this.logEmailAttempt(params.recipientEmail, `seasonal ${params.season}`);

    try {
      const validation = this.validateEmailParams(
        params.recipientEmail,
        `${params.season} Greetings`
      );
      if (!validation.valid) {
        return this.createErrorResponse(
          new Error(validation.error),
          'Seasonal greeting validation'
        );
      }

      const htmlContent = this.generateSeasonalGreetingHTML(params);
      const textContent = this.generateSeasonalGreetingText(params);

      const result = await this.mockEmailService({
        to: params.recipientEmail,
        subject: `🎄 ${this.getSeasonalSubject(params.season)} - ${params.propertyName}`,
        htmlContent,
        textContent,
      });

      if (result.success) {
        console.log(
          `[Sofia AI] Seasonal greeting sent: ${params.season} to ${params.recipientName}`
        );
        return this.createSuccessResponse(
          result.messageId,
          'Seasonal greeting'
        );
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'Seasonal greeting send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'Seasonal greeting');
    }
  }

  /**
   * Send system status notification
   */
  async sendSystemStatusNotification(params: {
    recipientEmail: string;
    recipientName: string;
    statusType: 'maintenance' | 'outage' | 'restored' | 'upgrade';
    message: string;
    affectedServices?: string[];
    estimatedResolution?: string;
    contactInfo: {
      supportEmail: string;
      emergencyNumber?: string;
    };
  }): Promise<EmailResponse> {
    this.logEmailAttempt(params.recipientEmail, `system ${params.statusType}`);

    try {
      const htmlContent = this.generateSystemStatusHTML(params);
      const textContent = this.generateSystemStatusText(params);

      const statusInfo = {
        maintenance: {
          emoji: '🔧',
          color: '#ffc107',
          subject: 'Scheduled Maintenance',
        },
        outage: { emoji: '🚨', color: '#dc3545', subject: 'Service Outage' },
        restored: {
          emoji: '✅',
          color: '#28a745',
          subject: 'Service Restored',
        },
        upgrade: { emoji: '⬆️', color: '#17a2b8', subject: 'System Upgrade' },
      };

      const status = statusInfo[params.statusType];

      const result = await this.mockEmailService({
        to: params.recipientEmail,
        subject: `${status.emoji} Buffr Host ${status.subject}`,
        htmlContent,
        textContent,
      });

      if (result.success) {
        return this.createSuccessResponse(
          result.messageId,
          'System status notification'
        );
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'System status send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'System status notification');
    }
  }

  /**
   * Send booking reminder notification
   */
  async sendBookingReminder(params: {
    guestEmail: string;
    guestName: string;
    bookingId: string;
    propertyName: string;
    checkInDate: string;
    checkInTime: string;
    reminderType: '24h' | '1h' | 'check_in_day';
    specialInstructions?: string;
    contactInfo: {
      phone?: string;
      email: string;
    };
  }): Promise<EmailResponse> {
    this.logEmailAttempt(
      params.guestEmail,
      `booking reminder ${params.reminderType}`
    );

    try {
      const htmlContent = this.generateBookingReminderHTML(params);
      const textContent = this.generateBookingReminderText(params);

      const reminderText = {
        '24h': '24 Hours Until Check-in',
        '1h': 'Check-in Reminder',
        check_in_day: 'Welcome - Check-in Day!',
      }[params.reminderType];

      const result = await this.mockEmailService({
        to: params.guestEmail,
        subject: `🏨 ${reminderText} - ${params.propertyName}`,
        htmlContent,
        textContent,
      });

      if (result.success) {
        return this.createSuccessResponse(result.messageId, 'Booking reminder');
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'Booking reminder send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'Booking reminder');
    }
  }

  /**
   * Get emergency priority level
   */
  private getEmergencyPriority(severity: string): 'high' | 'normal' {
    return severity === 'critical' ? 'high' : 'normal';
  }

  /**
   * Generate emergency subject line
   */
  private generateEmergencySubject(
    params: EmergencyNotificationParams
  ): string {
    const severityEmoji = {
      low: '⚠️',
      medium: '🚨',
      high: '🔴',
      critical: '🚨🚨',
    }[params.severity];

    const typeText = {
      booking_cancellation: 'Booking Cancellation',
      service_disruption: 'Service Disruption',
      safety_alert: 'Safety Alert',
      weather_warning: 'Weather Warning',
    }[params.emergencyType];

    return `${severityEmoji} EMERGENCY: ${typeText}`;
  }

  /**
   * Generate emergency notification HTML content
   */
  private generateEmergencyNotificationHTML(
    params: EmergencyNotificationParams
  ): string {
    const severityStyles = {
      low: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' },
      medium: { bg: '#fff3cd', border: '#ffc107', text: '#856404' },
      high: { bg: '#f8d7da', border: '#dc3545', text: '#721c24' },
      critical: { bg: '#f8d7da', border: '#dc3545', text: '#721c24' },
    };

    const style = severityStyles[params.severity];

    const affectedServices = params.affectedServices?.length
      ? `<div style="margin: 15px 0;">
        <strong>Affected Services:</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          ${params.affectedServices.map((service) => `<li>${service}</li>`).join('')}
        </ul>
      </div>`
      : '';

    const alternativeOptions = params.alternativeOptions?.length
      ? `<div style="margin: 15px 0;">
        <strong>Alternative Options:</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          ${params.alternativeOptions.map((option) => `<li>${option}</li>`).join('')}
        </ul>
      </div>`
      : '';

    return this.generateEmailTemplate(
      'Emergency Notification',
      `
        <div style="background: ${style.bg}; border: 2px solid ${style.border}; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h2 style="color: ${style.text}; margin: 0 0 15px 0;">
            ${this.generateEmergencySubject(params).replace('EMERGENCY: ', '')}
          </h2>
          <p style="color: ${style.text}; margin: 0; font-size: 16px;">${params.message}</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-bottom: 15px;">📋 Emergency Details</h3>
          <div class="detail-row">
            <span class="detail-label">Type:</span>
            <span class="detail-value">${params.emergencyType.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Severity:</span>
            <span class="detail-value">${params.severity.toUpperCase()}</span>
          </div>
          ${affectedServices}
          ${alternativeOptions}
        </div>

        <div style="background: #e8f5e9; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #155724; margin-bottom: 15px;">📞 Contact Information</h3>
          <p style="margin: 5px 0;"><strong>Emergency Number:</strong> ${params.contactInfo.emergencyNumber}</p>
          <p style="margin: 5px 0;"><strong>Support Email:</strong> ${params.contactInfo.supportEmail}</p>
        </div>

        <div class="highlight">
          <p><strong>💙 Our Commitment:</strong> Your safety and satisfaction are our highest priorities. We're working diligently to resolve this situation and appreciate your understanding.</p>
        </div>

        <p>If you have any immediate concerns or need assistance, please contact us immediately using the information above.</p>
      `,
      'Buffr Host'
    );
  }

  /**
   * Generate emergency notification text content
   */
  private generateEmergencyNotificationText(
    params: EmergencyNotificationParams
  ): string {
    const affectedServices = params.affectedServices?.length
      ? `\nAffected Services:\n${params.affectedServices.map((s) => `• ${s}`).join('\n')}`
      : '';

    const alternativeOptions = params.alternativeOptions?.length
      ? `\nAlternative Options:\n${params.alternativeOptions.map((o) => `• ${o}`).join('\n')}`
      : '';

    return `🚨 EMERGENCY NOTIFICATION - Buffr Host

${params.emergencyType.replace('_', ' ').toUpperCase()} (${params.severity.toUpperCase()})

${params.message}

Emergency Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Type: ${params.emergencyType.replace('_', ' ')}
• Severity: ${params.severity.toUpperCase()}
${affectedServices}
${alternativeOptions}

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Emergency: ${params.contactInfo.emergencyNumber}
• Support: ${params.contactInfo.supportEmail}

We're working to resolve this. Contact us if you need assistance.

Powered by Sofia AI - Your Safety Partner`;
  }

  /**
   * Generate seasonal greeting HTML content
   */
  private generateSeasonalGreetingHTML(params: SeasonalGreetingParams): string {
    const seasonThemes = {
      christmas: {
        emoji: '🎄',
        colors: { primary: '#dc3545', secondary: '#28a745' },
        greeting: 'Merry Christmas!',
        message:
          'May your holiday season be filled with joy, peace, and the warmth of Namibian hospitality.',
      },
      new_year: {
        emoji: '🎊',
        colors: { primary: '#ffc107', secondary: '#007bff' },
        greeting: 'Happy New Year!',
        message:
          'As we welcome the new year, may it bring you prosperity, health, and unforgettable Namibian experiences.',
      },
      easter: {
        emoji: '🐣',
        colors: { primary: '#ffc107', secondary: '#6f42c1' },
        greeting: 'Happy Easter!',
        message:
          'Wishing you renewal, hope, and the joy of new beginnings this Easter season.',
      },
      summer: {
        emoji: '☀️',
        colors: { primary: '#ffc107', secondary: '#28a745' },
        greeting: 'Happy Summer!',
        message:
          "Enjoy the warmth of summer and the beauty of Namibia's landscapes.",
      },
      winter: {
        emoji: '❄️',
        colors: { primary: '#6c757d', secondary: '#007bff' },
        greeting: 'Happy Winter!',
        message:
          'May your winter be cozy and filled with the warmth of Namibian hospitality.',
      },
      spring: {
        emoji: '🌸',
        colors: { primary: '#28a745', secondary: '#ffc107' },
        greeting: 'Happy Spring!',
        message: 'Welcome the renewal of spring and new adventures in Namibia.',
      },
      autumn: {
        emoji: '🍂',
        colors: { primary: '#fd7e14', secondary: '#28a745' },
        greeting: 'Happy Autumn!',
        message:
          'Enjoy the beautiful colors of autumn and the changing seasons in Namibia.',
      },
    };

    const theme = seasonThemes[params.season];
    const offers =
      params.specialOffers
        ?.map(
          (offer) => `
      <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 10px 0; border-left: 4px solid ${theme.colors.primary};">
        <h4 style="margin: 0 0 8px 0; color: #1f2937;">${offer.title}</h4>
        <p style="margin: 0 0 8px 0; color: #666;">${offer.description}</p>
        ${offer.discount ? `<p style="margin: 0 0 8px 0; font-weight: bold; color: ${theme.colors.primary};">${offer.discount} OFF</p>` : ''}
        ${offer.validUntil ? `<p style="margin: 0; font-size: 12px; color: #666;">Valid until: ${offer.validUntil}</p>` : ''}
      </div>
    `
        )
        .join('') || '';

    const highlights =
      params.propertyHighlights
        ?.map((highlight) => `<li style="margin: 5px 0;">${highlight}</li>`)
        .join('') || '';

    return this.generateEmailTemplate(
      `${theme.greeting}`,
      `
        <div style="background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%); color: white; padding: 40px 20px; border-radius: 12px 12px 0 0; text-align: center; margin-bottom: 0;">
          <div style="font-size: 48px; margin-bottom: 15px;">${theme.emoji}</div>
          <h1 style="margin: 0 0 15px 0; color: white; font-size: 32px;">${theme.greeting}</h1>
          <p style="margin: 0; opacity: 0.9; font-size: 18px;">${params.greetingMessage}</p>
        </div>

        <div style="padding: 30px 20px; background: #ffffff; border: 1px solid #e9ecef; border-top: none;">
          <p>Dear ${params.recipientName},</p>

          <p>${theme.message}</p>

          ${
            highlights
              ? `<div class="highlight">
            <p><strong>🏨 ${params.propertyName} Highlights:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              ${highlights}
            </ul>
          </div>`
              : ''
          }

          ${
            offers
              ? `<div style="margin: 25px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px;">🎁 Special Seasonal Offers</h3>
            ${offers}
          </div>`
              : ''
          }

          <p>In Namibia, every season brings new opportunities for connection and discovery. Whether you're planning a visit or just dreaming of our beautiful country, we're here to make your experience unforgettable.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="#" class="button">Plan Your Visit</a>
          </div>
        </div>
      `,
      params.propertyName
    );
  }

  /**
   * Generate seasonal greeting text content
   */
  private generateSeasonalGreetingText(params: SeasonalGreetingParams): string {
    const seasonGreetings = {
      christmas:
        'Merry Christmas! May your holiday be filled with joy and Namibian warmth.',
      new_year:
        'Happy New Year! May the coming year bring prosperity and adventure.',
      easter: 'Happy Easter! Wishing you renewal and hope this Easter season.',
      summer: 'Happy Summer! Enjoy the warmth and beauty of Namibia.',
      winter: 'Happy Winter! May your season be cozy and warm.',
      spring: 'Happy Spring! Welcome renewal and new adventures.',
      autumn: 'Happy Autumn! Enjoy the changing seasons of Namibia.',
    };

    const offers =
      params.specialOffers
        ?.map(
          (offer) =>
            `\n🎁 ${offer.title}\n${offer.description}${offer.discount ? `\n${offer.discount} OFF` : ''}${offer.validUntil ? `\nValid until: ${offer.validUntil}` : ''}`
        )
        .join('\n') || '';

    const highlights =
      params.propertyHighlights?.map((h) => `• ${h}`).join('\n') || '';

    return `${seasonGreetings[params.season]} - ${params.propertyName}

Dear ${params.recipientName},

${params.greetingMessage}

${highlights ? `\n🏨 ${params.propertyName} Highlights:\n${highlights}` : ''}

${offers ? `\n🎁 Special Seasonal Offers:${offers}` : ''}

We're here to make your Namibian experience special.

Powered by Sofia AI - Your Seasonal Guide`;
  }

  /**
   * Get seasonal subject line
   */
  private getSeasonalSubject(season: string): string {
    const subjects = {
      christmas: "Season's Greetings",
      new_year: 'Happy New Year',
      easter: 'Easter Blessings',
      summer: 'Summer Wishes',
      winter: 'Winter Greetings',
      spring: 'Spring Blessings',
      autumn: 'Autumn Wishes',
    };
    return subjects[season] || 'Seasonal Greetings';
  }

  /**
   * Generate system status HTML content
   */
  private generateSystemStatusHTML(params: any): string {
    const statusInfo = {
      maintenance: {
        emoji: '🔧',
        color: '#ffc107',
        title: 'Scheduled Maintenance',
      },
      outage: { emoji: '🚨', color: '#dc3545', title: 'Service Outage' },
      restored: { emoji: '✅', color: '#28a745', title: 'Service Restored' },
      upgrade: { emoji: '⬆️', color: '#17a2b8', title: 'System Upgrade' },
    };

    const status = statusInfo[params.statusType];
    const affectedServices = params.affectedServices?.length
      ? `<div style="margin: 15px 0;">
        <strong>Affected Services:</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          ${params.affectedServices.map((service) => `<li>${service}</li>`).join('')}
        </ul>
      </div>`
      : '';

    return this.generateEmailTemplate(
      'System Status Update',
      `
        <div style="background: ${status.color}20; border: 2px solid ${status.color}; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">${status.emoji}</div>
          <h2 style="color: ${status.color}; margin: 0;">${status.title}</h2>
        </div>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #1f2937; margin-bottom: 15px;">📋 System Status Details</h3>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value">${status.title}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Message:</span>
            <span class="detail-value">${params.message}</span>
          </div>
          ${
            params.estimatedResolution
              ? `<div class="detail-row">
            <span class="detail-label">Estimated Resolution:</span>
            <span class="detail-value">${params.estimatedResolution}</span>
          </div>`
              : ''
          }
          ${affectedServices}
        </div>

        <div style="background: #e8f5e9; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #155724; margin-bottom: 15px;">📞 Contact Information</h3>
          <p style="margin: 5px 0;"><strong>Support Email:</strong> ${params.contactInfo.supportEmail}</p>
          ${params.contactInfo.emergencyNumber ? `<p style="margin: 5px 0;"><strong>Emergency Number:</strong> ${params.contactInfo.emergencyNumber}</p>` : ''}
        </div>

        <p>We apologize for any inconvenience this may cause and appreciate your understanding. Our team is working diligently to maintain the highest standards of service.</p>
      `,
      'Buffr Host'
    );
  }

  /**
   * Generate system status text content
   */
  private generateSystemStatusText(params: any): string {
    const statusEmoji = {
      maintenance: '🔧',
      outage: '🚨',
      restored: '✅',
      upgrade: '⬆️',
    }[params.statusType];

    const affectedServices = params.affectedServices?.length
      ? `\nAffected Services:\n${params.affectedServices.map((s) => `• ${s}`).join('\n')}`
      : '';

    return `${statusEmoji} SYSTEM STATUS UPDATE - Buffr Host

${params.message}

Status Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Status: ${params.statusType.replace('_', ' ')}
${params.estimatedResolution ? `• Estimated Resolution: ${params.estimatedResolution}` : ''}
${affectedServices}

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Support: ${params.contactInfo.supportEmail}
${params.contactInfo.emergencyNumber ? `• Emergency: ${params.contactInfo.emergencyNumber}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
We apologize for any inconvenience.

Powered by Sofia AI - Your System Status Partner`;
  }

  /**
   * Generate booking reminder HTML content
   */
  private generateBookingReminderHTML(params: any): string {
    const reminderStyles = {
      '24h': { bg: '#e8f5e9', border: '#c3e6cb', title: '24 Hours to Go!' },
      '1h': { bg: '#fff3cd', border: '#ffeaa7', title: 'Check-in Time!' },
      check_in_day: {
        bg: '#d1ecf1',
        border: '#bee5eb',
        title: 'Welcome - Your Check-in Day!',
      },
    };

    const style = reminderStyles[params.reminderType];

    return this.generateEmailTemplate(
      'Booking Reminder',
      `
        <div style="background: ${style.bg}; border: 2px solid ${style.border}; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h2 style="margin: 0; color: #1f2937;">${style.title}</h2>
          <p style="margin: 10px 0 0 0; font-size: 18px;">We're excited to welcome you!</p>
        </div>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #1f2937; margin-bottom: 15px;">🏨 Your Check-in Details</h3>
          <div class="detail-row">
            <span class="detail-label">Property:</span>
            <span class="detail-value">${params.propertyName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Booking ID:</span>
            <span class="detail-value">${params.bookingId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Check-in Date:</span>
            <span class="detail-value">${params.checkInDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Check-in Time:</span>
            <span class="detail-value">${params.checkInTime}</span>
          </div>
          ${
            params.specialInstructions
              ? `<div class="detail-row">
            <span class="detail-label">Special Instructions:</span>
            <span class="detail-value">${params.specialInstructions}</span>
          </div>`
              : ''
          }
        </div>

        <div class="highlight">
          <p><strong>🏠 Check-in Process:</strong> Please arrive at your check-in time. Our team will be ready to welcome you with traditional Namibian hospitality ("omuriro otakuronga").</p>
        </div>

        ${
          params.contactInfo.phone
            ? `<div style="background: #e8f5e9; border: 1px solid #c3e6cb; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p><strong>📞 Contact Us:</strong> ${params.contactInfo.phone} | ${params.contactInfo.email}</p>
        </div>`
            : ''
        }

        <p>If you have any questions or need to modify your booking, please don't hesitate to contact us. We're here to make your Namibian experience perfect!</p>

        <div style="text-align: center;">
          <a href="#" class="button">View Full Booking Details</a>
        </div>
      `,
      params.propertyName
    );
  }

  /**
   * Generate booking reminder text content
   */
  private generateBookingReminderText(params: any): string {
    const reminderText = {
      '24h': '24 Hours Until Check-in',
      '1h': 'Check-in Reminder - 1 Hour',
      check_in_day: 'Welcome - Check-in Day!',
    }[params.reminderType];

    return `🏨 ${reminderText.toUpperCase()} - ${params.propertyName}

Dear ${params.guestName},

We're excited to welcome you!

🏨 CHECK-IN DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Property: ${params.propertyName}
• Booking ID: ${params.bookingId}
• Check-in Date: ${params.checkInDate}
• Check-in Time: ${params.checkInTime}
${params.specialInstructions ? `• Special Instructions: ${params.specialInstructions}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Our team will welcome you with Namibian hospitality.

Contact us if you have any questions.

Powered by Sofia AI - Your Check-in Guide`;
  }
}
