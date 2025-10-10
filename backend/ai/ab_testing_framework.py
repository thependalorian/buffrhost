"""
A/B Testing Framework for Hospitality Platform
=============================================

Comprehensive A/B testing framework for statistical testing, experiment management,
and results analysis for hospitality businesses.

Features:
- Statistical testing and significance analysis
- Experiment management and tracking
- Multi-variant testing support
- Bayesian and frequentist approaches
- Results analysis and recommendations

Author: Buffr AI Team
Date: 2024
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional, Any, Union
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
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, r2_score, mean_squared_error

# Statistical analysis
from scipy import stats
from scipy.stats import chi2_contingency, ttest_ind, mannwhitneyu
from scipy.stats import beta, norm, t
import statsmodels.api as sm
from statsmodels.stats.power import ttest_power
from statsmodels.stats.proportion import proportions_ztest, proportion_confint

# Bayesian analysis
try:
    import pymc3 as pm
    import theano.tensor as tt
    BAYESIAN_AVAILABLE = True
except ImportError:
    BAYESIAN_AVAILABLE = False
    logging.warning("PyMC3 not available. Bayesian analysis will be disabled.")

# Database and storage
import sqlite3
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base = declarative_base()

class TestStatus(Enum):
    """A/B test status"""
    DRAFT = "draft"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class TestType(Enum):
    """Types of A/B tests"""
    CONVERSION = "conversion"
    REVENUE = "revenue"
    ENGAGEMENT = "engagement"
    RETENTION = "retention"
    CUSTOM = "custom"

class StatisticalMethod(Enum):
    """Statistical testing methods"""
    FREQUENTIST = "frequentist"
    BAYESIAN = "bayesian"
    SEQUENTIAL = "sequential"

class Experiment(Base):
    """Database model for A/B test experiments"""
    __tablename__ = 'experiments'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    test_type = Column(String(50), nullable=False)
    status = Column(String(50), default='draft')
    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime)
    ended_at = Column(DateTime)
    target_metric = Column(String(255), nullable=False)
    success_criteria = Column(Text)  # JSON string
    configuration = Column(Text)  # JSON string
    results = Column(Text)  # JSON string

class ExperimentVariant(Base):
    """Database model for experiment variants"""
    __tablename__ = 'experiment_variants'
    
    id = Column(Integer, primary_key=True)
    experiment_id = Column(Integer, nullable=False)
    variant_name = Column(String(255), nullable=False)
    variant_config = Column(Text)  # JSON string
    traffic_allocation = Column(Float, default=0.5)
    is_control = Column(Boolean, default=False)

class ExperimentData(Base):
    """Database model for experiment data"""
    __tablename__ = 'experiment_data'
    
    id = Column(Integer, primary_key=True)
    experiment_id = Column(Integer, nullable=False)
    variant_id = Column(Integer, nullable=False)
    user_id = Column(String(255), nullable=False)
    metric_value = Column(Float)
    conversion = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    experiment_metadata = Column(Text)  # JSON string

@dataclass
class ABTestConfig:
    """Configuration for A/B testing framework"""
    # Statistical parameters
    significance_level: float = 0.05
    power: float = 0.8
    minimum_effect_size: float = 0.1
    max_duration_days: int = 30
    
    # Sample size parameters
    baseline_conversion_rate: float = 0.1
    minimum_sample_size: int = 1000
    maximum_sample_size: int = 100000
    
    # Traffic allocation
    default_traffic_split: float = 0.5
    max_variants: int = 5
    
    # Database configuration
    database_url: str = "sqlite:///ab_testing.db"
    
    # Model persistence
    model_path: str = "models/ab_testing"
    version: str = "1.0.0"

class SampleSizeCalculator:
    """Sample size calculation for A/B tests"""
    
    def __init__(self, config: ABTestConfig):
        self.config = config
    
    def calculate_sample_size(self, baseline_rate: float, effect_size: float,
                            power: float = None, alpha: float = None) -> Dict[str, Any]:
        """Calculate required sample size for A/B test"""
        if power is None:
            power = self.config.power
        if alpha is None:
            alpha = self.config.significance_level
        
        logger.info(f"Calculating sample size for baseline rate {baseline_rate}, effect size {effect_size}")
        
        try:
            # Calculate effect size in absolute terms
            absolute_effect = baseline_rate * effect_size
            new_rate = baseline_rate + absolute_effect
            
            # Ensure rates are valid
            new_rate = max(0.01, min(0.99, new_rate))
            
            # Calculate sample size using normal approximation
            z_alpha = norm.ppf(1 - alpha/2)
            z_beta = norm.ppf(power)
            
            p_pooled = (baseline_rate + new_rate) / 2
            
            sample_size = (z_alpha * np.sqrt(2 * p_pooled * (1 - p_pooled)) + 
                          z_beta * np.sqrt(baseline_rate * (1 - baseline_rate) + 
                                         new_rate * (1 - new_rate)))**2 / (absolute_effect**2)
            
            # Round up to nearest integer
            sample_size = int(np.ceil(sample_size))
            
            # Apply minimum and maximum constraints
            sample_size = max(self.config.minimum_sample_size, 
                            min(sample_size, self.config.maximum_sample_size))
            
            return {
                'sample_size_per_variant': sample_size,
                'total_sample_size': sample_size * 2,
                'baseline_rate': baseline_rate,
                'expected_new_rate': new_rate,
                'effect_size': effect_size,
                'power': power,
                'alpha': alpha,
                'minimum_detectable_effect': absolute_effect
            }
            
        except Exception as e:
            logger.error(f"Error calculating sample size: {e}")
            return {'error': str(e)}
    
    def calculate_power(self, baseline_rate: float, effect_size: float,
                       sample_size: int, alpha: float = None) -> Dict[str, Any]:
        """Calculate statistical power for given sample size"""
        if alpha is None:
            alpha = self.config.significance_level
        
        try:
            absolute_effect = baseline_rate * effect_size
            new_rate = baseline_rate + absolute_effect
            new_rate = max(0.01, min(0.99, new_rate))
            
            # Calculate power
            z_alpha = norm.ppf(1 - alpha/2)
            p_pooled = (baseline_rate + new_rate) / 2
            
            z_beta = (np.sqrt(sample_size) * absolute_effect - 
                     z_alpha * np.sqrt(2 * p_pooled * (1 - p_pooled))) / \
                    np.sqrt(baseline_rate * (1 - baseline_rate) + new_rate * (1 - new_rate))
            
            power = norm.cdf(z_beta)
            
            return {
                'power': power,
                'baseline_rate': baseline_rate,
                'expected_new_rate': new_rate,
                'effect_size': effect_size,
                'sample_size': sample_size,
                'alpha': alpha
            }
            
        except Exception as e:
            logger.error(f"Error calculating power: {e}")
            return {'error': str(e)}

class StatisticalAnalyzer:
    """Statistical analysis for A/B test results"""
    
    def __init__(self, config: ABTestConfig):
        self.config = config
    
    def analyze_conversion_test(self, control_data: List[bool], 
                              treatment_data: List[bool]) -> Dict[str, Any]:
        """Analyze conversion rate A/B test"""
        logger.info("Analyzing conversion rate A/B test")
        
        try:
            # Calculate conversion rates
            control_conversions = sum(control_data)
            control_total = len(control_data)
            control_rate = control_conversions / control_total if control_total > 0 else 0
            
            treatment_conversions = sum(treatment_data)
            treatment_total = len(treatment_data)
            treatment_rate = treatment_conversions / treatment_total if treatment_total > 0 else 0
            
            # Perform z-test for proportions
            z_stat, p_value = proportions_ztest(
                [treatment_conversions, control_conversions],
                [treatment_total, control_total]
            )
            
            # Calculate confidence intervals
            control_ci = proportion_confint(control_conversions, control_total, 
                                         alpha=self.config.significance_level)
            treatment_ci = proportion_confint(treatment_conversions, treatment_total,
                                            alpha=self.config.significance_level)
            
            # Calculate lift
            lift = (treatment_rate - control_rate) / control_rate if control_rate > 0 else 0
            
            # Determine significance
            is_significant = p_value < self.config.significance_level
            
            return {
                'control_rate': control_rate,
                'treatment_rate': treatment_rate,
                'lift': lift,
                'lift_percentage': lift * 100,
                'p_value': p_value,
                'is_significant': is_significant,
                'z_statistic': z_stat,
                'control_ci': control_ci,
                'treatment_ci': treatment_ci,
                'control_conversions': control_conversions,
                'control_total': control_total,
                'treatment_conversions': treatment_conversions,
                'treatment_total': treatment_total
            }
            
        except Exception as e:
            logger.error(f"Error analyzing conversion test: {e}")
            return {'error': str(e)}
    
    def analyze_revenue_test(self, control_data: List[float], 
                           treatment_data: List[float]) -> Dict[str, Any]:
        """Analyze revenue A/B test"""
        logger.info("Analyzing revenue A/B test")
        
        try:
            # Calculate means
            control_mean = np.mean(control_data)
            treatment_mean = np.mean(treatment_data)
            
            # Perform t-test
            t_stat, p_value = ttest_ind(treatment_data, control_data)
            
            # Calculate confidence intervals
            control_ci = self._calculate_confidence_interval(control_data)
            treatment_ci = self._calculate_confidence_interval(treatment_data)
            
            # Calculate lift
            lift = (treatment_mean - control_mean) / control_mean if control_mean > 0 else 0
            
            # Determine significance
            is_significant = p_value < self.config.significance_level
            
            return {
                'control_mean': control_mean,
                'treatment_mean': treatment_mean,
                'lift': lift,
                'lift_percentage': lift * 100,
                'p_value': p_value,
                'is_significant': is_significant,
                't_statistic': t_stat,
                'control_ci': control_ci,
                'treatment_ci': treatment_ci,
                'control_std': np.std(control_data),
                'treatment_std': np.std(treatment_data)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing revenue test: {e}")
            return {'error': str(e)}
    
    def _calculate_confidence_interval(self, data: List[float], 
                                     confidence: float = None) -> Tuple[float, float]:
        """Calculate confidence interval for data"""
        if confidence is None:
            confidence = 1 - self.config.significance_level
        
        mean = np.mean(data)
        std = np.std(data, ddof=1)
        n = len(data)
        
        # Calculate t-value
        t_val = t.ppf(1 - (1 - confidence) / 2, n - 1)
        
        # Calculate margin of error
        margin = t_val * (std / np.sqrt(n))
        
        return (mean - margin, mean + margin)
    
    def analyze_multiple_variants(self, variant_data: Dict[str, List[float]]) -> Dict[str, Any]:
        """Analyze A/B/C/D test with multiple variants"""
        logger.info("Analyzing multiple variant test")
        
        try:
            results = {}
            variant_names = list(variant_data.keys())
            
            # Calculate basic statistics for each variant
            for name, data in variant_data.items():
                results[name] = {
                    'mean': np.mean(data),
                    'std': np.std(data),
                    'count': len(data),
                    'ci': self._calculate_confidence_interval(data)
                }
            
            # Perform ANOVA if we have multiple variants
            if len(variant_names) > 2:
                f_stat, p_value = stats.f_oneway(*variant_data.values())
                results['anova'] = {
                    'f_statistic': f_stat,
                    'p_value': p_value,
                    'is_significant': p_value < self.config.significance_level
                }
            
            # Pairwise comparisons
            pairwise_results = {}
            for i, name1 in enumerate(variant_names):
                for name2 in variant_names[i+1:]:
                    data1 = variant_data[name1]
                    data2 = variant_data[name2]
                    
                    t_stat, p_value = ttest_ind(data1, data2)
                    pairwise_results[f"{name1}_vs_{name2}"] = {
                        't_statistic': t_stat,
                        'p_value': p_value,
                        'is_significant': p_value < self.config.significance_level
                    }
            
            results['pairwise_comparisons'] = pairwise_results
            
            return results
            
        except Exception as e:
            logger.error(f"Error analyzing multiple variants: {e}")
            return {'error': str(e)}

class BayesianAnalyzer:
    """Bayesian analysis for A/B tests"""
    
    def __init__(self, config: ABTestConfig):
        self.config = config
    
    def analyze_bayesian_conversion(self, control_conversions: int, control_total: int,
                                  treatment_conversions: int, treatment_total: int) -> Dict[str, Any]:
        """Perform Bayesian analysis for conversion test"""
        if not BAYESIAN_AVAILABLE:
            return {'error': 'Bayesian analysis not available - PyMC3 not installed'}
        
        logger.info("Performing Bayesian conversion analysis")
        
        try:
            # Use Beta-Binomial model
            with pm.Model() as model:
                # Priors (uniform Beta(1,1) priors)
                control_p = pm.Beta('control_p', alpha=1, beta=1)
                treatment_p = pm.Beta('treatment_p', alpha=1, beta=1)
                
                # Likelihood
                control_obs = pm.Binomial('control_obs', n=control_total, p=control_p, 
                                        observed=control_conversions)
                treatment_obs = pm.Binomial('treatment_obs', n=treatment_total, p=treatment_p,
                                          observed=treatment_conversions)
                
                # Difference
                diff = pm.Deterministic('diff', treatment_p - control_p)
                
                # Sample from posterior
                trace = pm.sample(2000, tune=1000, cores=1)
            
            # Calculate statistics
            control_posterior = trace['control_p']
            treatment_posterior = trace['treatment_p']
            diff_posterior = trace['diff']
            
            # Probability that treatment is better
            prob_treatment_better = np.mean(diff_posterior > 0)
            
            # Credible intervals
            control_ci = np.percentile(control_posterior, [2.5, 97.5])
            treatment_ci = np.percentile(treatment_posterior, [2.5, 97.5])
            diff_ci = np.percentile(diff_posterior, [2.5, 97.5])
            
            return {
                'control_posterior_mean': np.mean(control_posterior),
                'treatment_posterior_mean': np.mean(treatment_posterior),
                'diff_posterior_mean': np.mean(diff_posterior),
                'prob_treatment_better': prob_treatment_better,
                'control_ci': control_ci.tolist(),
                'treatment_ci': treatment_ci.tolist(),
                'diff_ci': diff_ci.tolist(),
                'lift': np.mean(diff_posterior) / np.mean(control_posterior) if np.mean(control_posterior) > 0 else 0
            }
            
        except Exception as e:
            logger.error(f"Error in Bayesian analysis: {e}")
            return {'error': str(e)}

class ExperimentManager:
    """A/B test experiment management system"""
    
    def __init__(self, config: ABTestConfig):
        self.config = config
        self.engine = create_engine(config.database_url)
        Base.metadata.create_all(self.engine)
        Session = sessionmaker(bind=self.engine)
        self.session = Session()
        
        self.sample_calculator = SampleSizeCalculator(config)
        self.statistical_analyzer = StatisticalAnalyzer(config)
        self.bayesian_analyzer = BayesianAnalyzer(config)
    
    def create_experiment(self, name: str, description: str, test_type: TestType,
                         target_metric: str, variants: List[Dict[str, Any]],
                         success_criteria: Dict[str, Any] = None) -> Dict[str, Any]:
        """Create a new A/B test experiment"""
        logger.info(f"Creating experiment: {name}")
        
        try:
            # Create experiment record
            experiment = Experiment(
                name=name,
                description=description,
                test_type=test_type.value,
                target_metric=target_metric,
                success_criteria=json.dumps(success_criteria or {}),
                configuration=json.dumps({
                    'variants': variants,
                    'created_at': datetime.now().isoformat()
                })
            )
            
            self.session.add(experiment)
            self.session.flush()  # Get the ID
            
            # Create variant records
            for i, variant in enumerate(variants):
                is_control = variant.get('is_control', i == 0)
                traffic_allocation = variant.get('traffic_allocation', 1.0 / len(variants))
                
                experiment_variant = ExperimentVariant(
                    experiment_id=experiment.id,
                    variant_name=variant['name'],
                    variant_config=json.dumps(variant),
                    traffic_allocation=traffic_allocation,
                    is_control=is_control
                )
                
                self.session.add(experiment_variant)
            
            self.session.commit()
            
            return {
                'success': True,
                'experiment_id': experiment.id,
                'name': name,
                'status': TestStatus.DRAFT.value,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error creating experiment: {e}")
            self.session.rollback()
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def start_experiment(self, experiment_id: int) -> Dict[str, Any]:
        """Start an A/B test experiment"""
        logger.info(f"Starting experiment: {experiment_id}")
        
        try:
            experiment = self.session.query(Experiment).filter_by(id=experiment_id).first()
            if not experiment:
                return {'success': False, 'error': 'Experiment not found'}
            
            if experiment.status != TestStatus.DRAFT.value:
                return {'success': False, 'error': 'Experiment is not in draft status'}
            
            # Update experiment status
            experiment.status = TestStatus.RUNNING.value
            experiment.started_at = datetime.now()
            
            self.session.commit()
            
            return {
                'success': True,
                'experiment_id': experiment_id,
                'status': TestStatus.RUNNING.value,
                'started_at': experiment.started_at.isoformat(),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error starting experiment: {e}")
            self.session.rollback()
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def add_experiment_data(self, experiment_id: int, variant_id: int, 
                          user_id: str, metric_value: float = None,
                          conversion: bool = None, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Add data point to experiment"""
        try:
            experiment_data = ExperimentData(
                experiment_id=experiment_id,
                variant_id=variant_id,
                user_id=user_id,
                metric_value=metric_value,
                conversion=conversion,
                experiment_metadata=json.dumps(metadata or {})
            )
            
            self.session.add(experiment_data)
            self.session.commit()
            
            return {
                'success': True,
                'experiment_id': experiment_id,
                'variant_id': variant_id,
                'user_id': user_id,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error adding experiment data: {e}")
            self.session.rollback()
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def analyze_experiment(self, experiment_id: int, method: StatisticalMethod = StatisticalMethod.FREQUENTIST) -> Dict[str, Any]:
        """Analyze experiment results"""
        logger.info(f"Analyzing experiment {experiment_id} using {method.value} method")
        
        try:
            # Get experiment data
            experiment = self.session.query(Experiment).filter_by(id=experiment_id).first()
            if not experiment:
                return {'success': False, 'error': 'Experiment not found'}
            
            # Get variants
            variants = self.session.query(ExperimentVariant).filter_by(experiment_id=experiment_id).all()
            
            # Get data for each variant
            variant_data = {}
            for variant in variants:
                data_query = self.session.query(ExperimentData).filter_by(
                    experiment_id=experiment_id,
                    variant_id=variant.id
                )
                
                if experiment.test_type == TestType.CONVERSION.value:
                    # Get conversion data
                    conversions = [row.conversion for row in data_query if row.conversion is not None]
                    variant_data[variant.variant_name] = conversions
                else:
                    # Get metric data
                    metric_values = [row.metric_value for row in data_query if row.metric_value is not None]
                    variant_data[variant.variant_name] = metric_values
            
            # Perform analysis based on method
            if method == StatisticalMethod.FREQUENTIST:
                if experiment.test_type == TestType.CONVERSION.value:
                    # Find control and treatment
                    control_variant = next((v for v in variants if v.is_control), variants[0])
                    treatment_variants = [v for v in variants if not v.is_control]
                    
                    if treatment_variants:
                        treatment_variant = treatment_variants[0]
                        analysis_result = self.statistical_analyzer.analyze_conversion_test(
                            variant_data[control_variant.variant_name],
                            variant_data[treatment_variant.variant_name]
                        )
                    else:
                        analysis_result = {'error': 'No treatment variant found'}
                else:
                    # Revenue or other metric analysis
                    if len(variant_data) == 2:
                        variant_names = list(variant_data.keys())
                        analysis_result = self.statistical_analyzer.analyze_revenue_test(
                            variant_data[variant_names[0]],
                            variant_data[variant_names[1]]
                        )
                    else:
                        analysis_result = self.statistical_analyzer.analyze_multiple_variants(variant_data)
            
            elif method == StatisticalMethod.BAYESIAN:
                if experiment.test_type == TestType.CONVERSION.value:
                    # Find control and treatment
                    control_variant = next((v for v in variants if v.is_control), variants[0])
                    treatment_variants = [v for v in variants if not v.is_control]
                    
                    if treatment_variants:
                        treatment_variant = treatment_variants[0]
                        control_data = variant_data[control_variant.variant_name]
                        treatment_data = variant_data[treatment_variant.variant_name]
                        
                        analysis_result = self.bayesian_analyzer.analyze_bayesian_conversion(
                            sum(control_data), len(control_data),
                            sum(treatment_data), len(treatment_data)
                        )
                    else:
                        analysis_result = {'error': 'No treatment variant found'}
                else:
                    analysis_result = {'error': 'Bayesian analysis only supported for conversion tests'}
            
            # Update experiment with results
            experiment.results = json.dumps(analysis_result)
            self.session.commit()
            
            return {
                'success': True,
                'experiment_id': experiment_id,
                'analysis_method': method.value,
                'results': analysis_result,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error analyzing experiment: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }

class ABTestingAPI:
    """API wrapper for A/B testing framework"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.config = ABTestConfig()
        self.experiment_manager = ExperimentManager(self.config)
        
        if model_path:
            self.load_models(model_path)
    
    def create_experiment(self, name: str, description: str, test_type: str,
                         target_metric: str, variants: List[Dict[str, Any]],
                         success_criteria: Dict[str, Any] = None) -> Dict[str, Any]:
        """Create a new A/B test experiment"""
        try:
            test_type_enum = TestType(test_type)
            result = self.experiment_manager.create_experiment(
                name, description, test_type_enum, target_metric, variants, success_criteria
            )
            
            return result
            
        except Exception as e:
            logger.error(f"Error creating experiment: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def start_experiment(self, experiment_id: int) -> Dict[str, Any]:
        """Start an A/B test experiment"""
        try:
            result = self.experiment_manager.start_experiment(experiment_id)
            return result
            
        except Exception as e:
            logger.error(f"Error starting experiment: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def add_data_point(self, experiment_id: int, variant_id: int, user_id: str,
                      metric_value: float = None, conversion: bool = None,
                      metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Add data point to experiment"""
        try:
            result = self.experiment_manager.add_experiment_data(
                experiment_id, variant_id, user_id, metric_value, conversion, metadata
            )
            return result
            
        except Exception as e:
            logger.error(f"Error adding data point: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def analyze_experiment(self, experiment_id: int, method: str = 'frequentist') -> Dict[str, Any]:
        """Analyze experiment results"""
        try:
            method_enum = StatisticalMethod(method)
            result = self.experiment_manager.analyze_experiment(experiment_id, method_enum)
            return result
            
        except Exception as e:
            logger.error(f"Error analyzing experiment: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def calculate_sample_size(self, baseline_rate: float, effect_size: float,
                            power: float = None, alpha: float = None) -> Dict[str, Any]:
        """Calculate required sample size"""
        try:
            result = self.experiment_manager.sample_calculator.calculate_sample_size(
                baseline_rate, effect_size, power, alpha
            )
            
            return {
                'success': True,
                'sample_size_calculation': result,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error calculating sample size: {e}")
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
    # Example A/B test data
    np.random.seed(42)
    
    # Generate sample conversion data
    control_conversions = np.random.binomial(1, 0.1, 1000)
    treatment_conversions = np.random.binomial(1, 0.12, 1000)
    
    # Initialize API
    api = ABTestingAPI()
    
    # Test sample size calculation
    sample_size_result = api.calculate_sample_size(baseline_rate=0.1, effect_size=0.2)
    print("Sample Size Calculation:", sample_size_result)
    
    # Test experiment creation
    variants = [
        {'name': 'control', 'is_control': True, 'description': 'Original version'},
        {'name': 'treatment', 'is_control': False, 'description': 'New version'}
    ]
    
    experiment_result = api.create_experiment(
        name='Test Experiment',
        description='Testing new feature',
        test_type='conversion',
        target_metric='conversion_rate',
        variants=variants
    )
    print("Experiment Creation:", experiment_result)
    
    if experiment_result['success']:
        experiment_id = experiment_result['experiment_id']
        
        # Start experiment
        start_result = api.start_experiment(experiment_id)
        print("Experiment Start:", start_result)
        
        # Add sample data
        for i, conversion in enumerate(control_conversions):
            api.add_data_point(experiment_id, 1, f'user_{i}', conversion=bool(conversion))
        
        for i, conversion in enumerate(treatment_conversions):
            api.add_data_point(experiment_id, 2, f'user_{i+1000}', conversion=bool(conversion))
        
        # Analyze experiment
        analysis_result = api.analyze_experiment(experiment_id, 'frequentist')
        print("Experiment Analysis:", analysis_result)