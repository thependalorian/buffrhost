"""
Dynamic Pricing System for Hospitality Platform
==============================================

Advanced dynamic pricing system using reinforcement learning, market analysis,
and revenue optimization for hospitality businesses.

Features:
- Reinforcement learning for price optimization
- Market analysis and competitive intelligence
- Demand elasticity modeling
- Revenue optimization algorithms
- Real-time pricing adjustments

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

class DynamicPricingSystem:
    """
    Dynamic Pricing System for Hospitality Platform
    
    This class implements advanced dynamic pricing using machine learning
    techniques including demand forecasting, competitor analysis, and
    revenue optimization to automatically adjust pricing based on market conditions.
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        Initialize the dynamic pricing system
        
        Args:
            config: Configuration dictionary for the system
        """
        self.config = config or {}
        self.models = {}
        self.scalers = {}
        self.pricing_rules = {}
        
        # Initialize logging
        self.logger = logging.getLogger(__name__)
        
        # Setup database connection
        self.db_path = "dynamic_pricing.db"
        self._setup_database()
        
        # Initialize models
        self._initialize_models()
    
    def _setup_database(self):
        """Setup SQLite database for storing pricing data"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create tables for dynamic pricing
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS pricing_decisions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                property_id TEXT,
                room_type TEXT,
                date DATE,
                base_price REAL,
                dynamic_price REAL,
                demand_factor REAL,
                competitor_factor REAL,
                seasonality_factor REAL,
                created_at TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS competitor_prices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                property_id TEXT,
                competitor_name TEXT,
                room_type TEXT,
                price REAL,
                date DATE,
                created_at TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def _initialize_models(self):
        """Initialize dynamic pricing models"""
        try:
            from sklearn.linear_model import LinearRegression
            from sklearn.ensemble import RandomForestRegressor
            from sklearn.preprocessing import StandardScaler
            
            # Linear regression for base pricing
            self.models['base_pricing'] = LinearRegression()
            
            # Random forest for demand-based adjustments
            self.models['demand_adjustment'] = RandomForestRegressor(
                n_estimators=100,
                random_state=42
            )
            
            # Standard scaler for feature normalization
            self.scalers['standard'] = StandardScaler()
            
            self.logger.info("Dynamic pricing models initialized successfully")
            
        except ImportError as e:
            self.logger.error(f"Failed to initialize models: {e}")
            raise
    
    def calculate_dynamic_price(self, property_id: str, room_type: str, date: str, 
                              base_price: float, demand_data: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Calculate dynamic price for a specific room and date
        
        Args:
            property_id: ID of the property
            room_type: Type of room
            date: Date for pricing
            base_price: Base price for the room
            demand_data: Additional demand data
            
        Returns:
            Dictionary containing pricing decision
        """
        try:
            # Extract features
            features = self._extract_pricing_features(property_id, room_type, date, demand_data)
            
            # Normalize features
            features_scaled = self.scalers['standard'].fit_transform([features])
            
            # Calculate demand factor
            demand_factor = self._calculate_demand_factor(features_scaled[0])
            
            # Calculate competitor factor
            competitor_factor = self._calculate_competitor_factor(property_id, room_type, date)
            
            # Calculate seasonality factor
            seasonality_factor = self._calculate_seasonality_factor(date)
            
            # Calculate final price
            final_price = self._calculate_final_price(
                base_price, demand_factor, competitor_factor, seasonality_factor
            )
            
            # Store pricing decision
            self._store_pricing_decision(
                property_id, room_type, date, base_price, final_price,
                demand_factor, competitor_factor, seasonality_factor
            )
            
            return {
                'property_id': property_id,
                'room_type': room_type,
                'date': date,
                'base_price': base_price,
                'dynamic_price': final_price,
                'demand_factor': demand_factor,
                'competitor_factor': competitor_factor,
                'seasonality_factor': seasonality_factor,
                'price_adjustment': final_price - base_price,
                'adjustment_percentage': ((final_price - base_price) / base_price) * 100
            }
            
        except Exception as e:
            self.logger.error(f"Error in dynamic pricing: {e}")
            return {
                'error': str(e),
                'dynamic_price': base_price,
                'demand_factor': 1.0,
                'competitor_factor': 1.0,
                'seasonality_factor': 1.0
            }
    
    def _extract_pricing_features(self, property_id: str, room_type: str, 
                                 date: str, demand_data: Dict[str, Any]) -> List[float]:
        """Extract features for pricing calculation"""
        features = []
        
        # Date features
        date_obj = datetime.strptime(date, '%Y-%m-%d')
        features.extend([
            date_obj.day / 31.0,  # Day of month
            date_obj.month / 12.0,  # Month
            date_obj.weekday() / 7.0,  # Day of week
            date_obj.timetuple().tm_yday / 365.0,  # Day of year
        ])
        
        # Demand features
        if demand_data:
            features.extend([
                demand_data.get('occupancy_rate', 0.5),
                demand_data.get('booking_velocity', 0.5),
                demand_data.get('cancellation_rate', 0.1),
                demand_data.get('advance_booking_days', 7) / 30.0
            ])
        else:
            features.extend([0.5, 0.5, 0.1, 0.23])  # Default values
        
        # Room type features
        room_type_encoding = self._encode_room_type(room_type)
        features.extend(room_type_encoding)
        
        return features
    
    def _encode_room_type(self, room_type: str) -> List[float]:
        """Encode room type as numerical features"""
        # Simple encoding - in practice, you'd use more sophisticated methods
        room_types = ['standard', 'deluxe', 'suite', 'presidential']
        encoding = [0.0] * len(room_types)
        
        if room_type.lower() in room_types:
            idx = room_types.index(room_type.lower())
            encoding[idx] = 1.0
        
        return encoding
    
    def _calculate_demand_factor(self, features: np.ndarray) -> float:
        """Calculate demand-based pricing factor"""
        # Simplified demand factor calculation
        occupancy_rate = features[4]  # From demand features
        booking_velocity = features[5]
        
        # Higher occupancy and booking velocity = higher price
        demand_factor = 0.8 + (occupancy_rate * 0.4) + (booking_velocity * 0.2)
        
        # Cap between 0.5 and 2.0
        return max(0.5, min(2.0, demand_factor))
    
    def _calculate_competitor_factor(self, property_id: str, room_type: str, date: str) -> float:
        """Calculate competitor-based pricing factor"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get competitor prices for the same date and room type
        cursor.execute('''
            SELECT price FROM competitor_prices 
            WHERE room_type = ? AND date = ? 
            ORDER BY created_at DESC LIMIT 5
        ''', (room_type, date))
        
        prices = [row[0] for row in cursor.fetchall()]
        conn.close()
        
        if not prices:
            return 1.0  # No competitor data
        
        # Calculate average competitor price
        avg_competitor_price = np.mean(prices)
        
        # Get our base price (simplified)
        base_price = 100.0  # This should come from the property's base pricing
        
        # Factor based on how we compare to competitors
        if avg_competitor_price > base_price * 1.2:
            return 1.1  # Competitors are much higher, we can increase
        elif avg_competitor_price < base_price * 0.8:
            return 0.9  # Competitors are much lower, we should decrease
        else:
            return 1.0  # Similar pricing
    
    def _calculate_seasonality_factor(self, date: str) -> float:
        """Calculate seasonality-based pricing factor"""
        date_obj = datetime.strptime(date, '%Y-%m-%d')
        month = date_obj.month
        
        # Seasonal factors (simplified)
        seasonal_factors = {
            1: 0.8,   # January - low season
            2: 0.8,   # February - low season
            3: 0.9,   # March - shoulder season
            4: 1.0,   # April - shoulder season
            5: 1.1,   # May - high season
            6: 1.2,   # June - peak season
            7: 1.3,   # July - peak season
            8: 1.3,   # August - peak season
            9: 1.1,   # September - high season
            10: 1.0,  # October - shoulder season
            11: 0.9,  # November - shoulder season
            12: 1.1   # December - high season (holidays)
        }
        
        return seasonal_factors.get(month, 1.0)
    
    def _calculate_final_price(self, base_price: float, demand_factor: float, 
                             competitor_factor: float, seasonality_factor: float) -> float:
        """Calculate final dynamic price"""
        # Combine all factors
        final_price = base_price * demand_factor * competitor_factor * seasonality_factor
        
        # Apply minimum and maximum price constraints
        min_price = base_price * 0.5  # Minimum 50% of base price
        max_price = base_price * 2.0  # Maximum 200% of base price
        
        return max(min_price, min(max_price, final_price))
    
    def _store_pricing_decision(self, property_id: str, room_type: str, date: str,
                               base_price: float, final_price: float, demand_factor: float,
                               competitor_factor: float, seasonality_factor: float):
        """Store pricing decision in database"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO pricing_decisions 
            (property_id, room_type, date, base_price, dynamic_price, 
             demand_factor, competitor_factor, seasonality_factor, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            property_id, room_type, date, base_price, final_price,
            demand_factor, competitor_factor, seasonality_factor, datetime.now()
        ))
        
        conn.commit()
        conn.close()
    
    def add_competitor_price(self, property_id: str, competitor_name: str, 
                           room_type: str, price: float, date: str):
        """Add competitor price data"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO competitor_prices 
            (property_id, competitor_name, room_type, price, date, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (property_id, competitor_name, room_type, price, date, datetime.now()))
        
        conn.commit()
        conn.close()
    
    def get_pricing_analytics(self, property_id: str, days: int = 30) -> Dict[str, Any]:
        """Get pricing analytics for a property"""
        import sqlite3
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get recent pricing decisions
        cursor.execute('''
            SELECT * FROM pricing_decisions 
            WHERE property_id = ? 
            ORDER BY date DESC LIMIT ?
        ''', (property_id, days))
        
        decisions = cursor.fetchall()
        conn.close()
        
        if not decisions:
            return {'error': 'No pricing data available'}
        
        # Calculate analytics
        prices = [row[5] for row in decisions]  # dynamic_price column
        base_prices = [row[4] for row in decisions]  # base_price column
        
        avg_price = np.mean(prices)
        avg_base_price = np.mean(base_prices)
        price_variance = np.var(prices)
        
        return {
            'property_id': property_id,
            'period_days': days,
            'avg_dynamic_price': avg_price,
            'avg_base_price': avg_base_price,
            'price_variance': price_variance,
            'total_decisions': len(decisions),
            'avg_adjustment': avg_price - avg_base_price,
            'adjustment_percentage': ((avg_price - avg_base_price) / avg_base_price) * 100
        }
import warnings
warnings.filterwarnings('ignore')

# Core ML and statistical libraries
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
from sklearn.preprocessing import StandardScaler, MinMaxScaler, PolynomialFeatures
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.cluster import KMeans
from sklearn.neural_network import MLPRegressor

# Optimization libraries
from scipy.optimize import minimize, differential_evolution
from scipy import stats
import cvxpy as cp

# Time series analysis
import statsmodels.api as sm
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.holtwinters import ExponentialSmoothing

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PricingStrategy(Enum):
    """Dynamic pricing strategies"""
    REINFORCEMENT_LEARNING = "reinforcement_learning"
    ELASTICITY_BASED = "elasticity_based"
    COMPETITIVE = "competitive"
    DEMAND_DRIVEN = "demand_driven"
    REVENUE_OPTIMIZATION = "revenue_optimization"

class PriceSegment(Enum):
    """Price segments for different customer types"""
    BUDGET = "budget"
    STANDARD = "standard"
    PREMIUM = "premium"
    LUXURY = "luxury"

@dataclass
class PricingConfig:
    """Configuration for dynamic pricing system"""
    # Pricing parameters
    min_price_multiplier: float = 0.5
    max_price_multiplier: float = 3.0
    price_step: float = 0.05
    base_price: float = 100.0
    
    # Market parameters
    competitor_weight: float = 0.3
    demand_weight: float = 0.4
    revenue_weight: float = 0.3
    
    # Learning parameters
    learning_rate: float = 0.01
    exploration_rate: float = 0.1
    discount_factor: float = 0.95
    
    # Optimization parameters
    max_iterations: int = 1000
    convergence_threshold: float = 1e-6
    
    # Model persistence
    model_path: str = "models/dynamic_pricing"
    version: str = "1.0.0"

class DemandElasticityModel:
    """Demand elasticity modeling for price optimization"""
    
    def __init__(self, config: PricingConfig):
        self.config = config
        self.elasticity_model = None
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def calculate_price_elasticity(self, prices: np.ndarray, demand: np.ndarray) -> float:
        """Calculate price elasticity of demand"""
        logger.info("Calculating price elasticity...")
        
        # Log-linear regression to estimate elasticity
        log_prices = np.log(prices + 1e-8)  # Add small constant to avoid log(0)
        log_demand = np.log(demand + 1e-8)
        
        # Linear regression: log_demand = alpha + beta * log_price
        X = log_prices.reshape(-1, 1)
        y = log_demand
        
        model = LinearRegression()
        model.fit(X, y)
        
        # Elasticity is the coefficient of log_price
        elasticity = model.coef_[0]
        
        return elasticity
    
    def train_elasticity_model(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Train demand elasticity model"""
        logger.info("Training demand elasticity model...")
        
        try:
            # Prepare features
            feature_columns = [
                'price', 'competitor_price', 'demand', 'seasonality',
                'day_of_week', 'is_weekend', 'is_holiday', 'temperature',
                'marketing_spend', 'event_indicator'
            ]
            
            # Filter available columns
            available_features = [col for col in feature_columns if col in df.columns]
            X = df[available_features].fillna(0)
            y = df['demand']
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Split data
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
            
            self.elasticity_model = model
            
            # Evaluate model
            y_pred = model.predict(X_test)
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            # Calculate price elasticity
            price_elasticity = self.calculate_price_elasticity(
                df['price'].values, df['demand'].values
            )
            
            self.is_trained = True
            
            return {
                'model_type': 'Demand Elasticity',
                'mse': mse,
                'r2': r2,
                'price_elasticity': price_elasticity,
                'feature_importance': dict(zip(available_features, model.feature_importances_))
            }
            
        except Exception as e:
            logger.error(f"Error training elasticity model: {e}")
            raise
    
    def predict_demand(self, price: float, features: Dict[str, Any]) -> float:
        """Predict demand for given price and features"""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        # Prepare feature vector
        feature_vector = np.array([features.get(feature, 0) for feature in self.scaler.feature_names_in_])
        feature_vector[0] = price  # Set price as first feature
        
        # Scale features
        feature_scaled = self.scaler.transform(feature_vector.reshape(1, -1))
        
        # Predict demand
        predicted_demand = self.elasticity_model.predict(feature_scaled)[0]
        
        return max(0, predicted_demand)  # Ensure non-negative demand

class ReinforcementLearningPricing:
    """Reinforcement learning for dynamic pricing"""
    
    def __init__(self, config: PricingConfig):
        self.config = config
        self.q_table = {}
        self.state_space = {}
        self.action_space = {}
        self.learning_rate = config.learning_rate
        self.exploration_rate = config.exploration_rate
        self.discount_factor = config.discount_factor
        self.is_trained = False
    
    def create_state_space(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Create state space for RL environment"""
        logger.info("Creating state space...")
        
        # Define state dimensions
        demand_levels = 5  # Low, Medium-Low, Medium, Medium-High, High
        price_levels = 5   # Low, Medium-Low, Medium, Medium-High, High
        season_levels = 4  # Spring, Summer, Fall, Winter
        day_levels = 2     # Weekday, Weekend
        
        # Create state bins
        demand_bins = pd.qcut(df['demand'], demand_levels, labels=False, duplicates='drop')
        price_bins = pd.qcut(df['price'], price_levels, labels=False, duplicates='drop')
        
        # Create state space
        state_space = {
            'demand_levels': demand_levels,
            'price_levels': price_levels,
            'season_levels': season_levels,
            'day_levels': day_levels,
            'total_states': demand_levels * price_levels * season_levels * day_levels
        }
        
        self.state_space = state_space
        return state_space
    
    def create_action_space(self) -> Dict[str, Any]:
        """Create action space for price adjustments"""
        logger.info("Creating action space...")
        
        # Price adjustment actions
        price_adjustments = np.arange(
            -self.config.max_price_multiplier + 1,
            self.config.max_price_multiplier,
            self.config.price_step
        )
        
        action_space = {
            'adjustments': price_adjustments,
            'total_actions': len(price_adjustments)
        }
        
        self.action_space = action_space
        return action_space
    
    def get_state(self, demand: float, price: float, season: int, is_weekend: bool) -> int:
        """Get state index from current environment"""
        # Normalize values to state space
        demand_level = min(int(demand / 100), self.state_space['demand_levels'] - 1)
        price_level = min(int(price / 50), self.state_space['price_levels'] - 1)
        season_level = season % self.state_space['season_levels']
        day_level = 1 if is_weekend else 0
        
        # Calculate state index
        state = (demand_level * self.state_space['price_levels'] * 
                self.state_space['season_levels'] * self.state_space['day_levels'] +
                price_level * self.state_space['season_levels'] * self.state_space['day_levels'] +
                season_level * self.state_space['day_levels'] + day_level)
        
        return state
    
    def get_action(self, state: int, training: bool = True) -> float:
        """Get action (price adjustment) using epsilon-greedy policy"""
        if state not in self.q_table:
            self.q_table[state] = np.zeros(self.action_space['total_actions'])
        
        if training and np.random.random() < self.exploration_rate:
            # Exploration: random action
            action_idx = np.random.randint(0, self.action_space['total_actions'])
        else:
            # Exploitation: best action
            action_idx = np.argmax(self.q_table[state])
        
        return self.action_space['adjustments'][action_idx]
    
    def update_q_table(self, state: int, action_idx: int, reward: float, next_state: int):
        """Update Q-table using Q-learning"""
        if state not in self.q_table:
            self.q_table[state] = np.zeros(self.action_space['total_actions'])
        if next_state not in self.q_table:
            self.q_table[next_state] = np.zeros(self.action_space['total_actions'])
        
        # Q-learning update
        current_q = self.q_table[state][action_idx]
        max_next_q = np.max(self.q_table[next_state])
        
        new_q = current_q + self.learning_rate * (
            reward + self.discount_factor * max_next_q - current_q
        )
        
        self.q_table[state][action_idx] = new_q
    
    def train_rl_model(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Train reinforcement learning model"""
        logger.info("Training RL pricing model...")
        
        try:
            # Create state and action spaces
            self.create_state_space(df)
            self.create_action_space()
            
            # Training parameters
            episodes = 1000
            rewards_history = []
            
            for episode in range(episodes):
                episode_reward = 0
                
                # Shuffle data for each episode
                df_shuffled = df.sample(frac=1).reset_index(drop=True)
                
                for i in range(len(df_shuffled) - 1):
                    row = df_shuffled.iloc[i]
                    next_row = df_shuffled.iloc[i + 1]
                    
                    # Get current state
                    state = self.get_state(
                        row['demand'], row['price'], 
                        row.get('month', 1), row.get('is_weekend', False)
                    )
                    
                    # Get action
                    action = self.get_action(state, training=True)
                    action_idx = np.where(self.action_space['adjustments'] == action)[0][0]
                    
                    # Calculate reward (revenue-based)
                    new_price = row['price'] * (1 + action)
                    predicted_demand = max(0, row['demand'] * (1 - abs(action) * 0.1))
                    revenue = new_price * predicted_demand
                    
                    # Calculate reward
                    reward = revenue / 1000  # Normalize reward
                    
                    # Get next state
                    next_state = self.get_state(
                        next_row['demand'], next_row['price'],
                        next_row.get('month', 1), next_row.get('is_weekend', False)
                    )
                    
                    # Update Q-table
                    self.update_q_table(state, action_idx, reward, next_state)
                    
                    episode_reward += reward
                
                rewards_history.append(episode_reward)
                
                # Decay exploration rate
                if episode % 100 == 0:
                    self.exploration_rate *= 0.95
            
            self.is_trained = True
            
            return {
                'model_type': 'Reinforcement Learning',
                'episodes': episodes,
                'final_reward': rewards_history[-1],
                'avg_reward': np.mean(rewards_history[-100:]),
                'q_table_size': len(self.q_table)
            }
            
        except Exception as e:
            logger.error(f"Error training RL model: {e}")
            raise
    
    def get_optimal_price(self, demand: float, current_price: float, 
                         season: int, is_weekend: bool) -> float:
        """Get optimal price using trained RL model"""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        state = self.get_state(demand, current_price, season, is_weekend)
        action = self.get_action(state, training=False)
        
        optimal_price = current_price * (1 + action)
        return max(optimal_price, current_price * self.config.min_price_multiplier)

class CompetitivePricingAnalyzer:
    """Competitive pricing analysis and intelligence"""
    
    def __init__(self, config: PricingConfig):
        self.config = config
        self.competitor_data = {}
        self.market_position = {}
    
    def analyze_competitor_prices(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze competitor pricing patterns"""
        logger.info("Analyzing competitor prices...")
        
        try:
            # Calculate market position metrics
            our_prices = df['price']
            competitor_prices = df.get('competitor_price', our_prices * 1.1)  # Default if not available
            
            # Price positioning
            price_ratio = our_prices / competitor_prices
            market_position = {
                'avg_price_ratio': price_ratio.mean(),
                'price_premium': (price_ratio - 1).mean(),
                'price_volatility': price_ratio.std(),
                'market_share_estimate': self._estimate_market_share(price_ratio)
            }
            
            # Competitive analysis
            competitive_analysis = {
                'price_leader': 'us' if price_ratio.mean() > 1 else 'competitor',
                'price_follower': 'competitor' if price_ratio.mean() > 1 else 'us',
                'price_gap': abs(price_ratio.mean() - 1),
                'competitive_intensity': price_ratio.std()
            }
            
            self.market_position = market_position
            self.competitor_data = {
                'our_prices': our_prices.tolist(),
                'competitor_prices': competitor_prices.tolist(),
                'price_ratios': price_ratio.tolist()
            }
            
            return {
                'market_position': market_position,
                'competitive_analysis': competitive_analysis,
                'recommendations': self._generate_competitive_recommendations(competitive_analysis)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing competitor prices: {e}")
            raise
    
    def _estimate_market_share(self, price_ratio: pd.Series) -> float:
        """Estimate market share based on price positioning"""
        # Simplified market share estimation
        # In reality, this would use more sophisticated models
        if price_ratio.mean() < 0.9:
            return 0.3  # Price leader
        elif price_ratio.mean() < 1.1:
            return 0.5  # Competitive
        else:
            return 0.2  # Price follower
    
    def _generate_competitive_recommendations(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate competitive pricing recommendations"""
        recommendations = []
        
        if analysis['price_gap'] > 0.2:
            if analysis['price_leader'] == 'us':
                recommendations.append("Consider reducing prices to increase market share")
            else:
                recommendations.append("Consider increasing prices to improve margins")
        
        if analysis['competitive_intensity'] > 0.3:
            recommendations.append("High price volatility detected - consider price stabilization")
        
        if analysis['price_leader'] == 'competitor':
            recommendations.append("Monitor competitor pricing closely for opportunities")
        
        return recommendations
    
    def get_competitive_price_suggestion(self, current_price: float, 
                                       competitor_price: float) -> float:
        """Get competitive price suggestion"""
        # Competitive pricing strategy
        if competitor_price > current_price * 1.2:
            # Competitor is much higher - we can increase
            return current_price * 1.1
        elif competitor_price < current_price * 0.8:
            # Competitor is much lower - we should decrease
            return current_price * 0.9
        else:
            # Similar pricing - maintain slight premium
            return competitor_price * 1.05

class RevenueOptimizer:
    """Revenue optimization using mathematical optimization"""
    
    def __init__(self, config: PricingConfig):
        self.config = config
        self.optimization_model = None
    
    def optimize_revenue(self, demand_function, price_range: Tuple[float, float], 
                        constraints: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Optimize revenue using mathematical optimization"""
        logger.info("Optimizing revenue...")
        
        try:
            # Define optimization problem
            def objective(price):
                demand = demand_function(price)
                revenue = price * demand
                return -revenue  # Minimize negative revenue (maximize revenue)
            
            # Price bounds
            bounds = [(price_range[0], price_range[1])]
            
            # Additional constraints
            if constraints:
                # Add constraint functions here
                pass
            
            # Optimize
            result = minimize(
                objective,
                x0=[(price_range[0] + price_range[1]) / 2],
                bounds=bounds,
                method='L-BFGS-B'
            )
            
            optimal_price = result.x[0]
            optimal_demand = demand_function(optimal_price)
            optimal_revenue = optimal_price * optimal_demand
            
            return {
                'optimal_price': optimal_price,
                'optimal_demand': optimal_demand,
                'optimal_revenue': optimal_revenue,
                'optimization_success': result.success,
                'iterations': result.nit
            }
            
        except Exception as e:
            logger.error(f"Error optimizing revenue: {e}")
            raise
    
    def multi_objective_optimization(self, objectives: List[callable], 
                                   weights: List[float]) -> Dict[str, Any]:
        """Multi-objective optimization for pricing"""
        logger.info("Performing multi-objective optimization...")
        
        try:
            def combined_objective(x):
                combined = 0
                for obj, weight in zip(objectives, weights):
                    combined += weight * obj(x)
                return combined
            
            # Use differential evolution for global optimization
            result = differential_evolution(
                combined_objective,
                bounds=[(self.config.min_price_multiplier, self.config.max_price_multiplier)],
                maxiter=self.config.max_iterations,
                seed=42
            )
            
            return {
                'optimal_solution': result.x[0],
                'optimal_value': result.fun,
                'optimization_success': result.success,
                'iterations': result.nit
            }
            
        except Exception as e:
            logger.error(f"Error in multi-objective optimization: {e}")
            raise

class DynamicPricingAPI:
    """API wrapper for dynamic pricing system"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.config = PricingConfig()
        self.elasticity_model = DemandElasticityModel(self.config)
        self.rl_pricing = ReinforcementLearningPricing(self.config)
        self.competitive_analyzer = CompetitivePricingAnalyzer(self.config)
        self.revenue_optimizer = RevenueOptimizer(self.config)
        
        if model_path:
            self.load_models(model_path)
    
    def train_pricing_models(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Train all pricing models"""
        try:
            # Train elasticity model
            elasticity_result = self.elasticity_model.train_elasticity_model(df)
            
            # Train RL model
            rl_result = self.rl_pricing.train_rl_model(df)
            
            # Analyze competitive pricing
            competitive_result = self.competitive_analyzer.analyze_competitor_prices(df)
            
            return {
                'success': True,
                'elasticity_model': elasticity_result,
                'rl_model': rl_result,
                'competitive_analysis': competitive_result,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error training pricing models: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def get_optimal_price(self, current_price: float, demand: float, 
                         features: Dict[str, Any], strategy: str = 'elasticity') -> Dict[str, Any]:
        """Get optimal price using specified strategy"""
        try:
            if strategy == 'elasticity':
                # Use elasticity-based pricing
                predicted_demand = self.elasticity_model.predict_demand(current_price, features)
                optimal_price = self._optimize_price_elasticity(current_price, predicted_demand)
                
            elif strategy == 'reinforcement_learning':
                # Use RL-based pricing
                season = features.get('month', 1)
                is_weekend = features.get('is_weekend', False)
                optimal_price = self.rl_pricing.get_optimal_price(
                    demand, current_price, season, is_weekend
                )
                
            elif strategy == 'competitive':
                # Use competitive pricing
                competitor_price = features.get('competitor_price', current_price * 1.1)
                optimal_price = self.competitive_analyzer.get_competitive_price_suggestion(
                    current_price, competitor_price
                )
                
            elif strategy == 'revenue_optimization':
                # Use revenue optimization
                def demand_func(price):
                    return self.elasticity_model.predict_demand(price, features)
                
                result = self.revenue_optimizer.optimize_revenue(
                    demand_func, 
                    (current_price * self.config.min_price_multiplier, 
                     current_price * self.config.max_price_multiplier)
                )
                optimal_price = result['optimal_price']
                
            else:
                raise ValueError(f"Unknown pricing strategy: {strategy}")
            
            # Calculate expected metrics
            expected_demand = self.elasticity_model.predict_demand(optimal_price, features)
            expected_revenue = optimal_price * expected_demand
            price_change = (optimal_price - current_price) / current_price
            
            return {
                'success': True,
                'optimal_price': optimal_price,
                'current_price': current_price,
                'price_change_percent': price_change * 100,
                'expected_demand': expected_demand,
                'expected_revenue': expected_revenue,
                'strategy_used': strategy,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting optimal price: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def _optimize_price_elasticity(self, current_price: float, current_demand: float) -> float:
        """Optimize price using elasticity model"""
        # Simple price optimization based on elasticity
        # In production, this would use more sophisticated optimization
        
        # Calculate price elasticity
        elasticity = -0.5  # Typical price elasticity for hospitality
        
        # Optimal price based on elasticity
        optimal_price = current_price * (1 + 1 / abs(elasticity))
        
        # Apply bounds
        optimal_price = max(optimal_price, current_price * self.config.min_price_multiplier)
        optimal_price = min(optimal_price, current_price * self.config.max_price_multiplier)
        
        return optimal_price
    
    def analyze_pricing_performance(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze pricing performance and provide insights"""
        try:
            # Calculate performance metrics
            revenue = df['price'] * df['demand']
            avg_revenue = revenue.mean()
            revenue_volatility = revenue.std()
            
            # Price analysis
            price_volatility = df['price'].std()
            price_trend = self._calculate_trend(df['price'])
            
            # Demand analysis
            demand_volatility = df['demand'].std()
            demand_trend = self._calculate_trend(df['demand'])
            
            # Performance insights
            insights = []
            if price_volatility > df['price'].mean() * 0.2:
                insights.append("High price volatility detected - consider price stabilization")
            
            if revenue_trend < 0:
                insights.append("Declining revenue trend - review pricing strategy")
            
            if demand_trend < 0 and price_trend > 0:
                insights.append("Demand declining while prices increasing - check price elasticity")
            
            return {
                'success': True,
                'performance_metrics': {
                    'avg_revenue': avg_revenue,
                    'revenue_volatility': revenue_volatility,
                    'price_volatility': price_volatility,
                    'demand_volatility': demand_volatility,
                    'price_trend': price_trend,
                    'demand_trend': demand_trend
                },
                'insights': insights,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error analyzing pricing performance: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def _calculate_trend(self, series: pd.Series) -> float:
        """Calculate trend direction and strength"""
        if len(series) < 2:
            return 0.0
        
        # Simple linear trend
        x = np.arange(len(series))
        slope, _, _, _, _ = stats.linregress(x, series)
        
        return slope
    
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
    # Example pricing data
    np.random.seed(42)
    n_days = 365
    
    # Generate sample data
    dates = pd.date_range('2023-01-01', periods=n_days, freq='D')
    
    # Base demand with seasonality
    base_demand = 100 + 20 * np.sin(2 * np.pi * np.arange(n_days) / 365)
    base_demand += 10 * np.sin(2 * np.pi * np.arange(n_days) / 7)  # Weekly pattern
    
    # Price elasticity effect
    base_price = 100
    price_elasticity = -0.5
    prices = base_price + np.random.normal(0, 10, n_days)
    
    # Calculate demand with price elasticity
    demand = base_demand * (prices / base_price) ** price_elasticity
    demand += np.random.normal(0, 5, n_days)  # Add noise
    demand = np.maximum(demand, 0)  # Ensure non-negative
    
    # Create DataFrame
    pricing_df = pd.DataFrame({
        'date': dates,
        'price': prices,
        'demand': demand,
        'competitor_price': prices * (1 + np.random.normal(0, 0.1, n_days)),
        'seasonality': np.sin(2 * np.pi * np.arange(n_days) / 365),
        'day_of_week': dates.dayofweek,
        'is_weekend': dates.dayofweek.isin([5, 6]).astype(int),
        'is_holiday': np.random.choice([0, 1], n_days, p=[0.95, 0.05]),
        'temperature': 20 + 10 * np.sin(2 * np.pi * np.arange(n_days) / 365) + np.random.normal(0, 2, n_days),
        'marketing_spend': np.random.exponential(100, n_days),
        'event_indicator': np.random.choice([0, 1], n_days, p=[0.9, 0.1]),
        'month': dates.month
    })
    
    # Initialize API
    api = DynamicPricingAPI()
    
    # Test model training
    training_result = api.train_pricing_models(pricing_df)
    print("Pricing Models Training:", training_result)
    
    # Test optimal pricing
    sample_features = {
        'competitor_price': 110,
        'seasonality': 0.5,
        'day_of_week': 1,
        'is_weekend': 0,
        'is_holiday': 0,
        'temperature': 25,
        'marketing_spend': 120,
        'event_indicator': 0,
        'month': 6
    }
    
    for strategy in ['elasticity', 'reinforcement_learning', 'competitive', 'revenue_optimization']:
        try:
            optimal_price_result = api.get_optimal_price(
                current_price=100,
                demand=80,
                features=sample_features,
                strategy=strategy
            )
            print(f"{strategy.upper()} Pricing:", optimal_price_result)
        except Exception as e:
            print(f"Error with {strategy}: {e}")
    
    # Test performance analysis
    performance_result = api.analyze_pricing_performance(pricing_df)
    print("Pricing Performance Analysis:", performance_result)