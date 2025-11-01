/**
 * Sofia AI Email Tools - Restaurant Email Service - Buffr Host Implementation
 *
 * Purpose: Handles restaurant-specific email communications including order confirmations,
 * reservations, and dining experiences with Namibian culinary context.
 *
 * Location: /frontend/lib/ai/tools/email/restaurant-email-service.ts
 * Usage: Restaurant-specific email functionality for Buffr Host
 *
 * @author George Nekwaya (george@buffr.ai)
 * @version 1.0.0
 * @framework Buffr Host Framework
 */

import { EmailResponse } from '@/lib/types/email';
import { BaseEmailService } from './base-email-service';
import { OrderConfirmationParams } from './types/email-config';

/**
 * Restaurant Email Service Class
 *
 * Handles restaurant-specific email communications for Buffr Host
 * with Namibian culinary context and Sofia AI personalization.
 */
export class RestaurantEmailService extends BaseEmailService {
  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(
    params: OrderConfirmationParams
  ): Promise<EmailResponse> {
    this.logEmailAttempt(params.customerEmail, 'order confirmation');

    try {
      const validation = this.validateEmailParams(
        params.customerEmail,
        `Order Confirmation - ${params.restaurantName}`
      );
      if (!validation.valid) {
        return this.createErrorResponse(
          new Error(validation.error),
          'Order confirmation validation'
        );
      }

      const htmlContent = this.generateOrderConfirmationHTML(params);
      const textContent = this.generateOrderConfirmationText(params);

      const result = await this.mockEmailService({
        to: params.customerEmail,
        subject: `🍽️ Order Confirmed - ${params.restaurantName}`,
        htmlContent,
        textContent,
      });

      if (result.success) {
        console.log(
          `[Sofia AI] Order confirmation sent to ${params.customerName} with Namibian culinary context`
        );
        return this.createSuccessResponse(
          result.messageId,
          'Order confirmation'
        );
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'Order confirmation send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'Order confirmation');
    }
  }

  /**
   * Send reservation confirmation email
   */
  async sendReservationConfirmation(params: {
    customerEmail: string;
    customerName: string;
    restaurantName: string;
    reservationId: string;
    date: string;
    time: string;
    partySize: number;
    specialRequests?: string;
    diningArea?: string;
  }): Promise<EmailResponse> {
    this.logEmailAttempt(params.customerEmail, 'reservation confirmation');

    try {
      const htmlContent = this.generateReservationConfirmationHTML(params);
      const textContent = this.generateReservationConfirmationText(params);

      const result = await this.mockEmailService({
        to: params.customerEmail,
        subject: `🎯 Reservation Confirmed - ${params.restaurantName}`,
        htmlContent,
        textContent,
      });

      if (result.success) {
        return this.createSuccessResponse(
          result.messageId,
          'Reservation confirmation'
        );
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'Reservation confirmation send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'Reservation confirmation');
    }
  }

  /**
   * Send menu recommendation email
   */
  async sendMenuRecommendation(params: {
    customerEmail: string;
    customerName: string;
    restaurantName: string;
    recommendations: Array<{
      dish: string;
      description: string;
      price: number;
      whyRecommended: string;
    }>;
    dietaryPreferences?: string[];
    occasion?: string;
  }): Promise<EmailResponse> {
    this.logEmailAttempt(params.customerEmail, 'menu recommendation');

    try {
      const htmlContent = this.generateMenuRecommendationHTML(params);
      const textContent = this.generateMenuRecommendationText(params);

      const result = await this.mockEmailService({
        to: params.customerEmail,
        subject: `🍽️ Chef's Recommendations - ${params.restaurantName}`,
        htmlContent,
        textContent,
      });

      if (result.success) {
        return this.createSuccessResponse(
          result.messageId,
          'Menu recommendation'
        );
      } else {
        return this.createErrorResponse(
          new Error(result.error),
          'Menu recommendation send'
        );
      }
    } catch (error) {
      return this.createErrorResponse(error, 'Menu recommendation');
    }
  }

  /**
   * Generate order confirmation HTML content
   */
  private generateOrderConfirmationHTML(
    params: OrderConfirmationParams
  ): string {
    const {
      customerName,
      orderId,
      items,
      totalAmount,
      currency,
      restaurantName,
      orderType,
    } = params;
    const itemsList = items
      .map(
        (item) => `
        <div class="detail-row">
          <span class="detail-value">${item.name} × ${item.quantity}</span>
          <span class="detail-value">N$${item.price.toFixed(2)}</span>
        </div>`
      )
      .join('');

    return this.generateEmailTemplate(
      'Order Confirmed!',
      `
        <h2>🍽️ Your Order is Confirmed</h2>

        <p>Dear ${customerName},</p>

        <p>Thank you for choosing ${restaurantName}! We're excited to serve you an exceptional dining experience that captures the rich flavors of Namibian and African cuisine.</p>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #d4af86;">
          <h3 style="color: #1f2937; margin-bottom: 20px;">🍽️ Order Details</h3>
          <div class="detail-row">
            <span class="detail-label">Order ID:</span>
            <span class="detail-value">${orderId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Order Type:</span>
            <span class="detail-value">${orderType || 'dine-in'}</span>
          </div>
          <h4 style="color: #1f2937; margin: 20px 0 15px 0;">Selected Items:</h4>
          ${itemsList}
          <div class="detail-row" style="font-weight: bold; font-size: 18px; border-top: 2px solid #d4af86; padding-top: 15px;">
            <span class="detail-label">Total Amount:</span>
            <span class="detail-value" style="color: #d4af86;">N$${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div class="highlight">
          <p><strong>👨‍🍳 Estimated Preparation Time:</strong> ${orderType === 'dine-in' ? '20-25 minutes' : '15-20 minutes'}. We'll notify you when your order is ready to enjoy!</p>
        </div>

        <p>Our chefs are preparing your meal with the freshest local ingredients and traditional Namibian cooking techniques. We look forward to providing you with an unforgettable dining experience.</p>

        <p>If you have any dietary requirements or special requests, please let us know immediately.</p>
      `,
      restaurantName
    );
  }

  /**
   * Generate order confirmation text content
   */
  private generateOrderConfirmationText(
    params: OrderConfirmationParams
  ): string {
    const {
      customerName,
      orderId,
      items,
      totalAmount,
      currency,
      restaurantName,
      orderType,
    } = params;
    const itemsList = items
      .map(
        (item) =>
          `• ${item.name} × ${item.quantity} - N$${item.price.toFixed(2)}`
      )
      .join('\n');

    return `🍽️ ORDER CONFIRMATION - ${restaurantName}

Dear ${customerName},

Thank you for choosing ${restaurantName}! We're excited to serve you an exceptional dining experience that captures the rich flavors of Namibian and African cuisine.

🍽️ ORDER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Order ID: ${orderId}
• Order Type: ${orderType || 'dine-in'}

SELECTED ITEMS:
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Total Amount: N$${totalAmount.toFixed(2)}

👨‍🍳 Estimated Preparation Time:
${orderType === 'dine-in' ? '20-25 minutes' : '15-20 minutes'}. We'll notify you when your order is ready to enjoy!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Our chefs are preparing your meal with the freshest local ingredients and traditional Namibian cooking techniques. We look forward to providing you with an unforgettable dining experience.

If you have any dietary requirements or special requests, please let us know immediately.

✨ Powered by Sofia AI - Your Namibian Culinary Guide
Savor the flavors of Namibia - where every meal tells a story
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  }

  /**
   * Generate reservation confirmation HTML content
   */
  private generateReservationConfirmationHTML(params: any): string {
    return this.generateEmailTemplate(
      'Reservation Confirmed!',
      `
        <h2>🎯 Your Reservation is Confirmed</h2>

        <p>Dear ${params.customerName},</p>

        <p>We're delighted to confirm your reservation at ${params.restaurantName}. Our team is preparing everything for your memorable dining experience.</p>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #d4af86;">
          <h3 style="color: #1f2937; margin-bottom: 20px;">🎯 Reservation Details</h3>
          <div class="detail-row">
            <span class="detail-label">Reservation ID:</span>
            <span class="detail-value">${params.reservationId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span class="detail-value">${params.date}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Time:</span>
            <span class="detail-value">${params.time}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Party Size:</span>
            <span class="detail-value">${params.partySize} guests</span>
          </div>
          ${
            params.diningArea
              ? `<div class="detail-row">
            <span class="detail-label">Dining Area:</span>
            <span class="detail-value">${params.diningArea}</span>
          </div>`
              : ''
          }
          ${
            params.specialRequests
              ? `<div class="detail-row">
            <span class="detail-label">Special Requests:</span>
            <span class="detail-value">${params.specialRequests}</span>
          </div>`
              : ''
          }
        </div>

        <div class="highlight">
          <p><strong>🍽️ Dining Experience:</strong> Our chefs are preparing a menu featuring the finest Namibian ingredients and traditional cooking techniques. We look forward to welcoming you!</p>
        </div>

        <p>If you need to modify your reservation or have any special requests, please don't hesitate to contact us. Your comfort and enjoyment are our highest priorities.</p>

        <div style="text-align: center;">
          <a href="#" class="button">View Reservation Details</a>
        </div>
      `,
      params.restaurantName
    );
  }

  /**
   * Generate reservation confirmation text content
   */
  private generateReservationConfirmationText(params: any): string {
    return `🎯 RESERVATION CONFIRMED - ${params.restaurantName}

Dear ${params.customerName},

We're delighted to confirm your reservation at ${params.restaurantName}.

🎯 RESERVATION DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Reservation ID: ${params.reservationId}
• Date: ${params.date}
• Time: ${params.time}
• Party Size: ${params.partySize} guests
${params.diningArea ? `• Dining Area: ${params.diningArea}` : ''}
${params.specialRequests ? `• Special Requests: ${params.specialRequests}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Our chefs are preparing a menu featuring Namibian ingredients.

If you need to modify your reservation, please contact us.

Powered by Sofia AI - Your Namibian Culinary Guide`;
  }

  /**
   * Generate menu recommendation HTML content
   */
  private generateMenuRecommendationHTML(params: any): string {
    const recommendations = params.recommendations
      .map(
        (rec: any) => `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #d4af86;">
          <h4 style="color: #1f2937; margin: 0 0 10px 0;">${rec.dish}</h4>
          <p style="margin: 5px 0; color: #666;">${rec.description}</p>
          <p style="margin: 5px 0; font-weight: bold; color: #d4af86;">N$${rec.price.toFixed(2)}</p>
          <p style="margin: 10px 0 0 0; font-style: italic; color: #666;">"${rec.whyRecommended}"</p>
        </div>`
      )
      .join('');

    return this.generateEmailTemplate(
      "Chef's Recommendations",
      `
        <h2>🍽️ Chef's Personal Recommendations</h2>

        <p>Dear ${params.customerName},</p>

        <p>Based on your preferences${params.occasion ? ` and the occasion (${params.occasion})` : ''}, our chefs have curated these special recommendations featuring the finest Namibian ingredients and traditional cooking techniques.</p>

        ${
          params.dietaryPreferences
            ? `<div class="highlight">
          <p><strong>🥗 Dietary Considerations:</strong> We've taken your ${params.dietaryPreferences.join(', ')} preferences into account when making these recommendations.</p>
        </div>`
            : ''
        }

        <h3 style="color: #1f2937;">Chef's Special Recommendations:</h3>
        ${recommendations}

        <div class="highlight">
          <p><strong>👨‍🍳 From Our Kitchen to Yours:</strong> Each dish is prepared with traditional Namibian cooking methods and the freshest local ingredients. Our chefs draw inspiration from Namibia's diverse culinary heritage.</p>
        </div>

        <p>Would you like to reserve a table to enjoy these recommendations, or would you prefer to place an order for takeaway/delivery?</p>

        <div style="text-align: center;">
          <a href="#" class="button">Make a Reservation</a>
          <a href="#" style="display: inline-block; padding: 12px 24px; background: #6c757d; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 10px 10px 0;">Order for Delivery</a>
        </div>
      `,
      params.restaurantName
    );
  }

  /**
   * Generate menu recommendation text content
   */
  private generateMenuRecommendationText(params: any): string {
    const recommendations = params.recommendations
      .map(
        (rec: any) => `
🍽️ ${rec.dish} - N$${rec.price.toFixed(2)}
${rec.description}
"${rec.whyRecommended}"`
      )
      .join('\n');

    return `🍽️ CHEF'S RECOMMENDATIONS - ${params.restaurantName}

Dear ${params.customerName},

Based on your preferences${params.occasion ? ` and ${params.occasion}` : ''}, our chefs recommend:

${recommendations}

Each dish features traditional Namibian cooking methods and fresh local ingredients.

Would you like to make a reservation or order for delivery?

Powered by Sofia AI - Your Namibian Culinary Guide`;
  }
}
