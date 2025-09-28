/**
 * Recommendation System Hooks
 * React hooks for AI/ML recommendation functionality
 */

import { useState, useEffect, useCallback } from "react";
import {
  RecommendationItem,
  UserPreference,
  UserFavorite,
  BookingInquiry,
  RecommendationContext,
  UseRecommendationsReturn,
  UseFavoritesReturn,
  UseAnalyticsReturn,
} from "@/src/types/recommendation";

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Custom hook for recommendations
export function useRecommendations(
  itemType?: "room" | "tour" | "service" | "menu_item",
  limit: number = 10,
  recommendationType:
    | "personalized"
    | "trending"
    | "similar"
    | "popular" = "personalized",
): UseRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        recommendation_type: recommendationType,
      });

      if (itemType) {
        params.append("item_type", itemType);
      }

      const response = await fetch(
        `${API_BASE}/api/recommendations/recommendations?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch recommendations: ${response.statusText}`,
        );
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch recommendations",
      );
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  }, [itemType, limit, recommendationType]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    refetch: fetchRecommendations,
  };
}

// Custom hook for guest recommendations (no authentication)
export function useGuestRecommendations(
  userId: string,
  itemType?: "room" | "tour" | "service" | "menu_item",
  limit: number = 10,
): UseRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        user_id: userId,
        limit: limit.toString(),
      });

      if (itemType) {
        params.append("item_type", itemType);
      }

      const response = await fetch(
        `${API_BASE}/api/recommendations/guest/recommendations?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch guest recommendations: ${response.statusText}`,
        );
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch recommendations",
      );
      console.error("Error fetching guest recommendations:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, itemType, limit]);

  useEffect(() => {
    if (userId) {
      fetchRecommendations();
    }
  }, [fetchRecommendations, userId]);

  return {
    recommendations,
    loading,
    error,
    refetch: fetchRecommendations,
  };
}

// Custom hook for user favorites
export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE}/api/recommendations/favorites`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch favorites: ${response.statusText}`);
      }

      const data = await response.json();
      setFavorites(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch favorites",
      );
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback(
    async (
      itemId: string,
      itemType: "room" | "tour" | "service" | "menu_item",
      propertyId: string,
    ): Promise<boolean> => {
      try {
        const response = await fetch(
          `${API_BASE}/api/recommendations/favorites/toggle`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
            body: JSON.stringify({
              item_id: itemId,
              item_type: itemType,
              property_id: propertyId,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to toggle favorite: ${response.statusText}`);
        }

        const data = await response.json();

        // Refresh favorites list
        await fetchFavorites();

        return data.is_favorite;
      } catch (err) {
        console.error("Error toggling favorite:", err);
        throw err;
      }
    },
    [fetchFavorites],
  );

  const addFavorite = useCallback(
    async (item: UserFavorite) => {
      try {
        const response = await fetch(
          `${API_BASE}/api/recommendations/favorites`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
            body: JSON.stringify(item),
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to add favorite: ${response.statusText}`);
        }

        await fetchFavorites();
      } catch (err) {
        console.error("Error adding favorite:", err);
        throw err;
      }
    },
    [fetchFavorites],
  );

  const removeFavorite = useCallback(
    async (itemId: string) => {
      try {
        const response = await fetch(
          `${API_BASE}/api/recommendations/favorites/${itemId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to remove favorite: ${response.statusText}`);
        }

        await fetchFavorites();
      } catch (err) {
        console.error("Error removing favorite:", err);
        throw err;
      }
    },
    [fetchFavorites],
  );

  const isFavorite = useCallback(
    (itemId: string): boolean => {
      return favorites.some((fav) => fav.item_id === itemId);
    },
    [favorites],
  );

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    error,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}

// Custom hook for guest favorites (localStorage only)
export function useGuestFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(() => {
    try {
      const savedFavorites = localStorage.getItem("etuna-favorites");
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        // Convert to UserFavorite format
        const favoritesList = favoriteIds.map(
          (itemId: string, index: number) => ({
            favorite_id: `guest-${index}`,
            user_id: "guest",
            item_id: itemId,
            item_type: "room" as const, // Default type, would need to be determined
            property_id: "etuna-property",
            added_at: new Date().toISOString(),
          }),
        );
        setFavorites(favoritesList);
      }
    } catch (err) {
      console.error("Error loading guest favorites:", err);
    }
  }, []);

  const saveFavorites = useCallback((newFavorites: string[]) => {
    try {
      localStorage.setItem("etuna-favorites", JSON.stringify(newFavorites));
    } catch (err) {
      console.error("Error saving guest favorites:", err);
    }
  }, []);

  const toggleFavorite = useCallback(
    async (
      itemId: string,
      itemType: "room" | "tour" | "service" | "menu_item",
      propertyId: string,
    ): Promise<boolean> => {
      try {
        const savedFavorites = localStorage.getItem("etuna-favorites");
        const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];

        let isFavorite: boolean;
        if (favoriteIds.includes(itemId)) {
          // Remove favorite
          const newFavorites = favoriteIds.filter(
            (id: string) => id !== itemId,
          );
          saveFavorites(newFavorites);
          isFavorite = false;
        } else {
          // Add favorite
          const newFavorites = [...favoriteIds, itemId];
          saveFavorites(newFavorites);
          isFavorite = true;
        }

        // Send to recommendation API
        try {
          await fetch(`${API_BASE}/api/recommendations/guest/preferences`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: "guest",
              item_id: itemId,
              item_type: itemType,
              action: isFavorite ? "like" : "unlike",
            }),
          });
        } catch (apiError) {
          console.log(
            "Recommendation API not available, using local storage only",
          );
        }

        loadFavorites();
        return isFavorite;
      } catch (err) {
        console.error("Error toggling guest favorite:", err);
        throw err;
      }
    },
    [loadFavorites, saveFavorites],
  );

  const addFavorite = useCallback(
    async (item: UserFavorite) => {
      try {
        const savedFavorites = localStorage.getItem("etuna-favorites");
        const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];

        if (!favoriteIds.includes(item.item_id)) {
          const newFavorites = [...favoriteIds, item.item_id];
          saveFavorites(newFavorites);
          loadFavorites();
        }
      } catch (err) {
        console.error("Error adding guest favorite:", err);
        throw err;
      }
    },
    [loadFavorites, saveFavorites],
  );

  const removeFavorite = useCallback(
    async (itemId: string) => {
      try {
        const savedFavorites = localStorage.getItem("etuna-favorites");
        const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];

        const newFavorites = favoriteIds.filter((id: string) => id !== itemId);
        saveFavorites(newFavorites);
        loadFavorites();
      } catch (err) {
        console.error("Error removing guest favorite:", err);
        throw err;
      }
    },
    [loadFavorites, saveFavorites],
  );

  const isFavorite = useCallback(
    (itemId: string): boolean => {
      return favorites.some((fav) => fav.item_id === itemId);
    },
    [favorites],
  );

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    loading,
    error,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}

// Custom hook for analytics
export function useAnalytics(): UseAnalyticsReturn {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordBehavior = useCallback(async (behavior: any) => {
    try {
      const response = await fetch(`${API_BASE}/api/recommendations/behavior`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(behavior),
      });

      if (!response.ok) {
        throw new Error(`Failed to record behavior: ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error recording behavior:", err);
    }
  }, []);

  const recordPreference = useCallback(async (preference: any) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/recommendations/preferences`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify(preference),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to record preference: ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error recording preference:", err);
    }
  }, []);

  return {
    analytics,
    loading,
    error,
    recordBehavior,
    recordPreference,
  };
}

// Utility function to record guest behavior
export async function recordGuestBehavior(
  userId: string,
  pagePath: string,
  actionType: string,
  actionData?: Record<string, any>,
) {
  try {
    await fetch(`${API_BASE}/api/recommendations/guest/preferences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        item_id: pagePath,
        item_type: "page",
        action: actionType,
        context_data: actionData,
      }),
    });
  } catch (err) {
    console.log("Guest behavior recording failed:", err);
  }
}
