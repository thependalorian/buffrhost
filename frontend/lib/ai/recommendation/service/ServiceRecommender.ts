/**
 * Service Recommendation Engine
 *
 * Specialized recommender for property services (spa, dining, activities, etc.)
 * Features: Service matching, availability checking, preference-based recommendations
 * Location: lib/ai/recommendation/service/ServiceRecommender.ts
 * Purpose: Recommend optimal services based on user preferences and stay context
 * Algorithms: Content-based filtering, collaborative filtering, contextual matching
 */

import { BaseRecommendationEngine } from '../shared/BaseRecommender';
import {
  ServiceRecommendation,
  ServiceRecommendationContext,
  RecommendationRequest,
  RecommendationResponse,
  UserProfile,
} from '../shared/types';

export class ServiceRecommender extends BaseRecommendationEngine {
  getItemType(): string {
    return 'service';
  }

  getAlgorithmName(): string {
    return 'Service Recommendation Engine';
  }

  getDefaultContext(): ServiceRecommendationContext {
    return {
      property_id: '',
      guest_preferences: [],
      budget_range: [0, 500],
      party_size: 2,
      dietary_restrictions: [],
      special_occasions: [],
    };
  }

  validateContext(context: any): boolean {
    return !!(
      context.property_id &&
      context.party_size &&
      context.party_size > 0
    );
  }

  // ============================================================================
  // SERVICE-SPECIFIC RECOMMENDATION ALGORITHMS
  // ============================================================================

  protected async getContentBasedRecommendations(
    userProfile: UserProfile,
    request: RecommendationRequest
  ): Promise<ServiceRecommendation[]> {
    const context = request.context as ServiceRecommendationContext;
    const recommendations: ServiceRecommendation[] = [];

    try {
      // Get available services for the property
      const availableServices = await this.getAvailableServices(context);

      for (const service of availableServices) {
        const score = this.calculateServiceContentScore(
          service,
          userProfile,
          context
        );
        const confidence = this.calculateServiceConfidence(service, context);

        if (score > 0 && confidence >= this.config.thresholds.min_confidence) {
          recommendations.push({
            item_id: service.id,
            item_type: 'service',
            score,
            confidence,
            reasons: this.generateServiceReasons(service, userProfile, context),
            metadata: {
              service_name: service.name,
              service_type: service.type,
              price: service.price,
              duration_minutes: service.duration,
              capacity: service.capacity,
              dietary_info: service.dietaryInfo,
              allergens: service.allergens,
              preparation_time: service.preparationTime,
            },
          });
        }
      }

      return recommendations.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Error in content-based service recommendations:', error);
      return [];
    }
  }

  protected applyBusinessRules(
    recommendations: ServiceRecommendation[],
    context: ServiceRecommendationContext
  ): ServiceRecommendation[] {
    return recommendations.filter((rec) => {
      // Apply confidence threshold
      if (rec.confidence < this.config.thresholds.min_confidence) {
        return false;
      }

      // Check budget constraints
      if (context.budget_range) {
        const price = rec.metadata.price;
        if (
          price < context.budget_range[0] ||
          price > context.budget_range[1]
        ) {
          return false;
        }
      }

      // Check capacity for group services
      if (rec.metadata.capacity && rec.metadata.capacity < context.party_size) {
        return false;
      }

      // Apply dietary restrictions
      if (
        context.dietary_restrictions &&
        context.dietary_restrictions.length > 0
      ) {
        const hasRestrictions = rec.metadata.dietary_info?.some((diet) =>
          context.dietary_restrictions!.includes(diet)
        );
        if (!hasRestrictions && rec.metadata.service_type === 'dining') {
          return false;
        }
      }

      // Apply allergen filtering
      if (
        context.dietary_restrictions &&
        context.dietary_restrictions.length > 0
      ) {
        const hasAllergens = rec.metadata.allergens?.some((allergen) =>
          context.dietary_restrictions!.includes(allergen)
        );
        if (hasAllergens) {
          return false;
        }
      }

      return true;
    });
  }

  // ============================================================================
  // SERVICE-SPECIFIC HELPER METHODS
  // ============================================================================

  private async getAvailableServices(
    context: ServiceRecommendationContext
  ): Promise<any[]> {
    try {
      const { ServiceManager } = await import(
        '../../../services/database/services/ServiceManager'
      );

      // Get services from database
      const services = await ServiceManager.getPropertyServices(
        context.property_id,
        {
          isAvailable: true,
        }
      );

      // Enrich services with additional data for recommendations
      const enrichedServices = services.map((service: any) => ({
        id: service.id,
        name: service.service_name || service.name,
        type: service.service_type || service.type,
        price: service.price,
        duration: service.duration_minutes || service.duration,
        capacity: service.max_capacity || service.capacity,
        dietaryInfo: [], // Would need to be stored in service metadata
        allergens: [], // Would need to be stored in service metadata
        preparationTime: 0, // Would need to be calculated or stored
        features: [], // Would need to be stored in service metadata
        description: service.description,
        requiresBooking: service.booking_required || service.requires_booking,
      }));

      return enrichedServices;
    } catch (error) {
      console.error('Error fetching available services:', error);
      return [];
    }
  }

  private calculateServiceContentScore(
    service: any,
    userProfile: UserProfile,
    context: ServiceRecommendationContext
  ): number {
    let score = 0;

    // Service type preference matching
    const preferredServices =
      context.guest_preferences ||
      userProfile.behavior_patterns.preferred_services;
    if (preferredServices.includes(service.type)) {
      score += 0.25;
    }

    // Special occasion matching
    if (context.special_occasions && context.special_occasions.length > 0) {
      const occasionMatches = context.special_occasions.filter((occasion) =>
        this.isServiceSuitableForOccasion(service, occasion)
      );
      score +=
        (occasionMatches.length / context.special_occasions.length) * 0.2;
    }

    // Capacity matching
    if (service.capacity >= context.party_size) {
      score += 0.15;
    }

    // Dietary compatibility
    if (
      context.dietary_restrictions &&
      context.dietary_restrictions.length > 0
    ) {
      if (service.type === 'dining') {
        const compatibleOptions = service.dietaryInfo?.filter((diet) =>
          context.dietary_restrictions!.includes(diet)
        );
        score += (compatibleOptions?.length || 0) > 0 ? 0.15 : -0.3; // Penalty for incompatible dining
      }
    }

    // Price optimization based on user spending pattern
    const priceScore = this.calculateServicePriceScore(
      service.price,
      userProfile
    );
    score += priceScore * 0.25;

    return Math.max(0, Math.min(score, 1));
  }

  private calculateServicePriceScore(
    price: number,
    userProfile: UserProfile
  ): number {
    const { spending_pattern } = userProfile.behavior_patterns;

    switch (spending_pattern) {
      case 'budget':
        return price <= 100 ? 1 : price <= 200 ? 0.7 : 0.3;
      case 'mid-range':
        return price <= 300 && price > 100 ? 1 : price <= 600 ? 0.8 : 0.4;
      case 'luxury':
        return price > 300 ? 1 : price > 150 ? 0.7 : 0.3;
      default:
        return 0.5;
    }
  }

  private calculateServiceConfidence(
    service: any,
    context: ServiceRecommendationContext
  ): number {
    let confidence = 0.6; // Base confidence

    // Higher confidence for exact capacity matches
    if (service.capacity === context.party_size) {
      confidence += 0.15;
    } else if (service.capacity >= context.party_size) {
      confidence += 0.1;
    }

    // Higher confidence for preferred service types
    const preferredServices = context.guest_preferences || [];
    if (preferredServices.includes(service.type)) {
      confidence += 0.15;
    }

    // Higher confidence for services with preparation time consideration
    if (context.stay_dates) {
      const stayDuration = Math.ceil(
        (context.stay_dates[1].getTime() - context.stay_dates[0].getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (stayDuration >= 2) {
        // Multi-day stays can accommodate prepared services
        confidence += 0.1;
      }
    }

    return Math.min(confidence, 1);
  }

  private generateServiceReasons(
    service: any,
    userProfile: UserProfile,
    context: ServiceRecommendationContext
  ): string[] {
    const reasons: string[] = [];

    if (service.capacity >= context.party_size) {
      reasons.push(
        `Suitable for ${context.party_size} ${context.party_size === 1 ? 'person' : 'people'}`
      );
    }

    const preferredServices =
      context.guest_preferences ||
      userProfile.behavior_patterns.preferred_services;
    if (preferredServices.includes(service.type)) {
      reasons.push(`Matches your preference for ${service.type} services`);
    }

    if (context.special_occasions && context.special_occasions.length > 0) {
      const suitableOccasions = context.special_occasions.filter((occasion) =>
        this.isServiceSuitableForOccasion(service, occasion)
      );
      if (suitableOccasions.length > 0) {
        reasons.push(`Perfect for ${suitableOccasions.join(', ')}`);
      }
    }

    if (service.dietaryInfo && service.dietaryInfo.length > 0) {
      reasons.push(`Offers ${service.dietaryInfo.join(', ')} options`);
    }

    if (service.preparationTime && service.preparationTime > 0) {
      reasons.push('Requires advance booking for preparation');
    }

    return reasons.length > 0 ? reasons : ['Popular service choice'];
  }

  private isServiceSuitableForOccasion(
    service: any,
    occasion: string
  ): boolean {
    const occasionMappings: { [key: string]: string[] } = {
      romantic: ['spa', 'dining', 'activity'],
      celebration: ['dining', 'spa', 'activity'],
      relaxation: ['spa', 'activity'],
      adventure: ['activity'],
      business: ['dining', 'spa'],
      family: ['dining', 'activity'],
      anniversary: ['spa', 'dining'],
      birthday: ['dining', 'spa'],
    };

    return occasionMappings[occasion]?.includes(service.type) || false;
  }

  // ============================================================================
  // SERVICE-SPECIFIC PUBLIC METHODS
  // ============================================================================

  /**
   * Get service recommendations with enhanced context
   */
  async getServiceRecommendations(
    userId: string,
    context: ServiceRecommendationContext,
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
   * Find optimal service for specific requirements
   */
  async findOptimalService(
    userId: string,
    context: ServiceRecommendationContext
  ): Promise<ServiceRecommendation | null> {
    const response = await this.getServiceRecommendations(userId, context, 1);

    if (response.recommendations.length > 0) {
      return response.recommendations[0] as ServiceRecommendation;
    }

    return null;
  }

  /**
   * Get services by category
   */
  async getServicesByCategory(
    propertyId: string,
    category: string,
    context?: Partial<ServiceRecommendationContext>
  ): Promise<ServiceRecommendation[]> {
    const fullContext: ServiceRecommendationContext = {
      ...this.getDefaultContext(),
      property_id: propertyId,
      ...context,
    };

    const request: RecommendationRequest = {
      user_id: 'system', // System request for category filtering
      context: fullContext,
      limit: 50,
    };

    const response = await this.generateRecommendations(request);

    // Filter by category after recommendations
    return response.recommendations
      .filter(
        (rec) =>
          (rec as ServiceRecommendation).metadata.service_type === category
      )
      .slice(0, 20) as ServiceRecommendation[];
  }

  /**
   * Get service availability for specific dates
   */
  async getServiceAvailability(
    serviceId: string,
    date: Date,
    partySize: number
  ): Promise<{ available: boolean; nextAvailable?: Date }> {
    try {
      // This would check service availability in the database
      // For now, simulate availability
      const available = Math.random() > 0.3; // 70% availability

      return {
        available,
        nextAvailable: available
          ? undefined
          : new Date(date.getTime() + 60 * 60 * 1000), // Next hour if not available
      };
    } catch (error) {
      console.error('Error checking service availability:', error);
      return { available: false };
    }
  }

  /**
   * Get service booking recommendations for a stay
   */
  async getStayServiceRecommendations(
    userId: string,
    propertyId: string,
    stayDates: [Date, Date],
    partySize: number,
    preferences?: string[]
  ): Promise<ServiceRecommendation[]> {
    const context: ServiceRecommendationContext = {
      property_id: propertyId,
      stay_dates: stayDates,
      guest_preferences: preferences || [],
      party_size: partySize,
      budget_range: [0, 1000],
    };

    const response = await this.getServiceRecommendations(userId, context, 15);
    return response.recommendations as ServiceRecommendation[];
  }
}
