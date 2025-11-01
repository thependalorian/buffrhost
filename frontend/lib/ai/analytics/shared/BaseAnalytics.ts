/**
 * Base Analytics Engine
 *
 * Core analytics functionality and shared methods
 * All specialized analytics inherit from this base class
 * Location: lib/ai/analytics/shared/BaseAnalytics.ts
 * Purpose: Provide common analytics algorithms and data management
 */

import { BaseAnalytics, AnalyticsConfig, TimeSeriesData } from './types';

export abstract class BaseAnalyticsEngine implements BaseAnalytics {
  protected dataCache: Map<string, TimeSeriesData[]> = new Map();
  protected modelCache: Map<string, any> = new Map();

  protected readonly config: AnalyticsConfig = {
    cache: {
      ttl_ms: 3600000, // 1 hour
      max_size: 10000,
    },
    forecasting: {
      min_data_points: 10,
      default_confidence_level: 0.95,
      max_forecast_periods: 365,
    },
    modeling: {
      default_iterations: 1000,
      convergence_threshold: 1e-6,
      regularization_strength: 0.01,
    },
  };

  // Abstract methods that specialized analytics must implement
  abstract getAnalyticsType(): string;
  abstract getAnalyticsName(): string;

  async initialize(): Promise<void> {
    try {
      console.log(`Initializing ${this.getAnalyticsName()}...`);
      await this.initializeCache();
      await this.initializeModels();
      console.log(`${this.getAnalyticsName()} initialized successfully`);
    } catch (error) {
      console.error(`Failed to initialize ${this.getAnalyticsName()}:`, error);
      throw error;
    }
  }

  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    last_updated: Date;
    cache_hit_rate?: number;
    error_rate?: number;
  }> {
    try {
      const cacheSize = this.dataCache.size;
      const modelCount = this.modelCache.size;
      const lastUpdated = new Date();

      // Simple health check based on cache and model status
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

      if (cacheSize === 0 && modelCount === 0) {
        status = 'degraded'; // Not initialized yet
      }

      return {
        status,
        last_updated: lastUpdated,
        cache_hit_rate: 0.85, // Mock cache hit rate - would be calculated in real implementation
        error_rate: 0.02, // Mock error rate
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        last_updated: new Date(),
        error_rate: 1.0,
      };
    }
  }

  // ============================================================================
  // CACHING SYSTEM
  // ============================================================================

  protected async initializeCache(): Promise<void> {
    // Initialize cache cleanup interval
    setInterval(() => {
      this.cleanupExpiredCache();
    }, this.config.cache.ttl_ms / 4); // Cleanup every 15 minutes for 1-hour TTL
  }

  protected cleanupExpiredCache(): void {
    // In a real implementation, this would check timestamps and remove expired entries
    // For now, we'll implement a simple size-based cleanup
    if (this.dataCache.size > this.config.cache.max_size) {
      // Remove oldest entries (simple FIFO)
      const entriesToRemove =
        this.dataCache.size - this.config.cache.max_size + 100;
      const keys = Array.from(this.dataCache.keys()).slice(0, entriesToRemove);

      keys.forEach((key) => {
        this.dataCache.delete(key);
        this.modelCache.delete(key);
      });
    }
  }

  protected getCachedData(key: string): TimeSeriesData[] | null {
    return this.dataCache.get(key) || null;
  }

  protected setCachedData(key: string, data: TimeSeriesData[]): void {
    if (this.dataCache.size >= this.config.cache.max_size) {
      this.cleanupExpiredCache();
    }
    this.dataCache.set(key, data);
  }

  protected getCachedModel(key: string): any {
    return this.modelCache.get(key) || null;
  }

  protected setCachedModel(key: string, model: any): void {
    this.modelCache.set(key, model);
  }

  // ============================================================================
  // MODEL INITIALIZATION
  // ============================================================================

  protected async initializeModels(): Promise<void> {
    // Initialize any required models or configurations
    // This would be overridden by specialized analytics classes
  }

  // ============================================================================
  // STATISTICAL UTILITIES
  // ============================================================================

  protected calculateMean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  protected calculateStandardDeviation(
    values: number[],
    mean?: number
  ): number {
    if (values.length <= 1) return 0;

    const avg = mean ?? this.calculateMean(values);
    const squaredDiffs = values.map((val) => Math.pow(val - avg, 2));
    const variance =
      squaredDiffs.reduce((sum, val) => sum + val, 0) / (values.length - 1);

    return Math.sqrt(variance);
  }

  protected calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
      return sorted[mid];
    }
  }

  protected calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
    const sumY2 = y.reduce((sum, val) => sum + val * val, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  }

  // ============================================================================
  // TIME SERIES UTILITIES
  // ============================================================================

  protected validateTimeSeriesData(data: TimeSeriesData[]): boolean {
    if (data.length < this.config.forecasting.min_data_points) {
      return false;
    }

    // Check for valid timestamps and values
    return data.every(
      (point) =>
        point.timestamp instanceof Date &&
        !isNaN(point.timestamp.getTime()) &&
        typeof point.value === 'number' &&
        !isNaN(point.value) &&
        isFinite(point.value)
    );
  }

  protected sortTimeSeriesData(data: TimeSeriesData[]): TimeSeriesData[] {
    return [...data].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
  }

  protected detectSeasonality(data: TimeSeriesData[]): number {
    // Simple seasonality detection based on autocorrelation
    // This is a simplified implementation - real seasonality detection is more complex
    const values = data.map((d) => d.value);
    const n = values.length;

    if (n < 14) return 0; // Need at least 2 weeks for weekly seasonality

    // Check for weekly seasonality (period 7)
    let maxCorrelation = 0;
    let bestPeriod = 0;

    for (let period = 7; period <= Math.min(30, Math.floor(n / 2)); period++) {
      const correlation = Math.abs(
        this.calculateAutocorrelation(values, period)
      );
      if (correlation > maxCorrelation) {
        maxCorrelation = correlation;
        bestPeriod = period;
      }
    }

    return maxCorrelation > 0.3 ? bestPeriod : 0; // Return period only if correlation is significant
  }

  private calculateAutocorrelation(values: number[], lag: number): number {
    const n = values.length;
    if (lag >= n) return 0;

    const mean = this.calculateMean(values);
    let numerator = 0;
    let denominator1 = 0;
    let denominator2 = 0;

    for (let i = 0; i < n - lag; i++) {
      const diff1 = values[i] - mean;
      const diff2 = values[i + lag] - mean;

      numerator += diff1 * diff2;
      denominator1 += diff1 * diff1;
      denominator2 += diff2 * diff2;
    }

    const denominator = Math.sqrt(denominator1 * denominator2);
    return denominator === 0 ? 0 : numerator / denominator;
  }

  // ============================================================================
  // DATA FETCHING UTILITIES
  // ============================================================================

  protected async fetchRevenueData(
    propertyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<TimeSeriesData[]> {
    try {
      // Use database services to fetch real revenue data
      const { OrderService } = await import(
        '../../../services/database/orders/OrderService'
      );

      // Get daily revenue summary
      const currentDate = new Date(startDate);
      const revenueData: TimeSeriesData[] = [];

      while (currentDate <= endDate) {
        const summary = await OrderService.getDailySalesSummary(
          propertyId,
          currentDate.toISOString().split('T')[0]
        );

        revenueData.push({
          timestamp: new Date(currentDate),
          value: summary.totalRevenue,
          category: 'revenue',
          metadata: {
            total_orders: summary.totalOrders,
            total_guests: summary.totalOrders, // Use orders as proxy for guests
            average_order_value: summary.averageOrderValue,
          },
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return revenueData;
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      return [];
    }
  }

  protected async fetchCustomerData(
    propertyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    try {
      // Use database services to fetch customer data
      const { OrderService } = await import(
        '../../../services/database/orders/OrderService'
      );

      // This would fetch customer metrics from orders and user data
      // For now, return basic structure
      return [];
    } catch (error) {
      console.error('Error fetching customer data:', error);
      return [];
    }
  }

  protected async fetchOperationalData(
    propertyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<TimeSeriesData[]> {
    try {
      // Use database services to fetch operational data
      const { RoomService } = await import(
        '../../../services/database/rooms/RoomService'
      );
      const { OrderService } = await import(
        '../../../services/database/orders/OrderService'
      );

      const operationalData: TimeSeriesData[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const salesSummary = await OrderService.getDailySalesSummary(
          propertyId,
          dateStr
        );

        operationalData.push({
          timestamp: new Date(currentDate),
          value: salesSummary.totalOrders, // Using orders as operational metric
          category: 'operational',
          metadata: {
            occupancy_proxy: salesSummary.totalOrders > 0 ? 0.8 : 0.2, // Mock occupancy
            bookings_count: salesSummary.totalOrders,
            revenue: salesSummary.totalRevenue,
          },
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return operationalData;
    } catch (error) {
      console.error('Error fetching operational data:', error);
      return [];
    }
  }
}
