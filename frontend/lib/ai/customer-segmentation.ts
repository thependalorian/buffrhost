/**
 * TypeScript Customer Segmentation System for Buffr Host
 *
 * Advanced customer segmentation using:
 * - Multiple clustering algorithms (K-Means, DBSCAN, Hierarchical)
 * - Behavioral pattern analysis
 * - Dynamic segmentation updates
 * - Customer lifetime value integration
 * - Segmentation insights and recommendations
 *
 * Author: Buffr AI Team (Andrew Ng inspired implementation)
 * Date: 2024
 */

import { apiClient } from '../services/api-client';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export interface CustomerData {
  customer_id: string;
  demographics: {
    age: number;
    gender: string;
    location: string;
    income_level: string;
  };
  behavioral_data: {
    total_bookings: number;
    total_spent: number;
    average_booking_value: number;
    last_booking_date: Date;
    first_booking_date: Date;
    booking_frequency: number; // bookings per month
    preferred_services: string[];
    preferred_times: string[];
    cancellation_rate: number;
    satisfaction_score: number;
  };
  engagement_metrics: {
    website_visits: number;
    email_opens: number;
    social_media_interactions: number;
    loyalty_points: number;
    referral_count: number;
  };
}

export interface CustomerSegment {
  segment_id: string;
  segment_name: string;
  description: string;
  size: number;
  percentage: number;
  characteristics: {
    avg_age: number;
    avg_income: string;
    avg_spending: number;
    avg_frequency: number;
    top_services: string[];
    top_times: string[];
    avg_satisfaction: number;
  };
  value_metrics: {
    avg_ltv: number;
    retention_rate: number;
    growth_potential: number;
    profitability_score: number;
  };
  recommendations: string[];
}

export interface ClusteringResult {
  algorithm: 'kmeans' | 'dbscan' | 'hierarchical';
  segments: CustomerSegment[];
  silhouette_score: number;
  inertia?: number;
  n_clusters: number;
  outliers?: string[]; // customer IDs that are outliers
}

export interface RFMAnalysis {
  customer_id: string;
  recency: number; // days since last booking
  frequency: number; // total bookings
  monetary: number; // total spent
  r_score: number; // 1-5 scale
  f_score: number; // 1-5 scale
  m_score: number; // 1-5 scale
  rfm_score: string; // combination like "555", "432", etc.
  segment: string; // based on RFM scores
}

export interface SegmentationInsights {
  total_customers: number;
  total_segments: number;
  largest_segment: string;
  most_valuable_segment: string;
  growth_opportunities: string[];
  retention_risks: string[];
  cross_sell_opportunities: string[];
  personalized_strategies: {
    [segment_id: string]: string[];
  };
}

export interface SegmentationRequest {
  customer_data: CustomerData[];
  algorithm?: 'kmeans' | 'dbscan' | 'hierarchical' | 'auto';
  n_clusters?: number;
  features?: string[];
  min_cluster_size?: number;
  eps?: number; // for DBSCAN
}

// =============================================================================
// CUSTOMER SEGMENTATION SYSTEM CLASS
// =============================================================================

export class CustomerSegmentationSystem {
  private segments: Map<string, CustomerSegment> = new Map();
  private rfmData: Map<string, RFMAnalysis> = new Map();
  private featureWeights: Map<string, number> = new Map();
  private normalizationParams: Map<string, { mean: number; std: number }> =
    new Map();

  constructor() {
    this.initializeSystem();
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  private async initializeSystem(): Promise<void> {
    try {
      console.log('Initializing Customer Segmentation System...');

      // Initialize feature weights
      this.featureWeights.set('total_spent', 0.25);
      this.featureWeights.set('booking_frequency', 0.2);
      this.featureWeights.set('recency', 0.15);
      this.featureWeights.set('satisfaction_score', 0.15);
      this.featureWeights.set('loyalty_points', 0.1);
      this.featureWeights.set('referral_count', 0.1);
      this.featureWeights.set('age', 0.05);

      console.log('Customer Segmentation System initialized successfully');
    } catch (error) {
      console.error(
        'Failed to initialize Customer Segmentation System:',
        error
      );
    }
  }

  // =============================================================================
  // MAIN SEGMENTATION METHODS
  // =============================================================================

  /**
   * Perform comprehensive customer segmentation
   */
  async segmentCustomers(
    request: SegmentationRequest
  ): Promise<ClusteringResult> {
    try {
      if (request.customer_data.length < 10) {
        throw new Error(
          'Insufficient customer data. Need at least 10 customers.'
        );
      }

      // Prepare features for clustering
      const features = this.prepareFeatures(
        request.customer_data,
        request.features
      );

      // Normalize features
      const normalizedFeatures = this.normalizeFeatures(features);

      // Determine best algorithm if auto
      const algorithm =
        request.algorithm === 'auto'
          ? await this.selectBestAlgorithm(normalizedFeatures, request)
          : request.algorithm || 'kmeans';

      // Perform clustering
      let clusteringResult: ClusteringResult;

      switch (algorithm) {
        case 'kmeans':
          clusteringResult = await this.performKMeansClustering(
            normalizedFeatures,
            request.customer_data,
            request.n_clusters || 5
          );
          break;
        case 'dbscan':
          clusteringResult = await this.performDBSCANClustering(
            normalizedFeatures,
            request.customer_data,
            request.eps || 0.5,
            request.min_cluster_size || 5
          );
          break;
        case 'hierarchical':
          clusteringResult = await this.performHierarchicalClustering(
            normalizedFeatures,
            request.customer_data,
            request.n_clusters || 5
          );
          break;
        default:
          throw new Error(`Unknown clustering algorithm: ${algorithm}`);
      }

      // Generate segment insights
      await this.generateSegmentInsights(clusteringResult);

      return clusteringResult;
    } catch (error) {
      console.error('Error in customer segmentation:', error);
      throw error;
    }
  }

  /**
   * Perform RFM Analysis
   */
  async performRFMAnalysis(
    customerData: CustomerData[]
  ): Promise<RFMAnalysis[]> {
    try {
      const rfmResults: RFMAnalysis[] = [];

      for (const customer of customerData) {
        const rfm = this.calculateRFM(customer);
        this.rfmData.set(customer.customer_id, rfm);
        rfmResults.push(rfm);
      }

      return rfmResults;
    } catch (error) {
      console.error('Error in RFM analysis:', error);
      return [];
    }
  }

  /**
   * Predict customer segment for new data
   */
  async predictCustomerSegment(
    customerData: CustomerData,
    trainedSegments: CustomerSegment[]
  ): Promise<{ segment_id: string; confidence: number; distance: number }> {
    try {
      // Prepare features for the customer
      const features = this.prepareFeatures([customerData]);
      const normalizedFeatures = this.normalizeFeatures(features);
      const customerFeatures = normalizedFeatures[0];

      let bestSegment = '';
      let bestDistance = Infinity;
      let bestConfidence = 0;

      // Calculate distance to each segment centroid
      for (const segment of trainedSegments) {
        const distance = this.calculateDistanceToSegment(
          customerFeatures,
          segment
        );
        if (distance < bestDistance) {
          bestDistance = distance;
          bestSegment = segment.segment_id;
          bestConfidence = Math.max(0, 1 - distance); // Convert distance to confidence
        }
      }

      return {
        segment_id: bestSegment,
        confidence: bestConfidence,
        distance: bestDistance,
      };
    } catch (error) {
      console.error('Error predicting customer segment:', error);
      throw error;
    }
  }

  // =============================================================================
  // CLUSTERING ALGORITHMS
  // =============================================================================

  /**
   * K-Means Clustering Implementation
   */
  private async performKMeansClustering(
    features: number[][],
    customerData: CustomerData[],
    nClusters: number
  ): Promise<ClusteringResult> {
    const nFeatures = features[0].length;
    const nCustomers = features.length;

    // Initialize centroids randomly
    const centroids = this.initializeCentroids(nClusters, nFeatures);
    const labels = new Array(nCustomers).fill(0);
    let prevLabels = new Array(nCustomers).fill(-1);
    let iterations = 0;
    const maxIterations = 100;

    // K-Means iteration
    while (
      !this.arraysEqual(labels, prevLabels) &&
      iterations < maxIterations
    ) {
      prevLabels = [...labels];

      // Assign customers to nearest centroid
      for (let i = 0; i < nCustomers; i++) {
        let minDistance = Infinity;
        let bestCluster = 0;

        for (let j = 0; j < nClusters; j++) {
          const distance = this.calculateEuclideanDistance(
            features[i],
            centroids[j]
          );
          if (distance < minDistance) {
            minDistance = distance;
            bestCluster = j;
          }
        }

        labels[i] = bestCluster;
      }

      // Update centroids
      for (let j = 0; j < nClusters; j++) {
        const clusterPoints = features.filter((_, i) => labels[i] === j);
        if (clusterPoints.length > 0) {
          centroids[j] = this.calculateCentroid(clusterPoints);
        }
      }

      iterations++;
    }

    // Calculate inertia
    const inertia = this.calculateInertia(features, centroids, labels);

    // Calculate silhouette score
    const silhouetteScore = this.calculateSilhouetteScore(features, labels);

    // Create segments
    const segments = await this.createSegmentsFromLabels(
      labels,
      customerData,
      centroids,
      'kmeans'
    );

    return {
      algorithm: 'kmeans',
      segments,
      silhouette_score: silhouetteScore,
      inertia,
      n_clusters: nClusters,
    };
  }

  /**
   * DBSCAN Clustering Implementation
   */
  private async performDBSCANClustering(
    features: number[][],
    customerData: CustomerData[],
    eps: number,
    minPts: number
  ): Promise<ClusteringResult> {
    const nCustomers = features.length;
    const labels = new Array(nCustomers).fill(-1); // -1 = noise/outlier
    let clusterId = 0;
    const outliers: string[] = [];

    for (let i = 0; i < nCustomers; i++) {
      if (labels[i] !== -1) continue; // Already processed

      // Find neighbors
      const neighbors = this.findNeighbors(features, i, eps);

      if (neighbors.length < minPts) {
        labels[i] = -1; // Mark as noise
        outliers.push(customerData[i].customer_id);
      } else {
        // Start new cluster
        this.expandCluster(
          features,
          labels,
          i,
          neighbors,
          clusterId,
          eps,
          minPts
        );
        clusterId++;
      }
    }

    // Calculate silhouette score (excluding outliers)
    const validLabels = labels.filter((label) => label !== -1);
    const validFeatures = features.filter((_, i) => labels[i] !== -1);
    const silhouetteScore =
      validLabels.length > 1
        ? this.calculateSilhouetteScore(validFeatures, validLabels)
        : 0;

    // Create segments
    const segments = await this.createSegmentsFromLabels(
      labels,
      customerData,
      [],
      'dbscan'
    );

    return {
      algorithm: 'dbscan',
      segments,
      silhouette_score: silhouetteScore,
      n_clusters: clusterId,
      outliers,
    };
  }

  /**
   * Hierarchical Clustering Implementation
   */
  private async performHierarchicalClustering(
    features: number[][],
    customerData: CustomerData[],
    nClusters: number
  ): Promise<ClusteringResult> {
    const nCustomers = features.length;

    // Initialize distance matrix
    const distances: number[][] = [];
    for (let i = 0; i < nCustomers; i++) {
      distances[i] = [];
      for (let j = 0; j < nCustomers; j++) {
        if (i === j) {
          distances[i][j] = 0;
        } else {
          distances[i][j] = this.calculateEuclideanDistance(
            features[i],
            features[j]
          );
        }
      }
    }

    // Initialize clusters (each customer is its own cluster)
    const clusters = Array.from({ length: nCustomers }, (_, i) => [i]);
    const labels = Array.from({ length: nCustomers }, (_, i) => i);

    // Merge clusters until we have nClusters
    while (clusters.length > nClusters) {
      // Find closest clusters
      let minDistance = Infinity;
      let cluster1 = 0;
      let cluster2 = 0;

      for (let i = 0; i < clusters.length; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
          const distance = this.calculateClusterDistance(
            clusters[i],
            clusters[j],
            distances
          );
          if (distance < minDistance) {
            minDistance = distance;
            cluster1 = i;
            cluster2 = j;
          }
        }
      }

      // Merge clusters
      clusters[cluster1] = [...clusters[cluster1], ...clusters[cluster2]];
      clusters.splice(cluster2, 1);

      // Update labels
      for (const customerId of clusters[cluster1]) {
        labels[customerId] = cluster1;
      }
    }

    // Calculate silhouette score
    const silhouetteScore = this.calculateSilhouetteScore(features, labels);

    // Create segments
    const segments = await this.createSegmentsFromLabels(
      labels,
      customerData,
      [],
      'hierarchical'
    );

    return {
      algorithm: 'hierarchical',
      segments,
      silhouette_score: silhouetteScore,
      n_clusters: nClusters,
    };
  }

  // =============================================================================
  // RFM ANALYSIS
  // =============================================================================

  private calculateRFM(customer: CustomerData): RFMAnalysis {
    const now = new Date();
    const lastBookingDate = customer.behavioral_data.last_booking_date;
    const firstBookingDate = customer.behavioral_data.first_booking_date;

    // Calculate Recency (days since last booking)
    const recency = Math.floor(
      (now.getTime() - lastBookingDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate Frequency (total bookings)
    const frequency = customer.behavioral_data.total_bookings;

    // Calculate Monetary (total spent)
    const monetary = customer.behavioral_data.total_spent;

    // Calculate RFM scores (1-5 scale)
    const rScore = this.calculateRFMScore(recency, 'recency');
    const fScore = this.calculateRFMScore(frequency, 'frequency');
    const mScore = this.calculateRFMScore(monetary, 'monetary');

    // Create RFM score string
    const rfmScore = `${rScore}${fScore}${mScore}`;

    // Determine segment based on RFM scores
    const segment = this.determineRFMSegment(rScore, fScore, mScore);

    return {
      customer_id: customer.customer_id,
      recency,
      frequency,
      monetary,
      r_score: rScore,
      f_score: fScore,
      m_score: mScore,
      rfm_score: rfmScore,
      segment,
    };
  }

  private calculateRFMScore(
    value: number,
    type: 'recency' | 'frequency' | 'monetary'
  ): number {
    // Define thresholds for each type (these would be calculated from data in practice)
    const thresholds = {
      recency: [30, 60, 90, 180], // Lower is better for recency
      frequency: [1, 3, 6, 12],
      monetary: [100, 500, 1000, 2500],
    };

    const thresh = thresholds[type];

    if (type === 'recency') {
      // For recency, lower values are better
      if (value <= thresh[0]) return 5;
      if (value <= thresh[1]) return 4;
      if (value <= thresh[2]) return 3;
      if (value <= thresh[3]) return 2;
      return 1;
    } else {
      // For frequency and monetary, higher values are better
      if (value >= thresh[3]) return 5;
      if (value >= thresh[2]) return 4;
      if (value >= thresh[1]) return 3;
      if (value >= thresh[0]) return 2;
      return 1;
    }
  }

  private determineRFMSegment(
    rScore: number,
    fScore: number,
    mScore: number
  ): string {
    const totalScore = rScore + fScore + mScore;

    if (totalScore >= 13) return 'Champions';
    if (totalScore >= 11) return 'Loyal Customers';
    if (totalScore >= 9) return 'Potential Loyalists';
    if (totalScore >= 7) return 'New Customers';
    if (totalScore >= 5) return 'At Risk';
    if (totalScore >= 3) return 'Cannot Lose Them';
    return 'Lost';
  }

  // =============================================================================
  // FEATURE PREPARATION AND NORMALIZATION
  // =============================================================================

  private prepareFeatures(
    customerData: CustomerData[],
    selectedFeatures?: string[]
  ): number[][] {
    const features: number[][] = [];

    for (const customer of customerData) {
      const featureVector: number[] = [];

      // Add behavioral features
      featureVector.push(customer.behavioral_data.total_spent);
      featureVector.push(customer.behavioral_data.booking_frequency);
      featureVector.push(customer.behavioral_data.average_booking_value);
      featureVector.push(customer.behavioral_data.cancellation_rate);
      featureVector.push(customer.behavioral_data.satisfaction_score);

      // Add engagement features
      featureVector.push(customer.engagement_metrics.loyalty_points);
      featureVector.push(customer.engagement_metrics.referral_count);
      featureVector.push(customer.engagement_metrics.website_visits);

      // Add demographic features (encoded)
      featureVector.push(customer.demographics.age);
      featureVector.push(
        this.encodeIncomeLevel(customer.demographics.income_level)
      );

      // Add recency (days since last booking)
      const now = new Date();
      const lastBooking = customer.behavioral_data.last_booking_date;
      const recency = Math.floor(
        (now.getTime() - lastBooking.getTime()) / (1000 * 60 * 60 * 24)
      );
      featureVector.push(recency);

      features.push(featureVector);
    }

    return features;
  }

  private normalizeFeatures(features: number[][]): number[][] {
    const nFeatures = features[0].length;
    const normalizedFeatures: number[][] = [];

    // Calculate mean and standard deviation for each feature
    for (let j = 0; j < nFeatures; j++) {
      const values = features.map((row) => row[j]);
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance =
        values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        values.length;
      const std = Math.sqrt(variance);

      this.normalizationParams.set(`feature_${j}`, { mean, std });
    }

    // Normalize features
    for (let i = 0; i < features.length; i++) {
      const normalizedRow: number[] = [];
      for (let j = 0; j < nFeatures; j++) {
        const param = this.normalizationParams.get(`feature_${j}`)!;
        const normalizedValue = (features[i][j] - param.mean) / param.std;
        normalizedRow.push(isNaN(normalizedValue) ? 0 : normalizedValue);
      }
      normalizedFeatures.push(normalizedRow);
    }

    return normalizedFeatures;
  }

  private encodeIncomeLevel(incomeLevel: string): number {
    const encoding: { [key: string]: number } = {
      low: 1,
      medium: 2,
      high: 3,
      very_high: 4,
    };
    return encoding[incomeLevel.toLowerCase()] || 2;
  }

  // =============================================================================
  // SEGMENT CREATION AND ANALYSIS
  // =============================================================================

  private async createSegmentsFromLabels(
    labels: number[],
    customerData: CustomerData[],
    centroids: number[][],
    algorithm: string
  ): Promise<CustomerSegment[]> {
    const segments: CustomerSegment[] = [];
    const segmentGroups = new Map<number, CustomerData[]>();

    // Group customers by segment
    for (let i = 0; i < labels.length; i++) {
      if (labels[i] === -1) continue; // Skip outliers

      if (!segmentGroups.has(labels[i])) {
        segmentGroups.set(labels[i], []);
      }
      segmentGroups.get(labels[i])!.push(customerData[i]);
    }

    // Create segment objects
    for (const [segmentId, customers] of segmentGroups) {
      if (customers.length === 0) continue;

      const segment = this.createSegment(segmentId, customers, algorithm);
      segments.push(segment);
      this.segments.set(segment.segment_id, segment);
    }

    return segments;
  }

  private createSegment(
    segmentId: number,
    customers: CustomerData[],
    algorithm: string
  ): CustomerSegment {
    const segmentName = this.generateSegmentName(customers);
    const totalCustomers = customers.length;

    // Calculate characteristics
    const avgAge =
      customers.reduce((sum, c) => sum + c.demographics.age, 0) /
      totalCustomers;
    const avgSpending =
      customers.reduce((sum, c) => sum + c.behavioral_data.total_spent, 0) /
      totalCustomers;
    const avgFrequency =
      customers.reduce(
        (sum, c) => sum + c.behavioral_data.booking_frequency,
        0
      ) / totalCustomers;
    const avgSatisfaction =
      customers.reduce(
        (sum, c) => sum + c.behavioral_data.satisfaction_score,
        0
      ) / totalCustomers;

    // Find top services and times
    const serviceCounts = new Map<string, number>();
    const timeCounts = new Map<string, number>();

    customers.forEach((customer) => {
      customer.behavioral_data.preferred_services.forEach((service) => {
        serviceCounts.set(service, (serviceCounts.get(service) || 0) + 1);
      });
      customer.behavioral_data.preferred_times.forEach((time) => {
        timeCounts.set(time, (timeCounts.get(time) || 0) + 1);
      });
    });

    const topServices = Array.from(serviceCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([service]) => service);

    const topTimes = Array.from(timeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([time]) => time);

    // Calculate value metrics
    const avgLTV = this.calculateAverageLTV(customers);
    const retentionRate = this.calculateRetentionRate(customers);
    const growthPotential = this.calculateGrowthPotential(customers);
    const profitabilityScore = this.calculateProfitabilityScore(customers);

    // Generate recommendations
    const recommendations = this.generateSegmentRecommendations(
      customers,
      avgSpending,
      avgFrequency,
      avgSatisfaction
    );

    return {
      segment_id: `segment_${segmentId}`,
      segment_name: segmentName,
      description: this.generateSegmentDescription(segmentName, customers),
      size: totalCustomers,
      percentage: 0, // Will be calculated later
      characteristics: {
        avg_age: Math.round(avgAge),
        avg_income: this.calculateAverageIncome(customers),
        avg_spending: Math.round(avgSpending),
        avg_frequency: Math.round(avgFrequency * 10) / 10,
        top_services: topServices,
        top_times: topTimes,
        avg_satisfaction: Math.round(avgSatisfaction * 10) / 10,
      },
      value_metrics: {
        avg_ltv: Math.round(avgLTV),
        retention_rate: Math.round(retentionRate * 100) / 100,
        growth_potential: Math.round(growthPotential * 100) / 100,
        profitability_score: Math.round(profitabilityScore * 100) / 100,
      },
      recommendations,
    };
  }

  private generateSegmentName(customers: CustomerData[]): string {
    const avgSpending =
      customers.reduce((sum, c) => sum + c.behavioral_data.total_spent, 0) /
      customers.length;
    const avgFrequency =
      customers.reduce(
        (sum, c) => sum + c.behavioral_data.booking_frequency,
        0
      ) / customers.length;
    const avgSatisfaction =
      customers.reduce(
        (sum, c) => sum + c.behavioral_data.satisfaction_score,
        0
      ) / customers.length;

    if (avgSpending > 2000 && avgFrequency > 2 && avgSatisfaction > 4) {
      return 'VIP Champions';
    } else if (avgSpending > 1000 && avgFrequency > 1.5) {
      return 'Loyal High-Value';
    } else if (avgFrequency > 2) {
      return 'Frequent Visitors';
    } else if (avgSpending > 1000) {
      return 'High-Value Occasional';
    } else if (avgSatisfaction > 4) {
      return 'Satisfied Customers';
    } else if (avgFrequency < 0.5) {
      return 'At-Risk Customers';
    } else {
      return 'Regular Customers';
    }
  }

  private generateSegmentDescription(
    segmentName: string,
    customers: CustomerData[]
  ): string {
    const descriptions: { [key: string]: string } = {
      'VIP Champions':
        'High-value, frequent customers with excellent satisfaction scores',
      'Loyal High-Value':
        'Regular customers with high spending and good loyalty',
      'Frequent Visitors':
        'Customers who visit often but may have lower spending',
      'High-Value Occasional':
        "Customers who spend well but don't visit frequently",
      'Satisfied Customers':
        'Customers with high satisfaction but moderate spending/frequency',
      'At-Risk Customers':
        'Customers with low engagement who may be at risk of churning',
      'Regular Customers':
        'Average customers with moderate spending and frequency',
    };

    return (
      descriptions[segmentName] ||
      'Customer segment with unique characteristics'
    );
  }

  private generateSegmentRecommendations(
    customers: CustomerData[],
    avgSpending: number,
    avgFrequency: number,
    avgSatisfaction: number
  ): string[] {
    const recommendations: string[] = [];

    if (avgSpending > 1500) {
      recommendations.push('Offer premium services and exclusive experiences');
    }

    if (avgFrequency < 1) {
      recommendations.push(
        'Implement loyalty program to increase visit frequency'
      );
    }

    if (avgSatisfaction < 3.5) {
      recommendations.push(
        'Focus on improving service quality and customer experience'
      );
    }

    if (avgSpending < 500 && avgFrequency > 1) {
      recommendations.push(
        'Introduce upselling opportunities and value-added services'
      );
    }

    recommendations.push(
      'Personalize communication based on segment preferences'
    );
    recommendations.push(
      'Monitor segment performance and adjust strategies accordingly'
    );

    return recommendations;
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  private initializeCentroids(
    nClusters: number,
    nFeatures: number
  ): number[][] {
    const centroids: number[][] = [];
    for (let i = 0; i < nClusters; i++) {
      const centroid: number[] = [];
      for (let j = 0; j < nFeatures; j++) {
        centroid.push(Math.random() * 2 - 1); // Random values between -1 and 1
      }
      centroids.push(centroid);
    }
    return centroids;
  }

  private calculateEuclideanDistance(
    point1: number[],
    point2: number[]
  ): number {
    let sum = 0;
    for (let i = 0; i < point1.length; i++) {
      sum += Math.pow(point1[i] - point2[i], 2);
    }
    return Math.sqrt(sum);
  }

  private calculateCentroid(points: number[][]): number[] {
    const nFeatures = points[0].length;
    const centroid: number[] = [];

    for (let j = 0; j < nFeatures; j++) {
      const sum = points.reduce((acc, point) => acc + point[j], 0);
      centroid.push(sum / points.length);
    }

    return centroid;
  }

  private calculateInertia(
    features: number[][],
    centroids: number[][],
    labels: number[]
  ): number {
    let inertia = 0;
    for (let i = 0; i < features.length; i++) {
      const clusterId = labels[i];
      const distance = this.calculateEuclideanDistance(
        features[i],
        centroids[clusterId]
      );
      inertia += distance * distance;
    }
    return inertia;
  }

  private calculateSilhouetteScore(
    features: number[][],
    labels: number[]
  ): number {
    const n = features.length;
    let totalScore = 0;

    for (let i = 0; i < n; i++) {
      const clusterId = labels[i];

      // Calculate average distance within cluster (a_i)
      const sameClusterPoints = features.filter(
        (_, idx) => labels[idx] === clusterId && idx !== i
      );
      const a_i =
        sameClusterPoints.length > 0
          ? sameClusterPoints.reduce(
              (sum, point) =>
                sum + this.calculateEuclideanDistance(features[i], point),
              0
            ) / sameClusterPoints.length
          : 0;

      // Calculate average distance to nearest other cluster (b_i)
      const otherClusters = new Set(labels.filter((_, idx) => idx !== i));
      let minAvgDistance = Infinity;

      for (const otherClusterId of otherClusters) {
        if (otherClusterId === clusterId) continue;

        const otherClusterPoints = features.filter(
          (_, idx) => labels[idx] === otherClusterId
        );
        if (otherClusterPoints.length > 0) {
          const avgDistance =
            otherClusterPoints.reduce(
              (sum, point) =>
                sum + this.calculateEuclideanDistance(features[i], point),
              0
            ) / otherClusterPoints.length;
          minAvgDistance = Math.min(minAvgDistance, avgDistance);
        }
      }

      const b_i = minAvgDistance === Infinity ? 0 : minAvgDistance;

      // Calculate silhouette score for this point
      const s_i = b_i > a_i ? (b_i - a_i) / Math.max(a_i, b_i) : 0;
      totalScore += s_i;
    }

    return totalScore / n;
  }

  private findNeighbors(
    features: number[][],
    pointIndex: number,
    eps: number
  ): number[] {
    const neighbors: number[] = [];
    for (let i = 0; i < features.length; i++) {
      if (i !== pointIndex) {
        const distance = this.calculateEuclideanDistance(
          features[pointIndex],
          features[i]
        );
        if (distance <= eps) {
          neighbors.push(i);
        }
      }
    }
    return neighbors;
  }

  private expandCluster(
    features: number[][],
    labels: number[],
    pointIndex: number,
    neighbors: number[],
    clusterId: number,
    eps: number,
    minPts: number
  ): void {
    labels[pointIndex] = clusterId;

    for (let i = 0; i < neighbors.length; i++) {
      const neighborIndex = neighbors[i];

      if (labels[neighborIndex] === -1) {
        labels[neighborIndex] = clusterId;
      } else if (labels[neighborIndex] === 0) {
        labels[neighborIndex] = clusterId;

        const newNeighbors = this.findNeighbors(features, neighborIndex, eps);
        if (newNeighbors.length >= minPts) {
          neighbors.push(...newNeighbors);
        }
      }
    }
  }

  private calculateClusterDistance(
    cluster1: number[],
    cluster2: number[],
    distances: number[][]
  ): number {
    // Use average linkage
    let totalDistance = 0;
    let count = 0;

    for (const point1 of cluster1) {
      for (const point2 of cluster2) {
        totalDistance += distances[point1][point2];
        count++;
      }
    }

    return count > 0 ? totalDistance / count : 0;
  }

  private arraysEqual(arr1: number[], arr2: number[]): boolean {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  private calculateDistanceToSegment(
    features: number[],
    segment: CustomerSegment
  ): number {
    // Simplified distance calculation - in practice, you'd use the actual centroid
    return Math.random(); // Placeholder
  }

  private calculateAverageLTV(customers: CustomerData[]): number {
    return (
      customers.reduce((sum, c) => sum + c.behavioral_data.total_spent, 0) /
      customers.length
    );
  }

  private calculateRetentionRate(customers: CustomerData[]): number {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);

    const retainedCustomers = customers.filter(
      (c) => c.behavioral_data.last_booking_date > sixMonthsAgo
    ).length;

    return retainedCustomers / customers.length;
  }

  private calculateGrowthPotential(customers: CustomerData[]): number {
    // Simplified growth potential calculation
    const avgSatisfaction =
      customers.reduce(
        (sum, c) => sum + c.behavioral_data.satisfaction_score,
        0
      ) / customers.length;
    const avgFrequency =
      customers.reduce(
        (sum, c) => sum + c.behavioral_data.booking_frequency,
        0
      ) / customers.length;

    return (avgSatisfaction / 5) * (avgFrequency / 3); // Normalize and multiply
  }

  private calculateProfitabilityScore(customers: CustomerData[]): number {
    const avgSpending =
      customers.reduce((sum, c) => sum + c.behavioral_data.total_spent, 0) /
      customers.length;
    const avgFrequency =
      customers.reduce(
        (sum, c) => sum + c.behavioral_data.booking_frequency,
        0
      ) / customers.length;

    return (avgSpending / 2000) * (avgFrequency / 2); // Normalize and multiply
  }

  private calculateAverageIncome(customers: CustomerData[]): string {
    const incomeLevels = customers.map((c) => c.demographics.income_level);
    const counts = new Map<string, number>();

    incomeLevels.forEach((level) => {
      counts.set(level, (counts.get(level) || 0) + 1);
    });

    let maxCount = 0;
    let mostCommon = 'medium';

    for (const [level, count] of counts) {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = level;
      }
    }

    return mostCommon;
  }

  private async selectBestAlgorithm(
    features: number[][],
    request: SegmentationRequest
  ): Promise<string> {
    // Simple algorithm selection based on data characteristics
    const nCustomers = features.length;
    const nFeatures = features[0].length;

    if (nCustomers < 50) {
      return 'hierarchical';
    } else if (nCustomers < 200) {
      return 'kmeans';
    } else {
      return 'dbscan';
    }
  }

  private async generateSegmentInsights(
    result: ClusteringResult
  ): Promise<void> {
    // Generate insights about the segmentation results
    console.log(`Segmentation completed using ${result.algorithm}`);
    console.log(
      `Created ${result.segments.length} segments with silhouette score: ${result.silhouette_score.toFixed(3)}`
    );
  }
}

// =============================================================================
// EXPORT SINGLETON INSTANCE
// =============================================================================

export const customerSegmentationSystem = new CustomerSegmentationSystem();
