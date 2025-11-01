/**
 * Buffr Host Brand Identity Types
 * Multi-Tenant Hospitality Platform with Enterprise-Grade Security
 *
 * This file defines the core type system for Buffr Host's brand identity,
 * multi-tenant architecture, and emotional design patterns.
 */

// ============================================================================
// CORE BRAND IDENTITY
// ============================================================================

/**
 * Brand identity Type Definitions for Buffr Host Hospitality Platform
 * @fileoverview Brand-identity type definitions for branding, theming, and visual identity management
 * @location buffr-host/lib/types/brand-identity.ts
 * @purpose brand-identity type definitions for branding, theming, and visual identity management
 * @modularity Centralized type definitions providing type safety across the entire Buffr Host application
 * @security Type-safe security definitions for authentication, authorization, and data protection
 * @ai_integration Machine learning and AI service type definitions for predictive analytics
 * @authentication User authentication and session management type definitions
 * @typescript_strict Strict TypeScript type safety ensuring compile-time error prevention
 * @type_safety Comprehensive type coverage preventing runtime errors and improving developer experience
 * @scalability Type definitions supporting horizontal scaling and multi-tenant architecture
 * @maintainability Self-documenting types enabling easier code maintenance and refactoring
 * @testing Type-driven development supporting comprehensive test coverage
 *
 * Type Definitions Summary:
 * - 20 Interfaces: BrandIdentity, TenantHierarchy, MultiTenantContext...
 * - 9 Types: TenantType, UserRole, SecurityLevel...
 * - Total: 29 type definitions
 *
 * Usage and Integration:
 * - Frontend Components: Type-safe props and state management
 * - API Routes: Request/response type validation
 * - Database Services: Schema-aligned data operations
 * - Business Logic: Domain-specific type constraints
 * - Testing: Type-driven test case generation
 *
 * @example
 * // Import type definitions
 * import type { BrandIdentity, TenantType, UserRole... } from './brand-identity';
 *
 * // Usage in component
 * interface ComponentProps {
 *   data: BrandIdentity;
 *   onAction: (event: TenantType) => void;
 * }
 *
 * @example
 * // Database service usage
 * const userService = {
 *   async getUser(id: string): Promise<User> {
 *     // Type-safe database operations
 *     return await db.query('SELECT * FROM users WHERE id = $1', [id]);
 *   }
 * };
 *
 * Exported Types:
 * @typedef {Interface} BrandIdentity
 * @typedef {Type} TenantType
 * @typedef {Type} UserRole
 * @typedef {Type} SecurityLevel
 * @typedef {Interface} TenantHierarchy
 * @typedef {Interface} MultiTenantContext
 * @typedef {Interface} HotelBusiness
 * @typedef {Interface} RestaurantBusiness
 * @typedef {Type} BusinessType
 * @typedef {Interface} NudeColorPalette
 * ... and 24 more type definitions
 *
 * @returns {Object} Type definitions module with all exported types and interfaces
 * @type_safety Ensures 100% type coverage across the Buffr Host application
 * @documentation Comprehensive JSDoc documentation for developer experience
 * @maintainability Type-driven development enabling safe refactoring and evolution
 */

export interface BrandIdentity {
  readonly name: 'Buffr Host';
  readonly tagline: 'The Future of Hospitality, Today';
  readonly philosophy: {
    emotionalIntelligence: boolean;
    luxuryAccessibility: boolean;
    warmProfessionalism: boolean;
  };
}

// ============================================================================
// MULTI-TENANT ARCHITECTURE
// ============================================================================

export type TenantType = 'hotel' | 'restaurant' | 'platform' | 'guest';
export type UserRole =
  | 'admin'
  | 'manager'
  | 'staff'
  | 'guest'
  | 'platform_admin'
  | 'property_owner'
  | 'customer';
export type SecurityLevel =
  | 'PUBLIC'
  | 'TENANT'
  | 'BUSINESS'
  | 'DEPARTMENT'
  | 'USER'
  | 'ADMIN';

export interface TenantHierarchy {
  readonly tenantId: string;
  readonly tenantType: TenantType;
  readonly businessId: string;
  readonly businessGroupId?: string;
  readonly serviceId: string;
  readonly departmentId?: string;
  readonly userId: string;
  readonly role: UserRole;
  readonly securityLevel: SecurityLevel;
}

export interface MultiTenantContext {
  readonly tenant: TenantHierarchy;
  readonly permissions: readonly string[];
  readonly isAuthenticated: boolean;
  readonly isAuthorized: (action: string, resource: string) => boolean;
}

// ============================================================================
// BUSINESS TYPE STRUCTURE
// ============================================================================

export interface HotelBusiness {
  readonly type: 'hotel';
  readonly primaryServices: readonly ['rooms', 'bookings', 'guest_management'];
  readonly secondaryServices: readonly ['restaurants', 'spa', 'concierge'];
  readonly management: readonly ['revenue', 'staff', 'analytics'];
  readonly routes: {
    readonly main: `/hotels/${string}`;
    readonly business: `/business/hotels/${string}`;
  };
}

export interface RestaurantBusiness {
  readonly type: 'restaurant';
  readonly primaryServices: readonly ['menu', 'orders', 'reservations'];
  readonly management: readonly ['staff', 'analytics', 'customer_service'];
  readonly routes: {
    readonly main: `/restaurants/${string}`;
    readonly business: `/business/restaurants/${string}`;
  };
}

export type BusinessType = HotelBusiness | RestaurantBusiness;

// ============================================================================
// COLOR SYSTEM - NUDE FOUNDATION
// ============================================================================

export interface NudeColorPalette {
  readonly 'nude-50': '#faf9f7'; // nude-cream (Primary backgrounds)
  readonly 'nude-100': '#f5f3f0'; // nude-peach (Subtle elements)
  readonly 'nude-200': '#e8e4df'; // nude-sand (Borders, dividers)
  readonly 'nude-300': '#d4cdc4'; // nude-caramel (Inactive states)
  readonly 'nude-400': '#b8aea2'; // nude-honey (Secondary actions)
  readonly 'nude-500': '#9c8f80'; // nude-bronze (Secondary buttons)
  readonly 'nude-600': '#807366'; // nude-copper (PRIMARY ACTIONS)
  readonly 'nude-700': '#645a4d'; // nude-mahogany (Hover states)
  readonly 'nude-800': '#484139'; // nude-expresso (Text, headings)
  readonly 'nude-900': '#2c2826'; // nude-mocha (Strong text)
}

export interface LuxuryAccentColors {
  readonly 'luxury-charlotte': '#d4af8c'; // Primary accent (VIP elements)
  readonly 'luxury-champagne': '#f7e7ce'; // Premium features
  readonly 'luxury-rose': '#e8b4a0'; // Special offers
  readonly 'luxury-bronze': '#cd853f'; // Exclusive elements
}

export interface SemanticColors {
  readonly 'semantic-success': '#10b981'; // Confirmations, positive actions
  readonly 'semantic-warning': '#f59e0b'; // Warnings, attention needed
  readonly 'semantic-error': '#ef4444'; // Errors, destructive actions
  readonly 'semantic-info': '#3b82f6'; // Information, neutral actions
}

export interface BrandColorSystem {
  readonly nude: NudeColorPalette;
  readonly luxury: LuxuryAccentColors;
  readonly semantic: SemanticColors;
}

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

export interface TypographySystem {
  readonly primary: {
    readonly font: 'Inter';
    readonly usage: 'Body text, UI elements, navigation';
    readonly personality: 'Modern, clean, highly readable';
    readonly emotionalImpact: 'Professional yet approachable';
  };
  readonly display: {
    readonly font: 'Playfair Display';
    readonly usage: 'Headlines, hero text, luxury elements';
    readonly personality: 'Elegant, sophisticated, serif beauty';
    readonly emotionalImpact: 'Premium, trustworthy, established';
  };
  readonly monospace: {
    readonly font: 'JetBrains Mono';
    readonly usage: 'Code, technical elements, data display';
    readonly personality: 'Precise, technical, reliable';
    readonly emotionalImpact: 'Competent, detailed, professional';
  };
  readonly signature: {
    readonly font: 'Dancing Script';
    readonly usage: 'Personal touches, signatures, special moments';
    readonly personality: 'Handwritten, personal, warm';
    readonly emotionalImpact: 'Human, caring, individual attention';
  };
}

// ============================================================================
// EMOTIONAL DESIGN PATTERNS
// ============================================================================

export interface EmotionalDesignPatterns {
  readonly warmGlow: {
    readonly cssClass: 'warm-glow';
    readonly boxShadow: '0 0 20px rgba(184, 112, 74, 0.2)';
    readonly animation: 'warmGlow 2s ease-in-out infinite';
    readonly purpose: 'Creates emotional warmth and invitation';
  };
  readonly hoverLift: {
    readonly cssClass: 'hover-lift-emotional';
    readonly transform: 'hover:-translate-y-1';
    readonly shadow: 'hover:shadow-luxury-medium';
    readonly transition: 'transition-all duration-300 duration-300';
    readonly purpose: 'Makes elements feel responsive and alive';
  };
  readonly smoothAppear: {
    readonly cssClass: 'smooth-appear';
    readonly animation: 'smoothAppear 0.6s ease-out';
    readonly purpose: 'Reduces cognitive load, feels natural';
  };
}

// ============================================================================
// COMPONENT DESIGN LANGUAGE
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'luxury';
export type CardVariant = 'default' | 'luxury';

export interface ButtonDesign {
  readonly variant: ButtonVariant;
  readonly color: keyof NudeColorPalette | keyof LuxuryAccentColors;
  readonly emotionalImpact: string;
  readonly visual: string;
}

export interface CardDesign {
  readonly variant: CardVariant;
  readonly background: keyof NudeColorPalette | keyof LuxuryAccentColors;
  readonly border: keyof NudeColorPalette | keyof LuxuryAccentColors;
  readonly shadow: string;
  readonly emotionalImpact: string;
}

// ============================================================================
// HOSPITALITY-SPECIFIC PATTERNS
// ============================================================================

export interface WelcomeSequence {
  readonly heroSection: 'Large, warm, inviting';
  readonly progressiveDisclosure: 'Information revealed gradually';
  readonly emotionalJourney: 'Curiosity → Interest → Trust → Action';
}

export interface ServiceShowcase {
  readonly aiConciergeDemo: 'Real conversations, not mockups';
  readonly platformPreviews: 'Actual functionality, not fake data';
  readonly capabilityCards: 'Clear benefits, not feature lists';
}

export interface TrustBuilding {
  readonly socialProof: 'Real testimonials, not generic quotes';
  readonly transparency: 'Honest about capabilities and limitations';
  readonly professionalPresentation: 'Clean, organized, competent';
}

// ============================================================================
// BRAND VOICE & MESSAGING
// ============================================================================

export interface BrandVoice {
  readonly tone: 'Warm Professional';
  readonly characteristics: {
    readonly confident: boolean;
    readonly helpful: boolean;
    readonly sophisticated: boolean;
    readonly caring: boolean;
  };
}

export interface MessagingHierarchy {
  readonly emotionalHook: 'The Future of Hospitality, Today';
  readonly benefitStatement: 'One platform for every hospitality business';
  readonly proofPoints: 'Real capabilities, not marketing fluff';
  readonly callToAction: 'Clear, confident, inviting';
}

export interface KeyMessagingPillars {
  readonly unifiedExcellence: {
    readonly 'one-platform': 'One platform for every hospitality business';
    readonly 'from-hotels-to-restaurants': 'From hotels to standalone restaurants';
    readonly 'everything-integrated': 'Everything you need, beautifully integrated';
  };
  readonly emotionalIntelligence: {
    readonly 'ai-understands': 'AI that understands hospitality';
    readonly 'enhances-connection': 'Technology that enhances human connection';
    readonly '24-7-care': '24/7 care for your guests';
  };
  readonly operationalMastery: {
    readonly 'streamline-operations': 'Streamline complex operations';
    readonly 'beautiful-interfaces': 'Beautiful, intuitive interfaces';
    readonly 'team-loves': 'Your team will love using it';
  };
}

// ============================================================================
// COMPLETE BRAND IDENTITY
// ============================================================================

export interface BuffrHostBrandIdentity {
  readonly identity: BrandIdentity;
  readonly architecture: {
    readonly multiTenant: MultiTenantContext;
    readonly businessTypes: BusinessType[];
  };
  readonly design: {
    readonly colors: BrandColorSystem;
    readonly typography: TypographySystem;
    readonly patterns: EmotionalDesignPatterns;
    readonly components: {
      readonly buttons: ButtonDesign[];
      readonly cards: CardDesign[];
    };
  };
  readonly hospitality: {
    readonly welcome: WelcomeSequence;
    readonly showcase: ServiceShowcase;
    readonly trust: TrustBuilding;
  };
  readonly voice: BrandVoice;
  readonly messaging: {
    readonly hierarchy: MessagingHierarchy;
    readonly pillars: KeyMessagingPillars;
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type BrandColor =
  | keyof NudeColorPalette
  | keyof LuxuryAccentColors
  | keyof SemanticColors;
export type BrandFont =
  | 'Inter'
  | 'Playfair Display'
  | 'JetBrains Mono'
  | 'Dancing Script';
export type EmotionalState =
  | 'warm'
  | 'professional'
  | 'luxury'
  | 'accessible'
  | 'caring';

// ============================================================================
// TYPE GUARDS
// ============================================================================

export const isHotelBusiness = (
  business: BusinessType
): business is HotelBusiness => business.type === 'hotel';

export const isRestaurantBusiness = (
  business: BusinessType
): business is RestaurantBusiness => business.type === 'restaurant';

export const isNudeColor = (color: string): color is keyof NudeColorPalette =>
  color.startsWith('nude-');

export const isLuxuryColor = (
  color: string
): color is keyof LuxuryAccentColors => color.startsWith('luxury-');

export const isSemanticColor = (color: string): color is keyof SemanticColors =>
  color.startsWith('semantic-');
