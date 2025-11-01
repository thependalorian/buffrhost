/**
 * Modular Analytics Engine
 *
 * Centralized exports for all analytics modules
 * Location: lib/ai/analytics/index.ts
 * Purpose: Provide clean imports for analytics functionality
 * Organization: Groups specialized analytics by business domain
 * Scalability: Easy to add new analytics modules and maintain imports
 * Consistency: Single entry point for all analytics operations
 */

// Export shared types and base classes
export * from './shared/types';
export * from './shared/BaseAnalytics';

// Export specialized analytics modules
export * from './revenue/RevenueAnalytics';
export * from './customer/CustomerAnalytics';
export * from './operational/OperationalAnalytics';

// Export legacy compatibility (for migration)
export { AdvancedAnalyticsSystem as LegacyAdvancedAnalytics } from '../advanced-analytics';

// Create singleton instances for easy access
import { RevenueAnalytics } from './revenue/RevenueAnalytics';
import { CustomerAnalytics } from './customer/CustomerAnalytics';
import { OperationalAnalytics } from './operational/OperationalAnalytics';

// Initialize and export singleton instances
export const revenueAnalytics = new RevenueAnalytics();
export const customerAnalytics = new CustomerAnalytics();
export const operationalAnalytics = new OperationalAnalytics();

// Initialize all analytics engines
Promise.all([
  revenueAnalytics.initialize(),
  customerAnalytics.initialize(),
  operationalAnalytics.initialize(),
])
  .then(() => {
    console.log('All analytics engines initialized successfully');
  })
  .catch((error) => {
    console.error('Failed to initialize analytics engines:', error);
  });
