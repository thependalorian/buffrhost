import { z } from 'zod';

/**
 * Sofia AI Email Template System - Pydantic-style Validation Schemas
 * Comprehensive validation for dynamic email generation by Sofia AI
 */

/**
 * Base Email Template Schema
 * Common fields for all email types
 */
export const BaseEmailTemplateSchema = z.object({
  templateId: z
    .string()
    .min(1, 'Template ID is required')
    .max(100, 'Template ID must be less than 100 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Template ID can only contain letters, numbers, hyphens, and underscores'
    ),

  templateName: z
    .string()
    .min(3, 'Template name must be at least 3 characters')
    .max(200, 'Template name must be less than 200 characters'),

  templateType: z.enum([
    'booking_confirmation',
    'quotation',
    'marketing_campaign',
    'promotional_offer',
    'newsletter',
    'welcome_series',
    'abandoned_cart',
    'birthday_special',
    'anniversary_celebration',
    'seasonal_promotion',
    'event_invitation',
    'follow_up',
    'thank_you',
    'feedback_request',
    'calendar_access_request',
  ]),

  propertyId: z
    .string()
    .min(1, 'Property ID is required')
    .max(50, 'Property ID must be less than 50 characters'),

  tenantId: z
    .string()
    .min(1, 'Tenant ID is required')
    .max(50, 'Tenant ID must be less than 50 characters'),

  isActive: z.boolean().default(true),

  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Marketing Campaign Schema
 * For promotional and marketing emails
 */
export const MarketingCampaignSchema = z.object({
  campaignId: z
    .string()
    .min(1, 'Campaign ID is required')
    .max(100, 'Campaign ID must be less than 100 characters'),

  campaignName: z
    .string()
    .min(3, 'Campaign name must be at least 3 characters')
    .max(200, 'Campaign name must be less than 200 characters'),

  campaignType: z.enum([
    'seasonal_promotion',
    'flash_sale',
    'loyalty_reward',
    'new_feature_announcement',
    'event_promotion',
    'referral_program',
    'win_back_campaign',
    'upsell_offer',
    'cross_sell_offer',
    'educational_content',
  ]),

  targetAudience: z.enum([
    'all_customers',
    'new_customers',
    'returning_customers',
    'vip_customers',
    'inactive_customers',
    'high_value_customers',
    'specific_segment',
  ]),

  urgencyLevel: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),

  discountType: z
    .enum(['percentage', 'fixed_amount', 'free_service', 'bundle_offer'])
    .optional(),

  discountValue: z.number().min(0).max(100).optional(),

  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),

  maxRecipients: z.number().min(1).max(10000).optional(),

  personalizationLevel: z
    .enum(['basic', 'advanced', 'ai_powered'])
    .default('basic'),

  callToAction: z.object({
    primaryText: z
      .string()
      .min(5, 'Primary CTA text must be at least 5 characters'),
    primaryUrl: z.string().url('Primary CTA must be a valid URL'),
    secondaryText: z.string().optional(),
    secondaryUrl: z.string().url().optional(),
  }),

  content: z.object({
    subject: z
      .string()
      .min(10, 'Subject must be at least 10 characters')
      .max(100, 'Subject must be less than 100 characters'),

    previewText: z
      .string()
      .min(20, 'Preview text must be at least 20 characters')
      .max(200, 'Preview text must be less than 200 characters'),

    headline: z
      .string()
      .min(10, 'Headline must be at least 10 characters')
      .max(150, 'Headline must be less than 150 characters'),

    subheadline: z
      .string()
      .min(20, 'Subheadline must be at least 20 characters')
      .max(300, 'Subheadline must be less than 300 characters'),

    bodyContent: z
      .string()
      .min(50, 'Body content must be at least 50 characters')
      .max(2000, 'Body content must be less than 2000 characters'),

    features: z
      .array(z.string())
      .min(1, 'At least one feature must be specified')
      .max(10, 'Maximum 10 features allowed'),

    benefits: z
      .array(z.string())
      .min(1, 'At least one benefit must be specified')
      .max(8, 'Maximum 8 benefits allowed'),

    socialProof: z
      .object({
        testimonial: z.string().optional(),
        rating: z.number().min(1).max(5).optional(),
        reviewCount: z.number().min(0).optional(),
        customerName: z.string().optional(),
      })
      .optional(),

    urgencyMessage: z
      .string()
      .min(10, 'Urgency message must be at least 10 characters')
      .max(200, 'Urgency message must be less than 200 characters')
      .optional(),
  }),

  design: z.object({
    colorScheme: z
      .enum(['buffr_primary', 'seasonal', 'brand_custom', 'minimal'])
      .default('buffr_primary'),
    layout: z
      .enum(['single_column', 'two_column', 'hero_focus', 'feature_grid'])
      .default('single_column'),
    includeImages: z.boolean().default(true),
    imageStyle: z
      .enum(['lifestyle', 'product', 'abstract', 'minimal'])
      .default('lifestyle'),
    includeVideo: z.boolean().default(false),
    videoUrl: z.string().url().optional(),
  }),

  tracking: z.object({
    trackOpens: z.boolean().default(true),
    trackClicks: z.boolean().default(true),
    trackConversions: z.boolean().default(true),
    conversionGoal: z.string().optional(),
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional(),
  }),
});

/**
 * Personalized Email Content Schema
 * For AI-generated personalized content
 */
export const PersonalizedEmailContentSchema = z.object({
  recipientId: z.string().min(1, 'Recipient ID is required'),

  personalizationData: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),

    customerSegment: z.enum([
      'new_customer',
      'returning_customer',
      'vip_customer',
      'at_risk_customer',
      'loyal_customer',
      'inactive_customer',
    ]),

    preferences: z.object({
      preferredLanguage: z.string().default('en'),
      preferredTime: z.string().optional(),
      communicationFrequency: z
        .enum(['daily', 'weekly', 'monthly', 'as_needed'])
        .default('as_needed'),
      interests: z.array(z.string()).default([]),
      pastBookings: z.array(z.string()).default([]),
      favoriteServices: z.array(z.string()).default([]),
    }),

    behaviorData: z.object({
      lastVisit: z.string().datetime().optional(),
      totalSpent: z.number().min(0).default(0),
      bookingFrequency: z.number().min(0).default(0),
      averageBookingValue: z.number().min(0).default(0),
      preferredServices: z.array(z.string()).default([]),
      seasonalPatterns: z.array(z.string()).default([]),
    }),

    contextData: z.object({
      currentSeason: z.string(),
      timeOfDay: z.string(),
      dayOfWeek: z.string(),
      weatherCondition: z.string().optional(),
      localEvents: z.array(z.string()).default([]),
      specialOccasions: z.array(z.string()).default([]),
    }),
  }),

  aiGeneratedContent: z.object({
    tone: z.enum([
      'professional',
      'warm',
      'enthusiastic',
      'urgent',
      'celebratory',
      'empathetic',
    ]),

    greeting: z
      .string()
      .min(10, 'Greeting must be at least 10 characters')
      .max(200, 'Greeting must be less than 200 characters'),

    personalizedMessage: z
      .string()
      .min(50, 'Personalized message must be at least 50 characters')
      .max(1000, 'Personalized message must be less than 1000 characters'),

    relevantOffers: z.array(
      z.object({
        offerId: z.string(),
        offerTitle: z.string(),
        offerDescription: z.string(),
        discountValue: z.number(),
        validUntil: z.string().datetime(),
        relevanceScore: z.number().min(0).max(1),
      })
    ),

    recommendedServices: z.array(
      z.object({
        serviceId: z.string(),
        serviceName: z.string(),
        serviceDescription: z.string(),
        price: z.number(),
        relevanceReason: z.string(),
        relevanceScore: z.number().min(0).max(1),
      })
    ),

    callToAction: z.object({
      primaryText: z.string().min(5, 'Primary CTA text is required'),
      primaryUrl: z.string().url('Primary CTA URL must be valid'),
      urgencyLevel: z.enum(['low', 'medium', 'high']).default('medium'),
      personalizationReason: z.string().optional(),
    }),

    followUpSuggestions: z.array(z.string()).max(5),

    emotionalTriggers: z
      .array(
        z.enum([
          'exclusivity',
          'urgency',
          'fear_of_missing_out',
          'social_proof',
          'personal_achievement',
          'comfort_and_luxury',
          'adventure_and_exploration',
          'family_and_connection',
        ])
      )
      .max(3),
  }),

  templateVariables: z.record(z.string(), z.any()),

  generatedAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
});

/**
 * Email Template Variables Schema
 * Dynamic variables for template substitution
 */
export const EmailTemplateVariablesSchema = z.object({
  // Customer Information
  customerName: z.string(),
  customerFirstName: z.string(),
  customerLastName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),

  // Property Information
  propertyName: z.string(),
  propertyLocation: z.string(),
  propertyType: z.string(),
  propertyManager: z.string(),
  propertyPhone: z.string(),
  propertyEmail: z.string().email(),
  propertyWebsite: z.string().url().optional(),

  // Booking Information
  bookingId: z.string().optional(),
  bookingDate: z.string().optional(),
  bookingTime: z.string().optional(),
  serviceType: z.string().optional(),
  serviceDuration: z.string().optional(),
  totalAmount: z.number().optional(),
  currency: z.string().default('NAD'),

  // Campaign Information
  campaignName: z.string().optional(),
  offerCode: z.string().optional(),
  discountAmount: z.number().optional(),
  discountPercentage: z.number().optional(),
  validUntil: z.string().optional(),

  // Personalization
  personalizedGreeting: z.string(),
  personalizedContent: z.string(),
  relevantFeatures: z.array(z.string()),
  callToAction: z.string(),

  // System Information
  currentDate: z.string(),
  currentTime: z.string(),
  timezone: z.string().default('Africa/Windhoek'),
  appUrl: z.string().url(),
  supportEmail: z.string().email(),

  // Sofia AI Information
  sofiaSignature: z.string().default('Sofia'),
  sofiaRole: z.string().default('your concierge'),
  propertySignature: z.string(),
});

/**
 * Email Template Generation Request Schema
 * Request structure for Sofia to generate emails
 */
export const EmailTemplateGenerationRequestSchema = z.object({
  requestId: z.string().uuid(),

  templateType: z.enum([
    'booking_confirmation',
    'quotation',
    'marketing_campaign',
    'promotional_offer',
    'newsletter',
    'welcome_series',
    'abandoned_cart',
    'birthday_special',
    'anniversary_celebration',
    'seasonal_promotion',
    'event_invitation',
    'follow_up',
    'thank_you',
    'feedback_request',
    'calendar_access_request',
  ]),

  recipientData: PersonalizedEmailContentSchema.shape.personalizationData,

  campaignData: MarketingCampaignSchema.optional(),

  templateCustomization: z.object({
    includePersonalization: z.boolean().default(true),
    includeUrgency: z.boolean().default(false),
    includeSocialProof: z.boolean().default(false),
    includeVideo: z.boolean().default(false),
    customTone: z.string().optional(),
    customColors: z
      .object({
        primary: z.string().optional(),
        secondary: z.string().optional(),
        accent: z.string().optional(),
      })
      .optional(),
  }),

  generationOptions: z.object({
    useAI: z.boolean().default(true),
    creativityLevel: z
      .enum(['conservative', 'balanced', 'creative'])
      .default('balanced'),
    personalizationLevel: z
      .enum(['basic', 'advanced', 'ai_powered'])
      .default('ai_powered'),
    includeEmojis: z.boolean().default(false),
    includeImages: z.boolean().default(true),
    maxLength: z.number().min(100).max(5000).default(2000),
  }),

  requestedAt: z.string().datetime(),
  requestedBy: z.string(),
  tenantId: z.string(),
  propertyId: z.string(),
});

/**
 * Email Template Generation Response Schema
 * Sofia's response when generating email templates
 */
export const EmailTemplateGenerationResponseSchema = z.object({
  requestId: z.string().uuid(),

  generatedTemplate: z.object({
    templateId: z.string(),
    subject: z.string(),
    previewText: z.string(),
    htmlContent: z.string(),
    textContent: z.string(),

    personalizationApplied: z.boolean(),
    aiGeneratedContent: PersonalizedEmailContentSchema.shape.aiGeneratedContent,

    templateVariables: EmailTemplateVariablesSchema,

    metadata: z.object({
      generationTime: z.number(),
      personalizationScore: z.number().min(0).max(1),
      relevanceScore: z.number().min(0).max(1),
      urgencyScore: z.number().min(0).max(1),
      emotionalAppealScore: z.number().min(0).max(1),
    }),
  }),

  recommendations: z.object({
    bestSendTime: z.string().optional(),
    suggestedFollowUp: z.string().optional(),
    a_bTestVariants: z.array(z.string()).optional(),
    optimizationSuggestions: z.array(z.string()).optional(),
  }),

  status: z.enum(['success', 'partial_success', 'failed']),
  message: z.string(),
  generatedAt: z.string().datetime(),
});

// Type exports for TypeScript
export type BaseEmailTemplate = z.infer<typeof BaseEmailTemplateSchema>;
export type MarketingCampaign = z.infer<typeof MarketingCampaignSchema>;
export type PersonalizedEmailContent = z.infer<
  typeof PersonalizedEmailContentSchema
>;
export type EmailTemplateVariables = z.infer<
  typeof EmailTemplateVariablesSchema
>;
export type EmailTemplateGenerationRequest = z.infer<
  typeof EmailTemplateGenerationRequestSchema
>;
export type EmailTemplateGenerationResponse = z.infer<
  typeof EmailTemplateGenerationResponseSchema
>;

/**
 * Validation helper functions
 */
export const validateMarketingCampaign = (data: unknown): MarketingCampaign => {
  return MarketingCampaignSchema.parse(data);
};

export const validatePersonalizedEmailContent = (
  data: unknown
): PersonalizedEmailContent => {
  return PersonalizedEmailContentSchema.parse(data);
};

export const validateEmailTemplateGenerationRequest = (
  data: unknown
): EmailTemplateGenerationRequest => {
  return EmailTemplateGenerationRequestSchema.parse(data);
};

export const validateEmailTemplateGenerationResponse = (
  data: unknown
): EmailTemplateGenerationResponse => {
  return EmailTemplateGenerationResponseSchema.parse(data);
};

/**
 * Safe validation with error handling
 */
export const safeValidateMarketingCampaign = (data: unknown) => {
  try {
    return { success: true, data: MarketingCampaignSchema.parse(data) };
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

export const safeValidateEmailTemplateGenerationRequest = (data: unknown) => {
  try {
    return {
      success: true,
      data: EmailTemplateGenerationRequestSchema.parse(data),
    };
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
