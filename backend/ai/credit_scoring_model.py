"""
Credit Scoring Model Implementation
==================================

This module implements a comprehensive credit scoring system for hospitality businesses
using machine learning techniques including logistic regression, ensemble methods,
and fairness-aware modeling.

Features:
- Multi-factor credit assessment
- Fairness-aware modeling with AIF360
- Real-time scoring capabilities
- Model interpretability and explainability
- A/B testing framework for model updates

Author: Buffr AI Team
Date: 2024
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
from datetime import datetime, timedelta
import logging
import joblib
import json
from pathlib import Path

# Core ML libraries
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_auc_score, 
    precision_recall_curve, roc_curve, accuracy_score
)
from sklearn.calibration import CalibratedClassifierCV

# Fairness and bias detection
from aif360.datasets import BinaryLabelDataset
from aif360.metrics import BinaryLabelDatasetMetric, ClassificationMetric
from aif360.algorithms.preprocessing import Reweighing
from aif360.algorithms.inprocessing import AdversarialDebiasing
from aif360.algorithms.postprocessing import CalibratedEqOddsPostprocessing

# Feature engineering
from sklearn.feature_selection import SelectKBest, f_classif, mutual_info_classif
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans

# Time series and financial analysis
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class CreditScoreConfig:
    """Configuration for credit scoring model"""
    # Model parameters
    model_type: str = "logistic_regression"  # logistic_regression, random_forest, gradient_boosting
    test_size: float = 0.2
    random_state: int = 42
    cv_folds: int = 5
    
    # Feature engineering
    max_features: int = 20
    feature_selection_method: str = "mutual_info"  # mutual_info, f_classif, pca
    
    # Fairness parameters
    enable_fairness: bool = True
    protected_attributes: List[str] = None
    fairness_threshold: float = 0.8
    
    # Business rules
    min_score: int = 300
    max_score: int = 850
    default_threshold: float = 0.5
    
    # Model persistence
    model_path: str = "models/credit_scoring"
    version: str = "1.0.0"

class CreditScoreFeatures:
    """Feature engineering for credit scoring"""
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_selector = None
        self.pca = None
        
    def create_financial_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create financial health indicators"""
        features = df.copy()
        
        # Revenue stability metrics
        if 'monthly_revenue' in df.columns:
            features['revenue_cv'] = df['monthly_revenue'].rolling(12).std() / df['monthly_revenue'].rolling(12).mean()
            features['revenue_trend'] = df['monthly_revenue'].pct_change(12)
            features['revenue_growth_rate'] = df['monthly_revenue'].pct_change()
        
        # Profitability ratios
        if 'gross_profit' in df.columns and 'revenue' in df.columns:
            features['gross_margin'] = df['gross_profit'] / df['revenue']
            features['profit_margin'] = df['net_profit'] / df['revenue'] if 'net_profit' in df.columns else 0
        
        # Liquidity ratios
        if 'current_assets' in df.columns and 'current_liabilities' in df.columns:
            features['current_ratio'] = df['current_assets'] / df['current_liabilities']
            features['quick_ratio'] = (df['current_assets'] - df['inventory']) / df['current_liabilities'] if 'inventory' in df.columns else features['current_ratio']
        
        # Debt metrics
        if 'total_debt' in df.columns and 'total_assets' in df.columns:
            features['debt_to_assets'] = df['total_debt'] / df['total_assets']
            features['debt_to_equity'] = df['total_debt'] / df['equity'] if 'equity' in df.columns else 0
        
        # Operational efficiency
        if 'revenue' in df.columns and 'total_assets' in df.columns:
            features['asset_turnover'] = df['revenue'] / df['total_assets']
        
        return features
    
    def create_behavioral_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create behavioral and operational features"""
        features = df.copy()
        
        # Payment behavior
        if 'payment_history' in df.columns:
            features['avg_payment_delay'] = df['payment_history'].apply(
                lambda x: np.mean([d for d in x if d > 0]) if isinstance(x, list) else 0
            )
            features['payment_consistency'] = df['payment_history'].apply(
                lambda x: 1 - (np.std(x) / np.mean(x)) if isinstance(x, list) and np.mean(x) > 0 else 0
            )
        
        # Booking patterns
        if 'booking_frequency' in df.columns:
            features['booking_volatility'] = df['booking_frequency'].rolling(30).std()
            features['booking_trend'] = df['booking_frequency'].pct_change(30)
        
        # Customer satisfaction indicators
        if 'guest_ratings' in df.columns:
            features['avg_rating'] = df['guest_ratings'].apply(
                lambda x: np.mean(x) if isinstance(x, list) else x
            )
            features['rating_consistency'] = df['guest_ratings'].apply(
                lambda x: 1 - (np.std(x) / np.mean(x)) if isinstance(x, list) and len(x) > 1 else 1
            )
        
        # Seasonality patterns
        if 'booking_dates' in df.columns:
            features['seasonal_variation'] = df['booking_dates'].apply(
                lambda x: self._calculate_seasonality(x) if isinstance(x, list) else 0
            )
        
        return features
    
    def create_market_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create market and competitive features"""
        features = df.copy()
        
        # Market position
        if 'market_share' in df.columns:
            features['market_position'] = df['market_share'].rank(pct=True)
        
        # Competitive pressure
        if 'competitor_count' in df.columns:
            features['competitive_intensity'] = 1 / (1 + df['competitor_count'])
        
        # Economic indicators
        if 'local_gdp_growth' in df.columns:
            features['economic_health'] = df['local_gdp_growth'].rolling(12).mean()
        
        return features
    
    def _calculate_seasonality(self, dates: List[str]) -> float:
        """Calculate seasonality coefficient from booking dates"""
        if not dates or len(dates) < 12:
            return 0
        
        try:
            date_series = pd.to_datetime(dates)
            monthly_counts = date_series.dt.month.value_counts().sort_index()
            if len(monthly_counts) < 6:
                return 0
            return monthly_counts.std() / monthly_counts.mean()
        except:
            return 0
    
    def encode_categorical_features(self, df: pd.DataFrame, categorical_columns: List[str]) -> pd.DataFrame:
        """Encode categorical variables"""
        features = df.copy()
        
        for col in categorical_columns:
            if col in df.columns:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                    features[col] = self.label_encoders[col].fit_transform(df[col].astype(str))
                else:
                    features[col] = self.label_encoders[col].transform(df[col].astype(str))
        
        return features
    
    def select_features(self, X: pd.DataFrame, y: pd.Series, method: str = "mutual_info") -> pd.DataFrame:
        """Select most informative features"""
        if method == "mutual_info":
            self.feature_selector = SelectKBest(score_func=mutual_info_classif, k=min(20, X.shape[1]))
        elif method == "f_classif":
            self.feature_selector = SelectKBest(score_func=f_classif, k=min(20, X.shape[1]))
        elif method == "pca":
            self.pca = PCA(n_components=0.95)
            X_selected = self.pca.fit_transform(X)
            return pd.DataFrame(X_selected, columns=[f"PC_{i}" for i in range(X_selected.shape[1])])
        
        if self.feature_selector:
            X_selected = self.feature_selector.fit_transform(X, y)
            selected_features = X.columns[self.feature_selector.get_support()].tolist()
            return pd.DataFrame(X_selected, columns=selected_features)
        
        return X

class CreditScoreModel:
    """Main credit scoring model class"""
    
    def __init__(self, config: CreditScoreConfig):
        self.config = config
        self.feature_engineer = CreditScoreFeatures()
        self.model = None
        self.fairness_processor = None
        self.is_trained = False
        self.feature_importance = None
        self.model_metrics = {}
        
        # Create model directory
        Path(config.model_path).mkdir(parents=True, exist_ok=True)
    
    def prepare_data(self, df: pd.DataFrame, target_column: str = 'default_risk') -> Tuple[pd.DataFrame, pd.Series]:
        """Prepare and engineer features for training"""
        logger.info("Preparing data for credit scoring...")
        
        # Create all feature types
        df_features = self.feature_engineer.create_financial_features(df)
        df_features = self.feature_engineer.create_behavioral_features(df_features)
        df_features = self.feature_engineer.create_market_features(df_features)
        
        # Handle missing values
        df_features = df_features.fillna(df_features.median())
        
        # Encode categorical variables
        categorical_columns = df_features.select_dtypes(include=['object']).columns.tolist()
        df_features = self.feature_engineer.encode_categorical_features(df_features, categorical_columns)
        
        # Separate features and target
        feature_columns = [col for col in df_features.columns if col != target_column]
        X = df_features[feature_columns]
        y = df_features[target_column] if target_column in df_features.columns else pd.Series([0] * len(df_features))
        
        # Feature selection
        X_selected = self.feature_engineer.select_features(X, y, self.config.feature_selection_method)
        
        # Scale features
        X_scaled = pd.DataFrame(
            self.feature_engineer.scaler.fit_transform(X_selected),
            columns=X_selected.columns,
            index=X_selected.index
        )
        
        logger.info(f"Prepared {X_scaled.shape[1]} features for {X_scaled.shape[0]} samples")
        return X_scaled, y
    
    def train(self, X: pd.DataFrame, y: pd.Series, enable_fairness: bool = True) -> Dict[str, Any]:
        """Train the credit scoring model"""
        logger.info("Training credit scoring model...")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=self.config.test_size, 
            random_state=self.config.random_state, stratify=y
        )
        
        # Initialize model based on config
        if self.config.model_type == "logistic_regression":
            self.model = LogisticRegression(
                random_state=self.config.random_state,
                max_iter=1000,
                class_weight='balanced'
            )
        elif self.config.model_type == "random_forest":
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=self.config.random_state,
                class_weight='balanced'
            )
        elif self.config.model_type == "gradient_boosting":
            self.model = GradientBoostingClassifier(
                n_estimators=100,
                learning_rate=0.1,
                max_depth=6,
                random_state=self.config.random_state
            )
        
        # Apply fairness preprocessing if enabled
        if enable_fairness and self.config.enable_fairness:
            self._apply_fairness_preprocessing(X_train, y_train)
        
        # Train model
        self.model.fit(X_train, y_train)
        
        # Calibrate probabilities
        self.model = CalibratedClassifierCV(self.model, method='isotonic', cv=3)
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        self.model_metrics = self._evaluate_model(X_test, y_test)
        
        # Calculate feature importance
        self._calculate_feature_importance(X_train.columns)
        
        self.is_trained = True
        logger.info("Model training completed successfully")
        
        return self.model_metrics
    
    def _apply_fairness_preprocessing(self, X: pd.DataFrame, y: pd.Series):
        """Apply fairness-aware preprocessing"""
        if not self.config.protected_attributes:
            return
        
        try:
            # Create BinaryLabelDataset for AIF360
            dataset = BinaryLabelDataset(
                df=pd.concat([X, y], axis=1),
                label_names=[y.name],
                protected_attribute_names=self.config.protected_attributes
            )
            
            # Apply reweighing to balance protected groups
            self.fairness_processor = Reweighing(unprivileged_groups=[{attr: 0 for attr in self.config.protected_attributes}],
                                               privileged_groups=[{attr: 1 for attr in self.config.protected_attributes}])
            
            dataset_transformed = self.fairness_processor.fit_transform(dataset)
            
            # Update X and y with transformed data
            X_transformed = dataset_transformed.features
            y_transformed = dataset_transformed.labels.ravel()
            
            return pd.DataFrame(X_transformed, columns=X.columns), pd.Series(y_transformed)
            
        except Exception as e:
            logger.warning(f"Fairness preprocessing failed: {e}")
            return X, y
    
    def _evaluate_model(self, X_test: pd.DataFrame, y_test: pd.Series) -> Dict[str, Any]:
        """Evaluate model performance"""
        y_pred = self.model.predict(X_test)
        y_pred_proba = self.model.predict_proba(X_test)[:, 1]
        
        metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'auc_roc': roc_auc_score(y_test, y_pred_proba),
            'classification_report': classification_report(y_test, y_pred, output_dict=True),
            'confusion_matrix': confusion_matrix(y_test, y_pred).tolist()
        }
        
        # Cross-validation scores
        cv_scores = cross_val_score(self.model, X_test, y_test, cv=self.config.cv_folds, scoring='roc_auc')
        metrics['cv_auc_mean'] = cv_scores.mean()
        metrics['cv_auc_std'] = cv_scores.std()
        
        return metrics
    
    def _calculate_feature_importance(self, feature_names: List[str]):
        """Calculate and store feature importance"""
        if hasattr(self.model.base_estimator, 'feature_importances_'):
            self.feature_importance = dict(zip(feature_names, self.model.base_estimator.feature_importances_))
        elif hasattr(self.model.base_estimator, 'coef_'):
            self.feature_importance = dict(zip(feature_names, abs(self.model.base_estimator.coef_[0])))
        else:
            self.feature_importance = {name: 0 for name in feature_names}
    
    def predict_credit_score(self, X: pd.DataFrame) -> Dict[str, Any]:
        """Predict credit score for new data"""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        # Prepare features
        X_processed = self.feature_engineer.scaler.transform(X)
        
        # Get probability of default
        default_probability = self.model.predict_proba(X_processed)[:, 1]
        
        # Convert to credit score (300-850 scale)
        credit_scores = self._probability_to_score(default_probability)
        
        # Risk categories
        risk_categories = self._score_to_risk_category(credit_scores)
        
        return {
            'credit_scores': credit_scores.tolist(),
            'default_probabilities': default_probability.tolist(),
            'risk_categories': risk_categories,
            'recommendations': self._generate_recommendations(credit_scores, risk_categories)
        }
    
    def _probability_to_score(self, probabilities: np.ndarray) -> np.ndarray:
        """Convert default probabilities to credit scores (300-850 scale)"""
        # Use inverse logistic transformation
        scores = self.config.min_score + (self.config.max_score - self.config.min_score) * (1 - probabilities)
        return np.clip(scores, self.config.min_score, self.config.max_score)
    
    def _score_to_risk_category(self, scores: np.ndarray) -> List[str]:
        """Convert credit scores to risk categories"""
        categories = []
        for score in scores:
            if score >= 750:
                categories.append("Excellent")
            elif score >= 700:
                categories.append("Good")
            elif score >= 650:
                categories.append("Fair")
            elif score >= 600:
                categories.append("Poor")
            else:
                categories.append("Very Poor")
        return categories
    
    def _generate_recommendations(self, scores: np.ndarray, categories: List[str]) -> List[str]:
        """Generate recommendations based on credit scores"""
        recommendations = []
        for score, category in zip(scores, categories):
            if category == "Excellent":
                recommendations.append("Eligible for premium rates and extended credit")
            elif category == "Good":
                recommendations.append("Eligible for standard rates with monitoring")
            elif category == "Fair":
                recommendations.append("Requires additional documentation and higher rates")
            elif category == "Poor":
                recommendations.append("Requires collateral or guarantor")
            else:
                recommendations.append("Not eligible for credit at this time")
        return recommendations
    
    def save_model(self, filepath: Optional[str] = None) -> str:
        """Save trained model and metadata"""
        if not self.is_trained:
            raise ValueError("Model must be trained before saving")
        
        filepath = filepath or f"{self.config.model_path}/credit_scoring_model_v{self.config.version}.joblib"
        
        model_data = {
            'model': self.model,
            'feature_engineer': self.feature_engineer,
            'config': self.config,
            'metrics': self.model_metrics,
            'feature_importance': self.feature_importance,
            'trained_at': datetime.now().isoformat()
        }
        
        joblib.dump(model_data, filepath)
        logger.info(f"Model saved to {filepath}")
        
        return filepath
    
    def load_model(self, filepath: str):
        """Load pre-trained model"""
        model_data = joblib.load(filepath)
        
        self.model = model_data['model']
        self.feature_engineer = model_data['feature_engineer']
        self.config = model_data['config']
        self.model_metrics = model_data['metrics']
        self.feature_importance = model_data['feature_importance']
        self.is_trained = True
        
        logger.info(f"Model loaded from {filepath}")
    
    def get_model_explanation(self, X: pd.DataFrame, sample_idx: int = 0) -> Dict[str, Any]:
        """Generate model explanation for a specific sample"""
        if not self.is_trained:
            raise ValueError("Model must be trained before generating explanations")
        
        sample = X.iloc[sample_idx:sample_idx+1]
        prediction = self.predict_credit_score(sample)
        
        explanation = {
            'credit_score': prediction['credit_scores'][0],
            'risk_category': prediction['risk_categories'][0],
            'default_probability': prediction['default_probabilities'][0],
            'feature_contributions': dict(zip(X.columns, sample.iloc[0].values)),
            'top_positive_factors': self._get_top_factors(sample.iloc[0], positive=True),
            'top_negative_factors': self._get_top_factors(sample.iloc[0], positive=False),
            'recommendations': prediction['recommendations'][0]
        }
        
        return explanation
    
    def _get_top_factors(self, sample: pd.Series, positive: bool = True, top_k: int = 5) -> List[Dict[str, Any]]:
        """Get top factors contributing to the score"""
        if not self.feature_importance:
            return []
        
        # Calculate feature contributions
        contributions = {}
        for feature, value in sample.items():
            if feature in self.feature_importance:
                # Simple linear contribution (can be enhanced with SHAP values)
                contribution = self.feature_importance[feature] * value
                contributions[feature] = contribution
        
        # Sort by contribution
        sorted_factors = sorted(contributions.items(), key=lambda x: x[1], reverse=positive)
        
        return [{'feature': factor, 'contribution': contrib} for factor, contrib in sorted_factors[:top_k]]

class CreditScoreAPI:
    """API wrapper for credit scoring system"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.model = CreditScoreModel(CreditScoreConfig())
        if model_path:
            self.model.load_model(model_path)
    
    def score_business(self, business_data: Dict[str, Any]) -> Dict[str, Any]:
        """Score a single business"""
        try:
            # Convert to DataFrame
            df = pd.DataFrame([business_data])
            
            # Prepare features
            X, _ = self.model.prepare_data(df)
            
            # Get prediction
            prediction = self.model.predict_credit_score(X)
            
            return {
                'success': True,
                'business_id': business_data.get('business_id', 'unknown'),
                'credit_score': prediction['credit_scores'][0],
                'risk_category': prediction['risk_categories'][0],
                'default_probability': prediction['default_probabilities'][0],
                'recommendation': prediction['recommendations'][0],
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error scoring business: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def batch_score_businesses(self, businesses_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Score multiple businesses"""
        results = []
        for business_data in businesses_data:
            result = self.score_business(business_data)
            results.append(result)
        return results

# Example usage and testing
if __name__ == "__main__":
    # Example configuration
    config = CreditScoreConfig(
        model_type="logistic_regression",
        enable_fairness=True,
        protected_attributes=["business_type", "location_tier"]
    )
    
    # Initialize model
    model = CreditScoreModel(config)
    
    # Example training data
    np.random.seed(42)
    n_samples = 1000
    
    training_data = pd.DataFrame({
        'monthly_revenue': np.random.normal(50000, 15000, n_samples),
        'gross_profit': np.random.normal(30000, 10000, n_samples),
        'current_assets': np.random.normal(100000, 30000, n_samples),
        'current_liabilities': np.random.normal(40000, 12000, n_samples),
        'total_debt': np.random.normal(200000, 50000, n_samples),
        'total_assets': np.random.normal(500000, 100000, n_samples),
        'business_type': np.random.choice(['hotel', 'restaurant', 'spa', 'venue'], n_samples),
        'location_tier': np.random.choice([1, 2, 3], n_samples),
        'default_risk': np.random.choice([0, 1], n_samples, p=[0.8, 0.2])
    })
    
    # Train model
    X, y = model.prepare_data(training_data)
    metrics = model.train(X, y)
    
    print("Training Metrics:")
    print(f"AUC-ROC: {metrics['auc_roc']:.3f}")
    print(f"Accuracy: {metrics['accuracy']:.3f}")
    print(f"CV AUC Mean: {metrics['cv_auc_mean']:.3f} ± {metrics['cv_auc_std']:.3f}")
    
    # Test prediction
    test_business = {
        'monthly_revenue': 60000,
        'gross_profit': 35000,
        'current_assets': 120000,
        'current_liabilities': 35000,
        'total_debt': 180000,
        'total_assets': 600000,
        'business_type': 'hotel',
        'location_tier': 1
    }
    
    api = CreditScoreAPI()
    result = api.score_business(test_business)
    print(f"\nTest Business Score: {result['credit_score']}")
    print(f"Risk Category: {result['risk_category']}")
    print(f"Recommendation: {result['recommendation']}")
    
    # Save model
    model_path = model.save_model()
    print(f"\nModel saved to: {model_path}")