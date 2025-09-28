/**
 * Recommendation System Types
 * TypeScript interfaces for AI/ML recommendation functionality
 */

export interface UserPreference {
  preference_id: string;
  user_id: string;
  item_id: string;
  item_type: "room" | "tour" | "service" | "menu_item" | "facility";
  action: "like" | "unlike" | "view" | "book" | "share" | "click" | "hover";
  preference_score: number; // -1.0 to 1.0
  context_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface RecommendationItem {
  item_id: string;
  item_type: "room" | "tour" | "service" | "menu_item" | "facility";
  recommendation_score: number; // 0.0 to 1.0
  confidence_score: number; // 0.0 to 1.0
  reason: string;
}

export interface RecommendationResponse {
  user_id: string;
  recommendations: RecommendationItem[];
  generated_at: string;
  algorithm_version: string;
}

export interface UserBehaviorAnalytics {
  behavior_id: string;
  user_id: string;
  session_id?: string;
  page_path: string;
  action_type:
    | "page_view"
    | "button_click"
    | "form_submit"
    | "search"
    | "filter"
    | "sort"
    | "share"
    | "bookmark"
    | "download"
    | "video_play";
  action_data?: Record<string, any>;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
  timestamp: string;
}

export interface BookingInquiry {
  inquiry_id: string;
  property_id: string;
  item_id: string;
  item_type: "room" | "tour" | "service";
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  preferred_date?: string;
  check_out_date?: string;
  number_of_people?: number;
  special_requests?: string;
  inquiry_status: "pending" | "contacted" | "quoted" | "booked" | "cancelled";
  assigned_staff_id?: string;
  response_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UserFavorite {
  favorite_id: string;
  user_id: string;
  item_id: string;
  item_type: "room" | "tour" | "service" | "menu_item";
  property_id: string;
  added_at: string;
}

export interface RecommendationEngine {
  engine_id: string;
  engine_name: string;
  algorithm_type: "collaborative" | "content_based" | "hybrid";
  model_version: string;
  is_active: boolean;
  configuration?: Record<string, any>;
  performance_metrics?: Record<string, any>;
  last_trained_at?: string;
  created_at: string;
  updated_at: string;
}

export interface RecommendationFeedback {
  feedback_id: string;
  user_id: string;
  recommendation_id: string;
  item_id: string;
  item_type: "room" | "tour" | "service" | "menu_item";
  feedback_type: "clicked" | "booked" | "dismissed" | "rated";
  feedback_value?: number; // -1.0 to 1.0
  feedback_text?: string;
  created_at: string;
}

// API Request/Response Types
export interface RecommendationRequest {
  user_id: string;
  item_type?: "room" | "tour" | "service" | "menu_item";
  limit?: number;
  recommendation_type?: "personalized" | "trending" | "similar" | "popular";
}

export interface UserPreferenceBatchRequest {
  preferences: Omit<
    UserPreference,
    "preference_id" | "created_at" | "updated_at"
  >[];
}

export interface UserPreferenceBatchResponse {
  processed_count: number;
  failed_count: number;
  errors: Array<{
    item_id: string;
    error: string;
  }>;
}

export interface UserAnalyticsRequest {
  user_id: string;
  start_date?: string;
  end_date?: string;
  action_types?: string[];
}

export interface UserAnalyticsResponse {
  user_id: string;
  total_actions: number;
  action_breakdown: Record<string, number>;
  top_pages: Array<{
    page: string;
    count: number;
  }>;
  top_items: Array<{
    item_id: string;
    count: number;
  }>;
  session_count: number;
  average_session_duration?: number;
}

export interface RecommendationDashboardData {
  total_users: number;
  total_preferences: number;
  total_recommendations: number;
  recommendation_accuracy?: number;
  popular_items: Array<{
    item_id: string;
    item_type: string;
    likes: number;
  }>;
  user_engagement: {
    daily_active_users: number;
    avg_session_duration: number;
    conversion_rate: number;
  };
  algorithm_performance: {
    accuracy: number;
    precision: number;
    recall: number;
  };
}

// Frontend-specific types
export interface FavoriteItem {
  id: string;
  type: "room" | "tour" | "service" | "menu_item";
  name: string;
  description?: string;
  image?: string;
  price?: number;
  currency?: string;
  added_at: string;
}

export interface RecommendationContext {
  user_id?: string;
  session_id?: string;
  page_path: string;
  device_type?: "mobile" | "tablet" | "desktop";
  location?: string;
  time_of_day?: "morning" | "afternoon" | "evening" | "night";
}

export interface RecommendationConfig {
  algorithm_version: string;
  cache_duration: number; // hours
  max_recommendations: number;
  min_confidence_score: number;
  enable_real_time: boolean;
}

// Hook return types
export interface UseRecommendationsReturn {
  recommendations: RecommendationItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseFavoritesReturn {
  favorites: FavoriteItem[];
  loading: boolean;
  error: string | null;
  toggleFavorite: (
    itemId: string,
    itemType: string,
    propertyId: string,
  ) => Promise<boolean>;
  addFavorite: (item: FavoriteItem) => Promise<void>;
  removeFavorite: (itemId: string) => Promise<void>;
  isFavorite: (itemId: string) => boolean;
}

export interface UseAnalyticsReturn {
  analytics: UserAnalyticsResponse | null;
  loading: boolean;
  error: string | null;
  recordBehavior: (
    behavior: Omit<UserBehaviorAnalytics, "behavior_id" | "timestamp">,
  ) => Promise<void>;
  recordPreference: (
    preference: Omit<
      UserPreference,
      "preference_id" | "created_at" | "updated_at"
    >,
  ) => Promise<void>;
}

// Event types for recommendation system
export interface RecommendationEvent {
  type:
    | "preference_recorded"
    | "recommendation_generated"
    | "feedback_received"
    | "cache_updated";
  data: any;
  timestamp: string;
}

export interface PreferenceEventData {
  user_id: string;
  item_id: string;
  item_type: string;
  action: string;
  score: number;
}

export interface RecommendationEventData {
  user_id: string;
  recommendations: RecommendationItem[];
  algorithm_version: string;
  generation_time: number; // milliseconds
}

export interface FeedbackEventData {
  user_id: string;
  recommendation_id: string;
  item_id: string;
  feedback_type: string;
  feedback_value?: number;
}

// Constants
export const RECOMMENDATION_TYPES = {
  PERSONALIZED: "personalized",
  TRENDING: "trending",
  SIMILAR: "similar",
  POPULAR: "popular",
} as const;

export const ITEM_TYPES = {
  ROOM: "room",
  TOUR: "tour",
  SERVICE: "service",
  MENU_ITEM: "menu_item",
  FACILITY: "facility",
} as const;

export const ACTIONS = {
  LIKE: "like",
  UNLIKE: "unlike",
  VIEW: "view",
  BOOK: "book",
  SHARE: "share",
  CLICK: "click",
  HOVER: "hover",
} as const;

export const INQUIRY_STATUS = {
  PENDING: "pending",
  CONTACTED: "contacted",
  QUOTED: "quoted",
  BOOKED: "booked",
  CANCELLED: "cancelled",
} as const;

export const FEEDBACK_TYPES = {
  CLICKED: "clicked",
  BOOKED: "booked",
  DISMISSED: "dismissed",
  RATED: "rated",
} as const;
