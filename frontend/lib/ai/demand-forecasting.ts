/**
 * TypeScript Demand Forecasting System for Buffr Host
 *
 * Advanced demand forecasting system using:
 * - Time series analysis with multiple algorithms
 * - GARCH models for volatility forecasting
 * - Seasonal pattern recognition
 * - External factor integration
 * - Demand optimization recommendations
 *
 * Author: Buffr AI Team (Andrew Ng inspired implementation)
 * Date: 2024
 */

import { apiClient } from '../services/api-client';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export interface DemandData {
  timestamp: Date;
  demand: number;
  property_id: string;
  service_type: string;
  external_factors?: ExternalFactors;
}

export interface ExternalFactors {
  weather?: number;
  events?: number;
  seasonality?: number;
  holidays?: number;
  economic_indicator?: number;
  competitor_activity?: number;
}

export interface ForecastResult {
  timestamp: Date;
  predicted_demand: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  volatility: number;
  seasonality_component: number;
  trend_component: number;
  external_impact: number;
}

export interface GARCHModel {
  alpha: number;
  beta: number;
  omega: number;
  volatility: number[];
  residuals: number[];
}

export interface SeasonalPattern {
  period: number;
  amplitude: number;
  phase: number;
  confidence: number;
}

export interface DemandOptimization {
  recommended_capacity: number;
  optimal_pricing: number;
  staffing_recommendations: {
    peak_hours: number;
    off_peak_hours: number;
  };
  inventory_suggestions: {
    high_demand_items: string[];
    low_demand_items: string[];
  };
  revenue_impact: number;
}

export interface ForecastAccuracy {
  mae: number; // Mean Absolute Error
  mse: number; // Mean Squared Error
  rmse: number; // Root Mean Squared Error
  mape: number; // Mean Absolute Percentage Error
  r_squared: number;
}

// =============================================================================
// DEMAND FORECASTING SYSTEM CLASS
// =============================================================================

export class DemandForecastingSystem {
  private models: Map<string, any> = new Map();
  private seasonalPatterns: Map<string, SeasonalPattern> = new Map();
  private garchModels: Map<string, GARCHModel> = new Map();
  private externalFactorWeights: Map<string, number> = new Map();

  constructor() {
    this.initializeSystem();
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  private async initializeSystem(): Promise<void> {
    try {
      console.log('Initializing Demand Forecasting System...');

      // Initialize external factor weights
      this.externalFactorWeights.set('weather', 0.3);
      this.externalFactorWeights.set('events', 0.25);
      this.externalFactorWeights.set('seasonality', 0.2);
      this.externalFactorWeights.set('holidays', 0.15);
      this.externalFactorWeights.set('economic_indicator', 0.1);

      console.log('Demand Forecasting System initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Demand Forecasting System:', error);
    }
  }

  // =============================================================================
  // MAIN FORECASTING METHODS
  // =============================================================================

  /**
   * Generate comprehensive demand forecast
   */
  async forecastDemand(
    propertyId: string,
    serviceType: string,
    historicalData: DemandData[],
    forecastPeriods: number = 30,
    method:
      | 'arima'
      | 'exponential'
      | 'garch'
      | 'neural'
      | 'ensemble' = 'ensemble'
  ): Promise<ForecastResult[]> {
    try {
      if (historicalData.length < 20) {
        throw new Error(
          'Insufficient historical data. Need at least 20 data points.'
        );
      }

      // Prepare data
      const demandValues = historicalData.map((d) => d.demand);
      const timestamps = historicalData.map((d) => d.timestamp);
      const externalFactors = this.extractExternalFactors(historicalData);

      // Detect seasonal patterns
      const seasonalPattern = this.detectSeasonalPattern(
        demandValues,
        timestamps
      );
      this.seasonalPatterns.set(
        `${propertyId}_${serviceType}`,
        seasonalPattern
      );

      // Build GARCH model for volatility
      const garchModel = this.buildGARCHModel(demandValues);
      this.garchModels.set(`${propertyId}_${serviceType}`, garchModel);

      let forecasts: ForecastResult[] = [];

      switch (method) {
        case 'arima':
          forecasts = await this.forecastARIMA(
            demandValues,
            timestamps,
            forecastPeriods,
            externalFactors
          );
          break;
        case 'exponential':
          forecasts = await this.forecastExponentialSmoothing(
            demandValues,
            timestamps,
            forecastPeriods,
            externalFactors
          );
          break;
        case 'garch':
          forecasts = await this.forecastGARCH(
            demandValues,
            timestamps,
            forecastPeriods,
            garchModel,
            externalFactors
          );
          break;
        case 'neural':
          forecasts = await this.forecastNeuralNetwork(
            demandValues,
            timestamps,
            forecastPeriods,
            externalFactors
          );
          break;
        case 'ensemble':
          forecasts = await this.forecastEnsemble(
            demandValues,
            timestamps,
            forecastPeriods,
            externalFactors
          );
          break;
        default:
          throw new Error(`Unknown forecasting method: ${method}`);
      }

      // Add seasonal and trend components
      forecasts = this.addSeasonalTrendComponents(
        forecasts,
        seasonalPattern,
        timestamps
      );

      // Calculate external factor impact
      forecasts = this.addExternalFactorImpact(
        forecasts,
        externalFactors,
        forecastPeriods
      );

      return forecasts;
    } catch (error) {
      console.error('Error in demand forecasting:', error);
      return [];
    }
  }

  /**
   * ARIMA forecasting with external factors
   */
  private async forecastARIMA(
    values: number[],
    timestamps: Date[],
    periods: number,
    externalFactors: ExternalFactors[]
  ): Promise<ForecastResult[]> {
    const forecasts: ForecastResult[] = [];
    const n = values.length;

    // Simple ARIMA(1,1,1) implementation
    const alpha = 0.3; // AR coefficient
    const beta = 0.2; // MA coefficient
    const gamma = 0.1; // Integration coefficient

    // Calculate first differences
    const diffValues = this.calculateFirstDifferences(values);

    let lastValue = values[n - 1];
    let lastDiff = diffValues[diffValues.length - 1];

    for (let i = 0; i < periods; i++) {
      // ARIMA prediction
      const predictedDiff = alpha * lastDiff + beta * 0 + gamma * lastDiff;
      let predictedValue = lastValue + predictedDiff;

      // Add external factor impact
      const externalImpact = this.calculateExternalImpact(externalFactors, i);
      predictedValue += externalImpact;

      // Calculate confidence interval
      const variance = this.calculateVariance(values);
      const confidenceInterval = 1.96 * Math.sqrt(variance * (i + 1));

      forecasts.push({
        timestamp: new Date(
          timestamps[timestamps.length - 1].getTime() +
            (i + 1) * 24 * 60 * 60 * 1000
        ),
        predicted_demand: Math.max(0, predictedValue),
        confidence_interval: {
          lower: Math.max(0, predictedValue - confidenceInterval),
          upper: predictedValue + confidenceInterval,
        },
        volatility: Math.sqrt(variance),
        seasonality_component: 0, // Will be added later
        trend_component: predictedDiff,
        external_impact: externalImpact,
      });

      lastValue = predictedValue;
      lastDiff = predictedDiff;
    }

    return forecasts;
  }

  /**
   * Exponential smoothing with trend and seasonality
   */
  private async forecastExponentialSmoothing(
    values: number[],
    timestamps: Date[],
    periods: number,
    externalFactors: ExternalFactors[]
  ): Promise<ForecastResult[]> {
    const forecasts: ForecastResult[] = [];
    const alpha = 0.3; // Level smoothing
    const beta = 0.2; // Trend smoothing
    const gamma = 0.1; // Seasonality smoothing

    // Initialize level, trend, and seasonality
    let level = values[0];
    let trend = 0;
    const seasonality = this.calculateSeasonalIndices(values, 7); // Weekly seasonality

    // Apply Holt-Winters method
    const smoothedValues = [level];
    for (let i = 1; i < values.length; i++) {
      const prevLevel = level;
      const prevTrend = trend;

      level = alpha * values[i] + (1 - alpha) * (prevLevel + prevTrend);
      trend = beta * (level - prevLevel) + (1 - beta) * prevTrend;

      smoothedValues.push(level);
    }

    // Forecast future values
    for (let i = 0; i < periods; i++) {
      const seasonalIndex = seasonality[i % seasonality.length];
      let predictedValue = (level + trend * (i + 1)) * seasonalIndex;

      // Add external factor impact
      const externalImpact = this.calculateExternalImpact(externalFactors, i);
      predictedValue += externalImpact;

      // Calculate confidence interval
      const variance = this.calculateVariance(values);
      const confidenceInterval = 1.96 * Math.sqrt(variance * (i + 1));

      forecasts.push({
        timestamp: new Date(
          timestamps[timestamps.length - 1].getTime() +
            (i + 1) * 24 * 60 * 60 * 1000
        ),
        predicted_demand: Math.max(0, predictedValue),
        confidence_interval: {
          lower: Math.max(0, predictedValue - confidenceInterval),
          upper: predictedValue + confidenceInterval,
        },
        volatility: Math.sqrt(variance),
        seasonality_component: seasonalIndex,
        trend_component: trend,
        external_impact: externalImpact,
      });
    }

    return forecasts;
  }

  /**
   * GARCH forecasting for volatility modeling
   */
  private async forecastGARCH(
    values: number[],
    timestamps: Date[],
    periods: number,
    garchModel: GARCHModel,
    externalFactors: ExternalFactors[]
  ): Promise<ForecastResult[]> {
    const forecasts: ForecastResult[] = [];
    const n = values.length;

    // Calculate returns
    const returns = this.calculateReturns(values);

    // Forecast using GARCH model
    let lastVolatility =
      garchModel.volatility[garchModel.volatility.length - 1];
    let lastReturn = returns[returns.length - 1];

    for (let i = 0; i < periods; i++) {
      // GARCH(1,1) forecast
      const predictedVolatility =
        garchModel.omega +
        garchModel.alpha * Math.pow(lastReturn, 2) +
        garchModel.beta * lastVolatility;

      // Predict return using volatility
      const predictedReturn =
        Math.sqrt(predictedVolatility) * this.generateRandomNormal();
      const predictedValue = values[n - 1] * (1 + predictedReturn);

      // Add external factor impact
      const externalImpact = this.calculateExternalImpact(externalFactors, i);
      const finalPredictedValue = predictedValue + externalImpact;

      // Calculate confidence interval
      const confidenceInterval = 1.96 * Math.sqrt(predictedVolatility);

      forecasts.push({
        timestamp: new Date(
          timestamps[timestamps.length - 1].getTime() +
            (i + 1) * 24 * 60 * 60 * 1000
        ),
        predicted_demand: Math.max(0, finalPredictedValue),
        confidence_interval: {
          lower: Math.max(0, finalPredictedValue - confidenceInterval),
          upper: finalPredictedValue + confidenceInterval,
        },
        volatility: Math.sqrt(predictedVolatility),
        seasonality_component: 0,
        trend_component: predictedReturn,
        external_impact: externalImpact,
      });

      lastVolatility = predictedVolatility;
      lastReturn = predictedReturn;
    }

    return forecasts;
  }

  /**
   * Neural network forecasting (simplified implementation)
   */
  private async forecastNeuralNetwork(
    values: number[],
    timestamps: Date[],
    periods: number,
    externalFactors: ExternalFactors[]
  ): Promise<ForecastResult[]> {
    const forecasts: ForecastResult[] = [];

    // Simplified neural network implementation
    // In production, you would use a proper neural network library
    const inputSize = Math.min(7, values.length); // Use last 7 days as input
    const hiddenSize = 10;
    const outputSize = 1;

    // Simple feedforward network weights (randomly initialized)
    const weights1 = this.initializeWeights(inputSize, hiddenSize);
    const weights2 = this.initializeWeights(hiddenSize, outputSize);

    for (let i = 0; i < periods; i++) {
      // Prepare input (last inputSize values)
      const input = values.slice(-inputSize);

      // Forward pass
      const hidden = this.forwardPass(input, weights1);
      const output = this.forwardPass(hidden, weights2);

      let predictedValue = output[0];

      // Add external factor impact
      const externalImpact = this.calculateExternalImpact(externalFactors, i);
      predictedValue += externalImpact;

      // Calculate confidence interval (simplified)
      const variance = this.calculateVariance(values);
      const confidenceInterval = 1.96 * Math.sqrt(variance);

      forecasts.push({
        timestamp: new Date(
          timestamps[timestamps.length - 1].getTime() +
            (i + 1) * 24 * 60 * 60 * 1000
        ),
        predicted_demand: Math.max(0, predictedValue),
        confidence_interval: {
          lower: Math.max(0, predictedValue - confidenceInterval),
          upper: predictedValue + confidenceInterval,
        },
        volatility: Math.sqrt(variance),
        seasonality_component: 0,
        trend_component: 0,
        external_impact: externalImpact,
      });
    }

    return forecasts;
  }

  /**
   * Ensemble forecasting combining multiple methods
   */
  private async forecastEnsemble(
    values: number[],
    timestamps: Date[],
    periods: number,
    externalFactors: ExternalFactors[]
  ): Promise<ForecastResult[]> {
    // Run multiple forecasting methods
    const [arimaForecasts, expForecasts, garchForecasts, neuralForecasts] =
      await Promise.all([
        this.forecastARIMA(values, timestamps, periods, externalFactors),
        this.forecastExponentialSmoothing(
          values,
          timestamps,
          periods,
          externalFactors
        ),
        this.forecastGARCH(
          values,
          timestamps,
          periods,
          this.buildGARCHModel(values),
          externalFactors
        ),
        this.forecastNeuralNetwork(
          values,
          timestamps,
          periods,
          externalFactors
        ),
      ]);

    // Combine forecasts using weighted average
    const weights = { arima: 0.3, exponential: 0.25, garch: 0.25, neural: 0.2 };

    const ensembleForecasts: ForecastResult[] = [];

    for (let i = 0; i < periods; i++) {
      const arima = arimaForecasts[i];
      const exp = expForecasts[i];
      const garch = garchForecasts[i];
      const neural = neuralForecasts[i];

      const predictedDemand =
        arima.predicted_demand * weights.arima +
        exp.predicted_demand * weights.exponential +
        garch.predicted_demand * weights.garch +
        neural.predicted_demand * weights.neural;

      const avgVolatility =
        arima.volatility * weights.arima +
        exp.volatility * weights.exponential +
        garch.volatility * weights.garch +
        neural.volatility * weights.neural;

      const avgConfidenceInterval = {
        lower:
          arima.confidence_interval.lower * weights.arima +
          exp.confidence_interval.lower * weights.exponential +
          garch.confidence_interval.lower * weights.garch +
          neural.confidence_interval.lower * weights.neural,
        upper:
          arima.confidence_interval.upper * weights.arima +
          exp.confidence_interval.upper * weights.exponential +
          garch.confidence_interval.upper * weights.garch +
          neural.confidence_interval.upper * weights.neural,
      };

      ensembleForecasts.push({
        timestamp: arima.timestamp,
        predicted_demand: Math.max(0, predictedDemand),
        confidence_interval: avgConfidenceInterval,
        volatility: avgVolatility,
        seasonality_component: exp.seasonality_component,
        trend_component: arima.trend_component,
        external_impact: arima.external_impact,
      });
    }

    return ensembleForecasts;
  }

  // =============================================================================
  // SEASONAL PATTERN DETECTION
  // =============================================================================

  private detectSeasonalPattern(
    values: number[],
    timestamps: Date[]
  ): SeasonalPattern {
    // Detect weekly seasonality
    const weeklyPattern = this.detectWeeklySeasonality(values);

    // Detect monthly seasonality
    const monthlyPattern = this.detectMonthlySeasonality(values, timestamps);

    // Choose the pattern with higher confidence
    if (weeklyPattern.confidence > monthlyPattern.confidence) {
      return weeklyPattern;
    } else {
      return monthlyPattern;
    }
  }

  private detectWeeklySeasonality(values: number[]): SeasonalPattern {
    const period = 7;
    const amplitudes: number[] = [];

    for (let i = 0; i < period; i++) {
      const dayValues = values.filter((_, index) => index % period === i);
      if (dayValues.length > 0) {
        const avg =
          dayValues.reduce((sum, val) => sum + val, 0) / dayValues.length;
        const overallAvg =
          values.reduce((sum, val) => sum + val, 0) / values.length;
        amplitudes.push(avg / overallAvg);
      }
    }

    const maxAmplitude = Math.max(...amplitudes);
    const minAmplitude = Math.min(...amplitudes);
    const confidence = (maxAmplitude - minAmplitude) / maxAmplitude;

    return {
      period: 7,
      amplitude: maxAmplitude,
      phase: amplitudes.indexOf(maxAmplitude),
      confidence: Math.min(1, confidence),
    };
  }

  private detectMonthlySeasonality(
    values: number[],
    timestamps: Date[]
  ): SeasonalPattern {
    // Group by month
    const monthlyData = new Map<number, number[]>();

    timestamps.forEach((timestamp, index) => {
      const month = timestamp.getMonth();
      if (!monthlyData.has(month)) {
        monthlyData.set(month, []);
      }
      monthlyData.get(month)!.push(values[index]);
    });

    const monthlyAverages: number[] = [];
    for (let month = 0; month < 12; month++) {
      const monthValues = monthlyData.get(month) || [];
      const avg =
        monthValues.length > 0
          ? monthValues.reduce((sum, val) => sum + val, 0) / monthValues.length
          : 0;
      monthlyAverages.push(avg);
    }

    const overallAvg =
      values.reduce((sum, val) => sum + val, 0) / values.length;
    const amplitudes = monthlyAverages.map((avg) => avg / overallAvg);

    const maxAmplitude = Math.max(...amplitudes);
    const minAmplitude = Math.min(...amplitudes);
    const confidence = (maxAmplitude - minAmplitude) / maxAmplitude;

    return {
      period: 30,
      amplitude: maxAmplitude,
      phase: amplitudes.indexOf(maxAmplitude),
      confidence: Math.min(1, confidence),
    };
  }

  // =============================================================================
  // GARCH MODEL BUILDING
  // =============================================================================

  private buildGARCHModel(values: number[]): GARCHModel {
    const returns = this.calculateReturns(values);
    const n = returns.length;

    // Initialize parameters
    const alpha = 0.1;
    const beta = 0.85;
    const omega = 0.01;

    // Calculate initial volatility
    const volatility = returns.map((r) => Math.pow(r, 2));

    // Simple GARCH(1,1) estimation (simplified)
    for (let i = 1; i < n; i++) {
      volatility[i] =
        omega + alpha * Math.pow(returns[i - 1], 2) + beta * volatility[i - 1];
    }

    return {
      alpha,
      beta,
      omega,
      volatility,
      residuals: returns,
    };
  }

  // =============================================================================
  // DEMAND OPTIMIZATION
  // =============================================================================

  async optimizeDemand(
    propertyId: string,
    serviceType: string,
    forecast: ForecastResult[],
    currentCapacity: number,
    currentPricing: number
  ): Promise<DemandOptimization> {
    try {
      const avgPredictedDemand =
        forecast.reduce((sum, f) => sum + f.predicted_demand, 0) /
        forecast.length;
      const maxPredictedDemand = Math.max(
        ...forecast.map((f) => f.predicted_demand)
      );

      // Calculate optimal capacity (with buffer)
      const recommendedCapacity = Math.ceil(maxPredictedDemand * 1.2);

      // Calculate optimal pricing using demand elasticity
      const demandElasticity = this.calculateDemandElasticity(
        avgPredictedDemand,
        currentPricing
      );
      const optimalPricing = this.calculateOptimalPricing(
        currentPricing,
        demandElasticity
      );

      // Staffing recommendations based on demand patterns
      const peakHours = this.identifyPeakHours(forecast);
      const staffingRecommendations = {
        peak_hours: Math.ceil(recommendedCapacity * 0.8),
        off_peak_hours: Math.ceil(recommendedCapacity * 0.4),
      };

      // Inventory suggestions
      const inventorySuggestions = this.generateInventorySuggestions(
        forecast,
        serviceType
      );

      // Calculate revenue impact
      const currentRevenue = avgPredictedDemand * currentPricing;
      const optimizedRevenue = avgPredictedDemand * optimalPricing;
      const revenueImpact = optimizedRevenue - currentRevenue;

      return {
        recommended_capacity: recommendedCapacity,
        optimal_pricing: optimalPricing,
        staffing_recommendations: staffingRecommendations,
        inventory_suggestions: inventorySuggestions,
        revenue_impact: revenueImpact,
      };
    } catch (error) {
      console.error('Error in demand optimization:', error);
      throw error;
    }
  }

  // =============================================================================
  // FORECAST ACCURACY EVALUATION
  // =============================================================================

  async evaluateForecastAccuracy(
    actualValues: number[],
    predictedValues: number[]
  ): Promise<ForecastAccuracy> {
    if (actualValues.length !== predictedValues.length) {
      throw new Error('Actual and predicted values must have the same length');
    }

    const n = actualValues.length;

    // Calculate errors
    const errors = actualValues.map((actual, i) => actual - predictedValues[i]);
    const absoluteErrors = errors.map((error) => Math.abs(error));
    const squaredErrors = errors.map((error) => error * error);
    const percentageErrors = errors.map((error, i) =>
      actualValues[i] !== 0 ? Math.abs(error / actualValues[i]) : 0
    );

    // Calculate metrics
    const mae = absoluteErrors.reduce((sum, error) => sum + error, 0) / n;
    const mse = squaredErrors.reduce((sum, error) => sum + error, 0) / n;
    const rmse = Math.sqrt(mse);
    const mape = percentageErrors.reduce((sum, error) => sum + error, 0) / n;

    // Calculate R-squared
    const actualMean = actualValues.reduce((sum, val) => sum + val, 0) / n;
    const ssRes = squaredErrors.reduce((sum, error) => sum + error, 0);
    const ssTot = actualValues.reduce(
      (sum, val) => sum + Math.pow(val - actualMean, 2),
      0
    );
    const rSquared = 1 - ssRes / ssTot;

    return {
      mae,
      mse,
      rmse,
      mape,
      r_squared: rSquared,
    };
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  private extractExternalFactors(data: DemandData[]): ExternalFactors[] {
    return data.map((d) => d.external_factors || {});
  }

  private calculateFirstDifferences(values: number[]): number[] {
    const diffs: number[] = [];
    for (let i = 1; i < values.length; i++) {
      diffs.push(values[i] - values[i - 1]);
    }
    return diffs;
  }

  private calculateReturns(values: number[]): number[] {
    const returns: number[] = [];
    for (let i = 1; i < values.length; i++) {
      returns.push((values[i] - values[i - 1]) / values[i - 1]);
    }
    return returns;
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }

  private calculateSeasonalIndices(values: number[], period: number): number[] {
    const indices: number[] = [];
    for (let i = 0; i < period; i++) {
      const periodValues = values.filter((_, index) => index % period === i);
      if (periodValues.length > 0) {
        const avg =
          periodValues.reduce((sum, val) => sum + val, 0) / periodValues.length;
        const overallAvg =
          values.reduce((sum, val) => sum + val, 0) / values.length;
        indices.push(avg / overallAvg);
      } else {
        indices.push(1);
      }
    }
    return indices;
  }

  private calculateExternalImpact(
    externalFactors: ExternalFactors[],
    period: number
  ): number {
    if (period >= externalFactors.length) return 0;

    const factors = externalFactors[period] || {};
    let impact = 0;

    for (const [factor, value] of Object.entries(factors)) {
      const weight = this.externalFactorWeights.get(factor) || 0;
      impact += (value || 0) * weight;
    }

    return impact;
  }

  private addSeasonalTrendComponents(
    forecasts: ForecastResult[],
    seasonalPattern: SeasonalPattern,
    timestamps: Date[]
  ): ForecastResult[] {
    return forecasts.map((forecast, index) => {
      const seasonalIndex =
        seasonalPattern.period === 7 ? index % 7 : index % 30;
      const seasonalityComponent =
        seasonalPattern.amplitude *
        Math.sin((2 * Math.PI * seasonalIndex) / seasonalPattern.period);

      return {
        ...forecast,
        seasonality_component: seasonalityComponent,
        predicted_demand: forecast.predicted_demand + seasonalityComponent,
      };
    });
  }

  private addExternalFactorImpact(
    forecasts: ForecastResult[],
    externalFactors: ExternalFactors[],
    periods: number
  ): ForecastResult[] {
    return forecasts.map((forecast, index) => {
      const externalImpact = this.calculateExternalImpact(
        externalFactors,
        index
      );
      return {
        ...forecast,
        external_impact: externalImpact,
        predicted_demand: forecast.predicted_demand + externalImpact,
      };
    });
  }

  private generateRandomNormal(): number {
    // Box-Muller transformation for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  private initializeWeights(inputSize: number, outputSize: number): number[][] {
    const weights: number[][] = [];
    for (let i = 0; i < inputSize; i++) {
      weights[i] = [];
      for (let j = 0; j < outputSize; j++) {
        weights[i][j] = (Math.random() - 0.5) * 2; // Random weights between -1 and 1
      }
    }
    return weights;
  }

  private forwardPass(input: number[], weights: number[][]): number[] {
    const output: number[] = [];
    for (let j = 0; j < weights[0].length; j++) {
      let sum = 0;
      for (let i = 0; i < input.length; i++) {
        sum += input[i] * weights[i][j];
      }
      output[j] = this.sigmoid(sum); // Apply activation function
    }
    return output;
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  private calculateDemandElasticity(demand: number, price: number): number {
    // Simplified elasticity calculation
    return -0.5; // Assume -0.5 elasticity (1% price increase = 0.5% demand decrease)
  }

  private calculateOptimalPricing(
    currentPrice: number,
    elasticity: number
  ): number {
    // Simplified optimal pricing calculation
    const margin = 0.3; // 30% margin
    const cost = currentPrice * (1 - margin);
    return cost / (1 + 1 / Math.abs(elasticity));
  }

  private identifyPeakHours(forecast: ForecastResult[]): number[] {
    // Identify hours with highest predicted demand
    const hourlyDemand = forecast.map((f) => f.predicted_demand);
    const sortedIndices = hourlyDemand
      .map((demand, index) => ({ demand, index }))
      .sort((a, b) => b.demand - a.demand)
      .slice(0, 8) // Top 8 hours
      .map((item) => item.index);

    return sortedIndices;
  }

  private generateInventorySuggestions(
    forecast: ForecastResult[],
    serviceType: string
  ): {
    high_demand_items: string[];
    low_demand_items: string[];
  } {
    // Simplified inventory suggestions based on service type
    const suggestions = {
      high_demand_items: [] as string[],
      low_demand_items: [] as string[],
    };

    const avgDemand =
      forecast.reduce((sum, f) => sum + f.predicted_demand, 0) /
      forecast.length;

    if (serviceType === 'restaurant') {
      if (avgDemand > 50) {
        suggestions.high_demand_items = [
          'popular_menu_items',
          'beverages',
          'desserts',
        ];
        suggestions.low_demand_items = ['specialty_items', 'seasonal_menu'];
      }
    } else if (serviceType === 'spa') {
      if (avgDemand > 20) {
        suggestions.high_demand_items = [
          'massage_services',
          'facial_treatments',
        ];
        suggestions.low_demand_items = [
          'specialty_treatments',
          'group_packages',
        ];
      }
    }

    return suggestions;
  }
}

// =============================================================================
// EXPORT SINGLETON INSTANCE
// =============================================================================

export const demandForecastingSystem = new DemandForecastingSystem();
