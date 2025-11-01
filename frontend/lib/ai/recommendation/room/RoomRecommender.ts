/**
 * Room Recommendation Engine
 *
 * Specialized recommender for hotel rooms and accommodations
 * Features: Room type matching, availability checking, pricing optimization
 * Location: lib/ai/recommendation/room/RoomRecommender.ts
 * Purpose: Recommend optimal rooms based on user preferences and constraints
 * Algorithms: Collaborative filtering, content-based matching, availability scoring
 */

import { BaseRecommendationEngine } from '../shared/BaseRecommender';
import {
  RoomRecommendation,
  RoomRecommendationContext,
  RecommendationRequest,
  RecommendationResponse,
  UserProfile,
} from '../shared/types';

export class RoomRecommender extends BaseRecommendationEngine {
  getItemType(): string {
    return 'room';
  }

  getAlgorithmName(): string {
    return 'Room Recommendation Engine';
  }

  getDefaultContext(): RoomRecommendationContext {
    return {
      property_id: '',
      check_in_date: new Date(),
      check_out_date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      party_size: 2,
      budget_range: [0, 10000],
      preferred_room_types: [],
      accessibility_needs: false,
      smoking_allowed: false,
    };
  }

  validateContext(context: any): boolean {
    return !!(
      context.property_id &&
      context.check_in_date &&
      context.check_out_date &&
      context.party_size &&
      context.party_size > 0
    );
  }

  // ============================================================================
  // ROOM-SPECIFIC RECOMMENDATION ALGORITHMS
  // ============================================================================

  protected async getContentBasedRecommendations(
    userProfile: UserProfile,
    request: RecommendationRequest
  ): Promise<RoomRecommendation[]> {
    const context = request.context as RoomRecommendationContext;
    const recommendations: RoomRecommendation[] = [];

    try {
      // Get available rooms for the property and dates
      const availableRooms = await this.getAvailableRooms(context);

      for (const room of availableRooms) {
        const score = this.calculateRoomContentScore(
          room,
          userProfile,
          context
        );
        const confidence = this.calculateRoomConfidence(room, context);

        if (score > 0 && confidence >= this.config.thresholds.min_confidence) {
          recommendations.push({
            item_id: room.id,
            item_type: 'room',
            score,
            confidence,
            reasons: this.generateRoomReasons(room, userProfile, context),
            metadata: {
              room_number: room.room_number,
              room_type: room.room_type,
              capacity: room.capacity,
              price_per_night: room.price_per_night,
              amenities: room.amenities,
              availability_status: room.availability_status,
            },
          });
        }
      }

      return recommendations.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Error in content-based room recommendations:', error);
      return [];
    }
  }

  protected applyBusinessRules(
    recommendations: RoomRecommendation[],
    context: RoomRecommendationContext
  ): RoomRecommendation[] {
    return recommendations.filter((rec) => {
      // Apply confidence threshold
      if (rec.confidence < this.config.thresholds.min_confidence) {
        return false;
      }

      // Check budget constraints
      if (context.budget_range) {
        const price = rec.metadata.price_per_night;
        if (
          price < context.budget_range[0] ||
          price > context.budget_range[1]
        ) {
          return false;
        }
      }

      // Check capacity requirements
      if (rec.metadata.capacity < context.party_size) {
        return false;
      }

      // Apply accessibility and smoking preferences
      if (
        context.accessibility_needs &&
        !rec.metadata.amenities.includes('wheelchair_accessible')
      ) {
        return false;
      }

      if (
        !context.smoking_allowed &&
        rec.metadata.amenities.includes('smoking_allowed')
      ) {
        return false;
      }

      return true;
    });
  }

  // ============================================================================
  // ROOM-SPECIFIC HELPER METHODS
  // ============================================================================

  private async getAvailableRooms(
    context: RoomRecommendationContext
  ): Promise<any[]> {
    try {
      const { RoomService } = await import(
        '../../../services/database/rooms/RoomService'
      );
      const rooms = await RoomService.getPropertyRooms(context.property_id, {
        roomType: context.preferred_room_types?.[0], // Use first preference if specified
        minOccupancy: context.party_size,
        maxOccupancy: context.party_size + 2, // Allow some flexibility
      });

      // Get availability for each room
      const roomsWithAvailability = await Promise.all(
        rooms.map(async (room: any) => {
          const availability = (await RoomService.roomHasBookings(room.id))
            ? 'limited'
            : 'available';
          return {
            id: room.id,
            room_number: room.room_number || room.room_code,
            room_type: room.room_type,
            capacity: room.capacity || room.max_occupancy,
            price_per_night: room.price_per_night || room.base_price,
            amenities: room.amenities || [],
            availability_status: availability,
          };
        })
      );

      return roomsWithAvailability;
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      return [];
    }
  }

  private calculateRoomContentScore(
    room: any,
    userProfile: UserProfile,
    context: RoomRecommendationContext
  ): number {
    let score = 0;

    // Room type preference matching
    if (context.preferred_room_types?.includes(room.room_type)) {
      score += 0.3;
    }

    // Capacity matching
    const capacityFit = Math.min(room.capacity / context.party_size, 1);
    score += capacityFit * 0.2;

    // Amenity matching with user preferences
    const userAmenityPrefs = userProfile.preferences.filter((p) =>
      [
        'wifi',
        'ac',
        'minibar',
        'jacuzzi',
        'ocean_view',
        'pool_access',
      ].includes(p)
    );

    const amenityMatches = userAmenityPrefs.filter((pref) =>
      room.amenities.includes(pref)
    ).length;

    score += (amenityMatches / Math.max(userAmenityPrefs.length, 1)) * 0.2;

    // Price optimization based on user spending pattern
    const priceScore = this.calculatePriceScore(
      room.price_per_night,
      userProfile
    );
    score += priceScore * 0.3;

    return Math.min(score, 1);
  }

  private calculatePriceScore(price: number, userProfile: UserProfile): number {
    const { spending_pattern } = userProfile.behavior_patterns;

    switch (spending_pattern) {
      case 'budget':
        return price <= 200 ? 1 : price <= 300 ? 0.7 : 0.3;
      case 'mid-range':
        return price <= 300 && price > 150 ? 1 : price <= 500 ? 0.8 : 0.4;
      case 'luxury':
        return price > 300 ? 1 : price > 200 ? 0.7 : 0.3;
      default:
        return 0.5; // Neutral score for unknown patterns
    }
  }

  private calculateRoomConfidence(
    room: any,
    context: RoomRecommendationContext
  ): number {
    let confidence = 0.5; // Base confidence

    // Higher confidence for better availability
    if (room.availability_status === 'available') {
      confidence += 0.2;
    }

    // Higher confidence for capacity matches
    if (room.capacity >= context.party_size) {
      confidence += 0.1;
    }

    // Higher confidence for preferred room types
    if (context.preferred_room_types?.includes(room.room_type)) {
      confidence += 0.2;
    }

    return Math.min(confidence, 1);
  }

  private generateRoomReasons(
    room: any,
    userProfile: UserProfile,
    context: RoomRecommendationContext
  ): string[] {
    const reasons: string[] = [];

    if (context.preferred_room_types?.includes(room.room_type)) {
      reasons.push(`Matches your preferred ${room.room_type} room type`);
    }

    if (room.capacity >= context.party_size) {
      reasons.push(`Accommodates your party of ${context.party_size}`);
    }

    const matchingAmenities = userProfile.preferences.filter((p) =>
      room.amenities.includes(p)
    );

    if (matchingAmenities.length > 0) {
      reasons.push(
        `Includes your preferred amenities: ${matchingAmenities.join(', ')}`
      );
    }

    if (room.availability_status === 'available') {
      reasons.push('Currently available for your dates');
    }

    return reasons.length > 0 ? reasons : ['Good match for your preferences'];
  }

  // ============================================================================
  // ROOM-SPECIFIC PUBLIC METHODS
  // ============================================================================

  /**
   * Get room recommendations with enhanced context
   */
  async getRoomRecommendations(
    userId: string,
    context: RoomRecommendationContext,
    limit: number = 10
  ): Promise<RecommendationResponse> {
    const request: RecommendationRequest = {
      user_id: userId,
      context,
      limit,
    };

    return this.generateRecommendations(request);
  }

  /**
   * Find optimal room for specific requirements
   */
  async findOptimalRoom(
    userId: string,
    context: RoomRecommendationContext
  ): Promise<RoomRecommendation | null> {
    const response = await this.getRoomRecommendations(userId, context, 1);

    if (response.recommendations.length > 0) {
      return response.recommendations[0] as RoomRecommendation;
    }

    return null;
  }

  /**
   * Get room availability for specific dates
   */
  async getRoomAvailability(
    propertyId: string,
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<Array<{ room_id: string; available: boolean; price: number }>> {
    try {
      // This would query the database for room availability
      // For now, return mock data
      return [
        { room_id: 'room_1', available: true, price: 250 },
        { room_id: 'room_2', available: true, price: 150 },
        { room_id: 'room_3', available: false, price: 500 },
      ];
    } catch (error) {
      console.error('Error checking room availability:', error);
      return [];
    }
  }
}
