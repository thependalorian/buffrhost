"""
MLOps Infrastructure for Hospitality Platform
============================================

Comprehensive MLOps infrastructure for machine learning model lifecycle management,
including model versioning, monitoring, deployment, and A/B testing capabilities.

Features:
- Model versioning and registry
- Automated model training pipelines
- Model performance monitoring
- Drift detection and alerting
- A/B testing framework
- Model deployment automation
- Experiment tracking

Author: Buffr AI Team
Date: 2024
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional, Any, Union
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
import logging
import joblib
import json
import hashlib
import pickle
from pathlib import Path
from enum import Enum
import uuid
import threading
import time
from concurrent.futures import ThreadPoolExecutor
import warnings
warnings.filterwarnings('ignore')

# Core ML libraries
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

# Model monitoring
from scipy import stats
from scipy.spatial.distance import jensenshannon
import psutil
import requests

# Database and storage
import sqlite3
from sqlalchemy import create_engine, Column, String, Float, DateTime, Integer, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base = declarative_base()

class ModelVersion(Base):
    """Database model for model versioning"""
    __tablename__ = 'model_versions'
    
    id = Column(String, primary_key=True)
    model_name = Column(String, nullable=False)
    version = Column(String, nullable=False)
    model_type = Column(String, nullable=False)
    model_path = Column(String, nullable=False)
    metrics = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=False)
    description = Column(Text)
    training_data_hash = Column(String)
    model_hash = Column(String)

class Experiment(Base):
    """Database model for experiment tracking"""
    __tablename__ = 'experiments'
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default='running')  # running, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    metrics = Column(Text)  # JSON string
    parameters = Column(Text)  # JSON string
    model_version_id = Column(String)

class ModelPerformance(Base):
    """Database model for model performance tracking"""
    __tablename__ = 'model_performance'
    
    id = Column(String, primary_key=True)
    model_version_id = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    accuracy = Column(Float)
    precision = Column(Float)
    recall = Column(Float)
    f1_score = Column(Float)
    auc_score = Column(Float)
    prediction_count = Column(Integer, default=0)
    error_count = Column(Integer, default=0)
    avg_inference_time = Column(Float)
    data_drift_score = Column(Float)
    concept_drift_score = Column(Float)

class ABTest(Base):
    """Database model for A/B testing"""
    __tablename__ = 'ab_tests'
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    model_a_version = Column(String, nullable=False)
    model_b_version = Column(String, nullable=False)
    traffic_split = Column(Float, default=0.5)  # 0.5 = 50/50 split
    status = Column(String, default='running')  # running, completed, paused
    created_at = Column(DateTime, default=datetime.utcnow)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    results = Column(Text)  # JSON string

class ModelStatus(Enum):
    """Model deployment status"""
    TRAINING = "training"
    VALIDATING = "validating"
    STAGING = "staging"
    PRODUCTION = "production"
    DEPRECATED = "deprecated"
    FAILED = "failed"

class DriftType(Enum):
    """Types of model drift"""
    DATA_DRIFT = "data_drift"
    CONCEPT_DRIFT = "concept_drift"
    TARGET_DRIFT = "target_drift"
    PREDICTION_DRIFT = "prediction_drift"

@dataclass
class ModelMetadata:
    """Model metadata structure"""
    model_name: str
    version: str
    model_type: str
    created_at: datetime
    metrics: Dict[str, float]
    parameters: Dict[str, Any]
    training_data_hash: str
    model_hash: str
    description: str
    status: ModelStatus
    performance_threshold: float = 0.8

@dataclass
class DriftAlert:
    """Drift alert structure"""
    alert_id: str
    model_version_id: str
    drift_type: DriftType
    drift_score: float
    threshold: float
    timestamp: datetime
    severity: str  # low, medium, high, critical
    message: str
    is_resolved: bool = False

class ModelRegistry:
    """Model versioning and registry system"""
    
    def __init__(self, db_path: str = "models/registry.db"):
        self.db_path = db_path
        self.engine = create_engine(f'sqlite:///{db_path}')
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
    
    def register_model(self, model, metadata: ModelMetadata) -> str:
        """Register a new model version"""
        session = self.Session()
        
        try:
            # Generate model hash
            model_hash = self._calculate_model_hash(model)
            
            # Create model version record
            model_version = ModelVersion(
                id=str(uuid.uuid4()),
                model_name=metadata.model_name,
                version=metadata.version,
                model_type=metadata.model_type,
                model_path=metadata.model_name,
                metrics=json.dumps(metadata.metrics),
                description=metadata.description,
                training_data_hash=metadata.training_data_hash,
                model_hash=model_hash
            )
            
            session.add(model_version)
            session.commit()
            
            # Save model to disk
            model_path = f"models/{metadata.model_name}_v{metadata.version}.joblib"
            Path("models").mkdir(exist_ok=True)
            joblib.dump(model, model_path)
            
            logger.info(f"Model {metadata.model_name} v{metadata.version} registered successfully")
            return model_version.id
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error registering model: {e}")
            raise
        finally:
            session.close()
    
    def get_model(self, model_name: str, version: Optional[str] = None) -> Tuple[Any, ModelMetadata]:
        """Get model and metadata"""
        session = self.Session()
        
        try:
            if version:
                model_version = session.query(ModelVersion).filter(
                    ModelVersion.model_name == model_name,
                    ModelVersion.version == version
                ).first()
            else:
                model_version = session.query(ModelVersion).filter(
                    ModelVersion.model_name == model_name,
                    ModelVersion.is_active == True
                ).first()
            
            if not model_version:
                raise ValueError(f"Model {model_name} not found")
            
            # Load model from disk
            model_path = f"models/{model_name}_v{model_version.version}.joblib"
            model = joblib.load(model_path)
            
            # Create metadata
            metadata = ModelMetadata(
                model_name=model_version.model_name,
                version=model_version.version,
                model_type=model_version.model_type,
                created_at=model_version.created_at,
                metrics=json.loads(model_version.metrics),
                parameters={},
                training_data_hash=model_version.training_data_hash,
                model_hash=model_version.model_hash,
                description=model_version.description,
                status=ModelStatus.PRODUCTION if model_version.is_active else ModelStatus.DEPRECATED
            )
            
            return model, metadata
            
        except Exception as e:
            logger.error(f"Error getting model: {e}")
            raise
        finally:
            session.close()
    
    def list_models(self) -> List[Dict[str, Any]]:
        """List all registered models"""
        session = self.Session()
        
        try:
            models = session.query(ModelVersion).all()
            return [
                {
                    'id': model.id,
                    'model_name': model.model_name,
                    'version': model.version,
                    'model_type': model.model_type,
                    'created_at': model.created_at,
                    'is_active': model.is_active,
                    'metrics': json.loads(model.metrics)
                }
                for model in models
            ]
        finally:
            session.close()
    
    def set_active_model(self, model_name: str, version: str) -> bool:
        """Set active model version"""
        session = self.Session()
        
        try:
            # Deactivate all versions of this model
            session.query(ModelVersion).filter(
                ModelVersion.model_name == model_name
            ).update({'is_active': False})
            
            # Activate specified version
            model_version = session.query(ModelVersion).filter(
                ModelVersion.model_name == model_name,
                ModelVersion.version == version
            ).first()
            
            if model_version:
                model_version.is_active = True
                session.commit()
                logger.info(f"Model {model_name} v{version} set as active")
                return True
            else:
                logger.error(f"Model {model_name} v{version} not found")
                return False
                
        except Exception as e:
            session.rollback()
            logger.error(f"Error setting active model: {e}")
            return False
        finally:
            session.close()
    
    def _calculate_model_hash(self, model) -> str:
        """Calculate hash of model for integrity checking"""
        model_bytes = pickle.dumps(model)
        return hashlib.sha256(model_bytes).hexdigest()

class ModelMonitor:
    """Model performance monitoring and drift detection"""
    
    def __init__(self, registry: ModelRegistry):
        self.registry = registry
        self.drift_thresholds = {
            'data_drift': 0.1,
            'concept_drift': 0.15,
            'target_drift': 0.1,
            'prediction_drift': 0.2
        }
        self.performance_thresholds = {
            'accuracy': 0.8,
            'precision': 0.7,
            'recall': 0.7,
            'f1_score': 0.7
        }
    
    def monitor_model_performance(self, model_version_id: str, 
                                predictions: np.ndarray, 
                                actuals: np.ndarray,
                                inference_times: List[float]) -> Dict[str, Any]:
        """Monitor model performance and detect issues"""
        # Calculate performance metrics
        metrics = self._calculate_performance_metrics(predictions, actuals)
        
        # Calculate drift scores
        drift_scores = self._calculate_drift_scores(model_version_id, predictions, actuals)
        
        # Check for performance degradation
        performance_alerts = self._check_performance_degradation(model_version_id, metrics)
        
        # Check for drift
        drift_alerts = self._check_drift(model_version_id, drift_scores)
        
        # Store performance data
        self._store_performance_data(model_version_id, metrics, drift_scores, inference_times)
        
        return {
            'metrics': metrics,
            'drift_scores': drift_scores,
            'performance_alerts': performance_alerts,
            'drift_alerts': drift_alerts,
            'timestamp': datetime.now()
        }
    
    def _calculate_performance_metrics(self, predictions: np.ndarray, 
                                     actuals: np.ndarray) -> Dict[str, float]:
        """Calculate performance metrics"""
        try:
            # Handle different prediction types
            if predictions.ndim > 1 and predictions.shape[1] > 1:
                # Multi-class or probability predictions
                if predictions.shape[1] == 2:
                    # Binary classification with probabilities
                    pred_classes = (predictions[:, 1] > 0.5).astype(int)
                else:
                    # Multi-class
                    pred_classes = np.argmax(predictions, axis=1)
            else:
                # Single class predictions
                pred_classes = predictions
            
            metrics = {
                'accuracy': accuracy_score(actuals, pred_classes),
                'precision': precision_score(actuals, pred_classes, average='weighted', zero_division=0),
                'recall': recall_score(actuals, pred_classes, average='weighted', zero_division=0),
                'f1_score': f1_score(actuals, pred_classes, average='weighted', zero_division=0)
            }
            
            # Add AUC for binary classification
            if len(np.unique(actuals)) == 2 and predictions.ndim > 1 and predictions.shape[1] == 2:
                metrics['auc_score'] = roc_auc_score(actuals, predictions[:, 1])
            else:
                metrics['auc_score'] = 0.0
            
            return metrics
            
        except Exception as e:
            logger.error(f"Error calculating performance metrics: {e}")
            return {
                'accuracy': 0.0,
                'precision': 0.0,
                'recall': 0.0,
                'f1_score': 0.0,
                'auc_score': 0.0
            }
    
    def _calculate_drift_scores(self, model_version_id: str, 
                              predictions: np.ndarray, 
                              actuals: np.ndarray) -> Dict[str, float]:
        """Calculate various drift scores"""
        drift_scores = {}
        
        try:
            # Get reference data for comparison
            reference_data = self._get_reference_data(model_version_id)
            
            if reference_data is None:
                return {'data_drift': 0.0, 'concept_drift': 0.0, 'target_drift': 0.0}
            
            # Data drift (feature distribution change)
            if 'features' in reference_data:
                drift_scores['data_drift'] = self._calculate_data_drift(
                    reference_data['features'], predictions
                )
            
            # Concept drift (relationship between features and target)
            if 'targets' in reference_data:
                drift_scores['concept_drift'] = self._calculate_concept_drift(
                    reference_data['features'], reference_data['targets'],
                    predictions, actuals
                )
            
            # Target drift (target distribution change)
            if 'targets' in reference_data:
                drift_scores['target_drift'] = self._calculate_target_drift(
                    reference_data['targets'], actuals
                )
            
            # Prediction drift (prediction distribution change)
            if 'predictions' in reference_data:
                drift_scores['prediction_drift'] = self._calculate_prediction_drift(
                    reference_data['predictions'], predictions
                )
            
        except Exception as e:
            logger.error(f"Error calculating drift scores: {e}")
            drift_scores = {'data_drift': 0.0, 'concept_drift': 0.0, 'target_drift': 0.0, 'prediction_drift': 0.0}
        
        return drift_scores
    
    def _calculate_data_drift(self, reference_features: np.ndarray, 
                            current_features: np.ndarray) -> float:
        """Calculate data drift using statistical tests"""
        try:
            # Use Jensen-Shannon divergence for distribution comparison
            if reference_features.ndim == 1:
                # Univariate case
                ref_hist, _ = np.histogram(reference_features, bins=50, density=True)
                curr_hist, _ = np.histogram(current_features, bins=50, density=True)
                
                # Normalize histograms
                ref_hist = ref_hist / np.sum(ref_hist)
                curr_hist = curr_hist / np.sum(curr_hist)
                
                drift_score = jensenshannon(ref_hist, curr_hist)
            else:
                # Multivariate case - use mean of feature-wise drift scores
                drift_scores = []
                for i in range(reference_features.shape[1]):
                    ref_hist, _ = np.histogram(reference_features[:, i], bins=50, density=True)
                    curr_hist, _ = np.histogram(current_features[:, i], bins=50, density=True)
                    
                    ref_hist = ref_hist / np.sum(ref_hist)
                    curr_hist = curr_hist / np.sum(curr_hist)
                    
                    drift_scores.append(jensenshannon(ref_hist, curr_hist))
                
                drift_score = np.mean(drift_scores)
            
            return float(drift_score)
            
        except Exception as e:
            logger.error(f"Error calculating data drift: {e}")
            return 0.0
    
    def _calculate_concept_drift(self, ref_features: np.ndarray, ref_targets: np.ndarray,
                               curr_features: np.ndarray, curr_targets: np.ndarray) -> float:
        """Calculate concept drift using model performance comparison"""
        try:
            # Train simple models on reference and current data
            ref_model = LogisticRegression(random_state=42)
            curr_model = LogisticRegression(random_state=42)
            
            ref_model.fit(ref_features, ref_targets)
            curr_model.fit(curr_features, curr_targets)
            
            # Compare predictions on a common test set
            # Use current data as test set
            ref_pred = ref_model.predict_proba(curr_features)
            curr_pred = curr_model.predict_proba(curr_features)
            
            # Calculate KL divergence between predictions
            ref_pred_norm = ref_pred / np.sum(ref_pred, axis=1, keepdims=True)
            curr_pred_norm = curr_pred / np.sum(curr_pred, axis=1, keepdims=True)
            
            kl_divs = []
            for i in range(len(ref_pred_norm)):
                kl_div = np.sum(ref_pred_norm[i] * np.log(ref_pred_norm[i] / curr_pred_norm[i] + 1e-10))
                kl_divs.append(kl_div)
            
            return float(np.mean(kl_divs))
            
        except Exception as e:
            logger.error(f"Error calculating concept drift: {e}")
            return 0.0
    
    def _calculate_target_drift(self, ref_targets: np.ndarray, 
                              curr_targets: np.ndarray) -> float:
        """Calculate target drift using distribution comparison"""
        try:
            # Use Jensen-Shannon divergence for target distribution
            ref_hist, _ = np.histogram(ref_targets, bins=50, density=True)
            curr_hist, _ = np.histogram(curr_targets, bins=50, density=True)
            
            ref_hist = ref_hist / np.sum(ref_hist)
            curr_hist = curr_hist / np.sum(curr_hist)
            
            return float(jensenshannon(ref_hist, curr_hist))
            
        except Exception as e:
            logger.error(f"Error calculating target drift: {e}")
            return 0.0
    
    def _calculate_prediction_drift(self, ref_predictions: np.ndarray, 
                                  curr_predictions: np.ndarray) -> float:
        """Calculate prediction drift using distribution comparison"""
        try:
            # Flatten predictions if needed
            if ref_predictions.ndim > 1:
                ref_pred_flat = ref_predictions.flatten()
                curr_pred_flat = curr_predictions.flatten()
            else:
                ref_pred_flat = ref_predictions
                curr_pred_flat = curr_predictions
            
            # Use Jensen-Shannon divergence
            ref_hist, _ = np.histogram(ref_pred_flat, bins=50, density=True)
            curr_hist, _ = np.histogram(curr_pred_flat, bins=50, density=True)
            
            ref_hist = ref_hist / np.sum(ref_hist)
            curr_hist = curr_hist / np.sum(curr_hist)
            
            return float(jensenshannon(ref_hist, curr_hist))
            
        except Exception as e:
            logger.error(f"Error calculating prediction drift: {e}")
            return 0.0
    
    def _check_performance_degradation(self, model_version_id: str, 
                                     metrics: Dict[str, float]) -> List[Dict[str, Any]]:
        """Check for performance degradation"""
        alerts = []
        
        for metric_name, threshold in self.performance_thresholds.items():
            if metric_name in metrics and metrics[metric_name] < threshold:
                alerts.append({
                    'type': 'performance_degradation',
                    'metric': metric_name,
                    'current_value': metrics[metric_name],
                    'threshold': threshold,
                    'severity': 'high' if metrics[metric_name] < threshold * 0.8 else 'medium',
                    'message': f"{metric_name} dropped below threshold: {metrics[metric_name]:.3f} < {threshold:.3f}"
                })
        
        return alerts
    
    def _check_drift(self, model_version_id: str, 
                    drift_scores: Dict[str, float]) -> List[Dict[str, Any]]:
        """Check for model drift"""
        alerts = []
        
        for drift_type, threshold in self.drift_thresholds.items():
            if drift_type in drift_scores and drift_scores[drift_type] > threshold:
                severity = 'critical' if drift_scores[drift_type] > threshold * 2 else 'high'
                alerts.append({
                    'type': 'drift_detected',
                    'drift_type': drift_type,
                    'drift_score': drift_scores[drift_type],
                    'threshold': threshold,
                    'severity': severity,
                    'message': f"{drift_type} detected: {drift_scores[drift_type]:.3f} > {threshold:.3f}"
                })
        
        return alerts
    
    def _get_reference_data(self, model_version_id: str) -> Optional[Dict[str, np.ndarray]]:
        """Get reference data for drift comparison"""
        # In production, this would load reference data from storage
        # For now, return None to indicate no reference data available
        return None
    
    def _store_performance_data(self, model_version_id: str, metrics: Dict[str, float],
                              drift_scores: Dict[str, float], inference_times: List[float]):
        """Store performance data in database"""
        session = self.registry.Session()
        
        try:
            performance_record = ModelPerformance(
                id=str(uuid.uuid4()),
                model_version_id=model_version_id,
                accuracy=metrics.get('accuracy', 0.0),
                precision=metrics.get('precision', 0.0),
                recall=metrics.get('recall', 0.0),
                f1_score=metrics.get('f1_score', 0.0),
                auc_score=metrics.get('auc_score', 0.0),
                prediction_count=len(inference_times),
                error_count=0,  # Would be calculated from actual errors
                avg_inference_time=np.mean(inference_times) if inference_times else 0.0,
                data_drift_score=drift_scores.get('data_drift', 0.0),
                concept_drift_score=drift_scores.get('concept_drift', 0.0)
            )
            
            session.add(performance_record)
            session.commit()
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error storing performance data: {e}")
        finally:
            session.close()

class ABTestingFramework:
    """A/B testing framework for model comparison"""
    
    def __init__(self, registry: ModelRegistry):
        self.registry = registry
        self.active_tests = {}
    
    def create_ab_test(self, name: str, model_a_version: str, model_b_version: str,
                      traffic_split: float = 0.5, duration_days: int = 7) -> str:
        """Create a new A/B test"""
        session = self.registry.Session()
        
        try:
            ab_test = ABTest(
                id=str(uuid.uuid4()),
                name=name,
                model_a_version=model_a_version,
                model_b_version=model_b_version,
                traffic_split=traffic_split,
                start_date=datetime.now(),
                end_date=datetime.now() + timedelta(days=duration_days)
            )
            
            session.add(ab_test)
            session.commit()
            
            # Load models for testing
            model_a, _ = self.registry.get_model("model", model_a_version)
            model_b, _ = self.registry.get_model("model", model_b_version)
            
            self.active_tests[ab_test.id] = {
                'test': ab_test,
                'model_a': model_a,
                'model_b': model_b,
                'results': {'a': [], 'b': []}
            }
            
            logger.info(f"A/B test {name} created successfully")
            return ab_test.id
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error creating A/B test: {e}")
            raise
        finally:
            session.close()
    
    def get_model_for_prediction(self, test_id: str, user_id: str) -> Tuple[Any, str]:
        """Get model for prediction based on A/B test assignment"""
        if test_id not in self.active_tests:
            raise ValueError(f"A/B test {test_id} not found")
        
        test_data = self.active_tests[test_id]
        test = test_data['test']
        
        # Use user_id hash for consistent assignment
        user_hash = hash(user_id) % 100
        threshold = test.traffic_split * 100
        
        if user_hash < threshold:
            return test_data['model_a'], 'A'
        else:
            return test_data['model_b'], 'B'
    
    def record_prediction_result(self, test_id: str, variant: str, 
                               prediction: Any, actual: Any, 
                               prediction_time: float):
        """Record prediction result for A/B test"""
        if test_id not in self.active_tests:
            return
        
        self.active_tests[test_id]['results'][variant.lower()].append({
            'prediction': prediction,
            'actual': actual,
            'prediction_time': prediction_time,
            'timestamp': datetime.now()
        })
    
    def get_test_results(self, test_id: str) -> Dict[str, Any]:
        """Get A/B test results"""
        if test_id not in self.active_tests:
            raise ValueError(f"A/B test {test_id} not found")
        
        test_data = self.active_tests[test_id]
        results_a = test_data['results']['a']
        results_b = test_data['results']['b']
        
        if not results_a or not results_b:
            return {'error': 'Insufficient data for analysis'}
        
        # Calculate metrics for each variant
        metrics_a = self._calculate_variant_metrics(results_a)
        metrics_b = self._calculate_variant_metrics(results_b)
        
        # Statistical significance test
        significance = self._calculate_significance(results_a, results_b)
        
        return {
            'test_id': test_id,
            'variant_a_metrics': metrics_a,
            'variant_b_metrics': metrics_b,
            'statistical_significance': significance,
            'recommendation': self._get_recommendation(metrics_a, metrics_b, significance)
        }
    
    def _calculate_variant_metrics(self, results: List[Dict[str, Any]]) -> Dict[str, float]:
        """Calculate metrics for a variant"""
        if not results:
            return {}
        
        predictions = [r['prediction'] for r in results]
        actuals = [r['actual'] for r in results]
        times = [r['prediction_time'] for r in results]
        
        # Convert to numpy arrays
        pred_array = np.array(predictions)
        actual_array = np.array(actuals)
        
        # Calculate accuracy
        if pred_array.ndim > 1 and pred_array.shape[1] > 1:
            pred_classes = np.argmax(pred_array, axis=1)
        else:
            pred_classes = pred_array
        
        accuracy = accuracy_score(actual_array, pred_classes)
        
        # Calculate average prediction time
        avg_time = np.mean(times)
        
        return {
            'accuracy': accuracy,
            'avg_prediction_time': avg_time,
            'sample_size': len(results)
        }
    
    def _calculate_significance(self, results_a: List[Dict], results_b: List[Dict]) -> Dict[str, Any]:
        """Calculate statistical significance between variants"""
        try:
            # Extract accuracies
            acc_a = [r['prediction'] == r['actual'] for r in results_a]
            acc_b = [r['prediction'] == r['actual'] for r in results_b]
            
            # Perform chi-square test
            from scipy.stats import chi2_contingency
            
            # Create contingency table
            correct_a = sum(acc_a)
            incorrect_a = len(acc_a) - correct_a
            correct_b = sum(acc_b)
            incorrect_b = len(acc_b) - correct_b
            
            contingency_table = [[correct_a, incorrect_a], [correct_b, incorrect_b]]
            chi2, p_value, dof, expected = chi2_contingency(contingency_table)
            
            return {
                'chi2_statistic': chi2,
                'p_value': p_value,
                'is_significant': p_value < 0.05,
                'confidence_level': 0.95
            }
            
        except Exception as e:
            logger.error(f"Error calculating significance: {e}")
            return {'error': str(e)}
    
    def _get_recommendation(self, metrics_a: Dict[str, float], 
                          metrics_b: Dict[str, float], 
                          significance: Dict[str, Any]) -> str:
        """Get recommendation based on test results"""
        if 'error' in significance:
            return "Unable to determine recommendation due to analysis error"
        
        if not significance.get('is_significant', False):
            return "No significant difference detected. Consider running test longer or increasing sample size."
        
        if metrics_a['accuracy'] > metrics_b['accuracy']:
            return "Variant A performs better. Consider deploying Variant A."
        elif metrics_b['accuracy'] > metrics_a['accuracy']:
            return "Variant B performs better. Consider deploying Variant B."
        else:
            return "Both variants perform similarly. Consider other factors like prediction time."

class MLOpsAPI:
    """API wrapper for MLOps infrastructure"""
    
    def __init__(self, db_path: str = "models/registry.db"):
        self.registry = ModelRegistry(db_path)
        self.monitor = ModelMonitor(self.registry)
        self.ab_testing = ABTestingFramework(self.registry)
    
    def register_model(self, model, metadata: ModelMetadata) -> Dict[str, Any]:
        """Register a new model version"""
        try:
            model_id = self.registry.register_model(model, metadata)
            
            return {
                'success': True,
                'model_id': model_id,
                'model_name': metadata.model_name,
                'version': metadata.version,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error registering model: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def monitor_model(self, model_version_id: str, predictions: np.ndarray,
                     actuals: np.ndarray, inference_times: List[float]) -> Dict[str, Any]:
        """Monitor model performance"""
        try:
            monitoring_result = self.monitor.monitor_model_performance(
                model_version_id, predictions, actuals, inference_times
            )
            
            return {
                'success': True,
                'monitoring_result': monitoring_result,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error monitoring model: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def create_ab_test(self, name: str, model_a_version: str, model_b_version: str,
                      traffic_split: float = 0.5, duration_days: int = 7) -> Dict[str, Any]:
        """Create A/B test"""
        try:
            test_id = self.ab_testing.create_ab_test(
                name, model_a_version, model_b_version, traffic_split, duration_days
            )
            
            return {
                'success': True,
                'test_id': test_id,
                'test_name': name,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error creating A/B test: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def get_ab_test_results(self, test_id: str) -> Dict[str, Any]:
        """Get A/B test results"""
        try:
            results = self.ab_testing.get_test_results(test_id)
            
            return {
                'success': True,
                'results': results,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting A/B test results: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def list_models(self) -> Dict[str, Any]:
        """List all registered models"""
        try:
            models = self.registry.list_models()
            
            return {
                'success': True,
                'models': models,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error listing models: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }

# Example usage and testing
if __name__ == "__main__":
    # Initialize MLOps API
    mlops = MLOpsAPI()
    
    # Example model registration
    from sklearn.ensemble import RandomForestClassifier
    
    # Create sample model
    X_train = np.random.randn(100, 5)
    y_train = np.random.randint(0, 2, 100)
    
    model = RandomForestClassifier(n_estimators=10, random_state=42)
    model.fit(X_train, y_train)
    
    # Create model metadata
    metadata = ModelMetadata(
        model_name="sample_classifier",
        version="1.0.0",
        model_type="RandomForestClassifier",
        created_at=datetime.now(),
        metrics={'accuracy': 0.85, 'precision': 0.82, 'recall': 0.88},
        parameters={'n_estimators': 10, 'random_state': 42},
        training_data_hash="abc123",
        model_hash="def456",
        description="Sample classifier for testing",
        status=ModelStatus.TRAINING
    )
    
    # Register model
    reg_result = mlops.register_model(model, metadata)
    print("Model Registration:", reg_result)
    
    # List models
    models_result = mlops.list_models()
    print("List Models:", models_result)
    
    # Example A/B test
    ab_result = mlops.create_ab_test(
        "Sample A/B Test",
        "1.0.0",
        "1.0.0",  # Same version for demo
        0.5,
        7
    )
    print("A/B Test Creation:", ab_result)
    
    # Example monitoring
    test_predictions = np.random.randn(10, 2)
    test_actuals = np.random.randint(0, 2, 10)
    test_times = [0.1, 0.2, 0.15, 0.12, 0.18, 0.14, 0.16, 0.13, 0.17, 0.11]
    
    monitor_result = mlops.monitor_model(
        reg_result['model_id'],
        test_predictions,
        test_actuals,
        test_times
    )
    print("Model Monitoring:", monitor_result)