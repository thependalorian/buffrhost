"""
Gamification ML System for Hospitality Platform
==============================================

AI-powered gamification system that uses machine learning to optimize user engagement,
reward systems, and behavioral analysis for hospitality businesses and their customers.

Features:
- Engagement scoring and prediction
- Reward optimization algorithms
- Behavioral pattern analysis
- Achievement system with ML-driven recommendations
- Social features and leaderboards
- Personalized challenge generation

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
from sklearn.cluster import KMeans, DBSCAN
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, r2_score, silhouette_score
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import NearestNeighbors

# Recommendation systems
from surprise import Dataset, Reader, SVD, KNNBasic
from surprise.model_selection import cross_validate

# Time series analysis
from scipy import stats
from scipy.optimize import minimize
import warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AchievementType(Enum):
    """Types of achievements"""
    MILESTONE = "milestone"
    STREAK = "streak"
    SOCIAL = "social"
    SKILL = "skill"
    EXPLORATION = "exploration"
    COLLECTION = "collection"
    CHALLENGE = "challenge"

class RewardType(Enum):
    """Types of rewards"""
    POINTS = "points"
    BADGES = "badges"
    DISCOUNTS = "discounts"
    UNLOCKABLES = "unlockables"
    STATUS = "status"
    CURRENCY = "currency"

class UserSegment(Enum):
    """User engagement segments"""
    CHAMPION = "champion"
    LOYAL_CUSTOMER = "loyal_customer"
    POTENTIAL_LOYALIST = "potential_loyalist"
    NEW_CUSTOMER = "new_customer"
    AT_RISK = "at_risk"
    CANT_LOSE = "cant_lose"
    HIBERNATING = "hibernating"
    LOST = "lost"

@dataclass
class Achievement:
    """Achievement data structure"""
    achievement_id: str
    name: str
    description: str
    achievement_type: AchievementType
    reward_type: RewardType
    reward_value: float
    requirements: Dict[str, Any]
    difficulty_level: int  # 1-5 scale
    category: str
    is_hidden: bool
    created_at: datetime
    expires_at: Optional[datetime] = None

@dataclass
class UserEngagementUser:
    """User engagement profile"""
    user_id: str
    engagement_score: float
    activity_frequency: float
    session_duration: float
    feature_usage: Dict[str, float]
    social_interactions: int
    achievement_count: int
    total_points: int
    current_streak: int
    longest_streak: int
    last_activity: datetime
    user_segment: UserSegment
    preferences: Dict[str, Any]
    behavioral_patterns: Dict[str, Any]

@dataclass
class GamificationConfig:
    """Configuration for gamification system"""
    # Engagement scoring
    engagement_weights: Dict[str, float] = None
    engagement_threshold: float = 0.5
    
    # Reward optimization
    reward_budget: float = 1000.0
    max_rewards_per_user: int = 10
    
    # Achievement system
    max_achievements_per_user: int = 50
    achievement_cooldown_hours: int = 24
    
    # Behavioral analysis
    clustering_algorithm: str = "kmeans"  # kmeans, dbscan
    n_clusters: int = 5
    
    # Model persistence
    model_path: str = "models/gamification"
    version: str = "1.0.0"
    
    def __post_init__(self):
        if self.engagement_weights is None:
            self.engagement_weights = {
                'activity_frequency': 0.3,
                'session_duration': 0.2,
                'feature_usage': 0.2,
                'social_interactions': 0.15,
                'achievement_count': 0.1,
                'streak_length': 0.05
            }

class EngagementScorer:
    """ML system for scoring user engagement"""
    
    def __init__(self, config: GamificationConfig):
        self.config = config
        self.engagement_model = None
        self.scaler = StandardScaler()
        self.is_trained = False
        
    def prepare_engagement_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Prepare features for engagement scoring"""
        features = df.copy()
        
        # Activity frequency features
        if 'login_count' in df.columns and 'days_since_registration' in df.columns:
            features['login_frequency'] = df['login_count'] / (df['days_since_registration'] + 1)
            features['daily_activity'] = df['login_count'] / 30  # Last 30 days
        
        # Session duration features
        if 'avg_session_duration' in df.columns:
            features['session_duration_log'] = np.log1p(df['avg_session_duration'])
            features['long_session_ratio'] = (df['avg_session_duration'] > df['avg_session_duration'].quantile(0.8)).astype(int)
        
        # Feature usage features
        feature_columns = [col for col in df.columns if col.startswith('feature_')]
        if feature_columns:
            features['feature_diversity'] = df[feature_columns].sum(axis=1)
            features['feature_consistency'] = df[feature_columns].std(axis=1)
        
        # Social interaction features
        if 'social_interactions' in df.columns:
            features['social_activity'] = df['social_interactions']
            features['is_social_user'] = (df['social_interactions'] > 0).astype(int)
        
        # Achievement features
        if 'achievement_count' in df.columns:
            features['achievement_rate'] = df['achievement_count'] / (df['days_since_registration'] + 1)
            features['is_achiever'] = (df['achievement_count'] > df['achievement_count'].quantile(0.7)).astype(int)
        
        # Streak features
        if 'current_streak' in df.columns:
            features['streak_strength'] = df['current_streak'] / (df['longest_streak'] + 1)
            features['is_streak_active'] = (df['current_streak'] > 0).astype(int)
        
        # Time-based features
        if 'last_activity' in df.columns:
            df['last_activity'] = pd.to_datetime(df['last_activity'])
            features['days_since_last_activity'] = (datetime.now() - df['last_activity']).dt.days
            features['is_recently_active'] = (features['days_since_last_activity'] <= 7).astype(int)
        
        return features
    
    def train_engagement_model(self, df: pd.DataFrame, engagement_labels: pd.Series) -> Dict[str, Any]:
        """Train engagement scoring model"""
        logger.info("Training engagement scoring model...")
        
        # Prepare features
        features = self.prepare_engagement_features(df)
        
        # Select numeric features
        numeric_features = features.select_dtypes(include=[np.number]).fillna(0)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(numeric_features)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, engagement_labels, test_size=0.2, random_state=42
        )
        
        # Train model
        self.engagement_model = GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=6,
            random_state=42
        )
        self.engagement_model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.engagement_model.predict(X_test)
        metrics = {
            'mse': mean_squared_error(y_test, y_pred),
            'r2': r2_score(y_test, y_pred),
            'mae': np.mean(np.abs(y_test - y_pred))
        }
        
        self.is_trained = True
        logger.info("Engagement model trained successfully")
        
        return metrics
    
    def calculate_engagement_score(self, user_data: Dict[str, Any]) -> float:
        """Calculate engagement score for a user"""
        if not self.is_trained:
            raise ValueError("Engagement model must be trained before calculating scores")
        
        # Prepare user features
        user_df = pd.DataFrame([user_data])
        features = self.prepare_engagement_features(user_df)
        numeric_features = features.select_dtypes(include=[np.number]).fillna(0)
        
        # Scale features
        user_features_scaled = self.scaler.transform(numeric_features)
        
        # Predict engagement score
        engagement_score = self.engagement_model.predict(user_features_scaled)[0]
        
        # Normalize to 0-1 range
        return max(0.0, min(1.0, engagement_score))
    
    def segment_users(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Segment users based on engagement patterns"""
        logger.info("Segmenting users based on engagement...")
        
        # Prepare features
        features = self.prepare_engagement_features(df)
        numeric_features = features.select_dtypes(include=[np.number]).fillna(0)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(numeric_features)
        
        # Perform clustering
        if self.config.clustering_algorithm == "kmeans":
            clusterer = KMeans(n_clusters=self.config.n_clusters, random_state=42)
        else:
            clusterer = DBSCAN(eps=0.5, min_samples=5)
        
        cluster_labels = clusterer.fit_predict(X_scaled)
        
        # Calculate silhouette score
        silhouette_avg = silhouette_score(X_scaled, cluster_labels)
        
        # Analyze clusters
        cluster_analysis = self._analyze_user_clusters(df, cluster_labels)
        
        return {
            'cluster_labels': cluster_labels.tolist(),
            'silhouette_score': silhouette_avg,
            'cluster_analysis': cluster_analysis
        }
    
    def _analyze_user_clusters(self, df: pd.DataFrame, cluster_labels: np.ndarray) -> Dict[str, Any]:
        """Analyze user clusters for insights"""
        cluster_analysis = {}
        
        for cluster_id in range(max(cluster_labels) + 1):
            cluster_mask = cluster_labels == cluster_id
            cluster_data = df[cluster_mask]
            
            if len(cluster_data) == 0:
                continue
            
            analysis = {
                'size': len(cluster_data),
                'percentage': len(cluster_data) / len(df) * 100,
                'avg_engagement': cluster_data['engagement_score'].mean() if 'engagement_score' in cluster_data.columns else 0,
                'avg_activity_frequency': cluster_data['login_frequency'].mean() if 'login_frequency' in cluster_data.columns else 0,
                'avg_session_duration': cluster_data['avg_session_duration'].mean() if 'avg_session_duration' in cluster_data.columns else 0,
                'avg_achievements': cluster_data['achievement_count'].mean() if 'achievement_count' in cluster_data.columns else 0,
                'characteristics': self._identify_cluster_characteristics(cluster_data)
            }
            
            cluster_analysis[f'cluster_{cluster_id}'] = analysis
        
        return cluster_analysis
    
    def _identify_cluster_characteristics(self, cluster_data: pd.DataFrame) -> List[str]:
        """Identify key characteristics of a user cluster"""
        characteristics = []
        
        # Engagement level
        if 'engagement_score' in cluster_data.columns:
            avg_engagement = cluster_data['engagement_score'].mean()
            if avg_engagement > 0.8:
                characteristics.append("High engagement users")
            elif avg_engagement > 0.5:
                characteristics.append("Medium engagement users")
            else:
                characteristics.append("Low engagement users")
        
        # Activity patterns
        if 'login_frequency' in cluster_data.columns:
            avg_frequency = cluster_data['login_frequency'].mean()
            if avg_frequency > 0.5:
                characteristics.append("Frequent users")
            elif avg_frequency > 0.1:
                characteristics.append("Regular users")
            else:
                characteristics.append("Occasional users")
        
        # Social behavior
        if 'social_interactions' in cluster_data.columns:
            avg_social = cluster_data['social_interactions'].mean()
            if avg_social > 10:
                characteristics.append("Highly social users")
            elif avg_social > 0:
                characteristics.append("Somewhat social users")
            else:
                characteristics.append("Non-social users")
        
        return characteristics

class RewardOptimizer:
    """ML system for optimizing reward allocation"""
    
    def __init__(self, config: GamificationConfig):
        self.config = config
        self.reward_model = None
        self.is_trained = False
    
    def train_reward_model(self, df: pd.DataFrame, reward_effectiveness: pd.Series) -> Dict[str, Any]:
        """Train model to predict reward effectiveness"""
        logger.info("Training reward optimization model...")
        
        # Prepare features
        features = self._prepare_reward_features(df)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            features, reward_effectiveness, test_size=0.2, random_state=42
        )
        
        # Train model
        self.reward_model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.reward_model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.reward_model.predict(X_test)
        metrics = {
            'mse': mean_squared_error(y_test, y_pred),
            'r2': r2_score(y_test, y_pred),
            'mae': np.mean(np.abs(y_test - y_pred))
        }
        
        self.is_trained = True
        logger.info("Reward model trained successfully")
        
        return metrics
    
    def _prepare_reward_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Prepare features for reward optimization"""
        features = df.copy()
        
        # User engagement features
        if 'engagement_score' in df.columns:
            features['engagement_level'] = pd.cut(
                df['engagement_score'], 
                bins=[0, 0.3, 0.6, 1.0], 
                labels=['low', 'medium', 'high']
            )
        
        # Reward history features
        if 'total_rewards_received' in df.columns:
            features['reward_frequency'] = df['total_rewards_received'] / (df['days_since_registration'] + 1)
            features['is_reward_recipient'] = (df['total_rewards_received'] > 0).astype(int)
        
        # Behavioral features
        if 'feature_usage_diversity' in df.columns:
            features['feature_explorer'] = (df['feature_usage_diversity'] > df['feature_usage_diversity'].quantile(0.7)).astype(int)
        
        # Social features
        if 'social_interactions' in df.columns:
            features['social_engagement'] = pd.cut(
                df['social_interactions'],
                bins=[-1, 0, 5, 20, np.inf],
                labels=['none', 'low', 'medium', 'high']
            )
        
        # Time-based features
        if 'days_since_registration' in df.columns:
            features['user_tenure'] = pd.cut(
                df['days_since_registration'],
                bins=[0, 30, 90, 365, np.inf],
                labels=['new', 'recent', 'established', 'veteran']
            )
        
        return features
    
    def optimize_reward_allocation(self, users: List[Dict[str, Any]], 
                                 available_rewards: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Optimize reward allocation across users"""
        if not self.is_trained:
            raise ValueError("Reward model must be trained before optimization")
        
        # Prepare user features
        user_df = pd.DataFrame(users)
        user_features = self._prepare_reward_features(user_df)
        
        # Predict reward effectiveness for each user-reward combination
        optimization_results = []
        
        for user_idx, user in enumerate(users):
            user_effectiveness = {}
            
            for reward in available_rewards:
                # Create user-reward feature combination
                combined_features = user_features.iloc[user_idx].copy()
                combined_features['reward_type'] = reward['type']
                combined_features['reward_value'] = reward['value']
                combined_features['reward_rarity'] = reward['rarity']
                
                # Predict effectiveness
                effectiveness = self._predict_reward_effectiveness(combined_features)
                user_effectiveness[reward['reward_id']] = effectiveness
            
            optimization_results.append({
                'user_id': user['user_id'],
                'recommended_rewards': sorted(user_effectiveness.items(), key=lambda x: x[1], reverse=True),
                'max_effectiveness': max(user_effectiveness.values())
            })
        
        # Generate allocation strategy
        allocation_strategy = self._generate_allocation_strategy(optimization_results, available_rewards)
        
        return {
            'user_recommendations': optimization_results,
            'allocation_strategy': allocation_strategy,
            'total_budget_used': sum(strategy['budget_used'] for strategy in allocation_strategy.values())
        }
    
    def _predict_reward_effectiveness(self, features: pd.Series) -> float:
        """Predict effectiveness of a reward for a user"""
        # Convert categorical features to numeric
        feature_array = features.values.reshape(1, -1)
        
        # Predict effectiveness
        effectiveness = self.reward_model.predict(feature_array)[0]
        
        return max(0.0, min(1.0, effectiveness))
    
    def _generate_allocation_strategy(self, optimization_results: List[Dict], 
                                    available_rewards: List[Dict]) -> Dict[str, Any]:
        """Generate optimal reward allocation strategy"""
        strategy = {}
        remaining_budget = self.config.reward_budget
        
        # Sort users by effectiveness
        sorted_users = sorted(optimization_results, key=lambda x: x['max_effectiveness'], reverse=True)
        
        for user_result in sorted_users:
            user_id = user_result['user_id']
            user_strategy = {
                'allocated_rewards': [],
                'budget_used': 0,
                'expected_impact': 0
            }
            
            # Allocate rewards based on effectiveness
            for reward_id, effectiveness in user_result['recommended_rewards']:
                if user_strategy['budget_used'] >= self.config.max_rewards_per_user * 100:  # Max budget per user
                    break
                
                # Find reward details
                reward = next((r for r in available_rewards if r['reward_id'] == reward_id), None)
                if not reward:
                    continue
                
                if reward['cost'] <= remaining_budget:
                    user_strategy['allocated_rewards'].append({
                        'reward_id': reward_id,
                        'effectiveness': effectiveness,
                        'cost': reward['cost']
                    })
                    user_strategy['budget_used'] += reward['cost']
                    user_strategy['expected_impact'] += effectiveness
                    remaining_budget -= reward['cost']
            
            strategy[user_id] = user_strategy
        
        return strategy

class AchievementSystem:
    """ML-powered achievement system"""
    
    def __init__(self, config: GamificationConfig):
        self.config = config
        self.achievement_recommender = None
        self.is_trained = False
    
    def train_achievement_recommender(self, df: pd.DataFrame, 
                                    achievement_completions: pd.DataFrame) -> Dict[str, Any]:
        """Train achievement recommendation system"""
        logger.info("Training achievement recommendation system...")
        
        # Prepare user-item matrix for collaborative filtering
        user_item_matrix = achievement_completions.pivot_table(
            index='user_id', 
            columns='achievement_id', 
            values='completion_score',
            fill_value=0
        )
        
        # Train SVD model
        reader = Reader(rating_scale=(0, 1))
        data = Dataset.load_from_df(
            achievement_completions[['user_id', 'achievement_id', 'completion_score']], 
            reader
        )
        
        self.achievement_recommender = SVD(n_factors=50, random_state=42)
        self.achievement_recommender.fit(data.build_full_trainset())
        
        # Evaluate model
        cv_results = cross_validate(self.achievement_recommender, data, measures=['RMSE', 'MAE'], cv=5)
        
        metrics = {
            'rmse': cv_results['test_rmse'].mean(),
            'mae': cv_results['test_mae'].mean()
        }
        
        self.is_trained = True
        logger.info("Achievement recommender trained successfully")
        
        return metrics
    
    def recommend_achievements(self, user_id: str, available_achievements: List[Achievement],
                             user_profile: UserEngagementUser) -> List[Dict[str, Any]]:
        """Recommend achievements for a user"""
        if not self.is_trained:
            raise ValueError("Achievement recommender must be trained before making recommendations")
        
        recommendations = []
        
        for achievement in available_achievements:
            # Predict completion probability
            completion_prob = self.achievement_recommender.predict(
                user_id, achievement.achievement_id
            ).est
            
            # Calculate difficulty score
            difficulty_score = self._calculate_difficulty_score(achievement, user_profile)
            
            # Calculate engagement boost
            engagement_boost = self._calculate_engagement_boost(achievement, user_profile)
            
            # Calculate overall recommendation score
            recommendation_score = (
                completion_prob * 0.4 +
                (1 - difficulty_score) * 0.3 +
                engagement_boost * 0.3
            )
            
            recommendations.append({
                'achievement_id': achievement.achievement_id,
                'achievement_name': achievement.name,
                'completion_probability': completion_prob,
                'difficulty_score': difficulty_score,
                'engagement_boost': engagement_boost,
                'recommendation_score': recommendation_score,
                'reward_value': achievement.reward_value
            })
        
        # Sort by recommendation score
        recommendations.sort(key=lambda x: x['recommendation_score'], reverse=True)
        
        return recommendations[:self.config.max_achievements_per_user]
    
    def _calculate_difficulty_score(self, achievement: Achievement, 
                                  user_profile: UserEngagementUser) -> float:
        """Calculate difficulty score for an achievement"""
        # Base difficulty from achievement
        base_difficulty = achievement.difficulty_level / 5.0
        
        # Adjust based on user's achievement history
        achievement_history = user_profile.achievement_count
        if achievement_history > 0:
            difficulty_adjustment = min(0.3, achievement_history / 100)
            base_difficulty -= difficulty_adjustment
        
        # Adjust based on user's engagement level
        engagement_adjustment = user_profile.engagement_score * 0.2
        base_difficulty -= engagement_adjustment
        
        return max(0.0, min(1.0, base_difficulty))
    
    def _calculate_engagement_boost(self, achievement: Achievement, 
                                  user_profile: UserEngagementUser) -> float:
        """Calculate potential engagement boost from achievement"""
        # Base boost from achievement type
        type_boosts = {
            AchievementType.MILESTONE: 0.8,
            AchievementType.STREAK: 0.6,
            AchievementType.SOCIAL: 0.7,
            AchievementType.SKILL: 0.5,
            AchievementType.EXPLORATION: 0.9,
            AchievementType.COLLECTION: 0.4,
            AchievementType.CHALLENGE: 0.8
        }
        
        base_boost = type_boosts.get(achievement.achievement_type, 0.5)
        
        # Adjust based on user's current engagement
        if user_profile.engagement_score < 0.3:
            base_boost *= 1.5  # Higher boost for low engagement users
        elif user_profile.engagement_score > 0.8:
            base_boost *= 0.7  # Lower boost for already engaged users
        
        # Adjust based on user's preferences
        if achievement.category in user_profile.preferences.get('preferred_categories', []):
            base_boost *= 1.2
        
        return min(1.0, base_boost)

class ChallengeGenerator:
    """ML system for generating personalized challenges"""
    
    def __init__(self, config: GamificationConfig):
        self.config = config
        self.challenge_model = None
        self.is_trained = False
    
    def train_challenge_model(self, df: pd.DataFrame, challenge_success: pd.Series) -> Dict[str, Any]:
        """Train model for challenge generation"""
        logger.info("Training challenge generation model...")
        
        # Prepare features
        features = self._prepare_challenge_features(df)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            features, challenge_success, test_size=0.2, random_state=42
        )
        
        # Train model
        self.challenge_model = LogisticRegression(random_state=42)
        self.challenge_model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.challenge_model.predict(X_test)
        accuracy = (y_pred == y_test).mean()
        
        self.is_trained = True
        logger.info("Challenge model trained successfully")
        
        return {'accuracy': accuracy}
    
    def _prepare_challenge_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Prepare features for challenge generation"""
        features = df.copy()
        
        # User capability features
        if 'engagement_score' in df.columns:
            features['capability_level'] = pd.cut(
                df['engagement_score'],
                bins=[0, 0.3, 0.6, 0.8, 1.0],
                labels=['beginner', 'intermediate', 'advanced', 'expert']
            )
        
        # Behavioral features
        if 'feature_usage_diversity' in df.columns:
            features['exploration_tendency'] = df['feature_usage_diversity']
        
        if 'social_interactions' in df.columns:
            features['social_tendency'] = df['social_interactions']
        
        # Time-based features
        if 'days_since_registration' in df.columns:
            features['experience_level'] = pd.cut(
                df['days_since_registration'],
                bins=[0, 7, 30, 90, 365, np.inf],
                labels=['new', 'rookie', 'experienced', 'veteran', 'expert']
            )
        
        return features
    
    def generate_challenges(self, user_profile: UserEngagementUser, 
                          challenge_templates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate personalized challenges for a user"""
        if not self.is_trained:
            raise ValueError("Challenge model must be trained before generating challenges")
        
        # Prepare user features
        user_data = {
            'engagement_score': user_profile.engagement_score,
            'feature_usage_diversity': len(user_profile.feature_usage),
            'social_interactions': user_profile.social_interactions,
            'days_since_registration': (datetime.now() - user_profile.last_activity).days
        }
        
        user_df = pd.DataFrame([user_data])
        user_features = self._prepare_challenge_features(user_df)
        
        # Generate challenges
        challenges = []
        
        for template in challenge_templates:
            # Predict success probability
            template_features = user_features.copy()
            template_features['challenge_difficulty'] = template['difficulty']
            template_features['challenge_duration'] = template['duration_days']
            template_features['challenge_type'] = template['type']
            
            success_prob = self.challenge_model.predict_proba(template_features)[0][1]
            
            # Calculate engagement potential
            engagement_potential = self._calculate_engagement_potential(template, user_profile)
            
            # Calculate overall challenge score
            challenge_score = success_prob * 0.6 + engagement_potential * 0.4
            
            if challenge_score > 0.5:  # Only recommend challenges with good success probability
                challenges.append({
                    'challenge_id': template['challenge_id'],
                    'name': template['name'],
                    'description': template['description'],
                    'success_probability': success_prob,
                    'engagement_potential': engagement_potential,
                    'challenge_score': challenge_score,
                    'estimated_duration': template['duration_days'],
                    'reward_value': template['reward_value']
                })
        
        # Sort by challenge score
        challenges.sort(key=lambda x: x['challenge_score'], reverse=True)
        
        return challenges[:5]  # Return top 5 challenges
    
    def _calculate_engagement_potential(self, template: Dict[str, Any], 
                                      user_profile: UserEngagementUser) -> float:
        """Calculate potential engagement boost from challenge"""
        # Base engagement potential
        base_potential = template.get('engagement_multiplier', 1.0)
        
        # Adjust based on user's current engagement
        if user_profile.engagement_score < 0.3:
            base_potential *= 1.5  # Higher potential for low engagement users
        elif user_profile.engagement_score > 0.8:
            base_potential *= 0.8  # Lower potential for already engaged users
        
        # Adjust based on user's preferences
        if template['type'] in user_profile.preferences.get('preferred_challenge_types', []):
            base_potential *= 1.3
        
        # Adjust based on user's behavioral patterns
        if template.get('requires_social', False) and user_profile.social_interactions > 0:
            base_potential *= 1.2
        
        return min(1.0, base_potential)

class GamificationAPI:
    """API wrapper for gamification ML system"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.config = GamificationConfig()
        self.engagement_scorer = EngagementScorer(self.config)
        self.reward_optimizer = RewardOptimizer(self.config)
        self.achievement_system = AchievementSystem(self.config)
        self.challenge_generator = ChallengeGenerator(self.config)
        
        if model_path:
            self.load_models(model_path)
    
    def calculate_engagement_score(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate engagement score for a user"""
        try:
            score = self.engagement_scorer.calculate_engagement_score(user_data)
            
            return {
                'success': True,
                'user_id': user_data.get('user_id', 'unknown'),
                'engagement_score': score,
                'engagement_level': self._get_engagement_level(score),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error calculating engagement score: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def optimize_rewards(self, users: List[Dict[str, Any]], 
                        available_rewards: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Optimize reward allocation across users"""
        try:
            optimization = self.reward_optimizer.optimize_reward_allocation(users, available_rewards)
            
            return {
                'success': True,
                'optimization': optimization,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error optimizing rewards: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def recommend_achievements(self, user_profile: UserEngagementUser,
                             available_achievements: List[Achievement]) -> Dict[str, Any]:
        """Recommend achievements for a user"""
        try:
            recommendations = self.achievement_system.recommend_achievements(
                user_profile.user_id, available_achievements, user_profile
            )
            
            return {
                'success': True,
                'user_id': user_profile.user_id,
                'recommendations': recommendations,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error recommending achievements: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def generate_challenges(self, user_profile: UserEngagementUser,
                          challenge_templates: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate personalized challenges for a user"""
        try:
            challenges = self.challenge_generator.generate_challenges(user_profile, challenge_templates)
            
            return {
                'success': True,
                'user_id': user_profile.user_id,
                'challenges': challenges,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error generating challenges: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def _get_engagement_level(self, score: float) -> str:
        """Convert engagement score to level"""
        if score >= 0.8:
            return "champion"
        elif score >= 0.6:
            return "loyal_customer"
        elif score >= 0.4:
            return "potential_loyalist"
        elif score >= 0.2:
            return "new_customer"
        else:
            return "at_risk"
    
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
        'login_count': 45,
        'days_since_registration': 30,
        'avg_session_duration': 1200,  # seconds
        'feature_usage_diversity': 8,
        'social_interactions': 15,
        'achievement_count': 5,
        'current_streak': 7,
        'longest_streak': 15,
        'last_activity': datetime.now() - timedelta(hours=2),
        'total_rewards_received': 3
    }
    
    # Example achievements
    achievements = [
        Achievement(
            achievement_id='ach_001',
            name='First Steps',
            description='Complete your first booking',
            achievement_type=AchievementType.MILESTONE,
            reward_type=RewardType.POINTS,
            reward_value=100,
            requirements={'bookings': 1},
            difficulty_level=1,
            category='booking',
            is_hidden=False,
            created_at=datetime.now()
        ),
        Achievement(
            achievement_id='ach_002',
            name='Social Butterfly',
            description='Share 10 experiences',
            achievement_type=AchievementType.SOCIAL,
            reward_type=RewardType.BADGES,
            reward_value=1,
            requirements={'shares': 10},
            difficulty_level=3,
            category='social',
            is_hidden=False,
            created_at=datetime.now()
        )
    ]
    
    # Initialize API
    api = GamificationAPI()
    
    # Test engagement scoring
    engagement_result = api.calculate_engagement_score(user_data)
    print("Engagement Score:", engagement_result)
    
    # Test achievement recommendations
    user_profile = UserEngagementUser(
        user_id='user_001',
        engagement_score=0.7,
        activity_frequency=0.5,
        session_duration=1200,
        feature_usage={'booking': 0.8, 'menu': 0.6, 'reviews': 0.4},
        social_interactions=15,
        achievement_count=5,
        total_points=500,
        current_streak=7,
        longest_streak=15,
        last_activity=datetime.now() - timedelta(hours=2),
        user_segment=UserSegment.LOYAL_CUSTOMER,
        preferences={'preferred_categories': ['booking', 'social']},
        behavioral_patterns={'peak_hours': [18, 19, 20]}
    )
    
    achievement_result = api.recommend_achievements(user_profile, achievements)
    print("Achievement Recommendations:", achievement_result)
    
    # Test challenge generation
    challenge_templates = [
        {
            'challenge_id': 'ch_001',
            'name': 'Booking Master',
            'description': 'Complete 5 bookings this week',
            'difficulty': 2,
            'duration_days': 7,
            'type': 'booking',
            'reward_value': 200,
            'engagement_multiplier': 1.2,
            'requires_social': False
        }
    ]
    
    challenge_result = api.generate_challenges(user_profile, challenge_templates)
    print("Challenge Generation:", challenge_result)