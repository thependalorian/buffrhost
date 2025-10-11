"""
Fraud Detection System for Hospitality Platform
==============================================

Advanced fraud detection system using machine learning techniques including
Isolation Forest, One-Class SVM, and ensemble methods for detecting fraudulent
transactions, bookings, and user behaviors in hospitality operations.

Features:
- Real-time fraud detection
- Multiple detection algorithms
- Behavioral pattern analysis
- Transaction risk scoring
- Adaptive learning capabilities

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

class FraudDetectionSystem:
    """
    Comprehensive Fraud Detection System for Hospitality Platform
    
    This class implements a multi-layered fraud detection system that combines
    various machine learning techniques to identify fraudulent activities in
    hospitality operations including bookings, payments, and user behaviors.
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        Initialize the fraud detection system
        
        Args:
            config: Configuration dictionary for the system
        """
        self.config = config or {}
        self.models = {}
        self.scalers = {}
        self.feature_names = []
        self.fraud_threshold = self.config.get('fraud_threshold', 0.5)
        self.alert_threshold = self.config.get('alert_threshold', 0.7)
        
        # Initialize logging
        self.logger = logging.getLogger(__name__)
        
        # Setup database connection
        self.db_path = "fraud_detection.db"
        self._setup_database()
        
        # Initialize models
        self._initialize_models()
    
    def _setup_database(self):
        """Setup SQLite database for storing fraud detection data"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create tables for fraud detection
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS fraud_alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                transaction_id TEXT,
                user_id TEXT,
                fraud_score REAL,
                risk_level TEXT,
                detection_method TEXT,
                features TEXT,
                created_at TIMESTAMP,
                status TEXT DEFAULT 'active'
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS fraud_patterns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pattern_type TEXT,
                pattern_data TEXT,
                confidence REAL,
                created_at TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def _initialize_models(self):
        """Initialize fraud detection models"""
        try:
            from sklearn.ensemble import IsolationForest
            from sklearn.svm import OneClassSVM
            from sklearn.preprocessing import StandardScaler
            
            # Isolation Forest for anomaly detection
            self.models['isolation_forest'] = IsolationForest(
                contamination=0.1,
                random_state=42
            )
            
            # One-Class SVM for outlier detection
            self.models['one_class_svm'] = OneClassSVM(
                nu=0.1,
                kernel='rbf'
            )
            
            # Standard scaler for feature normalization
            self.scalers['standard'] = StandardScaler()
            
            self.logger.info("Fraud detection models initialized successfully")
            
        except ImportError as e:
            self.logger.error(f"Failed to initialize models: {e}")
            raise
    
    def detect_fraud(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Detect fraud in the given data
        
        Args:
            data: Dictionary containing transaction/user data
            
        Returns:
            Dictionary containing fraud detection results
        """
        try:
            # Extract features
            features = self._extract_features(data)
            
            # Normalize features
            features_scaled = self.scalers['standard'].fit_transform([features])
            
            # Get fraud scores from different models
            scores = {}
            
            # Isolation Forest score (lower = more anomalous)
            if_score = self.models['isolation_forest'].decision_function(features_scaled)[0]
            scores['isolation_forest'] = 1 - (if_score + 1) / 2  # Normalize to 0-1
            
            # One-Class SVM score (lower = more anomalous)
            svm_score = self.models['one_class_svm'].decision_function(features_scaled)[0]
            scores['one_class_svm'] = 1 - (svm_score + 1) / 2  # Normalize to 0-1
            
            # Combined score
            combined_score = np.mean(list(scores.values()))
            
            # Determine risk level
            if combined_score >= self.alert_threshold:
                risk_level = "HIGH"
            elif combined_score >= self.fraud_threshold:
                risk_level = "MEDIUM"
            else:
                risk_level = "LOW"
            
            # Create result
            result = {
                'fraud_score': combined_score,
                'risk_level': risk_level,
                'individual_scores': scores,
                'is_fraud': combined_score >= self.fraud_threshold,
                'requires_alert': combined_score >= self.alert_threshold,
                'detection_methods': list(scores.keys()),
                'timestamp': datetime.now().isoformat()
            }
            
            # Store alert if high risk
            if result['requires_alert']:
                self._store_fraud_alert(data, result)
            
            return result
            
        except Exception as e:
            self.logger.error(f"Error in fraud detection: {e}")
            return {
                'fraud_score': 0.0,
                'risk_level': 'UNKNOWN',
                'is_fraud': False,
                'requires_alert': False,
                'error': str(e)
            }
    
    def _extract_features(self, data: Dict[str, Any]) -> List[float]:
        """Extract features from the input data"""
        features = []
        
        # Transaction amount (normalized)
        amount = data.get('amount', 0)
        features.append(amount / 1000.0)  # Normalize to thousands
        
        # Time-based features
        hour = data.get('hour', 12)
        features.append(hour / 24.0)  # Normalize to 0-1
        
        day_of_week = data.get('day_of_week', 1)
        features.append(day_of_week / 7.0)  # Normalize to 0-1
        
        # User behavior features
        user_age_days = data.get('user_age_days', 30)
        features.append(min(user_age_days / 365.0, 1.0))  # Cap at 1 year
        
        # Location features
        distance_from_home = data.get('distance_from_home', 0)
        features.append(min(distance_from_home / 1000.0, 1.0))  # Cap at 1000km
        
        # Device features
        is_mobile = data.get('is_mobile', 0)
        features.append(float(is_mobile))
        
        # Payment method features
        payment_method_risk = data.get('payment_method_risk', 0.5)
        features.append(payment_method_risk)
        
        return features
    
    def _store_fraud_alert(self, data: Dict[str, Any], result: Dict[str, Any]):
        """Store fraud alert in database"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO fraud_alerts 
            (transaction_id, user_id, fraud_score, risk_level, detection_method, features, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('transaction_id', ''),
            data.get('user_id', ''),
            result['fraud_score'],
            result['risk_level'],
            ','.join(result['detection_methods']),
            json.dumps(data),
            datetime.now()
        ))
        
        conn.commit()
        conn.close()
    
    def train_models(self, training_data: List[Dict[str, Any]]):
        """
        Train fraud detection models on historical data
        
        Args:
            training_data: List of historical transaction data
        """
        try:
            # Extract features from training data
            X = np.array([self._extract_features(data) for data in training_data])
            
            # Fit scaler
            self.scalers['standard'].fit(X)
            X_scaled = self.scalers['standard'].transform(X)
            
            # Train models
            self.models['isolation_forest'].fit(X_scaled)
            self.models['one_class_svm'].fit(X_scaled)
            
            self.logger.info("Fraud detection models trained successfully")
            
        except Exception as e:
            self.logger.error(f"Error training models: {e}")
            raise
    
    def get_fraud_statistics(self) -> Dict[str, Any]:
        """Get fraud detection statistics"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get total alerts
        cursor.execute("SELECT COUNT(*) FROM fraud_alerts")
        total_alerts = cursor.fetchone()[0]
        
        # Get alerts by risk level
        cursor.execute("SELECT risk_level, COUNT(*) FROM fraud_alerts GROUP BY risk_level")
        alerts_by_level = dict(cursor.fetchall())
        
        # Get recent alerts (last 24 hours)
        cursor.execute("""
            SELECT COUNT(*) FROM fraud_alerts 
            WHERE created_at >= datetime('now', '-1 day')
        """)
        recent_alerts = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            'total_alerts': total_alerts,
            'alerts_by_level': alerts_by_level,
            'recent_alerts_24h': recent_alerts,
            'fraud_threshold': self.fraud_threshold,
            'alert_threshold': self.alert_threshold
        }

# Core ML libraries
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.svm import OneClassSVM
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler, RobustScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.neighbors import LocalOutlierFactor

# Time series analysis
from scipy import stats
from scipy.spatial.distance import pdist, squareform
import warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FraudType(Enum):
    """Types of fraud to detect"""
    PAYMENT_FRAUD = "payment_fraud"
    BOOKING_FRAUD = "booking_fraud"
    ACCOUNT_TAKEOVER = "account_takeover"
    REFUND_FRAUD = "refund_fraud"
    CHARGEBACK_FRAUD = "chargeback_fraud"
    IDENTITY_FRAUD = "identity_fraud"
    PROMOTIONAL_ABUSE = "promotional_abuse"

@dataclass
class FraudDetectionConfig:
    """Configuration for fraud detection system"""
    # Model parameters
    contamination: float = 0.1  # Expected proportion of outliers
    random_state: int = 42
    n_estimators: int = 100
    
    # Detection thresholds
    fraud_threshold: float = 0.7
    suspicious_threshold: float = 0.4
    review_threshold: float = 0.2
    
    # Feature engineering
    time_window_hours: int = 24
    max_features: int = 50
    
    # Model persistence
    model_path: str = "models/fraud_detection"
    version: str = "1.0.0"

class FraudFeatureEngineer:
    """Feature engineering for fraud detection"""
    
    def __init__(self, config: FraudDetectionConfig):
        self.config = config
        self.scaler = RobustScaler()  # More robust to outliers than StandardScaler
        self.feature_stats = {}
        
    def create_transaction_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create transaction-based fraud features"""
        features = df.copy()
        
        # Amount-based features
        if 'amount' in df.columns:
            features['amount_log'] = np.log1p(df['amount'])
            features['amount_zscore'] = stats.zscore(df['amount'])
            features['amount_percentile'] = df['amount'].rank(pct=True)
        
        # Time-based features
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            features['hour'] = df['timestamp'].dt.hour
            features['day_of_week'] = df['timestamp'].dt.dayofweek
            features['is_weekend'] = features['day_of_week'].isin([5, 6]).astype(int)
            features['is_night'] = features['hour'].isin([22, 23, 0, 1, 2, 3, 4, 5]).astype(int)
        
        # Velocity features
        if 'user_id' in df.columns and 'timestamp' in df.columns:
            features = self._add_velocity_features(features, 'user_id')
        
        # Frequency features
        if 'user_id' in df.columns:
            features = self._add_frequency_features(features, 'user_id')
        
        return features
    
    def create_behavioral_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create behavioral pattern features"""
        features = df.copy()
        
        # Device and location features
        if 'device_fingerprint' in df.columns:
            features['device_frequency'] = df.groupby('device_fingerprint')['device_fingerprint'].transform('count')
            features['is_new_device'] = (features['device_frequency'] == 1).astype(int)
        
        if 'ip_address' in df.columns:
            features['ip_frequency'] = df.groupby('ip_address')['ip_address'].transform('count')
            features['is_new_ip'] = (features['ip_frequency'] == 1).astype(int)
        
        # Session features
        if 'session_id' in df.columns and 'timestamp' in df.columns:
            features = self._add_session_features(features)
        
        # Booking pattern features
        if 'booking_type' in df.columns:
            features['booking_type_frequency'] = df.groupby('booking_type')['booking_type'].transform('count')
            features['is_rare_booking_type'] = (features['booking_type_frequency'] < 5).astype(int)
        
        return features
    
    def create_network_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create network and relationship features"""
        features = df.copy()
        
        # User network features
        if 'user_id' in df.columns and 'booking_id' in df.columns:
            features = self._add_user_network_features(features)
        
        # Payment method features
        if 'payment_method' in df.columns:
            features['payment_method_frequency'] = df.groupby('payment_method')['payment_method'].transform('count')
            features['is_rare_payment_method'] = (features['payment_method_frequency'] < 3).astype(int)
        
        return features
    
    def _add_velocity_features(self, df: pd.DataFrame, group_col: str) -> pd.DataFrame:
        """Add velocity-based features"""
        features = df.copy()
        
        # Transactions per hour
        df_sorted = df.sort_values(['timestamp', group_col])
        df_sorted['time_diff'] = df_sorted.groupby(group_col)['timestamp'].diff().dt.total_seconds() / 3600
        df_sorted['txn_per_hour'] = 1 / (df_sorted['time_diff'] + 1e-6)
        
        features['txn_velocity'] = df_sorted['txn_per_hour']
        features['high_velocity'] = (features['txn_velocity'] > features['txn_velocity'].quantile(0.95)).astype(int)
        
        return features
    
    def _add_frequency_features(self, df: pd.DataFrame, group_col: str) -> pd.DataFrame:
        """Add frequency-based features"""
        features = df.copy()
        
        # Transaction count
        features['user_txn_count'] = df.groupby(group_col)[group_col].transform('count')
        features['is_high_frequency_user'] = (features['user_txn_count'] > features['user_txn_count'].quantile(0.9)).astype(int)
        
        # Recent activity
        if 'timestamp' in df.columns:
            recent_cutoff = df['timestamp'].max() - timedelta(hours=self.config.time_window_hours)
            recent_mask = df['timestamp'] >= recent_cutoff
            features['recent_txn_count'] = df[recent_mask].groupby(group_col)[group_col].transform('count').fillna(0)
        
        return features
    
    def _add_session_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add session-based features"""
        features = df.copy()
        
        # Session duration
        session_duration = df.groupby('session_id')['timestamp'].agg(['min', 'max'])
        session_duration['duration_minutes'] = (session_duration['max'] - session_duration['min']).dt.total_seconds() / 60
        features['session_duration'] = features['session_id'].map(session_duration['duration_minutes']).fillna(0)
        
        # Actions per session
        features['actions_per_session'] = df.groupby('session_id')['session_id'].transform('count')
        
        return features
    
    def _add_user_network_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add user network features"""
        features = df.copy()
        
        # Shared bookings (potential collusion)
        if 'booking_id' in df.columns:
            shared_bookings = df.groupby('booking_id')['user_id'].nunique()
            features['shared_booking_count'] = features['booking_id'].map(shared_bookings).fillna(0)
            features['is_shared_booking'] = (features['shared_booking_count'] > 1).astype(int)
        
        return features
    
    def create_anomaly_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create statistical anomaly features"""
        features = df.copy()
        
        # Statistical outliers
        numeric_columns = df.select_dtypes(include=[np.number]).columns
        
        for col in numeric_columns:
            if col in df.columns:
                # Z-score based outliers
                z_scores = np.abs(stats.zscore(df[col].fillna(0)))
                features[f'{col}_is_outlier'] = (z_scores > 3).astype(int)
                
                # IQR based outliers
                Q1 = df[col].quantile(0.25)
                Q3 = df[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                features[f'{col}_is_iqr_outlier'] = ((df[col] < lower_bound) | (df[col] > upper_bound)).astype(int)
        
        return features
    
    def prepare_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Prepare all features for fraud detection"""
        logger.info("Preparing fraud detection features...")
        
        # Create all feature types
        features = self.create_transaction_features(df)
        features = self.create_behavioral_features(features)
        features = self.create_network_features(features)
        features = self.create_anomaly_features(features)
        
        # Handle missing values
        features = features.fillna(features.median())
        
        # Select numeric features only
        numeric_features = features.select_dtypes(include=[np.number])
        
        # Scale features
        features_scaled = pd.DataFrame(
            self.scaler.fit_transform(numeric_features),
            columns=numeric_features.columns,
            index=numeric_features.index
        )
        
        logger.info(f"Prepared {features_scaled.shape[1]} features for {features_scaled.shape[0]} samples")
        return features_scaled

class FraudDetectionModel:
    """Main fraud detection model class"""
    
    def __init__(self, config: FraudDetectionConfig):
        self.config = config
        self.feature_engineer = FraudFeatureEngineer(config)
        self.models = {}
        self.is_trained = False
        self.fraud_thresholds = {}
        
        # Create model directory
        Path(config.model_path).mkdir(parents=True, exist_ok=True)
    
    def train_ensemble_models(self, df: pd.DataFrame, fraud_labels: Optional[pd.Series] = None) -> Dict[str, Any]:
        """Train ensemble of fraud detection models"""
        logger.info("Training fraud detection ensemble...")
        
        # Prepare features
        X = self.feature_engineer.prepare_features(df)
        
        # Train different models
        models_metrics = {}
        
        # 1. Isolation Forest (unsupervised)
        iso_forest = IsolationForest(
            contamination=self.config.contamination,
            random_state=self.config.random_state,
            n_estimators=self.config.n_estimators
        )
        iso_forest.fit(X)
        self.models['isolation_forest'] = iso_forest
        
        # 2. One-Class SVM (unsupervised)
        one_class_svm = OneClassSVM(
            nu=self.config.contamination,
            kernel='rbf',
            gamma='scale'
        )
        one_class_svm.fit(X)
        self.models['one_class_svm'] = one_class_svm
        
        # 3. Local Outlier Factor (unsupervised)
        lof = LocalOutlierFactor(
            n_neighbors=20,
            contamination=self.config.contamination
        )
        lof.fit(X)
        self.models['lof'] = lof
        
        # 4. DBSCAN clustering (unsupervised)
        dbscan = DBSCAN(eps=0.5, min_samples=5)
        dbscan.fit(X)
        self.models['dbscan'] = dbscan
        
        # If we have labeled fraud data, train supervised models
        if fraud_labels is not None:
            X_train, X_test, y_train, y_test = train_test_split(
                X, fraud_labels, test_size=0.2, random_state=self.config.random_state, stratify=fraud_labels
            )
            
            # Random Forest for supervised learning
            rf_model = RandomForestClassifier(
                n_estimators=self.config.n_estimators,
                random_state=self.config.random_state,
                class_weight='balanced'
            )
            rf_model.fit(X_train, y_train)
            self.models['random_forest'] = rf_model
            
            # Evaluate supervised model
            y_pred = rf_model.predict(X_test)
            y_pred_proba = rf_model.predict_proba(X_test)[:, 1]
            
            models_metrics['random_forest'] = {
                'accuracy': (y_pred == y_test).mean(),
                'auc_roc': roc_auc_score(y_test, y_pred_proba),
                'classification_report': classification_report(y_test, y_pred, output_dict=True)
            }
        
        # Calculate ensemble thresholds
        self._calculate_ensemble_thresholds(X)
        
        self.is_trained = True
        logger.info("Fraud detection ensemble training completed")
        
        return models_metrics
    
    def _calculate_ensemble_thresholds(self, X: pd.DataFrame):
        """Calculate thresholds for ensemble scoring"""
        # Get anomaly scores from all models
        scores = {}
        
        # Isolation Forest scores (lower = more anomalous)
        iso_scores = self.models['isolation_forest'].decision_function(X)
        scores['isolation_forest'] = 1 - (iso_scores - iso_scores.min()) / (iso_scores.max() - iso_scores.min())
        
        # One-Class SVM scores (lower = more anomalous)
        svm_scores = self.models['one_class_svm'].decision_function(X)
        scores['one_class_svm'] = 1 - (svm_scores - svm_scores.min()) / (svm_scores.max() - svm_scores.min())
        
        # LOF scores (higher = more anomalous)
        lof_scores = -self.models['lof'].negative_outlier_factor_
        scores['lof'] = (lof_scores - lof_scores.min()) / (lof_scores.max() - lof_scores.min())
        
        # DBSCAN outlier detection (-1 = outlier)
        dbscan_labels = self.models['dbscan'].labels_
        scores['dbscan'] = (dbscan_labels == -1).astype(float)
        
        # Calculate ensemble score (weighted average)
        weights = {'isolation_forest': 0.3, 'one_class_svm': 0.3, 'lof': 0.2, 'dbscan': 0.2}
        ensemble_scores = np.zeros(len(X))
        
        for model_name, weight in weights.items():
            ensemble_scores += weight * scores[model_name]
        
        # Set thresholds based on score distribution
        self.fraud_thresholds = {
            'fraud': np.percentile(ensemble_scores, 95),
            'suspicious': np.percentile(ensemble_scores, 85),
            'review': np.percentile(ensemble_scores, 70)
        }
    
    def detect_fraud(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Detect fraud in new data"""
        if not self.is_trained:
            raise ValueError("Models must be trained before fraud detection")
        
        # Prepare features
        X = self.feature_engineer.prepare_features(df)
        
        # Get individual model scores
        scores = {}
        
        # Isolation Forest
        iso_scores = self.models['isolation_forest'].decision_function(X)
        scores['isolation_forest'] = 1 - (iso_scores - iso_scores.min()) / (iso_scores.max() - iso_scores.min())
        
        # One-Class SVM
        svm_scores = self.models['one_class_svm'].decision_function(X)
        scores['one_class_svm'] = 1 - (svm_scores - svm_scores.min()) / (svm_scores.max() - svm_scores.min())
        
        # LOF
        lof_scores = -self.models['lof'].negative_outlier_factor_
        scores['lof'] = (lof_scores - lof_scores.min()) / (lof_scores.max() - lof_scores.min())
        
        # DBSCAN
        dbscan_labels = self.models['dbscan'].labels_
        scores['dbscan'] = (dbscan_labels == -1).astype(float)
        
        # Calculate ensemble score
        weights = {'isolation_forest': 0.3, 'one_class_svm': 0.3, 'lof': 0.2, 'dbscan': 0.2}
        ensemble_scores = np.zeros(len(X))
        
        for model_name, weight in weights.items():
            ensemble_scores += weight * scores[model_name]
        
        # Determine fraud categories
        fraud_categories = []
        risk_scores = []
        
        for score in ensemble_scores:
            if score >= self.fraud_thresholds['fraud']:
                fraud_categories.append('FRAUD')
                risk_scores.append(score)
            elif score >= self.fraud_thresholds['suspicious']:
                fraud_categories.append('SUSPICIOUS')
                risk_scores.append(score)
            elif score >= self.fraud_thresholds['review']:
                fraud_categories.append('REVIEW')
                risk_scores.append(score)
            else:
                fraud_categories.append('LEGITIMATE')
                risk_scores.append(score)
        
        # If Random Forest is available, get supervised predictions
        supervised_predictions = None
        if 'random_forest' in self.models:
            supervised_predictions = self.models['random_forest'].predict(X)
            supervised_probabilities = self.models['random_forest'].predict_proba(X)[:, 1]
        
        return {
            'fraud_categories': fraud_categories,
            'risk_scores': risk_scores,
            'ensemble_scores': ensemble_scores.tolist(),
            'individual_scores': {k: v.tolist() for k, v in scores.items()},
            'supervised_predictions': supervised_predictions.tolist() if supervised_predictions is not None else None,
            'supervised_probabilities': supervised_probabilities.tolist() if supervised_predictions is not None else None,
            'thresholds': self.fraud_thresholds
        }
    
    def get_fraud_explanation(self, df: pd.DataFrame, sample_idx: int = 0) -> Dict[str, Any]:
        """Get detailed explanation for fraud detection"""
        detection_result = self.detect_fraud(df)
        
        sample = df.iloc[sample_idx:sample_idx+1]
        X = self.feature_engineer.prepare_features(sample)
        
        explanation = {
            'sample_id': sample_idx,
            'fraud_category': detection_result['fraud_categories'][0],
            'risk_score': detection_result['risk_scores'][0],
            'ensemble_score': detection_result['ensemble_scores'][0],
            'individual_scores': {k: v[0] for k, v in detection_result['individual_scores'].items()},
            'feature_values': X.iloc[0].to_dict(),
            'top_risk_factors': self._identify_risk_factors(X.iloc[0]),
            'recommendations': self._generate_fraud_recommendations(detection_result['fraud_categories'][0])
        }
        
        return explanation
    
    def _identify_risk_factors(self, sample: pd.Series) -> List[Dict[str, Any]]:
        """Identify top risk factors for a sample"""
        risk_factors = []
        
        # Check for high-risk patterns
        for feature, value in sample.items():
            if 'outlier' in feature and value == 1:
                risk_factors.append({
                    'factor': feature,
                    'value': value,
                    'risk_level': 'HIGH',
                    'description': f'Statistical outlier detected in {feature.replace("_is_outlier", "")}'
                })
            elif 'frequency' in feature and value > 10:
                risk_factors.append({
                    'factor': feature,
                    'value': value,
                    'risk_level': 'MEDIUM',
                    'description': f'Unusually high frequency: {value}'
                })
            elif 'velocity' in feature and value > 5:
                risk_factors.append({
                    'factor': feature,
                    'value': value,
                    'risk_level': 'HIGH',
                    'description': f'High velocity detected: {value} transactions per hour'
                })
        
        return sorted(risk_factors, key=lambda x: x['risk_level'], reverse=True)[:5]
    
    def _generate_fraud_recommendations(self, fraud_category: str) -> List[str]:
        """Generate recommendations based on fraud category"""
        recommendations = {
            'FRAUD': [
                'Block transaction immediately',
                'Flag user account for review',
                'Contact payment processor',
                'Document evidence for investigation'
            ],
            'SUSPICIOUS': [
                'Require additional verification',
                'Monitor user activity closely',
                'Consider manual review',
                'Implement enhanced security checks'
            ],
            'REVIEW': [
                'Add to review queue',
                'Monitor for similar patterns',
                'Consider additional authentication',
                'Track user behavior changes'
            ],
            'LEGITIMATE': [
                'Process normally',
                'Continue monitoring',
                'Update user risk profile',
                'Maintain standard security'
            ]
        }
        
        return recommendations.get(fraud_category, ['Review manually'])
    
    def save_models(self, filepath: Optional[str] = None) -> str:
        """Save trained models and configuration"""
        if not self.is_trained:
            raise ValueError("Models must be trained before saving")
        
        filepath = filepath or f"{self.config.model_path}/fraud_detection_models_v{self.config.version}.joblib"
        
        model_data = {
            'models': self.models,
            'feature_engineer': self.feature_engineer,
            'config': self.config,
            'fraud_thresholds': self.fraud_thresholds,
            'trained_at': datetime.now().isoformat()
        }
        
        joblib.dump(model_data, filepath)
        logger.info(f"Fraud detection models saved to {filepath}")
        
        return filepath
    
    def load_models(self, filepath: str):
        """Load pre-trained models"""
        model_data = joblib.load(filepath)
        
        self.models = model_data['models']
        self.feature_engineer = model_data['feature_engineer']
        self.config = model_data['config']
        self.fraud_thresholds = model_data['fraud_thresholds']
        self.is_trained = True
        
        logger.info(f"Fraud detection models loaded from {filepath}")

class FraudDetectionAPI:
    """API wrapper for fraud detection system"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.model = FraudDetectionModel(FraudDetectionConfig())
        if model_path:
            self.model.load_models(model_path)
    
    def check_transaction(self, transaction_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check a single transaction for fraud"""
        try:
            df = pd.DataFrame([transaction_data])
            detection_result = self.model.detect_fraud(df)
            
            return {
                'success': True,
                'transaction_id': transaction_data.get('transaction_id', 'unknown'),
                'fraud_category': detection_result['fraud_categories'][0],
                'risk_score': detection_result['risk_scores'][0],
                'ensemble_score': detection_result['ensemble_scores'][0],
                'individual_scores': {k: v[0] for k, v in detection_result['individual_scores'].items()},
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error checking transaction: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def batch_check_transactions(self, transactions_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Check multiple transactions for fraud"""
        results = []
        for transaction_data in transactions_data:
            result = self.check_transaction(transaction_data)
            results.append(result)
        return results

# Example usage and testing
if __name__ == "__main__":
    # Example configuration
    config = FraudDetectionConfig(
        contamination=0.1,
        fraud_threshold=0.7,
        suspicious_threshold=0.4
    )
    
    # Initialize model
    model = FraudDetectionModel(config)
    
    # Example training data
    np.random.seed(42)
    n_samples = 1000
    
    training_data = pd.DataFrame({
        'transaction_id': range(n_samples),
        'user_id': np.random.randint(1, 100, n_samples),
        'amount': np.random.lognormal(4, 1, n_samples),
        'timestamp': pd.date_range('2024-01-01', periods=n_samples, freq='1H'),
        'device_fingerprint': np.random.randint(1, 50, n_samples),
        'ip_address': [f"192.168.1.{np.random.randint(1, 255)}" for _ in range(n_samples)],
        'payment_method': np.random.choice(['credit_card', 'debit_card', 'paypal', 'bank_transfer'], n_samples),
        'booking_type': np.random.choice(['room', 'restaurant', 'spa', 'event'], n_samples),
        'session_id': np.random.randint(1, 200, n_samples)
    })
    
    # Add some fraudulent patterns
    fraud_indices = np.random.choice(n_samples, size=int(0.1 * n_samples), replace=False)
    training_data.loc[fraud_indices, 'amount'] *= 10  # Unusually high amounts
    training_data.loc[fraud_indices, 'device_fingerprint'] = 999  # Suspicious device
    
    # Create fraud labels
    fraud_labels = pd.Series([1 if i in fraud_indices else 0 for i in range(n_samples)])
    
    # Train models
    metrics = model.train_ensemble_models(training_data, fraud_labels)
    
    print("Training Metrics:")
    for model_name, model_metrics in metrics.items():
        print(f"{model_name}:")
        for metric, value in model_metrics.items():
            if isinstance(value, float):
                print(f"  {metric}: {value:.3f}")
    
    # Test fraud detection
    test_transaction = {
        'transaction_id': 'test_001',
        'user_id': 1,
        'amount': 50000,  # High amount
        'timestamp': datetime.now(),
        'device_fingerprint': 999,  # Suspicious device
        'ip_address': '192.168.1.999',
        'payment_method': 'credit_card',
        'booking_type': 'room',
        'session_id': 1
    }
    
    api = FraudDetectionAPI()
    result = api.check_transaction(test_transaction)
    print(f"\nTest Transaction Result:")
    print(f"Fraud Category: {result['fraud_category']}")
    print(f"Risk Score: {result['risk_score']:.3f}")
    print(f"Ensemble Score: {result['ensemble_score']:.3f}")
    
    # Save models
    model_path = model.save_models()
    print(f"\nModels saved to: {model_path}")