/**
 * API Validation Schemas for Buffr Host Hospitality Platform
 *
 * Comprehensive server-side validation schemas using Zod for type-safe API request/response validation.
 * Implements the audit recommendation for proper server-side validation with Zod schemas.
 *
 * Location: lib/validation/schemas.ts
 * Purpose: Centralized validation schemas for all API endpoints
 * Modularity: Organized by domain (auth, bookings, users, etc.) for maintainability
 * Security: Input sanitization, type validation, and business rule enforcement
 * Performance: Efficient validation with early error detection
 * Scalability: Extensible schema system supporting complex validation rules
 *
 * Validation Capabilities:
 * - Type-safe request/response validation
 * - Input sanitization and business rule validation
 * - Comprehensive error messaging for API consumers
 * - Schema reusability across multiple endpoints
 * - Multi-tenant validation context support
 *
 * Key Features:
 * - Zod-based type-safe validation
 * - Custom validation rules for business logic
 * - Consistent error response format
 * - Development-friendly error messages
 * - Production-ready validation performance
 *
 * @module ValidationSchemas
 * @author Buffr Host Development Team
 * @version 1.0.0
 * @since 2025-01-01
 */

import { z } from 'zod';

// ============================================================================
// COMMON VALIDATION SCHEMAS
// ============================================================================

/**
 * Email validation schema with business rules
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(254, 'Email is too long')
  .transform((email) => email.toLowerCase().trim());

/**
 * Password validation schema with security requirements
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

/**
 * Phone number validation schema
 */
export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^[\+]?[1-9][\d]{6,14}$/, 'Invalid phone number format (must be 7-15 digits)')
  .max(20, 'Phone number is too long');

/**
 * UUID validation schema
 */
export const uuidSchema = z
  .string()
  .uuid('Invalid UUID format');

/**
 * Positive integer validation schema
 */
export const positiveIntegerSchema = z
  .number()
  .int()
  .positive('Must be a positive integer');

/**
 * Date validation schema
 */
export const dateSchema = z
  .string()
  .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format')
  .transform((date) => new Date(date));

// ============================================================================
// AUTHENTICATION SCHEMAS
// ============================================================================

/**
 * User registration validation schema
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  phone: phoneSchema.optional(),
  tenantId: uuidSchema.optional(),
});

/**
 * User login validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

/**
 * Password reset request validation schema
 */
export const resetPasswordRequestSchema = z.object({
  email: emailSchema,
});

/**
 * Password reset validation schema
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
});

/**
 * Change password validation schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

// ============================================================================
// BOOKING SCHEMAS
// ============================================================================

/**
 * Booking creation validation schema
 */
export const createBookingSchema = z.object({
  propertyId: uuidSchema,
  roomId: uuidSchema,
  guestName: z.string().min(1, 'Guest name is required').max(100, 'Guest name is too long'),
  guestEmail: emailSchema,
  guestPhone: phoneSchema.optional(),
  checkInDate: dateSchema,
  checkOutDate: dateSchema,
  numberOfGuests: positiveIntegerSchema.max(20, 'Too many guests'),
  specialRequests: z.string().max(1000, 'Special requests are too long').optional(),
  tenantId: uuidSchema.optional(),
}).refine((data) => data.checkOutDate > data.checkInDate, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOutDate'],
});

/**
 * Booking update validation schema
 */
export const updateBookingSchema = z.object({
  guestName: z.string().min(1, 'Guest name is required').max(100, 'Guest name is too long').optional(),
  guestEmail: emailSchema.optional(),
  guestPhone: phoneSchema.optional(),
  checkInDate: dateSchema.optional(),
  checkOutDate: dateSchema.optional(),
  numberOfGuests: positiveIntegerSchema.max(20, 'Too many guests').optional(),
  specialRequests: z.string().max(1000, 'Special requests are too long').optional(),
  status: z.enum(['confirmed', 'cancelled', 'checked_in', 'checked_out', 'no_show']).optional(),
}).refine((data) => {
  if (data.checkInDate && data.checkOutDate) {
    return data.checkOutDate > data.checkInDate;
  }
  return true;
}, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOutDate'],
});

/**
 * Booking search/filter validation schema
 */
export const bookingSearchSchema = z.object({
  propertyId: uuidSchema.optional(),
  status: z.enum(['confirmed', 'cancelled', 'checked_in', 'checked_out', 'no_show']).optional(),
  checkInDate: dateSchema.optional(),
  checkOutDate: dateSchema.optional(),
  guestEmail: emailSchema.optional(),
  limit: positiveIntegerSchema.max(100, 'Limit cannot exceed 100').optional().default(20),
  offset: z.number().int().min(0, 'Offset must be non-negative').optional().default(0),
  tenantId: uuidSchema.optional(),
});

// ============================================================================
// PROPERTY SCHEMAS
// ============================================================================

/**
 * Property creation validation schema
 */
export const createPropertySchema = z.object({
  name: z.string().min(1, 'Property name is required').max(100, 'Property name is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  address: z.string().min(1, 'Address is required').max(500, 'Address is too long'),
  city: z.string().min(1, 'City is required').max(100, 'City is too long'),
  state: z.string().max(100, 'State is too long').optional(),
  country: z.string().min(1, 'Country is required').max(100, 'Country is too long'),
  postalCode: z.string().max(20, 'Postal code is too long').optional(),
  phone: phoneSchema.optional(),
  email: emailSchema.optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  amenities: z.array(z.string().max(100, 'Amenity name is too long')).max(50, 'Too many amenities').optional(),
  tenantId: uuidSchema.optional(),
});

/**
 * Property update validation schema
 */
export const updatePropertySchema = z.object({
  name: z.string().min(1, 'Property name is required').max(100, 'Property name is too long').optional(),
  description: z.string().max(2000, 'Description is too long').optional(),
  address: z.string().min(1, 'Address is required').max(500, 'Address is too long').optional(),
  city: z.string().min(1, 'City is required').max(100, 'City is too long').optional(),
  state: z.string().max(100, 'State is too long').optional(),
  country: z.string().min(1, 'Country is required').max(100, 'Country is too long').optional(),
  postalCode: z.string().max(20, 'Postal code is too long').optional(),
  phone: phoneSchema.optional(),
  email: emailSchema.optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  amenities: z.array(z.string().max(100, 'Amenity name is too long')).max(50, 'Too many amenities').optional(),
});

// ============================================================================
// USER MANAGEMENT SCHEMAS
// ============================================================================

/**
 * User profile update validation schema
 */
export const updateUserProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long').optional(),
  phone: phoneSchema.optional(),
  avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
});

/**
 * User creation validation schema (admin only)
 */
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  phone: phoneSchema.optional(),
  role: z.enum(['admin', 'manager', 'staff', 'guest']).default('guest'),
  tenantId: uuidSchema.optional(),
});

// ============================================================================
// COMMUNICATION SCHEMAS
// ============================================================================

/**
 * Email sending validation schema
 */
export const sendEmailSchema = z.object({
  to: z.array(emailSchema).min(1, 'At least one recipient is required').max(50, 'Too many recipients'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject is too long'),
  html: z.string().min(1, 'Email content is required').max(100000, 'Email content is too large'),
  text: z.string().max(100000, 'Text content is too large').optional(),
  tenantId: uuidSchema.optional(),
});

/**
 * WhatsApp message validation schema
 */
export const sendWhatsAppSchema = z.object({
  to: phoneSchema,
  message: z.string().min(1, 'Message is required').max(4096, 'Message is too long'),
  mediaUrl: z.string().url('Invalid media URL').optional(),
  tenantId: uuidSchema.optional(),
});

// ============================================================================
// WAITLIST SCHEMAS
// ============================================================================

/**
 * Waitlist signup validation schema
 */
export const waitlistSignupSchema = z.object({
  email: emailSchema,
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long').optional(),
  company: z.string().max(100, 'Company name is too long').optional(),
  role: z.string().max(100, 'Role is too long').optional(),
  phone: phoneSchema.optional(),
  propertyType: z.enum(['hotel', 'guesthouse', 'resort', 'apartment', 'other']).optional(),
  expectedGuests: positiveIntegerSchema.max(10000, 'Expected guests number is too high').optional(),
  referralSource: z.string().max(200, 'Referral source is too long').optional(),
  specialRequirements: z.string().max(1000, 'Special requirements are too long').optional(),
  tenantId: uuidSchema.optional(),
});

// ============================================================================
// ANALYTICS SCHEMAS
// ============================================================================

/**
 * Analytics query validation schema
 */
export const analyticsQuerySchema = z.object({
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  propertyId: uuidSchema.optional(),
  metrics: z.array(z.enum([
    'revenue', 'bookings', 'occupancy', 'average_rate',
    'customer_satisfaction', 'cancellation_rate', 'no_show_rate'
  ])).min(1, 'At least one metric is required').optional(),
  groupBy: z.enum(['day', 'week', 'month', 'quarter', 'year']).optional().default('month'),
  tenantId: uuidSchema.optional(),
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate request data against a Zod schema
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validated and transformed data
 * @throws ZodError if validation fails
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Safely validate request data against a Zod schema
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Object with success flag, data, and error information
 */
export function safeValidateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}

/**
 * Create a standardized validation error response
 * @param error - Zod validation error
 * @returns Formatted error response
 */
export function createValidationErrorResponse(error: z.ZodError) {
  return {
    success: false,
    error: 'Validation failed',
    details: error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    })),
  };
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type BookingSearchInput = z.infer<typeof bookingSearchSchema>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type SendEmailInput = z.infer<typeof sendEmailSchema>;
export type SendWhatsAppInput = z.infer<typeof sendWhatsAppSchema>;
export type WaitlistSignupInput = z.infer<typeof waitlistSignupSchema>;
export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
