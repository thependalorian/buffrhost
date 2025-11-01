/**
 * Multi-Functional Property Hub Types
 *
 * Purpose: Defines TypeScript interfaces for Multi-Functional Property Hub components
 * Location: components/views/types/property-hub-types.ts
 * Usage: Type definitions for property hub data structures
 * Updated: Aligned with actual database schema
 *
 * @author George Nekwaya (pendanek@gmail.com)
 * @version 2.0.0
 * @framework Buffr Host Framework
 */

import {
  Property,
  HotelDetails,
  RestaurantDetails,
  RoomType,
  RestaurantTable,
  Order,
  Booking,
} from '../../../lib/types/database';

/**
 * Property Hub Property Interface
 *
 * Extended property interface for the multi-functional hub with additional computed fields.
 */
export interface PropertyHubProperty extends Property {
  hotel?: HotelDetails;
  restaurant?: RestaurantDetails;
  amenities?: PropertyAmenities;
  roomTypes?: RoomType[];
  restaurantTables?: RestaurantTable[];
  recentBookings?: Booking[];
  recentOrders?: Order[];
}

/**
 * Property Amenities Interface
 *
 * Defines the amenities available at a multi-functional property.
 */
export interface PropertyAmenities {
  hotel?: boolean;
  restaurant?: boolean;
  bar?: boolean;
  spa?: boolean;
  gym?: boolean;
  pool?: boolean;
  room_service?: boolean;
  delivery?: boolean;
  takeaway?: boolean;
}

/**
 * Hotel Data Interface
 *
 * Defines the data structure for hotel-related information using actual database types.
 */
export interface HotelData {
  bookings: Booking[];
  roomTypes: RoomType[];
  roomAvailability: any[]; // Room availability data
  hotelDetails?: HotelDetails;
  totalRooms: number;
  availableRooms: number;
  occupancyRate: number;
}

/**
 * Restaurant Data Interface
 *
 * Defines the data structure for restaurant-related information using actual database types.
 */
export interface RestaurantData {
  menuItems: any[]; // Menu items data
  tables: RestaurantTable[];
  reservations: any[]; // Table reservations data
  orders: Order[];
  inventory: any[]; // Inventory data
  restaurantDetails?: RestaurantDetails;
  totalTables: number;
  availableTables: number;
  averageOrderValue: number;
}

/**
 * Property Hub State Interface
 *
 * Defines the state structure for the property hub component.
 */
export interface PropertyHubState {
  property: PropertyHubProperty | null;
  hotelData: HotelData;
  restaurantData: RestaurantData;
  amenities: PropertyAmenities;
  loading: boolean;
  error: string | null;
}

/**
 * Tab Configuration Interface
 *
 * Defines the configuration for tabs in the property hub.
 */
export interface TabConfig {
  value: string;
  label: string;
  enabled: boolean;
  component: React.ComponentType<unknown>;
}

/**
 * Dashboard Metrics Interface
 *
 * Defines the metrics displayed in the overview dashboard.
 * Aligned with DashboardStats from database types.
 */
export interface DashboardMetrics {
  totalBookings: number;
  totalOrders: number;
  totalRevenue: number;
  occupancyRate: number;
  averageOrderValue: number;
  customerSatisfaction: number;
  pendingOrders: number;
  completedOrders: number;
  averageRating: number;
  totalReviews: number;
  todayRevenue: number;
  monthlyRevenue: number;
}

/**
 * Property Hub Props Interface
 *
 * Defines the props interface for property hub components.
 */
export interface PropertyHubProps {
  propertyId: string;
  property?: PropertyHubProperty;
  hotelData?: HotelData;
  restaurantData?: RestaurantData;
  amenities?: PropertyAmenities;
  onDataUpdate?: (data: Partial<PropertyHubState>) => void;
}
