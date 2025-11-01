// lib/ml/models/KMeans.ts
export interface KMeansConfig {
  nClusters: number;
  maxIterations: number;
  tolerance: number;
  randomState?: number;
  initMethod?: 'random' | 'k-means++';
}

export class KMeans {
  private centroids: number[][] = [];
  private labels: number[] = [];
  private config: KMeansConfig;
  private inertia: number = 0;

  constructor(config: KMeansConfig) {
    if (config.nClusters < 1) {
      throw new Error('Number of clusters must be at least 1');
    }
    this.config = {
      initMethod: 'k-means++',
      ...config,
    };
  }

  /**
   * Fit K-means clustering algorithm
   */
  fit(X: number[][]): void {
    if (X.length === 0 || X[0].length === 0) {
      throw new Error('Training data cannot be empty');
    }

    if (X.length < this.config.nClusters) {
      throw new Error(
        'Number of samples must be greater than or equal to number of clusters'
      );
    }

    const nSamples = X.length;
    const nFeatures = X[0].length;

    // Initialize centroids
    this.initializeCentroids(X);

    for (
      let iteration = 0;
      iteration < this.config.maxIterations;
      iteration++
    ) {
      // Assign each point to nearest centroid
      this.labels = X.map((point) => this.findNearestCentroid(point));

      // Update centroids
      const newCentroids = this.computeCentroids(X);

      // Check for convergence
      if (this.hasConverged(newCentroids)) {
        break;
      }

      this.centroids = newCentroids;
    }

    // Calculate final inertia
    this.inertia = this.calculateInertia(X);
  }

  /**
   * Predict cluster for new data points
   */
  predict(X: number[][]): number[] {
    if (this.centroids.length === 0) {
      throw new Error('Model must be trained before making predictions');
    }

    return X.map((point) => this.findNearestCentroid(point));
  }

  /**
   * Get cluster centroids
   */
  getCentroids(): number[][] {
    return this.centroids.map((centroid) => [...centroid]);
  }

  /**
   * Get cluster labels for training data
   */
  getLabels(): number[] {
    return [...this.labels];
  }

  /**
   * Calculate inertia (within-cluster sum of squares)
   */
  getInertia(): number {
    return this.inertia;
  }

  /**
   * Calculate silhouette score for clustering quality assessment
   */
  silhouetteScore(X: number[][]): number {
    if (this.labels.length === 0) {
      throw new Error(
        'Model must be trained before calculating silhouette score'
      );
    }

    const nSamples = X.length;
    const silhouetteScores: number[] = [];

    for (let i = 0; i < nSamples; i++) {
      const clusterI = this.labels[i];
      const pointI = X[i];

      // Calculate average distance to other points in same cluster (a)
      const sameClusterDistances: number[] = [];
      for (let j = 0; j < nSamples; j++) {
        if (i !== j && this.labels[j] === clusterI) {
          sameClusterDistances.push(this.euclideanDistance(pointI, X[j]));
        }
      }
      const a =
        sameClusterDistances.length > 0
          ? sameClusterDistances.reduce((sum, d) => sum + d, 0) /
            sameClusterDistances.length
          : 0;

      // Calculate average distance to points in nearest different cluster (b)
      let minBDistance = Infinity;
      for (let cluster = 0; cluster < this.config.nClusters; cluster++) {
        if (cluster === clusterI) continue;

        const clusterDistances: number[] = [];
        for (let j = 0; j < nSamples; j++) {
          if (this.labels[j] === cluster) {
            clusterDistances.push(this.euclideanDistance(pointI, X[j]));
          }
        }

        if (clusterDistances.length > 0) {
          const avgDistance =
            clusterDistances.reduce((sum, d) => sum + d, 0) /
            clusterDistances.length;
          minBDistance = Math.min(minBDistance, avgDistance);
        }
      }

      const b = minBDistance === Infinity ? 0 : minBDistance;

      // Calculate silhouette score for this point
      const silhouette = (b - a) / Math.max(a, b);
      silhouetteScores.push(isNaN(silhouette) ? 0 : silhouette);
    }

    // Return average silhouette score
    return (
      silhouetteScores.reduce((sum, score) => sum + score, 0) /
      silhouetteScores.length
    );
  }

  /**
   * Get cluster sizes
   */
  getClusterSizes(): number[] {
    const sizes = new Array(this.config.nClusters).fill(0);
    this.labels.forEach((label) => sizes[label]++);
    return sizes;
  }

  /**
   * Initialize centroids using k-means++ algorithm
   */
  private initializeCentroids(X: number[][]): void {
    const nSamples = X.length;
    this.centroids = [];

    if (this.config.initMethod === 'random') {
      // Random initialization
      const indices = Array.from({ length: nSamples }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      for (let i = 0; i < this.config.nClusters; i++) {
        this.centroids.push([...X[indices[i]]]);
      }
    } else {
      // K-means++ initialization
      // Choose first centroid randomly
      const firstIndex = Math.floor(Math.random() * nSamples);
      this.centroids.push([...X[firstIndex]]);

      // Choose remaining centroids
      for (let k = 1; k < this.config.nClusters; k++) {
        const distances = X.map((point) =>
          Math.min(
            ...this.centroids.map((centroid) =>
              this.euclideanDistance(point, centroid)
            )
          )
        );

        const totalDistance = distances.reduce((sum, d) => sum + d, 0);

        if (totalDistance === 0) {
          // All points are the same, choose randomly
          const randomIndex = Math.floor(Math.random() * nSamples);
          this.centroids.push([...X[randomIndex]]);
          continue;
        }

        const probabilities = distances.map((d) => d / totalDistance);

        // Sample from probability distribution
        const random = Math.random();
        let cumulativeProb = 0;
        let selectedIndex = 0;

        for (let i = 0; i < probabilities.length; i++) {
          cumulativeProb += probabilities[i];
          if (random <= cumulativeProb) {
            selectedIndex = i;
            break;
          }
        }

        this.centroids.push([...X[selectedIndex]]);
      }
    }
  }

  /**
   * Find nearest centroid for a data point
   */
  private findNearestCentroid(point: number[]): number {
    let minDistance = Infinity;
    let nearestCentroid = 0;

    for (let i = 0; i < this.centroids.length; i++) {
      const distance = this.euclideanDistance(point, this.centroids[i]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCentroid = i;
      }
    }

    return nearestCentroid;
  }

  /**
   * Compute new centroids as mean of assigned points
   */
  private computeCentroids(X: number[][]): number[][] {
    const newCentroids = Array(this.config.nClusters)
      .fill(null)
      .map(() => new Array(X[0].length).fill(0));
    const counts = new Array(this.config.nClusters).fill(0);

    // Sum up points for each cluster
    for (let i = 0; i < X.length; i++) {
      const cluster = this.labels[i];
      for (let j = 0; j < X[i].length; j++) {
        newCentroids[cluster][j] += X[i][j];
      }
      counts[cluster]++;
    }

    // Compute means
    for (let i = 0; i < this.config.nClusters; i++) {
      if (counts[i] > 0) {
        for (let j = 0; j < newCentroids[i].length; j++) {
          newCentroids[i][j] /= counts[i];
        }
      } else {
        // Handle empty clusters by keeping old centroid
        newCentroids[i] = [...this.centroids[i]];
      }
    }

    return newCentroids;
  }

  /**
   * Check if centroids have converged
   */
  private hasConverged(newCentroids: number[][]): boolean {
    for (let i = 0; i < this.centroids.length; i++) {
      const distance = this.euclideanDistance(
        this.centroids[i],
        newCentroids[i]
      );
      if (distance > this.config.tolerance) {
        return false;
      }
    }
    return true;
  }

  /**
   * Calculate inertia for current clustering
   */
  private calculateInertia(X: number[][]): number {
    let totalInertia = 0;
    for (let i = 0; i < X.length; i++) {
      const centroid = this.centroids[this.labels[i]];
      const distance = this.euclideanDistance(X[i], centroid);
      totalInertia += distance * distance;
    }
    return totalInertia;
  }

  /**
   * Calculate Euclidean distance between two points
   */
  private euclideanDistance(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += Math.pow(a[i] - b[i], 2);
    }
    return Math.sqrt(sum);
  }

  /**
   * Reset the model
   */
  reset(): void {
    this.centroids = [];
    this.labels = [];
    this.inertia = 0;
  }

  /**
   * Get model parameters
   */
  getParams(): KMeansConfig {
    return { ...this.config };
  }

  /**
   * Set model parameters
   */
  setParams(params: Partial<KMeansConfig>): void {
    this.config = { ...this.config, ...params };
  }

  /**
   * Serialize model for storage
   */
  toJSON(): {
    centroids: number[][];
    labels: number[];
    config: KMeansConfig;
    inertia: number;
  } {
    return {
      centroids: this.centroids.map((c) => [...c]),
      labels: [...this.labels],
      config: { ...this.config },
      inertia: this.inertia,
    };
  }

  /**
   * Deserialize model from storage
   */
  static fromJSON(data: {
    centroids: number[][];
    labels: number[];
    config: KMeansConfig;
    inertia: number;
  }): KMeans {
    const model = new KMeans(data.config);
    model.centroids = data.centroids.map((c) => [...c]);
    model.labels = [...data.labels];
    model.inertia = data.inertia;
    return model;
  }
}
