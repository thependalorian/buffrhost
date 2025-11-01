/**
 * Revenue Analytics Engine
 *
 * Specialized analytics for revenue forecasting and prediction
 * Features: Revenue forecasting, growth analysis, revenue breakdown
 * Location: lib/ai/analytics/revenue/RevenueAnalytics.ts
 * Purpose: Analyze and predict revenue streams across different business areas
 * Algorithms: Time series forecasting, regression analysis, seasonal decomposition
 */

import { BaseAnalyticsEngine } from '../shared/BaseAnalytics';
import {
  RevenuePrediction,
  TimeSeriesData,
  ForecastingMethod,
  StatisticalSummary,
  TrendAnalysis,
} from '../shared/types';

export class RevenueAnalytics extends BaseAnalyticsEngine {
  getAnalyticsType(): string {
    return 'revenue';
  }

  getAnalyticsName(): string {
    return 'Revenue Analytics Engine';
  }

  // ============================================================================
  // REVENUE PREDICTION
  // ============================================================================

  /**
   * Predict revenue for a property with detailed breakdown
   * @param propertyId - Property ID to predict revenue for
   * @param period - Prediction period (e.g., '30_days', '90_days', '1_year')
   * @param forecastingMethod - Method to use for forecasting
   * @returns Promise<RevenuePrediction> - Detailed revenue prediction
   */
  async predictRevenue(
    propertyId: string,
    period: string = '30_days',
    forecastingMethod: ForecastingMethod = 'arima'
  ): Promise<RevenuePrediction> {
    try {
      // Fetch historical revenue data
      const historicalData = await this.fetchRevenueData(
        propertyId,
        this.getPeriodStartDate(period),
        new Date()
      );

      if (historicalData.length < this.config.forecasting.min_data_points) {
        throw new Error(
          `Insufficient historical data for revenue prediction. Need at least ${this.config.forecasting.min_data_points} data points.`
        );
      }

      // Forecast total revenue
      const totalForecast = await this.forecastTimeSeries(
        historicalData,
        this.getForecastPeriods(period),
        forecastingMethod
      );

      // Get revenue breakdown by category
      const breakdown = await this.calculateRevenueBreakdown(
        propertyId,
        totalForecast[0]
      );

      // Calculate growth rate
      const currentRevenue =
        historicalData[historicalData.length - 1]?.value || 0;
      const predictedRevenue = totalForecast[0].predicted_value;
      const growthRate =
        currentRevenue > 0
          ? (predictedRevenue - currentRevenue) / currentRevenue
          : 0;

      return {
        property_id: propertyId,
        period,
        predicted_revenue: predictedRevenue,
        confidence_interval: totalForecast[0].confidence_interval,
        breakdown,
        growth_rate: growthRate,
      };
    } catch (error) {
      console.error('Error predicting revenue:', error);
      throw error;
    }
  }

  /**
   * Analyze revenue trends and patterns
   * @param propertyId - Property ID to analyze
   * @param startDate - Start date for analysis
   * @param endDate - End date for analysis
   * @returns Promise<TrendAnalysis> - Revenue trend analysis
   */
  async analyzeRevenueTrends(
    propertyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<TrendAnalysis> {
    try {
      const revenueData = await this.fetchRevenueData(
        propertyId,
        startDate,
        endDate
      );

      if (revenueData.length < 2) {
        return {
          slope: 0,
          intercept: 0,
          r_squared: 0,
          trend_direction: 'stable',
          change_rate: 0,
        };
      }

      // Convert to time series for analysis
      const values = revenueData.map((d) => d.value);
      const timestamps = revenueData.map((d) => d.timestamp.getTime());

      // Calculate linear regression
      const { slope, intercept, rSquared } = this.calculateLinearRegression(
        timestamps.map((t) => t - timestamps[0]), // Normalize timestamps
        values
      );

      // Determine trend direction
      let trendDirection: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (Math.abs(slope) > 0.01) {
        trendDirection = slope > 0 ? 'increasing' : 'decreasing';
      }

      // Calculate change rate (percentage per day)
      const avgValue = this.calculateMean(values);
      const changeRate =
        avgValue > 0 ? (slope * 24 * 60 * 60 * 1000) / avgValue : 0; // Convert to daily percentage

      return {
        slope,
        intercept,
        r_squared: rSquared,
        trend_direction: trendDirection,
        change_rate: changeRate,
      };
    } catch (error) {
      console.error('Error analyzing revenue trends:', error);
      throw error;
    }
  }

  /**
   * Get revenue statistics summary
   * @param propertyId - Property ID to analyze
   * @param startDate - Start date for analysis
   * @param endDate - End date for analysis
   * @returns Promise<StatisticalSummary> - Revenue statistics
   */
  async getRevenueStatistics(
    propertyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<StatisticalSummary> {
    try {
      const revenueData = await this.fetchRevenueData(
        propertyId,
        startDate,
        endDate
      );
      const values = revenueData.map((d) => d.value);

      if (values.length === 0) {
        return {
          mean: 0,
          median: 0,
          mode: [],
          standard_deviation: 0,
          variance: 0,
          skewness: 0,
          kurtosis: 0,
          min: 0,
          max: 0,
          quartiles: [0, 0, 0],
          outliers: [],
        };
      }

      const sorted = [...values].sort((a, b) => a - b);
      const mean = this.calculateMean(values);
      const median = this.calculateMedian(values);
      const stdDev = this.calculateStandardDeviation(values, mean);
      const variance = stdDev * stdDev;

      // Calculate quartiles
      const q1Index = Math.floor(sorted.length * 0.25);
      const q3Index = Math.floor(sorted.length * 0.75);
      const quartiles: [number, number, number] = [
        sorted[q1Index],
        median,
        sorted[q3Index],
      ];

      // Simple outlier detection using IQR method
      const iqr = quartiles[2] - quartiles[0];
      const lowerBound = quartiles[0] - 1.5 * iqr;
      const upperBound = quartiles[2] + 1.5 * iqr;
      const outliers = values.filter((v) => v < lowerBound || v > upperBound);

      // Calculate mode (most frequent values)
      const frequency: { [key: number]: number } = {};
      values.forEach((v) => {
        frequency[v] = (frequency[v] || 0) + 1;
      });
      const maxFreq = Math.max(...Object.values(frequency));
      const mode = Object.keys(frequency)
        .filter((k) => frequency[Number(k)] === maxFreq)
        .map(Number);

      // Simple skewness and kurtosis calculations
      const skewness =
        values.reduce((sum, v) => sum + Math.pow((v - mean) / stdDev, 3), 0) /
        values.length;
      const kurtosis =
        values.reduce((sum, v) => sum + Math.pow((v - mean) / stdDev, 4), 0) /
          values.length -
        3;

      return {
        mean,
        median,
        mode,
        standard_deviation: stdDev,
        variance,
        skewness,
        kurtosis,
        min: Math.min(...values),
        max: Math.max(...values),
        quartiles,
        outliers,
      };
    } catch (error) {
      console.error('Error calculating revenue statistics:', error);
      throw error;
    }
  }

  /**
   * Forecast revenue with multiple scenarios
   * @param propertyId - Property ID to forecast for
   * @param basePrediction - Base revenue prediction
   * @param scenarios - Different scenarios to consider
   * @returns Promise<Array<{scenario: string, prediction: RevenuePrediction}>> - Multiple scenario predictions
   */
  async forecastRevenueScenarios(
    propertyId: string,
    basePrediction: RevenuePrediction,
    scenarios: Array<{
      name: string;
      growthMultiplier: number;
      confidenceAdjustment: number;
    }>
  ): Promise<Array<{ scenario: string; prediction: RevenuePrediction }>> {
    const scenarioPredictions: Array<{
      scenario: string;
      prediction: RevenuePrediction;
    }> = [];

    for (const scenario of scenarios) {
      const adjustedPrediction: RevenuePrediction = {
        ...basePrediction,
        predicted_revenue:
          basePrediction.predicted_revenue * scenario.growthMultiplier,
        confidence_interval: {
          lower:
            basePrediction.confidence_interval.lower *
            scenario.confidenceAdjustment,
          upper:
            basePrediction.confidence_interval.upper *
            scenario.growthMultiplier,
        },
        growth_rate: basePrediction.growth_rate * scenario.growthMultiplier,
      };

      scenarioPredictions.push({
        scenario: scenario.name,
        prediction: adjustedPrediction,
      });
    }

    return scenarioPredictions;
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async calculateRevenueBreakdown(
    propertyId: string,
    totalForecast: any
  ): Promise<{
    room_revenue: number;
    restaurant_revenue: number;
    spa_revenue: number;
    other_revenue: number;
  }> {
    try {
      // In a real implementation, this would fetch historical breakdown data
      // and forecast each category separately
      const total = totalForecast.predicted_value;

      // Mock breakdown based on typical hospitality ratios
      return {
        room_revenue: total * 0.6, // 60% from rooms
        restaurant_revenue: total * 0.25, // 25% from restaurant
        spa_revenue: total * 0.1, // 10% from spa
        other_revenue: total * 0.05, // 5% from other services
      };
    } catch (error) {
      console.error('Error calculating revenue breakdown:', error);
      return {
        room_revenue: 0,
        restaurant_revenue: 0,
        spa_revenue: 0,
        other_revenue: 0,
      };
    }
  }

  private getPeriodStartDate(period: string): Date {
    const now = new Date();
    const periods: { [key: string]: number } = {
      '7_days': 7,
      '30_days': 30,
      '90_days': 90,
      '6_months': 180,
      '1_year': 365,
    };

    const days = periods[period] || 30;
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - days);
    return startDate;
  }

  private getForecastPeriods(period: string): number {
    const periods: { [key: string]: number } = {
      '7_days': 7,
      '30_days': 30,
      '90_days': 90,
      '6_months': 180,
      '1_year': 365,
    };

    return periods[period] || 30;
  }

  // ============================================================================
  // TIME SERIES FORECASTING METHODS
  // ============================================================================

  private async forecastTimeSeries(
    data: TimeSeriesData[],
    periods: number,
    method: ForecastingMethod
  ): Promise<any[]> {
    if (!this.validateTimeSeriesData(data)) {
      throw new Error('Invalid time series data for forecasting');
    }

    const sortedData = this.sortTimeSeriesData(data);
    const values = sortedData.map((d) => d.value);
    const timestamps = sortedData.map((d) => d.timestamp);

    switch (method) {
      case 'arima':
        return this.forecastARIMA(values, timestamps, periods);
      case 'exponential_smoothing':
        return this.forecastExponentialSmoothing(values, timestamps, periods);
      case 'linear_regression':
        return this.forecastLinearRegression(values, timestamps, periods);
      case 'seasonal':
        return this.forecastSeasonal(values, timestamps, periods);
      default:
        throw new Error(`Unknown forecasting method: ${method}`);
    }
  }

  private forecastARIMA(
    values: number[],
    timestamps: Date[],
    periods: number
  ): any[] {
    // Simplified ARIMA implementation
    const forecasts: any[] = [];
    const n = values.length;
    const alpha = 0.3;
    const diffValues = this.calculateFirstDifferences(values);

    let lastValue = values[n - 1];
    let lastDiff = diffValues[diffValues.length - 1];

    for (let i = 0; i < periods; i++) {
      const predictedDiff = alpha * lastDiff;
      const predictedValue = lastValue + predictedDiff;
      const variance = this.calculateVariance(values);
      const confidenceInterval = 1.96 * Math.sqrt(variance * (i + 1));

      forecasts.push({
        timestamp: new Date(
          timestamps[n - 1].getTime() + (i + 1) * 24 * 60 * 60 * 1000
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

  private forecastExponentialSmoothing(
    values: number[],
    timestamps: Date[],
    periods: number
  ): any[] {
    const forecasts: any[] = [];
    const alpha = 0.3;
    let smoothed = values[0];

    for (let i = 1; i < values.length; i++) {
      smoothed = alpha * values[i] + (1 - alpha) * smoothed;
    }

    const variance = this.calculateVariance(values);

    for (let i = 0; i < periods; i++) {
      const predictedValue = smoothed;
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

  private forecastLinearRegression(
    values: number[],
    timestamps: Date[],
    periods: number
  ): any[] {
    const forecasts: any[] = [];
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);

    const { slope, intercept } = this.calculateLinearRegression(x, values);
    const variance = this.calculateVariance(values);

    for (let i = 0; i < periods; i++) {
      const xValue = n + i;
      const predictedValue = slope * xValue + intercept;
      const confidenceInterval = 1.96 * Math.sqrt(variance * (i + 1));

      forecasts.push({
        timestamp: new Date(
          timestamps[n - 1].getTime() + (i + 1) * 24 * 60 * 60 * 1000
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

  private forecastSeasonal(
    values: number[],
    timestamps: Date[],
    periods: number
  ): any[] {
    const forecasts: any[] = [];
    const seasonalPeriod = 7; // Weekly seasonality

    if (values.length < seasonalPeriod) {
      return this.forecastExponentialSmoothing(values, timestamps, periods);
    }

    // Calculate seasonal indices
    const seasonalIndices = this.calculateSeasonalIndices(
      values,
      seasonalPeriod
    );

    // Simple seasonal forecasting
    const recentValues = values.slice(-seasonalPeriod);
    const avgRecent = this.calculateMean(recentValues);

    for (let i = 0; i < periods; i++) {
      const seasonalIndex = seasonalIndices[i % seasonalPeriod];
      const predictedValue = avgRecent * seasonalIndex;
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
    }

    return forecasts;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private calculateFirstDifferences(values: number[]): number[] {
    const differences: number[] = [];
    for (let i = 1; i < values.length; i++) {
      differences.push(values[i] - values[i - 1]);
    }
    return differences;
  }

  private calculateVariance(values: number[]): number {
    const mean = this.calculateMean(values);
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
    return (
      squaredDiffs.reduce((sum, val) => sum + val, 0) / (values.length - 1)
    );
  }

  private calculateLinearRegression(
    x: number[],
    y: number[]
  ): { slope: number; intercept: number; rSquared: number } {
    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
    const sumY2 = y.reduce((sum, val) => sum + val * val, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R-squared
    const yMean = sumY / n;
    const ssRes = y.reduce(
      (sum, val, i) => sum + Math.pow(val - (slope * x[i] + intercept), 2),
      0
    );
    const ssTot = y.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
    const rSquared = 1 - ssRes / ssTot;

    return { slope, intercept, rSquared };
  }

  private calculateSeasonalIndices(values: number[], period: number): number[] {
    const indices: number[] = new Array(period).fill(0);
    const counts: number[] = new Array(period).fill(0);

    // Calculate average for each seasonal position
    for (let i = 0; i < values.length; i++) {
      const position = i % period;
      indices[position] += values[i];
      counts[position]++;
    }

    // Normalize indices
    const overallMean = this.calculateMean(values);
    for (let i = 0; i < period; i++) {
      if (counts[i] > 0) {
        indices[i] = indices[i] / counts[i] / overallMean;
      } else {
        indices[i] = 1; // Default to 1 if no data
      }
    }

    return indices;
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    return (values[values.length - 1] - values[0]) / (values.length - 1);
  }

  private calculateSumOfSquares(values: number[]): number {
    const mean = this.calculateMean(values);
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
  }
}
