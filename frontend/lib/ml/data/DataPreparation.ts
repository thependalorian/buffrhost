// lib/ml/data/DataPreparation.ts
export class DataPreparation {
  /**
   * Standardize numerical features using z-score normalization
   * Essential for gradient-based algorithms (Linear/Logistic Regression, Neural Networks)
   */
  static standardizeFeatures(data: number[][]): number[][] {
    if (data.length === 0 || data[0].length === 0) {
      throw new Error('Data array cannot be empty');
    }

    const nFeatures = data[0].length;
    const means = new Array(nFeatures).fill(0);
    const stds = new Array(nFeatures).fill(0);

    // Calculate means
    for (let col = 0; col < nFeatures; col++) {
      let sum = 0;
      for (let row = 0; row < data.length; row++) {
        sum += data[row][col];
      }
      means[col] = sum / data.length;
    }

    // Calculate standard deviations
    for (let col = 0; col < nFeatures; col++) {
      let variance = 0;
      for (let row = 0; row < data.length; row++) {
        variance += Math.pow(data[row][col] - means[col], 2);
      }
      stds[col] = Math.sqrt(variance / data.length);

      // Prevent division by zero
      if (stds[col] === 0) {
        stds[col] = 1;
      }
    }

    // Standardize
    return data.map((row) =>
      row.map((val, col) => (val - means[col]) / stds[col])
    );
  }

  /**
   * Min-max scaling for bounded features (0-1 range)
   * Good for neural networks and distance-based algorithms
   */
  static minMaxScale(
    data: number[][],
    featureRange: [number, number] = [0, 1]
  ): number[][] {
    if (data.length === 0 || data[0].length === 0) {
      throw new Error('Data array cannot be empty');
    }

    const [minVal, maxVal] = featureRange;
    const nFeatures = data[0].length;
    const mins = new Array(nFeatures);
    const maxs = new Array(nFeatures);

    // Calculate min and max for each feature
    for (let col = 0; col < nFeatures; col++) {
      mins[col] = Math.min(...data.map((row) => row[col]));
      maxs[col] = Math.max(...data.map((row) => row[col]));

      // Prevent division by zero
      if (maxs[col] === mins[col]) {
        maxs[col] = mins[col] + 1;
      }
    }

    // Scale
    return data.map((row) =>
      row.map((val, col) => {
        const scaled = (val - mins[col]) / (maxs[col] - mins[col]);
        return scaled * (maxVal - minVal) + minVal;
      })
    );
  }

  /**
   * Handle missing values with mean imputation
   * Critical for production ML pipelines
   */
  static imputeMissingValues(data: (number | null)[][]): number[][] {
    if (data.length === 0 || data[0].length === 0) {
      throw new Error('Data array cannot be empty');
    }

    const nFeatures = data[0].length;
    const means = new Array(nFeatures).fill(0);

    // Calculate means for each feature (ignoring nulls)
    for (let col = 0; col < nFeatures; col++) {
      const validValues = data
        .map((row) => row[col])
        .filter((val) => val !== null) as number[];

      if (validValues.length === 0) {
        means[col] = 0; // Default for columns with all nulls
      } else {
        means[col] =
          validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
      }
    }

    // Impute missing values
    return data.map((row) =>
      row.map((val, col) => (val === null ? means[col] : val))
    ) as number[][];
  }

  /**
   * Create polynomial features for non-linear relationships
   * Essential for capturing complex patterns in hospitality data
   */
  static createPolynomialFeatures(
    data: number[][],
    degree: number = 2
  ): number[][] {
    if (data.length === 0 || data[0].length === 0) {
      throw new Error('Data array cannot be empty');
    }

    if (degree < 1) {
      throw new Error('Degree must be at least 1');
    }

    const nFeatures = data[0].length;
    const result: number[][] = [];

    // Add original features
    data.forEach((row) => result.push([...row]));

    // Add polynomial combinations up to specified degree
    for (let d = 2; d <= degree; d++) {
      for (let i = 0; i < nFeatures; i++) {
        for (let j = i; j < nFeatures; j++) {
          data.forEach((row, idx) => {
            result[idx].push(Math.pow(row[i], d) * Math.pow(row[j], d));
          });
        }
      }
    }

    return result;
  }

  /**
   * One-hot encode categorical features
   * Essential for categorical variables in ML models
   */
  static oneHotEncode(categories: string[]): { [key: string]: number[] } {
    if (categories.length === 0) {
      throw new Error('Categories array cannot be empty');
    }

    const uniqueCategories = [...new Set(categories)];
    const encoding: { [key: string]: number[] } = {};

    uniqueCategories.forEach((category) => {
      encoding[category] = uniqueCategories.map((cat) =>
        cat === category ? 1 : 0
      );
    });

    return encoding;
  }

  /**
   * Encode categorical features with numerical labels
   * Useful for ordinal categories or tree-based models
   */
  static labelEncode(categories: string[]): { [key: string]: number } {
    if (categories.length === 0) {
      throw new Error('Categories array cannot be empty');
    }

    const uniqueCategories = [...new Set(categories)];
    const encoding: { [key: string]: number } = {};

    uniqueCategories.forEach((category, index) => {
      encoding[category] = index;
    });

    return encoding;
  }

  /**
   * Remove outliers using IQR method
   * Important for robust model training
   */
  static removeOutliers(data: number[][], threshold: number = 1.5): number[][] {
    if (data.length === 0 || data[0].length === 0) {
      throw new Error('Data array cannot be empty');
    }

    const nFeatures = data[0].length;
    const validIndices: number[] = [];

    // Check each feature for outliers
    for (let row = 0; row < data.length; row++) {
      let isOutlier = false;

      for (let col = 0; col < nFeatures; col++) {
        const featureValues = data.map((r) => r[col]).sort((a, b) => a - b);
        const q1 = featureValues[Math.floor(featureValues.length * 0.25)];
        const q3 = featureValues[Math.floor(featureValues.length * 0.75)];
        const iqr = q3 - q1;
        const lowerBound = q1 - threshold * iqr;
        const upperBound = q3 + threshold * iqr;

        if (data[row][col] < lowerBound || data[row][col] > upperBound) {
          isOutlier = true;
          break;
        }
      }

      if (!isOutlier) {
        validIndices.push(row);
      }
    }

    return validIndices.map((idx) => [...data[idx]]);
  }

  /**
   * Split data into training and testing sets
   */
  static trainTestSplit(
    X: number[][],
    y: number[],
    testSize: number = 0.2,
    randomState?: number
  ): {
    XTrain: number[][];
    XTest: number[][];
    yTrain: number[];
    yTest: number[];
  } {
    if (X.length !== y.length) {
      throw new Error('X and y must have the same length');
    }

    if (testSize <= 0 || testSize >= 1) {
      throw new Error('testSize must be between 0 and 1');
    }

    // Set random seed if provided
    if (randomState !== undefined) {
      Math.random = this.seededRandom(randomState);
    }

    const nSamples = X.length;
    const nTest = Math.floor(nSamples * testSize);
    const nTrain = nSamples - nTest;

    // Create shuffled indices
    const indices = Array.from({ length: nSamples }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Split data
    const XTrain: number[][] = [];
    const XTest: number[][] = [];
    const yTrain: number[] = [];
    const yTest: number[] = [];

    for (let i = 0; i < nTrain; i++) {
      XTrain.push([...X[indices[i]]]);
      yTrain.push(y[indices[i]]);
    }

    for (let i = nTrain; i < nSamples; i++) {
      XTest.push([...X[indices[i]]]);
      yTest.push(y[indices[i]]);
    }

    return { XTrain, XTest, yTrain, yTest };
  }

  /**
   * Create a seeded random number generator
   */
  private static seededRandom(seed: number): () => number {
    return function () {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }

  /**
   * Calculate basic statistics for features
   */
  static calculateFeatureStats(data: number[][]): {
    means: number[];
    stds: number[];
    mins: number[];
    maxs: number[];
    medians: number[];
  } {
    if (data.length === 0 || data[0].length === 0) {
      throw new Error('Data array cannot be empty');
    }

    const nFeatures = data[0].length;
    const means = new Array(nFeatures).fill(0);
    const stds = new Array(nFeatures).fill(0);
    const mins = new Array(nFeatures);
    const maxs = new Array(nFeatures);
    const medians = new Array(nFeatures);

    for (let col = 0; col < nFeatures; col++) {
      const featureValues = data.map((row) => row[col]).sort((a, b) => a - b);

      // Mean
      means[col] =
        featureValues.reduce((sum, val) => sum + val, 0) / featureValues.length;

      // Std
      const variance =
        featureValues.reduce(
          (sum, val) => sum + Math.pow(val - means[col], 2),
          0
        ) / featureValues.length;
      stds[col] = Math.sqrt(variance);

      // Min/Max
      mins[col] = featureValues[0];
      maxs[col] = featureValues[featureValues.length - 1];

      // Median
      const mid = Math.floor(featureValues.length / 2);
      medians[col] =
        featureValues.length % 2 === 0
          ? (featureValues[mid - 1] + featureValues[mid]) / 2
          : featureValues[mid];
    }

    return { means, stds, mins, maxs, medians };
  }
}
