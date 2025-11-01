// lib/ml/models/LinearRegression.ts
export interface LinearRegressionConfig {
  learningRate: number;
  maxIterations: number;
  tolerance: number;
}

export class LinearRegression {
  private weights: number[] = [];
  private bias: number = 0;
  private config: LinearRegressionConfig;

  constructor(
    config: LinearRegressionConfig = {
      learningRate: 0.01,
      maxIterations: 1000,
      tolerance: 1e-6,
    }
  ) {
    this.config = config;
  }

  /**
   * Fit the model using gradient descent
   * Handles multi-feature regression for hospitality revenue prediction
   */
  fit(X: number[][], y: number[]): void {
    if (X.length === 0 || X[0].length === 0) {
      throw new Error('Training data cannot be empty');
    }

    if (X.length !== y.length) {
      throw new Error('X and y must have the same number of samples');
    }

    const nSamples = X.length;
    const nFeatures = X[0].length;

    // Initialize weights
    this.weights = new Array(nFeatures).fill(0);
    this.bias = 0;

    for (
      let iteration = 0;
      iteration < this.config.maxIterations;
      iteration++
    ) {
      const predictions = this.predictBatch(X);

      // Calculate gradients
      const dw = new Array(nFeatures).fill(0);
      let db = 0;

      for (let i = 0; i < nSamples; i++) {
        const error = predictions[i] - y[i];
        for (let j = 0; j < nFeatures; j++) {
          dw[j] += (error * X[i][j]) / nSamples;
        }
        db += error / nSamples;
      }

      // Update parameters
      for (let j = 0; j < nFeatures; j++) {
        this.weights[j] -= this.config.learningRate * dw[j];
      }
      this.bias -= this.config.learningRate * db;

      // Check convergence
      const maxGradient = Math.max(...dw.map(Math.abs), Math.abs(db));
      if (maxGradient < this.config.tolerance) {
        break;
      }
    }
  }

  /**
   * Predict revenue for new data points
   */
  predict(X: number[]): number {
    if (this.weights.length === 0) {
      throw new Error('Model must be trained before making predictions');
    }

    if (X.length !== this.weights.length) {
      throw new Error(
        `Expected ${this.weights.length} features, got ${X.length}`
      );
    }

    let prediction = this.bias;
    for (let i = 0; i < this.weights.length; i++) {
      prediction += this.weights[i] * X[i];
    }
    return prediction;
  }

  /**
   * Batch prediction for multiple data points
   */
  private predictBatch(X: number[][]): number[] {
    return X.map((row) => this.predict(row));
  }

  /**
   * Calculate R-squared score for model evaluation
   */
  score(X: number[][], y: number[]): number {
    if (this.weights.length === 0) {
      throw new Error('Model must be trained before scoring');
    }

    const predictions = this.predictBatch(X);
    const yMean = y.reduce((sum, val) => sum + val, 0) / y.length;

    let ssRes = 0;
    let ssTot = 0;

    for (let i = 0; i < predictions.length; i++) {
      ssRes += Math.pow(y[i] - predictions[i], 2);
      ssTot += Math.pow(y[i] - yMean, 2);
    }

    return ssTot === 0 ? 0 : 1 - ssRes / ssTot;
  }

  /**
   * Calculate Mean Absolute Error
   */
  mae(X: number[][], y: number[]): number {
    if (this.weights.length === 0) {
      throw new Error('Model must be trained before evaluation');
    }

    const predictions = this.predictBatch(X);
    let sum = 0;

    for (let i = 0; i < predictions.length; i++) {
      sum += Math.abs(predictions[i] - y[i]);
    }

    return sum / predictions.length;
  }

  /**
   * Calculate Mean Squared Error
   */
  mse(X: number[][], y: number[]): number {
    if (this.weights.length === 0) {
      throw new Error('Model must be trained before evaluation');
    }

    const predictions = this.predictBatch(X);
    let sum = 0;

    for (let i = 0; i < predictions.length; i++) {
      sum += Math.pow(predictions[i] - y[i], 2);
    }

    return sum / predictions.length;
  }

  /**
   * Calculate Root Mean Squared Error
   */
  rmse(X: number[][], y: number[]): number {
    return Math.sqrt(this.mse(X, y));
  }

  /**
   * Get model coefficients for feature importance
   */
  getCoefficients(): { weights: number[]; bias: number } {
    return {
      weights: [...this.weights],
      bias: this.bias,
    };
  }

  /**
   * Get feature importance (absolute values of weights)
   */
  getFeatureImportance(): number[] {
    return this.weights.map(Math.abs);
  }

  /**
   * Reset the model
   */
  reset(): void {
    this.weights = [];
    this.bias = 0;
  }

  /**
   * Get model parameters
   */
  getParams(): LinearRegressionConfig {
    return { ...this.config };
  }

  /**
   * Set model parameters
   */
  setParams(params: Partial<LinearRegressionConfig>): void {
    this.config = { ...this.config, ...params };
  }

  /**
   * Serialize model for storage
   */
  toJSON(): {
    weights: number[];
    bias: number;
    config: LinearRegressionConfig;
  } {
    return {
      weights: [...this.weights],
      bias: this.bias,
      config: { ...this.config },
    };
  }

  /**
   * Deserialize model from storage
   */
  static fromJSON(data: {
    weights: number[];
    bias: number;
    config: LinearRegressionConfig;
  }): LinearRegression {
    const model = new LinearRegression(data.config);
    model.weights = [...data.weights];
    model.bias = data.bias;
    return model;
  }
}
