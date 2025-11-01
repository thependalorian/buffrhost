// lib/ml/pipeline/MLPipeline.ts
import { DataPreparation } from '../data/DataPreparation';
import { LinearRegression } from '../models/LinearRegression';
import { LogisticRegression } from '../models/LogisticRegression';
import { RandomForest } from '../models/RandomForest';
import { ModelEvaluation } from '../evaluation/ModelEvaluation';

export interface MLPipelineConfig {
  preprocessing: {
    standardize: boolean;
    polynomialFeatures: number;
    handleMissing: boolean;
    removeOutliers: boolean;
  };
  model: {
    type: 'linear' | 'logistic' | 'randomForest';
    config: any;
  };
  evaluation: {
    crossValidationFolds: number;
    metrics: string[];
    testSize: number;
  };
  featureEngineering?: {
    featureSelection: boolean;
    correlationThreshold: number;
  };
}

export class MLPipeline {
  private config: MLPipelineConfig;
  private preprocessor: any = null;
  private model: any = null;
  private isTrained: boolean = false;
  private featureStats: any = null;
  private evaluationResults: any = null;

  constructor(config: MLPipelineConfig) {
    this.config = config;
  }

  /**
   * Train the complete ML pipeline
   */
  async fit(X: number[][], y: number[]): Promise<void> {
    try {
      console.log('[BuffrIcon name="rocket"] Starting ML pipeline training...');

      // Data preprocessing
      let processedX = await this.preprocessData(X, y);
      console.log('[BuffrIcon name="check"] Data preprocessing completed');

      // Feature engineering
      if (this.config.featureEngineering?.featureSelection) {
        processedX = await this.selectFeatures(processedX, y);
        console.log('[BuffrIcon name="check"] Feature selection completed');
      }

      // Split data for evaluation
      const { XTrain, XTest, yTrain, yTest } = DataPreparation.trainTestSplit(
        processedX,
        y,
        this.config.evaluation.testSize,
        42 // Fixed random state for reproducibility
      );

      // Model training
      this.model = this.createModel();
      this.model.fit(XTrain, yTrain);
      console.log('[BuffrIcon name="check"] Model training completed');

      // Model evaluation
      this.evaluationResults = await this.evaluateModel(
        this.model,
        XTest,
        yTest
      );
      console.log('[BuffrIcon name="check"] Model evaluation completed');

      this.isTrained = true;
      console.log(
        '[BuffrIcon name="celebration"] ML pipeline training completed successfully!'
      );
    } catch (error) {
      console.error(
        '[BuffrIcon name="alert"] Pipeline training failed:',
        error
      );
      throw error;
    }
  }

  /**
   * Make predictions with preprocessing
   */
  async predict(X: number[][]): Promise<number[]> {
    if (!this.isTrained) {
      throw new Error('Pipeline must be trained before making predictions');
    }

    try {
      let processedX = this.applyPreprocessing(X);

      // Apply feature selection if configured
      if (this.config.featureEngineering?.featureSelection) {
        processedX = this.applyFeatureSelection(processedX);
      }

      return this.model.predict(processedX);
    } catch (error) {
      console.error(
        '[BuffrIcon name="alert"] Pipeline prediction failed:',
        error
      );
      throw error;
    }
  }

  /**
   * Get prediction probabilities (for classification)
   */
  async predictProba(X: number[][]): Promise<number[][]> {
    if (!this.isTrained) {
      throw new Error('Pipeline must be trained before making predictions');
    }

    if (!this.model.predictProba) {
      throw new Error('Model does not support probability predictions');
    }

    try {
      let processedX = this.applyPreprocessing(X);

      if (this.config.featureEngineering?.featureSelection) {
        processedX = this.applyFeatureSelection(processedX);
      }

      return this.model.predictProba(processedX);
    } catch (error) {
      console.error(
        '[BuffrIcon name="alert"] Pipeline probability prediction failed:',
        error
      );
      throw error;
    }
  }

  /**
   * Evaluate pipeline performance
   */
  async evaluate(
    X: number[][],
    y: number[]
  ): Promise<{
    crossValidation: any;
    testMetrics: any;
    featureImportance?: number[];
    modelStats: any;
  }> {
    if (!this.isTrained) {
      throw new Error('Pipeline must be trained before evaluation');
    }

    const crossValidation = ModelEvaluation.crossValidate(
      this.model,
      X,
      y,
      this.config.evaluation.crossValidationFolds,
      this.config.evaluation.metrics[0] as any
    );

    const predictions = await this.predict(X);
    const testMetrics = this.config.evaluation.metrics.map((metric) =>
      ModelEvaluation.calculateMetric(predictions, y, metric)
    );

    const featureImportance = this.model.getFeatureImportance
      ? this.model.getFeatureImportance()
      : undefined;

    return {
      crossValidation,
      testMetrics,
      featureImportance,
      modelStats: this.evaluationResults,
    };
  }

  /**
   * Preprocess training data
   */
  private async preprocessData(
    X: number[][],
    y: number[]
  ): Promise<number[][]> {
    let processedX = [...X.map((row) => [...row])]; // Deep copy

    // Handle missing values
    if (this.config.preprocessing.handleMissing) {
      processedX = DataPreparation.imputeMissingValues(processedX);
    }

    // Remove outliers
    if (this.config.preprocessing.removeOutliers) {
      processedX = DataPreparation.removeOutliers(processedX);
    }

    // Create polynomial features
    if (this.config.preprocessing.polynomialFeatures > 1) {
      processedX = DataPreparation.createPolynomialFeatures(
        processedX,
        this.config.preprocessing.polynomialFeatures
      );
    }

    // Standardize features
    if (this.config.preprocessing.standardize) {
      processedX = DataPreparation.standardizeFeatures(processedX);
    }

    // Store feature statistics for later use
    this.featureStats = DataPreparation.calculateFeatureStats(processedX);

    return processedX;
  }

  /**
   * Apply preprocessing to new data
   */
  private applyPreprocessing(X: number[][]): number[][] {
    let processedX = [...X.map((row) => [...row])]; // Deep copy

    // Handle missing values
    if (this.config.preprocessing.handleMissing) {
      processedX = DataPreparation.imputeMissingValues(processedX);
    }

    // Create polynomial features
    if (this.config.preprocessing.polynomialFeatures > 1) {
      processedX = DataPreparation.createPolynomialFeatures(
        processedX,
        this.config.preprocessing.polynomialFeatures
      );
    }

    // Standardize features (using training statistics)
    if (this.config.preprocessing.standardize && this.featureStats) {
      processedX = processedX.map((row) =>
        row.map(
          (val, col) =>
            (val - this.featureStats.means[col]) / this.featureStats.stds[col]
        )
      );
    }

    return processedX;
  }

  /**
   * Feature selection based on correlation
   */
  private async selectFeatures(
    X: number[][],
    y: number[]
  ): Promise<number[][]> {
    // Simple correlation-based feature selection
    const correlations = X[0].map((_, col) => {
      const featureValues = X.map((row) => row[col]);
      return this.calculateCorrelation(featureValues, y);
    });

    const threshold =
      this.config.featureEngineering?.correlationThreshold || 0.1;
    const selectedFeatures = correlations
      .map((corr, idx) => ({ corr: Math.abs(corr), idx }))
      .filter((item) => item.corr >= threshold)
      .sort((a, b) => b.corr - a.corr)
      .map((item) => item.idx);

    return X.map((row) => selectedFeatures.map((idx) => row[idx]));
  }

  /**
   * Apply feature selection to new data
   */
  private applyFeatureSelection(X: number[][]): number[][] {
    // This would need to store the selected feature indices during training
    // For now, return X unchanged
    return X;
  }

  /**
   * Create model instance
   */
  private createModel(): any {
    switch (this.config.model.type) {
      case 'linear':
        return new LinearRegression(this.config.model.config);
      case 'logistic':
        return new LogisticRegression(this.config.model.config);
      case 'randomForest':
        return new RandomForest(this.config.model.config);
      default:
        throw new Error(`Unsupported model type: ${this.config.model.type}`);
    }
  }

  /**
   * Evaluate trained model
   */
  private async evaluateModel(
    model: any,
    XTest: number[][],
    yTest: number[]
  ): Promise<any> {
    const predictions = model.predict(XTest);

    const metrics = {};
    for (const metric of this.config.evaluation.metrics) {
      metrics[metric] = ModelEvaluation.calculateMetric(
        predictions,
        yTest,
        metric
      );
    }

    // Additional model-specific metrics
    if (model.getFeatureImportance) {
      metrics['featureImportance'] = model.getFeatureImportance();
    }

    if (model.score) {
      metrics['modelScore'] = model.score(XTest, yTest);
    }

    return metrics;
  }

  /**
   * Calculate Pearson correlation coefficient
   */
  private calculateCorrelation(x: number[], y: number[]): number {
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

  /**
   * Get pipeline status
   */
  getStatus(): {
    isTrained: boolean;
    config: MLPipelineConfig;
    evaluationResults?: any;
    featureStats?: any;
  } {
    return {
      isTrained: this.isTrained,
      config: { ...this.config },
      evaluationResults: this.evaluationResults,
      featureStats: this.featureStats,
    };
  }

  /**
   * Reset the pipeline
   */
  reset(): void {
    this.preprocessor = null;
    this.model = null;
    this.isTrained = false;
    this.featureStats = null;
    this.evaluationResults = null;
  }

  /**
   * Save pipeline for deployment
   */
  async save(path: string): Promise<void> {
    const pipelineData = {
      config: this.config,
      model: this.model ? this.model.toJSON() : null,
      isTrained: this.isTrained,
      featureStats: this.featureStats,
      evaluationResults: this.evaluationResults,
    };

    // In a real implementation, you'd save to a file or database
    console.log(`💾 Saving pipeline to ${path}`, pipelineData);
  }

  /**
   * Load pipeline from storage
   */
  static async load(path: string): Promise<MLPipeline> {
    // In a real implementation, you'd load from a file or database
    console.log(`📂 Loading pipeline from ${path}`);
    throw new Error('Load functionality not implemented yet');
  }

  /**
   * Get model explainability information
   */
  getExplainability(): {
    featureImportance?: number[];
    modelCoefficients?: any;
    preprocessingSteps: string[];
  } {
    const preprocessingSteps: string[] = [];

    if (this.config.preprocessing.handleMissing) {
      preprocessingSteps.push('Missing value imputation');
    }
    if (this.config.preprocessing.removeOutliers) {
      preprocessingSteps.push('Outlier removal');
    }
    if (this.config.preprocessing.polynomialFeatures > 1) {
      preprocessingSteps.push(
        `Polynomial features (degree ${this.config.preprocessing.polynomialFeatures})`
      );
    }
    if (this.config.preprocessing.standardize) {
      preprocessingSteps.push('Feature standardization');
    }

    const result: any = {
      preprocessingSteps,
    };

    if (this.model && this.model.getFeatureImportance) {
      result.featureImportance = this.model.getFeatureImportance();
    }

    if (this.model && this.model.getCoefficients) {
      result.modelCoefficients = this.model.getCoefficients();
    }

    return result;
  }
}
