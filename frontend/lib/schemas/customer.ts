/**
 * Customer/CRM Zod Schemas
 * Validation schemas for Customer Relationship Management
 */

import { z } from 'zod';

export const CustomerBaseSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1).max(255),
  phone: z.string().optional(),
  date_of_birth: z.date().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  preferred_language: z.string().optional(),
  dietary_restrictions: z.array(z.string()).optional(),
  special_requests: z.string().optional(),
  marketing_consent: z.boolean(),
  data_processing_consent: z.boolean(),
});

export const CustomerCreateSchema = CustomerBaseSchema;

export const CustomerUpdateSchema = z.object({
  email: z.string().email().optional(),
  full_name: z.string().min(1).max(255).optional(),
  phone: z.string().optional(),
  date_of_birth: z.date().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  preferred_language: z.string().optional(),
  dietary_restrictions: z.array(z.string()).optional(),
  special_requests: z.string().optional(),
  marketing_consent: z.boolean().optional(),
  data_processing_consent: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export const CustomerResponseSchema = CustomerBaseSchema.extend({
  id: z.string().uuid(),
  customer_id: z.string(),
  property_id: z.number().int().positive(),
  tenant_id: z.number().int().positive().optional(),
  is_active: z.boolean(),
  is_vip: z.boolean(),
  total_spent: z.number(),
  total_bookings: z.number().int(),
  last_booking_date: z.date().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  last_login: z.date().optional(),
  profile_picture: z.string().url().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  source: z.string().optional(),
  referral_source: z.string().optional(),
});

export const CustomerSummarySchema = z.object({
  id: z.string().uuid(),
  full_name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  total_spent: z.number(),
  total_bookings: z.number().int(),
  last_booking_date: z.date().optional(),
  is_vip: z.boolean(),
  tags: z.array(z.string()).optional(),
});

export const CustomerSearchSchema = z.object({
  query: z.string().optional(),
  property_id: z.number().int().positive().optional(),
  tenant_id: z.number().int().positive().optional(),
  is_active: z.boolean().optional(),
  is_vip: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  created_after: z.date().optional(),
  created_before: z.date().optional(),
  last_booking_after: z.date().optional(),
  last_booking_before: z.date().optional(),
  total_spent_min: z.number().optional(),
  total_spent_max: z.number().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const CustomerFilterSchema = z.object({
  property_id: z.number().int().positive().optional(),
  tenant_id: z.number().int().positive().optional(),
  is_active: z.boolean().optional(),
  is_vip: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  source: z.string().optional(),
  nationality: z.string().optional(),
  preferred_language: z.string().optional(),
  created_after: z.date().optional(),
  created_before: z.date().optional(),
  last_booking_after: z.date().optional(),
  last_booking_before: z.date().optional(),
  total_spent_min: z.number().optional(),
  total_spent_max: z.number().optional(),
});

export const CustomerAnalyticsSchema = z.object({
  total_customers: z.number().int(),
  active_customers: z.number().int(),
  vip_customers: z.number().int(),
  new_customers: z.number().int(),
  returning_customers: z.number().int(),
  average_spending: z.number(),
  total_revenue: z.number(),
  customer_lifetime_value: z.number(),
  retention_rate: z.number().min(0).max(100),
  churn_rate: z.number().min(0).max(100),
  by_source: z.record(z.string(), z.number().int()),
  by_nationality: z.record(z.string(), z.number().int()),
  by_language: z.record(z.string(), z.number().int()),
  by_tags: z.record(z.string(), z.number().int()),
  growth_rate: z.number(),
  top_customers: z.array(CustomerSummarySchema),
});

export const LoyaltyPointsUpdateSchema = z.object({
  customer_id: z.string().uuid(),
  points: z.number().int(),
  reason: z.string().min(1).max(255),
  property_id: z.number().int().positive(),
  booking_id: z.string().uuid().optional(),
  expires_at: z.date().optional(),
});

export const LoyaltyPointsResponseSchema = z.object({
  customer_id: z.string().uuid(),
  current_points: z.number().int(),
  total_earned: z.number().int(),
  total_redeemed: z.number().int(),
  available_points: z.number().int(),
  tier: z.string(),
  tier_benefits: z.array(z.string()),
  next_tier_points: z.number().int(),
  points_expiring_soon: z.number().int(),
  last_activity: z.date(),
});

export const CustomerSegmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  criteria: z.record(z.string(), z.any()),
  customer_count: z.number().int(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const CustomerCommunicationSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  type: z.enum(['email', 'sms', 'phone', 'in_person']),
  subject: z.string().optional(),
  content: z.string(),
  sent_at: z.date(),
  status: z.enum([
    'sent',
    'delivered',
    'opened',
    'clicked',
    'replied',
    'failed',
  ]),
  response: z.string().optional(),
  created_by: z.string().uuid(),
});

export const CustomerNoteSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  note: z.string().min(1),
  category: z.enum([
    'general',
    'preference',
    'complaint',
    'compliment',
    'special_request',
  ]),
  is_private: z.boolean(),
  created_by: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const CustomerTagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  description: z.string().optional(),
  customer_count: z.number().int(),
  created_at: z.date(),
});

export const CustomerImportSchema = z.object({
  customers: z.array(CustomerCreateSchema),
  property_id: z.number().int().positive(),
  update_existing: z.boolean().default(false),
  send_welcome_email: z.boolean().default(false),
});

export const CustomerExportSchema = z.object({
  property_id: z.number().int().positive().optional(),
  format: z.enum(['csv', 'excel', 'json']).default('csv'),
  include_analytics: z.boolean().default(false),
  date_range: z
    .object({
      start_date: z.date(),
      end_date: z.date(),
    })
    .optional(),
});

export const CustomerBulkUpdateSchema = z.object({
  customer_ids: z.array(z.string().uuid()),
  updates: CustomerUpdateSchema,
  reason: z.string().min(1).max(255),
});

export const CustomerMergeSchema = z.object({
  primary_customer_id: z.string().uuid(),
  secondary_customer_id: z.string().uuid(),
  merge_data: CustomerUpdateSchema,
  reason: z.string().min(1).max(255),
});

export const CustomerDuplicateSchema = z.object({
  customer_id: z.string().uuid(),
  duplicate_customer_id: z.string().uuid(),
  confidence_score: z.number().min(0).max(1),
  matching_fields: z.array(z.string()),
  suggested_action: z.enum(['merge', 'ignore', 'review']),
});

export const CustomerActivitySchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  activity_type: z.enum([
    'booking',
    'payment',
    'communication',
    'visit',
    'review',
    'complaint',
  ]),
  description: z.string(),
  metadata: z.record(z.string(), z.any()),
  created_at: z.date(),
  property_id: z.number().int().positive(),
});

export const CustomerPreferencesSchema = z.object({
  customer_id: z.string().uuid(),
  room_preferences: z
    .object({
      room_type: z.string().optional(),
      floor_preference: z.string().optional(),
      view_preference: z.string().optional(),
      bed_type: z.string().optional(),
    })
    .optional(),
  service_preferences: z
    .object({
      housekeeping_frequency: z.string().optional(),
      wake_up_call: z.boolean().optional(),
      newspaper: z.boolean().optional(),
      minibar: z.boolean().optional(),
    })
    .optional(),
  communication_preferences: z
    .object({
      preferred_language: z.string().optional(),
      email_notifications: z.boolean().optional(),
      sms_notifications: z.boolean().optional(),
      phone_calls: z.boolean().optional(),
      marketing_emails: z.boolean().optional(),
    })
    .optional(),
  dietary_preferences: z
    .object({
      restrictions: z.array(z.string()).optional(),
      allergies: z.array(z.string()).optional(),
      favorite_foods: z.array(z.string()).optional(),
      beverage_preferences: z.array(z.string()).optional(),
    })
    .optional(),
});

export const CustomerLoyaltyProgramSchema = z.object({
  customer_id: z.string().uuid(),
  program_id: z.string().uuid(),
  program_name: z.string(),
  tier: z.string(),
  points: z.number().int(),
  benefits: z.array(z.string()),
  next_tier_points: z.number().int(),
  membership_date: z.date(),
  expiry_date: z.date().optional(),
  is_active: z.boolean(),
});

export const CustomerFeedbackSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  booking_id: z.string().uuid().optional(),
  rating: z.number().int().min(1).max(5),
  feedback_type: z.enum(['service', 'room', 'food', 'staff', 'overall']),
  comment: z.string().optional(),
  is_public: z.boolean(),
  created_at: z.date(),
  response: z.string().optional(),
  responded_by: z.string().uuid().optional(),
  responded_at: z.date().optional(),
});
