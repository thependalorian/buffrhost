"""
Comprehensive ML Pipeline for AI Sales Solutions
Based on Buffr Host ML Architecture

Implements 9 Core ML Algorithms:
1. Linear Regression (revenue prediction)
2. Model Selection (algorithm optimization)
3. Decision Trees (customer segmentation)
4. Logistic Regression (conversion prediction)
5. Instance-Based Learning (k-NN recommendations)
6. Model Evaluation (performance assessment)
7. Ensembles (improved predictions)
8. Clustering (customer segmentation)
9. Dimensionality Reduction (feature optimization)
"""

import asyncio
import logging
import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple
from collections import defaultdict

import numpy as np
import pandas as pd
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_

# ML imports
try:
    from sklearn.linear_model import LinearRegression, LogisticRegression
    from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, RandomForestRegressor, GradientBoostingRegressor
    from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
    from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
    from sklearn.cluster import KMeans, DBSCAN
    from sklearn.decomposition import PCA
    from sklearn.preprocessing import StandardScaler, LabelEncoder
    from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, mean_squared_error, r2_score
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False

logger = logging.getLogger(__name__)


class ModelType(str, Enum):
    """Available ML model types"""
    LINEAR_REGRESSION = "linear_regression"
    LOGISTIC_REGRESSION = "logistic_regression"
    DECISION_TREE = "decision_tree"
    RANDOM_FOREST = "random_forest"
    GRADIENT_BOOSTING = "gradient_boosting"
    K_NEAREST_NEIGHBORS = "k_nearest_neighbors"
    K_MEANS = "k_means"
    PCA = "pca"


class PredictionType(str, Enum):
    """Types of predictions"""
    CONVERSION = "conversion"
    REVENUE = "revenue"
    CHURN = "churn"
    SEGMENTATION = "segmentation"
    RECOMMENDATION = "recommendation"


class ModelPerformance(BaseModel):
    """Model performance metrics"""
    model_name: str
    accuracy: float = Field(ge=0.0, le=1.0, default=0.0)
    precision: float = Field(ge=0.0, le=1.0, default=0.0)
    recall: float = Field(ge=0.0, le=1.0, default=0.0)
    f1_score: float = Field(ge=0.0, le=1.0, default=0.0)
    mse: float = Field(ge=0.0, default=0.0)
    r2_score: float = Field(ge=0.0, le=1.0, default=0.0)
    training_time: float = Field(ge=0.0, default=0.0)
    prediction_time: float = Field(ge=0.0, default=0.0)
    cross_val_score: float = Field(ge=0.0, le=1.0, default=0.0)


class FeatureImportance(BaseModel):
    """Feature importance analysis"""
    feature_name: str
    importance_score: float = Field(ge=0.0, le=1.0)
    rank: int = Field(ge=1, default=1)


class PredictionResult(BaseModel):
    """ML prediction result"""
    prediction_id: str
    model_type: ModelType
    prediction_type: PredictionType
    prediction_value: float = Field(ge=0.0, le=1.0)
    confidence_score: float = Field(ge=0.0, le=1.0)
    feature_importance: List[FeatureImportance] = Field(default_factory=list)
    model_explanation: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)


class MLPipeline:
    """
    Comprehensive ML Pipeline for AI Sales Solutions
    
    Features:
    - 9 core ML algorithms
    - Automated model training and evaluation
    - Feature engineering and selection
    - Hyperparameter tuning
    - Model performance monitoring
    """

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session
        
        # ML models
        self.models = {}
        self.scalers = {}
        self.encoders = {}
        self.is_models_trained = False
        
        # Performance tracking
        self.model_performance: Dict[str, ModelPerformance] = {}
        self.feature_importance: Dict[str, List[FeatureImportance]] = {}
        
        # Data storage
        self.training_data = {}
        self.feature_names = []

    async def initialize(self):
        """Initialize the ML pipeline"""
        try:
            if not ML_AVAILABLE:
                logger.warning("ML libraries not available")
                return
            
            # Collect training data
            await self._collect_training_data()
            
            # Initialize models
            await self._initialize_models()
            
            logger.info("ML Pipeline initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize ML Pipeline: {e}")
            raise

    async def _collect_training_data(self):
        """Collect training data from database"""
        try:
            # This would query the database for training data
            # For now, generate mock data
            np.random.seed(42)
            
            # Generate mock customer data
            n_samples = 1000
            self.training_data = {
                'customer_features': np.random.randn(n_samples, 20),
                'conversion_labels': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
                'revenue_labels': np.random.exponential(100, n_samples),
                'churn_labels': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
                'segmentation_features': np.random.randn(n_samples, 15)
            }
            
            # Generate feature names
            self.feature_names = [f'feature_{i}' for i in range(20)]
            
            logger.info(f"Collected {n_samples} training samples")
            
        except Exception as e:
            logger.error(f"Error collecting training data: {e}")
            self.training_data = {}

    async def _initialize_models(self):
        """Initialize ML models"""
        try:
            # Initialize models for different tasks
            self.models = {
                'conversion_prediction': {
                    'logistic_regression': LogisticRegression(random_state=42),
                    'random_forest': RandomForestClassifier(n_estimators=100, random_state=42),
                    'gradient_boosting': GradientBoostingClassifier(n_estimators=100, random_state=42),
                    'decision_tree': DecisionTreeClassifier(random_state=42),
                    'knn': KNeighborsClassifier(n_neighbors=5)
                },
                'revenue_prediction': {
                    'linear_regression': LinearRegression(),
                    'random_forest': RandomForestRegressor(n_estimators=100, random_state=42),
                    'gradient_boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
                    'decision_tree': DecisionTreeRegressor(random_state=42),
                    'knn': KNeighborsRegressor(n_neighbors=5)
                },
                'churn_prediction': {
                    'logistic_regression': LogisticRegression(random_state=42),
                    'random_forest': RandomForestClassifier(n_estimators=100, random_state=42),
                    'gradient_boosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
                },
                'customer_segmentation': {
                    'kmeans': KMeans(n_clusters=5, random_state=42, n_init=10),
                    'dbscan': DBSCAN(eps=0.5, min_samples=5)
                },
                'dimensionality_reduction': {
                    'pca': PCA(n_components=0.95)
                }
            }
            
            # Initialize scalers
            self.scalers = {
                'standard': StandardScaler(),
                'minmax': None  # Would use MinMaxScaler if needed
            }
            
            logger.info("ML models initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing models: {e}")

    async def train_all_models(self) -> Dict[str, Any]:
        """
        Train all ML models with comprehensive evaluation
        
        Returns:
            Dict containing training results
        """
        try:
            if not self.training_data:
                raise ValueError("No training data available")
            
            training_results = {}
            
            # Train conversion prediction models
            conversion_results = await self._train_conversion_models()
            training_results['conversion_prediction'] = conversion_results
            
            # Train revenue prediction models
            revenue_results = await self._train_revenue_models()
            training_results['revenue_prediction'] = revenue_results
            
            # Train churn prediction models
            churn_results = await self._train_churn_models()
            training_results['churn_prediction'] = churn_results
            
            # Train customer segmentation models
            segmentation_results = await self._train_segmentation_models()
            training_results['customer_segmentation'] = segmentation_results
            
            # Train dimensionality reduction models
            reduction_results = await self._train_reduction_models()
            training_results['dimensionality_reduction'] = reduction_results
            
            self.is_models_trained = True
            
            logger.info("All ML models trained successfully")
            
            return {
                "status": "success",
                "models_trained": len(training_results),
                "training_results": training_results,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error training models: {e}")
            return {
                "status": "error",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }

    async def _train_conversion_models(self) -> Dict[str, Any]:
        """Train conversion prediction models"""
        try:
            X = self.training_data['customer_features']
            y = self.training_data['conversion_labels']
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            X_train_scaled = self.scalers['standard'].fit_transform(X_train)
            X_test_scaled = self.scalers['standard'].transform(X_test)
            
            results = {}
            
            for model_name, model in self.models['conversion_prediction'].items():
                start_time = datetime.utcnow()
                
                # Train model
                model.fit(X_train_scaled, y_train)
                
                # Make predictions
                y_pred = model.predict(X_test_scaled)
                y_pred_proba = model.predict_proba(X_test_scaled)[:, 1] if hasattr(model, 'predict_proba') else y_pred
                
                # Calculate metrics
                accuracy = accuracy_score(y_test, y_pred)
                precision = precision_score(y_test, y_pred, zero_division=0)
                recall = recall_score(y_test, y_pred, zero_division=0)
                f1 = f1_score(y_test, y_pred, zero_division=0)
                
                # Cross-validation
                cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5)
                
                training_time = (datetime.utcnow() - start_time).total_seconds()
                
                # Store performance
                performance = ModelPerformance(
                    model_name=model_name,
                    accuracy=accuracy,
                    precision=precision,
                    recall=recall,
                    f1_score=f1,
                    training_time=training_time,
                    cross_val_score=cv_scores.mean()
                )
                
                self.model_performance[f'conversion_{model_name}'] = performance
                
                # Feature importance
                if hasattr(model, 'feature_importances_'):
                    importance_scores = model.feature_importances_
                    feature_importance = [
                        FeatureImportance(
                            feature_name=self.feature_names[i],
                            importance_score=score,
                            rank=i+1
                        )
                        for i, score in enumerate(importance_scores)
                    ]
                    feature_importance.sort(key=lambda x: x.importance_score, reverse=True)
                    self.feature_importance[f'conversion_{model_name}'] = feature_importance
                
                results[model_name] = {
                    "accuracy": accuracy,
                    "precision": precision,
                    "recall": recall,
                    "f1_score": f1,
                    "cross_val_score": cv_scores.mean(),
                    "training_time": training_time
                }
            
            return results
            
        except Exception as e:
            logger.error(f"Error training conversion models: {e}")
            return {}

    async def _train_revenue_models(self) -> Dict[str, Any]:
        """Train revenue prediction models"""
        try:
            X = self.training_data['customer_features']
            y = self.training_data['revenue_labels']
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            X_train_scaled = self.scalers['standard'].fit_transform(X_train)
            X_test_scaled = self.scalers['standard'].transform(X_test)
            
            results = {}
            
            for model_name, model in self.models['revenue_prediction'].items():
                start_time = datetime.utcnow()
                
                # Train model
                model.fit(X_train_scaled, y_train)
                
                # Make predictions
                y_pred = model.predict(X_test_scaled)
                
                # Calculate metrics
                mse = mean_squared_error(y_test, y_pred)
                r2 = r2_score(y_test, y_pred)
                
                # Cross-validation
                cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='r2')
                
                training_time = (datetime.utcnow() - start_time).total_seconds()
                
                # Store performance
                performance = ModelPerformance(
                    model_name=model_name,
                    mse=mse,
                    r2_score=r2,
                    training_time=training_time,
                    cross_val_score=cv_scores.mean()
                )
                
                self.model_performance[f'revenue_{model_name}'] = performance
                
                results[model_name] = {
                    "mse": mse,
                    "r2_score": r2,
                    "cross_val_score": cv_scores.mean(),
                    "training_time": training_time
                }
            
            return results
            
        except Exception as e:
            logger.error(f"Error training revenue models: {e}")
            return {}

    async def _train_churn_models(self) -> Dict[str, Any]:
        """Train churn prediction models"""
        try:
            X = self.training_data['customer_features']
            y = self.training_data['churn_labels']
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            X_train_scaled = self.scalers['standard'].fit_transform(X_train)
            X_test_scaled = self.scalers['standard'].transform(X_test)
            
            results = {}
            
            for model_name, model in self.models['churn_prediction'].items():
                start_time = datetime.utcnow()
                
                # Train model
                model.fit(X_train_scaled, y_train)
                
                # Make predictions
                y_pred = model.predict(X_test_scaled)
                
                # Calculate metrics
                accuracy = accuracy_score(y_test, y_pred)
                precision = precision_score(y_test, y_pred, zero_division=0)
                recall = recall_score(y_test, y_pred, zero_division=0)
                f1 = f1_score(y_test, y_pred, zero_division=0)
                
                # Cross-validation
                cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5)
                
                training_time = (datetime.utcnow() - start_time).total_seconds()
                
                # Store performance
                performance = ModelPerformance(
                    model_name=model_name,
                    accuracy=accuracy,
                    precision=precision,
                    recall=recall,
                    f1_score=f1,
                    training_time=training_time,
                    cross_val_score=cv_scores.mean()
                )
                
                self.model_performance[f'churn_{model_name}'] = performance
                
                results[model_name] = {
                    "accuracy": accuracy,
                    "precision": precision,
                    "recall": recall,
                    "f1_score": f1,
                    "cross_val_score": cv_scores.mean(),
                    "training_time": training_time
                }
            
            return results
            
        except Exception as e:
            logger.error(f"Error training churn models: {e}")
            return {}

    async def _train_segmentation_models(self) -> Dict[str, Any]:
        """Train customer segmentation models"""
        try:
            X = self.training_data['segmentation_features']
            
            # Scale features
            X_scaled = self.scalers['standard'].fit_transform(X)
            
            results = {}
            
            for model_name, model in self.models['customer_segmentation'].items():
                start_time = datetime.utcnow()
                
                # Train model
                if model_name == 'kmeans':
                    model.fit(X_scaled)
                    labels = model.labels_
                    inertia = model.inertia_
                    
                    results[model_name] = {
                        "n_clusters": len(set(labels)),
                        "inertia": inertia,
                        "silhouette_score": 0.0  # Would calculate if needed
                    }
                elif model_name == 'dbscan':
                    labels = model.fit_predict(X_scaled)
                    n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
                    
                    results[model_name] = {
                        "n_clusters": n_clusters,
                        "n_noise": list(labels).count(-1)
                    }
                
                training_time = (datetime.utcnow() - start_time).total_seconds()
                
                # Store performance
                performance = ModelPerformance(
                    model_name=model_name,
                    training_time=training_time
                )
                
                self.model_performance[f'segmentation_{model_name}'] = performance
            
            return results
            
        except Exception as e:
            logger.error(f"Error training segmentation models: {e}")
            return {}

    async def _train_reduction_models(self) -> Dict[str, Any]:
        """Train dimensionality reduction models"""
        try:
            X = self.training_data['customer_features']
            
            # Scale features
            X_scaled = self.scalers['standard'].fit_transform(X)
            
            results = {}
            
            for model_name, model in self.models['dimensionality_reduction'].items():
                start_time = datetime.utcnow()
                
                # Train model
                if model_name == 'pca':
                    model.fit(X_scaled)
                    explained_variance_ratio = model.explained_variance_ratio_
                    n_components = model.n_components_
                    
                    results[model_name] = {
                        "n_components": n_components,
                        "explained_variance_ratio": explained_variance_ratio.sum(),
                        "cumulative_variance": np.cumsum(explained_variance_ratio).tolist()
                    }
                
                training_time = (datetime.utcnow() - start_time).total_seconds()
                
                # Store performance
                performance = ModelPerformance(
                    model_name=model_name,
                    training_time=training_time
                )
                
                self.model_performance[f'reduction_{model_name}'] = performance
            
            return results
            
        except Exception as e:
            logger.error(f"Error training reduction models: {e}")
            return {}

    async def predict_conversion(self, customer_data: Dict[str, Any]) -> PredictionResult:
        """
        Predict customer conversion probability
        
        Args:
            customer_data: Customer feature data
            
        Returns:
            PredictionResult with conversion prediction
        """
        try:
            if not self.is_models_trained:
                raise ValueError("Models not trained yet")
            
            # Convert customer data to feature vector
            feature_vector = self._extract_features(customer_data)
            
            # Scale features
            feature_vector_scaled = self.scalers['standard'].transform([feature_vector])
            
            # Use best performing model (Random Forest)
            best_model = self.models['conversion_prediction']['random_forest']
            
            # Make prediction
            prediction_proba = best_model.predict_proba(feature_vector_scaled)[0][1]
            prediction = 1 if prediction_proba > 0.5 else 0
            
            # Get feature importance
            feature_importance = self.feature_importance.get('conversion_random_forest', [])
            
            # Create prediction result
            result = PredictionResult(
                prediction_id=str(uuid.uuid4()),
                model_type=ModelType.RANDOM_FOREST,
                prediction_type=PredictionType.CONVERSION,
                prediction_value=prediction_proba,
                confidence_score=abs(prediction_proba - 0.5) * 2,  # Convert to confidence
                feature_importance=feature_importance[:5],  # Top 5 features
                model_explanation=f"Customer has {prediction_proba:.1%} probability of converting based on Random Forest model"
            )
            
            return result
            
        except Exception as e:
            logger.error(f"Error predicting conversion: {e}")
            return PredictionResult(
                prediction_id=str(uuid.uuid4()),
                model_type=ModelType.RANDOM_FOREST,
                prediction_type=PredictionType.CONVERSION,
                prediction_value=0.5,
                confidence_score=0.0,
                model_explanation=f"Error in prediction: {str(e)}"
            )

    def _extract_features(self, customer_data: Dict[str, Any]) -> np.ndarray:
        """Extract features from customer data"""
        try:
            # This would extract features from customer data
            # For now, return mock feature vector
            return np.random.randn(20)
            
        except Exception as e:
            logger.error(f"Error extracting features: {e}")
            return np.zeros(20)

    async def get_model_performance(self) -> Dict[str, Any]:
        """Get ML model performance metrics"""
        try:
            performance_summary = {
                "total_models": len(self.model_performance),
                "models_trained": self.is_models_trained,
                "model_performance": {},
                "feature_importance": {},
                "best_models": {}
            }
            
            # Aggregate performance by task
            task_performance = defaultdict(list)
            for model_key, performance in self.model_performance.items():
                task = model_key.split('_')[0]
                task_performance[task].append(performance)
            
            # Find best models for each task
            for task, performances in task_performance.items():
                if performances:
                    best_performance = max(performances, key=lambda p: p.accuracy if p.accuracy > 0 else p.r2_score)
                    performance_summary["best_models"][task] = {
                        "model_name": best_performance.model_name,
                        "accuracy": best_performance.accuracy,
                        "r2_score": best_performance.r2_score,
                        "f1_score": best_performance.f1_score
                    }
            
            # Add detailed performance
            for model_key, performance in self.model_performance.items():
                performance_summary["model_performance"][model_key] = {
                    "accuracy": performance.accuracy,
                    "precision": performance.precision,
                    "recall": performance.recall,
                    "f1_score": performance.f1_score,
                    "mse": performance.mse,
                    "r2_score": performance.r2_score,
                    "training_time": performance.training_time,
                    "cross_val_score": performance.cross_val_score
                }
            
            # Add feature importance
            for model_key, importance in self.feature_importance.items():
                performance_summary["feature_importance"][model_key] = [
                    {
                        "feature_name": feat.feature_name,
                        "importance_score": feat.importance_score,
                        "rank": feat.rank
                    }
                    for feat in importance[:10]  # Top 10 features
                ]
            
            return performance_summary
            
        except Exception as e:
            logger.error(f"Error getting model performance: {e}")
            return {}

    async def hyperparameter_tuning(self, model_name: str, task: str) -> Dict[str, Any]:
        """Perform hyperparameter tuning for a specific model"""
        try:
            if task not in self.models:
                raise ValueError(f"Task {task} not found")
            
            if model_name not in self.models[task]:
                raise ValueError(f"Model {model_name} not found in task {task}")
            
            # Get training data
            if task == 'conversion_prediction':
                X = self.training_data['customer_features']
                y = self.training_data['conversion_labels']
            elif task == 'revenue_prediction':
                X = self.training_data['customer_features']
                y = self.training_data['revenue_labels']
            else:
                raise ValueError(f"Hyperparameter tuning not supported for task {task}")
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            X_train_scaled = self.scalers['standard'].fit_transform(X_train)
            X_test_scaled = self.scalers['standard'].transform(X_test)
            
            # Define parameter grid based on model type
            if model_name == 'random_forest':
                param_grid = {
                    'n_estimators': [50, 100, 200],
                    'max_depth': [5, 10, 15, None],
                    'min_samples_split': [2, 5, 10],
                    'min_samples_leaf': [1, 2, 4]
                }
                base_model = RandomForestClassifier(random_state=42)
            elif model_name == 'gradient_boosting':
                param_grid = {
                    'n_estimators': [50, 100, 200],
                    'learning_rate': [0.01, 0.1, 0.2],
                    'max_depth': [3, 6, 9],
                    'subsample': [0.8, 0.9, 1.0]
                }
                base_model = GradientBoostingClassifier(random_state=42)
            else:
                raise ValueError(f"Hyperparameter tuning not supported for model {model_name}")
            
            # Perform grid search
            grid_search = GridSearchCV(
                base_model,
                param_grid,
                cv=5,
                scoring='accuracy' if task == 'conversion_prediction' else 'r2',
                n_jobs=-1
            )
            
            grid_search.fit(X_train_scaled, y_train)
            
            # Get best parameters and score
            best_params = grid_search.best_params_
            best_score = grid_search.best_score_
            
            # Evaluate on test set
            best_model = grid_search.best_estimator_
            test_score = best_model.score(X_test_scaled, y_test)
            
            return {
                "model_name": model_name,
                "task": task,
                "best_params": best_params,
                "best_cv_score": best_score,
                "test_score": test_score,
                "improvement": test_score - 0.5  # Assuming baseline of 0.5
            }
            
        except Exception as e:
            logger.error(f"Error in hyperparameter tuning: {e}")
            return {
                "model_name": model_name,
                "task": task,
                "error": str(e)
            }
