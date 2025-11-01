/**
 * TypeScript Advanced Analytics System for Buffr Host
 *
 * Comprehensive analytics system providing:
 * - Time series forecasting with ARIMA and exponential smoothing
 * - Cohort analysis and customer lifetime value
 * - Predictive modeling for demand and revenue
 * - Business intelligence dashboards
 * - Statistical analysis and reporting
 *
 * Author: Buffr AI Team (Andrew Ng inspired implementation)
 * Date: 2024
 */

import { apiClient } from '../services/api-client';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  category?: string;
  metadata?: Record<string, any>;
}

export interface ForecastResult {
  timestamp: Date;
  predicted_value: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  confidence_level: number;
}

export interface CohortAnalysis {
  cohort_period: string;
  cohort_size: number;
  retention_rates: number[];
  revenue_per_cohort: number[];
  lifetime_value: number;
}

export interface CustomerLifetimeValue {
  customer_id: string;
  predicted_ltv: number;
  confidence_score: number;
  factors: {
    recency: number;
    frequency: number;
    monetary: number;
    engagement: number;
  };
  recommendations: string[];
}

export interface DemandForecast {
  property_id: string;
  service_type: string;
  forecast_period: string;
  predicted_demand: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  seasonality_factor: number;
  trend_factor: number;
  external_factors: Record<string, number>;
}

export interface RevenuePrediction {
  property_id: string;
  period: string;
  predicted_revenue: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  breakdown: {
    room_revenue: number;
    restaurant_revenue: number;
    spa_revenue: number;
    other_revenue: number;
  };
  growth_rate: number;
}

export interface BusinessIntelligenceMetrics {
  kpis: {
    occupancy_rate: number;
    average_daily_rate: number;
    revenue_per_available_room: number;
    customer_satisfaction: number;
    employee_productivity: number;
  };
  trends: {
    revenue_trend: 'increasing' | 'decreasing' | 'stable';
    occupancy_trend: 'increasing' | 'decreasing' | 'stable';
    customer_satisfaction_trend: 'increasing' | 'decreasing' | 'stable';
  };
  insights: string[];
  recommendations: string[];
}

// =============================================================================
// ADVANCED ANALYTICS SYSTEM CLASS
// =============================================================================

export class AdvancedAnalyticsSystem {
  private dataCache: Map<string, TimeSeriesData[]> = new Map();
  private modelCache: Map<string, any> = new Map();
  private readonly CACHE_TTL = 3600000; // 1 hour

  constructor() {
    this.initializeSystem();
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  private async initializeSystem(): Promise<void> {
    try {
      console.log('Initializing Advanced Analytics System...');
      // Initialize any required models or configurations
      console.log('Advanced Analytics System initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Advanced Analytics System:', error);
    }
  }

  // =============================================================================
  // TIME SERIES FORECASTING
  // =============================================================================

  /**
   * Forecast time series data using multiple algorithms
   */
  async forecastTimeSeries(
    data: TimeSeriesData[],
    periods: number,
    method: 'arima' | 'exponential' | 'linear' | 'seasonal' = 'arima'
  ): Promise<ForecastResult[]> {
    try {
      if (data.length < 10) {
        throw new Error(
          'Insufficient data for forecasting. Need at least 10 data points.'
        );
      }

      const values = data.map((d) => d.value);
      const timestamps = data.map((d) => d.timestamp);

      let forecasts: ForecastResult[] = [];

      switch (method) {
        case 'arima':
          forecasts = this.forecastARIMA(values, timestamps, periods);
          break;
        case 'exponential':
          forecasts = this.forecastExponentialSmoothing(
            values,
            timestamps,
            periods
          );
          break;
        case 'linear':
          forecasts = this.forecastLinearRegression(
            values,
            timestamps,
            periods
          );
          break;
        case 'seasonal':
          forecasts = this.forecastSeasonal(values, timestamps, periods);
          break;
        default:
          throw new Error(`Unknown forecasting method: ${method}`);
      }

      return forecasts;
    } catch (error) {
      console.error('Error in time series forecasting:', error);
      return [];
    }
  }

  /**
   * ARIMA (AutoRegressive Integrated Moving Average) forecasting
   */
  private forecastARIMA(
    values: number[],
    timestamps: Date[],
    periods: number
  ): ForecastResult[] {
    const n = values.length;
    const forecasts: ForecastResult[] = [];

    // Simple ARIMA(1,1,1) implementation
    // In a production system, you'd use a proper ARIMA library
    const alpha = 0.3; // Autoregressive coefficient
    const beta = 0.2; // Moving average coefficient
    const gamma = 0.1; // Integration coefficient

    // Calculate first differences
    const diffValues = this.calculateFirstDifferences(values);

    // Simple ARIMA prediction
    let lastValue = values[n - 1];
    let lastDiff = diffValues[diffValues.length - 1];

    for (let i = 0; i < periods; i++) {
      // ARIMA(1,1,1) formula: y_t = α * y_{t-1} + β * ε_{t-1} + γ * Δy_{t-1}
      const predictedDiff = alpha * lastDiff + beta * 0 + gamma * lastDiff;
      const predictedValue = lastValue + predictedDiff;

      // Calculate confidence interval (simplified)
      const variance = this.calculateVariance(values);
      const confidenceInterval = 1.96 * Math.sqrt(variance * (i + 1));

      forecasts.push({
        timestamp: new Date(
          timestamps[timestamps.length - 1].getTime() +
            (i + 1) * 24 * 60 * 60 * 1000
        ),
        predicted_value: Math.max(0, predictedValue),
        confidence_interval: {
          lower: Math.max(0, predictedValue - confidenceInterval),
          upper: predictedValue + confidenceInterval,
        },
        confidence_level: 0.95,
      });

      lastValue = predictedValue;
      lastDiff = predictedDiff;
    }

    return forecasts;
  }

  /**
   * Exponential Smoothing forecasting
   */
  private forecastExponentialSmoothing(
    values: number[],
    timestamps: Date[],
    periods: number
  ): ForecastResult[] {
    const alpha = 0.3; // Smoothing parameter
    const forecasts: ForecastResult[] = [];

    // Calculate exponential smoothing
    let smoothed = values[0];
    const smoothedValues = [smoothed];

    for (let i = 1; i < values.length; i++) {
      smoothed = alpha * values[i] + (1 - alpha) * smoothed;
      smoothedValues.push(smoothed);
    }

    // Forecast future values
    const trend = this.calculateTrend(smoothedValues);
    const variance = this.calculateVariance(values);

    for (let i = 0; i < periods; i++) {
      const predictedValue = smoothed + trend * (i + 1);
      const confidenceInterval = 1.96 * Math.sqrt(variance * (i + 1));

      forecasts.push({
        timestamp: new Date(
          timestamps[timestamps.length - 1].getTime() +
            (i + 1) * 24 * 60 * 60 * 1000
        ),
        predicted_value: Math.max(0, predictedValue),
        confidence_interval: {
          lower: Math.max(0, predictedValue - confidenceInterval),
          upper: predictedValue + confidenceInterval,
        },
        confidence_level: 0.95,
      });
    }

    return forecasts;
  }

  /**
   * Linear Regression forecasting
   */
  private forecastLinearRegression(
    values: number[],
    timestamps: Date[],
    periods: number
  ): ForecastResult[] {
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);

    // Calculate linear regression coefficients
    const { slope, intercept, rSquared } = this.calculateLinearRegression(
      x,
      values
    );

    const forecasts: ForecastResult[] = [];
    const variance = this.calculateVariance(values);
    const standardError = Math.sqrt(variance * (1 - rSquared));

    for (let i = 0; i < periods; i++) {
      const xValue = n + i;
      const predictedValue = slope * xValue + intercept;
      const confidenceInterval =
        1.96 *
        standardError *
        Math.sqrt(
          1 +
            1 / n +
            Math.pow(xValue - (n - 1) / 2, 2) / this.calculateSumOfSquares(x)
        );

      forecasts.push({
        timestamp: new Date(
          timestamps[timestamps.length - 1].getTime() +
            (i + 1) * 24 * 60 * 60 * 1000
        ),
        predicted_value: Math.max(0, predictedValue),
        confidence_interval: {
          lower: Math.max(0, predictedValue - confidenceInterval),
          upper: predictedValue + confidenceInterval,
        },
        confidence_level: 0.95,
      });
    }

    return forecasts;
  }

  /**
   * Seasonal forecasting with trend and seasonality
   */
  private forecastSeasonal(
    values: number[],
    timestamps: Date[],
    periods: number
  ): ForecastResult[] {
    const seasonalPeriod = 7; // Weekly seasonality
    const forecasts: ForecastResult[] = [];

    // Calculate seasonal indices
    const seasonalIndices = this.calculateSeasonalIndices(
      values,
      seasonalPeriod
    );

    // Calculate trend
    const trend = this.calculateTrend(values);

    // Calculate base level
    const baseLevel = this.calculateBaseLevel(
      values,
      seasonalIndices,
      seasonalPeriod
    );

    const variance = this.calculateVariance(values);

    for (let i = 0; i < periods; i++) {
      const seasonalIndex = seasonalIndices[i % seasonalPeriod];
      const predictedValue =
        (baseLevel + trend * (values.length + i)) * seasonalIndex;
      const confidenceInterval = 1.96 * Math.sqrt(variance * (i + 1));

      forecasts.push({
        timestamp: new Date(
          timestamps[timestamps.length - 1].getTime() +
            (i + 1) * 24 * 60 * 60 * 1000
        ),
        predicted_value: Math.max(0, predictedValue),
        confidence_interval: {
          lower: Math.max(0, predictedValue - confidenceInterval),
          upper: predictedValue + confidenceInterval,
        },
        confidence_level: 0.95,
      });
    }

    return forecasts;
  }

  // =============================================================================
  // COHORT ANALYSIS
  // =============================================================================

  /**
   * Perform cohort analysis on customer data
   */
  async analyzeCohorts(
    customerData: Array<{
      customer_id: string;
      first_purchase_date: Date;
      purchase_dates: Date[];
      purchase_amounts: number[];
    }>,
    cohortPeriod: 'daily' | 'weekly' | 'monthly' = 'monthly'
  ): Promise<CohortAnalysis[]> {
    try {
      const cohorts = this.groupCustomersByCohort(customerData, cohortPeriod);
      const cohortAnalyses: CohortAnalysis[] = [];

      for (const [period, customers] of cohorts.entries()) {
        const cohortSize = customers.length;
        const retentionRates = this.calculateRetentionRates(
          customers,
          cohortPeriod
        );
        const revenuePerCohort = this.calculateRevenuePerCohort(customers);
        const lifetimeValue = this.calculateCohortLifetimeValue(customers);

        cohortAnalyses.push({
          cohort_period: period,
          cohort_size: cohortSize,
          retention_rates: retentionRates,
          revenue_per_cohort: revenuePerCohort,
          lifetime_value: lifetimeValue,
        });
      }

      return cohortAnalyses.sort((a, b) =>
        a.cohort_period.localeCompare(b.cohort_period)
      );
    } catch (error) {
      console.error('Error in cohort analysis:', error);
      return [];
    }
  }

  // =============================================================================
  // CUSTOMER LIFETIME VALUE
  // =============================================================================

  /**
   * Calculate customer lifetime value using RFM analysis
   */
  async calculateCustomerLifetimeValue(
    customerId: string,
    historicalData: {
      purchase_dates: Date[];
      purchase_amounts: number[];
      interactions: Date[];
    }
  ): Promise<CustomerLifetimeValue> {
    try {
      const now = new Date();

      // Calculate RFM metrics
      const recency = this.calculateRecency(historicalData.purchase_dates, now);
      const frequency = historicalData.purchase_dates.length;
      const monetary = historicalData.purchase_amounts.reduce(
        (sum, amount) => sum + amount,
        0
      );
      const engagement = historicalData.interactions.length;

      // Calculate predicted LTV using a simplified model
      const predictedLTV = this.predictLTV(
        recency,
        frequency,
        monetary,
        engagement
      );

      // Calculate confidence score
      const confidenceScore = this.calculateLTVConfidence(
        recency,
        frequency,
        monetary,
        engagement
      );

      // Generate recommendations
      const recommendations = this.generateLTVRecommendations(
        recency,
        frequency,
        monetary,
        engagement
      );

      return {
        customer_id: customerId,
        predicted_ltv: predictedLTV,
        confidence_score: confidenceScore,
        factors: {
          recency,
          frequency,
          monetary,
          engagement,
        },
        recommendations,
      };
    } catch (error) {
      console.error('Error calculating customer lifetime value:', error);
      throw error;
    }
  }

  // =============================================================================
  // DEMAND FORECASTING
  // =============================================================================

  /**
   * Forecast demand for a specific property and service
   */
  async forecastDemand(
    propertyId: string,
    serviceType: string,
    historicalData: TimeSeriesData[],
    externalFactors?: Record<string, number[]>
  ): Promise<DemandForecast> {
    try {
      // Use time series forecasting
      const forecasts = await this.forecastTimeSeries(
        historicalData,
        30,
        'seasonal'
      );

      // Calculate seasonality and trend factors
      const seasonalityFactor = this.calculateSeasonalityFactor(historicalData);
      const trendFactor = this.calculateTrendFactor(historicalData);

      // Calculate external factors impact
      const externalFactorsImpact =
        this.calculateExternalFactorsImpact(externalFactors);

      // Get the next period forecast
      const nextForecast = forecasts[0];

      return {
        property_id: propertyId,
        service_type: serviceType,
        forecast_period: '30_days',
        predicted_demand: nextForecast.predicted_value,
        confidence_interval: nextForecast.confidence_interval,
        seasonality_factor: seasonalityFactor,
        trend_factor: trendFactor,
        external_factors: externalFactorsImpact,
      };
    } catch (error) {
      console.error('Error in demand forecasting:', error);
      throw error;
    }
  }

  // =============================================================================
  // REVENUE PREDICTION
  // =============================================================================

  /**
   * Predict revenue for a property
   */
  async predictRevenue(
    propertyId: string,
    historicalRevenue: TimeSeriesData[],
    roomRevenue: TimeSeriesData[],
    restaurantRevenue: TimeSeriesData[],
    spaRevenue: TimeSeriesData[]
  ): Promise<RevenuePrediction> {
    try {
      // Forecast total revenue
      const totalForecast = await this.forecastTimeSeries(
        historicalRevenue,
        30,
        'arima'
      );
      const roomForecast = await this.forecastTimeSeries(
        roomRevenue,
        30,
        'arima'
      );
      const restaurantForecast = await this.forecastTimeSeries(
        restaurantRevenue,
        30,
        'arima'
      );
      const spaForecast = await this.forecastTimeSeries(
        spaRevenue,
        30,
        'arima'
      );

      const nextForecast = totalForecast[0];
      const roomNext = roomForecast[0];
      const restaurantNext = restaurantForecast[0];
      const spaNext = spaForecast[0];

      // Calculate growth rate
      const currentRevenue =
        historicalRevenue[historicalRevenue.length - 1]?.value || 0;
      const growthRate =
        currentRevenue > 0
          ? (nextForecast.predicted_value - currentRevenue) / currentRevenue
          : 0;

      return {
        property_id: propertyId,
        period: '30_days',
        predicted_revenue: nextForecast.predicted_value,
        confidence_interval: nextForecast.confidence_interval,
        breakdown: {
          room_revenue: roomNext.predicted_value,
          restaurant_revenue: restaurantNext.predicted_value,
          spa_revenue: spaNext.predicted_value,
          other_revenue:
            nextForecast.predicted_value -
            roomNext.predicted_value -
            restaurantNext.predicted_value -
            spaNext.predicted_value,
        },
        growth_rate: growthRate,
      };
    } catch (error) {
      console.error('Error in revenue prediction:', error);
      throw error;
    }
  }

  // =============================================================================
  // BUSINESS INTELLIGENCE
  // =============================================================================

  /**
   * Generate comprehensive business intelligence metrics
   */
  async generateBusinessIntelligence(
    propertyId: string,
    metrics: {
      occupancy: TimeSeriesData[];
      adr: TimeSeriesData[];
      revpar: TimeSeriesData[];
      satisfaction: TimeSeriesData[];
      productivity: TimeSeriesData[];
    }
  ): Promise<BusinessIntelligenceMetrics> {
    try {
      // Calculate current KPIs
      const kpis = {
        occupancy_rate: this.calculateCurrentKPI(metrics.occupancy),
        average_daily_rate: this.calculateCurrentKPI(metrics.adr),
        revenue_per_available_room: this.calculateCurrentKPI(metrics.revpar),
        customer_satisfaction: this.calculateCurrentKPI(metrics.satisfaction),
        employee_productivity: this.calculateCurrentKPI(metrics.productivity),
      };

      // Calculate trends
      const trends = {
        revenue_trend: this.calculateTrend(metrics.revpar.map((d) => d.value)),
        occupancy_trend: this.calculateTrend(
          metrics.occupancy.map((d) => d.value)
        ),
        customer_satisfaction_trend: this.calculateTrend(
          metrics.satisfaction.map((d) => d.value)
        ),
      };

      // Generate insights and recommendations
      const insights = this.generateInsights(kpis, trends);
      const recommendations = this.generateRecommendations(kpis, trends);

      return {
        kpis,
        trends,
        insights,
        recommendations,
      };
    } catch (error) {
      console.error('Error generating business intelligence:', error);
      throw error;
    }
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  private calculateFirstDifferences(values: number[]): number[] {
    const diffs: number[] = [];
    for (let i = 1; i < values.length; i++) {
      diffs.push(values[i] - values[i - 1]);
    }
    return diffs;
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }

  private calculateTrend(values: number[]): number {
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const { slope } = this.calculateLinearRegression(x, values);
    return slope;
  }

  private calculateLinearRegression(
    x: number[],
    y: number[]
  ): { slope: number; intercept: number; rSquared: number } {
    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    const sumYY = y.reduce((sum, val) => sum + val * val, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const yMean = sumY / n;
    const ssRes = y.reduce(
      (sum, val, i) => sum + Math.pow(val - (slope * x[i] + intercept), 2),
      0
    );
    const ssTot = y.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
    const rSquared = 1 - ssRes / ssTot;

    return { slope, intercept, rSquared };
  }

  private calculateSumOfSquares(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
  }

  private calculateSeasonalIndices(values: number[], period: number): number[] {
    const indices: number[] = [];
    for (let i = 0; i < period; i++) {
      const periodValues = values.filter((_, index) => index % period === i);
      const avg =
        periodValues.reduce((sum, val) => sum + val, 0) / periodValues.length;
      const overallAvg =
        values.reduce((sum, val) => sum + val, 0) / values.length;
      indices.push(avg / overallAvg);
    }
    return indices;
  }

  private calculateBaseLevel(
    values: number[],
    seasonalIndices: number[],
    period: number
  ): number {
    const deseasonalized = values.map(
      (val, index) => val / seasonalIndices[index % period]
    );
    return (
      deseasonalized.reduce((sum, val) => sum + val, 0) / deseasonalized.length
    );
  }

  private groupCustomersByCohort(
    customerData: Array<{
      customer_id: string;
      first_purchase_date: Date;
      purchase_dates: Date[];
      purchase_amounts: number[];
    }>,
    period: 'daily' | 'weekly' | 'monthly'
  ): Map<string, unknown[]> {
    const cohorts = new Map<string, unknown[]>();

    customerData.forEach((customer) => {
      let cohortKey: string;
      const date = customer.first_purchase_date;

      switch (period) {
        case 'daily':
          cohortKey = date.toISOString().split('T')[0];
          break;
        case 'weekly':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          cohortKey = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          cohortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
      }

      if (!cohorts.has(cohortKey)) {
        cohorts.set(cohortKey, []);
      }
      cohorts.get(cohortKey)!.push(customer);
    });

    return cohorts;
  }

  private calculateRetentionRates(
    customers: (string | number | boolean)[],
    period: 'daily' | 'weekly' | 'monthly'
  ): number[] {
    // Simplified retention rate calculation
    const rates: number[] = [];
    const maxPeriods = 12; // Calculate retention for 12 periods

    for (let i = 1; i <= maxPeriods; i++) {
      const retainedCustomers = customers.filter((customer) => {
        const lastPurchase = new Date(
          Math.max(...customer.purchase_dates.map((d: Date) => d.getTime()))
        );
        const firstPurchase = customer.first_purchase_date;
        const daysDiff =
          (lastPurchase.getTime() - firstPurchase.getTime()) /
          (1000 * 60 * 60 * 24);

        const periodDays =
          period === 'daily' ? 1 : period === 'weekly' ? 7 : 30;
        return daysDiff >= i * periodDays;
      }).length;

      rates.push(retainedCustomers / customers.length);
    }

    return rates;
  }

  private calculateRevenuePerCohort(
    customers: (string | number | boolean)[]
  ): number[] {
    // Simplified revenue calculation per cohort period
    const revenue: number[] = [];
    const maxPeriods = 12;

    for (let i = 0; i < maxPeriods; i++) {
      const periodRevenue = customers.reduce((sum, customer) => {
        return (
          sum +
          customer.purchase_amounts.reduce(
            (customerSum: number, amount: number) => customerSum + amount,
            0
          )
        );
      }, 0);
      revenue.push(periodRevenue);
    }

    return revenue;
  }

  private calculateCohortLifetimeValue(
    customers: (string | number | boolean)[]
  ): number {
    const totalRevenue = customers.reduce((sum, customer) => {
      return (
        sum +
        customer.purchase_amounts.reduce(
          (customerSum: number, amount: number) => customerSum + amount,
          0
        )
      );
    }, 0);

    return totalRevenue / customers.length;
  }

  private calculateRecency(purchaseDates: Date[], now: Date): number {
    if (purchaseDates.length === 0) return 0;
    const lastPurchase = new Date(
      Math.max(...purchaseDates.map((d) => d.getTime()))
    );
    return (now.getTime() - lastPurchase.getTime()) / (1000 * 60 * 60 * 24);
  }

  private predictLTV(
    recency: number,
    frequency: number,
    monetary: number,
    engagement: number
  ): number {
    // Simplified LTV prediction model
    const recencyScore = Math.max(0, 1 - recency / 365); // Normalize to 0-1
    const frequencyScore = Math.min(1, frequency / 10); // Normalize to 0-1
    const monetaryScore = Math.min(1, monetary / 10000); // Normalize to 0-1
    const engagementScore = Math.min(1, engagement / 50); // Normalize to 0-1

    const weights = {
      recency: 0.3,
      frequency: 0.3,
      monetary: 0.3,
      engagement: 0.1,
    };
    const ltv =
      (recencyScore * weights.recency +
        frequencyScore * weights.frequency +
        monetaryScore * weights.monetary +
        engagementScore * weights.engagement) *
      10000;

    return Math.round(ltv);
  }

  private calculateLTVConfidence(
    recency: number,
    frequency: number,
    monetary: number,
    engagement: number
  ): number {
    // Confidence based on data completeness and recency
    const dataCompleteness =
      (frequency > 0 ? 0.3 : 0) +
      (monetary > 0 ? 0.3 : 0) +
      (engagement > 0 ? 0.2 : 0);
    const recencyConfidence = recency < 30 ? 0.2 : recency < 90 ? 0.1 : 0;

    return Math.min(0.95, dataCompleteness + recencyConfidence);
  }

  private generateLTVRecommendations(
    recency: number,
    frequency: number,
    monetary: number,
    engagement: number
  ): string[] {
    const recommendations: string[] = [];

    if (recency > 90) {
      recommendations.push(
        'Customer is at risk of churning - implement re-engagement campaign'
      );
    }
    if (frequency < 2) {
      recommendations.push(
        'Low frequency customer - consider loyalty program incentives'
      );
    }
    if (monetary < 1000) {
      recommendations.push(
        'Low monetary value - explore upselling opportunities'
      );
    }
    if (engagement < 5) {
      recommendations.push('Low engagement - increase communication frequency');
    }

    return recommendations;
  }

  private calculateSeasonalityFactor(data: TimeSeriesData[]): number {
    // Simplified seasonality calculation
    if (data.length < 7) return 1;

    const weeklyAverages: (string | number)[] = [];
    for (let i = 0; i < 7; i++) {
      const dayData = data.filter((_, index) => index % 7 === i);
      if (dayData.length > 0) {
        weeklyAverages.push(
          dayData.reduce((sum, d) => sum + d.value, 0) / dayData.length
        );
      }
    }

    const overallAverage =
      data.reduce((sum, d) => sum + d.value, 0) / data.length;
    const maxWeeklyAverage = Math.max(...weeklyAverages);

    return maxWeeklyAverage / overallAverage;
  }

  private calculateTrendFactor(data: TimeSeriesData[]): number {
    const values = data.map((d) => d.value);
    const { slope } = this.calculateLinearRegression(
      Array.from({ length: values.length }, (_, i) => i),
      values
    );
    return slope;
  }

  private calculateExternalFactorsImpact(
    factors?: Record<string, number[]>
  ): Record<string, number> {
    if (!factors) return {};

    const impact: Record<string, number> = {};
    for (const [factor, values] of Object.entries(factors)) {
      const trend = this.calculateTrend(values);
      impact[factor] = trend;
    }

    return impact;
  }

  private calculateCurrentKPI(data: TimeSeriesData[]): number {
    if (data.length === 0) return 0;
    return data[data.length - 1].value;
  }

  private generateInsights(kpis: unknown, trends: unknown): string[] {
    const insights: string[] = [];

    if (kpis.occupancy_rate > 0.8) {
      insights.push('High occupancy rate indicates strong demand');
    } else if (kpis.occupancy_rate < 0.5) {
      insights.push('Low occupancy rate suggests need for marketing efforts');
    }

    if (trends.revenue_trend === 'increasing') {
      insights.push(
        'Revenue is trending upward - positive business performance'
      );
    } else if (trends.revenue_trend === 'decreasing') {
      insights.push(
        'Revenue is declining - investigate causes and implement corrective measures'
      );
    }

    return insights;
  }

  private generateRecommendations(kpis: unknown, trends: unknown): string[] {
    const recommendations: string[] = [];

    if (kpis.occupancy_rate < 0.7) {
      recommendations.push(
        'Implement dynamic pricing strategy to increase occupancy'
      );
    }

    if (trends.customer_satisfaction_trend === 'decreasing') {
      recommendations.push(
        'Focus on improving customer service and experience'
      );
    }

    if (kpis.revenue_per_available_room < kpis.average_daily_rate * 0.7) {
      recommendations.push('Optimize room allocation and pricing strategies');
    }

    return recommendations;
  }
}

// =============================================================================
// EXPORT SINGLETON INSTANCE
// =============================================================================

export const advancedAnalyticsSystem = new AdvancedAnalyticsSystem();
