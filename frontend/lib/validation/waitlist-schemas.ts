import { z } from 'zod';

/**
 * Waitlist Request Schema (Pydantic-style validation with Zod)
 * Validates all waitlist signup form data
 */
export const WaitlistRequestSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(100, 'First name must be less than 100 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'First name can only contain letters, spaces, hyphens, and apostrophes'
    ),

  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(100, 'Last name must be less than 100 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Last name can only contain letters, spaces, hyphens, and apostrophes'
    ),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase(),

  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[+]?[1-9]\d{0,15}$/.test(val), {
      message: 'Please enter a valid phone number',
    }),

  businessName: z
    .string()
    .max(255, 'Business name must be less than 255 characters')
    .optional(),

  businessType: z
    .string()
    .max(100, 'Business type must be less than 100 characters')
    .optional(),

  location: z
    .string()
    .max(255, 'Location must be less than 255 characters')
    .optional(),

  currentSystem: z
    .string()
    .max(255, 'Current system must be less than 255 characters')
    .optional(),

  message: z
    .string()
    .max(1000, 'Message must be less than 1000 characters')
    .optional(),
});

/**
 * Personalized Email Schema (AI Agent Output)
 * Structured output for AI-generated email personalization
 */
export const PersonalizedEmailSchema = z.object({
  greeting: z
    .string()
    .min(10, 'Greeting must be at least 10 characters')
    .max(200, 'Greeting must be less than 200 characters'),

  personalizedContent: z
    .string()
    .min(50, 'Personalized content must be at least 50 characters')
    .max(1000, 'Personalized content must be less than 1000 characters'),

  relevantFeatures: z
    .array(z.string())
    .min(1, 'At least one relevant feature must be identified')
    .max(5, 'Maximum 5 relevant features allowed'),

  callToAction: z
    .string()
    .min(20, 'Call to action must be at least 20 characters')
    .max(300, 'Call to action must be less than 300 characters'),

  tone: z.enum(['professional', 'warm', 'enthusiastic'], {
    errorMap: () => ({
      message: 'Tone must be professional, warm, or enthusiastic',
    }),
  }),

  urgency: z.enum(['low', 'medium', 'high']).optional().default('medium'),

  estimatedLaunch: z.string().optional().default('Q2 2024'),
});

/**
 * Waitlist Response Schema
 * Response format for waitlist signup
 */
export const WaitlistResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  waitlistPosition: z.number().optional(),
  emailSent: z.boolean().optional(),
  personalizedMessage: z.string().optional(),
  estimatedLaunch: z.string().optional(),
});

/**
 * Waitlist Stats Schema
 * For admin dashboard waitlist statistics
 */
export const WaitlistStatsSchema = z.object({
  totalSignups: z.number(),
  signupsToday: z.number(),
  signupsThisWeek: z.number(),
  signupsThisMonth: z.number(),
  averageWaitTime: z.string(),
  estimatedLaunch: z.string(),
  topBusinessTypes: z.array(
    z.object({
      type: z.string(),
      count: z.number(),
    })
  ),
  topLocations: z.array(
    z.object({
      location: z.string(),
      count: z.number(),
    })
  ),
});

/**
 * Email Template Variables Schema
 * For email template variable substitution
 */
export const EmailTemplateVariablesSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  fullName: z.string(),
  email: z.string(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  location: z.string().optional(),
  waitlistPosition: z.number(),
  personalizedGreeting: z.string(),
  personalizedContent: z.string(),
  relevantFeatures: z.array(z.string()),
  callToAction: z.string(),
  tone: z.string(),
  urgency: z.string().default('medium'),
  estimatedLaunch: z.string(),
  supportEmail: z.string().default('support@mail.buffr.ai'),
  appUrl: z.string().default('https://host.buffr.ai'),
});

// Type exports for TypeScript
export type WaitlistRequest = z.infer<typeof WaitlistRequestSchema>;
export type PersonalizedEmail = z.infer<typeof PersonalizedEmailSchema>;
export type WaitlistResponse = z.infer<typeof WaitlistResponseSchema>;
export type WaitlistStats = z.infer<typeof WaitlistStatsSchema>;
export type EmailTemplateVariables = z.infer<
  typeof EmailTemplateVariablesSchema
>;

/**
 * Validation helper functions
 */
export const validateWaitlistRequest = (data: unknown): WaitlistRequest => {
  return WaitlistRequestSchema.parse(data);
};

export const validatePersonalizedEmail = (data: unknown): PersonalizedEmail => {
  return PersonalizedEmailSchema.parse(data);
};

export const validateWaitlistResponse = (data: unknown): WaitlistResponse => {
  return WaitlistResponseSchema.parse(data);
};

/**
 * Safe validation with error handling
 */
export const safeValidateWaitlistRequest = (data: unknown) => {
  try {
    return { success: true, data: WaitlistRequestSchema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      errors: [{ field: 'unknown', message: 'Validation failed' }],
    };
  }
};
