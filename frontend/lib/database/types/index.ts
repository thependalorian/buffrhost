/**
 * Database Types - Modularized
 * @fileoverview Centralized type definitions for all database entities
 * @location buffr-host/frontend/lib/database/types/index.ts
 * @purpose Provides type safety across all database operations
 * @modularity Separated types from implementation for better maintainability
 * @scalability Easy to extend and modify type definitions
 * @consistency Single source of truth for all database interfaces
 */

export interface PropertyOwner {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  registration_number?: string;
  tax_id?: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  website?: string;
  description?: string;
  status: string;
  verification_status: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  buffr_id?: string;
  name: string;
  type: string;
  location: string;
  owner_id: string;
  tenant_id: string;
  status: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  total_orders?: number;
  total_revenue?: number;
  created_at: string;
  updated_at: string;
  // Enhanced fields
  property_code?: string;
  check_in_time?: string;
  check_out_time?: string;
  cancellation_policy?: string;
  house_rules?: string;
  minimum_stay?: number;
  maximum_stay?: number;
  advance_booking_days?: number;
  instant_booking?: boolean;
  featured?: boolean;
  verified?: boolean;
  capacity?: number;
  price_range?: string;
  cuisine_type?: string;
  star_rating?: number;
  opening_hours?: unknown;
  social_media?: unknown;
  amenities?: (string | number | boolean)[];
  images?: PropertyImage[];
  rooms?: Room[];
  services?: PropertyService[];
  menu_items?: MenuItem[];
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  image_type: string;
  alt_text?: string;
  caption?: string;
  sort_order: number;
  is_primary: boolean;
  is_active: boolean;
  file_size?: number;
  mime_type?: string;
  created_at: string;
}

export interface Room {
  id: string;
  property_id: string;
  room_number: string;
  room_type: string;
  capacity: number;
  price_per_night: number;
  description?: string;
  amenities: string[];
  is_active: boolean;
  images?: RoomImage[];
  created_at: string;
  updated_at: string;
}

export interface RoomImage {
  id: string;
  room_id: string;
  image_url: string;
  image_type: string;
  alt_text?: string;
  caption?: string;
  sort_order: number;
  is_primary: boolean;
  is_active: boolean;
  file_size?: number;
  mime_type?: string;
  created_at: string;
}

export interface PropertyService {
  id: string;
  property_id: string;
  service_name: string;
  service_type: string;
  description?: string;
  price?: number;
  duration_minutes?: number;
  is_active: boolean;
  max_capacity?: number;
  booking_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  property_id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  cuisine_type?: string;
  dietary_info?: string[];
  is_available: boolean;
  preparation_time_minutes?: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyAmenity {
  id: string;
  property_id: string;
  amenity_name: string;
  amenity_type: string;
  description?: string;
  is_available: boolean;
  is_paid: boolean;
  price?: number;
  created_at: string;
  updated_at: string;
}

// Query filter interfaces
export interface PropertyFilters {
  ownerId?: string;
  propertyId?: string;
  type?: string;
  status?: string;
  location?: string;
  minRating?: number;
  maxPrice?: number;
  amenities?: string[];
  availableFrom?: string;
  availableTo?: string;
}

export interface PropertyImageFilters {
  propertyId?: string;
  imageType?: string;
  roomId?: string;
  isPrimary?: boolean;
  isActive?: boolean;
}

export interface ImageUploadData {
  propertyId: string;
  roomId?: string;
  files: Array<{
    url: string;
    name?: string;
    type: string;
    altText?: string;
    caption?: string;
    isPrimary?: boolean;
    fileSize?: number;
    mimeType?: string;
  }>;
}

export interface PropertyUpdateData {
  name?: string;
  type?: string;
  location?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  status?: string;
  property_code?: string;
  check_in_time?: string;
  check_out_time?: string;
  cancellation_policy?: string;
  house_rules?: string;
  minimum_stay?: number;
  maximum_stay?: number;
  advance_booking_days?: number;
  instant_booking?: boolean;
  featured?: boolean;
  verified?: boolean;
  capacity?: number;
  price_range?: string;
  cuisine_type?: string;
  star_rating?: number;
  opening_hours?: unknown;
  social_media?: unknown;
  amenities?: (string | number | boolean)[];
}
