/**
 * Shared Types and Interfaces for Recommendation Engine
 *
 * Centralized type definitions for all recommendation modules
 * Location: lib/ai/recommendation/shared/types.ts
 * Purpose: Provide consistent interfaces across all recommender components
 * Modularity: Separated types for better maintainability and reusability
 */

export interface UserProfile {
  user_id: string;
  preferences: string[];
  booking_history: BookingHistory[];
  demographics: Demographics;
  behavior_patterns: BehaviorPatterns;
}

export interface BookingHistory {
  property_id: string;
  service_type: string;
  rating: number;
  timestamp: Date;
  amount_spent: number;
  duration: number;
}

export interface Demographics {
  age_group: string;
  income: string;
  location: string;
  travel_frequency: string;
}

export interface BehaviorPatterns {
  preferred_times: string[];
  preferred_services: string[];
  spending_pattern: 'budget' | 'mid-range' | 'luxury';
  booking_lead_time: number; // days
}

export interface RecommendationRequest {
  user_id: string;
  context?: {
    current_location?: string;
    budget_range?: [number, number];
    preferred_services?: string[];
    party_size?: number;
    check_in_date?: Date;
    check_out_date?: Date;
    property_id?: string;
  };
  limit?: number;
  include_explanations?: boolean;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  total_count: number;
  confidence_threshold: number;
  algorithm_used: string;
  generated_at: Date;
  user_segment?: string;
  explanations?: Record<string, string>;
}

export interface Recommendation {
  item_id: string;
  item_type: 'room' | 'date' | 'service' | 'property';
  score: number;
  confidence: number;
  reasons: string[];
  metadata?: Record<string, unknown>;
}

export interface UserItemMatrix {
  [userId: string]: {
    [itemId: string]: number;
  };
}

export interface SimilarityMatrix {
  [itemId: string]: {
    [otherItemId: string]: number;
  };
}

export interface ContentFeatures {
  [itemId: string]: number[];
}

// Room-specific types
export interface RoomRecommendationContext {
  property_id: string;
  check_in_date: Date;
  check_out_date: Date;
  party_size: number;
  budget_range?: [number, number];
  preferred_room_types?: string[];
  accessibility_needs?: boolean;
  smoking_allowed?: boolean;
}

export interface RoomRecommendation extends Recommendation {
  item_type: 'room';
  metadata: {
    room_number: string;
    room_type: string;
    capacity: number;
    price_per_night: number;
    amenities: string[];
    availability_status: 'available' | 'limited' | 'unavailable';
  };
}

// Date-specific types
export interface DateRecommendationContext {
  property_id: string;
  room_id?: string;
  preferred_month?: number;
  preferred_day_of_week?: string[];
  party_size: number;
  stay_duration: number;
  budget_range?: [number, number];
  flexibility_days?: number;
}

export interface DateRecommendation extends Recommendation {
  item_type: 'date';
  metadata: {
    check_in_date: Date;
    check_out_date: Date;
    total_price: number;
    discount_percentage?: number;
    availability_score: number;
    demand_level: 'low' | 'medium' | 'high';
  };
}

// Service-specific types
export interface ServiceRecommendationContext {
  property_id: string;
  stay_dates?: [Date, Date];
  guest_preferences?: string[];
  budget_range?: [number, number];
  party_size: number;
  dietary_restrictions?: string[];
  special_occasions?: string[];
}

export interface ServiceRecommendation extends Recommendation {
  item_type: 'service';
  metadata: {
    service_name: string;
    service_type: string;
    price: number;
    duration_minutes: number;
    capacity: number;
    dietary_info?: string[];
    allergens?: string[];
    preparation_time?: number;
  };
}

// Algorithm configuration
export interface AlgorithmConfig {
  weights: {
    collaborative: number;
    content_based: number;
    popularity: number;
    temporal: number;
  };
  thresholds: {
    min_similarity: number;
    min_confidence: number;
    max_recommendations: number;
  };
  cache: {
    ttl_ms: number;
    max_size: number;
  };
}

// Base recommender interface
export interface BaseRecommender {
  initialize(): Promise<void>;
  generateRecommendations(
    request: RecommendationRequest
  ): Promise<RecommendationResponse>;
  updateUserPreferences(userId: string, preferences: string[]): Promise<void>;
  addUserInteraction(
    userId: string,
    itemId: string,
    interactionType: string,
    value: number
  ): Promise<void>;
}
