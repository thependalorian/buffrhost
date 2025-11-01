/**
 * Sofia AI Service for Buffr Host
 * Consolidated AI service for hospitality recommendations and analytics
 *
 * Author: Buffr AI Team
 * Date: 2024
 */

import { apiClient } from '../services/api-client';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export interface SofiaRecommendation {
  id: string;
  type: 'room' | 'restaurant' | 'service' | 'general';
  title: string;
  description: string;
  score: number;
  reasoning: string;
  data: unknown;
  created_at: string;
}

export interface SofiaAnalytics {
  property_id: string;
  period_days: number;
  booking_analytics: {
    total_bookings: number;
    avg_booking_value: number;
    unique_guests: number;
    confirmed_bookings: number;
    cancelled_bookings: number;
    cancellation_rate: number;
  };
  revenue_analytics: {
    total_revenue: number;
    avg_revenue_per_booking: number;
    total_transactions: number;
  };
  satisfaction_analytics: {
    avg_rating: number;
    total_reviews: number;
    positive_reviews: number;
    satisfaction_rate: number;
  };
  occupancy_analytics: {
    total_rooms: number;
    occupied_rooms: number;
    occupancy_rate: number;
  };
  generated_at: string;
}

export interface SofiaInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'warning';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  recommendations: string[];
  data: unknown;
  created_at: string;
}

export interface SofiaNotification {
  id: string;
  type: 'recommendation' | 'alert' | 'insight' | 'reminder';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action_required: boolean;
  action_data?: unknown;
  is_read: boolean;
  created_at: string;
}

export interface SofiaGuestProfile {
  guest_id: string;
  preferences: {
    room_types: string[];
    cuisines: string[];
    services: string[];
    price_range: 'budget' | 'mid' | 'luxury';
  };
  booking_history: {
    total_bookings: number;
    avg_booking_value: number;
    favorite_room_type: string;
    favorite_cuisine: string;
    last_visit: string;
  };
  behavior_patterns: {
    booking_frequency: number;
    preferred_check_in_days: number[];
    typical_booking_lead_time: number;
    cancellation_rate: number;
  };
  last_updated: string;
}

// =============================================================================
// SOFIA AI SERVICE CLASS
// =============================================================================

export class SofiaService {
  private baseUrl = '/api/sofia';
  private cache = new Map<string, any>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  // =============================================================================
  // RECOMMENDATION METHODS
  // =============================================================================

  /**
   * Get AI-powered recommendations for a guest
   */
  async getRecommendations(
    propertyId: string,
    guestId: string,
    recommendationType:
      | 'rooms'
      | 'restaurants'
      | 'services'
      | 'general' = 'general',
    limit: number = 10
  ): Promise<SofiaRecommendation[]> {
    try {
      const cacheKey = `recommendations_${propertyId}_${guestId}_${recommendationType}_${limit}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await apiClient.get<{ data: SofiaRecommendation[] }>(
        `${this.baseUrl}/recommendations`,
        {
          params: {
            property_id: propertyId,
            guest_id: guestId,
            type: recommendationType,
            limit: limit,
          },
        }
      );

      const recommendations = response.data || [];
      this.setCache(cacheKey, recommendations);
      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  /**
   * Get room recommendations
   */
  async getRoomRecommendations(
    propertyId: string,
    guestId: string,
    checkInDate?: string,
    checkOutDate?: string,
    guests?: number
  ): Promise<SofiaRecommendation[]> {
    try {
      const params: unknown = {
        property_id: propertyId,
        guest_id: guestId,
        type: 'rooms',
      };

      if (checkInDate) params.check_in_date = checkInDate;
      if (checkOutDate) params.check_out_date = checkOutDate;
      if (guests) params.guests = guests;

      const response = await apiClient.get<{ data: SofiaRecommendation[] }>(
        `${this.baseUrl}/recommendations`,
        { params }
      );

      return response.data || [];
    } catch (error) {
      console.error('Error getting room recommendations:', error);
      return [];
    }
  }

  /**
   * Get restaurant recommendations
   */
  async getRestaurantRecommendations(
    propertyId: string,
    guestId: string,
    cuisineType?: string,
    priceRange?: string
  ): Promise<SofiaRecommendation[]> {
    try {
      const params: unknown = {
        property_id: propertyId,
        guest_id: guestId,
        type: 'restaurants',
      };

      if (cuisineType) params.cuisine_type = cuisineType;
      if (priceRange) params.price_range = priceRange;

      const response = await apiClient.get<{ data: SofiaRecommendation[] }>(
        `${this.baseUrl}/recommendations`,
        { params }
      );

      return response.data || [];
    } catch (error) {
      console.error('Error getting restaurant recommendations:', error);
      return [];
    }
  }

  /**
   * Get service recommendations (spa, conference, etc.)
   */
  async getServiceRecommendations(
    propertyId: string,
    guestId: string,
    serviceType?: string
  ): Promise<SofiaRecommendation[]> {
    try {
      const params: unknown = {
        property_id: propertyId,
        guest_id: guestId,
        type: 'services',
      };

      if (serviceType) params.service_type = serviceType;

      const response = await apiClient.get<{ data: SofiaRecommendation[] }>(
        `${this.baseUrl}/recommendations`,
        { params }
      );

      return response.data || [];
    } catch (error) {
      console.error('Error getting service recommendations:', error);
      return [];
    }
  }

  // =============================================================================
  // ANALYTICS METHODS
  // =============================================================================

  /**
   * Get property analytics
   */
  async getPropertyAnalytics(
    propertyId: string,
    days: number = 30
  ): Promise<SofiaAnalytics | null> {
    try {
      const cacheKey = `analytics_${propertyId}_${days}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await apiClient.get<{ data: SofiaAnalytics }>(
        `${this.baseUrl}/analytics`,
        {
          params: {
            property_id: propertyId,
            days: days,
          },
        }
      );

      const analytics = response.data;
      if (analytics) {
        this.setCache(cacheKey, analytics);
      }
      return analytics || null;
    } catch (error) {
      console.error('Error getting property analytics:', error);
      return null;
    }
  }

  /**
   * Get booking analytics
   */
  async getBookingAnalytics(
    propertyId: string,
    days: number = 30
  ): Promise<unknown> {
    try {
      const response = await apiClient.get<{ data: any }>(
        `${this.baseUrl}/analytics/booking`,
        {
          params: {
            property_id: propertyId,
            days: days,
          },
        }
      );

      return response.data || {};
    } catch (error) {
      console.error('Error getting booking analytics:', error);
      return {};
    }
  }

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(
    propertyId: string,
    days: number = 30
  ): Promise<unknown> {
    try {
      const response = await apiClient.get<{ data: any }>(
        `${this.baseUrl}/analytics/revenue`,
        {
          params: {
            property_id: propertyId,
            days: days,
          },
        }
      );

      return response.data || {};
    } catch (error) {
      console.error('Error getting revenue analytics:', error);
      return {};
    }
  }

  // =============================================================================
  // INSIGHTS METHODS
  // =============================================================================

  /**
   * Get AI insights for property
   */
  async getInsights(
    propertyId: string,
    insightType?: string,
    limit: number = 10
  ): Promise<SofiaInsight[]> {
    try {
      const params: unknown = {
        property_id: propertyId,
        limit: limit,
      };

      if (insightType) params.type = insightType;

      const response = await apiClient.get<{ data: SofiaInsight[] }>(
        `${this.baseUrl}/insights`,
        { params }
      );

      return response.data || [];
    } catch (error) {
      console.error('Error getting insights:', error);
      return [];
    }
  }

  /**
   * Get trend insights
   */
  async getTrendInsights(propertyId: string): Promise<SofiaInsight[]> {
    return this.getInsights(propertyId, 'trend');
  }

  /**
   * Get anomaly insights
   */
  async getAnomalyInsights(propertyId: string): Promise<SofiaInsight[]> {
    return this.getInsights(propertyId, 'anomaly');
  }

  /**
   * Get opportunity insights
   */
  async getOpportunityInsights(propertyId: string): Promise<SofiaInsight[]> {
    return this.getInsights(propertyId, 'opportunity');
  }

  // =============================================================================
  // GUEST PROFILE METHODS
  // =============================================================================

  /**
   * Get guest profile
   */
  async getGuestProfile(
    propertyId: string,
    guestId: string
  ): Promise<SofiaGuestProfile | null> {
    try {
      const cacheKey = `profile_${propertyId}_${guestId}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await apiClient.get<{ data: SofiaGuestProfile }>(
        `${this.baseUrl}/guest-profile`,
        {
          params: {
            property_id: propertyId,
            guest_id: guestId,
          },
        }
      );

      const profile = response.data;
      if (profile) {
        this.setCache(cacheKey, profile);
      }
      return profile || null;
    } catch (error) {
      console.error('Error getting guest profile:', error);
      return null;
    }
  }

  /**
   * Update guest preferences
   */
  async updateGuestPreferences(
    propertyId: string,
    guestId: string,
    preferences: Partial<SofiaGuestProfile['preferences']>
  ): Promise<boolean> {
    try {
      await apiClient.put(`${this.baseUrl}/guest-profile/preferences`, {
        property_id: propertyId,
        guest_id: guestId,
        preferences,
      });

      // Clear cache
      this.clearCache(`profile_${propertyId}_${guestId}`);
      return true;
    } catch (error) {
      console.error('Error updating guest preferences:', error);
      return false;
    }
  }

  // =============================================================================
  // NOTIFICATION METHODS
  // =============================================================================

  /**
   * Get notifications for guest
   */
  async getNotifications(
    propertyId: string,
    guestId: string,
    unreadOnly: boolean = false,
    limit: number = 20
  ): Promise<SofiaNotification[]> {
    try {
      const response = await apiClient.get<{ data: SofiaNotification[] }>(
        `${this.baseUrl}/notifications`,
        {
          params: {
            property_id: propertyId,
            guest_id: guestId,
            unread_only: unreadOnly,
            limit: limit,
          },
        }
      );

      return response.data || [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(notificationId: string): Promise<boolean> {
    try {
      await apiClient.put(
        `${this.baseUrl}/notifications/${notificationId}/read`
      );
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Send notification
   */
  async sendNotification(
    propertyId: string,
    guestId: string,
    type: SofiaNotification['type'],
    title: string,
    message: string,
    priority: SofiaNotification['priority'] = 'medium',
    actionData?: unknown
  ): Promise<boolean> {
    try {
      await apiClient.post(`${this.baseUrl}/notifications`, {
        property_id: propertyId,
        guest_id: guestId,
        type,
        title,
        message,
        priority,
        action_data: actionData,
      });

      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  // =============================================================================
  // FEEDBACK METHODS
  // =============================================================================

  /**
   * Submit recommendation feedback
   */
  async submitRecommendationFeedback(
    recommendationId: string,
    feedbackScore: number,
    isAccepted: boolean,
    comments?: string
  ): Promise<boolean> {
    try {
      await apiClient.post(
        `${this.baseUrl}/recommendations/${recommendationId}/feedback`,
        {
          feedback_score: feedbackScore,
          is_accepted: isAccepted,
          comments,
        }
      );

      return true;
    } catch (error) {
      console.error('Error submitting recommendation feedback:', error);
      return false;
    }
  }

  /**
   * Submit insight feedback
   */
  async submitInsightFeedback(
    insightId: string,
    helpful: boolean,
    comments?: string
  ): Promise<boolean> {
    try {
      await apiClient.post(`${this.baseUrl}/insights/${insightId}/feedback`, {
        helpful,
        comments,
      });

      return true;
    } catch (error) {
      console.error('Error submitting insight feedback:', error);
      return false;
    }
  }

  // =============================================================================
  // CACHE METHODS
  // =============================================================================

  private getFromCache(key: string): Record<string, unknown> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private clearCache(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.cache.clear();
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await apiClient.get<{
        status: string;
        timestamp: string;
      }>(`${this.baseUrl}/health`);
      return response;
    } catch (error) {
      console.error('Error getting health status:', error);
      return { status: 'error', timestamp: new Date().toISOString() };
    }
  }

  /**
   * Get service statistics
   */
  async getServiceStats(): Promise<unknown> {
    try {
      const response = await apiClient.get<{ data: any }>(
        `${this.baseUrl}/stats`
      );
      return response.data || {};
    } catch (error) {
      console.error('Error getting service stats:', error);
      return {};
    }
  }
}

// =============================================================================
// EXPORT SINGLETON INSTANCE
// =============================================================================

export const sofiaService = new SofiaService();
