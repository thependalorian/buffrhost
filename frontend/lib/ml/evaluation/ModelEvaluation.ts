// lib/ml/evaluation/ModelEvaluation.ts
export class ModelEvaluation {
  /**
   * K-fold cross-validation for model evaluation
   */
  static crossValidate(
    model: {
      fit: (X: number[][], y: number[]) => void;
      predict: (X: number[][]) => number[];
    },
    X: number[][],
    y: number[],
    k: number = 5,
    metric: 'mae' | 'mse' | 'rmse' | 'r2' = 'r2'
  ): { scores: number[]; meanScore: number; stdScore: number } {
    if (k < 2) {
      throw new Error('k must be at least 2');
    }

    if (X.length < k) {
      throw new Error('Dataset must have at least k samples');
    }

    const foldSize = Math.floor(X.length / k);
    const scores: number[] = [];

    for (let fold = 0; fold < k; fold++) {
      const testStart = fold * foldSize;
      const testEnd = fold === k - 1 ? X.length : (fold + 1) * foldSize;

      // Split data
      const XTrain = [...X.slice(0, testStart), ...X.slice(testEnd)];
      const yTrain = [...y.slice(0, testStart), ...y.slice(testEnd)];
      const XTest = X.slice(testStart, testEnd);
      const yTest = y.slice(testStart, testEnd);

      // Train and evaluate
      model.fit(XTrain, yTrain);
      const predictions = model.predict(XTest);
      const score = this.calculateMetric(predictions, yTest, metric);
      scores.push(score);
    }

    const meanScore =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - meanScore, 2), 0) /
      scores.length;
    const stdScore = Math.sqrt(variance);

    return { scores, meanScore, stdScore };
  }

  /**
   * Stratified K-fold cross-validation for classification
   */
  static stratifiedCrossValidate(
    model: {
      fit: (X: number[][], y: number[]) => void;
      predict: (X: number[][]) => number[];
    },
    X: number[][],
    y: number[],
    k: number = 5,
    metric: 'accuracy' | 'precision' | 'recall' | 'f1' = 'accuracy'
  ): { scores: number[]; meanScore: number; stdScore: number } {
    if (k < 2) {
      throw new Error('k must be at least 2');
    }

    // Get unique classes
    const classes = [...new Set(y)];
    const stratifiedFolds = this.createStratifiedFolds(X, y, k, classes);

    const scores: number[] = [];

    for (let fold = 0; fold < k; fold++) {
      const { XTrain, yTrain, XTest, yTest } = stratifiedFolds[fold];

      // Train and evaluate
      model.fit(XTrain, yTrain);
      const predictions = model.predict(XTest);
      const score = this.calculateClassificationMetric(
        predictions,
        yTest,
        metric
      );
      scores.push(score);
    }

    const meanScore =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - meanScore, 2), 0) /
      scores.length;
    const stdScore = Math.sqrt(variance);

    return { scores, meanScore, stdScore };
  }

  /**
   * Calculate various evaluation metrics
   */
  static calculateMetric(
    predictions: number[],
    actual: number[],
    metric: string
  ): number {
    switch (metric) {
      case 'mae':
        return this.meanAbsoluteError(predictions, actual);
      case 'mse':
        return this.meanSquaredError(predictions, actual);
      case 'rmse':
        return Math.sqrt(this.meanSquaredError(predictions, actual));
      case 'r2':
        return this.rSquared(predictions, actual);
      default:
        throw new Error(`Unknown metric: ${metric}`);
    }
  }

  /**
   * Calculate classification metrics
   */
  static calculateClassificationMetric(
    predictions: number[],
    actual: number[],
    metric: string
  ): number {
    switch (metric) {
      case 'accuracy':
        return this.accuracy(predictions, actual);
      case 'precision':
        return this.precision(predictions, actual);
      case 'recall':
        return this.recall(predictions, actual);
      case 'f1':
        return this.f1Score(predictions, actual);
      default:
        throw new Error(`Unknown classification metric: ${metric}`);
    }
  }

  static meanAbsoluteError(predictions: number[], actual: number[]): number {
    let sum = 0;
    for (let i = 0; i < predictions.length; i++) {
      sum += Math.abs(predictions[i] - actual[i]);
    }
    return sum / predictions.length;
  }

  static meanSquaredError(predictions: number[], actual: number[]): number {
    let sum = 0;
    for (let i = 0; i < predictions.length; i++) {
      sum += Math.pow(predictions[i] - actual[i], 2);
    }
    return sum / predictions.length;
  }

  static rSquared(predictions: number[], actual: number[]): number {
    const actualMean =
      actual.reduce((sum, val) => sum + val, 0) / actual.length;

    let ssRes = 0;
    let ssTot = 0;

    for (let i = 0; i < predictions.length; i++) {
      ssRes += Math.pow(actual[i] - predictions[i], 2);
      ssTot += Math.pow(actual[i] - actualMean, 2);
    }

    return ssTot === 0 ? 0 : 1 - ssRes / ssTot;
  }

  static accuracy(predictions: number[], actual: number[]): number {
    let correct = 0;
    for (let i = 0; i < predictions.length; i++) {
      if (Math.round(predictions[i]) === actual[i]) correct++;
    }
    return correct / predictions.length;
  }

  static precision(predictions: number[], actual: number[]): number {
    const cm = this.confusionMatrix(predictions, actual);
    return cm.truePositives / (cm.truePositives + cm.falsePositives) || 0;
  }

  static recall(predictions: number[], actual: number[]): number {
    const cm = this.confusionMatrix(predictions, actual);
    return cm.truePositives / (cm.truePositives + cm.falseNegatives) || 0;
  }

  static f1Score(predictions: number[], actual: number[]): number {
    const precision = this.precision(predictions, actual);
    const recall = this.recall(predictions, actual);
    return (2 * (precision * recall)) / (precision + recall) || 0;
  }

  /**
   * Confusion matrix for classification evaluation
   */
  static confusionMatrix(
    predictions: number[],
    actual: number[]
  ): {
    truePositives: number;
    trueNegatives: number;
    falsePositives: number;
    falseNegatives: number;
  } {
    let truePositives = 0,
      trueNegatives = 0,
      falsePositives = 0,
      falseNegatives = 0;

    for (let i = 0; i < predictions.length; i++) {
      const pred = Math.round(predictions[i]);
      const act = actual[i];

      if (pred === 1 && act === 1) truePositives++;
      else if (pred === 0 && act === 0) trueNegatives++;
      else if (pred === 1 && act === 0) falsePositives++;
      else if (pred === 0 && act === 1) falseNegatives++;
    }

    return { truePositives, trueNegatives, falsePositives, falseNegatives };
  }

  /**
   * Calculate precision, recall, and F1-score
   */
  static classificationMetrics(
    predictions: number[],
    actual: number[]
  ): {
    precision: number;
    recall: number;
    f1Score: number;
    accuracy: number;
  } {
    const cm = this.confusionMatrix(predictions, actual);

    const precision =
      cm.truePositives / (cm.truePositives + cm.falsePositives) || 0;
    const recall =
      cm.truePositives / (cm.truePositives + cm.falseNegatives) || 0;
    const f1Score = (2 * (precision * recall)) / (precision + recall) || 0;
    const accuracy =
      (cm.truePositives + cm.trueNegatives) /
      (cm.truePositives +
        cm.trueNegatives +
        cm.falsePositives +
        cm.falseNegatives);

    return { precision, recall, f1Score, accuracy };
  }

  /**
   * Learning curves to diagnose overfitting/underfitting
   */
  static learningCurve(
    model: {
      fit: (X: number[][], y: number[]) => void;
      predict: (X: number[][]) => number[];
    },
    X: number[][],
    y: number[],
    trainSizes: number[] = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    k: number = 5,
    metric: 'mae' | 'mse' | 'rmse' | 'r2' = 'r2'
  ): {
    trainSizes: number[];
    trainScores: number[];
    validationScores: number[];
  } {
    const trainScores: number[] = [];
    const validationScores: number[] = [];

    trainSizes.forEach((size) => {
      const nTrain = Math.floor(X.length * size);

      const XTrain = X.slice(0, nTrain);
      const yTrain = y.slice(0, nTrain);
      const XVal = X.slice(nTrain);
      const yVal = y.slice(nTrain);

      // Cross-validate on training set
      const cvResult = this.crossValidate(model, XTrain, yTrain, k, metric);
      trainScores.push(cvResult.meanScore);

      // Evaluate on validation set
      model.fit(XTrain, yTrain);
      const predictions = model.predict(XVal);
      const valScore = this.calculateMetric(predictions, yVal, metric);
      validationScores.push(valScore);
    });

    return { trainSizes, trainScores, validationScores };
  }

  /**
   * ROC Curve and AUC for binary classification
   */
  static rocCurve(
    predictions: number[],
    actual: number[]
  ): {
    fpr: number[];
    tpr: number[];
    thresholds: number[];
    auc: number;
  } {
    // Sort predictions and actual values by prediction score (descending)
    const paired = predictions
      .map((pred, i) => ({ pred, actual: actual[i] }))
      .sort((a, b) => b.pred - a.pred);

    const thresholds = [...new Set(paired.map((p) => p.pred))].sort(
      (a, b) => b - a
    );

    const fpr: number[] = [];
    const tpr: number[] = [];

    for (const threshold of thresholds) {
      let tp = 0,
        fp = 0,
        tn = 0,
        fn = 0;

      for (const pair of paired) {
        if (pair.pred >= threshold) {
          if (pair.actual === 1) tp++;
          else fp++;
        } else {
          if (pair.actual === 1) fn++;
          else tn++;
        }
      }

      fpr.push(fp / (fp + tn) || 0);
      tpr.push(tp / (tp + fn) || 0);
    }

    const auc = this.calculateAUC(fpr, tpr);

    return { fpr, tpr, thresholds, auc };
  }

  /**
   * Calculate Area Under Curve (AUC) using trapezoidal rule
   */
  static calculateAUC(fpr: number[], tpr: number[]): number {
    let auc = 0;
    for (let i = 1; i < fpr.length; i++) {
      auc += ((fpr[i] - fpr[i - 1]) * (tpr[i] + tpr[i - 1])) / 2;
    }
    return auc;
  }

  /**
   * Precision-Recall Curve
   */
  static precisionRecallCurve(
    predictions: number[],
    actual: number[]
  ): {
    precision: number[];
    recall: number[];
    thresholds: number[];
    auc: number;
  } {
    const paired = predictions
      .map((pred, i) => ({ pred, actual: actual[i] }))
      .sort((a, b) => b.pred - a.pred);

    const thresholds = [...new Set(paired.map((p) => p.pred))].sort(
      (a, b) => b - a
    );

    const precision: number[] = [];
    const recall: number[] = [];

    for (const threshold of thresholds) {
      let tp = 0,
        fp = 0,
        fn = 0;

      for (const pair of paired) {
        if (pair.pred >= threshold) {
          if (pair.actual === 1) tp++;
          else fp++;
        } else {
          if (pair.actual === 1) fn++;
        }
      }

      precision.push(tp / (tp + fp) || 0);
      recall.push(tp / (tp + fn) || 0);
    }

    const auc = this.calculateAUC(recall.reverse(), precision.reverse()); // Note: reversed for PR curve

    return { precision, recall, thresholds, auc };
  }

  /**
   * Create stratified folds for classification
   */
  private static createStratifiedFolds(
    X: number[][],
    y: number[],
    k: number,
    classes: number[]
  ): Array<{
    XTrain: number[][];
    yTrain: number[];
    XTest: number[][];
    yTest: number[];
  }> {
    const folds: Array<{
      XTrain: number[][];
      yTrain: number[];
      XTest: number[][];
      yTest: number[];
    }> = [];

    for (let fold = 0; fold < k; fold++) {
      const XTrain: number[][] = [];
      const yTrain: number[] = [];
      const XTest: number[][] = [];
      const yTest: number[] = [];

      // Stratify by class
      for (const classLabel of classes) {
        const classIndices = y
          .map((label, i) => ({ label, index: i }))
          .filter((item) => item.label === classLabel)
          .map((item) => item.index);

        const foldSize = Math.floor(classIndices.length / k);
        const testStart = fold * foldSize;
        const testEnd =
          fold === k - 1 ? classIndices.length : (fold + 1) * foldSize;

        const testIndices = classIndices.slice(testStart, testEnd);
        const trainIndices = [
          ...classIndices.slice(0, testStart),
          ...classIndices.slice(testEnd),
        ];

        // Add to folds
        trainIndices.forEach((idx) => {
          XTrain.push(X[idx]);
          yTrain.push(y[idx]);
        });

        testIndices.forEach((idx) => {
          XTest.push(X[idx]);
          yTest.push(y[idx]);
        });
      }

      folds.push({ XTrain, yTrain, XTest, yTest });
    }

    return folds;
  }

  /**
   * Model comparison utility
   */
  static compareModels(
    models: Array<{
      name: string;
      model: {
        fit: (X: number[][], y: number[]) => void;
        predict: (X: number[][]) => number[];
      };
    }>,
    X: number[][],
    y: number[],
    k: number = 5,
    metric: 'mae' | 'mse' | 'rmse' | 'r2' = 'r2'
  ): Array<{
    name: string;
    meanScore: number;
    stdScore: number;
    scores: number[];
  }> {
    return models.map(({ name, model }) => {
      const result = this.crossValidate(model, X, y, k, metric);
      return {
        name,
        meanScore: result.meanScore,
        stdScore: result.stdScore,
        scores: result.scores,
      };
    });
  }
}
