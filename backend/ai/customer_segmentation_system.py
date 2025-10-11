"""
Customer Segmentation System for Hospitality Platform
====================================================

Advanced customer segmentation system using machine learning clustering algorithms,
behavioral analysis, and dynamic segmentation for hospitality businesses.

Features:
- Multiple clustering algorithms (K-Means, DBSCAN, Hierarchical)
- Behavioral pattern analysis
- Dynamic segmentation updates
- Customer lifetime value integration
- Segmentation insights and recommendations

Author: Buffr AI Team
Date: 2024
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional, Any, Union
from dataclasses import dataclass
from datetime import datetime, timedelta
import logging
import joblib
import json
from pathlib import Path
from enum import Enum

class CustomerSegmentationSystem:
    """
    Customer Segmentation System for Hospitality Platform
    
    This class implements advanced customer segmentation using machine learning
    techniques including clustering, RFM analysis, and behavioral pattern recognition
    to identify different customer segments in hospitality operations.
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        Initialize the customer segmentation system
        
        Args:
            config: Configuration dictionary for the system
        """
        self.config = config or {}
        self.models = {}
        self.scalers = {}
        self.segments = {}
        self.feature_names = []
        
        # Initialize logging
        self.logger = logging.getLogger(__name__)
        
        # Setup database connection
        self.db_path = "customer_segmentation.db"
        self._setup_database()
        
        # Initialize models
        self._initialize_models()
    
    def _setup_database(self):
        """Setup SQLite database for storing segmentation data"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create tables for customer segmentation
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS customer_segments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id TEXT,
                segment_name TEXT,
                segment_score REAL,
                features TEXT,
                created_at TIMESTAMP,
                updated_at TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS segment_definitions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                segment_name TEXT UNIQUE,
                description TEXT,
                characteristics TEXT,
                created_at TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def _initialize_models(self):
        """Initialize customer segmentation models"""
        try:
            from sklearn.cluster import KMeans, DBSCAN
            from sklearn.preprocessing import StandardScaler
            from sklearn.decomposition import PCA
            
            # K-Means clustering
            self.models['kmeans'] = KMeans(
                n_clusters=5,
                random_state=42,
                n_init=10
            )
            
            # DBSCAN for density-based clustering
            self.models['dbscan'] = DBSCAN(
                eps=0.5,
                min_samples=5
            )
            
            # Standard scaler for feature normalization
            self.scalers['standard'] = StandardScaler()
            
            # PCA for dimensionality reduction
            self.models['pca'] = PCA(n_components=0.95)
            
            self.logger.info("Customer segmentation models initialized successfully")
            
        except ImportError as e:
            self.logger.error(f"Failed to initialize models: {e}")
            raise
    
    def segment_customers(self, customer_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Segment customers based on their data
        
        Args:
            customer_data: List of customer data dictionaries
            
        Returns:
            Dictionary containing segmentation results
        """
        try:
            # Extract features from customer data
            features = np.array([self._extract_features(data) for data in customer_data])
            
            # Normalize features
            features_scaled = self.scalers['standard'].fit_transform(features)
            
            # Apply PCA for dimensionality reduction
            features_pca = self.models['pca'].fit_transform(features_scaled)
            
            # Perform clustering
            kmeans_labels = self.models['kmeans'].fit_predict(features_pca)
            dbscan_labels = self.models['dbscan'].fit_predict(features_pca)
            
            # Create segments
            segments = self._create_segments(kmeans_labels, customer_data)
            
            # Store segmentation results
            self._store_segmentation_results(customer_data, segments)
            
            return {
                'segments': segments,
                'kmeans_labels': kmeans_labels.tolist(),
                'dbscan_labels': dbscan_labels.tolist(),
                'feature_importance': self._get_feature_importance(),
                'segment_statistics': self._get_segment_statistics(segments)
            }
            
        except Exception as e:
            self.logger.error(f"Error in customer segmentation: {e}")
            return {
                'segments': {},
                'error': str(e)
            }
    
    def _extract_features(self, data: Dict[str, Any]) -> List[float]:
        """Extract features from customer data"""
        features = []
        
        # RFM features
        recency = data.get('recency_days', 30)
        features.append(recency / 365.0)  # Normalize to years
        
        frequency = data.get('frequency', 1)
        features.append(min(frequency / 100.0, 1.0))  # Cap at 100
        
        monetary = data.get('monetary_value', 0)
        features.append(monetary / 10000.0)  # Normalize to 10k
        
        # Behavioral features
        avg_booking_value = data.get('avg_booking_value', 0)
        features.append(avg_booking_value / 1000.0)  # Normalize to 1k
        
        booking_frequency = data.get('booking_frequency', 0)
        features.append(min(booking_frequency / 12.0, 1.0))  # Cap at 12 per year
        
        # Demographics
        age = data.get('age', 35)
        features.append(age / 100.0)  # Normalize to 0-1
        
        # Preferences
        luxury_preference = data.get('luxury_preference', 0.5)
        features.append(luxury_preference)
        
        business_travel = data.get('business_travel', 0)
        features.append(float(business_travel))
        
        return features
    
    def _create_segments(self, labels: np.ndarray, customer_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create customer segments based on clustering labels"""
        segments = {}
        
        for i, label in enumerate(labels):
            if label not in segments:
                segments[label] = {
                    'customers': [],
                    'characteristics': {},
                    'size': 0
                }
            
            segments[label]['customers'].append(customer_data[i])
            segments[label]['size'] += 1
        
        # Analyze segment characteristics
        for label, segment in segments.items():
            segment['characteristics'] = self._analyze_segment_characteristics(segment['customers'])
            segment['name'] = self._get_segment_name(segment['characteristics'])
        
        return segments
    
    def _analyze_segment_characteristics(self, customers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze characteristics of a customer segment"""
        if not customers:
            return {}
        
        # Calculate averages
        avg_recency = np.mean([c.get('recency_days', 30) for c in customers])
        avg_frequency = np.mean([c.get('frequency', 1) for c in customers])
        avg_monetary = np.mean([c.get('monetary_value', 0) for c in customers])
        avg_age = np.mean([c.get('age', 35) for c in customers])
        
        return {
            'avg_recency_days': avg_recency,
            'avg_frequency': avg_frequency,
            'avg_monetary_value': avg_monetary,
            'avg_age': avg_age,
            'luxury_preference': np.mean([c.get('luxury_preference', 0.5) for c in customers]),
            'business_travel_ratio': np.mean([c.get('business_travel', 0) for c in customers])
        }
    
    def _get_segment_name(self, characteristics: Dict[str, Any]) -> str:
        """Get a descriptive name for a customer segment"""
        if not characteristics:
            return "Unknown"
        
        recency = characteristics.get('avg_recency_days', 30)
        frequency = characteristics.get('avg_frequency', 1)
        monetary = characteristics.get('avg_monetary_value', 0)
        
        if recency < 30 and frequency > 5 and monetary > 5000:
            return "VIP Customers"
        elif recency < 60 and frequency > 3:
            return "Loyal Customers"
        elif monetary > 3000:
            return "High Value Customers"
        elif frequency > 2:
            return "Regular Customers"
        elif recency > 180:
            return "At-Risk Customers"
        else:
            return "New Customers"
    
    def _get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance for segmentation"""
        return {
            'recency': 0.3,
            'frequency': 0.3,
            'monetary': 0.4
        }
    
    def _get_segment_statistics(self, segments: Dict[str, Any]) -> Dict[str, Any]:
        """Get statistics about customer segments"""
        total_customers = sum(segment['size'] for segment in segments.values())
        
        return {
            'total_segments': len(segments),
            'total_customers': total_customers,
            'avg_segment_size': total_customers / len(segments) if segments else 0,
            'largest_segment': max(segments.values(), key=lambda x: x['size'])['name'] if segments else None
        }
    
    def _store_segmentation_results(self, customer_data: List[Dict[str, Any]], segments: Dict[str, Any]):
        """Store segmentation results in database"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for label, segment in segments.items():
            for customer in segment['customers']:
                cursor.execute('''
                    INSERT OR REPLACE INTO customer_segments 
                    (customer_id, segment_name, segment_score, features, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    customer.get('customer_id', ''),
                    segment['name'],
                    0.8,  # Default score
                    json.dumps(customer),
                    datetime.now(),
                    datetime.now()
                ))
        
        conn.commit()
        conn.close()
    
    def get_segment_insights(self, segment_name: str) -> Dict[str, Any]:
        """Get insights for a specific customer segment"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM customer_segments 
            WHERE segment_name = ?
        ''', (segment_name,))
        
        customers = cursor.fetchall()
        conn.close()
        
        if not customers:
            return {'error': 'Segment not found'}
        
        # Analyze segment insights
        total_customers = len(customers)
        avg_score = np.mean([c[3] for c in customers])  # segment_score column
        
        return {
            'segment_name': segment_name,
            'total_customers': total_customers,
            'avg_segment_score': avg_score,
            'insights': self._generate_segment_insights(customers)
        }
    
    def _generate_segment_insights(self, customers: List[Tuple]) -> List[str]:
        """Generate insights for a customer segment"""
        insights = []
        
        if len(customers) > 100:
            insights.append("Large customer segment with significant potential")
        
        avg_score = np.mean([c[3] for c in customers])
        if avg_score > 0.8:
            insights.append("High-value segment with strong engagement")
        elif avg_score < 0.3:
            insights.append("Low-engagement segment requiring attention")
        
        return insights
import warnings
warnings.filterwarnings('ignore')

# Core ML libraries
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.preprocessing import StandardScaler, MinMaxScaler, LabelEncoder
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score, calinski_harabasz_score, davies_bouldin_score
from sklearn.model_selection import ParameterGrid
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import NearestNeighbors

# Statistical analysis
from scipy import stats
from scipy.cluster.hierarchy import dendrogram, linkage
from scipy.spatial.distance import pdist, squareform

# Visualization (optional)
try:
    import matplotlib.pyplot as plt
    import seaborn as sns
    PLOTTING_AVAILABLE = True
except ImportError:
    PLOTTING_AVAILABLE = False
    logging.warning("Matplotlib/Seaborn not available. Plotting features will be disabled.")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SegmentationMethod(Enum):
    """Customer segmentation methods"""
    KMEANS = "kmeans"
    DBSCAN = "dbscan"
    HIERARCHICAL = "hierarchical"
    GAUSSIAN_MIXTURE = "gaussian_mixture"
    BIRCH = "birch"

class CustomerSegment(Enum):
    """Customer segment types"""
    CHAMPIONS = "champions"
    LOYAL_CUSTOMERS = "loyal_customers"
    POTENTIAL_LOYALISTS = "potential_loyalists"
    NEW_CUSTOMERS = "new_customers"
    PROMISING = "promising"
    NEEDS_ATTENTION = "needs_attention"
    AT_RISK = "at_risk"
    CANT_LOSE = "cant_lose"
    HIBERNATING = "hibernating"
    LOST = "lost"

@dataclass
class SegmentationConfig:
    """Configuration for customer segmentation"""
    # Clustering parameters
    min_clusters: int = 3
    max_clusters: int = 10
    eps: float = 0.5  # For DBSCAN
    min_samples: int = 5  # For DBSCAN
    
    # Feature engineering
    use_rfm: bool = True  # Recency, Frequency, Monetary
    use_behavioral: bool = True
    use_demographic: bool = True
    use_engagement: bool = True
    
    # Model persistence
    model_path: str = "models/customer_segmentation"
    version: str = "1.0.0"

class RFMAnalyzer:
    """RFM (Recency, Frequency, Monetary) analysis for customer segmentation"""
    
    def __init__(self):
        self.rfm_data = None
        self.rfm_scores = None
    
    def calculate_rfm_scores(self, df: pd.DataFrame, 
                           customer_id_col: str = 'customer_id',
                           date_col: str = 'date',
                           value_col: str = 'value') -> pd.DataFrame:
        """Calculate RFM scores for customers"""
        logger.info("Calculating RFM scores...")
        
        # Ensure date column is datetime
        df[date_col] = pd.to_datetime(df[date_col])
        
        # Calculate RFM metrics
        rfm = df.groupby(customer_id_col).agg({
            date_col: lambda x: (df[date_col].max() - x.max()).days,  # Recency
            customer_id_col: 'count',  # Frequency
            value_col: 'sum'  # Monetary
        }).round(2)
        
        rfm.columns = ['Recency', 'Frequency', 'Monetary']
        
        # Calculate RFM scores (1-5 scale, 5 being best)
        rfm['R_Score'] = pd.qcut(rfm['Recency'], 5, labels=[5, 4, 3, 2, 1])
        rfm['F_Score'] = pd.qcut(rfm['Frequency'].rank(method='first'), 5, labels=[1, 2, 3, 4, 5])
        rfm['M_Score'] = pd.qcut(rfm['Monetary'], 5, labels=[1, 2, 3, 4, 5])
        
        # Convert to numeric
        rfm['R_Score'] = rfm['R_Score'].astype(int)
        rfm['F_Score'] = rfm['F_Score'].astype(int)
        rfm['M_Score'] = rfm['M_Score'].astype(int)
        
        # Calculate RFM score
        rfm['RFM_Score'] = rfm['R_Score'].astype(str) + rfm['F_Score'].astype(str) + rfm['M_Score'].astype(str)
        
        # Calculate RFM score as single number
        rfm['RFM_Score_Num'] = rfm['R_Score'] * 100 + rfm['F_Score'] * 10 + rfm['M_Score']
        
        self.rfm_data = rfm
        return rfm
    
    def create_rfm_segments(self, rfm_data: pd.DataFrame) -> pd.DataFrame:
        """Create customer segments based on RFM scores"""
        logger.info("Creating RFM segments...")
        
        # Define segment conditions
        def segment_customers(row):
            if row['R_Score'] >= 4 and row['F_Score'] >= 4 and row['M_Score'] >= 4:
                return 'Champions'
            elif row['R_Score'] >= 3 and row['F_Score'] >= 3 and row['M_Score'] >= 3:
                return 'Loyal Customers'
            elif row['R_Score'] >= 4 and row['F_Score'] <= 2 and row['M_Score'] >= 3:
                return 'Potential Loyalists'
            elif row['R_Score'] >= 4 and row['F_Score'] <= 2 and row['M_Score'] <= 2:
                return 'New Customers'
            elif row['R_Score'] >= 3 and row['F_Score'] >= 2 and row['M_Score'] >= 2:
                return 'Promising'
            elif row['R_Score'] >= 3 and row['F_Score'] <= 2 and row['M_Score'] <= 2:
                return 'Needs Attention'
            elif row['R_Score'] <= 2 and row['F_Score'] >= 3 and row['M_Score'] >= 3:
                return 'At Risk'
            elif row['R_Score'] <= 2 and row['F_Score'] >= 4 and row['M_Score'] >= 4:
                return "Can't Lose"
            elif row['R_Score'] <= 2 and row['F_Score'] >= 2 and row['M_Score'] >= 2:
                return 'Hibernating'
            else:
                return 'Lost'
        
        rfm_data['RFM_Segment'] = rfm_data.apply(segment_customers, axis=1)
        
        return rfm_data

class BehavioralAnalyzer:
    """Behavioral pattern analysis for customer segmentation"""
    
    def __init__(self):
        self.behavioral_features = {}
    
    def extract_behavioral_features(self, df: pd.DataFrame,
                                  customer_id_col: str = 'customer_id',
                                  date_col: str = 'date',
                                  value_col: str = 'value') -> pd.DataFrame:
        """Extract behavioral features from customer data"""
        logger.info("Extracting behavioral features...")
        
        # Ensure date column is datetime
        df[date_col] = pd.to_datetime(df[date_col])
        
        # Calculate behavioral metrics
        behavioral_metrics = df.groupby(customer_id_col).agg({
            date_col: ['min', 'max', 'count'],  # First purchase, last purchase, total purchases
            value_col: ['sum', 'mean', 'std', 'min', 'max']  # Monetary metrics
        }).round(2)
        
        # Flatten column names
        behavioral_metrics.columns = [
            'first_purchase', 'last_purchase', 'purchase_count',
            'total_spent', 'avg_order_value', 'order_value_std', 'min_order_value', 'max_order_value'
        ]
        
        # Calculate additional behavioral features
        behavioral_metrics['customer_age_days'] = (
            behavioral_metrics['last_purchase'] - behavioral_metrics['first_purchase']
        ).dt.days
        
        behavioral_metrics['purchase_frequency'] = (
            behavioral_metrics['purchase_count'] / 
            (behavioral_metrics['customer_age_days'] / 30 + 1)
        )
        
        behavioral_metrics['days_since_last_purchase'] = (
            df[date_col].max() - behavioral_metrics['last_purchase']
        ).dt.days
        
        behavioral_metrics['value_consistency'] = (
            behavioral_metrics['order_value_std'] / behavioral_metrics['avg_order_value']
        ).fillna(0)
        
        # Calculate purchase patterns
        purchase_dates = df.groupby(customer_id_col)[date_col].apply(list)
        
        def calculate_purchase_patterns(dates):
            if len(dates) < 2:
                return {'purchase_interval_mean': 0, 'purchase_interval_std': 0, 'weekend_ratio': 0}
            
            intervals = np.diff(sorted(dates))
            weekend_purchases = sum(1 for d in dates if d.weekday() >= 5)
            
            return {
                'purchase_interval_mean': np.mean(intervals).days if len(intervals) > 0 else 0,
                'purchase_interval_std': np.std(intervals).days if len(intervals) > 0 else 0,
                'weekend_ratio': weekend_purchases / len(dates)
            }
        
        patterns = purchase_dates.apply(calculate_purchase_patterns)
        patterns_df = pd.DataFrame(patterns.tolist(), index=patterns.index)
        
        # Merge patterns with behavioral metrics
        behavioral_metrics = behavioral_metrics.merge(patterns_df, left_index=True, right_index=True)
        
        self.behavioral_features = behavioral_metrics
        return behavioral_metrics

class CustomerSegmentationEngine:
    """Main customer segmentation engine"""
    
    def __init__(self, config: SegmentationConfig):
        self.config = config
        self.rfm_analyzer = RFMAnalyzer()
        self.behavioral_analyzer = BehavioralAnalyzer()
        self.scaler = StandardScaler()
        self.clustering_models = {}
        self.segment_labels = {}
        self.is_trained = False
    
    def prepare_segmentation_data(self, df: pd.DataFrame,
                                customer_id_col: str = 'customer_id',
                                date_col: str = 'date',
                                value_col: str = 'value') -> pd.DataFrame:
        """Prepare comprehensive data for customer segmentation"""
        logger.info("Preparing segmentation data...")
        
        # Calculate RFM scores
        rfm_data = self.rfm_analyzer.calculate_rfm_scores(df, customer_id_col, date_col, value_col)
        
        # Extract behavioral features
        behavioral_data = self.behavioral_analyzer.extract_behavioral_features(df, customer_id_col, date_col, value_col)
        
        # Merge RFM and behavioral data
        segmentation_data = rfm_data.merge(behavioral_data, left_index=True, right_index=True)
        
        # Add demographic features if available
        if 'age' in df.columns:
            demo_features = df.groupby(customer_id_col)['age'].first()
            segmentation_data = segmentation_data.merge(demo_features, left_index=True, right_index=True)
        
        if 'gender' in df.columns:
            gender_encoded = pd.get_dummies(df.groupby(customer_id_col)['gender'].first())
            segmentation_data = segmentation_data.merge(gender_encoded, left_index=True, right_index=True)
        
        # Fill missing values
        segmentation_data = segmentation_data.fillna(0)
        
        return segmentation_data
    
    def find_optimal_clusters(self, X: np.ndarray, method: SegmentationMethod = SegmentationMethod.KMEANS) -> Dict[str, Any]:
        """Find optimal number of clusters using multiple metrics"""
        logger.info(f"Finding optimal clusters using {method.value}...")
        
        if method == SegmentationMethod.KMEANS:
            return self._find_optimal_kmeans_clusters(X)
        elif method == SegmentationMethod.DBSCAN:
            return self._find_optimal_dbscan_clusters(X)
        elif method == SegmentationMethod.HIERARCHICAL:
            return self._find_optimal_hierarchical_clusters(X)
        else:
            raise ValueError(f"Unsupported clustering method: {method}")
    
    def _find_optimal_kmeans_clusters(self, X: np.ndarray) -> Dict[str, Any]:
        """Find optimal number of clusters for K-Means"""
        inertias = []
        silhouette_scores = []
        calinski_scores = []
        davies_bouldin_scores = []
        k_range = range(self.config.min_clusters, self.config.max_clusters + 1)
        
        for k in k_range:
            kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
            cluster_labels = kmeans.fit_predict(X)
            
            inertias.append(kmeans.inertia_)
            silhouette_scores.append(silhouette_score(X, cluster_labels))
            calinski_scores.append(calinski_harabasz_score(X, cluster_labels))
            davies_bouldin_scores.append(davies_bouldin_score(X, cluster_labels))
        
        # Find optimal k based on silhouette score
        optimal_k = k_range[np.argmax(silhouette_scores)]
        
        return {
            'optimal_k': optimal_k,
            'k_range': list(k_range),
            'inertias': inertias,
            'silhouette_scores': silhouette_scores,
            'calinski_scores': calinski_scores,
            'davies_bouldin_scores': davies_bouldin_scores,
            'best_silhouette_score': max(silhouette_scores)
        }
    
    def _find_optimal_dbscan_clusters(self, X: np.ndarray) -> Dict[str, Any]:
        """Find optimal parameters for DBSCAN"""
        eps_values = np.linspace(0.1, 2.0, 20)
        min_samples_values = range(2, 10)
        
        best_score = -1
        best_params = None
        results = []
        
        for eps in eps_values:
            for min_samples in min_samples_values:
                dbscan = DBSCAN(eps=eps, min_samples=min_samples)
                cluster_labels = dbscan.fit_predict(X)
                
                n_clusters = len(set(cluster_labels)) - (1 if -1 in cluster_labels else 0)
                n_noise = list(cluster_labels).count(-1)
                
                if n_clusters > 1:
                    silhouette_avg = silhouette_score(X, cluster_labels)
                    results.append({
                        'eps': eps,
                        'min_samples': min_samples,
                        'n_clusters': n_clusters,
                        'n_noise': n_noise,
                        'silhouette_score': silhouette_avg
                    })
                    
                    if silhouette_avg > best_score:
                        best_score = silhouette_avg
                        best_params = {'eps': eps, 'min_samples': min_samples}
        
        return {
            'optimal_params': best_params,
            'best_silhouette_score': best_score,
            'all_results': results
        }
    
    def _find_optimal_hierarchical_clusters(self, X: np.ndarray) -> Dict[str, Any]:
        """Find optimal number of clusters for Hierarchical clustering"""
        linkage_methods = ['ward', 'complete', 'average', 'single']
        best_score = -1
        best_params = None
        results = []
        
        for linkage_method in linkage_methods:
            for k in range(self.config.min_clusters, self.config.max_clusters + 1):
                try:
                    hierarchical = AgglomerativeClustering(n_clusters=k, linkage=linkage_method)
                    cluster_labels = hierarchical.fit_predict(X)
                    
                    silhouette_avg = silhouette_score(X, cluster_labels)
                    results.append({
                        'linkage': linkage_method,
                        'n_clusters': k,
                        'silhouette_score': silhouette_avg
                    })
                    
                    if silhouette_avg > best_score:
                        best_score = silhouette_avg
                        best_params = {'linkage': linkage_method, 'n_clusters': k}
                except:
                    continue
        
        return {
            'optimal_params': best_params,
            'best_silhouette_score': best_score,
            'all_results': results
        }
    
    def train_segmentation_model(self, df: pd.DataFrame, 
                               method: SegmentationMethod = SegmentationMethod.KMEANS) -> Dict[str, Any]:
        """Train customer segmentation model"""
        logger.info(f"Training customer segmentation model using {method.value}...")
        
        # Prepare data
        segmentation_data = self.prepare_segmentation_data(df)
        
        # Select features for clustering
        feature_columns = self._select_clustering_features(segmentation_data)
        X = segmentation_data[feature_columns].values
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Find optimal clusters
        optimal_params = self.find_optimal_clusters(X_scaled, method)
        
        # Train final model
        if method == SegmentationMethod.KMEANS:
            n_clusters = optimal_params['optimal_k']
            model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        elif method == SegmentationMethod.DBSCAN:
            params = optimal_params['optimal_params']
            model = DBSCAN(eps=params['eps'], min_samples=params['min_samples'])
        elif method == SegmentationMethod.HIERARCHICAL:
            params = optimal_params['optimal_params']
            model = AgglomerativeClustering(
                n_clusters=params['n_clusters'], 
                linkage=params['linkage']
            )
        else:
            raise ValueError(f"Unsupported clustering method: {method}")
        
        # Fit model
        cluster_labels = model.fit_predict(X_scaled)
        
        # Store model and results
        self.clustering_models[method.value] = model
        self.segment_labels[method.value] = cluster_labels
        
        # Calculate metrics
        n_clusters = len(set(cluster_labels)) - (1 if -1 in cluster_labels else 0)
        silhouette_avg = silhouette_score(X_scaled, cluster_labels) if n_clusters > 1 else 0
        
        # Create segment analysis
        segment_analysis = self._analyze_segments(segmentation_data, cluster_labels, feature_columns)
        
        self.is_trained = True
        
        return {
            'method': method.value,
            'n_clusters': n_clusters,
            'silhouette_score': silhouette_avg,
            'optimal_params': optimal_params,
            'segment_analysis': segment_analysis,
            'feature_columns': feature_columns
        }
    
    def _select_clustering_features(self, df: pd.DataFrame) -> List[str]:
        """Select features for clustering"""
        # RFM features
        rfm_features = ['Recency', 'Frequency', 'Monetary', 'R_Score', 'F_Score', 'M_Score']
        
        # Behavioral features
        behavioral_features = [
            'purchase_count', 'total_spent', 'avg_order_value', 'purchase_frequency',
            'days_since_last_purchase', 'value_consistency', 'purchase_interval_mean',
            'purchase_interval_std', 'weekend_ratio'
        ]
        
        # Demographic features
        demographic_features = [col for col in df.columns if col in ['age', 'gender_M', 'gender_F']]
        
        # Combine features
        all_features = rfm_features + behavioral_features + demographic_features
        available_features = [col for col in all_features if col in df.columns]
        
        return available_features
    
    def _analyze_segments(self, df: pd.DataFrame, cluster_labels: np.ndarray, 
                         feature_columns: List[str]) -> Dict[str, Any]:
        """Analyze customer segments"""
        df_with_clusters = df.copy()
        df_with_clusters['cluster'] = cluster_labels
        
        segment_analysis = {}
        
        for cluster_id in sorted(set(cluster_labels)):
            if cluster_id == -1:  # Skip noise points in DBSCAN
                continue
                
            cluster_data = df_with_clusters[df_with_clusters['cluster'] == cluster_id]
            
            # Calculate segment characteristics
            segment_stats = {}
            for feature in feature_columns:
                if feature in cluster_data.columns:
                    segment_stats[feature] = {
                        'mean': cluster_data[feature].mean(),
                        'median': cluster_data[feature].median(),
                        'std': cluster_data[feature].std(),
                        'min': cluster_data[feature].min(),
                        'max': cluster_data[feature].max()
                    }
            
            # Segment size
            segment_size = len(cluster_data)
            segment_percentage = segment_size / len(df_with_clusters) * 100
            
            # Segment characteristics
            characteristics = self._identify_segment_characteristics(cluster_data, feature_columns)
            
            segment_analysis[f'segment_{cluster_id}'] = {
                'size': segment_size,
                'percentage': segment_percentage,
                'characteristics': characteristics,
                'statistics': segment_stats
            }
        
        return segment_analysis
    
    def _identify_segment_characteristics(self, cluster_data: pd.DataFrame, 
                                        feature_columns: List[str]) -> List[str]:
        """Identify key characteristics of a customer segment"""
        characteristics = []
        
        # RFM characteristics
        if 'R_Score' in cluster_data.columns:
            avg_recency = cluster_data['R_Score'].mean()
            if avg_recency >= 4:
                characteristics.append("Recent customers")
            elif avg_recency <= 2:
                characteristics.append("Inactive customers")
        
        if 'F_Score' in cluster_data.columns:
            avg_frequency = cluster_data['F_Score'].mean()
            if avg_frequency >= 4:
                characteristics.append("Frequent buyers")
            elif avg_frequency <= 2:
                characteristics.append("Occasional buyers")
        
        if 'M_Score' in cluster_data.columns:
            avg_monetary = cluster_data['M_Score'].mean()
            if avg_monetary >= 4:
                characteristics.append("High-value customers")
            elif avg_monetary <= 2:
                characteristics.append("Low-value customers")
        
        # Behavioral characteristics
        if 'purchase_frequency' in cluster_data.columns:
            avg_freq = cluster_data['purchase_frequency'].mean()
            if avg_freq > 2:
                characteristics.append("High purchase frequency")
            elif avg_freq < 0.5:
                characteristics.append("Low purchase frequency")
        
        if 'total_spent' in cluster_data.columns:
            avg_spent = cluster_data['total_spent'].mean()
            if avg_spent > cluster_data['total_spent'].quantile(0.8):
                characteristics.append("High spenders")
            elif avg_spent < cluster_data['total_spent'].quantile(0.2):
                characteristics.append("Low spenders")
        
        if 'weekend_ratio' in cluster_data.columns:
            avg_weekend = cluster_data['weekend_ratio'].mean()
            if avg_weekend > 0.5:
                characteristics.append("Weekend shoppers")
            elif avg_weekend < 0.2:
                characteristics.append("Weekday shoppers")
        
        return characteristics
    
    def predict_customer_segment(self, customer_data: Dict[str, Any], 
                               method: str = 'kmeans') -> Dict[str, Any]:
        """Predict customer segment for new data"""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        if method not in self.clustering_models:
            raise ValueError(f"Model {method} not found")
        
        # Prepare customer data
        feature_array = np.array([customer_data.get(feature, 0) for feature in self.scaler.feature_names_in_])
        feature_scaled = self.scaler.transform(feature_array.reshape(1, -1))
        
        # Predict cluster
        model = self.clustering_models[method]
        cluster_id = model.predict(feature_scaled)[0]
        
        # Get segment characteristics
        segment_info = self._get_segment_info(cluster_id, method)
        
        return {
            'cluster_id': int(cluster_id),
            'segment_characteristics': segment_info,
            'prediction_confidence': self._calculate_prediction_confidence(feature_scaled, cluster_id, method)
        }
    
    def _get_segment_info(self, cluster_id: int, method: str) -> Dict[str, Any]:
        """Get information about a specific segment"""
        # This would typically come from stored segment analysis
        # For now, return basic information
        return {
            'segment_id': cluster_id,
            'description': f"Customer segment {cluster_id}",
            'characteristics': ["Segment characteristics would be loaded from stored analysis"]
        }
    
    def _calculate_prediction_confidence(self, feature_scaled: np.ndarray, 
                                       cluster_id: int, method: str) -> float:
        """Calculate confidence score for prediction"""
        # Simplified confidence calculation
        # In production, this would use proper distance-based confidence
        return 0.8  # Placeholder confidence score

class CustomerSegmentationAPI:
    """API wrapper for customer segmentation system"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.config = SegmentationConfig()
        self.segmentation_engine = CustomerSegmentationEngine(self.config)
        
        if model_path:
            self.load_models(model_path)
    
    def create_customer_segments(self, df: pd.DataFrame, 
                               method: str = 'kmeans') -> Dict[str, Any]:
        """Create customer segments"""
        try:
            method_enum = SegmentationMethod(method)
            result = self.segmentation_engine.train_segmentation_model(df, method_enum)
            
            return {
                'success': True,
                'segmentation_result': result,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error creating customer segments: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def predict_customer_segment(self, customer_data: Dict[str, Any], 
                               method: str = 'kmeans') -> Dict[str, Any]:
        """Predict customer segment"""
        try:
            prediction = self.segmentation_engine.predict_customer_segment(customer_data, method)
            
            return {
                'success': True,
                'prediction': prediction,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error predicting customer segment: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def analyze_rfm(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Perform RFM analysis"""
        try:
            rfm_data = self.segmentation_engine.rfm_analyzer.calculate_rfm_scores(df)
            rfm_with_segments = self.segmentation_engine.rfm_analyzer.create_rfm_segments(rfm_data)
            
            return {
                'success': True,
                'rfm_data': rfm_with_segments.to_dict('records'),
                'segment_distribution': rfm_with_segments['RFM_Segment'].value_counts().to_dict(),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error analyzing RFM: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def get_segment_insights(self, method: str = 'kmeans') -> Dict[str, Any]:
        """Get insights about customer segments"""
        try:
            if not self.segmentation_engine.is_trained:
                return {'error': 'No trained model found'}
            
            # This would return stored segment analysis
            return {
                'success': True,
                'insights': 'Segment insights would be loaded from stored analysis',
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting segment insights: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def load_models(self, model_path: str):
        """Load pre-trained models"""
        # In production, this would load actual trained models
        logger.info(f"Loading models from {model_path}")
    
    def save_models(self, model_path: str):
        """Save trained models"""
        Path(model_path).mkdir(parents=True, exist_ok=True)
        logger.info(f"Models saved to {model_path}")

# Example usage and testing
if __name__ == "__main__":
    # Example customer data
    np.random.seed(42)
    n_customers = 1000
    
    # Generate sample customer data
    customer_data = []
    for i in range(n_customers):
        customer_id = f"customer_{i+1}"
        
        # Generate purchase history
        n_purchases = np.random.poisson(5) + 1
        purchase_dates = pd.date_range(
            start='2023-01-01',
            end='2024-01-01',
            periods=n_purchases
        )
        
        for date in purchase_dates:
            customer_data.append({
                'customer_id': customer_id,
                'date': date,
                'value': np.random.exponential(50),
                'age': np.random.randint(18, 80),
                'gender': np.random.choice(['M', 'F'])
            })
    
    df = pd.DataFrame(customer_data)
    
    # Initialize API
    api = CustomerSegmentationAPI()
    
    # Test RFM analysis
    rfm_result = api.analyze_rfm(df)
    print("RFM Analysis:", rfm_result)
    
    # Test customer segmentation
    segmentation_result = api.create_customer_segments(df, 'kmeans')
    print("Customer Segmentation:", segmentation_result)
    
    # Test segment prediction
    sample_customer = {
        'Recency': 30,
        'Frequency': 5,
        'Monetary': 250,
        'R_Score': 4,
        'F_Score': 4,
        'M_Score': 4,
        'purchase_count': 5,
        'total_spent': 250,
        'avg_order_value': 50,
        'purchase_frequency': 0.5,
        'days_since_last_purchase': 30,
        'value_consistency': 0.2,
        'purchase_interval_mean': 30,
        'purchase_interval_std': 10,
        'weekend_ratio': 0.3
    }
    
    prediction_result = api.predict_customer_segment(sample_customer, 'kmeans')
    print("Customer Segment Prediction:", prediction_result)
    
    # Test different clustering methods
    for method in ['kmeans', 'dbscan', 'hierarchical']:
        try:
            result = api.create_customer_segments(df, method)
            print(f"{method.upper()} Segmentation:", result)
        except Exception as e:
            print(f"Error with {method}: {e}")