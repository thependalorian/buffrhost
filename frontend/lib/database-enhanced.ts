/**
 * Database Enhanced Service - Compatibility Layer
 *
 * Provides backward compatibility for existing code while using modular database services
 * Features: All original methods available, delegates to modular services
 * Location: lib/database-enhanced.ts
 * Modularity: Compatibility layer for migration period
 * Scalability: Easy to remove once all code is migrated to modular services
 * Consistency: Maintains original API while using improved architecture
 *
 * @deprecated Use modular services from lib/database/ instead
 */

import {
  PropertyOwnerService,
  PropertyService,
  ImageService,
  RoomService,
  ServiceManager,
} from './database/index';
import {
  PropertyOwner,
  Property,
  PropertyImage,
  Room,
  PropertyService as PropertyServiceType,
  MenuItem,
} from './database/types';

// =============================================================================
// PROPERTY OWNERS
// =============================================================================

/**
 * @deprecated Use PropertyOwnerService.createPropertyOwner instead
 */
export class DatabaseService {
  static async createPropertyOwner(
    data: Partial<PropertyOwner>
  ): Promise<PropertyOwner> {
    return await PropertyOwnerService.createPropertyOwner(data);
  }

  static async getPropertyOwner(userId: string): Promise<PropertyOwner | null> {
    return await PropertyOwnerService.getPropertyOwner(userId);
  }

  // =============================================================================
  // PROPERTIES
  // =============================================================================

  static async getPropertiesDetailed(
    filters: any = {},
    includeDetails: boolean = true
  ): Promise<Property[]> {
    return await PropertyService.getPropertiesDetailed(filters, includeDetails);
  }

  static async createPropertyDetailed(data: any): Promise<Property> {
    return await PropertyService.createPropertyDetailed(data);
  }

  static async updatePropertyDetailed(
    id: string,
    data: any
  ): Promise<Property> {
    return await PropertyService.updatePropertyDetailed(id, data);
  }

  static async deleteProperty(id: string): Promise<void> {
    return await PropertyService.deleteProperty(id);
  }

  static async propertyHasBookings(id: string): Promise<boolean> {
    return await PropertyService.propertyHasBookings(id);
  }

  // =============================================================================
  // PROPERTY IMAGES
  // =============================================================================

  static async getPropertyImages(
    propertyId: string,
    filters: any = {}
  ): Promise<PropertyImage[]> {
    return await ImageService.getPropertyImages(propertyId, filters);
  }

  static async uploadPropertyImages(data: any): Promise<PropertyImage[]> {
    return await ImageService.uploadPropertyImages(data);
  }

  static async updatePropertyImage(
    id: string,
    data: any
  ): Promise<PropertyImage> {
    return await ImageService.updatePropertyImage(id, data);
  }

  static async deletePropertyImage(id: string): Promise<void> {
    return await ImageService.deletePropertyImage(id);
  }

  // =============================================================================
  // ROOMS
  // =============================================================================

  static async getPropertyRooms(
    propertyId: string,
    filters: any = {}
  ): Promise<Room[]> {
    return await RoomService.getPropertyRooms(propertyId, filters);
  }

  static async createPropertyRoom(data: any): Promise<Room> {
    return await RoomService.createPropertyRoom(data);
  }

  static async updatePropertyRoom(id: string, data: any): Promise<Room> {
    return await RoomService.updatePropertyRoom(id, data);
  }

  static async deletePropertyRoom(id: string): Promise<void> {
    return await RoomService.deletePropertyRoom(id);
  }

  static async roomHasBookings(id: string): Promise<boolean> {
    return await RoomService.roomHasBookings(id);
  }

  // =============================================================================
  // PROPERTY SERVICES
  // =============================================================================

  static async getPropertyServices(
    propertyId: string,
    filters: any = {}
  ): Promise<PropertyServiceType[]> {
    return await ServiceManager.getPropertyServices(propertyId, filters);
  }

  static async createPropertyService(data: any): Promise<PropertyServiceType> {
    return await ServiceManager.createPropertyService(data);
  }

  static async updatePropertyService(
    id: string,
    data: any
  ): Promise<PropertyServiceType> {
    return await ServiceManager.updatePropertyService(id, data);
  }

  static async deletePropertyService(id: string): Promise<void> {
    return await ServiceManager.deletePropertyService(id);
  }

  static async serviceHasBookings(id: string): Promise<boolean> {
    return await ServiceManager.serviceHasBookings(id);
  }

  // =============================================================================
  // MENU ITEMS
  // =============================================================================

  static async getPropertyMenuItems(
    propertyId: string,
    filters: any = {}
  ): Promise<MenuItem[]> {
    return await ServiceManager.getPropertyMenuItems(propertyId, filters);
  }

  static async createPropertyMenuItem(data: any): Promise<MenuItem> {
    return await ServiceManager.createPropertyMenuItem(data);
  }

  static async updatePropertyMenuItem(
    id: string,
    data: any
  ): Promise<MenuItem> {
    return await ServiceManager.updatePropertyMenuItem(id, data);
  }

  static async deletePropertyMenuItem(id: string): Promise<void> {
    return await ServiceManager.deletePropertyMenuItem(id);
  }
}
