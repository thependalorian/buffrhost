/**
 * Modular Recommendation Engine
 *
 * Centralized exports for all recommendation modules
 * Location: lib/ai/recommendation/index.ts
 * Purpose: Provide clean imports for recommendation functionality
 * Organization: Groups specialized recommenders by type
 * Scalability: Easy to add new recommenders and maintain imports
 * Consistency: Single entry point for all recommendation operations
 */

// Export shared types and base classes
export * from './shared/types';
export * from './shared/BaseRecommender';

// Export specialized recommenders
export * from './room/RoomRecommender';
export * from './date/DateRecommender';
export * from './service/ServiceRecommender';

// Export legacy compatibility (for migration)
export { recommendationEngine as LegacyRecommendationEngine } from '../recommendation-engine';

// Create singleton instances for easy access
import { RoomRecommender } from './room/RoomRecommender';
import { DateRecommender } from './date/DateRecommender';
import { ServiceRecommender } from './service/ServiceRecommender';

// Initialize and export singleton instances
export const roomRecommender = new RoomRecommender();
export const dateRecommender = new DateRecommender();
export const serviceRecommender = new ServiceRecommender();

// Initialize all recommenders
Promise.all([
  roomRecommender.initialize(),
  dateRecommender.initialize(),
  serviceRecommender.initialize(),
])
  .then(() => {
    console.log('All recommendation engines initialized successfully');
  })
  .catch((error) => {
    console.error('Failed to initialize recommendation engines:', error);
  });
