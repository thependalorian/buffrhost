"""
Model Monitoring System for Hospitality Platform
===============================================

Comprehensive model monitoring system for drift detection, performance tracking,
and automated alerts for ML models in production.

Features:
- Model performance monitoring and drift detection
- Data drift and concept drift detection
- Automated alerting and notifications
- Model health scoring and degradation detection
- Performance metrics tracking and visualization

Author: Buffr AI Team
Date: 2024
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional, Any, Union, Callable
from dataclasses import dataclass
from datetime import datetime, timedelta
import logging
import json
import asyncio
import threading
import time
from pathlib import Path
from enum import Enum

class ModelMonitoringSystem:
    """
    Model Monitoring System for Hospitality Platform
    
    This class implements comprehensive model monitoring including performance tracking,
    data drift detection, model degradation alerts, and automated retraining triggers
    to ensure ML models maintain high performance in production.
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        Initialize the model monitoring system
        
        Args:
            config: Configuration dictionary for the system
        """
        self.config = config or {}
        self.models = {}
        self.monitoring_rules = {}
        self.alert_thresholds = self.config.get('alert_thresholds', {
            'accuracy_drop': 0.05,
            'data_drift': 0.1,
            'prediction_drift': 0.15
        })
        
        # Initialize logging
        self.logger = logging.getLogger(__name__)
        
        # Setup database connection
        self.db_path = "model_monitoring.db"
        self._setup_database()
        
        # Initialize monitoring
        self._initialize_monitoring()
    
    def _setup_database(self):
        """Setup SQLite database for storing monitoring data"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create tables for model monitoring
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS model_performance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                model_name TEXT,
                model_version TEXT,
                accuracy REAL,
                precision_score REAL,
                recall_score REAL,
                f1_score REAL,
                auc_score REAL,
                prediction_count INTEGER,
                monitoring_date TIMESTAMP,
                created_at TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS data_drift_alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                model_name TEXT,
                feature_name TEXT,
                drift_score REAL,
                threshold REAL,
                alert_level TEXT,
                created_at TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS model_alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                model_name TEXT,
                alert_type TEXT,
                alert_message TEXT,
                severity TEXT,
                resolved BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP,
                resolved_at TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def _initialize_monitoring(self):
        """Initialize model monitoring components"""
        try:
            from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
            from sklearn.preprocessing import StandardScaler
            from sklearn.decomposition import PCA
            
            # Initialize monitoring models
            self.models['drift_detector'] = StandardScaler()
            self.models['pca'] = PCA(n_components=0.95)
            
            self.logger.info("Model monitoring system initialized successfully")
            
        except ImportError as e:
            self.logger.error(f"Failed to initialize monitoring: {e}")
            raise
    
    def monitor_model_performance(self, model_name: str, y_true: List[Any], 
                                y_pred: List[Any], y_prob: List[float] = None) -> Dict[str, Any]:
        """
        Monitor model performance and detect issues
        
        Args:
            model_name: Name of the model being monitored
            y_true: True labels
            y_pred: Predicted labels
            y_prob: Prediction probabilities (optional)
            
        Returns:
            Dictionary containing monitoring results
        """
        try:
            # Calculate performance metrics
            accuracy = accuracy_score(y_true, y_pred)
            precision = precision_score(y_true, y_pred, average='weighted')
            recall = recall_score(y_true, y_pred, average='weighted')
            f1 = f1_score(y_true, y_pred, average='weighted')
            
            # Calculate AUC if probabilities available
            auc = None
            if y_prob is not None:
                try:
                    auc = roc_auc_score(y_true, y_prob)
                except:
                    auc = None
            
            # Store performance data
            self._store_performance_data(
                model_name, accuracy, precision, recall, f1, auc, len(y_true)
            )
            
            # Check for performance degradation
            alerts = self._check_performance_degradation(model_name, accuracy)
            
            # Check for data drift
            drift_alerts = self._check_data_drift(model_name, y_pred)
            
            return {
                'model_name': model_name,
                'accuracy': accuracy,
                'precision': precision,
                'recall': recall,
                'f1_score': f1,
                'auc_score': auc,
                'prediction_count': len(y_true),
                'alerts': alerts,
                'drift_alerts': drift_alerts,
                'monitoring_date': datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Error monitoring model performance: {e}")
            return {
                'model_name': model_name,
                'error': str(e),
                'alerts': [],
                'drift_alerts': []
            }
    
    def _store_performance_data(self, model_name: str, accuracy: float, precision: float,
                               recall: float, f1: float, auc: float, prediction_count: int):
        """Store model performance data in database"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO model_performance 
            (model_name, model_version, accuracy, precision_score, recall_score, 
             f1_score, auc_score, prediction_count, monitoring_date, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            model_name,
            '1.0',  # Default version
            accuracy,
            precision,
            recall,
            f1,
            auc,
            prediction_count,
            datetime.now(),
            datetime.now()
        ))
        
        conn.commit()
        conn.close()
    
    def _check_performance_degradation(self, model_name: str, current_accuracy: float) -> List[Dict[str, Any]]:
        """Check for model performance degradation"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get historical accuracy data
        cursor.execute('''
            SELECT accuracy FROM model_performance 
            WHERE model_name = ? 
            ORDER BY monitoring_date DESC LIMIT 10
        ''', (model_name,))
        
        historical_accuracies = [row[0] for row in cursor.fetchall()]
        conn.close()
        
        alerts = []
        
        if len(historical_accuracies) >= 3:
            # Calculate average historical accuracy
            avg_historical_accuracy = np.mean(historical_accuracies[1:])  # Exclude current
            
            # Check for significant drop
            accuracy_drop = avg_historical_accuracy - current_accuracy
            
            if accuracy_drop > self.alert_thresholds['accuracy_drop']:
                alert = {
                    'type': 'performance_degradation',
                    'severity': 'high' if accuracy_drop > 0.1 else 'medium',
                    'message': f'Model accuracy dropped by {accuracy_drop:.3f}',
                    'current_accuracy': current_accuracy,
                    'historical_accuracy': avg_historical_accuracy,
                    'drop_percentage': (accuracy_drop / avg_historical_accuracy) * 100
                }
                alerts.append(alert)
                
                # Store alert
                self._store_alert(model_name, 'performance_degradation', 
                                alert['message'], alert['severity'])
        
        return alerts
    
    def _check_data_drift(self, model_name: str, predictions: List[Any]) -> List[Dict[str, Any]]:
        """Check for data drift in model predictions"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get historical predictions
        cursor.execute('''
            SELECT prediction_count FROM model_performance 
            WHERE model_name = ? 
            ORDER BY monitoring_date DESC LIMIT 5
        ''', (model_name,))
        
        historical_counts = [row[0] for row in cursor.fetchall()]
        conn.close()
        
        alerts = []
        
        if len(historical_counts) >= 2:
            # Calculate prediction count drift
            current_count = len(predictions)
            avg_historical_count = np.mean(historical_counts[1:])  # Exclude current
            
            # Check for significant change in prediction volume
            count_change = abs(current_count - avg_historical_count) / avg_historical_count
            
            if count_change > self.alert_thresholds['data_drift']:
                alert = {
                    'type': 'data_drift',
                    'severity': 'high' if count_change > 0.5 else 'medium',
                    'message': f'Prediction volume changed by {count_change:.1%}',
                    'current_count': current_count,
                    'historical_count': avg_historical_count,
                    'change_percentage': count_change * 100
                }
                alerts.append(alert)
                
                # Store alert
                self._store_alert(model_name, 'data_drift', 
                                alert['message'], alert['severity'])
        
        return alerts
    
    def _store_alert(self, model_name: str, alert_type: str, message: str, severity: str):
        """Store model alert in database"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO model_alerts 
            (model_name, alert_type, alert_message, severity, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (model_name, alert_type, message, severity, datetime.now()))
        
        conn.commit()
        conn.close()
    
    def get_model_health_status(self, model_name: str) -> Dict[str, Any]:
        """Get overall health status of a model"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get recent performance data
        cursor.execute('''
            SELECT * FROM model_performance 
            WHERE model_name = ? 
            ORDER BY monitoring_date DESC LIMIT 10
        ''', (model_name,))
        
        performance_data = cursor.fetchall()
        
        # Get active alerts
        cursor.execute('''
            SELECT * FROM model_alerts 
            WHERE model_name = ? AND resolved = FALSE
            ORDER BY created_at DESC
        ''', (model_name,))
        
        active_alerts = cursor.fetchall()
        
        # Get drift alerts
        cursor.execute('''
            SELECT * FROM data_drift_alerts 
            WHERE model_name = ? 
            ORDER BY created_at DESC LIMIT 5
        ''', (model_name,))
        
        drift_alerts = cursor.fetchall()
        
        conn.close()
        
        if not performance_data:
            return {
                'model_name': model_name,
                'status': 'unknown',
                'message': 'No performance data available'
            }
        
        # Calculate health metrics
        recent_accuracy = performance_data[0][3]  # accuracy column
        avg_accuracy = np.mean([row[3] for row in performance_data])
        
        # Determine health status
        if recent_accuracy > 0.9:
            status = 'excellent'
        elif recent_accuracy > 0.8:
            status = 'good'
        elif recent_accuracy > 0.7:
            status = 'fair'
        else:
            status = 'poor'
        
        # Check for critical alerts
        critical_alerts = [alert for alert in active_alerts if alert[4] == 'high']  # severity column
        
        if critical_alerts:
            status = 'critical'
        
        return {
            'model_name': model_name,
            'status': status,
            'recent_accuracy': recent_accuracy,
            'avg_accuracy': avg_accuracy,
            'active_alerts': len(active_alerts),
            'critical_alerts': len(critical_alerts),
            'drift_alerts': len(drift_alerts),
            'last_monitoring': performance_data[0][9].isoformat() if performance_data[0][9] else None
        }
    
    def get_monitoring_dashboard(self) -> Dict[str, Any]:
        """Get comprehensive monitoring dashboard data"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get all models
        cursor.execute('SELECT DISTINCT model_name FROM model_performance')
        models = [row[0] for row in cursor.fetchall()]
        
        # Get overall statistics
        cursor.execute('SELECT COUNT(*) FROM model_performance')
        total_monitoring_events = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM model_alerts WHERE resolved = FALSE')
        active_alerts = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM data_drift_alerts')
        drift_alerts = cursor.fetchone()[0]
        
        conn.close()
        
        # Get health status for each model
        model_health = {}
        for model in models:
            model_health[model] = self.get_model_health_status(model)
        
        return {
            'total_models': len(models),
            'total_monitoring_events': total_monitoring_events,
            'active_alerts': active_alerts,
            'drift_alerts': drift_alerts,
            'model_health': model_health,
            'overall_health': 'good' if active_alerts == 0 else 'warning' if active_alerts < 5 else 'critical'
        }
    
    def resolve_alert(self, alert_id: int):
        """Resolve a model alert"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE model_alerts 
            SET resolved = TRUE, resolved_at = ? 
            WHERE id = ?
        ''', (datetime.now(), alert_id))
        
        conn.commit()
        conn.close()
    
    def get_model_recommendations(self, model_name: str) -> List[str]:
        """Get recommendations for improving model performance"""
        health_status = self.get_model_health_status(model_name)
        recommendations = []
        
        if health_status['status'] == 'critical':
            recommendations.append("Immediate model retraining required")
            recommendations.append("Review data quality and feature engineering")
            recommendations.append("Consider model architecture changes")
        elif health_status['status'] == 'poor':
            recommendations.append("Model retraining recommended")
            recommendations.append("Check for data drift and concept drift")
            recommendations.append("Review hyperparameters")
        elif health_status['status'] == 'fair':
            recommendations.append("Monitor model performance closely")
            recommendations.append("Consider incremental improvements")
        elif health_status['status'] == 'good':
            recommendations.append("Model performing well")
            recommendations.append("Continue regular monitoring")
        else:
            recommendations.append("Model performing excellently")
            recommendations.append("Maintain current monitoring schedule")
        
        return recommendations
import warnings
warnings.filterwarnings('ignore')

# Core ML and statistical libraries
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.model_selection import cross_val_score
from sklearn.cluster import DBSCAN

# Statistical analysis
from scipy import stats
from scipy.stats import ks_2samp, chi2_contingency, mannwhitneyu
from scipy.spatial.distance import jensenshannon

# Time series analysis
import statsmodels.api as sm
from statsmodels.tsa.seasonal import seasonal_decompose

# Database and storage
import sqlite3
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base = declarative_base()

class DriftType(Enum):
    """Types of model drift"""
    DATA_DRIFT = "data_drift"
    CONCEPT_DRIFT = "concept_drift"
    PERFORMANCE_DRIFT = "performance_drift"
    PREDICTION_DRIFT = "prediction_drift"

class AlertLevel(Enum):
    """Alert severity levels"""
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"
    EMERGENCY = "emergency"

class ModelStatus(Enum):
    """Model health status"""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    FAILING = "failing"
    OFFLINE = "offline"

class ModelMetrics(Base):
    """Database model for model performance metrics"""
    __tablename__ = 'model_metrics'
    
    id = Column(Integer, primary_key=True)
    model_name = Column(String(255), nullable=False)
    model_version = Column(String(50), nullable=False)
    metric_name = Column(String(255), nullable=False)
    metric_value = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    model_metadata = Column(Text)  # JSON string

class DriftAlerts(Base):
    """Database model for drift alerts"""
    __tablename__ = 'drift_alerts'
    
    id = Column(Integer, primary_key=True)
    model_name = Column(String(255), nullable=False)
    drift_type = Column(String(50), nullable=False)
    alert_level = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    resolved = Column(Boolean, default=False)
    alert_metadata = Column(Text)  # JSON string

@dataclass
class MonitoringConfig:
    """Configuration for model monitoring system"""
    # Drift detection parameters
    drift_threshold: float = 0.1  # 10% drift threshold
    significance_level: float = 0.05
    min_samples: int = 100
    
    # Performance monitoring
    performance_window: int = 1000  # Last N predictions
    degradation_threshold: float = 0.05  # 5% performance drop
    
    # Alerting parameters
    alert_cooldown: int = 3600  # 1 hour cooldown between alerts
    max_alerts_per_hour: int = 10
    
    # Model health scoring
    health_weights: Dict[str, float] = None
    
    # Database configuration
    database_url: str = "sqlite:///model_monitoring.db"
    
    # Model persistence
    model_path: str = "models/monitoring"
    version: str = "1.0.0"
    
    def __post_init__(self):
        if self.health_weights is None:
            self.health_weights = {
                'accuracy': 0.3,
                'latency': 0.2,
                'data_drift': 0.2,
                'concept_drift': 0.2,
                'availability': 0.1
            }

class DriftDetector:
    """Drift detection system"""
    
    def __init__(self, config: MonitoringConfig):
        self.config = config
        self.reference_data = {}
        self.drift_models = {}
    
    def set_reference_data(self, model_name: str, reference_data: pd.DataFrame) -> None:
        """Set reference data for drift detection"""
        self.reference_data[model_name] = reference_data.copy()
        logger.info(f"Set reference data for model {model_name}")
    
    def detect_data_drift(self, model_name: str, current_data: pd.DataFrame) -> Dict[str, Any]:
        """Detect data drift between reference and current data"""
        logger.info(f"Detecting data drift for model {model_name}")
        
        if model_name not in self.reference_data:
            return {'error': f'No reference data found for model {model_name}'}
        
        reference_data = self.reference_data[model_name]
        drift_results = {
            'drift_detected': False,
            'drift_score': 0.0,
            'column_drifts': {},
            'overall_drift': False
        }
        
        try:
            # Detect drift for each numerical column
            numerical_columns = current_data.select_dtypes(include=[np.number]).columns
            drift_scores = []
            
            for column in numerical_columns:
                if column in reference_data.columns:
                    ref_data = reference_data[column].dropna()
                    curr_data = current_data[column].dropna()
                    
                    if len(ref_data) > 0 and len(curr_data) > 0:
                        # Kolmogorov-Smirnov test
                        ks_stat, ks_pvalue = ks_2samp(ref_data, curr_data)
                        
                        # Jensen-Shannon divergence
                        js_div = self._calculate_js_divergence(ref_data, curr_data)
                        
                        # Statistical significance
                        is_significant = ks_pvalue < self.config.significance_level
                        drift_score = js_div
                        
                        drift_results['column_drifts'][column] = {
                            'ks_statistic': ks_stat,
                            'ks_pvalue': ks_pvalue,
                            'js_divergence': js_div,
                            'is_significant': is_significant,
                            'drift_score': drift_score
                        }
                        
                        drift_scores.append(drift_score)
            
            # Calculate overall drift
            if drift_scores:
                overall_drift_score = np.mean(drift_scores)
                drift_results['drift_score'] = overall_drift_score
                drift_results['drift_detected'] = overall_drift_score > self.config.drift_threshold
                drift_results['overall_drift'] = drift_results['drift_detected']
            
            return drift_results
            
        except Exception as e:
            logger.error(f"Error detecting data drift: {e}")
            return {'error': str(e)}
    
    def detect_concept_drift(self, model_name: str, current_predictions: np.ndarray,
                           current_labels: np.ndarray = None) -> Dict[str, Any]:
        """Detect concept drift in model predictions"""
        logger.info(f"Detecting concept drift for model {model_name}")
        
        try:
            # If we have labels, we can detect concept drift by monitoring performance
            if current_labels is not None:
                # This would require a reference model or baseline performance
                # For now, we'll use prediction distribution analysis
                pass
            
            # Analyze prediction distribution
            prediction_stats = {
                'mean': np.mean(current_predictions),
                'std': np.std(current_predictions),
                'min': np.min(current_predictions),
                'max': np.max(current_predictions),
                'percentiles': np.percentile(current_predictions, [25, 50, 75, 90, 95, 99])
            }
            
            # Detect anomalies in predictions using Isolation Forest
            if len(current_predictions) > self.config.min_samples:
                iso_forest = IsolationForest(contamination=0.1, random_state=42)
                anomaly_scores = iso_forest.fit_predict(current_predictions.reshape(-1, 1))
                anomaly_ratio = np.sum(anomaly_scores == -1) / len(anomaly_scores)
                
                concept_drift_detected = anomaly_ratio > 0.2  # 20% anomalies
            else:
                concept_drift_detected = False
                anomaly_ratio = 0.0
            
            return {
                'concept_drift_detected': concept_drift_detected,
                'anomaly_ratio': anomaly_ratio,
                'prediction_stats': prediction_stats,
                'drift_score': anomaly_ratio
            }
            
        except Exception as e:
            logger.error(f"Error detecting concept drift: {e}")
            return {'error': str(e)}
    
    def _calculate_js_divergence(self, ref_data: pd.Series, curr_data: pd.Series) -> float:
        """Calculate Jensen-Shannon divergence between two distributions"""
        try:
            # Create histograms with same bins
            min_val = min(ref_data.min(), curr_data.min())
            max_val = max(ref_data.max(), curr_data.max())
            bins = np.linspace(min_val, max_val, 50)
            
            ref_hist, _ = np.histogram(ref_data, bins=bins, density=True)
            curr_hist, _ = np.histogram(curr_data, bins=bins, density=True)
            
            # Normalize
            ref_hist = ref_hist / np.sum(ref_hist)
            curr_hist = curr_hist / np.sum(curr_hist)
            
            # Add small epsilon to avoid log(0)
            epsilon = 1e-10
            ref_hist = ref_hist + epsilon
            curr_hist = curr_hist + epsilon
            
            # Calculate JS divergence
            js_div = jensenshannon(ref_hist, curr_hist)
            
            return js_div
            
        except Exception as e:
            logger.error(f"Error calculating JS divergence: {e}")
            return 0.0

class PerformanceMonitor:
    """Model performance monitoring system"""
    
    def __init__(self, config: MonitoringConfig):
        self.config = config
        self.performance_history = {}
        self.baseline_metrics = {}
    
    def set_baseline_metrics(self, model_name: str, metrics: Dict[str, float]) -> None:
        """Set baseline performance metrics for a model"""
        self.baseline_metrics[model_name] = metrics.copy()
        logger.info(f"Set baseline metrics for model {model_name}")
    
    def calculate_performance_metrics(self, model_name: str, y_true: np.ndarray,
                                    y_pred: np.ndarray, y_pred_proba: np.ndarray = None,
                                    prediction_time: float = None) -> Dict[str, Any]:
        """Calculate current performance metrics"""
        logger.info(f"Calculating performance metrics for model {model_name}")
        
        try:
            metrics = {}
            
            # Classification metrics
            if len(np.unique(y_true)) == 2:  # Binary classification
                metrics['accuracy'] = accuracy_score(y_true, y_pred)
                metrics['precision'] = precision_score(y_true, y_pred, average='weighted')
                metrics['recall'] = recall_score(y_true, y_pred, average='weighted')
                metrics['f1_score'] = f1_score(y_true, y_pred, average='weighted')
                
                if y_pred_proba is not None:
                    metrics['roc_auc'] = roc_auc_score(y_true, y_pred_proba)
            
            # Regression metrics
            else:
                metrics['mse'] = mean_squared_error(y_true, y_pred)
                metrics['mae'] = mean_absolute_error(y_true, y_pred)
                metrics['r2_score'] = r2_score(y_true, y_pred)
                metrics['rmse'] = np.sqrt(metrics['mse'])
            
            # Latency metrics
            if prediction_time is not None:
                metrics['latency'] = prediction_time
                metrics['throughput'] = 1.0 / prediction_time if prediction_time > 0 else 0
            
            # Store in history
            if model_name not in self.performance_history:
                self.performance_history[model_name] = []
            
            self.performance_history[model_name].append({
                'timestamp': datetime.now(),
                'metrics': metrics
            })
            
            # Keep only recent history
            if len(self.performance_history[model_name]) > self.config.performance_window:
                self.performance_history[model_name] = self.performance_history[model_name][-self.config.performance_window:]
            
            return metrics
            
        except Exception as e:
            logger.error(f"Error calculating performance metrics: {e}")
            return {'error': str(e)}
    
    def detect_performance_degradation(self, model_name: str) -> Dict[str, Any]:
        """Detect performance degradation compared to baseline"""
        logger.info(f"Detecting performance degradation for model {model_name}")
        
        try:
            if model_name not in self.baseline_metrics:
                return {'error': f'No baseline metrics found for model {model_name}'}
            
            if model_name not in self.performance_history:
                return {'error': f'No performance history found for model {model_name}'}
            
            baseline = self.baseline_metrics[model_name]
            recent_metrics = self.performance_history[model_name][-10:]  # Last 10 measurements
            
            if not recent_metrics:
                return {'error': 'No recent performance data available'}
            
            # Calculate average recent performance
            recent_avg = {}
            for metric_name in baseline.keys():
                values = [m['metrics'].get(metric_name, 0) for m in recent_metrics if metric_name in m['metrics']]
                if values:
                    recent_avg[metric_name] = np.mean(values)
            
            # Calculate degradation
            degradation_detected = False
            degradation_details = {}
            
            for metric_name, baseline_value in baseline.items():
                if metric_name in recent_avg:
                    current_value = recent_avg[metric_name]
                    
                    # Calculate relative change
                    if baseline_value != 0:
                        relative_change = (current_value - baseline_value) / abs(baseline_value)
                    else:
                        relative_change = 0
                    
                    # Check if degradation exceeds threshold
                    is_degraded = abs(relative_change) > self.config.degradation_threshold
                    
                    degradation_details[metric_name] = {
                        'baseline': baseline_value,
                        'current': current_value,
                        'relative_change': relative_change,
                        'is_degraded': is_degraded
                    }
                    
                    if is_degraded:
                        degradation_detected = True
            
            return {
                'degradation_detected': degradation_detected,
                'degradation_details': degradation_details,
                'baseline_metrics': baseline,
                'recent_metrics': recent_avg
            }
            
        except Exception as e:
            logger.error(f"Error detecting performance degradation: {e}")
            return {'error': str(e)}

class ModelHealthScorer:
    """Model health scoring system"""
    
    def __init__(self, config: MonitoringConfig):
        self.config = config
    
    def calculate_health_score(self, model_name: str, performance_metrics: Dict[str, float],
                             drift_results: Dict[str, Any], availability: float = 1.0) -> Dict[str, Any]:
        """Calculate overall model health score"""
        logger.info(f"Calculating health score for model {model_name}")
        
        try:
            health_components = {}
            overall_score = 0.0
            
            # Performance component
            if 'accuracy' in performance_metrics:
                health_components['accuracy'] = performance_metrics['accuracy']
            elif 'r2_score' in performance_metrics:
                health_components['accuracy'] = max(0, performance_metrics['r2_score'])
            else:
                health_components['accuracy'] = 0.5  # Default neutral score
            
            # Latency component (inverse - lower is better)
            if 'latency' in performance_metrics:
                # Normalize latency (assuming 1 second is good, 10 seconds is bad)
                latency_score = max(0, 1 - (performance_metrics['latency'] - 1) / 9)
                health_components['latency'] = latency_score
            else:
                health_components['latency'] = 0.5
            
            # Data drift component (inverse - lower drift is better)
            drift_score = drift_results.get('drift_score', 0.0)
            health_components['data_drift'] = max(0, 1 - drift_score / self.config.drift_threshold)
            
            # Concept drift component
            concept_drift_score = drift_results.get('concept_drift_detected', False)
            health_components['concept_drift'] = 0.0 if concept_drift_score else 1.0
            
            # Availability component
            health_components['availability'] = availability
            
            # Calculate weighted overall score
            for component, score in health_components.items():
                weight = self.config.health_weights.get(component, 0.1)
                overall_score += weight * score
            
            # Determine health status
            if overall_score >= 0.8:
                status = ModelStatus.HEALTHY
            elif overall_score >= 0.6:
                status = ModelStatus.DEGRADED
            elif overall_score >= 0.4:
                status = ModelStatus.FAILING
            else:
                status = ModelStatus.OFFLINE
            
            return {
                'overall_score': overall_score,
                'health_components': health_components,
                'status': status.value,
                'weights': self.config.health_weights,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error calculating health score: {e}")
            return {'error': str(e)}

class AlertManager:
    """Alert management system"""
    
    def __init__(self, config: MonitoringConfig):
        self.config = config
        self.engine = create_engine(config.database_url)
        Base.metadata.create_all(self.engine)
        Session = sessionmaker(bind=self.engine)
        self.session = Session()
        self.alert_history = {}
    
    def create_alert(self, model_name: str, drift_type: DriftType, alert_level: AlertLevel,
                    message: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Create a new alert"""
        logger.info(f"Creating {alert_level.value} alert for {model_name}: {message}")
        
        try:
            # Check alert cooldown
            if self._should_suppress_alert(model_name, drift_type):
                return {'suppressed': True, 'reason': 'Alert cooldown active'}
            
            # Create alert record
            alert = DriftAlerts(
                model_name=model_name,
                drift_type=drift_type.value,
                alert_level=alert_level.value,
                message=message,
                alert_metadata=json.dumps(metadata or {})
            )
            
            self.session.add(alert)
            self.session.commit()
            
            # Update alert history
            alert_key = f"{model_name}_{drift_type.value}"
            if alert_key not in self.alert_history:
                self.alert_history[alert_key] = []
            
            self.alert_history[alert_key].append(datetime.now())
            
            return {
                'success': True,
                'alert_id': alert.id,
                'model_name': model_name,
                'drift_type': drift_type.value,
                'alert_level': alert_level.value,
                'message': message,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error creating alert: {e}")
            self.session.rollback()
            return {'error': str(e)}
    
    def _should_suppress_alert(self, model_name: str, drift_type: DriftType) -> bool:
        """Check if alert should be suppressed due to cooldown"""
        alert_key = f"{model_name}_{drift_type.value}"
        
        if alert_key not in self.alert_history:
            return False
        
        # Check if last alert was within cooldown period
        last_alert_time = self.alert_history[alert_key][-1]
        time_since_last_alert = (datetime.now() - last_alert_time).total_seconds()
        
        return time_since_last_alert < self.config.alert_cooldown
    
    def get_active_alerts(self, model_name: str = None) -> Dict[str, Any]:
        """Get active (unresolved) alerts"""
        try:
            query = self.session.query(DriftAlerts).filter_by(resolved=False)
            
            if model_name:
                query = query.filter_by(model_name=model_name)
            
            alerts = query.order_by(DriftAlerts.timestamp.desc()).all()
            
            alert_list = []
            for alert in alerts:
                alert_list.append({
                    'id': alert.id,
                    'model_name': alert.model_name,
                    'drift_type': alert.drift_type,
                    'alert_level': alert.alert_level,
                    'message': alert.message,
                    'timestamp': alert.timestamp.isoformat(),
                    'metadata': json.loads(alert.alert_metadata) if alert.alert_metadata else {}
                })
            
            return {
                'success': True,
                'alerts': alert_list,
                'count': len(alert_list),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting active alerts: {e}")
            return {'error': str(e)}

class ModelMonitoringAPI:
    """API wrapper for model monitoring system"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.config = MonitoringConfig()
        self.drift_detector = DriftDetector(self.config)
        self.performance_monitor = PerformanceMonitor(self.config)
        self.health_scorer = ModelHealthScorer(self.config)
        self.alert_manager = AlertManager(self.config)
        
        if model_path:
            self.load_models(model_path)
    
    def set_reference_data(self, model_name: str, reference_data: pd.DataFrame) -> Dict[str, Any]:
        """Set reference data for drift detection"""
        try:
            self.drift_detector.set_reference_data(model_name, reference_data)
            
            return {
                'success': True,
                'model_name': model_name,
                'reference_data_shape': reference_data.shape,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error setting reference data: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def set_baseline_metrics(self, model_name: str, metrics: Dict[str, float]) -> Dict[str, Any]:
        """Set baseline performance metrics"""
        try:
            self.performance_monitor.set_baseline_metrics(model_name, metrics)
            
            return {
                'success': True,
                'model_name': model_name,
                'baseline_metrics': metrics,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error setting baseline metrics: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def monitor_model(self, model_name: str, current_data: pd.DataFrame,
                     y_true: np.ndarray = None, y_pred: np.ndarray = None,
                     y_pred_proba: np.ndarray = None, prediction_time: float = None) -> Dict[str, Any]:
        """Comprehensive model monitoring"""
        try:
            monitoring_results = {
                'model_name': model_name,
                'timestamp': datetime.now().isoformat()
            }
            
            # Detect data drift
            drift_results = self.drift_detector.detect_data_drift(model_name, current_data)
            monitoring_results['data_drift'] = drift_results
            
            # Detect concept drift
            if y_pred is not None:
                concept_drift_results = self.drift_detector.detect_concept_drift(
                    model_name, y_pred, y_true
                )
                monitoring_results['concept_drift'] = concept_drift_results
            
            # Calculate performance metrics
            if y_true is not None and y_pred is not None:
                performance_metrics = self.performance_monitor.calculate_performance_metrics(
                    model_name, y_true, y_pred, y_pred_proba, prediction_time
                )
                monitoring_results['performance_metrics'] = performance_metrics
                
                # Detect performance degradation
                degradation_results = self.performance_monitor.detect_performance_degradation(model_name)
                monitoring_results['performance_degradation'] = degradation_results
            
            # Calculate health score
            health_score = self.health_scorer.calculate_health_score(
                model_name,
                monitoring_results.get('performance_metrics', {}),
                drift_results,
                availability=1.0  # Assume available for now
            )
            monitoring_results['health_score'] = health_score
            
            # Create alerts if necessary
            alerts_created = []
            
            # Data drift alert
            if drift_results.get('drift_detected', False):
                alert = self.alert_manager.create_alert(
                    model_name, DriftType.DATA_DRIFT, AlertLevel.WARNING,
                    f"Data drift detected for model {model_name}",
                    {'drift_score': drift_results.get('drift_score', 0)}
                )
                if not alert.get('suppressed', False):
                    alerts_created.append(alert)
            
            # Performance degradation alert
            if monitoring_results.get('performance_degradation', {}).get('degradation_detected', False):
                alert = self.alert_manager.create_alert(
                    model_name, DriftType.PERFORMANCE_DRIFT, AlertLevel.CRITICAL,
                    f"Performance degradation detected for model {model_name}",
                    monitoring_results['performance_degradation']
                )
                if not alert.get('suppressed', False):
                    alerts_created.append(alert)
            
            monitoring_results['alerts_created'] = alerts_created
            
            return {
                'success': True,
                'monitoring_results': monitoring_results,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error monitoring model: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def get_model_health(self, model_name: str) -> Dict[str, Any]:
        """Get current model health status"""
        try:
            # This would typically get the latest health score from database
            # For now, return a placeholder
            return {
                'success': True,
                'model_name': model_name,
                'health_status': 'healthy',
                'last_checked': datetime.now().isoformat(),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting model health: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def get_active_alerts(self, model_name: str = None) -> Dict[str, Any]:
        """Get active alerts"""
        try:
            result = self.alert_manager.get_active_alerts(model_name)
            return result
            
        except Exception as e:
            logger.error(f"Error getting active alerts: {e}")
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
    # Example data
    np.random.seed(42)
    n_samples = 1000
    
    # Generate reference data
    reference_data = pd.DataFrame({
        'feature1': np.random.normal(0, 1, n_samples),
        'feature2': np.random.normal(0, 1, n_samples),
        'feature3': np.random.normal(0, 1, n_samples)
    })
    
    # Generate current data with some drift
    current_data = pd.DataFrame({
        'feature1': np.random.normal(0.2, 1, n_samples),  # Slight drift
        'feature2': np.random.normal(0, 1, n_samples),
        'feature3': np.random.normal(0, 1.2, n_samples)  # Variance drift
    })
    
    # Generate predictions and labels
    y_true = np.random.randint(0, 2, n_samples)
    y_pred = np.random.randint(0, 2, n_samples)
    y_pred_proba = np.random.random(n_samples)
    
    # Initialize API
    api = ModelMonitoringAPI()
    
    # Set reference data
    api.set_reference_data('test_model', reference_data)
    
    # Set baseline metrics
    baseline_metrics = {
        'accuracy': 0.85,
        'precision': 0.82,
        'recall': 0.88,
        'f1_score': 0.85
    }
    api.set_baseline_metrics('test_model', baseline_metrics)
    
    # Monitor model
    monitoring_result = api.monitor_model(
        'test_model', current_data, y_true, y_pred, y_pred_proba, 0.1
    )
    print("Model Monitoring:", monitoring_result)
    
    # Get active alerts
    alerts = api.get_active_alerts('test_model')
    print("Active Alerts:", alerts)
    
    # Get model health
    health = api.get_model_health('test_model')
    print("Model Health:", health)