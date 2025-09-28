/**
 * Restaurant Types
 * TypeScript interfaces for restaurant management functionality
 */

export interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  is_active: boolean;
  timezone?: string;
  created_at: string;
  updated_at?: string;
}

export interface RestaurantCreate {
  restaurant_name: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  is_active?: boolean;
  timezone?: string;
}

export interface RestaurantUpdate {
  restaurant_name?: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  is_active?: boolean;
  timezone?: string;
}

export interface RestaurantSummary {
  restaurant_id: number;
  restaurant_name: string;
  is_active: boolean;
  created_at: string;
}

// API Request/Response Types
export interface RestaurantListRequest {
  skip?: number;
  limit?: number;
  is_active?: boolean;
}

export interface RestaurantListResponse {
  restaurants: RestaurantSummary[];
  total: number;
  skip: number;
  limit: number;
}

export interface RestaurantResponse {
  restaurant: Restaurant;
}

// Frontend-specific types
export interface RestaurantCard {
  id: number;
  name: string;
  logo?: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface RestaurantFormData {
  restaurant_name: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  is_active: boolean;
  timezone?: string;
}

// Hook return types
export interface UseRestaurantsReturn {
  restaurants: RestaurantCard[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createRestaurant: (data: RestaurantFormData) => Promise<Restaurant>;
  updateRestaurant: (id: number, data: Partial<RestaurantFormData>) => Promise<Restaurant>;
  deleteRestaurant: (id: number) => Promise<void>;
}

export interface UseRestaurantReturn {
  restaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateRestaurant: (data: Partial<RestaurantFormData>) => Promise<Restaurant>;
  deleteRestaurant: () => Promise<void>;
}

// Event types for restaurant management
export interface RestaurantEvent {
  type:
    | "restaurant_created"
    | "restaurant_updated"
    | "restaurant_deleted"
    | "restaurant_activated"
    | "restaurant_deactivated";
  data: Restaurant;
  timestamp: string;
}

export interface RestaurantCreatedEventData {
  restaurant: Restaurant;
  created_by: string;
}

export interface RestaurantUpdatedEventData {
  restaurant: Restaurant;
  updated_by: string;
  changes: Partial<Restaurant>;
}

export interface RestaurantDeletedEventData {
  restaurant_id: number;
  deleted_by: string;
}

// Constants
export const RESTAURANT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export const RESTAURANT_EVENTS = {
  CREATED: "restaurant_created",
  UPDATED: "restaurant_updated",
  DELETED: "restaurant_deleted",
  ACTIVATED: "restaurant_activated",
  DEACTIVATED: "restaurant_deactivated",
} as const;

// Form validation types
export interface RestaurantFormErrors {
  restaurant_name?: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  timezone?: string;
}

export interface RestaurantFormState {
  data: RestaurantFormData;
  errors: RestaurantFormErrors;
  isSubmitting: boolean;
  isValid: boolean;
}

// Search and filter types
export interface RestaurantSearchFilters {
  query?: string;
  is_active?: boolean;
  timezone?: string;
  created_after?: string;
  created_before?: string;
}

export interface RestaurantSearchResult {
  restaurants: RestaurantCard[];
  total: number;
  filters: RestaurantSearchFilters;
}

// Dashboard types
export interface RestaurantDashboardData {
  total_restaurants: number;
  active_restaurants: number;
  inactive_restaurants: number;
  recent_restaurants: RestaurantCard[];
  restaurant_growth: Array<{
    date: string;
    count: number;
  }>;
}

// Analytics types
export interface RestaurantAnalytics {
  restaurant_id: number;
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  customer_count: number;
  rating: number;
  review_count: number;
  last_order_date?: string;
}

export interface RestaurantPerformanceMetrics {
  restaurant_id: number;
  period: "daily" | "weekly" | "monthly" | "yearly";
  metrics: {
    revenue: number;
    orders: number;
    customers: number;
    rating: number;
    growth_rate: number;
  };
  comparison: {
    previous_period: number;
    change_percentage: number;
  };
}
