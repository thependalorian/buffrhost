"""
Financial Education System for Hospitality Platform
==================================================

AI-powered financial education system that provides personalized learning paths,
content recommendations, and interactive financial literacy tools for hospitality
business owners and managers.

Features:
- Personalized content recommendation
- Adaptive learning paths
- Progress tracking and gamification
- Interactive financial calculators
- Knowledge assessment and certification

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
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Recommendation system
from surprise import Dataset, Reader, SVD, KNNBasic, SVDpp
from surprise.model_selection import cross_validate

# NLP for content analysis
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from textblob import TextBlob

import warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LearningLevel(Enum):
    """Learning difficulty levels"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class ContentType(Enum):
    """Types of educational content"""
    ARTICLE = "article"
    VIDEO = "video"
    INTERACTIVE = "interactive"
    CALCULATOR = "calculator"
    QUIZ = "quiz"
    CASE_STUDY = "case_study"
    WEBINAR = "webinar"

class UserUser:
    """User learning profile and preferences"""
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.learning_level = LearningLevel.BEGINNER
        self.interests = []
        self.completed_content = []
        self.learning_goals = []
        self.preferred_content_types = []
        self.time_available = 0  # minutes per week
        self.learning_streak = 0
        self.total_points = 0
        self.weak_areas = []
        self.strong_areas = []
        self.last_activity = datetime.now()
    
    def update_profile(self, **kwargs):
        """Update user profile attributes"""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
    
    def add_completed_content(self, content_id: str, score: float = 1.0):
        """Add completed content to user profile"""
        self.completed_content.append({
            'content_id': content_id,
            'completed_at': datetime.now(),
            'score': score
        })
        self.total_points += int(score * 100)
        self.last_activity = datetime.now()
    
    def get_learning_progress(self) -> Dict[str, Any]:
        """Get user's learning progress summary"""
        return {
            'total_completed': len(self.completed_content),
            'total_points': self.total_points,
            'learning_streak': self.learning_streak,
            'current_level': self.learning_level.value,
            'last_activity': self.last_activity.isoformat()
        }

@dataclass
class EducationalContent:
    """Educational content item"""
    content_id: str
    title: str
    description: str
    content_type: ContentType
    difficulty_level: LearningLevel
    topics: List[str]
    estimated_time: int  # minutes
    prerequisites: List[str]
    learning_objectives: List[str]
    tags: List[str]
    content_data: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

@dataclass
class FinancialEducationConfig:
    """Configuration for financial education system"""
    # Content recommendation
    max_recommendations: int = 10
    diversity_factor: float = 0.3
    recency_factor: float = 0.2
    
    # Learning paths
    max_path_length: int = 8
    difficulty_progression: float = 0.2
    
    # Assessment
    quiz_pass_threshold: float = 0.7
    certification_threshold: float = 0.8
    
    # Model persistence
    model_path: str = "models/financial_education"
    version: str = "1.0.0"

class ContentRecommendationEngine:
    """Content recommendation system using collaborative filtering and content-based filtering"""
    
    def __init__(self, config: FinancialEducationConfig):
        self.config = config
        self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.content_similarity_matrix = None
        self.user_content_matrix = None
        self.content_features = None
        
    def prepare_content_features(self, content_items: List[EducationalContent]) -> np.ndarray:
        """Prepare content features for recommendation"""
        # Combine text features
        content_texts = []
        for content in content_items:
            text = f"{content.title} {content.description} {' '.join(content.topics)} {' '.join(content.tags)}"
            content_texts.append(text)
        
        # Vectorize content
        self.content_features = self.vectorizer.fit_transform(content_texts)
        
        # Calculate content similarity matrix
        self.content_similarity_matrix = cosine_similarity(self.content_features)
        
        return self.content_features
    
    def collaborative_filtering_recommendations(self, user_profile: UserUser, 
                                             content_items: List[EducationalContent],
                                             n_recommendations: int = 10) -> List[str]:
        """Generate recommendations using collaborative filtering"""
        if not user_profile.completed_content:
            return self._get_popular_content(content_items, n_recommendations)
        
        # Create user-content interaction matrix
        user_content_scores = {}
        for completion in user_profile.completed_content:
            content_id = completion['content_id']
            score = completion['score']
            user_content_scores[content_id] = score
        
        # Find similar users (simplified - in production, use proper collaborative filtering)
        recommendations = []
        for content in content_items:
            if content.content_id not in user_content_scores:
                # Calculate predicted score based on content similarity
                similarity_score = self._calculate_content_similarity_score(
                    content, user_profile.completed_content, content_items
                )
                recommendations.append((content.content_id, similarity_score))
        
        # Sort by score and return top recommendations
        recommendations.sort(key=lambda x: x[1], reverse=True)
        return [content_id for content_id, _ in recommendations[:n_recommendations]]
    
    def content_based_recommendations(self, user_profile: UserUser,
                                    content_items: List[EducationalContent],
                                    n_recommendations: int = 10) -> List[str]:
        """Generate recommendations using content-based filtering"""
        if not user_profile.completed_content:
            return self._get_content_by_level(user_profile.learning_level, content_items, n_recommendations)
        
        # Get user's preferred topics and content types
        user_preferences = self._extract_user_preferences(user_profile, content_items)
        
        # Calculate content scores based on user preferences
        recommendations = []
        for content in content_items:
            if content.content_id not in [c['content_id'] for c in user_profile.completed_content]:
                score = self._calculate_content_score(content, user_preferences)
                recommendations.append((content.content_id, score))
        
        # Sort by score and return top recommendations
        recommendations.sort(key=lambda x: x[1], reverse=True)
        return [content_id for content_id, _ in recommendations[:n_recommendations]]
    
    def hybrid_recommendations(self, user_profile: UserUser,
                             content_items: List[EducationalContent],
                             n_recommendations: int = 10) -> List[str]:
        """Generate hybrid recommendations combining collaborative and content-based filtering"""
        # Get recommendations from both methods
        collab_recs = self.collaborative_filtering_recommendations(user_profile, content_items, n_recommendations * 2)
        content_recs = self.content_based_recommendations(user_profile, content_items, n_recommendations * 2)
        
        # Combine and rank recommendations
        combined_recs = {}
        
        # Add collaborative filtering recommendations
        for i, content_id in enumerate(collab_recs):
            combined_recs[content_id] = combined_recs.get(content_id, 0) + (len(collab_recs) - i) * 0.6
        
        # Add content-based recommendations
        for i, content_id in enumerate(content_recs):
            combined_recs[content_id] = combined_recs.get(content_id, 0) + (len(content_recs) - i) * 0.4
        
        # Sort by combined score and return top recommendations
        sorted_recs = sorted(combined_recs.items(), key=lambda x: x[1], reverse=True)
        return [content_id for content_id, _ in sorted_recs[:n_recommendations]]
    
    def _calculate_content_similarity_score(self, content: EducationalContent, 
                                          completed_content: List[Dict],
                                          all_content: List[EducationalContent]) -> float:
        """Calculate similarity score for content based on completed content"""
        if not completed_content:
            return 0.0
        
        # Find content items by ID
        content_dict = {c.content_id: c for c in all_content}
        completed_items = [content_dict[c['content_id']] for c in completed_content 
                          if c['content_id'] in content_dict]
        
        if not completed_items:
            return 0.0
        
        # Calculate average similarity
        similarities = []
        for completed_item in completed_items:
            similarity = self._calculate_text_similarity(content, completed_item)
            similarities.append(similarity)
        
        return np.mean(similarities)
    
    def _calculate_text_similarity(self, content1: EducationalContent, content2: EducationalContent) -> float:
        """Calculate text similarity between two content items"""
        text1 = f"{content1.title} {content1.description} {' '.join(content1.topics)}"
        text2 = f"{content2.title} {content2.description} {' '.join(content2.topics)}"
        
        # Vectorize texts
        texts = [text1, text2]
        vectors = self.vectorizer.transform(texts)
        
        # Calculate cosine similarity
        similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
        return similarity
    
    def _extract_user_preferences(self, user_profile: UserUser, 
                                content_items: List[EducationalContent]) -> Dict[str, Any]:
        """Extract user preferences from completed content"""
        preferences = {
            'topics': [],
            'content_types': [],
            'difficulty_levels': [],
            'estimated_times': []
        }
        
        # Get completed content details
        content_dict = {c.content_id: c for c in content_items}
        for completion in user_profile.completed_content:
            content_id = completion['content_id']
            if content_id in content_dict:
                content = content_dict[content_id]
                preferences['topics'].extend(content.topics)
                preferences['content_types'].append(content.content_type.value)
                preferences['difficulty_levels'].append(content.difficulty_level.value)
                preferences['estimated_times'].append(content.estimated_time)
        
        # Calculate frequencies
        preferences['topic_freq'] = dict(pd.Series(preferences['topics']).value_counts())
        preferences['content_type_freq'] = dict(pd.Series(preferences['content_types']).value_counts())
        preferences['difficulty_freq'] = dict(pd.Series(preferences['difficulty_levels']).value_counts())
        preferences['avg_time'] = np.mean(preferences['estimated_times']) if preferences['estimated_times'] else 30
        
        return preferences
    
    def _calculate_content_score(self, content: EducationalContent, user_preferences: Dict[str, Any]) -> float:
        """Calculate content score based on user preferences"""
        score = 0.0
        
        # Topic match score
        topic_score = 0.0
        for topic in content.topics:
            topic_score += user_preferences['topic_freq'].get(topic, 0)
        score += topic_score * 0.3
        
        # Content type match score
        content_type_score = user_preferences['content_type_freq'].get(content.content_type.value, 0)
        score += content_type_score * 0.2
        
        # Difficulty level match score
        difficulty_score = user_preferences['difficulty_freq'].get(content.difficulty_level.value, 0)
        score += difficulty_score * 0.2
        
        # Time preference score
        time_diff = abs(content.estimated_time - user_preferences['avg_time'])
        time_score = max(0, 1 - time_diff / user_preferences['avg_time'])
        score += time_score * 0.1
        
        # Recency score (prefer newer content)
        days_old = (datetime.now() - content.created_at).days
        recency_score = max(0, 1 - days_old / 365)  # Decay over a year
        score += recency_score * 0.2
        
        return score
    
    def _get_popular_content(self, content_items: List[EducationalContent], n: int) -> List[str]:
        """Get most popular content items"""
        # Sort by creation date (newer first) and return top n
        sorted_content = sorted(content_items, key=lambda x: x.created_at, reverse=True)
        return [content.content_id for content in sorted_content[:n]]
    
    def _get_content_by_level(self, level: LearningLevel, content_items: List[EducationalContent], n: int) -> List[str]:
        """Get content items by difficulty level"""
        level_content = [c for c in content_items if c.difficulty_level == level]
        sorted_content = sorted(level_content, key=lambda x: x.created_at, reverse=True)
        return [content.content_id for content in sorted_content[:n]]

class LearningPathGenerator:
    """Generate personalized learning paths for users"""
    
    def __init__(self, config: FinancialEducationConfig):
        self.config = config
    
    def generate_learning_path(self, user_profile: UserUser, 
                             content_items: List[EducationalContent],
                             learning_goal: str) -> List[str]:
        """Generate a personalized learning path"""
        # Filter content by learning goal
        relevant_content = self._filter_content_by_goal(content_items, learning_goal)
        
        # Create learning path based on user level and preferences
        path = []
        current_level = user_profile.learning_level
        
        # Start with content at user's current level
        level_content = [c for c in relevant_content if c.difficulty_level == current_level]
        
        # Add content progressively
        for i in range(min(self.config.max_path_length, len(level_content))):
            if i < len(level_content):
                path.append(level_content[i].content_id)
        
        # Add more advanced content if user is ready
        if len(path) < self.config.max_path_length:
            next_level = self._get_next_level(current_level)
            advanced_content = [c for c in relevant_content if c.difficulty_level == next_level]
            
            for content in advanced_content[:self.config.max_path_length - len(path)]:
                path.append(content.content_id)
        
        return path
    
    def _filter_content_by_goal(self, content_items: List[EducationalContent], goal: str) -> List[EducationalContent]:
        """Filter content items by learning goal"""
        goal_keywords = goal.lower().split()
        relevant_content = []
        
        for content in content_items:
            # Check if goal keywords match content topics or tags
            content_text = f"{' '.join(content.topics)} {' '.join(content.tags)} {content.title}".lower()
            
            if any(keyword in content_text for keyword in goal_keywords):
                relevant_content.append(content)
        
        return relevant_content
    
    def _get_next_level(self, current_level: LearningLevel) -> LearningLevel:
        """Get the next difficulty level"""
        levels = [LearningLevel.BEGINNER, LearningLevel.INTERMEDIATE, 
                 LearningLevel.ADVANCED, LearningLevel.EXPERT]
        
        current_index = levels.index(current_level)
        if current_index < len(levels) - 1:
            return levels[current_index + 1]
        return current_level

class FinancialCalculator:
    """Interactive financial calculators for learning"""
    
    @staticmethod
    def calculate_roi(initial_investment: float, final_value: float, time_period: float) -> Dict[str, float]:
        """Calculate Return on Investment"""
        roi = ((final_value - initial_investment) / initial_investment) * 100
        annualized_roi = ((final_value / initial_investment) ** (1 / time_period) - 1) * 100
        
        return {
            'roi_percentage': roi,
            'annualized_roi': annualized_roi,
            'profit': final_value - initial_investment
        }
    
    @staticmethod
    def calculate_break_even(fixed_costs: float, variable_cost_per_unit: float, 
                           price_per_unit: float) -> Dict[str, float]:
        """Calculate break-even point"""
        if price_per_unit <= variable_cost_per_unit:
            return {'break_even_units': float('inf'), 'break_even_revenue': float('inf')}
        
        break_even_units = fixed_costs / (price_per_unit - variable_cost_per_unit)
        break_even_revenue = break_even_units * price_per_unit
        
        return {
            'break_even_units': break_even_units,
            'break_even_revenue': break_even_revenue
        }
    
    @staticmethod
    def calculate_loan_payment(principal: float, annual_rate: float, 
                             years: int) -> Dict[str, float]:
        """Calculate loan payment"""
        monthly_rate = annual_rate / 12 / 100
        num_payments = years * 12
        
        if monthly_rate == 0:
            monthly_payment = principal / num_payments
        else:
            monthly_payment = principal * (monthly_rate * (1 + monthly_rate) ** num_payments) / \
                            ((1 + monthly_rate) ** num_payments - 1)
        
        total_payment = monthly_payment * num_payments
        total_interest = total_payment - principal
        
        return {
            'monthly_payment': monthly_payment,
            'total_payment': total_payment,
            'total_interest': total_interest
        }
    
    @staticmethod
    def calculate_cash_flow(operating_income: float, operating_expenses: float,
                          depreciation: float, taxes: float) -> Dict[str, float]:
        """Calculate cash flow"""
        ebitda = operating_income - operating_expenses
        ebit = ebitda - depreciation
        net_income = ebit - taxes
        operating_cash_flow = net_income + depreciation
        
        return {
            'ebitda': ebitda,
            'ebit': ebit,
            'net_income': net_income,
            'operating_cash_flow': operating_cash_flow
        }

class AssessmentSystem:
    """Knowledge assessment and certification system"""
    
    def __init__(self, config: FinancialEducationConfig):
        self.config = config
    
    def create_quiz(self, content_id: str, topics: List[str], 
                   difficulty_level: LearningLevel) -> Dict[str, Any]:
        """Create a quiz for specific content"""
        quiz = {
            'quiz_id': f"quiz_{content_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'content_id': content_id,
            'topics': topics,
            'difficulty_level': difficulty_level.value,
            'questions': [],
            'pass_threshold': self.config.quiz_pass_threshold,
            'time_limit': 30,  # minutes
            'created_at': datetime.now().isoformat()
        }
        
        # Generate questions based on topics and difficulty
        questions = self._generate_questions(topics, difficulty_level)
        quiz['questions'] = questions
        
        return quiz
    
    def _generate_questions(self, topics: List[str], difficulty_level: LearningLevel) -> List[Dict[str, Any]]:
        """Generate quiz questions based on topics and difficulty"""
        questions = []
        
        # Sample question templates (in production, these would come from a database)
        question_templates = {
            'financial_statements': [
                {
                    'question': 'What does EBITDA stand for?',
                    'options': ['Earnings Before Interest, Taxes, Depreciation, and Amortization',
                              'Earnings Before Interest and Taxes',
                              'Earnings Before Depreciation and Amortization',
                              'Earnings Before Interest, Taxes, and Depreciation'],
                    'correct_answer': 0,
                    'explanation': 'EBITDA stands for Earnings Before Interest, Taxes, Depreciation, and Amortization.'
                }
            ],
            'cash_flow': [
                {
                    'question': 'What is the primary purpose of a cash flow statement?',
                    'options': ['To show profitability',
                              'To track cash inflows and outflows',
                              'To calculate taxes',
                              'To determine market value'],
                    'correct_answer': 1,
                    'explanation': 'A cash flow statement tracks the movement of cash in and out of a business.'
                }
            ],
            'budgeting': [
                {
                    'question': 'What is the first step in creating a business budget?',
                    'options': ['Set financial goals',
                              'Estimate revenue',
                              'List all expenses',
                              'Choose accounting software'],
                    'correct_answer': 1,
                    'explanation': 'Estimating revenue is typically the first step in budget creation.'
                }
            ]
        }
        
        # Select questions based on topics
        for topic in topics:
            if topic in question_templates:
                questions.extend(question_templates[topic])
        
        # Adjust difficulty if needed
        if difficulty_level == LearningLevel.BEGINNER:
            questions = questions[:3]  # Fewer questions for beginners
        elif difficulty_level == LearningLevel.EXPERT:
            questions = questions[:8]  # More questions for experts
        
        return questions
    
    def grade_quiz(self, quiz_id: str, answers: List[int]) -> Dict[str, Any]:
        """Grade a quiz submission"""
        # In production, this would load the quiz from database
        # For now, we'll create a simple grading system
        
        total_questions = len(answers)
        correct_answers = sum(1 for answer in answers if answer == 0)  # Assuming all correct answers are 0
        
        score = correct_answers / total_questions if total_questions > 0 else 0
        passed = score >= self.config.quiz_pass_threshold
        
        return {
            'quiz_id': quiz_id,
            'score': score,
            'correct_answers': correct_answers,
            'total_questions': total_questions,
            'passed': passed,
            'grade': self._get_letter_grade(score),
            'timestamp': datetime.now().isoformat()
        }
    
    def _get_letter_grade(self, score: float) -> str:
        """Convert numeric score to letter grade"""
        if score >= 0.9:
            return 'A'
        elif score >= 0.8:
            return 'B'
        elif score >= 0.7:
            return 'C'
        elif score >= 0.6:
            return 'D'
        else:
            return 'F'

class FinancialEducationAPI:
    """API wrapper for financial education system"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.config = FinancialEducationConfig()
        self.recommendation_engine = ContentRecommendationEngine(self.config)
        self.learning_path_generator = LearningPathGenerator(self.config)
        self.assessment_system = AssessmentSystem(self.config)
        self.calculator = FinancialCalculator()
        
        if model_path:
            self.load_models(model_path)
    
    def get_recommendations(self, user_profile: UserUser, 
                          content_items: List[EducationalContent]) -> Dict[str, Any]:
        """Get content recommendations for user"""
        try:
            # Prepare content features if not already done
            if self.recommendation_engine.content_features is None:
                self.recommendation_engine.prepare_content_features(content_items)
            
            # Get hybrid recommendations
            recommendations = self.recommendation_engine.hybrid_recommendations(
                user_profile, content_items, self.config.max_recommendations
            )
            
            return {
                'success': True,
                'user_id': user_profile.user_id,
                'recommendations': recommendations,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting recommendations: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def generate_learning_path(self, user_profile: UserUser,
                             content_items: List[EducationalContent],
                             learning_goal: str) -> Dict[str, Any]:
        """Generate personalized learning path"""
        try:
            path = self.learning_path_generator.generate_learning_path(
                user_profile, content_items, learning_goal
            )
            
            return {
                'success': True,
                'user_id': user_profile.user_id,
                'learning_goal': learning_goal,
                'learning_path': path,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error generating learning path: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def calculate_financial_metric(self, metric_type: str, **kwargs) -> Dict[str, Any]:
        """Calculate financial metrics using calculators"""
        try:
            if metric_type == 'roi':
                result = self.calculator.calculate_roi(**kwargs)
            elif metric_type == 'break_even':
                result = self.calculator.calculate_break_even(**kwargs)
            elif metric_type == 'loan_payment':
                result = self.calculator.calculate_loan_payment(**kwargs)
            elif metric_type == 'cash_flow':
                result = self.calculator.calculate_cash_flow(**kwargs)
            else:
                raise ValueError(f"Unknown metric type: {metric_type}")
            
            return {
                'success': True,
                'metric_type': metric_type,
                'result': result,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error calculating metric: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def create_assessment(self, content_id: str, topics: List[str], 
                         difficulty_level: LearningLevel) -> Dict[str, Any]:
        """Create an assessment for specific content"""
        try:
            quiz = self.assessment_system.create_quiz(content_id, topics, difficulty_level)
            
            return {
                'success': True,
                'quiz': quiz,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error creating assessment: {e}")
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
        # In production, this would save actual trained models
        Path(model_path).mkdir(parents=True, exist_ok=True)
        logger.info(f"Models saved to {model_path}")

# Example usage and testing
if __name__ == "__main__":
    # Create sample content
    content_items = [
        EducationalContent(
            content_id="content_001",
            title="Understanding Financial Statements",
            description="Learn the basics of reading and interpreting financial statements",
            content_type=ContentType.ARTICLE,
            difficulty_level=LearningLevel.BEGINNER,
            topics=["financial_statements", "accounting"],
            estimated_time=30,
            prerequisites=[],
            learning_objectives=["Understand balance sheet", "Read income statement"],
            tags=["accounting", "basics"],
            content_data={"text": "Financial statements are..."},
            created_at=datetime.now() - timedelta(days=10),
            updated_at=datetime.now() - timedelta(days=5)
        ),
        EducationalContent(
            content_id="content_002",
            title="Cash Flow Management",
            description="Advanced techniques for managing business cash flow",
            content_type=ContentType.VIDEO,
            difficulty_level=LearningLevel.INTERMEDIATE,
            topics=["cash_flow", "management"],
            estimated_time=45,
            prerequisites=["content_001"],
            learning_objectives=["Optimize cash flow", "Predict cash needs"],
            tags=["cash_flow", "management"],
            content_data={"video_url": "https://example.com/video"},
            created_at=datetime.now() - timedelta(days=5),
            updated_at=datetime.now() - timedelta(days=2)
        )
    ]
    
    # Create user profile
    user_profile = UserUser("user_001")
    user_profile.learning_level = LearningLevel.BEGINNER
    user_profile.interests = ["accounting", "management"]
    user_profile.time_available = 60  # minutes per week
    
    # Initialize API
    api = FinancialEducationAPI()
    
    # Test recommendations
    rec_result = api.get_recommendations(user_profile, content_items)
    print("Recommendations:", rec_result)
    
    # Test learning path generation
    path_result = api.generate_learning_path(user_profile, content_items, "learn accounting")
    print("Learning Path:", path_result)
    
    # Test financial calculator
    roi_result = api.calculate_financial_metric(
        'roi',
        initial_investment=10000,
        final_value=15000,
        time_period=2
    )
    print("ROI Calculation:", roi_result)
    
    # Test assessment creation
    quiz_result = api.create_assessment(
        "content_001",
        ["financial_statements"],
        LearningLevel.BEGINNER
    )
    print("Quiz Created:", quiz_result)