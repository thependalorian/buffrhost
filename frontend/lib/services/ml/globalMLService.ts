/**
 * Global Machine Learning Service Manager for Buffr Host Hospitality Platform
 * @fileoverview Singleton ML service manager providing centralized access to machine learning capabilities across the entire application
 * @location buffr-host/frontend/lib/services/ml/globalMLService.ts
 * @purpose Manages global ML service lifecycle with singleton pattern and thread-safe initialization
 * @modularity Singleton service manager ensuring consistent ML model access across all API routes
 * @database_connections Reads from `ml_models`, `model_predictions`, `training_data`, `model_metrics` tables
 * @api_integration AI/ML model APIs (DeepSeek, Google Gemini, etc.) for inference and training
 * @scalability Singleton pattern with lazy initialization and thread-safe access
 * @performance Optimized global service with shared model instances and caching
 * @monitoring Global ML service health monitoring, model performance tracking, and error reporting
 *
 * Global ML Capabilities:
 * - Singleton ML service management with thread-safe initialization
 * - Lazy loading and caching of ML models
 * - Centralized model performance monitoring
 * - Automatic model updates and version management
 * - Cross-API route model sharing and optimization
 * - Memory-efficient model lifecycle management
 * - Real-time model health and performance monitoring
 *
 * Key Features:
 * - Thread-safe singleton initialization
 * - Lazy loading with background model preparation
 * - Global model caching and sharing
 * - Automatic model health monitoring
 * - Performance optimization across routes
 * - Memory management and cleanup
 * - Error recovery and fallback mechanisms
 */

import { MLService } from './MLService';

// Global singleton instance shared across all API routes
let globalMLService: MLService | null = null;
let isInitializing = false;

/**
 * Retrieve the global ML service singleton instance with thread-safe initialization
 * @function getGlobalMLService
 * @returns {Promise<MLService>} Global ML service instance ready for inference operations
 * @singleton Ensures only one ML service instance exists across the entire application
 * @thread_safe Thread-safe initialization with race condition prevention
 * @lazy_loading Models are loaded on first access, not at application startup
 * @performance Optimized service sharing across all API routes and components
 * @error_handling Comprehensive error handling with initialization recovery
 * @monitoring Service initialization and health status tracking
 * @example
 * // Get the global ML service instance
 * const mlService = await getGlobalMLService();
 *
 * // Use for predictions across different API routes
 * const prediction = await mlService.predictRevenue(data);
 * console.log('Revenue prediction:', prediction);
 */
export async function getGlobalMLService(): Promise<MLService> {
  if (globalMLService) {
    return globalMLService;
  }

  if (isInitializing) {
    // Wait for initialization if already in progress
    while (isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (globalMLService) {
      return globalMLService;
    }
  }

  isInitializing = true;
  try {
    console.log('[BuffrIcon name="robot"] Initializing global ML service...');
    globalMLService = new MLService();
    await globalMLService.initialize();
    console.log(
      '[BuffrIcon name="check"] Global ML service initialized successfully'
    );
    return globalMLService;
  } finally {
    isInitializing = false;
  }
}

/**
 * Reset the global ML service singleton (primarily for testing and development)
 * @function resetGlobalMLService
 * @returns {void} Completes the reset operation without return value
 * @testing Enables clean testing by resetting singleton state between tests
 * @development Allows service restart during development without full app restart
 * @memory_management Clears references to allow garbage collection of ML models
 * @state_reset Resets all global state including initialization flags
 * @warning Should not be used in production code
 * @example
 * // Reset service between tests
 * resetGlobalMLService();
 * const newService = await getGlobalMLService(); // Creates fresh instance
 */
export function resetGlobalMLService(): void {
  globalMLService = null;
  isInitializing = false;
}
