"""
Customer Churn Prediction System for Hospitality Platform
========================================================

Advanced customer churn prediction system using machine learning, survival analysis,
and retention strategies for hospitality businesses.

Features:
- Multiple ML algorithms for churn prediction
- Survival analysis for customer lifetime modeling
- Retention strategy recommendations
- Real-time churn risk scoring
- Customer segmentation for targeted retention

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

class ChurnPredictionSystem:
    """
    Churn Prediction System for Hospitality Platform
    
    This class implements advanced churn prediction using machine learning
    techniques including survival analysis, behavioral pattern recognition,
    and early warning systems to identify customers at risk of churning.
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        Initialize the churn prediction system
        
        Args:
            config: Configuration dictionary for the system
        """
        self.config = config or {}
        self.models = {}
        self.scalers = {}
        self.churn_threshold = self.config.get('churn_threshold', 0.5)
        
        # Initialize logging
        self.logger = logging.getLogger(__name__)
        
        # Setup database connection
        self.db_path = "churn_prediction.db"
        self._setup_database()
        
        # Initialize models
        self._initialize_models()
    
    def _setup_database(self):
        """Setup SQLite database for storing churn prediction data"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create tables for churn prediction
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS churn_predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id TEXT,
                churn_probability REAL,
                risk_level TEXT,
                features TEXT,
                prediction_date TIMESTAMP,
                model_version TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS churn_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id TEXT,
                churn_date DATE,
                churn_reason TEXT,
                features TEXT,
                created_at TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def _initialize_models(self):
        """Initialize churn prediction models"""
        try:
            from sklearn.ensemble import RandomForestClassifier
            from sklearn.linear_model import LogisticRegression
            from sklearn.preprocessing import StandardScaler
            from sklearn.metrics import classification_report, roc_auc_score
            
            # Random forest for churn prediction
            self.models['random_forest'] = RandomForestClassifier(
                n_estimators=100,
                random_state=42
            )
            
            # Logistic regression for baseline
            self.models['logistic'] = LogisticRegression(
                random_state=42,
                max_iter=1000
            )
            
            # Standard scaler for feature normalization
            self.scalers['standard'] = StandardScaler()
            
            self.logger.info("Churn prediction models initialized successfully")
            
        except ImportError as e:
            self.logger.error(f"Failed to initialize models: {e}")
            raise
    
    def predict_churn(self, customer_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict churn probability for a customer
        
        Args:
            customer_data: Dictionary containing customer data
            
        Returns:
            Dictionary containing churn prediction results
        """
        try:
            # Extract features
            features = self._extract_features(customer_data)
            
            # Normalize features
            features_scaled = self.scalers['standard'].fit_transform([features])
            
            # Get predictions from both models
            rf_pred = self.models['random_forest'].predict_proba(features_scaled)[0]
            logistic_pred = self.models['logistic'].predict_proba(features_scaled)[0]
            
            # Combine predictions (simple average)
            churn_probability = (rf_pred[1] + logistic_pred[1]) / 2
            
            # Determine risk level
            if churn_probability >= 0.8:
                risk_level = "HIGH"
            elif churn_probability >= 0.6:
                risk_level = "MEDIUM"
            elif churn_probability >= 0.4:
                risk_level = "LOW"
            else:
                risk_level = "VERY_LOW"
            
            # Create result
            result = {
                'customer_id': customer_data.get('customer_id', ''),
                'churn_probability': churn_probability,
                'risk_level': risk_level,
                'is_at_risk': churn_probability >= self.churn_threshold,
                'individual_predictions': {
                    'random_forest': rf_pred[1],
                    'logistic': logistic_pred[1]
                },
                'prediction_date': datetime.now().isoformat()
            }
            
            # Store prediction
            self._store_churn_prediction(customer_data, result)
            
            return result
            
        except Exception as e:
            self.logger.error(f"Error in churn prediction: {e}")
            return {
                'customer_id': customer_data.get('customer_id', ''),
                'churn_probability': 0.0,
                'risk_level': 'UNKNOWN',
                'is_at_risk': False,
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
        
        # Engagement features
        last_login_days = data.get('last_login_days', 30)
        features.append(last_login_days / 365.0)  # Normalize to years
        
        email_opens = data.get('email_opens', 0)
        features.append(min(email_opens / 100.0, 1.0))  # Cap at 100
        
        # Service usage features
        support_tickets = data.get('support_tickets', 0)
        features.append(min(support_tickets / 10.0, 1.0))  # Cap at 10
        
        # Demographics
        age = data.get('age', 35)
        features.append(age / 100.0)  # Normalize to 0-1
        
        # Preferences
        luxury_preference = data.get('luxury_preference', 0.5)
        features.append(luxury_preference)
        
        return features
    
    def _store_churn_prediction(self, customer_data: Dict[str, Any], result: Dict[str, Any]):
        """Store churn prediction in database"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO churn_predictions 
            (customer_id, churn_probability, risk_level, features, prediction_date, model_version)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            result['customer_id'],
            result['churn_probability'],
            result['risk_level'],
            json.dumps(customer_data),
            datetime.now(),
            'combined'
        ))
        
        conn.commit()
        conn.close()
    
    def train_models(self, training_data: List[Dict[str, Any]]):
        """
        Train churn prediction models on historical data
        
        Args:
            training_data: List of historical customer data with churn labels
        """
        try:
            # Extract features and labels
            features = []
            labels = []
            
            for data in training_data:
                features.append(self._extract_features(data))
                labels.append(data.get('churned', 0))  # 0: not churned, 1: churned
            
            X = np.array(features)
            y = np.array(labels)
            
            # Scale features
            X_scaled = self.scalers['standard'].fit_transform(X)
            
            # Train models
            self.models['random_forest'].fit(X_scaled, y)
            self.models['logistic'].fit(X_scaled, y)
            
            # Evaluate models
            rf_pred = self.models['random_forest'].predict(X_scaled)
            logistic_pred = self.models['logistic'].predict(X_scaled)
            
            self.logger.info("Churn prediction models trained successfully")
            
        except Exception as e:
            self.logger.error(f"Error training models: {e}")
            raise
    
    def get_churn_statistics(self) -> Dict[str, Any]:
        """Get churn prediction statistics"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get total predictions
        cursor.execute("SELECT COUNT(*) FROM churn_predictions")
        total_predictions = cursor.fetchone()[0]
        
        # Get predictions by risk level
        cursor.execute("SELECT risk_level, COUNT(*) FROM churn_predictions GROUP BY risk_level")
        predictions_by_level = dict(cursor.fetchall())
        
        # Get recent predictions (last 24 hours)
        cursor.execute("""
            SELECT COUNT(*) FROM churn_predictions 
            WHERE prediction_date >= datetime('now', '-1 day')
        """)
        recent_predictions = cursor.fetchone()[0]
        
        # Get actual churn events
        cursor.execute("SELECT COUNT(*) FROM churn_events")
        total_churn_events = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            'total_predictions': total_predictions,
            'predictions_by_level': predictions_by_level,
            'recent_predictions_24h': recent_predictions,
            'total_churn_events': total_churn_events,
            'churn_threshold': self.churn_threshold
        }
    
    def add_churn_event(self, customer_id: str, churn_date: str, churn_reason: str, features: Dict[str, Any]):
        """Add actual churn event to the database"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO churn_events 
            (customer_id, churn_date, churn_reason, features, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            customer_id,
            churn_date,
            churn_reason,
            json.dumps(features),
            datetime.now()
        ))
        
        conn.commit()
        conn.close()
    
    def get_churn_insights(self, customer_id: str) -> Dict[str, Any]:
        """Get churn insights for a specific customer"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get customer's prediction history
        cursor.execute('''
            SELECT * FROM churn_predictions 
            WHERE customer_id = ? 
            ORDER BY prediction_date DESC
        ''', (customer_id,))
        
        predictions = cursor.fetchall()
        
        # Get churn events
        cursor.execute('''
            SELECT * FROM churn_events 
            WHERE customer_id = ?
        ''', (customer_id,))
        
        churn_events = cursor.fetchall()
        conn.close()
        
        if not predictions:
            return {'error': 'No prediction data available for customer'}
        
        # Analyze prediction trends
        recent_predictions = predictions[:5]  # Last 5 predictions
        avg_probability = np.mean([p[2] for p in recent_predictions])  # churn_probability column
        
        # Generate insights
        insights = []
        if avg_probability > 0.7:
            insights.append("High churn risk - immediate attention required")
        elif avg_probability > 0.5:
            insights.append("Medium churn risk - monitor closely")
        elif avg_probability > 0.3:
            insights.append("Low churn risk - standard monitoring")
        else:
            insights.append("Very low churn risk - customer appears stable")
        
        if churn_events:
            insights.append(f"Customer has churned {len(churn_events)} time(s)")
        
        return {
            'customer_id': customer_id,
            'avg_churn_probability': avg_probability,
            'total_predictions': len(predictions),
            'churn_events': len(churn_events),
            'insights': insights,
            'recent_predictions': recent_predictions
        }
import warnings
warnings.filterwarnings('ignore')

# Core ML and statistical libraries
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler, MinMaxScaler, LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.metrics import (classification_report, confusion_matrix, roc_auc_score, 
                           precision_recall_curve, roc_curve, average_precision_score)
from sklearn.feature_selection import SelectKBest, f_classif, RFE
from sklearn.cluster import KMeans

# Survival analysis
try:
    from lifelines import KaplanMeierFitter, CoxPHFitter, WeibullFitter
    from lifelines.statistics import logrank_test
    SURVIVAL_AVAILABLE = True
except ImportError:
    SURVIVAL_AVAILABLE = False
    logging.warning("Lifelines library not available. Survival analysis will be disabled.")

# Statistical analysis
from scipy import stats
from scipy.stats import chi2_contingency

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ChurnRiskLevel(Enum):
    """Customer churn risk levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class RetentionStrategy(Enum):
    """Customer retention strategies"""
    DISCOUNT_OFFER = "discount_offer"
    LOYALTY_PROGRAM = "loyalty_program"
    PERSONALIZED_SERVICE = "personalized_service"
    WIN_BACK_CAMPAIGN = "win_back_campaign"
    PREMIUM_UPGRADE = "premium_upgrade"

@dataclass
class ChurnPredictionConfig:
    """Configuration for churn prediction system"""
    # Model parameters
    test_size: float = 0.2
    random_state: int = 42
    cv_folds: int = 5
    
    # Feature engineering
    lookback_days: int = 90  # Days to look back for feature calculation
    prediction_horizon: int = 30  # Days ahead to predict churn
    
    # Churn definition
    churn_threshold_days: int = 30  # Days without activity to consider churn
    
    # Model persistence
    model_path: str = "models/churn_prediction"
    version: str = "1.0.0"

class FeatureEngineer:
    """Feature engineering for churn prediction"""
    
    def __init__(self, config: ChurnPredictionConfig):
        self.config = config
        self.feature_columns = []
        self.scaler = StandardScaler()
        self.is_fitted = False
    
    def create_churn_features(self, df: pd.DataFrame, 
                            customer_id_col: str = 'customer_id',
                            date_col: str = 'date',
                            value_col: str = 'value') -> pd.DataFrame:
        """Create comprehensive features for churn prediction"""
        logger.info("Creating churn prediction features...")
        
        # Ensure date column is datetime
        df[date_col] = pd.to_datetime(df[date_col])
        
        # Calculate features for each customer
        customer_features = []
        
        for customer_id in df[customer_id_col].unique():
            customer_data = df[df[customer_id_col] == customer_id].sort_values(date_col)
            
            if len(customer_data) == 0:
                continue
            
            # Basic customer info
            features = {
                'customer_id': customer_id,
                'total_orders': len(customer_data),
                'total_spent': customer_data[value_col].sum(),
                'avg_order_value': customer_data[value_col].mean(),
                'first_order_date': customer_data[date_col].min(),
                'last_order_date': customer_data[date_col].max(),
                'customer_lifetime_days': (customer_data[date_col].max() - customer_data[date_col].min()).days
            }
            
            # Recency features
            current_date = df[date_col].max()
            features['days_since_last_order'] = (current_date - customer_data[date_col].max()).days
            features['days_since_first_order'] = (current_date - customer_data[date_col].min()).days
            
            # Frequency features
            features['orders_per_month'] = features['total_orders'] / max(features['customer_lifetime_days'] / 30, 1)
            features['orders_per_week'] = features['total_orders'] / max(features['customer_lifetime_days'] / 7, 1)
            
            # Monetary features
            features['avg_monthly_spend'] = features['total_spent'] / max(features['customer_lifetime_days'] / 30, 1)
            features['max_order_value'] = customer_data[value_col].max()
            features['min_order_value'] = customer_data[value_col].min()
            features['order_value_std'] = customer_data[value_col].std()
            
            # Behavioral features
            features['order_consistency'] = self._calculate_order_consistency(customer_data, date_col)
            features['weekend_orders_ratio'] = self._calculate_weekend_ratio(customer_data, date_col)
            features['seasonal_activity'] = self._calculate_seasonal_activity(customer_data, date_col)
            
            # Trend features
            features['spending_trend'] = self._calculate_spending_trend(customer_data, value_col)
            features['frequency_trend'] = self._calculate_frequency_trend(customer_data, date_col)
            
            # Risk indicators
            features['long_gap_orders'] = self._count_long_gaps(customer_data, date_col)
            features['declining_spend'] = 1 if features['spending_trend'] < -0.1 else 0
            features['declining_frequency'] = 1 if features['frequency_trend'] < -0.1 else 0
            
            # Recent activity (last 30 days)
            recent_data = customer_data[customer_data[date_col] >= current_date - timedelta(days=30)]
            features['recent_orders'] = len(recent_data)
            features['recent_spend'] = recent_data[value_col].sum() if len(recent_data) > 0 else 0
            
            # Churn label (target variable)
            features['is_churned'] = 1 if features['days_since_last_order'] > self.config.churn_threshold_days else 0
            
            customer_features.append(features)
        
        features_df = pd.DataFrame(customer_features)
        
        # Add derived features
        features_df = self._add_derived_features(features_df)
        
        # Store feature columns for later use
        self.feature_columns = [col for col in features_df.columns if col not in ['customer_id', 'is_churned']]
        
        return features_df
    
    def _calculate_order_consistency(self, customer_data: pd.DataFrame, date_col: str) -> float:
        """Calculate order consistency (coefficient of variation of inter-order intervals)"""
        if len(customer_data) < 2:
            return 0.0
        
        intervals = customer_data[date_col].diff().dt.days.dropna()
        if len(intervals) == 0:
            return 0.0
        
        return intervals.std() / intervals.mean() if intervals.mean() > 0 else 0.0
    
    def _calculate_weekend_ratio(self, customer_data: pd.DataFrame, date_col: str) -> float:
        """Calculate ratio of weekend orders"""
        if len(customer_data) == 0:
            return 0.0
        
        weekend_orders = customer_data[customer_data[date_col].dt.dayofweek.isin([5, 6])]
        return len(weekend_orders) / len(customer_data)
    
    def _calculate_seasonal_activity(self, customer_data: pd.DataFrame, date_col: str) -> float:
        """Calculate seasonal activity variation"""
        if len(customer_data) < 4:
            return 0.0
        
        monthly_orders = customer_data.groupby(customer_data[date_col].dt.month).size()
        return monthly_orders.std() / monthly_orders.mean() if monthly_orders.mean() > 0 else 0.0
    
    def _calculate_spending_trend(self, customer_data: pd.DataFrame, value_col: str) -> float:
        """Calculate spending trend over time"""
        if len(customer_data) < 2:
            return 0.0
        
        # Linear regression on order values over time
        x = np.arange(len(customer_data))
        y = customer_data[value_col].values
        
        slope, _, _, _, _ = stats.linregress(x, y)
        return slope / y.mean() if y.mean() > 0 else 0.0
    
    def _calculate_frequency_trend(self, customer_data: pd.DataFrame, date_col: str) -> float:
        """Calculate frequency trend over time"""
        if len(customer_data) < 4:
            return 0.0
        
        # Calculate monthly order counts
        monthly_orders = customer_data.groupby(customer_data[date_col].dt.to_period('M')).size()
        
        if len(monthly_orders) < 2:
            return 0.0
        
        x = np.arange(len(monthly_orders))
        y = monthly_orders.values
        
        slope, _, _, _, _ = stats.linregress(x, y)
        return slope / y.mean() if y.mean() > 0 else 0.0
    
    def _count_long_gaps(self, customer_data: pd.DataFrame, date_col: str) -> int:
        """Count number of long gaps between orders"""
        if len(customer_data) < 2:
            return 0
        
        intervals = customer_data[date_col].diff().dt.days.dropna()
        long_gap_threshold = intervals.quantile(0.75)  # 75th percentile as threshold
        
        return (intervals > long_gap_threshold).sum()
    
    def _add_derived_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add derived features"""
        # RFM scores
        df['recency_score'] = pd.qcut(df['days_since_last_order'], 5, labels=[5, 4, 3, 2, 1]).astype(int)
        df['frequency_score'] = pd.qcut(df['total_orders'].rank(method='first'), 5, labels=[1, 2, 3, 4, 5]).astype(int)
        df['monetary_score'] = pd.qcut(df['total_spent'], 5, labels=[1, 2, 3, 4, 5]).astype(int)
        
        # RFM combined score
        df['rfm_score'] = df['recency_score'] * 100 + df['frequency_score'] * 10 + df['monetary_score']
        
        # Customer value segments
        df['value_segment'] = pd.cut(df['total_spent'], 
                                   bins=[0, df['total_spent'].quantile(0.25), 
                                        df['total_spent'].quantile(0.75), df['total_spent'].max()],
                                   labels=['Low', 'Medium', 'High'])
        
        # Activity level
        df['activity_level'] = pd.cut(df['orders_per_month'],
                                    bins=[0, 1, 3, 10, float('inf')],
                                    labels=['Low', 'Medium', 'High', 'Very High'])
        
        return df

class ChurnPredictionModel:
    """Main churn prediction model"""
    
    def __init__(self, config: ChurnPredictionConfig):
        self.config = config
        self.feature_engineer = FeatureEngineer(config)
        self.models = {}
        self.ensemble_model = None
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def train_individual_models(self, X: np.ndarray, y: np.ndarray) -> Dict[str, Any]:
        """Train individual ML models"""
        logger.info("Training individual churn prediction models...")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=self.config.test_size, random_state=self.config.random_state, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Define models
        models = {
            'logistic_regression': LogisticRegression(random_state=self.config.random_state, max_iter=1000),
            'random_forest': RandomForestClassifier(n_estimators=100, random_state=self.config.random_state),
            'gradient_boosting': GradientBoostingClassifier(n_estimators=100, random_state=self.config.random_state),
            'svm': SVC(probability=True, random_state=self.config.random_state)
        }
        
        results = {}
        
        for name, model in models.items():
            try:
                # Train model
                model.fit(X_train_scaled, y_train)
                
                # Make predictions
                y_pred = model.predict(X_test_scaled)
                y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
                
                # Calculate metrics
                auc_score = roc_auc_score(y_test, y_pred_proba)
                avg_precision = average_precision_score(y_test, y_pred_proba)
                
                # Cross-validation
                cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=self.config.cv_folds, scoring='roc_auc')
                
                results[name] = {
                    'model': model,
                    'auc_score': auc_score,
                    'avg_precision': avg_precision,
                    'cv_mean': cv_scores.mean(),
                    'cv_std': cv_scores.std(),
                    'classification_report': classification_report(y_test, y_pred, output_dict=True)
                }
                
                self.models[name] = model
                
            except Exception as e:
                logger.error(f"Error training {name}: {e}")
                results[name] = {'error': str(e)}
        
        return results
    
    def train_ensemble_model(self, X: np.ndarray, y: np.ndarray) -> Dict[str, Any]:
        """Train ensemble model"""
        logger.info("Training ensemble churn prediction model...")
        
        try:
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Create ensemble model
            estimators = [
                ('lr', LogisticRegression(random_state=self.config.random_state, max_iter=1000)),
                ('rf', RandomForestClassifier(n_estimators=100, random_state=self.config.random_state)),
                ('gb', GradientBoostingClassifier(n_estimators=100, random_state=self.config.random_state))
            ]
            
            ensemble_model = VotingClassifier(estimators=estimators, voting='soft')
            
            # Cross-validation
            cv_scores = cross_val_score(ensemble_model, X_scaled, y, cv=self.config.cv_folds, scoring='roc_auc')
            
            # Train final model
            ensemble_model.fit(X_scaled, y)
            
            self.ensemble_model = ensemble_model
            self.is_trained = True
            
            return {
                'model_type': 'Ensemble',
                'cv_mean': cv_scores.mean(),
                'cv_std': cv_scores.std(),
                'estimators': [name for name, _ in estimators]
            }
            
        except Exception as e:
            logger.error(f"Error training ensemble model: {e}")
            raise
    
    def predict_churn_probability(self, customer_features: Dict[str, Any]) -> Dict[str, Any]:
        """Predict churn probability for a customer"""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        # Prepare feature vector
        feature_vector = np.array([customer_features.get(feature, 0) for feature in self.feature_engineer.feature_columns])
        feature_scaled = self.scaler.transform(feature_vector.reshape(1, -1))
        
        # Get ensemble prediction
        churn_probability = self.ensemble_model.predict_proba(feature_scaled)[0][1]
        
        # Determine risk level
        if churn_probability < 0.3:
            risk_level = ChurnRiskLevel.LOW
        elif churn_probability < 0.6:
            risk_level = ChurnRiskLevel.MEDIUM
        elif churn_probability < 0.8:
            risk_level = ChurnRiskLevel.HIGH
        else:
            risk_level = ChurnRiskLevel.CRITICAL
        
        return {
            'churn_probability': churn_probability,
            'risk_level': risk_level.value,
            'confidence': abs(churn_probability - 0.5) * 2,  # Distance from 0.5
            'recommendations': self._get_retention_recommendations(risk_level, customer_features)
        }
    
    def _get_retention_recommendations(self, risk_level: ChurnRiskLevel, 
                                     customer_features: Dict[str, Any]) -> List[str]:
        """Get retention strategy recommendations"""
        recommendations = []
        
        if risk_level == ChurnRiskLevel.CRITICAL:
            recommendations.extend([
                "Immediate win-back campaign",
                "Personal outreach from management",
                "Exclusive discount offer",
                "Priority customer service"
            ])
        elif risk_level == ChurnRiskLevel.HIGH:
            recommendations.extend([
                "Loyalty program enrollment",
                "Personalized service offer",
                "Special promotion",
                "Customer feedback survey"
            ])
        elif risk_level == ChurnRiskLevel.MEDIUM:
            recommendations.extend([
                "Engagement campaign",
                "Product recommendations",
                "Loyalty program benefits",
                "Regular check-ins"
            ])
        else:  # LOW risk
            recommendations.extend([
                "Maintain current service level",
                "Upsell opportunities",
                "Referral program",
                "Regular satisfaction check"
            ])
        
        return recommendations

class SurvivalAnalysis:
    """Survival analysis for customer lifetime modeling"""
    
    def __init__(self):
        self.kmf = None
        self.cox_model = None
        self.is_trained = False
    
    def fit_kaplan_meier(self, durations: np.ndarray, events: np.ndarray) -> Dict[str, Any]:
        """Fit Kaplan-Meier survival model"""
        if not SURVIVAL_AVAILABLE:
            return {'error': 'Survival analysis not available - Lifelines library not installed'}
        
        logger.info("Fitting Kaplan-Meier survival model...")
        
        try:
            self.kmf = KaplanMeierFitter()
            self.kmf.fit(durations, events)
            
            # Calculate survival statistics
            median_survival = self.kmf.median_survival_time_
            survival_at_30_days = self.kmf.survival_function_.iloc[30] if 30 in self.kmf.survival_function_.index else 0
            survival_at_90_days = self.kmf.survival_function_.iloc[90] if 90 in self.kmf.survival_function_.index else 0
            
            return {
                'model_type': 'Kaplan-Meier',
                'median_survival_time': median_survival,
                'survival_at_30_days': survival_at_30_days,
                'survival_at_90_days': survival_at_90_days,
                'survival_function': self.kmf.survival_function_.to_dict()
            }
            
        except Exception as e:
            logger.error(f"Error fitting Kaplan-Meier model: {e}")
            return {'error': str(e)}
    
    def fit_cox_model(self, df: pd.DataFrame, duration_col: str, 
                     event_col: str, covariates: List[str]) -> Dict[str, Any]:
        """Fit Cox proportional hazards model"""
        if not SURVIVAL_AVAILABLE:
            return {'error': 'Survival analysis not available - Lifelines library not installed'}
        
        logger.info("Fitting Cox proportional hazards model...")
        
        try:
            self.cox_model = CoxPHFitter()
            self.cox_model.fit(df, duration_col=duration_col, event_col=event_col)
            
            # Calculate hazard ratios
            hazard_ratios = self.cox_model.hazard_ratios_
            
            return {
                'model_type': 'Cox Proportional Hazards',
                'hazard_ratios': hazard_ratios.to_dict(),
                'concordance_index': self.cox_model.concordance_index_,
                'summary': self.cox_model.summary.to_dict()
            }
            
        except Exception as e:
            logger.error(f"Error fitting Cox model: {e}")
            return {'error': str(e)}

class ChurnPredictionAPI:
    """API wrapper for churn prediction system"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.config = ChurnPredictionConfig()
        self.churn_model = ChurnPredictionModel(self.config)
        self.survival_analysis = SurvivalAnalysis()
        
        if model_path:
            self.load_models(model_path)
    
    def train_churn_models(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Train churn prediction models"""
        try:
            # Create features
            features_df = self.churn_model.feature_engineer.create_churn_features(df)
            
            # Prepare data
            X = features_df[self.churn_model.feature_engineer.feature_columns].fillna(0)
            y = features_df['is_churned']
            
            # Train individual models
            individual_results = self.churn_model.train_individual_models(X.values, y.values)
            
            # Train ensemble model
            ensemble_result = self.churn_model.train_ensemble_model(X.values, y.values)
            
            # Calculate churn statistics
            churn_rate = y.mean()
            churn_stats = {
                'total_customers': len(features_df),
                'churned_customers': y.sum(),
                'churn_rate': churn_rate,
                'retention_rate': 1 - churn_rate
            }
            
            return {
                'success': True,
                'individual_models': individual_results,
                'ensemble_model': ensemble_result,
                'churn_statistics': churn_stats,
                'feature_importance': self._get_feature_importance(),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error training churn models: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def predict_customer_churn(self, customer_id: str, customer_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict churn for a specific customer"""
        try:
            # Create features for the customer
            features_df = self.churn_model.feature_engineer.create_churn_features(
                pd.DataFrame([customer_data])
            )
            
            if len(features_df) == 0:
                return {'error': 'No data found for customer'}
            
            customer_features = features_df.iloc[0].to_dict()
            
            # Predict churn
            prediction = self.churn_model.predict_churn_probability(customer_features)
            
            return {
                'success': True,
                'customer_id': customer_id,
                'prediction': prediction,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error predicting customer churn: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def analyze_churn_patterns(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze churn patterns and provide insights"""
        try:
            # Create features
            features_df = self.churn_model.feature_engineer.create_churn_features(df)
            
            # Analyze churn by segments
            churn_by_segment = features_df.groupby('value_segment')['is_churned'].agg(['count', 'sum', 'mean'])
            churn_by_activity = features_df.groupby('activity_level')['is_churned'].agg(['count', 'sum', 'mean'])
            
            # Analyze churn by RFM scores
            churn_by_rfm = features_df.groupby('rfm_score')['is_churned'].mean()
            
            # Identify key churn indicators
            churned_customers = features_df[features_df['is_churned'] == 1]
            retained_customers = features_df[features_df['is_churned'] == 0]
            
            # Compare key metrics
            key_metrics = ['days_since_last_order', 'orders_per_month', 'total_spent', 'order_consistency']
            metric_comparison = {}
            
            for metric in key_metrics:
                if metric in features_df.columns:
                    churned_mean = churned_customers[metric].mean()
                    retained_mean = retained_customers[metric].mean()
                    metric_comparison[metric] = {
                        'churned_mean': churned_mean,
                        'retained_mean': retained_mean,
                        'difference': churned_mean - retained_mean,
                        'difference_pct': ((churned_mean - retained_mean) / retained_mean * 100) if retained_mean != 0 else 0
                    }
            
            return {
                'success': True,
                'churn_by_segment': churn_by_segment.to_dict(),
                'churn_by_activity': churn_by_activity.to_dict(),
                'churn_by_rfm': churn_by_rfm.to_dict(),
                'metric_comparison': metric_comparison,
                'insights': self._generate_churn_insights(metric_comparison),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error analyzing churn patterns: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def _get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance from trained models"""
        if not self.churn_model.is_trained:
            return {}
        
        # Get feature importance from ensemble model
        feature_importance = {}
        for name, estimator in self.churn_model.ensemble_model.named_estimators_.items():
            if hasattr(estimator, 'feature_importances_'):
                for i, feature in enumerate(self.churn_model.feature_engineer.feature_columns):
                    if feature not in feature_importance:
                        feature_importance[feature] = 0
                    feature_importance[feature] += estimator.feature_importances_[i]
        
        # Normalize importance scores
        total_importance = sum(feature_importance.values())
        if total_importance > 0:
            feature_importance = {k: v/total_importance for k, v in feature_importance.items()}
        
        return feature_importance
    
    def _generate_churn_insights(self, metric_comparison: Dict[str, Any]) -> List[str]:
        """Generate insights from churn analysis"""
        insights = []
        
        for metric, data in metric_comparison.items():
            if abs(data['difference_pct']) > 20:  # Significant difference
                if data['difference'] > 0:
                    insights.append(f"Churned customers have {abs(data['difference_pct']):.1f}% higher {metric}")
                else:
                    insights.append(f"Churned customers have {abs(data['difference_pct']):.1f}% lower {metric}")
        
        if not insights:
            insights.append("No significant differences found between churned and retained customers")
        
        return insights
    
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
    n_days = 365
    
    # Generate sample customer data
    customer_data = []
    for i in range(n_customers):
        customer_id = f"customer_{i+1}"
        
        # Generate purchase history
        n_purchases = np.random.poisson(5) + 1
        start_date = pd.Timestamp('2023-01-01') + timedelta(days=np.random.randint(0, 200))
        
        # Simulate churn (some customers stop purchasing)
        churn_probability = 0.3
        if np.random.random() < churn_probability:
            # Churned customer - stops purchasing after some time
            end_date = start_date + timedelta(days=np.random.randint(30, 150))
        else:
            # Active customer - continues purchasing
            end_date = pd.Timestamp('2024-01-01')
        
        purchase_dates = pd.date_range(start_date, end_date, periods=min(n_purchases, 20))
        
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
    api = ChurnPredictionAPI()
    
    # Test model training
    training_result = api.train_churn_models(df)
    print("Churn Models Training:", training_result)
    
    # Test churn prediction for a specific customer
    sample_customer_data = {
        'customer_id': 'test_customer',
        'date': pd.Timestamp('2023-12-01'),
        'value': 75,
        'age': 35,
        'gender': 'M'
    }
    
    prediction_result = api.predict_customer_churn('test_customer', sample_customer_data)
    print("Customer Churn Prediction:", prediction_result)
    
    # Test churn pattern analysis
    pattern_result = api.analyze_churn_patterns(df)
    print("Churn Pattern Analysis:", pattern_result)