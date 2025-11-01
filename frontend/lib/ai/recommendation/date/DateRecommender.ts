/**
 * Date Recommendation Engine
 *
 * Specialized recommender for optimal booking dates and times
 * Features: Seasonal analysis, demand forecasting, pricing optimization
 * Location: lib/ai/recommendation/date/DateRecommender.ts
 * Purpose: Recommend best dates/times based on availability, pricing, and user preferences
 * Algorithms: Temporal pattern analysis, demand prediction, price optimization
 */

import { BaseRecommendationEngine } from '../shared/BaseRecommender';
import {
  DateRecommendation,
  DateRecommendationContext,
  RecommendationRequest,
  RecommendationResponse,
  UserProfile,
} from '../shared/types';

export class DateRecommender extends BaseRecommendationEngine {
  getItemType(): string {
    return 'date';
  }

  getAlgorithmName(): string {
    return 'Date Recommendation Engine';
  }

  getDefaultContext(): DateRecommendationContext {
    return {
      property_id: '',
      preferred_month: new Date().getMonth() + 1,
      preferred_day_of_week: [],
      party_size: 2,
      stay_duration: 2,
      budget_range: [0, 10000],
      flexibility_days: 7,
    };
  }

  validateContext(context: any): boolean {
    return !!(
      context.property_id &&
      context.party_size &&
      context.party_size > 0 &&
      context.stay_duration &&
      context.stay_duration > 0
    );
  }

  // ============================================================================
  // DATE-SPECIFIC RECOMMENDATION ALGORITHMS
  // ============================================================================

  protected async getContentBasedRecommendations(
    userProfile: UserProfile,
    request: RecommendationRequest
  ): Promise<DateRecommendation[]> {
    const context = request.context as DateRecommendationContext;
    const recommendations: DateRecommendation[] = [];

    try {
      // Generate potential date ranges based on context
      const potentialDates = await this.generatePotentialDateRanges(context);

      for (const dateRange of potentialDates) {
        const score = this.calculateDateContentScore(
          dateRange,
          userProfile,
          context
        );
        const confidence = this.calculateDateConfidence(dateRange, context);

        if (score > 0 && confidence >= this.config.thresholds.min_confidence) {
          const pricing = await this.getDatePricing(dateRange, context);

          recommendations.push({
            item_id: `${dateRange.checkIn.toISOString()}_${dateRange.checkOut.toISOString()}`,
            item_type: 'date',
            score,
            confidence,
            reasons: this.generateDateReasons(
              dateRange,
              userProfile,
              context,
              pricing
            ),
            metadata: {
              check_in_date: dateRange.checkIn,
              check_out_date: dateRange.checkOut,
              total_price: pricing.totalPrice,
              discount_percentage: pricing.discount,
              availability_score: dateRange.availability,
              demand_level: dateRange.demandLevel,
            },
          });
        }
      }

      return recommendations.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Error in content-based date recommendations:', error);
      return [];
    }
  }

  protected applyBusinessRules(
    recommendations: DateRecommendation[],
    context: DateRecommendationContext
  ): DateRecommendation[] {
    return recommendations.filter((rec) => {
      // Apply confidence threshold
      if (rec.confidence < this.config.thresholds.min_confidence) {
        return false;
      }

      // Check budget constraints
      if (context.budget_range) {
        const totalPrice = rec.metadata.total_price;
        if (
          totalPrice < context.budget_range[0] ||
          totalPrice > context.budget_range[1]
        ) {
          return false;
        }
      }

      // Check availability
      if (rec.metadata.availability_score < 0.5) {
        return false;
      }

      // Apply temporal preferences
      const checkInDay = rec.metadata.check_in_date.getDay();
      const preferredDays = context.preferred_day_of_week || [];

      if (
        preferredDays.length > 0 &&
        !preferredDays.includes(this.getDayName(checkInDay))
      ) {
        rec.score *= 0.8; // Reduce score but don't eliminate
      }

      return true;
    });
  }

  // ============================================================================
  // DATE-SPECIFIC HELPER METHODS
  // ============================================================================

  private async generatePotentialDateRanges(
    context: DateRecommendationContext
  ): Promise<
    Array<{
      checkIn: Date;
      checkOut: Date;
      availability: number;
      demandLevel: 'low' | 'medium' | 'high';
    }>
  > {
    const dateRanges: Array<{
      checkIn: Date;
      checkOut: Date;
      availability: number;
      demandLevel: 'low' | 'medium' | 'high';
    }> = [];

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (context.flexibility_days || 30));

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const checkIn = new Date(date);
      const checkOut = new Date(date);
      checkOut.setDate(checkOut.getDate() + context.stay_duration);

      // Skip if checkout goes beyond our search range
      if (checkOut > endDate) continue;

      const availability = await this.checkDateAvailability(
        checkIn,
        checkOut,
        context
      );
      const demandLevel = this.calculateDemandLevel(checkIn, context);

      dateRanges.push({
        checkIn,
        checkOut,
        availability,
        demandLevel,
      });
    }

    return dateRanges;
  }

  private async checkDateAvailability(
    checkIn: Date,
    checkOut: Date,
    context: DateRecommendationContext
  ): Promise<number> {
    try {
      const { RoomService } = await import(
        '../../../services/database/rooms/RoomService'
      );

      // Get rooms for the property
      const rooms = await RoomService.getPropertyRooms(context.property_id, {
        minOccupancy: context.party_size,
      });

      if (rooms.length === 0) {
        return 0; // No rooms available for party size
      }

      // Check availability for each room
      const availabilityChecks = await Promise.all(
        rooms.map((room: any) =>
          RoomService.checkRoomAvailability(room.id, checkIn, checkOut)
        )
      );

      // Calculate overall availability as percentage of available rooms
      const availableRooms = availabilityChecks.filter(
        (available) => available
      ).length;
      const availability = availableRooms / rooms.length;

      return Math.max(0, Math.min(1, availability));
    } catch (error) {
      console.error('Error checking date availability:', error);
      return 0.5; // Default medium availability
    }
  }

  private calculateDemandLevel(
    checkIn: Date,
    context: DateRecommendationContext
  ): 'low' | 'medium' | 'high' {
    const dayOfWeek = checkIn.getDay();
    const month = checkIn.getMonth();

    // High demand: Weekends, holidays, summer
    if ((dayOfWeek === 0 || dayOfWeek === 6) && month >= 5 && month <= 8) {
      return 'high';
    }

    // Medium demand: Weekends or summer
    if (dayOfWeek === 0 || dayOfWeek === 6 || (month >= 5 && month <= 8)) {
      return 'medium';
    }

    // Low demand: Weekdays, off-season
    return 'low';
  }

  private calculateDateContentScore(
    dateRange: any,
    userProfile: UserProfile,
    context: DateRecommendationContext
  ): number {
    let score = 0;

    // Availability scoring
    score += dateRange.availability * 0.3;

    // Demand-based scoring (lower demand might be better for availability)
    const demandMultiplier =
      dateRange.demandLevel === 'low'
        ? 1.0
        : dateRange.demandLevel === 'medium'
          ? 0.8
          : 0.6;
    score += demandMultiplier * 0.2;

    // Temporal preferences
    const checkInDay = dateRange.checkIn.getDay();
    const preferredDays = context.preferred_day_of_week || [];

    if (preferredDays.length > 0) {
      const dayName = this.getDayName(checkInDay);
      if (preferredDays.includes(dayName)) {
        score += 0.2;
      }
    } else {
      score += 0.1; // Neutral if no preference
    }

    // Seasonal preference based on user behavior
    const month = dateRange.checkIn.getMonth();
    const preferredMonths = this.extractPreferredMonths(userProfile);
    if (preferredMonths.includes(month)) {
      score += 0.2;
    }

    // Lead time preference
    const leadTime = Math.floor(
      (dateRange.checkIn.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    const preferredLeadTime = userProfile.behavior_patterns.booking_lead_time;

    if (Math.abs(leadTime - preferredLeadTime) <= 7) {
      // Within a week of preferred
      score += 0.1;
    }

    return Math.min(score, 1);
  }

  private calculateDateConfidence(
    dateRange: any,
    context: DateRecommendationContext
  ): number {
    let confidence = 0.6; // Base confidence

    // Higher confidence for better availability
    confidence += dateRange.availability * 0.3;

    // Higher confidence for preferred dates
    const checkInDay = dateRange.checkIn.getDay();
    const preferredDays = context.preferred_day_of_week || [];

    if (
      preferredDays.length > 0 &&
      preferredDays.includes(this.getDayName(checkInDay))
    ) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1);
  }

  private generateDateReasons(
    dateRange: any,
    userProfile: UserProfile,
    context: DateRecommendationContext,
    pricing: any
  ): string[] {
    const reasons: string[] = [];

    if (dateRange.availability > 0.8) {
      reasons.push('High availability for your preferred dates');
    }

    const checkInDay = dateRange.checkIn.getDay();
    const dayName = this.getDayName(checkInDay);
    const preferredDays = context.preferred_day_of_week || [];

    if (preferredDays.includes(dayName)) {
      reasons.push(`Falls on your preferred ${dayName}`);
    }

    if (pricing.discount && pricing.discount > 0) {
      reasons.push(`${pricing.discount}% discount available`);
    }

    if (dateRange.demandLevel === 'low') {
      reasons.push('Lower demand period - better availability');
    }

    const leadTime = Math.floor(
      (dateRange.checkIn.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (leadTime <= 30) {
      reasons.push('Book soon to secure availability');
    }

    return reasons.length > 0 ? reasons : ['Good availability and pricing'];
  }

  private async getDatePricing(
    dateRange: any,
    context: DateRecommendationContext
  ): Promise<{
    totalPrice: number;
    discount: number;
  }> {
    try {
      // This would calculate pricing based on dates and demand
      const basePricePerNight = 200; // Mock base price
      const nights = Math.ceil(
        (dateRange.checkOut.getTime() - dateRange.checkIn.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      let totalPrice = basePricePerNight * nights * context.party_size;

      // Apply demand multipliers
      if (dateRange.demandLevel === 'high') {
        totalPrice *= 1.3;
      } else if (dateRange.demandLevel === 'medium') {
        totalPrice *= 1.1;
      }

      // Apply discounts for low demand or advance booking
      let discount = 0;
      if (dateRange.demandLevel === 'low') {
        discount = 15;
      }

      const leadTime = Math.floor(
        (dateRange.checkIn.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (leadTime >= 30) {
        discount = Math.max(discount, 10);
      }

      if (discount > 0) {
        totalPrice *= 1 - discount / 100;
      }

      return {
        totalPrice: Math.round(totalPrice),
        discount,
      };
    } catch (error) {
      console.error('Error calculating date pricing:', error);
      return { totalPrice: 0, discount: 0 };
    }
  }

  private getDayName(dayIndex: number): string {
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    return days[dayIndex];
  }

  private extractPreferredMonths(userProfile: UserProfile): number[] {
    // Extract preferred months from booking history
    const months = userProfile.booking_history.map((booking) =>
      booking.timestamp.getMonth()
    );
    const monthCounts: { [key: number]: number } = {};

    months.forEach((month) => {
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });

    // Return months with above-average bookings
    const avgBookings = months.length / 12;
    return Object.entries(monthCounts)
      .filter(([, count]) => count > avgBookings)
      .map(([month]) => parseInt(month));
  }

  // ============================================================================
  // DATE-SPECIFIC PUBLIC METHODS
  // ============================================================================

  /**
   * Get date recommendations with enhanced context
   */
  async getDateRecommendations(
    userId: string,
    context: DateRecommendationContext,
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
   * Find optimal dates for booking
   */
  async findOptimalDates(
    userId: string,
    context: DateRecommendationContext
  ): Promise<DateRecommendation | null> {
    const response = await this.getDateRecommendations(userId, context, 1);

    if (response.recommendations.length > 0) {
      return response.recommendations[0] as DateRecommendation;
    }

    return null;
  }

  /**
   * Get price trends for date ranges
   */
  async getPriceTrends(
    propertyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Array<{ date: Date; price: number; availability: number }>> {
    try {
      // This would query historical pricing data
      // For now, return mock trend data
      const trends = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const availability = await this.checkDateAvailability(
          currentDate,
          new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
          {
            property_id: propertyId,
            party_size: 2,
            stay_duration: 1,
          }
        );

        trends.push({
          date: new Date(currentDate),
          price: Math.round(200 * (1 + (1 - availability) * 0.5)), // Higher price when less available
          availability,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return trends;
    } catch (error) {
      console.error('Error getting price trends:', error);
      return [];
    }
  }
}
