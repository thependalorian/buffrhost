/**
 * Sofia Concierge AI Hook for Buffr Host
 *
 * Consolidated Sofia AI Integration
 * Provides AI-powered recommendations, analytics, and smart features
 * Location: hooks/useSofia.ts
 */

import { useState, useCallback, useEffect } from 'react';
import {
  sofiaService,
  SofiaRecommendation,
  SofiaAnalytics,
  SofiaInsight,
  SofiaNotification,
  SofiaGuestProfile,
} from '@/lib/ai/sofia-service';

// =============================================================================
// TYPES (re-exported from sofia-service)
// =============================================================================

export type {
  SofiaRecommendation,
  SofiaAnalytics,
  SofiaInsight,
  SofiaNotification,
  SofiaGuestProfile,
} from '@/lib/ai/sofia-service';

export interface SofiaError {
  message: string;
  details?: string;
  code?: string;
}

// =============================================================================
// HOOK
// =============================================================================

export function useSofia() {
  const [recommendations, setRecommendations] = useState<SofiaRecommendation[]>(
    []
  );
  const [analytics, setAnalytics] = useState<SofiaAnalytics | null>(null);
  const [insights, setInsights] = useState<SofiaInsight[]>([]);
  const [notifications, setNotifications] = useState<SofiaNotification[]>([]);
  const [guestProfile, setGuestProfile] = useState<SofiaGuestProfile | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SofiaError | null>(null);

  // =============================================================================
  // RECOMMENDATIONS
  // =============================================================================

  const getRecommendations = useCallback(
    async (
      propertyId: string,
      guestId: string,
      recommendationType:
        | 'rooms'
        | 'restaurants'
        | 'services'
        | 'general' = 'general',
      limit: number = 10
    ): Promise<SofiaRecommendation[]> => {
      setLoading(true);
      setError(null);

      try {
        const recommendations = await sofiaService.getRecommendations(
          propertyId,
          guestId,
          recommendationType,
          limit
        );

        setRecommendations((prev) => [...prev, ...recommendations]);
        return recommendations;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError({ message: errorMessage });
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getRoomRecommendations = useCallback(
    async (
      propertyId: string,
      guestId: string,
      checkInDate?: string,
      checkOutDate?: string,
      guests?: number
    ): Promise<SofiaRecommendation[]> => {
      setLoading(true);
      setError(null);

      try {
        const recommendations = await sofiaService.getRoomRecommendations(
          propertyId,
          guestId,
          checkInDate,
          checkOutDate,
          guests
        );

        setRecommendations((prev) => [...prev, ...recommendations]);
        return recommendations;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError({ message: errorMessage });
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getRestaurantRecommendations = useCallback(
    async (
      propertyId: string,
      guestId: string,
      cuisineType?: string,
      priceRange?: string
    ): Promise<SofiaRecommendation[]> => {
      setLoading(true);
      setError(null);

      try {
        const recommendations = await sofiaService.getRestaurantRecommendations(
          propertyId,
          guestId,
          cuisineType,
          priceRange
        );

        setRecommendations((prev) => [...prev, ...recommendations]);
        return recommendations;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError({ message: errorMessage });
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getServiceRecommendations = useCallback(
    async (
      propertyId: string,
      guestId: string,
      serviceType?: string
    ): Promise<SofiaRecommendation[]> => {
      setLoading(true);
      setError(null);

      try {
        const recommendations = await sofiaService.getServiceRecommendations(
          propertyId,
          guestId,
          serviceType
        );

        setRecommendations((prev) => [...prev, ...recommendations]);
        return recommendations;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError({ message: errorMessage });
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =============================================================================
  // ANALYTICS
  // =============================================================================

  const getPropertyAnalytics = useCallback(
    async (
      propertyId: string,
      days: number = 30
    ): Promise<SofiaAnalytics | null> => {
      setLoading(true);
      setError(null);

      try {
        const analytics = await sofiaService.getPropertyAnalytics(
          propertyId,
          days
        );
        setAnalytics(analytics);
        return analytics;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError({ message: errorMessage });
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getBookingAnalytics = useCallback(
    async (propertyId: string, days: number = 30): Promise<unknown> => {
      setLoading(true);
      setError(null);

      try {
        const analytics = await sofiaService.getBookingAnalytics(
          propertyId,
          days
        );
        return analytics;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError({ message: errorMessage });
        return {};
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getRevenueAnalytics = useCallback(
    async (propertyId: string, days: number = 30): Promise<unknown> => {
      setLoading(true);
      setError(null);

      try {
        const analytics = await sofiaService.getRevenueAnalytics(
          propertyId,
          days
        );
        return analytics;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError({ message: errorMessage });
        return {};
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =============================================================================
  // INSIGHTS
  // =============================================================================

  const getInsights = useCallback(
    async (
      propertyId: string,
      insightType?: string,
      limit: number = 10
    ): Promise<SofiaInsight[]> => {
      setLoading(true);
      setError(null);

      try {
        const insights = await sofiaService.getInsights(
          propertyId,
          insightType,
          limit
        );
        setInsights((prev) => [...prev, ...insights]);
        return insights;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError({ message: errorMessage });
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getTrendInsights = useCallback(
    async (propertyId: string): Promise<SofiaInsight[]> => {
      return getInsights(propertyId, 'trend');
    },
    [getInsights]
  );

  const getAnomalyInsights = useCallback(
    async (propertyId: string): Promise<SofiaInsight[]> => {
      return getInsights(propertyId, 'anomaly');
    },
    [getInsights]
  );

  const getOpportunityInsights = useCallback(
    async (propertyId: string): Promise<SofiaInsight[]> => {
      return getInsights(propertyId, 'opportunity');
    },
    [getInsights]
  );

  // =============================================================================
  // GUEST PROFILE
  // =============================================================================

  const getGuestProfile = useCallback(
    async (
      propertyId: string,
      guestId: string
    ): Promise<SofiaGuestProfile | null> => {
      setLoading(true);
      setError(null);

      try {
        const profile = await sofiaService.getGuestProfile(propertyId, guestId);
        setGuestProfile(profile);
        return profile;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError({ message: errorMessage });
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateGuestPreferences = useCallback(
    async (
      propertyId: string,
      guestId: string,
      preferences: Partial<SofiaGuestProfile['preferences']>
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const success = await sofiaService.updateGuestPreferences(
          propertyId,
          guestId,
          preferences
        );
        if (success) {
          // Refresh guest profile
          await getGuestProfile(propertyId, guestId);
        }
        return success;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError({ message: errorMessage });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getGuestProfile]
  );

  // =============================================================================
  // NOTIFICATIONS
  // =============================================================================

  const getGuestNotifications = useCallback(
    async (
      propertyId: string,
      guestId: string,
      unreadOnly: boolean = false,
      limit: number = 20
    ): Promise<SofiaNotification[]> => {
      setLoading(true);
      setError(null);

      try {
        const notifications = await sofiaService.getNotifications(
          propertyId,
          guestId,
          unreadOnly,
          limit
        );
        setNotifications(notifications);
        return notifications;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError({ message: errorMessage });
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const markNotificationRead = useCallback(
    async (notificationId: string): Promise<boolean> => {
      try {
        const success = await sofiaService.markNotificationRead(notificationId);
        if (success) {
          setNotifications((prev) =>
            prev.map((notif) =>
              notif.id === notificationId ? { ...notif, is_read: true } : notif
            )
          );
        }
        return success;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError({ message: errorMessage });
        return false;
      }
    },
    []
  );

  const sendNotification = useCallback(
    async (
      propertyId: string,
      guestId: string,
      type: SofiaNotification['type'],
      title: string,
      message: string,
      priority: SofiaNotification['priority'] = 'medium',
      actionData?: unknown): Promise<boolean> => {
      try {
        return await sofiaService.sendNotification(
          propertyId,
          guestId,
          type,
          title,
          message,
          priority,
          actionData
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError({ message: errorMessage });
        return false;
      }
    },
    []
  );

  // =============================================================================
  // FEEDBACK
  // =============================================================================

  const submitRecommendationFeedback = useCallback(
    async (
      recommendationId: string,
      feedbackScore: number,
      isAccepted: boolean,
      comments?: string
    ): Promise<boolean> => {
      try {
        return await sofiaService.submitRecommendationFeedback(
          recommendationId,
          feedbackScore,
          isAccepted,
          comments
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError({ message: errorMessage });
        return false;
      }
    },
    []
  );

  const submitInsightFeedback = useCallback(
    async (
      insightId: string,
      helpful: boolean,
      comments?: string
    ): Promise<boolean> => {
      try {
        return await sofiaService.submitInsightFeedback(
          insightId,
          helpful,
          comments
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError({ message: errorMessage });
        return false;
      }
    },
    []
  );

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  const getHighConfidenceRecommendations = useCallback(
    (threshold: number = 0.7): SofiaRecommendation[] => {
      return recommendations.filter((rec) => rec.score >= threshold);
    },
    [recommendations]
  );

  const getUnreadNotifications = useCallback((): SofiaNotification[] => {
    return notifications.filter((notif) => !notif.is_read);
  }, [notifications]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearRecommendations = useCallback(() => {
    setRecommendations([]);
  }, []);

  const clearInsights = useCallback(() => {
    setInsights([]);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // =============================================================================
  // HEALTH CHECK
  // =============================================================================

  const getHealthStatus = useCallback(async (): Promise<{
    status: string;
    timestamp: string;
  }> => {
    try {
      return await sofiaService.getHealthStatus();
    } catch (err) {
      return { status: 'error', timestamp: new Date().toISOString() };
    }
  }, []);

  // =============================================================================
  // RETURN HOOK INTERFACE
  // =============================================================================

  return {
    // State
    recommendations,
    analytics,
    insights,
    notifications,
    guestProfile,
    loading,
    error,

    // Recommendation methods
    getRecommendations,
    getRoomRecommendations,
    getRestaurantRecommendations,
    getServiceRecommendations,

    // Analytics methods
    getPropertyAnalytics,
    getBookingAnalytics,
    getRevenueAnalytics,

    // Insights methods
    getInsights,
    getTrendInsights,
    getAnomalyInsights,
    getOpportunityInsights,

    // Guest profile methods
    getGuestProfile,
    updateGuestPreferences,

    // Notification methods
    getGuestNotifications,
    markNotificationRead,
    sendNotification,

    // Feedback methods
    submitRecommendationFeedback,
    submitInsightFeedback,

    // Utility methods
    getHighConfidenceRecommendations,
    getUnreadNotifications,
    clearError,
    clearRecommendations,
    clearInsights,
    clearNotifications,

    // Health check
    getHealthStatus,
  };
}
