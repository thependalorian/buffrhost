/**
 * LOCATION MANAGEMENT SYSTEM
 * Advanced location and geospatial management for Buffr Host
 */

import { v4 as uuidv4 } from 'uuid';

// Enums
export enum LocationType {
  PROPERTY = 'property',
  ROOM = 'room',
  FACILITY = 'facility',
  RESTAURANT = 'restaurant',
  SPA = 'spa',
  POOL = 'pool',
  GYM = 'gym',
  PARKING = 'parking',
  EVENT_SPACE = 'event_space',
  MEETING_ROOM = 'meeting_room',
  LANDMARK = 'landmark',
  TRANSPORT = 'transport',
  CUSTOM = 'custom'
}

export enum LocationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  CLOSED = 'closed',
  TEMPORARILY_UNAVAILABLE = 'temporarily_unavailable'
}

// Interfaces
export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  address_line_2?: string;
  formatted_address?: string;
}

export interface LocationMetadata {
  timezone: string;
  language: string;
  currency: string;
  amenities: string[];
  accessibility_features: string[];
  operating_hours: Record<string, any>;
  contact_info: Record<string, any>;
  social_media: Record<string, any>;
  images: string[];
  tags: string[];
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  type: LocationType;
  status: LocationStatus;
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  address_line_2?: string;
  formatted_address?: string;
  parent_location_id?: string;
  property_id?: string;
  metadata: LocationMetadata;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface LocationDistance {
  id: string;
  location_id: string;
  nearby_location_id: string;
  distance_meters: number;
  walking_time_minutes?: number;
  driving_time_minutes?: number;
  created_at: Date;
}

export interface LocationManagerOptions {
  db: any; // Database session/connection
  geocoderApiKey?: string;
}

export class LocationManager {
  private db: any;
  private geocoderApiKey?: string;
  private locationCache: Map<string, Location> = new Map();

  constructor(options: LocationManagerOptions) {
    this.db = options.db;
    this.geocoderApiKey = options.geocoderApiKey;
  }

  async createLocation(locationData: Record<string, any>): Promise<Location> {
    try {
      // Validate coordinates
      if (!this.validateCoordinates(locationData.latitude, locationData.longitude)) {
        throw new Error('Invalid coordinates');
      }

      // Geocode address if coordinates not provided
      if (!locationData.latitude || !locationData.longitude) {
        const coords = await this.geocodeAddress(locationData.address || {});
        if (coords) {
          locationData.latitude = coords.latitude;
          locationData.longitude = coords.longitude;
        }
      }

      // Create location
      const location: Location = {
        id: uuidv4(),
        name: locationData.name,
        description: locationData.description || '',
        type: locationData.type,
        status: locationData.status || LocationStatus.ACTIVE,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        altitude: locationData.altitude,
        accuracy: locationData.accuracy,
        street: locationData.address?.street,
        city: locationData.address?.city,
        state: locationData.address?.state,
        country: locationData.address?.country,
        postal_code: locationData.address?.postal_code,
        address_line_2: locationData.address?.address_line_2,
        formatted_address: locationData.address?.formatted_address,
        parent_location_id: locationData.parent_location_id,
        property_id: locationData.property_id,
        metadata: locationData.metadata || this.getDefaultMetadata(),
        created_by: locationData.created_by || 'system',
        created_at: new Date(),
        updated_at: new Date()
      };

      // Insert into database
      await this.db.query(
        `INSERT INTO locations (
          id, name, description, type, status, latitude, longitude, altitude, accuracy,
          street, city, state, country, postal_code, address_line_2, formatted_address,
          parent_location_id, property_id, metadata, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          location.id, location.name, location.description, location.type, location.status,
          location.latitude, location.longitude, location.altitude, location.accuracy,
          location.street, location.city, location.state, location.country, location.postal_code,
          location.address_line_2, location.formatted_address, location.parent_location_id,
          location.property_id, JSON.stringify(location.metadata), location.created_by,
          location.created_at, location.updated_at
        ]
      );

      // Calculate nearby locations
      await this.calculateNearbyLocations(location);

      return location;
    } catch (error) {
      throw new Error(`Failed to create location: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateCoordinates(latitude: number, longitude: number): boolean {
    if (latitude === undefined || longitude === undefined) {
      return false;
    }
    return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  }

  private async geocodeAddress(address: Record<string, any>): Promise<Coordinates | null> {
    try {
      if (!this.geocoderApiKey) {
        return null;
      }

      // Build address string
      const addressParts: string[] = [];
      if (address.street) addressParts.push(address.street);
      if (address.city) addressParts.push(address.city);
      if (address.state) addressParts.push(address.state);
      if (address.country) addressParts.push(address.country);

      const addressString = addressParts.join(', ');

      // Use a geocoding service (e.g., Google Maps API, OpenStreetMap Nominatim)
      // For now, return null as we don't have a geocoding service configured
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  private getDefaultMetadata(): LocationMetadata {
    return {
      timezone: 'UTC',
      language: 'en',
      currency: 'NAD',
      amenities: [],
      accessibility_features: [],
      operating_hours: {},
      contact_info: {},
      social_media: {},
      images: [],
      tags: []
    };
  }

  private async calculateNearbyLocations(location: Location, radiusKm: number = 10.0): Promise<void> {
    try {
      // Find locations within radius
      const nearbyLocations = await this.findLocationsWithinRadius(
        location.latitude, location.longitude, radiusKm
      );

      // Calculate distances and create relationships
      for (const nearby of nearbyLocations) {
        if (nearby.id === location.id) {
          continue;
        }

        const distance = this.calculateDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: nearby.latitude, longitude: nearby.longitude }
        ) * 1000; // Convert to meters

        // Estimate walking and driving times
        const walkingTime = (distance / 1000) / 5 * 60; // 5 km/h walking speed
        const drivingTime = (distance / 1000) / 50 * 60; // 50 km/h average driving speed

        // Create distance relationship
        const distanceRel: LocationDistance = {
          id: uuidv4(),
          location_id: location.id,
          nearby_location_id: nearby.id,
          distance_meters: distance,
          walking_time_minutes: walkingTime,
          driving_time_minutes: drivingTime,
          created_at: new Date()
        };

        await this.db.query(
          `INSERT INTO location_distances (id, location_id, nearby_location_id, distance_meters, walking_time_minutes, driving_time_minutes, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            distanceRel.id, distanceRel.location_id, distanceRel.nearby_location_id,
            distanceRel.distance_meters, distanceRel.walking_time_minutes,
            distanceRel.driving_time_minutes, distanceRel.created_at
          ]
        );
      }
    } catch (error) {
      console.error('Error calculating nearby locations:', error);
    }
  }

  private async findLocationsWithinRadius(
    latitude: number,
    longitude: number,
    radiusKm: number
  ): Promise<Location[]> {
    try {
      // Calculate bounding box
      const latDelta = radiusKm / 111.0; // Approximate km per degree latitude
      const lngDelta = radiusKm / (111.0 * Math.cos(Math.PI * latitude / 180));

      const minLat = latitude - latDelta;
      const maxLat = latitude + latDelta;
      const minLng = longitude - lngDelta;
      const maxLng = longitude + lngDelta;

      // Query locations in bounding box
      const result = await this.db.query(
        'SELECT * FROM locations WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?',
        [minLat, maxLat, minLng, maxLng]
      );

      const locations = result.map((row: any) => this.mapRowToLocation(row));

      // Filter by actual distance
      const nearbyLocations: Location[] = [];
      for (const loc of locations) {
        const distance = this.calculateDistance(
          { latitude, longitude },
          { latitude: loc.latitude, longitude: loc.longitude }
        );

        if (distance <= radiusKm) {
          nearbyLocations.push(loc);
        }
      }

      return nearbyLocations;
    } catch (error) {
      console.error('Error finding locations within radius:', error);
      return [];
    }
  }

  private calculateDistance(point1: Coordinates, point2: Coordinates): number {
    // Haversine formula for calculating distance between two points
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(point2.latitude - point1.latitude);
    const dLng = this.deg2rad(point2.longitude - point1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(point1.latitude)) * Math.cos(this.deg2rad(point2.latitude)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async getLocation(locationId: string): Promise<Location | null> {
    try {
      // Check cache first
      if (this.locationCache.has(locationId)) {
        return this.locationCache.get(locationId)!;
      }

      // Query database
      const result = await this.db.query('SELECT * FROM locations WHERE id = ?', [locationId]);
      if (result.length === 0) {
        return null;
      }

      const location = this.mapRowToLocation(result[0]);
      this.locationCache.set(locationId, location);
      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  }

  async getLocationsByType(
    locationType: LocationType,
    propertyId?: string,
    status?: LocationStatus
  ): Promise<Location[]> {
    try {
      let query = 'SELECT * FROM locations WHERE type = ?';
      const params: any[] = [locationType];

      if (propertyId) {
        query += ' AND property_id = ?';
        params.push(propertyId);
      }
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToLocation(row));
    } catch (error) {
      console.error('Error getting locations by type:', error);
      return [];
    }
  }

  async searchLocations(
    query: string,
    locationType?: LocationType,
    propertyId?: string,
    limit: number = 50
  ): Promise<Location[]> {
    try {
      let dbQuery = 'SELECT * FROM locations WHERE (name LIKE ? OR description LIKE ?)';
      const params: any[] = [`%${query}%`, `%${query}%`];

      if (locationType) {
        dbQuery += ' AND type = ?';
        params.push(locationType);
      }
      if (propertyId) {
        dbQuery += ' AND property_id = ?';
        params.push(propertyId);
      }

      dbQuery += ' LIMIT ?';
      params.push(limit);

      const result = await this.db.query(dbQuery, params);
      return result.map((row: any) => this.mapRowToLocation(row));
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  }

  async findNearbyLocations(
    latitude: number,
    longitude: number,
    radiusKm: number = 5.0,
    locationType?: LocationType,
    limit: number = 20
  ): Promise<Array<{ location: Location; distance_km: number; walking_time_minutes: number; driving_time_minutes: number }>> {
    try {
      // Find locations within radius
      const nearbyLocations = await this.findLocationsWithinRadius(
        latitude, longitude, radiusKm
      );

      // Filter by type if specified
      let filteredLocations = nearbyLocations;
      if (locationType) {
        filteredLocations = nearbyLocations.filter(loc => loc.type === locationType);
      }

      // Calculate distances and sort
      const results = [];
      for (const location of filteredLocations.slice(0, limit)) {
        const distance = this.calculateDistance(
          { latitude, longitude },
          { latitude: location.latitude, longitude: location.longitude }
        );

        results.push({
          location,
          distance_km: Math.round(distance * 100) / 100,
          walking_time_minutes: Math.round((distance / 5) * 60 * 10) / 10,
          driving_time_minutes: Math.round((distance / 50) * 60 * 10) / 10
        });
      }

      // Sort by distance
      results.sort((a, b) => a.distance_km - b.distance_km);
      return results;
    } catch (error) {
      console.error('Error finding nearby locations:', error);
      return [];
    }
  }

  async getLocationHierarchy(locationId: string): Promise<Record<string, any>> {
    try {
      const location = await this.getLocation(locationId);
      if (!location) {
        return {};
      }

      // Get parent location
      let parent = null;
      if (location.parent_location_id) {
        parent = await this.getLocation(location.parent_location_id);
      }

      // Get child locations
      const childrenResult = await this.db.query(
        'SELECT * FROM locations WHERE parent_location_id = ?',
        [locationId]
      );
      const children = childrenResult.map((row: any) => this.mapRowToLocation(row));

      return {
        location,
        parent,
        children,
        hierarchy_level: await this.calculateHierarchyLevel(location)
      };
    } catch (error) {
      console.error('Error getting location hierarchy:', error);
      return {};
    }
  }

  private async calculateHierarchyLevel(location: Location): Promise<number> {
    let level = 0;
    let current = location;

    while (current.parent_location_id) {
      const parent = await this.getLocation(current.parent_location_id);
      if (!parent) {
        break;
      }
      current = parent;
      level++;
    }

    return level;
  }

  async updateLocation(locationId: string, updates: Record<string, any>): Promise<Location> {
    try {
      const location = await this.getLocation(locationId);
      if (!location) {
        throw new Error('Location not found');
      }

      // Update fields
      const updateFields: string[] = [];
      const params: any[] = [];

      for (const [key, value] of Object.entries(updates)) {
        if (key !== 'id' && key !== 'created_at' && key !== 'created_by' && location.hasOwnProperty(key)) {
          updateFields.push(`${key} = ?`);
          params.push(value);
        }
      }

      if (updateFields.length === 0) {
        return location;
      }

      updateFields.push('updated_at = ?');
      params.push(new Date());
      params.push(locationId);

      await this.db.query(
        `UPDATE locations SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );

      // Recalculate nearby locations if coordinates changed
      if ('latitude' in updates || 'longitude' in updates) {
        await this.recalculateNearbyLocations(location);
      }

      // Get updated location
      const updatedLocation = await this.getLocation(locationId);
      return updatedLocation!;
    } catch (error) {
      throw new Error(`Failed to update location: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async recalculateNearbyLocations(location: Location): Promise<void> {
    try {
      // Delete existing distance relationships
      await this.db.query(
        'DELETE FROM location_distances WHERE location_id = ?',
        [location.id]
      );

      // Recalculate
      await this.calculateNearbyLocations(location);
    } catch (error) {
      console.error('Error recalculating nearby locations:', error);
    }
  }

  async deleteLocation(locationId: string): Promise<boolean> {
    try {
      const location = await this.getLocation(locationId);
      if (!location) {
        return false;
      }

      // Delete distance relationships
      await this.db.query(
        'DELETE FROM location_distances WHERE location_id = ? OR nearby_location_id = ?',
        [locationId, locationId]
      );

      // Delete child locations (cascade)
      const childrenResult = await this.db.query(
        'SELECT * FROM locations WHERE parent_location_id = ?',
        [locationId]
      );
      const children = childrenResult.map((row: any) => this.mapRowToLocation(row));

      for (const child of children) {
        await this.deleteLocation(child.id);
      }

      // Delete location
      await this.db.query('DELETE FROM locations WHERE id = ?', [locationId]);

      // Remove from cache
      this.locationCache.delete(locationId);

      return true;
    } catch (error) {
      console.error('Error deleting location:', error);
      return false;
    }
  }

  async getLocationStatistics(propertyId?: string): Promise<Record<string, any>> {
    try {
      let query = 'SELECT * FROM locations';
      const params: any[] = [];

      if (propertyId) {
        query += ' WHERE property_id = ?';
        params.push(propertyId);
      }

      const result = await this.db.query(query, params);
      const totalLocations = result.length;

      // Count by type
      const typeCounts: Record<string, number> = {};
      for (const locationType of Object.values(LocationType)) {
        typeCounts[locationType] = result.filter((row: any) => row.type === locationType).length;
      }

      // Count by status
      const statusCounts: Record<string, number> = {};
      for (const status of Object.values(LocationStatus)) {
        statusCounts[status] = result.filter((row: any) => row.status === status).length;
      }

      return {
        total_locations: totalLocations,
        by_type: typeCounts,
        by_status: statusCounts
      };
    } catch (error) {
      console.error('Error getting location statistics:', error);
      return {};
    }
  }

  async exportLocations(
    propertyId?: string,
    locationType?: LocationType
  ): Promise<Array<Record<string, any>>> {
    try {
      let query = 'SELECT * FROM locations';
      const params: any[] = [];

      if (propertyId) {
        query += ' WHERE property_id = ?';
        params.push(propertyId);
      }
      if (locationType) {
        query += propertyId ? ' AND type = ?' : ' WHERE type = ?';
        params.push(locationType);
      }

      const result = await this.db.query(query, params);

      return result.map((row: any) => {
        const location = this.mapRowToLocation(row);
        return {
          id: location.id,
          name: location.name,
          description: location.description,
          type: location.type,
          status: location.status,
          coordinates: {
            latitude: location.latitude,
            longitude: location.longitude,
            altitude: location.altitude,
            accuracy: location.accuracy
          },
          address: {
            street: location.street,
            city: location.city,
            state: location.state,
            country: location.country,
            postal_code: location.postal_code,
            address_line_2: location.address_line_2,
            formatted_address: location.formatted_address
          },
          property_id: location.property_id,
          parent_location_id: location.parent_location_id,
          metadata: location.metadata,
          created_at: location.created_at.toISOString(),
          updated_at: location.updated_at.toISOString()
        };
      });
    } catch (error) {
      console.error('Error exporting locations:', error);
      return [];
    }
  }

  // Helper methods
  private mapRowToLocation(row: any): Location {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      type: row.type as LocationType,
      status: row.status as LocationStatus,
      latitude: row.latitude,
      longitude: row.longitude,
      altitude: row.altitude,
      accuracy: row.accuracy,
      street: row.street,
      city: row.city,
      state: row.state,
      country: row.country,
      postal_code: row.postal_code,
      address_line_2: row.address_line_2,
      formatted_address: row.formatted_address,
      parent_location_id: row.parent_location_id,
      property_id: row.property_id,
      metadata: JSON.parse(row.metadata || '{}'),
      created_by: row.created_by,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    };
  }
}

export default LocationManager;