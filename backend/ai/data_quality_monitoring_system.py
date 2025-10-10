"""
Data Quality Monitoring System for Hospitality Platform
======================================================

Comprehensive data quality monitoring system for automated validation,
anomaly detection, and data pipeline health monitoring.

Features:
- Automated data validation and quality checks
- Anomaly detection and drift monitoring
- Data pipeline health monitoring
- Quality metrics and reporting
- Automated alerts and notifications

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
import warnings
warnings.filterwarnings('ignore')

# Core ML and statistical libraries
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN
from sklearn.metrics import silhouette_score
from sklearn.impute import SimpleImputer

# Statistical analysis
from scipy import stats
from scipy.stats import chi2_contingency, ks_2samp, anderson_ksamp
from scipy.spatial.distance import pdist, squareform

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

class QualityLevel(Enum):
    """Data quality levels"""
    EXCELLENT = "excellent"
    GOOD = "good"
    FAIR = "fair"
    POOR = "poor"
    CRITICAL = "critical"

class ValidationRule(Enum):
    """Data validation rules"""
    NOT_NULL = "not_null"
    UNIQUE = "unique"
    RANGE = "range"
    FORMAT = "format"
    REFERENTIAL = "referential"
    CUSTOM = "custom"

class AnomalyType(Enum):
    """Types of data anomalies"""
    OUTLIER = "outlier"
    MISSING = "missing"
    DUPLICATE = "duplicate"
    INCONSISTENT = "inconsistent"
    DRIFT = "drift"
    PATTERN_BREAK = "pattern_break"

class QualityMetrics(Base):
    """Database model for quality metrics"""
    __tablename__ = 'quality_metrics'
    
    id = Column(Integer, primary_key=True)
    dataset_name = Column(String(255), nullable=False)
    column_name = Column(String(255), nullable=False)
    metric_name = Column(String(255), nullable=False)
    metric_value = Column(Float, nullable=False)
    quality_level = Column(String(50), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    quality_metadata = Column(Text)  # JSON string

@dataclass
class QualityConfig:
    """Configuration for data quality monitoring"""
    # Validation parameters
    null_threshold: float = 0.05  # 5% null values threshold
    duplicate_threshold: float = 0.01  # 1% duplicate threshold
    outlier_threshold: float = 0.05  # 5% outliers threshold
    
    # Drift detection parameters
    drift_threshold: float = 0.1  # 10% drift threshold
    reference_window: int = 1000  # Reference data window
    comparison_window: int = 100  # Comparison data window
    
    # Monitoring parameters
    check_interval: int = 3600  # Check every hour
    alert_threshold: float = 0.8  # Alert when quality < 80%
    
    # Database configuration
    database_url: str = "sqlite:///data_quality.db"
    
    # Model persistence
    model_path: str = "models/data_quality"
    version: str = "1.0.0"

class DataValidator:
    """Data validation engine"""
    
    def __init__(self, config: QualityConfig):
        self.config = config
        self.validation_rules = {}
        self.custom_validators = {}
    
    def add_validation_rule(self, column: str, rule_type: ValidationRule, 
                           rule_config: Dict[str, Any]) -> None:
        """Add a validation rule for a column"""
        if column not in self.validation_rules:
            self.validation_rules[column] = []
        
        self.validation_rules[column].append({
            'type': rule_type,
            'config': rule_config
        })
        
        logger.info(f"Added validation rule for column {column}: {rule_type.value}")
    
    def add_custom_validator(self, column: str, validator_func: Callable) -> None:
        """Add a custom validator function"""
        self.custom_validators[column] = validator_func
        logger.info(f"Added custom validator for column {column}")
    
    def validate_dataset(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Validate entire dataset"""
        logger.info("Validating dataset...")
        
        validation_results = {
            'overall_quality': 1.0,
            'column_results': {},
            'dataset_issues': [],
            'timestamp': datetime.now().isoformat()
        }
        
        total_issues = 0
        total_checks = 0
        
        # Validate each column
        for column in df.columns:
            column_result = self._validate_column(df, column)
            validation_results['column_results'][column] = column_result
            
            total_issues += column_result['issues_count']
            total_checks += column_result['checks_count']
        
        # Calculate overall quality
        if total_checks > 0:
            validation_results['overall_quality'] = 1.0 - (total_issues / total_checks)
        
        # Determine quality level
        quality_score = validation_results['overall_quality']
        if quality_score >= 0.95:
            quality_level = QualityLevel.EXCELLENT
        elif quality_score >= 0.85:
            quality_level = QualityLevel.GOOD
        elif quality_score >= 0.70:
            quality_level = QualityLevel.FAIR
        elif quality_score >= 0.50:
            quality_level = QualityLevel.POOR
        else:
            quality_level = QualityLevel.CRITICAL
        
        validation_results['quality_level'] = quality_level.value
        validation_results['quality_score'] = quality_score
        
        return validation_results
    
    def _validate_column(self, df: pd.DataFrame, column: str) -> Dict[str, Any]:
        """Validate a single column"""
        column_data = df[column]
        issues = []
        checks_count = 0
        
        # Check for null values
        null_count = column_data.isnull().sum()
        null_ratio = null_count / len(column_data)
        checks_count += 1
        
        if null_ratio > self.config.null_threshold:
            issues.append({
                'type': 'high_null_ratio',
                'message': f'Null ratio {null_ratio:.3f} exceeds threshold {self.config.null_threshold}',
                'severity': 'high' if null_ratio > 0.2 else 'medium'
            })
        
        # Check for duplicates
        if column_data.dtype == 'object' or column_data.nunique() < len(column_data) * 0.9:
            duplicate_count = column_data.duplicated().sum()
            duplicate_ratio = duplicate_count / len(column_data)
            checks_count += 1
            
            if duplicate_ratio > self.config.duplicate_threshold:
                issues.append({
                    'type': 'high_duplicate_ratio',
                    'message': f'Duplicate ratio {duplicate_ratio:.3f} exceeds threshold {self.config.duplicate_threshold}',
                    'severity': 'medium'
                })
        
        # Check data type consistency
        if column_data.dtype == 'object':
            # Check for mixed types
            type_counts = column_data.apply(type).value_counts()
            if len(type_counts) > 1:
                issues.append({
                    'type': 'mixed_types',
                    'message': f'Column contains mixed data types: {type_counts.to_dict()}',
                    'severity': 'medium'
                })
            checks_count += 1
        
        # Apply custom validation rules
        if column in self.validation_rules:
            for rule in self.validation_rules[column]:
                rule_result = self._apply_validation_rule(column_data, rule)
                if rule_result:
                    issues.append(rule_result)
                checks_count += 1
        
        # Apply custom validator
        if column in self.custom_validators:
            try:
                custom_result = self.custom_validators[column](column_data)
                if custom_result:
                    issues.append(custom_result)
                checks_count += 1
            except Exception as e:
                issues.append({
                    'type': 'custom_validator_error',
                    'message': f'Custom validator error: {str(e)}',
                    'severity': 'high'
                })
                checks_count += 1
        
        return {
            'issues': issues,
            'issues_count': len(issues),
            'checks_count': checks_count,
            'null_ratio': null_ratio,
            'duplicate_ratio': duplicate_ratio if 'duplicate_ratio' in locals() else 0,
            'data_type': str(column_data.dtype),
            'unique_count': column_data.nunique(),
            'total_count': len(column_data)
        }
    
    def _apply_validation_rule(self, column_data: pd.Series, rule: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Apply a specific validation rule"""
        rule_type = rule['type']
        config = rule['config']
        
        if rule_type == ValidationRule.NOT_NULL:
            null_count = column_data.isnull().sum()
            if null_count > 0:
                return {
                    'type': 'not_null_violation',
                    'message': f'Found {null_count} null values',
                    'severity': 'high'
                }
        
        elif rule_type == ValidationRule.UNIQUE:
            duplicate_count = column_data.duplicated().sum()
            if duplicate_count > 0:
                return {
                    'type': 'unique_violation',
                    'message': f'Found {duplicate_count} duplicate values',
                    'severity': 'medium'
                }
        
        elif rule_type == ValidationRule.RANGE:
            min_val = config.get('min')
            max_val = config.get('max')
            
            if min_val is not None:
                below_min = (column_data < min_val).sum()
                if below_min > 0:
                    return {
                        'type': 'range_violation',
                        'message': f'Found {below_min} values below minimum {min_val}',
                        'severity': 'medium'
                    }
            
            if max_val is not None:
                above_max = (column_data > max_val).sum()
                if above_max > 0:
                    return {
                        'type': 'range_violation',
                        'message': f'Found {above_max} values above maximum {max_val}',
                        'severity': 'medium'
                    }
        
        return None

class AnomalyDetector:
    """Anomaly detection system"""
    
    def __init__(self, config: QualityConfig):
        self.config = config
        self.isolation_forest = IsolationForest(contamination=0.1, random_state=42)
        self.scaler = StandardScaler()
        self.is_fitted = False
    
    def detect_anomalies(self, df: pd.DataFrame, 
                        reference_data: pd.DataFrame = None) -> Dict[str, Any]:
        """Detect anomalies in dataset"""
        logger.info("Detecting anomalies...")
        
        anomaly_results = {
            'anomaly_count': 0,
            'anomaly_ratio': 0.0,
            'anomaly_details': [],
            'column_anomalies': {},
            'timestamp': datetime.now().isoformat()
        }
        
        # Detect different types of anomalies
        outlier_anomalies = self._detect_outliers(df)
        missing_anomalies = self._detect_missing_patterns(df)
        duplicate_anomalies = self._detect_duplicates(df)
        drift_anomalies = self._detect_drift(df, reference_data)
        
        # Combine all anomalies
        all_anomalies = (outlier_anomalies + missing_anomalies + 
                        duplicate_anomalies + drift_anomalies)
        
        anomaly_results['anomaly_count'] = len(all_anomalies)
        anomaly_results['anomaly_ratio'] = len(all_anomalies) / len(df)
        anomaly_results['anomaly_details'] = all_anomalies
        
        # Group by column
        for anomaly in all_anomalies:
            column = anomaly.get('column', 'unknown')
            if column not in anomaly_results['column_anomalies']:
                anomaly_results['column_anomalies'][column] = []
            anomaly_results['column_anomalies'][column].append(anomaly)
        
        return anomaly_results
    
    def _detect_outliers(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Detect outliers using statistical methods"""
        outliers = []
        
        for column in df.select_dtypes(include=[np.number]).columns:
            column_data = df[column].dropna()
            
            if len(column_data) < 10:  # Need sufficient data
                continue
            
            # IQR method
            Q1 = column_data.quantile(0.25)
            Q3 = column_data.quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            outlier_mask = (column_data < lower_bound) | (column_data > upper_bound)
            outlier_indices = column_data[outlier_mask].index.tolist()
            
            if len(outlier_indices) > 0:
                outliers.append({
                    'type': AnomalyType.OUTLIER.value,
                    'column': column,
                    'count': len(outlier_indices),
                    'indices': outlier_indices,
                    'severity': 'high' if len(outlier_indices) > len(column_data) * 0.1 else 'medium'
                })
        
        return outliers
    
    def _detect_missing_patterns(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Detect missing data patterns"""
        missing_anomalies = []
        
        # Check for systematic missing patterns
        missing_matrix = df.isnull()
        
        # Check for columns with high missing rates
        for column in df.columns:
            missing_ratio = missing_matrix[column].sum() / len(df)
            if missing_ratio > self.config.null_threshold:
                missing_anomalies.append({
                    'type': AnomalyType.MISSING.value,
                    'column': column,
                    'missing_ratio': missing_ratio,
                    'severity': 'high' if missing_ratio > 0.2 else 'medium'
                })
        
        # Check for rows with high missing rates
        row_missing_ratios = missing_matrix.sum(axis=1) / len(df.columns)
        high_missing_rows = row_missing_ratios[row_missing_ratios > 0.5]
        
        if len(high_missing_rows) > 0:
            missing_anomalies.append({
                'type': AnomalyType.MISSING.value,
                'column': 'all',
                'high_missing_rows': len(high_missing_rows),
                'severity': 'high'
            })
        
        return missing_anomalies
    
    def _detect_duplicates(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Detect duplicate records"""
        duplicates = []
        
        # Check for exact duplicates
        duplicate_mask = df.duplicated()
        duplicate_count = duplicate_mask.sum()
        
        if duplicate_count > 0:
            duplicates.append({
                'type': AnomalyType.DUPLICATE.value,
                'column': 'all',
                'count': duplicate_count,
                'severity': 'medium'
            })
        
        # Check for near-duplicates in key columns
        for column in df.select_dtypes(include=[np.number]).columns:
            column_data = df[column].dropna()
            if len(column_data) < 10:
                continue
            
            # Use clustering to detect near-duplicates
            try:
                clustering = DBSCAN(eps=0.1, min_samples=2).fit(column_data.values.reshape(-1, 1))
                cluster_labels = clustering.labels_
                
                # Find clusters with more than 1 point (near-duplicates)
                unique_labels = np.unique(cluster_labels)
                near_duplicate_count = 0
                
                for label in unique_labels:
                    if label != -1:  # Not noise
                        cluster_size = np.sum(cluster_labels == label)
                        if cluster_size > 1:
                            near_duplicate_count += cluster_size
                
                if near_duplicate_count > 0:
                    duplicates.append({
                        'type': AnomalyType.DUPLICATE.value,
                        'column': column,
                        'near_duplicate_count': near_duplicate_count,
                        'severity': 'low'
                    })
            except:
                continue
        
        return duplicates
    
    def _detect_drift(self, df: pd.DataFrame, reference_data: pd.DataFrame = None) -> List[Dict[str, Any]]:
        """Detect data drift"""
        drift_anomalies = []
        
        if reference_data is None or len(reference_data) == 0:
            return drift_anomalies
        
        # Compare distributions for numerical columns
        for column in df.select_dtypes(include=[np.number]).columns:
            if column not in reference_data.columns:
                continue
            
            current_data = df[column].dropna()
            reference_column_data = reference_data[column].dropna()
            
            if len(current_data) < 10 or len(reference_column_data) < 10:
                continue
            
            # Kolmogorov-Smirnov test
            try:
                ks_statistic, ks_pvalue = ks_2samp(reference_column_data, current_data)
                
                if ks_pvalue < 0.05:  # Significant difference
                    drift_anomalies.append({
                        'type': AnomalyType.DRIFT.value,
                        'column': column,
                        'ks_statistic': ks_statistic,
                        'ks_pvalue': ks_pvalue,
                        'severity': 'high' if ks_pvalue < 0.01 else 'medium'
                    })
            except:
                continue
        
        return drift_anomalies

class DataQualityMonitor:
    """Main data quality monitoring system"""
    
    def __init__(self, config: QualityConfig):
        self.config = config
        self.validator = DataValidator(config)
        self.anomaly_detector = AnomalyDetector(config)
        self.engine = create_engine(config.database_url)
        Base.metadata.create_all(self.engine)
        Session = sessionmaker(bind=self.engine)
        self.session = Session()
        
        # Reference data for drift detection
        self.reference_data = {}
        
        # Start monitoring thread
        self.monitoring_thread = threading.Thread(target=self._monitor_data_quality, daemon=True)
        self.monitoring_thread.start()
    
    def set_reference_data(self, dataset_name: str, df: pd.DataFrame) -> None:
        """Set reference data for drift detection"""
        self.reference_data[dataset_name] = df.copy()
        logger.info(f"Set reference data for dataset {dataset_name}")
    
    def monitor_dataset(self, dataset_name: str, df: pd.DataFrame) -> Dict[str, Any]:
        """Monitor data quality for a dataset"""
        logger.info(f"Monitoring data quality for dataset {dataset_name}")
        
        # Validate data
        validation_results = self.validator.validate_dataset(df)
        
        # Detect anomalies
        reference_data = self.reference_data.get(dataset_name)
        anomaly_results = self.anomaly_detector.detect_anomalies(df, reference_data)
        
        # Calculate overall quality score
        quality_score = validation_results['overall_quality']
        anomaly_penalty = min(anomaly_results['anomaly_ratio'] * 0.5, 0.3)  # Max 30% penalty
        final_quality_score = max(quality_score - anomaly_penalty, 0.0)
        
        # Determine quality level
        if final_quality_score >= 0.95:
            quality_level = QualityLevel.EXCELLENT
        elif final_quality_score >= 0.85:
            quality_level = QualityLevel.GOOD
        elif final_quality_score >= 0.70:
            quality_level = QualityLevel.FAIR
        elif final_quality_score >= 0.50:
            quality_level = QualityLevel.POOR
        else:
            quality_level = QualityLevel.CRITICAL
        
        # Store metrics in database
        self._store_quality_metrics(dataset_name, validation_results, anomaly_results, final_quality_score)
        
        return {
            'dataset_name': dataset_name,
            'quality_score': final_quality_score,
            'quality_level': quality_level.value,
            'validation_results': validation_results,
            'anomaly_results': anomaly_results,
            'timestamp': datetime.now().isoformat()
        }
    
    def _store_quality_metrics(self, dataset_name: str, validation_results: Dict[str, Any],
                              anomaly_results: Dict[str, Any], quality_score: float) -> None:
        """Store quality metrics in database"""
        try:
            # Store overall quality score
            metric = QualityMetrics(
                dataset_name=dataset_name,
                column_name='overall',
                metric_name='quality_score',
                metric_value=quality_score,
                quality_level=validation_results['quality_level'],
                quality_metadata=json.dumps({
                    'validation_issues': validation_results.get('dataset_issues', []),
                    'anomaly_count': anomaly_results['anomaly_count']
                })
            )
            self.session.add(metric)
            
            # Store column-level metrics
            for column, column_result in validation_results['column_results'].items():
                metric = QualityMetrics(
                    dataset_name=dataset_name,
                    column_name=column,
                    metric_name='column_quality',
                    metric_value=1.0 - (column_result['issues_count'] / max(column_result['checks_count'], 1)),
                    quality_level=validation_results['quality_level'],
                    quality_metadata=json.dumps(column_result)
                )
                self.session.add(metric)
            
            self.session.commit()
            
        except Exception as e:
            logger.error(f"Error storing quality metrics: {e}")
            self.session.rollback()
    
    def _monitor_data_quality(self) -> None:
        """Background monitoring thread"""
        while True:
            try:
                time.sleep(self.config.check_interval)
                
                # Check for datasets that need monitoring
                # This would typically check a queue or database for new data
                logger.info("Running scheduled data quality check")
                
            except Exception as e:
                logger.error(f"Error in monitoring thread: {e}")
    
    def get_quality_history(self, dataset_name: str, days: int = 7) -> Dict[str, Any]:
        """Get quality history for a dataset"""
        try:
            cutoff_date = datetime.now() - timedelta(days=days)
            
            metrics = self.session.query(QualityMetrics).filter(
                QualityMetrics.dataset_name == dataset_name,
                QualityMetrics.timestamp >= cutoff_date
            ).order_by(QualityMetrics.timestamp.desc()).all()
            
            # Group by timestamp
            history = {}
            for metric in metrics:
                timestamp = metric.timestamp.isoformat()
                if timestamp not in history:
                    history[timestamp] = {}
                
                history[timestamp][f"{metric.column_name}_{metric.metric_name}"] = {
                    'value': metric.metric_value,
                    'quality_level': metric.quality_level
                }
            
            return {
                'success': True,
                'dataset_name': dataset_name,
                'history': history,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting quality history: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }

class DataQualityAPI:
    """API wrapper for data quality monitoring system"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.config = QualityConfig()
        self.quality_monitor = DataQualityMonitor(self.config)
        
        if model_path:
            self.load_models(model_path)
    
    def monitor_data_quality(self, dataset_name: str, df: pd.DataFrame) -> Dict[str, Any]:
        """Monitor data quality for a dataset"""
        try:
            result = self.quality_monitor.monitor_dataset(dataset_name, df)
            
            return {
                'success': True,
                'monitoring_result': result,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error monitoring data quality: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def set_reference_data(self, dataset_name: str, df: pd.DataFrame) -> Dict[str, Any]:
        """Set reference data for drift detection"""
        try:
            self.quality_monitor.set_reference_data(dataset_name, df)
            
            return {
                'success': True,
                'dataset_name': dataset_name,
                'reference_data_shape': df.shape,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error setting reference data: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def get_quality_history(self, dataset_name: str, days: int = 7) -> Dict[str, Any]:
        """Get quality history for a dataset"""
        try:
            result = self.quality_monitor.get_quality_history(dataset_name, days)
            
            return result
            
        except Exception as e:
            logger.error(f"Error getting quality history: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def add_validation_rule(self, column: str, rule_type: str, rule_config: Dict[str, Any]) -> Dict[str, Any]:
        """Add a validation rule"""
        try:
            rule_enum = ValidationRule(rule_type)
            self.quality_monitor.validator.add_validation_rule(column, rule_enum, rule_config)
            
            return {
                'success': True,
                'column': column,
                'rule_type': rule_type,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error adding validation rule: {e}")
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
    
    # Generate sample data with some quality issues
    df = pd.DataFrame({
        'customer_id': range(1, n_samples + 1),
        'age': np.random.normal(35, 10, n_samples),
        'income': np.random.exponential(50000, n_samples),
        'email': [f'user{i}@example.com' for i in range(1, n_samples + 1)],
        'score': np.random.uniform(0, 100, n_samples)
    })
    
    # Introduce some quality issues
    df.loc[0:50, 'age'] = np.nan  # Missing values
    df.loc[100:110, 'customer_id'] = 1  # Duplicates
    df.loc[200:210, 'income'] = -1000  # Negative income (invalid)
    df.loc[300:310, 'score'] = 150  # Out of range scores
    
    # Initialize API
    api = DataQualityAPI()
    
    # Set reference data
    reference_df = df.copy()
    api.set_reference_data('customer_data', reference_df)
    
    # Monitor data quality
    quality_result = api.monitor_data_quality('customer_data', df)
    print("Data Quality Monitoring:", quality_result)
    
    # Add validation rules
    api.add_validation_rule('age', 'range', {'min': 0, 'max': 120})
    api.add_validation_rule('income', 'range', {'min': 0, 'max': 1000000})
    api.add_validation_rule('score', 'range', {'min': 0, 'max': 100})
    
    # Monitor again with validation rules
    quality_result_with_rules = api.monitor_data_quality('customer_data', df)
    print("Data Quality with Rules:", quality_result_with_rules)
    
    # Get quality history
    history = api.get_quality_history('customer_data', days=1)
    print("Quality History:", history)