// lib/ml/models/LogisticRegression.ts
export class LogisticRegression {
  private weights: number[] = [];
  private bias: number = 0;
  private config: {
    learningRate: number;
    maxIterations: number;
    tolerance: number;
  };

  constructor(
    config: {
      learningRate?: number;
      maxIterations?: number;
      tolerance?: number;
    } = {}
  ) {
    this.config = {
      learningRate: config.learningRate || 0.01,
      maxIterations: config.maxIterations || 1000,
      tolerance: config.tolerance || 1e-6,
    };
  }

  /**
   * Sigmoid activation function
   */
  private sigmoid(z: number): number {
    return 1 / (1 + Math.exp(-z));
  }

  /**
   * Fit logistic regression model using gradient descent
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

    this.weights = new Array(nFeatures).fill(0);
    this.bias = 0;

    for (
      let iteration = 0;
      iteration < this.config.maxIterations;
      iteration++
    ) {
      const predictions = this.predictProbabilitiesBatch(X);

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
   * Predict churn probability
   */
  predictProbability(X: number[]): number {
    if (this.weights.length === 0) {
      throw new Error('Model must be trained before making predictions');
    }

    if (X.length !== this.weights.length) {
      throw new Error(
        `Expected ${this.weights.length} features, got ${X.length}`
      );
    }

    let z = this.bias;
    for (let i = 0; i < this.weights.length; i++) {
      z += this.weights[i] * X[i];
    }
    return this.sigmoid(z);
  }

  /**
   * Predict churn class (0 = retain, 1 = churn)
   */
  predict(X: number[], threshold: number = 0.5): number {
    return this.predictProbability(X) >= threshold ? 1 : 0;
  }

  /**
   * Batch prediction for probabilities
   */
  private predictProbabilitiesBatch(X: number[][]): number[] {
    return X.map((row) => this.predictProbability(row));
  }

  /**
   * Batch prediction for classes
   */
  predictBatch(X: number[][], threshold: number = 0.5): number[] {
    return X.map((row) => this.predict(row, threshold));
  }

  /**
   * Calculate accuracy score
   */
  score(X: number[][], y: number[], threshold: number = 0.5): number {
    if (this.weights.length === 0) {
      throw new Error('Model must be trained before scoring');
    }

    const predictions = this.predictBatch(X, threshold);
    let correct = 0;
    for (let i = 0; i < predictions.length; i++) {
      if (predictions[i] === y[i]) correct++;
    }
    return correct / predictions.length;
  }

  /**
   * Calculate precision, recall, and F1-score
   */
  getClassificationMetrics(
    X: number[][],
    y: number[],
    threshold: number = 0.5
  ): { precision: number; recall: number; f1Score: number; accuracy: number } {
    const predictions = this.predictBatch(X, threshold);

    let truePositives = 0,
      trueNegatives = 0,
      falsePositives = 0,
      falseNegatives = 0;

    for (let i = 0; i < predictions.length; i++) {
      if (predictions[i] === 1 && y[i] === 1) truePositives++;
      else if (predictions[i] === 0 && y[i] === 0) trueNegatives++;
      else if (predictions[i] === 1 && y[i] === 0) falsePositives++;
      else if (predictions[i] === 0 && y[i] === 1) falseNegatives++;
    }

    const precision = truePositives / (truePositives + falsePositives) || 0;
    const recall = truePositives / (truePositives + falseNegatives) || 0;
    const f1Score = (2 * (precision * recall)) / (precision + recall) || 0;
    const accuracy =
      (truePositives + trueNegatives) /
      (truePositives + trueNegatives + falsePositives + falseNegatives);

    return { precision, recall, f1Score, accuracy };
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
   * Calculate log loss (cross-entropy loss)
   */
  logLoss(X: number[][], y: number[]): number {
    if (this.weights.length === 0) {
      throw new Error('Model must be trained before calculating loss');
    }

    const probabilities = this.predictProbabilitiesBatch(X);
    let loss = 0;

    for (let i = 0; i < probabilities.length; i++) {
      const prob = Math.max(Math.min(probabilities[i], 1 - 1e-15), 1e-15); // Prevent log(0)
      loss -= y[i] * Math.log(prob) + (1 - y[i]) * Math.log(1 - prob);
    }

    return loss / probabilities.length;
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
  getParams(): {
    learningRate: number;
    maxIterations: number;
    tolerance: number;
  } {
    return { ...this.config };
  }

  /**
   * Set model parameters
   */
  setParams(
    params: Partial<{
      learningRate: number;
      maxIterations: number;
      tolerance: number;
    }>
  ): void {
    this.config = { ...this.config, ...params };
  }

  /**
   * Serialize model for storage
   */
  toJSON(): {
    weights: number[];
    bias: number;
    config: { learningRate: number; maxIterations: number; tolerance: number };
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
    config: { learningRate: number; maxIterations: number; tolerance: number };
  }): LogisticRegression {
    const model = new LogisticRegression(data.config);
    model.weights = [...data.weights];
    model.bias = data.bias;
    return model;
  }
}
