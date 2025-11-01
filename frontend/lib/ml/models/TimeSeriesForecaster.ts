// lib/ml/models/TimeSeriesForecaster.ts
export interface TimeSeriesConfig {
  order: number; // AR order
  seasonalOrder?: number; // Seasonal AR order
  seasonalPeriod?: number; // Season length (e.g., 7 for weekly, 12 for monthly)
  learningRate?: number;
  maxIterations?: number;
}

export class TimeSeriesForecaster {
  private config: TimeSeriesConfig;
  private coefficients: number[] = [];
  private seasonalCoefficients: number[] = [];
  private intercept: number = 0;

  constructor(config: TimeSeriesConfig) {
    this.config = {
      learningRate: 0.01,
      maxIterations: 1000,
      ...config,
    };
  }

  /**
   * Fit ARIMA-like model for time series forecasting
   * Simplified implementation focusing on autoregressive component
   */
  fit(timeSeries: number[]): void {
    if (timeSeries.length === 0) {
      throw new Error('Time series data cannot be empty');
    }

    if (this.config.order >= timeSeries.length) {
      throw new Error(
        'AR order must be less than the length of the time series'
      );
    }

    const n = timeSeries.length;
    const order = this.config.order;

    // Prepare design matrix for AR terms
    const X: number[][] = [];
    const y: number[] = [];

    for (let i = order; i < n; i++) {
      const row = [];
      // AR terms
      for (let j = 1; j <= order; j++) {
        row.push(timeSeries[i - j]);
      }

      // Seasonal AR terms if specified
      if (this.config.seasonalOrder && this.config.seasonalPeriod) {
        for (let j = 1; j <= this.config.seasonalOrder; j++) {
          const seasonalLag = j * this.config.seasonalPeriod;
          if (i - seasonalLag >= 0) {
            row.push(timeSeries[i - seasonalLag]);
          } else {
            row.push(0); // Handle edge cases
          }
        }
      }

      X.push(row);
      y.push(timeSeries[i]);
    }

    // Fit linear model using gradient descent
    this.fitLinearModel(X, y);
  }

  /**
   * Forecast future values
   */
  forecast(horizon: number, historicalData?: number[]): number[] {
    if (this.coefficients.length === 0) {
      throw new Error('Model must be trained before making forecasts');
    }

    const data = historicalData || [];
    const forecasts: number[] = [];

    for (let h = 0; h < horizon; h++) {
      const nextValue = this.predictNext(data);
      forecasts.push(nextValue);
      data.push(nextValue);
    }

    return forecasts;
  }

  /**
   * Predict next value based on recent history
   */
  private predictNext(recentData: number[]): number {
    const order = this.config.order;
    let prediction = this.intercept;

    // AR terms
    for (let i = 0; i < order; i++) {
      const lagIndex = recentData.length - 1 - i;
      if (lagIndex >= 0) {
        prediction += this.coefficients[i] * recentData[lagIndex];
      }
    }

    // Seasonal AR terms
    if (this.config.seasonalOrder && this.config.seasonalPeriod) {
      for (let i = 0; i < this.config.seasonalOrder; i++) {
        const seasonalLag = (i + 1) * this.config.seasonalPeriod;
        const lagIndex = recentData.length - seasonalLag;
        if (lagIndex >= 0) {
          prediction += this.seasonalCoefficients[i] * recentData[lagIndex];
        }
      }
    }

    return prediction;
  }

  /**
   * Fit linear model using gradient descent (simplified)
   */
  private fitLinearModel(X: number[][], y: number[]): void {
    const n = X.length;
    const nFeatures = X[0].length;

    // Initialize coefficients
    this.coefficients = new Array(this.config.order).fill(0);
    this.seasonalCoefficients = this.config.seasonalOrder
      ? new Array(this.config.seasonalOrder).fill(0)
      : [];
    this.intercept = 0;

    const learningRate = this.config.learningRate || 0.01;
    const maxIterations = this.config.maxIterations || 1000;

    for (let iter = 0; iter < maxIterations; iter++) {
      let totalError = 0;

      for (let i = 0; i < n; i++) {
        let prediction = this.intercept;

        // AR terms
        for (let j = 0; j < this.config.order; j++) {
          prediction += this.coefficients[j] * X[i][j];
        }

        // Seasonal terms
        if (this.config.seasonalOrder) {
          for (let j = 0; j < this.config.seasonalOrder; j++) {
            const seasonalIndex = this.config.order + j;
            if (seasonalIndex < X[i].length) {
              prediction += this.seasonalCoefficients[j] * X[i][seasonalIndex];
            }
          }
        }

        const error = prediction - y[i];
        totalError += error * error;

        // Update intercept
        this.intercept -= (learningRate * error) / n;

        // Update AR coefficients
        for (let j = 0; j < this.config.order; j++) {
          this.coefficients[j] -= (learningRate * error * X[i][j]) / n;
        }

        // Update seasonal coefficients
        if (this.config.seasonalOrder) {
          for (let j = 0; j < this.config.seasonalOrder; j++) {
            const seasonalIndex = this.config.order + j;
            if (seasonalIndex < X[i].length) {
              this.seasonalCoefficients[j] -=
                (learningRate * error * X[i][seasonalIndex]) / n;
            }
          }
        }
      }

      // Early stopping
      if (totalError / n < 0.001) break;
    }
  }

  /**
   * Calculate forecast accuracy metrics
   */
  evaluateForecasts(
    actual: number[],
    predicted: number[]
  ): {
    mae: number;
    mse: number;
    rmse: number;
    mape: number;
    r2: number;
  } {
    if (actual.length !== predicted.length) {
      throw new Error('Actual and predicted arrays must have the same length');
    }

    let mae = 0,
      mse = 0,
      mape = 0;
    const actualMean =
      actual.reduce((sum, val) => sum + val, 0) / actual.length;
    let ssRes = 0,
      ssTot = 0;

    for (let i = 0; i < actual.length; i++) {
      const error = predicted[i] - actual[i];
      const absError = Math.abs(error);
      const absPercentError = Math.abs(error / actual[i]) * 100; // Convert to percentage

      mae += absError;
      mse += error * error;
      mape += absPercentError;

      ssRes += Math.pow(actual[i] - predicted[i], 2);
      ssTot += Math.pow(actual[i] - actualMean, 2);
    }

    const n = actual.length;
    mae /= n;
    mse /= n;
    mape /= n; // This is already in percentage
    const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

    return {
      mae,
      mse,
      rmse: Math.sqrt(mse),
      mape,
      r2,
    };
  }

  /**
   * Get autocorrelation function (ACF) values
   */
  autocorrelation(timeSeries: number[], maxLag: number = 20): number[] {
    const n = timeSeries.length;
    const mean = timeSeries.reduce((sum, val) => sum + val, 0) / n;
    const variance =
      timeSeries.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;

    const acf: number[] = [];

    for (let lag = 1; lag <= Math.min(maxLag, n - 1); lag++) {
      let covariance = 0;

      for (let i = lag; i < n; i++) {
        covariance += (timeSeries[i] - mean) * (timeSeries[i - lag] - mean);
      }

      covariance /= n - lag;
      acf.push(covariance / variance);
    }

    return acf;
  }

  /**
   * Detect seasonality in time series
   */
  detectSeasonality(
    timeSeries: number[],
    maxPeriod: number = 365
  ): number | null {
    const acf = this.autocorrelation(timeSeries, maxPeriod);
    let maxCorr = 0;
    let bestPeriod = null;

    for (let period = 7; period <= Math.min(maxPeriod, acf.length); period++) {
      if (acf[period - 1] > maxCorr) {
        maxCorr = acf[period - 1];
        bestPeriod = period;
      }
    }

    return maxCorr > 0.5 ? bestPeriod : null; // Only return if correlation is significant
  }

  /**
   * Decompose time series into trend, seasonal, and residual components
   */
  decompose(
    timeSeries: number[],
    seasonalPeriod?: number
  ): {
    trend: number[];
    seasonal: number[];
    residual: number[];
  } {
    const n = timeSeries.length;
    const period = seasonalPeriod || this.config.seasonalPeriod || 7;

    // Simple moving average for trend
    const trend: number[] = [];
    const window = Math.floor(period / 2);

    for (let i = 0; i < n; i++) {
      let sum = 0;
      let count = 0;

      for (
        let j = Math.max(0, i - window);
        j <= Math.min(n - 1, i + window);
        j++
      ) {
        sum += timeSeries[j];
        count++;
      }

      trend.push(sum / count);
    }

    // Extract seasonal component
    const seasonal: number[] = [];
    const seasonalAverages: { [key: number]: number[] } = {};

    for (let i = 0; i < n; i++) {
      const position = i % period;
      if (!seasonalAverages[position]) {
        seasonalAverages[position] = [];
      }
      seasonalAverages[position].push(timeSeries[i] - trend[i]);
    }

    const seasonalFactors: { [key: number]: number } = {};
    for (let pos = 0; pos < period; pos++) {
      const values = seasonalAverages[pos];
      seasonalFactors[pos] =
        values.reduce((sum, val) => sum + val, 0) / values.length;
    }

    for (let i = 0; i < n; i++) {
      seasonal.push(seasonalFactors[i % period]);
    }

    // Calculate residual
    const residual: number[] = [];
    for (let i = 0; i < n; i++) {
      residual.push(timeSeries[i] - trend[i] - seasonal[i]);
    }

    return { trend, seasonal, residual };
  }

  /**
   * Reset the model
   */
  reset(): void {
    this.coefficients = [];
    this.seasonalCoefficients = [];
    this.intercept = 0;
  }

  /**
   * Get model parameters
   */
  getParams(): TimeSeriesConfig {
    return { ...this.config };
  }

  /**
   * Set model parameters
   */
  setParams(params: Partial<TimeSeriesConfig>): void {
    this.config = { ...this.config, ...params };
  }

  /**
   * Get model coefficients
   */
  getCoefficients(): {
    ar: number[];
    seasonal: number[];
    intercept: number;
  } {
    return {
      ar: [...this.coefficients],
      seasonal: [...this.seasonalCoefficients],
      intercept: this.intercept,
    };
  }

  /**
   * Serialize model for storage
   */
  toJSON(): {
    config: TimeSeriesConfig;
    coefficients: number[];
    seasonalCoefficients: number[];
    intercept: number;
  } {
    return {
      config: { ...this.config },
      coefficients: [...this.coefficients],
      seasonalCoefficients: [...this.seasonalCoefficients],
      intercept: this.intercept,
    };
  }

  /**
   * Deserialize model from storage
   */
  static fromJSON(data: {
    config: TimeSeriesConfig;
    coefficients: number[];
    seasonalCoefficients: number[];
    intercept: number;
  }): TimeSeriesForecaster {
    const model = new TimeSeriesForecaster(data.config);
    model.coefficients = [...data.coefficients];
    model.seasonalCoefficients = [...data.seasonalCoefficients];
    model.intercept = data.intercept;
    return model;
  }
}
