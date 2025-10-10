"""
Model Interpretability System for Hospitality Platform
=====================================================

Advanced model interpretability system using SHAP, LIME, and explainable AI
techniques for providing business insights and model transparency.

Features:
- SHAP (SHapley Additive exPlanations) for global and local explanations
- LIME (Local Interpretable Model-agnostic Explanations) for local explanations
- Feature importance analysis and visualization
- Model decision boundary analysis
- Business impact interpretation

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
import warnings
warnings.filterwarnings('ignore')

# Core ML and statistical libraries
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, r2_score, mean_squared_error
from sklearn.inspection import permutation_importance, partial_dependence
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor

# SHAP for model interpretability
try:
    import shap
    SHAP_AVAILABLE = True
except ImportError:
    SHAP_AVAILABLE = False
    logging.warning("SHAP library not available. SHAP explanations will be disabled.")

# LIME for local explanations
try:
    import lime
    import lime.lime_tabular
    LIME_AVAILABLE = True
except ImportError:
    LIME_AVAILABLE = False
    logging.warning("LIME library not available. LIME explanations will be disabled.")

# Statistical analysis
from scipy import stats
from scipy.stats import chi2_contingency

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ExplanationType(Enum):
    """Types of model explanations"""
    GLOBAL = "global"
    LOCAL = "local"
    FEATURE_IMPORTANCE = "feature_importance"
    PARTIAL_DEPENDENCE = "partial_dependence"
    INTERACTION = "interaction"

class ModelType(Enum):
    """Types of ML models"""
    CLASSIFICATION = "classification"
    REGRESSION = "regression"
    TREE_BASED = "tree_based"
    LINEAR = "linear"

@dataclass
class InterpretabilityConfig:
    """Configuration for model interpretability system"""
    # Explanation parameters
    max_features_explain: int = 20
    sample_size: int = 1000
    random_state: int = 42
    
    # SHAP parameters
    shap_sample_size: int = 100
    shap_background_size: int = 50
    
    # LIME parameters
    lime_num_features: int = 10
    lime_num_samples: int = 5000
    
    # Visualization parameters
    plot_width: int = 10
    plot_height: int = 6
    
    # Model persistence
    model_path: str = "models/interpretability"
    version: str = "1.0.0"

class SHAPExplainer:
    """SHAP-based model explanations"""
    
    def __init__(self, config: InterpretabilityConfig):
        self.config = config
        self.explainers = {}
        self.shap_values = {}
        self.is_initialized = False
    
    def initialize_explainer(self, model: Any, X: np.ndarray, 
                           model_type: ModelType) -> bool:
        """Initialize SHAP explainer for a model"""
        if not SHAP_AVAILABLE:
            logger.warning("SHAP not available, skipping explainer initialization")
            return False
        
        logger.info(f"Initializing SHAP explainer for {model_type.value} model...")
        
        try:
            if model_type == ModelType.TREE_BASED:
                # Tree-based models use TreeExplainer
                explainer = shap.TreeExplainer(model)
            elif model_type == ModelType.LINEAR:
                # Linear models use LinearExplainer
                explainer = shap.LinearExplainer(model, X)
            else:
                # Other models use KernelExplainer
                background = shap.sample(X, self.config.shap_background_size)
                explainer = shap.KernelExplainer(model.predict, background)
            
            self.explainers[model_type.value] = explainer
            self.is_initialized = True
            
            logger.info("SHAP explainer initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error initializing SHAP explainer: {e}")
            return False
    
    def explain_global(self, model: Any, X: np.ndarray, 
                      feature_names: List[str], model_type: ModelType) -> Dict[str, Any]:
        """Generate global explanations using SHAP"""
        if not self.is_initialized:
            if not self.initialize_explainer(model, X, model_type):
                return {'error': 'SHAP explainer not available'}
        
        logger.info("Generating global SHAP explanations...")
        
        try:
            explainer = self.explainers[model_type.value]
            
            # Sample data for explanation
            X_sample = shap.sample(X, min(self.config.shap_sample_size, len(X)))
            
            # Calculate SHAP values
            shap_values = explainer.shap_values(X_sample)
            
            # Handle multi-class case
            if isinstance(shap_values, list):
                shap_values = np.array(shap_values)
                if len(shap_values.shape) == 3:  # Multi-class
                    shap_values = shap_values[0]  # Use first class
            
            # Calculate feature importance
            feature_importance = np.abs(shap_values).mean(axis=0)
            feature_importance_std = np.abs(shap_values).std(axis=0)
            
            # Create feature importance ranking
            importance_ranking = []
            for i, (importance, std) in enumerate(zip(feature_importance, feature_importance_std)):
                importance_ranking.append({
                    'feature': feature_names[i] if i < len(feature_names) else f'feature_{i}',
                    'importance': float(importance),
                    'std': float(std),
                    'rank': 0  # Will be set below
                })
            
            # Sort by importance and assign ranks
            importance_ranking.sort(key=lambda x: x['importance'], reverse=True)
            for i, item in enumerate(importance_ranking):
                item['rank'] = i + 1
            
            # Calculate summary statistics
            summary_stats = {
                'total_features': len(feature_importance),
                'mean_importance': float(np.mean(feature_importance)),
                'max_importance': float(np.max(feature_importance)),
                'min_importance': float(np.min(feature_importance)),
                'importance_std': float(np.std(feature_importance))
            }
            
            return {
                'explanation_type': 'global_shap',
                'feature_importance': importance_ranking,
                'summary_statistics': summary_stats,
                'shap_values': shap_values.tolist(),
                'feature_names': feature_names
            }
            
        except Exception as e:
            logger.error(f"Error generating global SHAP explanations: {e}")
            return {'error': str(e)}
    
    def explain_local(self, model: Any, X: np.ndarray, 
                     feature_names: List[str], model_type: ModelType,
                     instance_idx: int = 0) -> Dict[str, Any]:
        """Generate local explanations using SHAP"""
        if not self.is_initialized:
            if not self.initialize_explainer(model, X, model_type):
                return {'error': 'SHAP explainer not available'}
        
        logger.info(f"Generating local SHAP explanations for instance {instance_idx}...")
        
        try:
            explainer = self.explainers[model_type.value]
            
            # Get the specific instance
            instance = X[instance_idx:instance_idx+1]
            
            # Calculate SHAP values for the instance
            shap_values = explainer.shap_values(instance)
            
            # Handle multi-class case
            if isinstance(shap_values, list):
                shap_values = shap_values[0]  # Use first class
            
            # Get base value (expected value)
            base_value = explainer.expected_value
            if isinstance(base_value, np.ndarray):
                base_value = base_value[0]
            
            # Get prediction
            prediction = model.predict(instance)[0]
            if hasattr(model, 'predict_proba'):
                prediction_proba = model.predict_proba(instance)[0]
            else:
                prediction_proba = None
            
            # Create feature contributions
            feature_contributions = []
            for i, (shap_val, feature_name) in enumerate(zip(shap_values[0], feature_names)):
                feature_contributions.append({
                    'feature': feature_name,
                    'shap_value': float(shap_val),
                    'contribution': float(shap_val),
                    'abs_contribution': float(abs(shap_val))
                })
            
            # Sort by absolute contribution
            feature_contributions.sort(key=lambda x: x['abs_contribution'], reverse=True)
            
            return {
                'explanation_type': 'local_shap',
                'instance_index': instance_idx,
                'base_value': float(base_value),
                'prediction': float(prediction),
                'prediction_proba': prediction_proba.tolist() if prediction_proba is not None else None,
                'feature_contributions': feature_contributions,
                'total_contribution': float(np.sum(shap_values[0]))
            }
            
        except Exception as e:
            logger.error(f"Error generating local SHAP explanations: {e}")
            return {'error': str(e)}

class LIMEExplainer:
    """LIME-based local explanations"""
    
    def __init__(self, config: InterpretabilityConfig):
        self.config = config
        self.explainers = {}
        self.is_initialized = False
    
    def initialize_explainer(self, X: np.ndarray, feature_names: List[str],
                           model_type: ModelType) -> bool:
        """Initialize LIME explainer"""
        if not LIME_AVAILABLE:
            logger.warning("LIME not available, skipping explainer initialization")
            return False
        
        logger.info(f"Initializing LIME explainer for {model_type.value} model...")
        
        try:
            # Create LIME explainer
            explainer = lime.lime_tabular.LimeTabularExplainer(
                X,
                feature_names=feature_names,
                class_names=['class_0', 'class_1'] if model_type == ModelType.CLASSIFICATION else None,
                mode='classification' if model_type == ModelType.CLASSIFICATION else 'regression',
                random_state=self.config.random_state
            )
            
            self.explainers[model_type.value] = explainer
            self.is_initialized = True
            
            logger.info("LIME explainer initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error initializing LIME explainer: {e}")
            return False
    
    def explain_local(self, model: Any, X: np.ndarray, 
                     feature_names: List[str], model_type: ModelType,
                     instance_idx: int = 0) -> Dict[str, Any]:
        """Generate local explanations using LIME"""
        if not self.is_initialized:
            if not self.initialize_explainer(X, feature_names, model_type):
                return {'error': 'LIME explainer not available'}
        
        logger.info(f"Generating local LIME explanations for instance {instance_idx}...")
        
        try:
            explainer = self.explainers[model_type.value]
            
            # Get the specific instance
            instance = X[instance_idx]
            
            # Generate explanation
            explanation = explainer.explain_instance(
                instance,
                model.predict_proba if hasattr(model, 'predict_proba') else model.predict,
                num_features=self.config.lime_num_features,
                num_samples=self.config.lime_num_samples
            )
            
            # Extract explanation data
            explanation_data = explanation.as_list()
            
            # Create feature contributions
            feature_contributions = []
            for feature, contribution in explanation_data:
                feature_contributions.append({
                    'feature': feature,
                    'contribution': float(contribution),
                    'abs_contribution': float(abs(contribution))
                })
            
            # Sort by absolute contribution
            feature_contributions.sort(key=lambda x: x['abs_contribution'], reverse=True)
            
            # Get prediction
            prediction = model.predict(instance.reshape(1, -1))[0]
            if hasattr(model, 'predict_proba'):
                prediction_proba = model.predict_proba(instance.reshape(1, -1))[0]
            else:
                prediction_proba = None
            
            return {
                'explanation_type': 'local_lime',
                'instance_index': instance_idx,
                'prediction': float(prediction),
                'prediction_proba': prediction_proba.tolist() if prediction_proba is not None else None,
                'feature_contributions': feature_contributions,
                'explanation_score': explanation.score,
                'total_contribution': float(sum(abs(contrib[1]) for contrib in explanation_data))
            }
            
        except Exception as e:
            logger.error(f"Error generating local LIME explanations: {e}")
            return {'error': str(e)}

class FeatureImportanceAnalyzer:
    """Feature importance analysis using multiple methods"""
    
    def __init__(self, config: InterpretabilityConfig):
        self.config = config
    
    def analyze_permutation_importance(self, model: Any, X: np.ndarray, y: np.ndarray,
                                     feature_names: List[str], 
                                     model_type: ModelType) -> Dict[str, Any]:
        """Analyze feature importance using permutation importance"""
        logger.info("Analyzing permutation importance...")
        
        try:
            # Calculate permutation importance
            if model_type == ModelType.CLASSIFICATION:
                scoring = 'accuracy'
            else:
                scoring = 'r2'
            
            perm_importance = permutation_importance(
                model, X, y, scoring=scoring, random_state=self.config.random_state
            )
            
            # Create importance ranking
            importance_ranking = []
            for i, (importance, std) in enumerate(zip(perm_importance.importances_mean, 
                                                     perm_importance.importances_std)):
                importance_ranking.append({
                    'feature': feature_names[i] if i < len(feature_names) else f'feature_{i}',
                    'importance': float(importance),
                    'std': float(std),
                    'rank': 0  # Will be set below
                })
            
            # Sort by importance and assign ranks
            importance_ranking.sort(key=lambda x: x['importance'], reverse=True)
            for i, item in enumerate(importance_ranking):
                item['rank'] = i + 1
            
            return {
                'method': 'permutation_importance',
                'feature_importance': importance_ranking,
                'summary_statistics': {
                    'total_features': len(importance_ranking),
                    'mean_importance': float(np.mean(perm_importance.importances_mean)),
                    'max_importance': float(np.max(perm_importance.importances_mean)),
                    'min_importance': float(np.min(perm_importance.importances_mean))
                }
            }
            
        except Exception as e:
            logger.error(f"Error analyzing permutation importance: {e}")
            return {'error': str(e)}
    
    def analyze_tree_importance(self, model: Any, feature_names: List[str]) -> Dict[str, Any]:
        """Analyze feature importance for tree-based models"""
        logger.info("Analyzing tree-based feature importance...")
        
        try:
            if not hasattr(model, 'feature_importances_'):
                return {'error': 'Model does not support feature importance'}
            
            # Get feature importance
            importances = model.feature_importances_
            
            # Create importance ranking
            importance_ranking = []
            for i, importance in enumerate(importances):
                importance_ranking.append({
                    'feature': feature_names[i] if i < len(feature_names) else f'feature_{i}',
                    'importance': float(importance),
                    'rank': 0  # Will be set below
                })
            
            # Sort by importance and assign ranks
            importance_ranking.sort(key=lambda x: x['importance'], reverse=True)
            for i, item in enumerate(importance_ranking):
                item['rank'] = i + 1
            
            return {
                'method': 'tree_importance',
                'feature_importance': importance_ranking,
                'summary_statistics': {
                    'total_features': len(importance_ranking),
                    'mean_importance': float(np.mean(importances)),
                    'max_importance': float(np.max(importances)),
                    'min_importance': float(np.min(importances))
                }
            }
            
        except Exception as e:
            logger.error(f"Error analyzing tree importance: {e}")
            return {'error': str(e)}

class PartialDependenceAnalyzer:
    """Partial dependence analysis for feature effects"""
    
    def __init__(self, config: InterpretabilityConfig):
        self.config = config
    
    def analyze_partial_dependence(self, model: Any, X: np.ndarray, 
                                 feature_names: List[str], 
                                 target_features: List[int]) -> Dict[str, Any]:
        """Analyze partial dependence for specified features"""
        logger.info("Analyzing partial dependence...")
        
        try:
            # Calculate partial dependence
            pd_results = partial_dependence(
                model, X, target_features, 
                kind='average', 
                grid_resolution=50
            )
            
            # Create partial dependence data
            pd_data = []
            for i, feature_idx in enumerate(target_features):
                feature_name = feature_names[feature_idx] if feature_idx < len(feature_names) else f'feature_{feature_idx}'
                
                pd_data.append({
                    'feature': feature_name,
                    'feature_index': feature_idx,
                    'values': pd_results['values'][i].tolist(),
                    'grid': pd_results['grid'][i].tolist(),
                    'mean_effect': float(np.mean(pd_results['values'][i])),
                    'std_effect': float(np.std(pd_results['values'][i]))
                })
            
            return {
                'method': 'partial_dependence',
                'partial_dependence_data': pd_data,
                'target_features': target_features
            }
            
        except Exception as e:
            logger.error(f"Error analyzing partial dependence: {e}")
            return {'error': str(e)}

class BusinessImpactInterpreter:
    """Business impact interpretation of model explanations"""
    
    def __init__(self, config: InterpretabilityConfig):
        self.config = config
    
    def interpret_feature_impact(self, feature_contributions: List[Dict[str, Any]],
                               business_context: Dict[str, Any]) -> Dict[str, Any]:
        """Interpret feature contributions in business context"""
        logger.info("Interpreting feature impact in business context...")
        
        try:
            # Sort features by absolute contribution
            sorted_features = sorted(feature_contributions, 
                                   key=lambda x: x['abs_contribution'], 
                                   reverse=True)
            
            # Interpret top features
            top_features = sorted_features[:5]  # Top 5 features
            
            interpretations = []
            for feature in top_features:
                interpretation = self._interpret_single_feature(feature, business_context)
                interpretations.append(interpretation)
            
            # Generate business recommendations
            recommendations = self._generate_business_recommendations(sorted_features, business_context)
            
            return {
                'top_features': interpretations,
                'business_recommendations': recommendations,
                'total_features_analyzed': len(feature_contributions)
            }
            
        except Exception as e:
            logger.error(f"Error interpreting feature impact: {e}")
            return {'error': str(e)}
    
    def _interpret_single_feature(self, feature: Dict[str, Any], 
                                business_context: Dict[str, Any]) -> Dict[str, Any]:
        """Interpret a single feature's impact"""
        feature_name = feature['feature']
        contribution = feature['contribution']
        
        # Basic interpretation
        impact_level = 'high' if abs(contribution) > 0.1 else 'medium' if abs(contribution) > 0.05 else 'low'
        direction = 'positive' if contribution > 0 else 'negative'
        
        # Business-specific interpretation
        business_interpretation = self._get_business_interpretation(feature_name, contribution, business_context)
        
        return {
            'feature': feature_name,
            'contribution': contribution,
            'impact_level': impact_level,
            'direction': direction,
            'business_interpretation': business_interpretation
        }
    
    def _get_business_interpretation(self, feature_name: str, contribution: float,
                                   business_context: Dict[str, Any]) -> str:
        """Get business-specific interpretation for a feature"""
        # This is a simplified interpretation - in practice, this would be more sophisticated
        
        if 'price' in feature_name.lower():
            if contribution > 0:
                return "Higher prices increase the target metric"
            else:
                return "Higher prices decrease the target metric"
        
        elif 'customer' in feature_name.lower() or 'user' in feature_name.lower():
            if contribution > 0:
                return "Customer-related features positively impact the target"
            else:
                return "Customer-related features negatively impact the target"
        
        elif 'time' in feature_name.lower() or 'date' in feature_name.lower():
            if contribution > 0:
                return "Time-based features show positive temporal effects"
            else:
                return "Time-based features show negative temporal effects"
        
        else:
            if contribution > 0:
                return f"Feature {feature_name} has a positive impact on the target"
            else:
                return f"Feature {feature_name} has a negative impact on the target"
    
    def _generate_business_recommendations(self, sorted_features: List[Dict[str, Any]],
                                         business_context: Dict[str, Any]) -> List[str]:
        """Generate business recommendations based on feature analysis"""
        recommendations = []
        
        # Analyze top positive contributors
        positive_features = [f for f in sorted_features[:10] if f['contribution'] > 0]
        if positive_features:
            top_positive = positive_features[0]['feature']
            recommendations.append(f"Focus on optimizing {top_positive} to maximize positive impact")
        
        # Analyze top negative contributors
        negative_features = [f for f in sorted_features[:10] if f['contribution'] < 0]
        if negative_features:
            top_negative = negative_features[0]['feature']
            recommendations.append(f"Address issues with {top_negative} to reduce negative impact")
        
        # General recommendations
        recommendations.append("Monitor top 5 features regularly for model performance")
        recommendations.append("Consider feature engineering for low-importance features")
        
        return recommendations

class ModelInterpretabilityAPI:
    """API wrapper for model interpretability system"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.config = InterpretabilityConfig()
        self.shap_explainer = SHAPExplainer(self.config)
        self.lime_explainer = LIMEExplainer(self.config)
        self.feature_analyzer = FeatureImportanceAnalyzer(self.config)
        self.pd_analyzer = PartialDependenceAnalyzer(self.config)
        self.business_interpreter = BusinessImpactInterpreter(self.config)
        
        if model_path:
            self.load_models(model_path)
    
    def explain_model(self, model: Any, X: np.ndarray, y: np.ndarray,
                     feature_names: List[str], model_type: ModelType,
                     explanation_types: List[str] = None) -> Dict[str, Any]:
        """Generate comprehensive model explanations"""
        if explanation_types is None:
            explanation_types = ['global', 'local', 'feature_importance']
        
        logger.info(f"Generating model explanations: {explanation_types}")
        
        try:
            results = {}
            
            # Global explanations
            if 'global' in explanation_types:
                global_explanation = self.shap_explainer.explain_global(
                    model, X, feature_names, model_type
                )
                results['global_explanation'] = global_explanation
            
            # Local explanations
            if 'local' in explanation_types:
                local_shap = self.shap_explainer.explain_local(
                    model, X, feature_names, model_type, instance_idx=0
                )
                local_lime = self.lime_explainer.explain_local(
                    model, X, feature_names, model_type, instance_idx=0
                )
                results['local_explanations'] = {
                    'shap': local_shap,
                    'lime': local_lime
                }
            
            # Feature importance
            if 'feature_importance' in explanation_types:
                # Permutation importance
                perm_importance = self.feature_analyzer.analyze_permutation_importance(
                    model, X, y, feature_names, model_type
                )
                
                # Tree importance (if applicable)
                tree_importance = self.feature_analyzer.analyze_tree_importance(
                    model, feature_names
                )
                
                results['feature_importance'] = {
                    'permutation': perm_importance,
                    'tree': tree_importance
                }
            
            # Partial dependence
            if 'partial_dependence' in explanation_types:
                # Analyze top 3 features
                top_features = list(range(min(3, len(feature_names))))
                pd_analysis = self.pd_analyzer.analyze_partial_dependence(
                    model, X, feature_names, top_features
                )
                results['partial_dependence'] = pd_analysis
            
            return {
                'success': True,
                'explanations': results,
                'model_type': model_type.value,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error generating model explanations: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def interpret_business_impact(self, feature_contributions: List[Dict[str, Any]],
                                business_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Interpret model explanations in business context"""
        try:
            if business_context is None:
                business_context = {
                    'industry': 'hospitality',
                    'business_goal': 'revenue_optimization',
                    'key_metrics': ['revenue', 'customer_satisfaction', 'operational_efficiency']
                }
            
            interpretation = self.business_interpreter.interpret_feature_impact(
                feature_contributions, business_context
            )
            
            return {
                'success': True,
                'business_interpretation': interpretation,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error interpreting business impact: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def compare_models_interpretability(self, models: Dict[str, Any], 
                                      X: np.ndarray, y: np.ndarray,
                                      feature_names: List[str],
                                      model_types: Dict[str, ModelType]) -> Dict[str, Any]:
        """Compare interpretability across multiple models"""
        try:
            comparison_results = {}
            
            for model_name, model in models.items():
                model_type = model_types.get(model_name, ModelType.CLASSIFICATION)
                
                # Get explanations for this model
                explanations = self.explain_model(
                    model, X, y, feature_names, model_type,
                    explanation_types=['global', 'feature_importance']
                )
                
                comparison_results[model_name] = explanations
            
            return {
                'success': True,
                'model_comparison': comparison_results,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error comparing models: {e}")
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
    n_features = 10
    
    # Generate sample data
    X = np.random.randn(n_samples, n_features)
    y = (X[:, 0] + X[:, 1] * 2 + np.random.randn(n_samples) * 0.1 > 0).astype(int)
    
    feature_names = [f'feature_{i}' for i in range(n_features)]
    
    # Train a sample model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Initialize API
    api = ModelInterpretabilityAPI()
    
    # Test model explanations
    explanations = api.explain_model(
        model, X, y, feature_names, ModelType.CLASSIFICATION,
        explanation_types=['global', 'local', 'feature_importance']
    )
    print("Model Explanations:", explanations)
    
    # Test business impact interpretation
    if 'local_explanations' in explanations.get('explanations', {}):
        feature_contributions = explanations['explanations']['local_explanations']['shap'].get('feature_contributions', [])
        if feature_contributions:
            business_interpretation = api.interpret_business_impact(feature_contributions)
            print("Business Impact Interpretation:", business_interpretation)
    
    # Test model comparison
    models = {
        'random_forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'logistic_regression': LogisticRegression(random_state=42)
    }
    model_types = {
        'random_forest': ModelType.CLASSIFICATION,
        'logistic_regression': ModelType.CLASSIFICATION
    }
    
    # Train models
    for name, model in models.items():
        model.fit(X, y)
    
    comparison = api.compare_models_interpretability(models, X, y, feature_names, model_types)
    print("Model Comparison:", comparison)