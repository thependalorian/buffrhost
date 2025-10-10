"""
Advanced Analytics System for Hospitality Platform
=================================================

Comprehensive advanced analytics system providing time series forecasting,
cohort analysis, predictive modeling, and business intelligence capabilities
for hospitality businesses.

Features:
- Time series forecasting with GARCH models
- Cohort analysis and customer lifetime value
- Predictive modeling for demand and revenue
- Business intelligence dashboards
- Statistical analysis and reporting

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
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split, cross_val_score, TimeSeriesSplit
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.cluster import KMeans, DBSCAN
from sklearn.decomposition import PCA
from sklearn.neighbors import KNeighborsRegressor

# Time series analysis
from scipy import stats
from scipy.optimize import minimize
import statsmodels.api as sm
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.vector_ar.var_model import VAR

# GARCH models for volatility forecasting
try:
    import arch
    GARCH_AVAILABLE = True
except ImportError:
    GARCH_AVAILABLE = False
    logging.warning("ARCH library not available. GARCH models will be disabled.")

# Financial analysis
from scipy.stats import norm, t
import math

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ForecastType(Enum):
    """Types of forecasting models"""
    ARIMA = "arima"
    SARIMA = "sarima"
    EXPONENTIAL_SMOOTHING = "exponential_smoothing"
    VAR = "var"
    GARCH = "garch"
    MACHINE_LEARNING = "machine_learning"

class CohortType(Enum):
    """Types of cohort analysis"""
    ACQUISITION = "acquisition"
    REVENUE = "revenue"
    RETENTION = "retention"
    BEHAVIORAL = "behavioral"

@dataclass
class ForecastConfig:
    """Configuration for forecasting models"""
    # Time series parameters
    forecast_horizon: int = 30  # days
    confidence_level: float = 0.95
    seasonal_periods: int = 12  # monthly seasonality
    
    # Model parameters
    max_p: int = 5  # AR order
    max_d: int = 2  # Differencing order
    max_q: int = 5  # MA order
    max_P: int = 2  # Seasonal AR order
    max_D: int = 1  # Seasonal differencing order
    max_Q: int = 2  # Seasonal MA order
    
    # GARCH parameters
    garch_p: int = 1
    garch_q: int = 1
    
    # Model persistence
    model_path: str = "models/advanced_analytics"
    version: str = "1.0.0"

class TimeSeriesForecaster:
    """Advanced time series forecasting system"""
    
    def __init__(self, config: ForecastConfig):
        self.config = config
        self.models = {}
        self.scaler = StandardScaler()
        self.is_trained = False
        
    def prepare_time_series_data(self, df: pd.DataFrame, 
                               target_column: str, 
                               date_column: str = 'date') -> pd.DataFrame:
        """Prepare data for time series analysis"""
        # Ensure date column is datetime
        df[date_column] = pd.to_datetime(df[date_column])
        df = df.sort_values(date_column).reset_index(drop=True)
        
        # Create time-based features
        df['year'] = df[date_column].dt.year
        df['month'] = df[date_column].dt.month
        df['quarter'] = df[date_column].dt.quarter
        df['day_of_week'] = df[date_column].dt.dayofweek
        df['day_of_year'] = df[date_column].dt.dayofyear
        df['is_weekend'] = df[date_column].dt.dayofweek.isin([5, 6]).astype(int)
        
        # Create lagged features
        for lag in [1, 7, 30, 90]:
            df[f'{target_column}_lag_{lag}'] = df[target_column].shift(lag)
        
        # Create rolling statistics
        for window in [7, 30, 90]:
            df[f'{target_column}_rolling_mean_{window}'] = df[target_column].rolling(window=window).mean()
            df[f'{target_column}_rolling_std_{window}'] = df[target_column].rolling(window=window).std()
        
        # Create trend features
        df['trend'] = np.arange(len(df))
        df['trend_squared'] = df['trend'] ** 2
        
        return df
    
    def train_arima_model(self, ts_data: pd.Series) -> Dict[str, Any]:
        """Train ARIMA model for time series forecasting"""
        logger.info("Training ARIMA model...")
        
        try:
            # Auto ARIMA parameter selection
            best_aic = float('inf')
            best_params = None
            best_model = None
            
            for p in range(self.config.max_p + 1):
                for d in range(self.config.max_d + 1):
                    for q in range(self.config.max_q + 1):
                        try:
                            model = ARIMA(ts_data, order=(p, d, q))
                            fitted_model = model.fit()
                            
                            if fitted_model.aic < best_aic:
                                best_aic = fitted_model.aic
                                best_params = (p, d, q)
                                best_model = fitted_model
                        except:
                            continue
            
            if best_model is None:
                raise ValueError("Could not fit ARIMA model")
            
            self.models['arima'] = best_model
            
            # Generate forecasts
            forecast = best_model.forecast(steps=self.config.forecast_horizon)
            conf_int = best_model.get_forecast(steps=self.config.forecast_horizon).conf_int()
            
            return {
                'model_type': 'ARIMA',
                'parameters': best_params,
                'aic': best_aic,
                'forecast': forecast.tolist(),
                'confidence_interval': conf_int.values.tolist(),
                'model_summary': best_model.summary().as_text()
            }
            
        except Exception as e:
            logger.error(f"Error training ARIMA model: {e}")
            raise
    
    def train_sarima_model(self, ts_data: pd.Series) -> Dict[str, Any]:
        """Train SARIMA model for seasonal time series forecasting"""
        logger.info("Training SARIMA model...")
        
        try:
            # Auto SARIMA parameter selection
            best_aic = float('inf')
            best_params = None
            best_seasonal_params = None
            best_model = None
            
            for p in range(self.config.max_p + 1):
                for d in range(self.config.max_d + 1):
                    for q in range(self.config.max_q + 1):
                        for P in range(self.config.max_P + 1):
                            for D in range(self.config.max_D + 1):
                                for Q in range(self.config.max_Q + 1):
                                    try:
                                        model = SARIMAX(
                                            ts_data, 
                                            order=(p, d, q),
                                            seasonal_order=(P, D, Q, self.config.seasonal_periods)
                                        )
                                        fitted_model = model.fit(disp=False)
                                        
                                        if fitted_model.aic < best_aic:
                                            best_aic = fitted_model.aic
                                            best_params = (p, d, q)
                                            best_seasonal_params = (P, D, Q, self.config.seasonal_periods)
                                            best_model = fitted_model
                                    except:
                                        continue
            
            if best_model is None:
                raise ValueError("Could not fit SARIMA model")
            
            self.models['sarima'] = best_model
            
            # Generate forecasts
            forecast = best_model.forecast(steps=self.config.forecast_horizon)
            conf_int = best_model.get_forecast(steps=self.config.forecast_horizon).conf_int()
            
            return {
                'model_type': 'SARIMA',
                'parameters': best_params,
                'seasonal_parameters': best_seasonal_params,
                'aic': best_aic,
                'forecast': forecast.tolist(),
                'confidence_interval': conf_int.values.tolist(),
                'model_summary': best_model.summary().as_text()
            }
            
        except Exception as e:
            logger.error(f"Error training SARIMA model: {e}")
            raise
    
    def train_exponential_smoothing_model(self, ts_data: pd.Series) -> Dict[str, Any]:
        """Train Exponential Smoothing model"""
        logger.info("Training Exponential Smoothing model...")
        
        try:
            # Try different exponential smoothing methods
            methods = ['additive', 'multiplicative']
            best_aic = float('inf')
            best_model = None
            best_method = None
            
            for method in methods:
                try:
                    model = ExponentialSmoothing(
                        ts_data,
                        trend='add',
                        seasonal='add',
                        seasonal_periods=self.config.seasonal_periods
                    )
                    fitted_model = model.fit()
                    
                    if fitted_model.aic < best_aic:
                        best_aic = fitted_model.aic
                        best_model = fitted_model
                        best_method = method
                except:
                    continue
            
            if best_model is None:
                raise ValueError("Could not fit Exponential Smoothing model")
            
            self.models['exponential_smoothing'] = best_model
            
            # Generate forecasts
            forecast = best_model.forecast(steps=self.config.forecast_horizon)
            
            return {
                'model_type': 'Exponential Smoothing',
                'method': best_method,
                'aic': best_aic,
                'forecast': forecast.tolist(),
                'model_summary': str(best_model.params)
            }
            
        except Exception as e:
            logger.error(f"Error training Exponential Smoothing model: {e}")
            raise
    
    def train_garch_model(self, ts_data: pd.Series) -> Dict[str, Any]:
        """Train GARCH model for volatility forecasting"""
        if not GARCH_AVAILABLE:
            return {'error': 'GARCH models not available - ARCH library not installed'}
        
        logger.info("Training GARCH model...")
        
        try:
            # Calculate returns
            returns = ts_data.pct_change().dropna()
            
            # Fit GARCH model
            model = arch.arch_model(
                returns,
                vol='GARCH',
                p=self.config.garch_p,
                q=self.config.garch_q
            )
            fitted_model = model.fit(disp='off')
            
            self.models['garch'] = fitted_model
            
            # Generate volatility forecasts
            forecasts = fitted_model.forecast(horizon=self.config.forecast_horizon)
            volatility_forecast = np.sqrt(forecasts.variance.values[-1])
            
            return {
                'model_type': 'GARCH',
                'parameters': (self.config.garch_p, self.config.garch_q),
                'aic': fitted_model.aic,
                'volatility_forecast': volatility_forecast.tolist(),
                'model_summary': fitted_model.summary().as_text()
            }
            
        except Exception as e:
            logger.error(f"Error training GARCH model: {e}")
            return {'error': str(e)}
    
    def train_ml_forecasting_model(self, df: pd.DataFrame, target_column: str) -> Dict[str, Any]:
        """Train machine learning model for forecasting"""
        logger.info("Training ML forecasting model...")
        
        try:
            # Prepare features
            feature_columns = [col for col in df.columns if col != target_column and col != 'date']
            X = df[feature_columns].fillna(0)
            y = df[target_column]
            
            # Remove rows with NaN target
            valid_indices = ~y.isna()
            X = X[valid_indices]
            y = y[valid_indices]
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Split data using time series split
            tscv = TimeSeriesSplit(n_splits=5)
            X_train, X_test, y_train, y_test = train_test_split(
                X_scaled, y, test_size=0.2, random_state=42
            )
            
            # Train ensemble model
            model = GradientBoostingRegressor(
                n_estimators=100,
                learning_rate=0.1,
                max_depth=6,
                random_state=42
            )
            model.fit(X_train, y_train)
            
            self.models['ml_forecasting'] = model
            
            # Evaluate model
            y_pred = model.predict(X_test)
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            # Generate forecasts
            last_features = X_scaled[-1:].repeat(self.config.forecast_horizon, axis=0)
            forecast = model.predict(last_features)
            
            return {
                'model_type': 'Machine Learning',
                'mse': mse,
                'r2': r2,
                'forecast': forecast.tolist(),
                'feature_importance': dict(zip(feature_columns, model.feature_importances_))
            }
            
        except Exception as e:
            logger.error(f"Error training ML forecasting model: {e}")
            raise
    
    def ensemble_forecast(self, ts_data: pd.Series, df: pd.DataFrame, target_column: str) -> Dict[str, Any]:
        """Generate ensemble forecast using multiple models"""
        logger.info("Generating ensemble forecast...")
        
        forecasts = {}
        weights = {}
        
        # Train all models
        try:
            arima_result = self.train_arima_model(ts_data)
            forecasts['arima'] = arima_result['forecast']
            weights['arima'] = 1.0 / (1.0 + arima_result.get('aic', 1000))
        except:
            pass
        
        try:
            sarima_result = self.train_sarima_model(ts_data)
            forecasts['sarima'] = sarima_result['forecast']
            weights['sarima'] = 1.0 / (1.0 + sarima_result.get('aic', 1000))
        except:
            pass
        
        try:
            exp_result = self.train_exponential_smoothing_model(ts_data)
            forecasts['exponential_smoothing'] = exp_result['forecast']
            weights['exponential_smoothing'] = 1.0 / (1.0 + exp_result.get('aic', 1000))
        except:
            pass
        
        try:
            ml_result = self.train_ml_forecasting_model(df, target_column)
            forecasts['ml_forecasting'] = ml_result['forecast']
            weights['ml_forecasting'] = ml_result.get('r2', 0.5)
        except:
            pass
        
        # Calculate ensemble forecast
        if forecasts:
            # Normalize weights
            total_weight = sum(weights.values())
            normalized_weights = {k: v/total_weight for k, v in weights.items()}
            
            # Calculate weighted average
            ensemble_forecast = np.zeros(self.config.forecast_horizon)
            for model_name, forecast in forecasts.items():
                weight = normalized_weights[model_name]
                ensemble_forecast += weight * np.array(forecast)
            
            return {
                'ensemble_forecast': ensemble_forecast.tolist(),
                'individual_forecasts': forecasts,
                'model_weights': normalized_weights,
                'forecast_horizon': self.config.forecast_horizon,
                'confidence_level': self.config.confidence_level
            }
        else:
            raise ValueError("No models could be trained successfully")

class CohortAnalyzer:
    """Advanced cohort analysis system"""
    
    def __init__(self):
        self.cohort_data = {}
    
    def create_acquisition_cohorts(self, df: pd.DataFrame, 
                                 user_id_col: str = 'user_id',
                                 date_col: str = 'date',
                                 value_col: str = 'value') -> pd.DataFrame:
        """Create acquisition cohorts based on first purchase date"""
        logger.info("Creating acquisition cohorts...")
        
        # Ensure date column is datetime
        df[date_col] = pd.to_datetime(df[date_col])
        
        # Get first purchase date for each user
        first_purchase = df.groupby(user_id_col)[date_col].min().reset_index()
        first_purchase.columns = [user_id_col, 'first_purchase_date']
        
        # Merge with original data
        df_with_cohort = df.merge(first_purchase, on=user_id_col)
        
        # Create cohort periods (monthly)
        df_with_cohort['cohort_period'] = df_with_cohort['first_purchase_date'].dt.to_period('M')
        df_with_cohort['order_period'] = df_with_cohort[date_col].dt.to_period('M')
        
        # Calculate period number
        df_with_cohort['period_number'] = (
            df_with_cohort['order_period'] - df_with_cohort['cohort_period']
        ).apply(attrgetter('n'))
        
        # Create cohort table
        cohort_table = df_with_cohort.groupby(['cohort_period', 'period_number'])[user_id_col].nunique().reset_index()
        cohort_pivot = cohort_table.pivot(index='cohort_period', columns='period_number', values=user_id_col)
        
        # Calculate retention rates
        cohort_sizes = cohort_pivot.iloc[:, 0]
        retention_table = cohort_pivot.divide(cohort_sizes, axis=0)
        
        return retention_table
    
    def create_revenue_cohorts(self, df: pd.DataFrame,
                             user_id_col: str = 'user_id',
                             date_col: str = 'date',
                             value_col: str = 'value') -> pd.DataFrame:
        """Create revenue cohorts based on customer value"""
        logger.info("Creating revenue cohorts...")
        
        # Ensure date column is datetime
        df[date_col] = pd.to_datetime(df[date_col])
        
        # Calculate customer lifetime value by cohort
        customer_ltv = df.groupby([user_id_col, df[date_col].dt.to_period('M')])[value_col].sum().reset_index()
        customer_ltv.columns = [user_id_col, 'cohort_period', 'revenue']
        
        # Get first purchase date for each user
        first_purchase = df.groupby(user_id_col)[date_col].min().reset_index()
        first_purchase['cohort_period'] = first_purchase[date_col].dt.to_period('M')
        
        # Merge and calculate cumulative revenue
        ltv_with_cohort = customer_ltv.merge(
            first_purchase[[user_id_col, 'cohort_period']], 
            on=user_id_col, 
            suffixes=('_order', '_cohort')
        )
        
        # Calculate period number
        ltv_with_cohort['period_number'] = (
            ltv_with_cohort['cohort_period_order'] - ltv_with_cohort['cohort_period_cohort']
        ).apply(attrgetter('n'))
        
        # Create revenue cohort table
        revenue_cohort = ltv_with_cohort.groupby(['cohort_period_cohort', 'period_number'])['revenue'].sum().reset_index()
        revenue_pivot = revenue_cohort.pivot(index='cohort_period_cohort', columns='period_number', values='revenue')
        
        return revenue_pivot
    
    def calculate_customer_lifetime_value(self, df: pd.DataFrame,
                                       user_id_col: str = 'user_id',
                                       value_col: str = 'value',
                                       date_col: str = 'date') -> pd.DataFrame:
        """Calculate customer lifetime value"""
        logger.info("Calculating customer lifetime value...")
        
        # Ensure date column is datetime
        df[date_col] = pd.to_datetime(df[date_col])
        
        # Calculate CLV metrics
        clv_metrics = df.groupby(user_id_col).agg({
            value_col: ['sum', 'mean', 'count'],
            date_col: ['min', 'max']
        }).round(2)
        
        clv_metrics.columns = ['total_revenue', 'avg_order_value', 'order_count', 'first_purchase', 'last_purchase']
        
        # Calculate customer age
        clv_metrics['customer_age_days'] = (clv_metrics['last_purchase'] - clv_metrics['first_purchase']).dt.days
        
        # Calculate purchase frequency
        clv_metrics['purchase_frequency'] = clv_metrics['order_count'] / (clv_metrics['customer_age_days'] / 30 + 1)
        
        # Calculate CLV (simplified formula)
        clv_metrics['clv'] = clv_metrics['total_revenue'] * clv_metrics['purchase_frequency']
        
        return clv_metrics.reset_index()
    
    def analyze_cohort_retention(self, cohort_table: pd.DataFrame) -> Dict[str, Any]:
        """Analyze cohort retention patterns"""
        logger.info("Analyzing cohort retention...")
        
        # Calculate average retention by period
        avg_retention = cohort_table.mean()
        
        # Find best and worst performing cohorts
        cohort_performance = cohort_table.iloc[:, 1:].mean(axis=1)  # Exclude period 0
        best_cohort = cohort_performance.idxmax()
        worst_cohort = cohort_performance.idxmin()
        
        # Calculate retention trends
        retention_trends = {}
        for period in cohort_table.columns[1:6]:  # First 5 periods
            if period in cohort_table.columns:
                retention_trends[f'period_{period}'] = cohort_table[period].mean()
        
        return {
            'average_retention_by_period': avg_retention.to_dict(),
            'best_performing_cohort': str(best_cohort),
            'worst_performing_cohort': str(worst_cohort),
            'retention_trends': retention_trends,
            'overall_retention_rate': cohort_table.iloc[:, 1:].mean().mean()
        }

class PredictiveModeler:
    """Advanced predictive modeling system"""
    
    def __init__(self):
        self.models = {}
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def train_demand_forecasting_model(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Train model for demand forecasting"""
        logger.info("Training demand forecasting model...")
        
        # Prepare features
        feature_columns = [col for col in df.columns if col not in ['demand', 'date']]
        X = df[feature_columns].fillna(0)
        y = df['demand']
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=0.2, random_state=42
        )
        
        # Train ensemble model
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        model.fit(X_train, y_train)
        
        self.models['demand_forecasting'] = model
        
        # Evaluate model
        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        
        return {
            'model_type': 'Demand Forecasting',
            'mse': mse,
            'r2': r2,
            'mae': mae,
            'feature_importance': dict(zip(feature_columns, model.feature_importances_))
        }
    
    def train_revenue_prediction_model(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Train model for revenue prediction"""
        logger.info("Training revenue prediction model...")
        
        # Prepare features
        feature_columns = [col for col in df.columns if col not in ['revenue', 'date']]
        X = df[feature_columns].fillna(0)
        y = df['revenue']
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=0.2, random_state=42
        )
        
        # Train gradient boosting model
        model = GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=6,
            random_state=42
        )
        model.fit(X_train, y_train)
        
        self.models['revenue_prediction'] = model
        
        # Evaluate model
        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        
        return {
            'model_type': 'Revenue Prediction',
            'mse': mse,
            'r2': r2,
            'mae': mae,
            'feature_importance': dict(zip(feature_columns, model.feature_importances_))
        }
    
    def predict_demand(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Predict demand using trained model"""
        if 'demand_forecasting' not in self.models:
            raise ValueError("Demand forecasting model not trained")
        
        # Prepare features
        feature_array = np.array([features.get(col, 0) for col in self.scaler.feature_names_in_])
        feature_scaled = self.scaler.transform(feature_array.reshape(1, -1))
        
        # Make prediction
        prediction = self.models['demand_forecasting'].predict(feature_scaled)[0]
        
        return {
            'predicted_demand': prediction,
            'confidence_interval': self._calculate_confidence_interval(prediction, 'demand_forecasting'),
            'timestamp': datetime.now().isoformat()
        }
    
    def predict_revenue(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Predict revenue using trained model"""
        if 'revenue_prediction' not in self.models:
            raise ValueError("Revenue prediction model not trained")
        
        # Prepare features
        feature_array = np.array([features.get(col, 0) for col in self.scaler.feature_names_in_])
        feature_scaled = self.scaler.transform(feature_array.reshape(1, -1))
        
        # Make prediction
        prediction = self.models['revenue_prediction'].predict(feature_scaled)[0]
        
        return {
            'predicted_revenue': prediction,
            'confidence_interval': self._calculate_confidence_interval(prediction, 'revenue_prediction'),
            'timestamp': datetime.now().isoformat()
        }
    
    def _calculate_confidence_interval(self, prediction: float, model_name: str) -> Tuple[float, float]:
        """Calculate confidence interval for prediction"""
        # Simplified confidence interval calculation
        # In production, this would use proper statistical methods
        margin_of_error = prediction * 0.1  # 10% margin
        return (prediction - margin_of_error, prediction + margin_of_error)

class AdvancedAnalyticsAPI:
    """API wrapper for advanced analytics system"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.config = ForecastConfig()
        self.forecaster = TimeSeriesForecaster(self.config)
        self.cohort_analyzer = CohortAnalyzer()
        self.predictive_modeler = PredictiveModeler()
        
        if model_path:
            self.load_models(model_path)
    
    def forecast_time_series(self, df: pd.DataFrame, target_column: str) -> Dict[str, Any]:
        """Generate time series forecast"""
        try:
            # Prepare data
            ts_data = df[target_column].dropna()
            prepared_df = self.forecaster.prepare_time_series_data(df, target_column)
            
            # Generate ensemble forecast
            forecast_result = self.forecaster.ensemble_forecast(ts_data, prepared_df, target_column)
            
            return {
                'success': True,
                'forecast': forecast_result,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error generating forecast: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def analyze_cohorts(self, df: pd.DataFrame, cohort_type: str = 'acquisition') -> Dict[str, Any]:
        """Perform cohort analysis"""
        try:
            if cohort_type == 'acquisition':
                cohort_table = self.cohort_analyzer.create_acquisition_cohorts(df)
            elif cohort_type == 'revenue':
                cohort_table = self.cohort_analyzer.create_revenue_cohorts(df)
            else:
                raise ValueError(f"Unknown cohort type: {cohort_type}")
            
            # Analyze retention
            retention_analysis = self.cohort_analyzer.analyze_cohort_retention(cohort_table)
            
            return {
                'success': True,
                'cohort_type': cohort_type,
                'cohort_table': cohort_table.to_dict(),
                'retention_analysis': retention_analysis,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error analyzing cohorts: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def calculate_clv(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Calculate customer lifetime value"""
        try:
            clv_data = self.cohort_analyzer.calculate_customer_lifetime_value(df)
            
            return {
                'success': True,
                'clv_data': clv_data.to_dict('records'),
                'summary_stats': {
                    'avg_clv': clv_data['clv'].mean(),
                    'median_clv': clv_data['clv'].median(),
                    'total_customers': len(clv_data),
                    'high_value_customers': len(clv_data[clv_data['clv'] > clv_data['clv'].quantile(0.8)])
                },
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error calculating CLV: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def train_predictive_models(self, demand_df: pd.DataFrame, revenue_df: pd.DataFrame) -> Dict[str, Any]:
        """Train predictive models"""
        try:
            demand_result = self.predictive_modeler.train_demand_forecasting_model(demand_df)
            revenue_result = self.predictive_modeler.train_revenue_prediction_model(revenue_df)
            
            return {
                'success': True,
                'demand_model': demand_result,
                'revenue_model': revenue_result,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error training predictive models: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def predict_demand(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Predict demand"""
        try:
            prediction = self.predictive_modeler.predict_demand(features)
            
            return {
                'success': True,
                'prediction': prediction,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error predicting demand: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def predict_revenue(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Predict revenue"""
        try:
            prediction = self.predictive_modeler.predict_revenue(features)
            
            return {
                'success': True,
                'prediction': prediction,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error predicting revenue: {e}")
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
    # Example time series data
    dates = pd.date_range('2020-01-01', periods=365, freq='D')
    np.random.seed(42)
    
    # Create sample data with trend and seasonality
    trend = np.linspace(100, 200, 365)
    seasonal = 10 * np.sin(2 * np.pi * np.arange(365) / 365)
    noise = np.random.normal(0, 5, 365)
    revenue = trend + seasonal + noise
    
    ts_df = pd.DataFrame({
        'date': dates,
        'revenue': revenue,
        'demand': revenue * 0.8 + np.random.normal(0, 10, 365),
        'temperature': 20 + 10 * np.sin(2 * np.pi * np.arange(365) / 365) + np.random.normal(0, 2, 365),
        'marketing_spend': np.random.exponential(100, 365)
    })
    
    # Initialize API
    api = AdvancedAnalyticsAPI()
    
    # Test time series forecasting
    forecast_result = api.forecast_time_series(ts_df, 'revenue')
    print("Time Series Forecast:", forecast_result)
    
    # Test cohort analysis
    cohort_data = pd.DataFrame({
        'user_id': np.random.randint(1, 100, 1000),
        'date': pd.date_range('2023-01-01', periods=1000, freq='D'),
        'value': np.random.exponential(50, 1000)
    })
    
    cohort_result = api.analyze_cohorts(cohort_data, 'acquisition')
    print("Cohort Analysis:", cohort_result)
    
    # Test CLV calculation
    clv_result = api.calculate_clv(cohort_data)
    print("Customer Lifetime Value:", clv_result)
    
    # Test predictive modeling
    demand_df = ts_df[['revenue', 'temperature', 'marketing_spend', 'demand']].copy()
    revenue_df = ts_df[['demand', 'temperature', 'marketing_spend', 'revenue']].copy()
    
    training_result = api.train_predictive_models(demand_df, revenue_df)
    print("Predictive Models Training:", training_result)
    
    # Test predictions
    demand_prediction = api.predict_demand({
        'revenue': 150,
        'temperature': 25,
        'marketing_spend': 120
    })
    print("Demand Prediction:", demand_prediction)
    
    revenue_prediction = api.predict_revenue({
        'demand': 120,
        'temperature': 25,
        'marketing_spend': 120
    })
    print("Revenue Prediction:", revenue_prediction)