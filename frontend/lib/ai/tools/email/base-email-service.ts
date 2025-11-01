/**
 * Sofia AI Email Tools - Base Email Service - Buffr Host Implementation
 *
 * Purpose: Base class providing common email functionality and error handling
 * Location: /frontend/lib/ai/tools/email/base-email-service.ts
 * Usage: Base email service with common functionality for all email services
 *
 * @author George Nekwaya (george@buffr.ai)
 * @version 1.0.0
 * @framework Buffr Host Framework
 */

import { EmailResponse } from '@/lib/types/email';
import { EmailConfig } from './types/email-config';

/**
 * Base Email Service Class
 *
 * Provides common email functionality and error handling.
 * All specific email services extend this base class.
 */
export abstract class BaseEmailService {
  protected tenantId: string;
  protected propertyId: string;
  protected userId: string;

  constructor(config: EmailConfig) {
    this.tenantId = config.tenantId;
    this.propertyId = config.propertyId;
    this.userId = config.userId;
  }

  /**
   * Create a standardized error response
   */
  protected createErrorResponse(
    error: unknown,
    context: string
  ): EmailResponse {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(`[EmailService] Error in ${context}:`, error);

    return {
      success: false,
      messageId: null,
      status: 'failed',
      provider: 'SendGrid',
      timestamp: new Date().toISOString(),
      error: errorMessage,
    };
  }

  /**
   * Create a standardized success response
   */
  protected createSuccessResponse(
    messageId: string,
    context: string
  ): EmailResponse {
    console.log(
      `[EmailService] ${context} email sent successfully:`,
      messageId
    );

    return {
      success: true,
      messageId,
      status: 'sent',
      provider: 'SendGrid',
      timestamp: new Date().toISOString(),
      error: null,
    };
  }

  /**
   * Log email sending attempt
   */
  protected logEmailAttempt(recipient: string, type: string): void {
    console.log(`[EmailService] Sending ${type} email to:`, recipient);
  }

  /**
   * Format currency amount with Namibian context
   */
  protected formatCurrency(amount: number, currency: string = 'NAD'): string {
    return `${amount.toFixed(2)} ${currency === 'NAD' ? 'N$' : currency}`;
  }

  /**
   * Generate email template with Buffr Host branding
   */
  protected generateEmailTemplate(
    title: string,
    content: string,
    propertyName: string = 'Buffr Host Property'
  ): string {
    const brandColor = '#d4af86'; // Buffr gold
    const secondaryColor = '#8b7355'; // Darker gold
    const primaryColor = '#1f2937'; // Dark gray

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${propertyName}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, ${brandColor} 0%, ${secondaryColor} 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
      border-radius: 12px 12px 0 0;
    }
    .content {
      background: #ffffff;
      padding: 30px 20px;
      border: 1px solid #e9ecef;
      border-top: none;
    }
    .footer {
      background: #f8f9fa;
      padding: 25px 20px;
      text-align: center;
      border-radius: 0 0 12px 12px;
      border: 1px solid #e9ecef;
      border-top: none;
      font-size: 14px;
      color: #6c757d;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, ${brandColor} 0%, ${secondaryColor} 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 10px 0;
      transition: all 0.3s ease;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(212, 175, 134, 0.3);
    }
    .highlight {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .highlight strong {
      color: #856404;
    }
    h1, h2, h3 {
      color: ${primaryColor};
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      padding: 8px 0;
      border-bottom: 1px solid #e9ecef;
    }
    .detail-row:last-child {
      border-bottom: none;
      font-weight: bold;
      font-size: 18px;
      border-top: 2px solid ${brandColor};
      padding-top: 15px;
    }
    .detail-label {
      font-weight: 600;
      color: ${primaryColor};
    }
    .detail-value {
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${propertyName}</div>
      <h1>${title}</h1>
      <p>Modern Hospitality Management</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>Thank you for choosing ${propertyName}</strong></p>
      <p>Powered by Buffr Host - The future of hospitality, today</p>
      <p>Experience the warmth of Namibian hospitality - where every guest is family</p>
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Validate email parameters
   */
  protected validateEmailParams(
    email: string,
    subject: string
  ): { valid: boolean; error?: string } {
    if (!email || !email.includes('@')) {
      return { valid: false, error: 'Invalid email address' };
    }
    if (!subject || subject.trim().length === 0) {
      return { valid: false, error: 'Subject is required' };
    }
    return { valid: true };
  }

  /**
   * Generate a unique message ID
   */
  protected generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Mock email service for development/testing
   * Replace with actual SendGrid implementation in production
   */
  protected async mockEmailService(params: {
    to: string;
    subject: string;
    content: string;
  }): Promise<{ success: boolean; messageId: string; error?: string }> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Mock successful response
    return {
      success: true,
      messageId: this.generateMessageId(),
    };
  }
}
