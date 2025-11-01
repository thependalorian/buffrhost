/**
 * Base Recommendation Engine
 *
 * Core recommendation algorithms and shared functionality
 * All specialized recommenders inherit from this base class
 * Location: lib/ai/recommendation/shared/BaseRecommender.ts
 * Purpose: Provide common recommendation algorithms and data management
 */

import {
  UserProfile,
  BookingHistory,
  UserItemMatrix,
  SimilarityMatrix,
  AlgorithmConfig,
  Recommendation,
  RecommendationRequest,
  RecommendationResponse,
  BaseRecommender,
} from './types';

export abstract class BaseRecommendationEngine implements BaseRecommender {
  protected userItemMatrix: UserItemMatrix = {};
  protected userProfiles: Map<string, UserProfile> = new Map();
  protected similarityCache: Map<string, SimilarityMatrix> = new Map();

  // Configuration
  protected readonly config: AlgorithmConfig = {
    weights: {
      collaborative: 0.4,
      content_based: 0.3,
      popularity: 0.2,
      temporal: 0.1,
    },
    thresholds: {
      min_similarity: 0.1,
      min_confidence: 0.3,
      max_recommendations: 50,
    },
    cache: {
      ttl_ms: 3600000, // 1 hour
      max_size: 10000,
    },
  };

  // Abstract methods that specialized recommenders must implement
  abstract getItemType(): string;
  abstract getAlgorithmName(): string;
  abstract validateContext(context: any): boolean;
  abstract getDefaultContext(): any;

  async initialize(): Promise<void> {
    try {
      await this.loadUserProfiles();
      await this.buildUserItemMatrix();
      console.log(`${this.getAlgorithmName()} initialized successfully`);
    } catch (error) {
      console.error(`Failed to initialize ${this.getAlgorithmName()}:`, error);
      throw error;
    }
  }

  async generateRecommendations(
    request: RecommendationRequest
  ): Promise<RecommendationResponse> {
    try {
      const userProfile = await this.getUserProfile(request.user_id);
      if (!userProfile) {
        throw new Error(`User profile not found for user: ${request.user_id}`);
      }

      // Validate context
      const context = { ...this.getDefaultContext(), ...request.context };
      if (!this.validateContext(context)) {
        throw new Error(
          `Invalid context for ${this.getItemType()} recommendations`
        );
      }

      // Run recommendation algorithms in parallel
      const [collaborativeRecs, contentBasedRecs, popularityRecs] =
        await Promise.all([
          this.getCollaborativeFilteringRecommendations(userProfile, request),
          this.getContentBasedRecommendations(userProfile, request),
          this.getPopularityBasedRecommendations(request),
        ]);

      // Combine and rank recommendations
      const hybridRecommendations = this.combineRecommendations(
        collaborativeRecs,
        contentBasedRecs,
        popularityRecs,
        userProfile
      );

      // Apply business rules and filters
      const filteredRecommendations = this.applyBusinessRules(
        hybridRecommendations,
        context
      );

      // Limit results
      const finalRecommendations = filteredRecommendations.slice(
        0,
        request.limit || 10
      );

      return {
        recommendations: finalRecommendations,
        total_count: finalRecommendations.length,
        confidence_threshold: this.config.thresholds.min_confidence,
        algorithm_used: `hybrid_${this.getItemType()}`,
        generated_at: new Date(),
        user_segment: this.determineUserSegment(userProfile),
      };
    } catch (error) {
      console.error(
        `Error generating ${this.getItemType()} recommendations:`,
        error
      );
      return {
        recommendations: [],
        total_count: 0,
        confidence_threshold: 0.0,
        algorithm_used: 'error',
        generated_at: new Date(),
      };
    }
  }

  async updateUserPreferences(
    userId: string,
    preferences: string[]
  ): Promise<void> {
    const profile = this.userProfiles.get(userId);
    if (profile) {
      profile.preferences = preferences;
      this.userProfiles.set(userId, profile);
      // Clear similarity cache for this user
      this.similarityCache.delete(userId);
    }
  }

  async addUserInteraction(
    userId: string,
    itemId: string,
    interactionType: 'rating' | 'booking' | 'view',
    value: number
  ): Promise<void> {
    // Update user-item matrix
    if (!this.userItemMatrix[userId]) {
      this.userItemMatrix[userId] = {};
    }
    this.userItemMatrix[userId][itemId] = value;

    // Update user profile with booking history
    const profile = this.userProfiles.get(userId);
    if (profile) {
      profile.booking_history.push({
        property_id: itemId,
        service_type: this.getItemType(),
        rating: value,
        timestamp: new Date(),
        amount_spent: value * 100, // Mock calculation
        duration: 1,
      });

      // Clear cache for updated user
      this.similarityCache.delete(userId);
    }
  }

  // ============================================================================
  // COLLABORATIVE FILTERING
  // ============================================================================

  private async getCollaborativeFilteringRecommendations(
    userProfile: UserProfile,
    request: RecommendationRequest
  ): Promise<Recommendation[]> {
    const similarUsers = this.findSimilarUsers(userProfile.user_id);
    const recommendations: Map<string, { score: number; count: number }> =
      new Map();

    for (const similarUserId of similarUsers) {
      const similarUserRatings = this.userItemMatrix[similarUserId] || {};
      const similarity = this.calculateUserSimilarity(
        userProfile.user_id,
        similarUserId
      );

      for (const [itemId, rating] of Object.entries(similarUserRatings)) {
        // Only recommend items the user hasn't rated
        if (!this.userItemMatrix[userProfile.user_id]?.[itemId]) {
          const weightedScore = rating * similarity;
          const existing = recommendations.get(itemId) || {
            score: 0,
            count: 0,
          };
          recommendations.set(itemId, {
            score: existing.score + weightedScore,
            count: existing.count + 1,
          });
        }
      }
    }

    return Array.from(recommendations.entries())
      .map(([itemId, { score, count }]) => ({
        item_id: itemId,
        item_type: this.getItemType() as any,
        score: score / count,
        confidence: Math.min(count / 10, 1), // Higher confidence with more ratings
        reasons: [`Recommended by ${count} similar users`],
      }))
      .filter((rec) => rec.score >= this.config.thresholds.min_confidence)
      .sort((a, b) => b.score - a.score);
  }

  // ============================================================================
  // CONTENT-BASED FILTERING
  // ============================================================================

  protected async getContentBasedRecommendations(
    userProfile: UserProfile,
    request: RecommendationRequest
  ): Promise<Recommendation[]> {
    const userPreferences = userProfile.preferences;
    const recommendations: Recommendation[] = [];

    // This would be implemented by specialized recommenders
    // based on their specific item features
    return recommendations;
  }

  // ============================================================================
  // POPULARITY-BASED RECOMMENDATIONS
  // ============================================================================

  private async getPopularityBasedRecommendations(
    request: RecommendationRequest
  ): Promise<Recommendation[]> {
    const popularItems = await this.getPopularItems();
    const recommendations: Recommendation[] = [];

    for (const [itemId, popularity] of Object.entries(popularItems)) {
      // Skip if user has already interacted with this item
      if (this.userItemMatrix[request.user_id]?.[itemId]) {
        continue;
      }

      recommendations.push({
        item_id: itemId,
        item_type: this.getItemType() as any,
        score: popularity * 0.8, // Slightly lower weight for popularity
        confidence: Math.min(popularity / 10, 0.8),
        reasons: ['Popular choice among users'],
      });
    }

    return recommendations
      .filter((rec) => rec.score >= this.config.thresholds.min_confidence)
      .sort((a, b) => b.score - a.score);
  }

  // ============================================================================
  // SIMILARITY CALCULATIONS
  // ============================================================================

  private findSimilarUsers(userId: string): string[] {
    const similarities: Array<{ userId: string; similarity: number }> = [];

    for (const otherUserId of Array.from(this.userProfiles.keys())) {
      if (otherUserId === userId) continue;

      const similarity = this.calculateUserSimilarity(userId, otherUserId);
      if (similarity >= this.config.thresholds.min_similarity) {
        similarities.push({ userId: otherUserId, similarity });
      }
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 20) // Top 20 similar users
      .map((s) => s.userId);
  }

  private calculateUserSimilarity(userId1: string, userId2: string): number {
    const ratings1 = this.userItemMatrix[userId1] || {};
    const ratings2 = this.userItemMatrix[userId2] || {};

    const commonItems = Object.keys(ratings1).filter(
      (itemId) => ratings2[itemId]
    );

    if (commonItems.length === 0) return 0;

    let numerator = 0;
    let sum1Squared = 0;
    let sum2Squared = 0;

    for (const itemId of commonItems) {
      const rating1 = ratings1[itemId];
      const rating2 = ratings2[itemId];

      numerator += rating1 * rating2;
      sum1Squared += rating1 * rating1;
      sum2Squared += rating2 * rating2;
    }

    const denominator = Math.sqrt(sum1Squared) * Math.sqrt(sum2Squared);
    return denominator === 0 ? 0 : numerator / denominator;
  }

  // ============================================================================
  // RECOMMENDATION COMBINATION
  // ============================================================================

  private combineRecommendations(
    collaborative: Recommendation[],
    contentBased: Recommendation[],
    popularity: Recommendation[],
    userProfile: UserProfile
  ): Recommendation[] {
    const combined = new Map<string, Recommendation>();

    // Helper function to add recommendations with weights
    const addRecommendations = (
      recommendations: Recommendation[],
      weight: number
    ) => {
      for (const rec of recommendations) {
        const existing = combined.get(rec.item_id);
        if (existing) {
          existing.score = existing.score * (1 - weight) + rec.score * weight;
          existing.confidence = Math.max(existing.confidence, rec.confidence);
          existing.reasons.push(...rec.reasons);
        } else {
          combined.set(rec.item_id, {
            ...rec,
            score: rec.score * weight,
          });
        }
      }
    };

    // Add recommendations with their respective weights
    addRecommendations(collaborative, this.config.weights.collaborative);
    addRecommendations(contentBased, this.config.weights.content_based);
    addRecommendations(popularity, this.config.weights.popularity);

    return Array.from(combined.values())
      .filter((rec) => rec.confidence >= this.config.thresholds.min_confidence)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.config.thresholds.max_recommendations);
  }

  // ============================================================================
  // BUSINESS RULES AND FILTERING
  // ============================================================================

  protected applyBusinessRules(
    recommendations: Recommendation[],
    context: any
  ): Recommendation[] {
    // Default implementation - specialized recommenders can override
    return recommendations.filter((rec) => {
      // Apply confidence threshold
      if (rec.confidence < this.config.thresholds.min_confidence) {
        return false;
      }

      // Apply score threshold
      if (rec.score < 0.1) {
        return false;
      }

      return true;
    });
  }

  // ============================================================================
  // USER SEGMENTATION
  // ============================================================================

  private determineUserSegment(userProfile: UserProfile): string {
    const { demographics, behavior_patterns, booking_history } = userProfile;

    // Determine segment based on spending and preferences
    if (
      behavior_patterns.spending_pattern === 'luxury' ||
      demographics.income === 'high'
    ) {
      return 'premium';
    }

    if (booking_history.length > 10) {
      return 'frequent';
    }

    if (demographics.travel_frequency === 'frequent') {
      return 'business';
    }

    return 'casual';
  }

  // ============================================================================
  // DATA LOADING AND CACHING
  // ============================================================================

  private async loadUserProfiles(): Promise<void> {
    try {
      // Load user profiles from database - this would be property-specific
      // For now, initialize with empty data as this requires property context
      console.log('Loading user profiles...');
    } catch (error) {
      console.error('Failed to load user profiles:', error);
      throw error;
    }
  }

  private async buildUserItemMatrix(): Promise<void> {
    try {
      // Build user-item matrix from booking history - this would be property-specific
      // For now, initialize as empty as this requires property context
      console.log('Building user-item matrix...');
    } catch (error) {
      console.error('Failed to build user-item matrix:', error);
      throw error;
    }
  }

  private async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.userProfiles.get(userId) || null;
  }

  private async getPopularItems(): Promise<Record<string, number>> {
    try {
      // Get popular items based on recommender type
      const itemType = this.getItemType();

      switch (itemType) {
        case 'room':
          return this.getPopularRooms();
        case 'service':
          return this.getPopularServices();
        case 'date':
          return this.getPopularDatePatterns();
        default:
          return {};
      }
    } catch (error) {
      console.error('Error getting popular items:', error);
      return {};
    }
  }

  private async getPopularRooms(): Promise<Record<string, number>> {
    try {
      // This would query booking data to find most popular rooms
      // For now, return empty as this requires complex aggregation queries
      return {};
    } catch (error) {
      console.error('Error getting popular rooms:', error);
      return {};
    }
  }

  private async getPopularServices(): Promise<Record<string, number>> {
    try {
      // This would query service booking data
      // For now, return empty as this requires complex aggregation queries
      return {};
    } catch (error) {
      console.error('Error getting popular services:', error);
      return {};
    }
  }

  private async getPopularDatePatterns(): Promise<Record<string, number>> {
    try {
      // This would analyze booking patterns by date
      // For now, return empty as this requires complex date analysis
      return {};
    } catch (error) {
      console.error('Error getting popular date patterns:', error);
      return {};
    }
  }
}
