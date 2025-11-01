/**
 * Payload CMS Type Definitions
 *
 * Purpose: Type definitions for Payload CMS integration, including collections for users,
 * media, products, properties, bookings, orders, and content management
 * Location: lib/payload/types.ts
 * Usage: Shared across Payload CMS integration, content management components, and Payload API routes
 *
 * @module Payload CMS Types
 * @author Buffr Host Development Team
 * @version 1.0.0
 * @see {@link https://payloadcms.com/} Payload CMS Documentation
 *
 * @description
 * These types are generated from Payload CMS collections and ensure type safety when
 * interacting with Payload CMS content, media, and data structures. Payload CMS is used
 * for headless content management in Buffr Host.
 */

/**
 * Base Payload Document Interface
 *
 * Base interface for all Payload CMS documents, containing common fields present
 * in all Payload collections.
 *
 * @interface PayloadDocument
 * @property {string} id - Unique document identifier
 * @property {string} createdAt - ISO timestamp when document was created
 * @property {string} updatedAt - ISO timestamp when document was last updated
 *
 * @example
 * const document: PayloadDocument = {
 *   id: '60d5ec49f1b2c72b8c8e4f1a',
 *   createdAt: '2024-01-15T08:00:00Z',
 *   updatedAt: '2024-01-20T10:30:00Z'
 * };
 */
// Base Payload types
export interface PayloadDocument {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload User Interface
 *
 * Represents a user in Payload CMS, extending the base PayloadDocument with
 * user-specific fields including authentication, profile, and preferences.
 *
 * @interface PayloadUser
 * @extends PayloadDocument
 * @property {string} email - User's email address (unique, used for authentication)
 * @property {string} full_name - User's full name
 * @property {string} [phone] - User's phone number (optional)
 * @property {'super_admin' | 'admin' | 'manager' | 'staff' | 'guest' | 'property_owner' | 'customer'} role - User's role
 * @property {string} [tenant_id] - Tenant ID for multi-tenant isolation
 * @property {boolean} is_active - Whether user account is active
 * @property {boolean} email_verified - Whether email has been verified
 * @property {boolean} phone_verified - Whether phone number has been verified
 * @property {string} [last_login] - ISO timestamp of last login
 * @property {string} [buffr_id] - Buffr unified ID for cross-project integration
 * @property {boolean} is_verified - Whether user identity has been verified
 * @property {number} login_count - Total number of logins
 * @property {PayloadMedia} [avatar] - User's avatar image
 * @property {object} [profile] - Extended profile information
 * @property {object} [preferences] - User preferences for language, timezone, notifications
 * @property {boolean} twoFactorEnabled - Whether 2FA is enabled
 * @property {string} [twoFactorSecret] - 2FA secret (encrypted, not exposed)
 * @property {Array<{code: string; used: boolean}>} [backupCodes] - 2FA backup codes
 *
 * @security Sensitive fields like twoFactorSecret and backupCodes are never exposed to frontend
 */
// User types from Payload Users collection
export interface PayloadUser extends PayloadDocument {
  email: string;
  full_name: string;
  phone?: string;
  role:
    | 'super_admin'
    | 'admin'
    | 'manager'
    | 'staff'
    | 'guest'
    | 'property_owner'
    | 'customer';
  tenant_id?: string;
  is_active: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  last_login?: string;
  buffr_id?: string;
  is_verified: boolean;
  login_count: number;
  avatar?: PayloadMedia;
  profile?: {
    bio?: string;
    date_of_birth?: string;
    nationality?: string;
    emergency_contact?: {
      name?: string;
      phone?: string;
      relationship?: string;
    };
  };
  preferences?: {
    language:
      | 'en'
      | 'es'
      | 'fr'
      | 'de'
      | 'pt'
      | 'zh'
      | 'ja'
      | 'ko'
      | 'ar'
      | 'ru';
    timezone: string;
    date_format: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    currency: 'USD' | 'EUR' | 'GBP' | 'ZAR' | 'NAD';
    notifications: {
      email_notifications: boolean;
      sms_notifications: boolean;
      push_notifications: boolean;
      marketing_emails: boolean;
    };
  };
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  backupCodes?: Array<{
    code: string;
    used: boolean;
  }>;
}

/**
 * Payload Media Interface
 *
 * Represents a media file (image, video, document) in Payload CMS.
 *
 * @interface PayloadMedia
 * @extends PayloadDocument
 * @property {string} [alt] - Alt text for accessibility
 * @property {string} [caption] - Media caption
 * @property {string} filename - Original filename
 * @property {string} mimeType - MIME type of the file
 * @property {number} filesize - File size in bytes
 * @property {number} [width] - Image/video width in pixels
 * @property {number} [height] - Image/video height in pixels
 * @property {string} url - URL to access the media file
 * @property {string} [thumbnailURL] - URL to thumbnail version
 * @property {number} [focalX] - Focal point X coordinate (0-1)
 * @property {number} [focalY] - Focal point Y coordinate (0-1)
 */
// Media types from Payload Media collection
export interface PayloadMedia extends PayloadDocument {
  alt?: string;
  caption?: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
  url: string;
  thumbnailURL?: string;
  focalX?: number;
  focalY?: number;
}

// Product types from Payload Products collection
export interface PayloadProduct extends PayloadDocument {
  title: string;
  description?: unknown; // JSON content
  inventory: number;
  enable_variants: boolean;
  price_in_u_s_d_enabled: boolean;
  price_in_u_s_d?: number;
  meta_title?: string;
  meta_image_id?: number;
  meta_description?: string;
  generate_slug: boolean;
  _status: 'draft' | 'published';
  gallery?: Array<{
    image: PayloadMedia;
    alt_text?: string;
    is_primary: boolean;
  }>;
  content?: Array<{
    block_type: 'text' | 'image' | 'video' | 'cta';
    content: unknown; // JSON content
  }>;
  cta?: Array<{
    text: string;
    url: string;
    style: 'primary' | 'secondary' | 'outline';
  }>;
  media_block?: Array<{
    media: PayloadMedia;
    caption?: string;
    alignment: 'left' | 'center' | 'right';
  }>;
  slug: string;
}

// Property types from Payload Properties collection
export interface PayloadProperty extends PayloadDocument {
  name: string;
  description?: unknown; // JSON content
  property_type:
    | 'hotel'
    | 'restaurant'
    | 'resort'
    | 'boutique_hotel'
    | 'vacation_rental'
    | 'guest_house'
    | 'hostel'
    | 'apartment'
    | 'villa'
    | 'lodge'
    | 'camp'
    | 'other';
  status: 'active' | 'inactive' | 'maintenance' | 'closed';
  address: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postal_code?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact_info: {
    phone?: string;
    email?: string;
    website?: string;
  };
  amenities?: string[];
  images?: PayloadMedia[];
  rooms?: PayloadRoomType[];
  tenant_id?: string;
  owner_id?: string;
  is_featured: boolean;
  rating?: number;
  review_count?: number;
  pricing?: {
    base_price: number;
    currency: string;
    seasonal_pricing?: boolean;
  };
  policies?: {
    check_in_time?: string;
    check_out_time?: string;
    cancellation_policy?: string;
    pet_policy?: string;
  };
}

// Room Type types from Payload RoomTypes collection
export interface PayloadRoomType extends PayloadDocument {
  name: string;
  description?: unknown; // JSON content
  property_id: string;
  room_category:
    | 'standard'
    | 'deluxe'
    | 'suite'
    | 'presidential'
    | 'family'
    | 'single'
    | 'double'
    | 'twin'
    | 'triple'
    | 'quad'
    | 'other';
  max_occupancy: number;
  bed_configuration: {
    single_beds: number;
    double_beds: number;
    queen_beds: number;
    king_beds: number;
    sofa_beds: number;
  };
  room_size: {
    area: number;
    unit: 'sqft' | 'sqm';
  };
  amenities: string[];
  images?: PayloadMedia[];
  pricing: {
    base_rate: number;
    currency: string;
    seasonal_rates?: boolean;
  };
  availability: {
    total_rooms: number;
    available_rooms: number;
  };
  is_active: boolean;
}

// Booking types from Payload Bookings collection
export interface PayloadBooking extends PayloadDocument {
  booking_reference: string;
  property_id: string;
  room_type_id?: string;
  guest_id: string;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  infants: number;
  status:
    | 'pending'
    | 'confirmed'
    | 'checked_in'
    | 'checked_out'
    | 'cancelled'
    | 'no_show';
  total_amount: number;
  currency: string;
  payment_status: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'failed';
  special_requests?: string;
  guest_info: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    nationality?: string;
    id_type?: string;
    id_number?: string;
  };
  billing_info?: {
    address: string;
    city: string;
    country: string;
    postal_code?: string;
    tax_id?: string;
  };
  cancellation?: {
    cancelled_at: string;
    reason?: string;
    refund_amount?: number;
  };
  tenant_id?: string;
}

// Order types from Payload Orders collection
export interface PayloadOrder extends PayloadDocument {
  order_number: string;
  customer_id: string;
  property_id?: string;
  items: Array<{
    product_id?: string;
    name: string;
    description?: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    type: 'product' | 'service' | 'room' | 'meal' | 'other';
  }>;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  payment_status: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'failed';
  shipping_address?: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postal_code?: string;
  };
  billing_address?: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postal_code?: string;
  };
  notes?: string;
  tenant_id?: string;
}

// Category types from Payload Categories collection
export interface PayloadCategory extends PayloadDocument {
  name: string;
  description?: string;
  slug: string;
  parent_id?: string;
  image?: PayloadMedia;
  is_active: boolean;
  sort_order?: number;
  tenant_id?: string;
}

// Page types from Payload Pages collection
export interface PayloadPage extends PayloadDocument {
  title: string;
  slug: string;
  content?: unknown; // JSON content blocks
  meta_title?: string;
  meta_description?: string;
  featured_image?: PayloadMedia;
  status: 'draft' | 'published';
  published_date?: string;
  author_id?: string;
  tenant_id?: string;
}

// AI Agent types from Payload AIAgents collection
export interface PayloadAIAgent extends PayloadDocument {
  name: string;
  description?: string;
  agent_type:
    | 'concierge'
    | 'customer_service'
    | 'sales'
    | 'support'
    | 'analytics'
    | 'custom';
  status: 'active' | 'inactive' | 'training' | 'error';
  configuration: {
    model: string;
    temperature: number;
    max_tokens: number;
    system_prompt: string;
    capabilities: string[];
  };
  tenant_id?: string;
  is_public: boolean;
  usage_stats?: {
    total_interactions: number;
    successful_interactions: number;
    average_response_time: number;
    last_used?: string;
  };
}

// FAQ types from Payload FAQs collection
export interface PayloadFAQ extends PayloadDocument {
  question: string;
  answer: unknown; // JSON content
  category?: string;
  is_active: boolean;
  sort_order?: number;
  tenant_id?: string;
}

// Testimonial types from Payload Testimonials collection
export interface PayloadTestimonial extends PayloadDocument {
  customer_name: string;
  customer_title?: string;
  customer_company?: string;
  customer_avatar?: PayloadMedia;
  content: string;
  rating: number;
  property_id?: string;
  is_featured: boolean;
  is_approved: boolean;
  tenant_id?: string;
}

// Promotion types from Payload Promotions collection
export interface PayloadPromotion extends PayloadDocument {
  title: string;
  description?: unknown; // JSON content
  type: 'discount' | 'package' | 'seasonal' | 'loyalty' | 'referral' | 'other';
  discount_type: 'percentage' | 'fixed_amount' | 'free_nights' | 'upgrade';
  discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  applicable_properties?: string[];
  applicable_room_types?: string[];
  min_stay_nights?: number;
  max_discount_amount?: number;
  terms_conditions?: string;
  image?: PayloadMedia;
  tenant_id?: string;
}

// API Response types
export interface PayloadResponse<T = any> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage?: number;
  nextPage?: number;
}

// Search result types
export interface PayloadSearchResult {
  collection: string;
  results: (string | number | boolean)[];
  total: number;
}

// Upload response types
export interface PayloadUploadResponse extends PayloadMedia {
  success: boolean;
  message?: string;
}

// Authentication response types
export interface PayloadAuthResponse {
  user: PayloadUser;
  token: string;
  exp: number;
}

// Error types
export interface PayloadError {
  message: string;
  status: number;
  data?: unknown;
}
