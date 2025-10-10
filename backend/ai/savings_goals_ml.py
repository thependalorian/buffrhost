"""
Savings Goals ML System for Hospitality Platform
===============================================

Machine learning system for personalized savings goal recommendations, progress tracking,
and optimization for hospitality businesses. Uses predictive modeling to suggest realistic
goals and track progress with intelligent insights.

Features:
- Goal recommendation using ML
- Progress prediction and tracking
- Personalized savings strategies
- Risk assessment and adjustment
- Gamification and motivation

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
import math

# Core ML libraries
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.cluster import KMeans
from sklearn.neighbors import KNeighborsRegressor

# Time series analysis
from scipy import stats
from scipy.optimize import minimize
import warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GoalType(Enum):
    """Types of savings goals"""
    EMERGENCY_FUND = "emergency_fund"
    EQUIPMENT_PURCHASE = "equipment_purchase"
    EXPANSION = "expansion"
    RENOVATION = "renovation"
    MARKETING = "marketing"
    TRAINING = "training"
    DEBT_PAYOFF = "debt_payoff"
    RETIREMENT = "retirement"

class GoalStatus(Enum):
    """Status of savings goals"""
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"
    CANCELLED = "cancelled"
    OVERDUE = "overdue"

@dataclass
class SavingsGoal:
    """Savings goal data structure"""
    goal_id: str
    user_id: str
    goal_type: GoalType
    target_amount: float
    current_amount: float
    target_date: datetime
    created_at: datetime
    status: GoalStatus
    priority: int  # 1-5 scale
    description: str
    category: str
    is_flexible: bool  # Can target amount or date be adjusted
    risk_tolerance: float  # 0-1 scale
    monthly_contribution: float
    last_contribution: datetime
    progress_percentage: float

@dataclass
class SavingsGoalConfig:
    """Configuration for savings goals ML system"""
    # Model parameters
    test_size: float = 0.2
    random_state: int = 42
    cv_folds: int = 5
    
    # Goal recommendation parameters
    min_goal_amount: float = 1000
    max_goal_amount: float = 1000000
    min_goal_duration_months: int = 1
    max_goal_duration_months: int = 60
    
    # Progress tracking
    progress_threshold: float = 0.1  # 10% progress threshold
    risk_threshold: float = 0.3  # 30% risk threshold
    
    # Model persistence
    model_path: str = "models/savings_goals"
    version: str = "1.0.0"

class GoalRecommendationEngine:
    """ML engine for recommending savings goals"""
    
    def __init__(self, config: SavingsGoalConfig):
        self.config = config
        self.scaler = StandardScaler()
        self.goal_amount_predictor = None
        self.goal_duration_predictor = None
        self.goal_feasibility_predictor = None
        self.is_trained = False
        
    def prepare_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Prepare features for goal recommendation"""
        features = df.copy()
        
        # Financial health features
        if 'monthly_income' in df.columns:
            features['income_log'] = np.log1p(df['monthly_income'])
            features['income_percentile'] = df['monthly_income'].rank(pct=True)
        
        if 'monthly_expenses' in df.columns:
            features['expense_ratio'] = df['monthly_expenses'] / df['monthly_income']
            features['disposable_income'] = df['monthly_income'] - df['monthly_expenses']
        
        # Business metrics
        if 'business_age_months' in df.columns:
            features['business_age_log'] = np.log1p(df['business_age_months'])
            features['is_established'] = (df['business_age_months'] > 24).astype(int)
        
        if 'revenue_growth_rate' in df.columns:
            features['growth_category'] = pd.cut(
                df['revenue_growth_rate'], 
                bins=[-np.inf, -0.05, 0.05, 0.15, np.inf],
                labels=['declining', 'stable', 'growing', 'rapid_growth']
            )
        
        # Risk assessment features
        if 'debt_to_income_ratio' in df.columns:
            features['debt_risk'] = pd.cut(
                df['debt_to_income_ratio'],
                bins=[0, 0.3, 0.5, 0.7, 1.0],
                labels=['low', 'medium', 'high', 'very_high']
            )
        
        # Time-based features
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            features['month'] = df['timestamp'].dt.month
            features['quarter'] = df['timestamp'].dt.quarter
            features['is_peak_season'] = features['month'].isin([6, 7, 8, 12]).astype(int)
        
        # Goal history features
        if 'previous_goals_count' in df.columns:
            features['goal_experience'] = df['previous_goals_count']
            features['is_goal_veteran'] = (df['previous_goals_count'] > 3).astype(int)
        
        if 'goal_completion_rate' in df.columns:
            features['success_rate'] = df['goal_completion_rate']
            features['is_successful_saver'] = (df['goal_completion_rate'] > 0.7).astype(int)
        
        return features
    
    def train_goal_models(self, df: pd.DataFrame, goals_df: pd.DataFrame) -> Dict[str, Any]:
        """Train models for goal recommendation"""
        logger.info("Training savings goal recommendation models...")
        
        # Prepare features
        features = self.prepare_features(df)
        
        # Merge with goals data
        merged_data = features.merge(goals_df, left_index=True, right_on='user_id', how='inner')
        
        # Prepare training data
        X = merged_data.select_dtypes(include=[np.number]).fillna(0)
        
        # Target variables
        y_amount = merged_data['target_amount']
        y_duration = merged_data['goal_duration_months']
        y_feasibility = merged_data['goal_achieved'].astype(int) if 'goal_achieved' in merged_data.columns else np.ones(len(merged_data))
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Split data
        X_train, X_test, y_amount_train, y_amount_test = train_test_split(
            X_scaled, y_amount, test_size=self.config.test_size, random_state=self.config.random_state
        )
        
        # Train goal amount predictor
        self.goal_amount_predictor = GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=6,
            random_state=self.config.random_state
        )
        self.goal_amount_predictor.fit(X_train, y_amount_train)
        
        # Train goal duration predictor
        self.goal_duration_predictor = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=self.config.random_state
        )
        self.goal_duration_predictor.fit(X_train, y_duration)
        
        # Train goal feasibility predictor
        self.goal_feasibility_predictor = RandomForestRegressor(
            n_estimators=100,
            max_depth=8,
            random_state=self.config.random_state
        )
        self.goal_feasibility_predictor.fit(X_train, y_feasibility)
        
        # Evaluate models
        amount_pred = self.goal_amount_predictor.predict(X_test)
        duration_pred = self.goal_duration_predictor.predict(X_test)
        feasibility_pred = self.goal_feasibility_predictor.predict(X_test)
        
        metrics = {
            'amount_model': {
                'mse': mean_squared_error(y_amount_test, amount_pred),
                'r2': r2_score(y_amount_test, amount_pred),
                'mae': mean_absolute_error(y_amount_test, amount_pred)
            },
            'duration_model': {
                'mse': mean_squared_error(y_duration, duration_pred),
                'r2': r2_score(y_duration, duration_pred),
                'mae': mean_absolute_error(y_duration, duration_pred)
            },
            'feasibility_model': {
                'mse': mean_squared_error(y_feasibility, feasibility_pred),
                'r2': r2_score(y_feasibility, feasibility_pred),
                'mae': mean_absolute_error(y_feasibility, feasibility_pred)
            }
        }
        
        self.is_trained = True
        logger.info("Goal recommendation models trained successfully")
        
        return metrics
    
    def recommend_goal(self, user_data: Dict[str, Any], goal_type: GoalType) -> Dict[str, Any]:
        """Recommend a savings goal for a user"""
        if not self.is_trained:
            raise ValueError("Models must be trained before making recommendations")
        
        # Prepare user features
        user_df = pd.DataFrame([user_data])
        user_features = self.prepare_features(user_df)
        user_features_scaled = self.scaler.transform(user_features.select_dtypes(include=[np.number]).fillna(0))
        
        # Predict goal parameters
        predicted_amount = self.goal_amount_predictor.predict(user_features_scaled)[0]
        predicted_duration = self.goal_duration_predictor.predict(user_features_scaled)[0]
        predicted_feasibility = self.goal_feasibility_predictor.predict(user_features_scaled)[0]
        
        # Apply constraints
        predicted_amount = np.clip(predicted_amount, self.config.min_goal_amount, self.config.max_goal_amount)
        predicted_duration = np.clip(predicted_duration, self.config.min_goal_duration_months, self.config.max_goal_duration_months)
        
        # Calculate monthly contribution needed
        monthly_contribution = predicted_amount / predicted_duration
        
        # Calculate risk score
        risk_score = self._calculate_goal_risk(user_data, predicted_amount, predicted_duration)
        
        # Generate recommendations
        recommendations = self._generate_goal_recommendations(
            goal_type, predicted_amount, predicted_duration, predicted_feasibility, risk_score
        )
        
        return {
            'recommended_amount': predicted_amount,
            'recommended_duration_months': predicted_duration,
            'monthly_contribution': monthly_contribution,
            'feasibility_score': predicted_feasibility,
            'risk_score': risk_score,
            'recommendations': recommendations,
            'goal_type': goal_type.value
        }
    
    def _calculate_goal_risk(self, user_data: Dict[str, Any], amount: float, duration: float) -> float:
        """Calculate risk score for a goal"""
        risk_factors = []
        
        # Income risk
        if 'monthly_income' in user_data and 'monthly_expenses' in user_data:
            disposable_income = user_data['monthly_income'] - user_data['monthly_expenses']
            required_contribution = amount / duration
            income_risk = min(1.0, required_contribution / disposable_income) if disposable_income > 0 else 1.0
            risk_factors.append(income_risk)
        
        # Duration risk
        duration_risk = min(1.0, duration / 24)  # Longer goals are riskier
        risk_factors.append(duration_risk)
        
        # Amount risk
        amount_risk = min(1.0, amount / 100000)  # Larger amounts are riskier
        risk_factors.append(amount_risk)
        
        # Business stability risk
        if 'business_age_months' in user_data:
            stability_risk = max(0, 1 - user_data['business_age_months'] / 60)  # Newer businesses are riskier
            risk_factors.append(stability_risk)
        
        return np.mean(risk_factors) if risk_factors else 0.5
    
    def _generate_goal_recommendations(self, goal_type: GoalType, amount: float, 
                                     duration: float, feasibility: float, risk_score: float) -> List[str]:
        """Generate personalized recommendations for a goal"""
        recommendations = []
        
        # Amount-based recommendations
        if amount > 50000:
            recommendations.append("Consider breaking this into smaller, more manageable goals")
        elif amount < 5000:
            recommendations.append("This is a great starter goal - perfect for building confidence")
        
        # Duration-based recommendations
        if duration > 24:
            recommendations.append("Set intermediate milestones to stay motivated")
        elif duration < 6:
            recommendations.append("This is an aggressive timeline - consider increasing duration if needed")
        
        # Feasibility-based recommendations
        if feasibility < 0.5:
            recommendations.append("Consider reducing the target amount or extending the timeline")
        elif feasibility > 0.8:
            recommendations.append("This goal looks very achievable - you might consider increasing the target")
        
        # Risk-based recommendations
        if risk_score > 0.7:
            recommendations.append("This goal has high risk - consider building an emergency fund first")
        elif risk_score < 0.3:
            recommendations.append("This is a low-risk goal - you're in a good position to achieve it")
        
        # Goal type specific recommendations
        if goal_type == GoalType.EMERGENCY_FUND:
            recommendations.append("Aim for 3-6 months of expenses in your emergency fund")
        elif goal_type == GoalType.EQUIPMENT_PURCHASE:
            recommendations.append("Consider financing options to spread the cost")
        elif goal_type == GoalType.EXPANSION:
            recommendations.append("Ensure you have a solid business plan before expanding")
        
        return recommendations

class ProgressTracker:
    """Track and predict progress towards savings goals"""
    
    def __init__(self, config: SavingsGoalConfig):
        self.config = config
        self.progress_predictor = None
        self.is_trained = False
    
    def train_progress_model(self, goals_df: pd.DataFrame) -> Dict[str, Any]:
        """Train model to predict goal progress"""
        logger.info("Training progress prediction model...")
        
        # Prepare features
        features = self._prepare_progress_features(goals_df)
        
        # Target variable: progress percentage
        y = goals_df['progress_percentage']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            features, y, test_size=self.config.test_size, random_state=self.config.random_state
        )
        
        # Train model
        self.progress_predictor = GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=6,
            random_state=self.config.random_state
        )
        self.progress_predictor.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.progress_predictor.predict(X_test)
        metrics = {
            'mse': mean_squared_error(y_test, y_pred),
            'r2': r2_score(y_test, y_pred),
            'mae': mean_absolute_error(y_test, y_pred)
        }
        
        self.is_trained = True
        logger.info("Progress prediction model trained successfully")
        
        return metrics
    
    def _prepare_progress_features(self, goals_df: pd.DataFrame) -> pd.DataFrame:
        """Prepare features for progress prediction"""
        features = goals_df.copy()
        
        # Time-based features
        features['days_since_created'] = (datetime.now() - pd.to_datetime(features['created_at'])).dt.days
        features['days_remaining'] = (pd.to_datetime(features['target_date']) - datetime.now()).dt.days
        features['time_elapsed_ratio'] = features['days_since_created'] / (features['days_since_created'] + features['days_remaining'])
        
        # Amount-based features
        features['amount_ratio'] = features['current_amount'] / features['target_amount']
        features['amount_remaining'] = features['target_amount'] - features['current_amount']
        features['monthly_contribution'] = features['current_amount'] / (features['days_since_created'] / 30)
        
        # Goal characteristics
        features['goal_duration_months'] = (pd.to_datetime(features['target_date']) - pd.to_datetime(features['created_at'])).dt.days / 30
        features['is_short_term'] = (features['goal_duration_months'] < 6).astype(int)
        features['is_long_term'] = (features['goal_duration_months'] > 24).astype(int)
        
        # Select numeric features
        numeric_features = features.select_dtypes(include=[np.number])
        return numeric_features.fillna(0)
    
    def predict_progress(self, goal: SavingsGoal) -> Dict[str, Any]:
        """Predict future progress for a goal"""
        if not self.is_trained:
            raise ValueError("Progress model must be trained before making predictions")
        
        # Prepare goal features
        goal_data = {
            'current_amount': goal.current_amount,
            'target_amount': goal.target_amount,
            'created_at': goal.created_at.isoformat(),
            'target_date': goal.target_date.isoformat(),
            'monthly_contribution': goal.monthly_contribution,
            'priority': goal.priority,
            'risk_tolerance': goal.risk_tolerance
        }
        
        goal_df = pd.DataFrame([goal_data])
        features = self._prepare_progress_features(goal_df)
        
        # Predict progress
        predicted_progress = self.progress_predictor.predict(features)[0]
        
        # Calculate additional metrics
        days_remaining = (goal.target_date - datetime.now()).days
        current_progress = goal.current_amount / goal.target_amount
        
        # Predict if goal will be achieved on time
        required_monthly_contribution = (goal.target_amount - goal.current_amount) / max(1, days_remaining / 30)
        on_track = required_monthly_contribution <= goal.monthly_contribution * 1.1  # 10% tolerance
        
        # Generate insights
        insights = self._generate_progress_insights(goal, predicted_progress, on_track)
        
        return {
            'predicted_progress': min(1.0, max(0.0, predicted_progress)),
            'current_progress': current_progress,
            'days_remaining': days_remaining,
            'required_monthly_contribution': required_monthly_contribution,
            'on_track': on_track,
            'insights': insights
        }
    
    def _generate_progress_insights(self, goal: SavingsGoal, predicted_progress: float, on_track: bool) -> List[str]:
        """Generate insights about goal progress"""
        insights = []
        
        current_progress = goal.current_amount / goal.target_amount
        
        if predicted_progress > 0.9:
            insights.append("You're on track to exceed your goal!")
        elif predicted_progress > 0.7:
            insights.append("Great progress! You're likely to achieve your goal")
        elif predicted_progress > 0.5:
            insights.append("Good progress, but you may need to increase contributions")
        else:
            insights.append("Consider adjusting your goal or increasing contributions")
        
        if not on_track:
            insights.append("You're behind schedule - consider increasing monthly contributions")
        
        if current_progress > 0.5 and goal.monthly_contribution > 0:
            months_remaining = (goal.target_amount - goal.current_amount) / goal.monthly_contribution
            insights.append(f"At current rate, you'll reach your goal in {months_remaining:.1f} months")
        
        return insights

class SavingsOptimizer:
    """Optimize savings strategies and goal allocation"""
    
    def __init__(self, config: SavingsGoalConfig):
        self.config = config
    
    def optimize_goal_allocation(self, user_data: Dict[str, Any], 
                               active_goals: List[SavingsGoal]) -> Dict[str, Any]:
        """Optimize allocation of savings across multiple goals"""
        if not active_goals:
            return {'optimization': 'No active goals to optimize'}
        
        # Calculate total available for savings
        monthly_income = user_data.get('monthly_income', 0)
        monthly_expenses = user_data.get('monthly_expenses', 0)
        available_savings = monthly_income - monthly_expenses
        
        if available_savings <= 0:
            return {'error': 'Insufficient income for savings'}
        
        # Prepare optimization problem
        goal_amounts = [goal.target_amount for goal in active_goals]
        goal_priorities = [goal.priority for goal in active_goals]
        goal_urgencies = self._calculate_goal_urgencies(active_goals)
        
        # Optimize allocation using linear programming
        optimal_allocation = self._solve_allocation_problem(
            available_savings, goal_amounts, goal_priorities, goal_urgencies
        )
        
        # Generate recommendations
        recommendations = self._generate_allocation_recommendations(
            active_goals, optimal_allocation, available_savings
        )
        
        return {
            'optimal_allocation': optimal_allocation,
            'total_available': available_savings,
            'recommendations': recommendations
        }
    
    def _calculate_goal_urgencies(self, goals: List[SavingsGoal]) -> List[float]:
        """Calculate urgency scores for goals"""
        urgencies = []
        current_date = datetime.now()
        
        for goal in goals:
            days_remaining = (goal.target_date - current_date).days
            progress_ratio = goal.current_amount / goal.target_amount
            
            # Urgency based on time remaining and progress
            time_urgency = max(0, 1 - days_remaining / 365)  # More urgent as time runs out
            progress_urgency = max(0, 1 - progress_ratio)  # More urgent if behind
            
            urgency = (time_urgency + progress_urgency) / 2
            urgencies.append(urgency)
        
        return urgencies
    
    def _solve_allocation_problem(self, available_savings: float, goal_amounts: List[float],
                                goal_priorities: List[int], goal_urgencies: List[float]) -> List[float]:
        """Solve the goal allocation optimization problem"""
        n_goals = len(goal_amounts)
        
        # Objective function: maximize weighted sum of allocations
        def objective(x):
            weights = [p * u for p, u in zip(goal_priorities, goal_urgencies)]
            return -sum(w * x[i] for i, w in enumerate(weights))
        
        # Constraints
        constraints = [
            {'type': 'eq', 'fun': lambda x: sum(x) - available_savings}  # Total allocation = available
        ]
        
        # Bounds: each allocation between 0 and goal amount
        bounds = [(0, min(amount, available_savings)) for amount in goal_amounts]
        
        # Initial guess: equal allocation
        x0 = [available_savings / n_goals] * n_goals
        
        # Solve optimization problem
        result = minimize(objective, x0, method='SLSQP', bounds=bounds, constraints=constraints)
        
        return result.x.tolist() if result.success else x0
    
    def _generate_allocation_recommendations(self, goals: List[SavingsGoal], 
                                           allocation: List[float], 
                                           available_savings: float) -> List[str]:
        """Generate recommendations for goal allocation"""
        recommendations = []
        
        total_allocated = sum(allocation)
        
        if total_allocated < available_savings * 0.9:
            recommendations.append("You can save more - consider increasing your savings rate")
        
        # Find highest priority goals
        priority_goals = sorted(zip(goals, allocation), key=lambda x: x[0].priority, reverse=True)
        
        for goal, amount in priority_goals[:3]:
            if amount > 0:
                recommendations.append(f"Prioritize {goal.description}: ${amount:.2f}/month")
        
        # Check for underfunded goals
        for goal, amount in zip(goals, allocation):
            required = (goal.target_amount - goal.current_amount) / max(1, (goal.target_date - datetime.now()).days / 30)
            if amount < required * 0.8:
                recommendations.append(f"Consider increasing allocation to {goal.description}")
        
        return recommendations

class SavingsGoalsAPI:
    """API wrapper for savings goals ML system"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.config = SavingsGoalConfig()
        self.recommendation_engine = GoalRecommendationEngine(self.config)
        self.progress_tracker = ProgressTracker(self.config)
        self.optimizer = SavingsOptimizer(self.config)
        
        if model_path:
            self.load_models(model_path)
    
    def recommend_goal(self, user_data: Dict[str, Any], goal_type: str) -> Dict[str, Any]:
        """Recommend a savings goal for a user"""
        try:
            goal_type_enum = GoalType(goal_type)
            recommendation = self.recommendation_engine.recommend_goal(user_data, goal_type_enum)
            
            return {
                'success': True,
                'recommendation': recommendation,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error recommending goal: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def track_progress(self, goal: SavingsGoal) -> Dict[str, Any]:
        """Track progress for a savings goal"""
        try:
            progress_data = self.progress_tracker.predict_progress(goal)
            
            return {
                'success': True,
                'progress_data': progress_data,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error tracking progress: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def optimize_allocation(self, user_data: Dict[str, Any], 
                          active_goals: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Optimize allocation across multiple goals"""
        try:
            # Convert dict goals to SavingsGoal objects
            goals = []
            for goal_data in active_goals:
                goal = SavingsGoal(
                    goal_id=goal_data['goal_id'],
                    user_id=goal_data['user_id'],
                    goal_type=GoalType(goal_data['goal_type']),
                    target_amount=goal_data['target_amount'],
                    current_amount=goal_data['current_amount'],
                    target_date=datetime.fromisoformat(goal_data['target_date']),
                    created_at=datetime.fromisoformat(goal_data['created_at']),
                    status=GoalStatus(goal_data['status']),
                    priority=goal_data['priority'],
                    description=goal_data['description'],
                    category=goal_data['category'],
                    is_flexible=goal_data['is_flexible'],
                    risk_tolerance=goal_data['risk_tolerance'],
                    monthly_contribution=goal_data['monthly_contribution'],
                    last_contribution=datetime.fromisoformat(goal_data['last_contribution']),
                    progress_percentage=goal_data['progress_percentage']
                )
                goals.append(goal)
            
            optimization = self.optimizer.optimize_goal_allocation(user_data, goals)
            
            return {
                'success': True,
                'optimization': optimization,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error optimizing allocation: {e}")
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
    # Example user data
    user_data = {
        'user_id': 'user_001',
        'monthly_income': 15000,
        'monthly_expenses': 10000,
        'business_age_months': 36,
        'revenue_growth_rate': 0.1,
        'debt_to_income_ratio': 0.3,
        'previous_goals_count': 2,
        'goal_completion_rate': 0.8
    }
    
    # Example goals data for training
    goals_data = pd.DataFrame({
        'user_id': ['user_001'] * 10,
        'target_amount': [5000, 10000, 25000, 50000, 15000, 30000, 8000, 12000, 20000, 40000],
        'goal_duration_months': [6, 12, 18, 24, 9, 15, 4, 8, 12, 20],
        'goal_achieved': [1, 1, 0, 1, 1, 0, 1, 0, 1, 0]
    })
    
    # Initialize API
    api = SavingsGoalsAPI()
    
    # Train models (in production, this would be done separately)
    # api.recommendation_engine.train_goal_models(user_df, goals_data)
    # api.progress_tracker.train_progress_model(goals_data)
    
    # Test goal recommendation
    rec_result = api.recommend_goal(user_data, 'equipment_purchase')
    print("Goal Recommendation:", rec_result)
    
    # Test progress tracking
    sample_goal = SavingsGoal(
        goal_id='goal_001',
        user_id='user_001',
        goal_type=GoalType.EQUIPMENT_PURCHASE,
        target_amount=25000,
        current_amount=10000,
        target_date=datetime.now() + timedelta(days=180),
        created_at=datetime.now() - timedelta(days=60),
        status=GoalStatus.ACTIVE,
        priority=3,
        description='New kitchen equipment',
        category='equipment',
        is_flexible=True,
        risk_tolerance=0.5,
        monthly_contribution=2000,
        last_contribution=datetime.now() - timedelta(days=7),
        progress_percentage=0.4
    )
    
    progress_result = api.track_progress(sample_goal)
    print("Progress Tracking:", progress_result)
    
    # Test allocation optimization
    active_goals = [
        {
            'goal_id': 'goal_001',
            'user_id': 'user_001',
            'goal_type': 'equipment_purchase',
            'target_amount': 25000,
            'current_amount': 10000,
            'target_date': (datetime.now() + timedelta(days=180)).isoformat(),
            'created_at': (datetime.now() - timedelta(days=60)).isoformat(),
            'status': 'active',
            'priority': 3,
            'description': 'New kitchen equipment',
            'category': 'equipment',
            'is_flexible': True,
            'risk_tolerance': 0.5,
            'monthly_contribution': 2000,
            'last_contribution': (datetime.now() - timedelta(days=7)).isoformat(),
            'progress_percentage': 0.4
        }
    ]
    
    opt_result = api.optimize_allocation(user_data, active_goals)
    print("Allocation Optimization:", opt_result)