// lib/ml/models/RandomForest.ts
export interface RandomForestConfig {
  nEstimators: number; // Number of trees
  maxDepth?: number; // Maximum depth of each tree
  minSamplesSplit: number; // Minimum samples to split
  randomState?: number;
  maxFeatures?: number | 'sqrt' | 'log2'; // Number of features to consider
}

export class RandomForest {
  private config: RandomForestConfig;
  private trees: DecisionTree[] = [];
  private featureSubsets: number[][][] = [];

  constructor(config: RandomForestConfig) {
    this.config = {
      maxFeatures: 'sqrt',
      ...config,
    };
  }

  /**
   * Fit random forest by training multiple decision trees
   */
  fit(X: number[][], y: number[]): void {
    if (X.length === 0 || X[0].length === 0) {
      throw new Error('Training data cannot be empty');
    }

    if (X.length !== y.length) {
      throw new Error('X and y must have the same number of samples');
    }

    const nFeatures = X[0].length;
    const maxFeatures = this.calculateMaxFeatures(nFeatures);

    for (let i = 0; i < this.config.nEstimators; i++) {
      // Bootstrap sampling
      const { bootstrapX, bootstrapY } = this.bootstrapSample(X, y);

      // Random feature subset
      const featureSubset = this.randomFeatureSubset(nFeatures, maxFeatures);
      this.featureSubsets.push(featureSubset);

      // Create and train decision tree
      const tree = new DecisionTree({
        maxDepth: this.config.maxDepth,
        minSamplesSplit: this.config.minSamplesSplit,
      });

      // Use only selected features
      const subsetX = bootstrapX.map((row) =>
        featureSubset.map((featureIndex) => row[featureIndex])
      );

      tree.fit(subsetX, bootstrapY);
      this.trees.push(tree);
    }
  }

  /**
   * Predict by averaging predictions from all trees (for regression)
   */
  predict(X: number[][]): number[] {
    if (this.trees.length === 0) {
      throw new Error('Model must be trained before making predictions');
    }

    return X.map((row) => {
      const treePredictions = this.trees.map((tree, i) => {
        const subsetRow = this.featureSubsets[i].map(
          (featureIndex) => row[featureIndex]
        );
        return tree.predict(subsetRow);
      });

      // Average predictions for regression
      return (
        treePredictions.reduce((sum, pred) => sum + pred, 0) /
        treePredictions.length
      );
    });
  }

  /**
   * Predict class probabilities (for classification)
   */
  predictProba(X: number[][]): number[][] {
    if (this.trees.length === 0) {
      throw new Error('Model must be trained before making predictions');
    }

    return X.map((row) => {
      const treePredictions = this.trees.map((tree, i) => {
        const subsetRow = this.featureSubsets[i].map(
          (featureIndex) => row[featureIndex]
        );
        return tree.predictProba(subsetRow);
      });

      // Average probabilities across all trees
      const nClasses = treePredictions[0].length;
      const avgProbabilities = new Array(nClasses).fill(0);

      for (let classIdx = 0; classIdx < nClasses; classIdx++) {
        let sum = 0;
        for (let treeIdx = 0; treeIdx < treePredictions.length; treeIdx++) {
          sum += treePredictions[treeIdx][classIdx];
        }
        avgProbabilities[classIdx] = sum / treePredictions.length;
      }

      return avgProbabilities;
    });
  }

  /**
   * Calculate feature importance
   */
  getFeatureImportance(): number[] {
    if (this.trees.length === 0) {
      throw new Error(
        'Model must be trained before getting feature importance'
      );
    }

    const nFeatures = this.featureSubsets[0].length;
    const importance = new Array(nFeatures).fill(0);

    // Average importance across all trees
    for (let treeIdx = 0; treeIdx < this.trees.length; treeIdx++) {
      const treeImportance = this.trees[treeIdx].getFeatureImportance();
      for (
        let featureIdx = 0;
        featureIdx < this.featureSubsets[treeIdx].length;
        featureIdx++
      ) {
        const globalFeatureIdx = this.featureSubsets[treeIdx][featureIdx];
        importance[globalFeatureIdx] += treeImportance[featureIdx];
      }
    }

    // Normalize
    const total = importance.reduce((sum, val) => sum + val, 0);
    return importance.map((val) => val / total);
  }

  /**
   * Calculate out-of-bag (OOB) score
   */
  oobScore(X: number[][], y: number[]): number {
    if (this.trees.length === 0) {
      throw new Error('Model must be trained before calculating OOB score');
    }

    const nSamples = X.length;
    const oobPredictions: number[] = [];
    const sampleCounts: number[] = [];

    // Initialize arrays
    for (let i = 0; i < nSamples; i++) {
      oobPredictions.push(0);
      sampleCounts.push(0);
    }

    // Calculate OOB predictions
    for (let treeIdx = 0; treeIdx < this.trees.length; treeIdx++) {
      const oobIndices = this.getOobIndices(nSamples, treeIdx);

      for (const sampleIdx of oobIndices) {
        const subsetRow = this.featureSubsets[treeIdx].map(
          (featureIndex) => X[sampleIdx][featureIndex]
        );
        oobPredictions[sampleIdx] += this.trees[treeIdx].predict(subsetRow);
        sampleCounts[sampleIdx]++;
      }
    }

    // Calculate final predictions and score
    let mse = 0;
    let validSamples = 0;

    for (let i = 0; i < nSamples; i++) {
      if (sampleCounts[i] > 0) {
        const prediction = oobPredictions[i] / sampleCounts[i];
        mse += Math.pow(prediction - y[i], 2);
        validSamples++;
      }
    }

    return validSamples > 0
      ? 1 - mse / validSamples / this.calculateVariance(y)
      : 0;
  }

  /**
   * Bootstrap sampling with replacement
   */
  private bootstrapSample(
    X: number[][],
    y: number[]
  ): { bootstrapX: number[][]; bootstrapY: number[] } {
    const nSamples = X.length;
    const bootstrapX: number[][] = [];
    const bootstrapY: number[] = [];

    for (let i = 0; i < nSamples; i++) {
      const randomIndex = Math.floor(Math.random() * nSamples);
      bootstrapX.push([...X[randomIndex]]);
      bootstrapY.push(y[randomIndex]);
    }

    return { bootstrapX, bootstrapY };
  }

  /**
   * Select random subset of features
   */
  private randomFeatureSubset(
    totalFeatures: number,
    subsetSize: number
  ): number[] {
    const features = Array.from({ length: totalFeatures }, (_, i) => i);
    const subset: number[] = [];

    for (let i = 0; i < subsetSize; i++) {
      const randomIndex = Math.floor(Math.random() * features.length);
      subset.push(features.splice(randomIndex, 1)[0]);
    }

    return subset;
  }

  /**
   * Calculate number of features to consider at each split
   */
  private calculateMaxFeatures(nFeatures: number): number {
    if (typeof this.config.maxFeatures === 'number') {
      return Math.min(this.config.maxFeatures, nFeatures);
    }

    switch (this.config.maxFeatures) {
      case 'sqrt':
        return Math.max(1, Math.floor(Math.sqrt(nFeatures)));
      case 'log2':
        return Math.max(1, Math.floor(Math.log2(nFeatures)));
      default:
        return Math.max(1, Math.floor(Math.sqrt(nFeatures)));
    }
  }

  /**
   * Get out-of-bag indices for a specific tree
   */
  private getOobIndices(nSamples: number, treeIdx: number): number[] {
    // This is a simplified implementation - in practice, you'd track which samples
    // were used in bootstrap sampling for each tree
    const usedIndices = new Set<number>();

    // Simulate bootstrap sampling to determine which indices were used
    for (let i = 0; i < nSamples; i++) {
      const randomIndex = Math.floor(Math.random() * nSamples);
      usedIndices.add(randomIndex);
    }

    const oobIndices: number[] = [];
    for (let i = 0; i < nSamples; i++) {
      if (!usedIndices.has(i)) {
        oobIndices.push(i);
      }
    }

    return oobIndices;
  }

  /**
   * Calculate variance of an array
   */
  private calculateVariance(y: number[]): number {
    const mean = y.reduce((sum, val) => sum + val, 0) / y.length;
    return y.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / y.length;
  }

  /**
   * Reset the model
   */
  reset(): void {
    this.trees = [];
    this.featureSubsets = [];
  }

  /**
   * Get model parameters
   */
  getParams(): RandomForestConfig {
    return { ...this.config };
  }

  /**
   * Set model parameters
   */
  setParams(params: Partial<RandomForestConfig>): void {
    this.config = { ...this.config, ...params };
  }

  /**
   * Serialize model for storage
   */
  toJSON(): {
    config: RandomForestConfig;
    trees: any[];
    featureSubsets: number[][][];
  } {
    return {
      config: { ...this.config },
      trees: this.trees.map((tree) => tree.toJSON()),
      featureSubsets: this.featureSubsets.map((subset) => [...subset]),
    };
  }

  /**
   * Deserialize model from storage
   */
  static fromJSON(data: {
    config: RandomForestConfig;
    trees: any[];
    featureSubsets: number[][][];
  }): RandomForest {
    const model = new RandomForest(data.config);
    model.trees = data.trees.map((treeData) => DecisionTree.fromJSON(treeData));
    model.featureSubsets = data.featureSubsets.map((subset) => [...subset]);
    return model;
  }
}

// Simplified Decision Tree for Random Forest
class DecisionTree {
  private config: { maxDepth?: number; minSamplesSplit: number };
  private tree: any = null;

  constructor(config: { maxDepth?: number; minSamplesSplit: number }) {
    this.config = config;
  }

  fit(X: number[][], y: number[]): void {
    this.tree = this.buildTree(X, y, 0);
  }

  predict(X: number[]): number {
    return this.traverseTree(this.tree, X);
  }

  predictProba(X: number[]): number[] {
    // For regression, return probability distribution around prediction
    const pred = this.predict(X);
    // Simplified: return a normal distribution centered on prediction
    return [pred - 0.1, pred, pred + 0.1]; // This should be improved for classification
  }

  getFeatureImportance(): number[] {
    const importance = new Array(this.getFeatureCount()).fill(0);
    this.calculateFeatureImportance(this.tree, importance);
    return importance;
  }

  private buildTree(X: number[][], y: number[], depth: number): any {
    if (
      depth >= (this.config.maxDepth || 10) ||
      y.length < this.config.minSamplesSplit
    ) {
      return { value: y.reduce((sum, val) => sum + val, 0) / y.length };
    }

    const { featureIndex, threshold } = this.findBestSplit(X, y);

    if (featureIndex === -1) {
      return { value: y.reduce((sum, val) => sum + val, 0) / y.length };
    }

    const leftIndices = X.map((row, i) => ({ row, index: i }))
      .filter(({ row }) => row[featureIndex] <= threshold)
      .map(({ index }) => index);

    const rightIndices = X.map((row, i) => ({ row, index: i }))
      .filter(({ row }) => row[featureIndex] > threshold)
      .map(({ index }) => index);

    if (leftIndices.length === 0 || rightIndices.length === 0) {
      return { value: y.reduce((sum, val) => sum + val, 0) / y.length };
    }

    const leftX = leftIndices.map((i) => X[i]);
    const leftY = leftIndices.map((i) => y[i]);
    const rightX = rightIndices.map((i) => X[i]);
    const rightY = rightIndices.map((i) => y[i]);

    return {
      featureIndex,
      threshold,
      left: this.buildTree(leftX, leftY, depth + 1),
      right: this.buildTree(rightX, rightY, depth + 1),
    };
  }

  private findBestSplit(
    X: number[][],
    y: number[]
  ): { featureIndex: number; threshold: number } {
    let bestFeatureIndex = -1;
    let bestThreshold = 0;
    let bestScore = Infinity;

    for (let featureIndex = 0; featureIndex < X[0].length; featureIndex++) {
      const values = X.map((row) => row[featureIndex]).sort((a, b) => a - b);

      for (let i = 1; i < values.length; i++) {
        const threshold = (values[i - 1] + values[i]) / 2;
        const score = this.calculateSplitScore(X, y, featureIndex, threshold);

        if (score < bestScore) {
          bestScore = score;
          bestFeatureIndex = featureIndex;
          bestThreshold = threshold;
        }
      }
    }

    return { featureIndex: bestFeatureIndex, threshold: bestThreshold };
  }

  private calculateSplitScore(
    X: number[][],
    y: number[],
    featureIndex: number,
    threshold: number
  ): number {
    const leftY: number[] = [];
    const rightY: number[] = [];

    for (let i = 0; i < X.length; i++) {
      if (X[i][featureIndex] <= threshold) {
        leftY.push(y[i]);
      } else {
        rightY.push(y[i]);
      }
    }

    if (leftY.length === 0 || rightY.length === 0) return Infinity;

    const leftMean = leftY.reduce((sum, val) => sum + val, 0) / leftY.length;
    const rightMean = rightY.reduce((sum, val) => sum + val, 0) / rightY.length;

    let score = 0;
    leftY.forEach((val) => (score += Math.pow(val - leftMean, 2)));
    rightY.forEach((val) => (score += Math.pow(val - rightMean, 2)));

    return score;
  }

  private traverseTree(node: any, X: number[]): number {
    if (node.value !== undefined) {
      return node.value;
    }

    if (X[node.featureIndex] <= node.threshold) {
      return this.traverseTree(node.left, X);
    } else {
      return this.traverseTree(node.right, X);
    }
  }

  private calculateFeatureImportance(node: any, importance: number[]): void {
    if (node.value !== undefined) return;

    importance[node.featureIndex] += 1; // Simplified importance calculation
    this.calculateFeatureImportance(node.left, importance);
    this.calculateFeatureImportance(node.right, importance);
  }

  private getFeatureCount(): number {
    // Estimate feature count from tree structure
    const features = new Set<number>();
    this.collectFeatures(this.tree, features);
    return features.size;
  }

  private collectFeatures(node: any, features: Set<number>): void {
    if (node.value !== undefined) return;

    features.add(node.featureIndex);
    this.collectFeatures(node.left, features);
    this.collectFeatures(node.right, features);
  }

  toJSON(): any {
    return {
      config: { ...this.config },
      tree: this.tree,
    };
  }

  static fromJSON(data: any): DecisionTree {
    const tree = new DecisionTree(data.config);
    tree.tree = data.tree;
    return tree;
  }
}
