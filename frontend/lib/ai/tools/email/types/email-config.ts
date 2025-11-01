/**
 * Sofia Email Configuration Types - Buffr Host Implementation
 *
 * Purpose: Defines configuration interfaces and data structures for Sofia Email Tools
 * Location: /frontend/lib/ai/tools/email/types/email-config.ts
 * Usage: Type definitions for Sofia email tools configuration
 *
 * @author George Nekwaya (george@buffr.ai)
 * @version 1.0.0
 * @framework Buffr Host Framework
 */

import { EmailResponse } from '@/lib/types/email';

/**
 * Sofia Email Tools Configuration Interface
 *
 * Defines the configuration parameters for Sofia Email Tools
 * with tenant, property, and user context.
 */
export interface EmailConfig {
  tenantId: string;
  propertyId: string;
  userId: string;
}

/**
 * Booking Confirmation Email Parameters
 *
 * Defines the parameters for booking confirmation emails
 * sent to hotel guests.
 */
export interface BookingConfirmationParams {
  guestEmail: string;
  guestName: string;
  bookingId: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  totalAmount: number;
  currency?: string;
  hotelName?: string;
}

/**
 * Order Confirmation Email Parameters
 *
 * Defines the parameters for order confirmation emails
 * sent to restaurant customers.
 */
export interface OrderConfirmationParams {
  customerEmail: string;
  customerName: string;
  orderId: string;
  orderDate?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  currency?: string;
  restaurantName?: string;
  orderType?: 'dine-in' | 'takeaway' | 'delivery';
}

/**
 * Welcome Email Parameters
 *
 * Defines the parameters for welcome emails
 * sent to new guests.
 */
export interface WelcomeEmailParams {
  guestEmail: string;
  guestName: string;
  propertyName: string;
  propertyType: 'hotel' | 'restaurant';
  checkInDate?: string;
  specialInstructions?: string;
}

/**
 * Custom Email Parameters
 *
 * Defines the parameters for custom emails
 * sent through Sofia.
 */
export interface CustomEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string;
}

/**
 * Service Request Parameters
 *
 * Defines the parameters for service request confirmation emails.
 */
export interface ServiceRequestParams {
  customerEmail: string;
  customerName: string;
  serviceType: string;
  requestId: string;
  requestDetails: string;
  estimatedCompletion?: string;
  contactInfo: {
    phone?: string;
    preferredTime?: string;
  };
}

/**
 * Loyalty Program Email Parameters
 *
 * Defines the parameters for loyalty program emails.
 */
export interface LoyaltyProgramParams {
  customerEmail: string;
  customerName: string;
  programName: string;
  currentPoints: number;
  tierLevel: string;
  benefits: string[];
  nextReward?: string;
  expiryDate?: string;
}

/**
 * Property Owner Onboarding Parameters
 *
 * Defines the parameters for property owner onboarding emails.
 */
export interface PropertyOwnerOnboardingParams {
  ownerEmail: string;
  ownerName: string;
  propertyName: string;
  onboardingSteps: Array<{
    step: string;
    completed: boolean;
    dueDate?: string;
  }>;
  supportContact: {
    name: string;
    email: string;
    phone?: string;
  };
  nextSteps: string[];
}

/**
 * Review Request Parameters
 *
 * Defines the parameters for review request emails.
 */
export interface ReviewRequestParams {
  guestEmail: string;
  guestName: string;
  propertyName: string;
  bookingId: string;
  checkOutDate: string;
  reviewUrl: string;
  propertyType: 'hotel' | 'restaurant';
}

/**
 * Emergency Notification Parameters
 *
 * Defines the parameters for emergency notification emails.
 */
export interface EmergencyNotificationParams {
  recipientEmail: string;
  recipientName: string;
  emergencyType:
    | 'booking_cancellation'
    | 'service_disruption'
    | 'safety_alert'
    | 'weather_warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  affectedServices?: string[];
  alternativeOptions?: string[];
  contactInfo: {
    emergencyNumber: string;
    supportEmail: string;
  };
}

/**
 * Seasonal Greeting Parameters
 *
 * Defines the parameters for seasonal greeting emails.
 */
export interface SeasonalGreetingParams {
  recipientEmail: string;
  recipientName: string;
  propertyName: string;
  season:
    | 'christmas'
    | 'new_year'
    | 'easter'
    | 'summer'
    | 'winter'
    | 'spring'
    | 'autumn';
  greetingMessage: string;
  specialOffers?: Array<{
    title: string;
    description: string;
    discount?: string;
    validUntil?: string;
  }>;
  propertyHighlights?: string[];
}

/**
 * Email Template Data Interface
 *
 * Defines the data structure for email templates
 * used in Sofia email generation.
 */
export interface EmailTemplateData {
  recipientName: string;
  propertyName: string;
  propertyType: 'hotel' | 'restaurant';
  [key: string]: any;
}

/**
 * Email Service Interface
 *
 * Defines the interface that all email services must implement.
 */
export interface EmailServiceInterface {
  sendBookingConfirmation(
    params: BookingConfirmationParams
  ): Promise<EmailResponse>;
  sendOrderConfirmation(
    params: OrderConfirmationParams
  ): Promise<EmailResponse>;
  sendWelcomeEmail(params: WelcomeEmailParams): Promise<EmailResponse>;
  sendCustomEmail(params: CustomEmailParams): Promise<EmailResponse>;
  sendServiceRequestConfirmation(
    params: ServiceRequestParams
  ): Promise<EmailResponse>;
  sendLoyaltyProgramEmail(params: LoyaltyProgramParams): Promise<EmailResponse>;
  sendPropertyOwnerOnboarding(
    params: PropertyOwnerOnboardingParams
  ): Promise<EmailResponse>;
  sendReviewRequest(params: ReviewRequestParams): Promise<EmailResponse>;
  sendEmergencyNotification(
    params: EmergencyNotificationParams
  ): Promise<EmailResponse>;
  sendSeasonalGreeting(params: SeasonalGreetingParams): Promise<EmailResponse>;
}

/**
 * Sofia Email Response Interface
 *
 * Extends the base EmailResponse with Sofia-specific
 * context and metadata.
 */
export interface SofiaEmailResponse extends EmailResponse {
  sofiaContext?: {
    tenantId: string;
    propertyId: string;
    userId: string;
    emailType: string;
    timestamp: string;
  };
}
