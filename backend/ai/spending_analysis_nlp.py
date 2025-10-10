"""
Spending Analysis with NLP for Hospitality Platform
==================================================

Advanced spending analysis system using Natural Language Processing (NLP) techniques
to analyze customer spending patterns, extract insights from transaction descriptions,
and provide personalized financial recommendations.

Features:
- Text classification and sentiment analysis
- Spending pattern recognition
- Category extraction from descriptions
- Personalized insights generation
- Behavioral analysis and recommendations

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
import re
from pathlib import Path
from collections import Counter, defaultdict

# Core ML and NLP libraries
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.metrics import classification_report, confusion_matrix, silhouette_score
from sklearn.preprocessing import StandardScaler, LabelEncoder

# NLP libraries
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import WordNetLemmatizer, PorterStemmer
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.chunk import ne_chunk
from nltk.tag import pos_tag

# Text processing
import spacy
from textblob import TextBlob
import warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Download required NLTK data
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)
    nltk.download('vader_lexicon', quiet=True)
    nltk.download('averaged_perceptron_tagger', quiet=True)
    nltk.download('maxent_ne_chunker', quiet=True)
    nltk.download('words', quiet=True)
except:
    logger.warning("NLTK data download failed - some features may not work")

@dataclass
class SpendingAnalysisConfig:
    """Configuration for spending analysis system"""
    # Text processing
    max_features: int = 5000
    ngram_range: (int, int) = (1, 2)
    min_df: int = 2
    max_df: float = 0.95
    
    # Clustering
    n_clusters: int = 8
    random_state: int = 42
    
    # Analysis parameters
    sentiment_threshold: float = 0.1
    spending_categories: List[str] = None
    
    # Model persistence
    model_path: str = "models/spending_analysis"
    version: str = "1.0.0"
    
    def __post_init__(self):
        if self.spending_categories is None:
            self.spending_categories = [
                'accommodation', 'dining', 'entertainment', 'transportation',
                'shopping', 'wellness', 'business', 'other'
            ]

class TextPreprocessor:
    """Advanced text preprocessing for spending analysis"""
    
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.stemmer = PorterStemmer()
        self.stop_words = set(stopwords.words('english'))
        self.sia = SentimentIntensityAnalyzer()
        
        # Custom hospitality stop words
        self.hospitality_stop_words = {
            'hotel', 'restaurant', 'spa', 'resort', 'booking', 'reservation',
            'guest', 'customer', 'service', 'room', 'table', 'order'
        }
        
        # Spending category keywords
        self.category_keywords = {
            'accommodation': ['room', 'suite', 'hotel', 'resort', 'accommodation', 'stay', 'night'],
            'dining': ['food', 'restaurant', 'dining', 'meal', 'breakfast', 'lunch', 'dinner', 'bar', 'drink'],
            'entertainment': ['entertainment', 'show', 'concert', 'theater', 'movie', 'game', 'activity'],
            'transportation': ['taxi', 'uber', 'lyft', 'transport', 'shuttle', 'car', 'flight', 'train'],
            'shopping': ['shop', 'store', 'gift', 'souvenir', 'retail', 'purchase', 'buy'],
            'wellness': ['spa', 'massage', 'fitness', 'gym', 'wellness', 'treatment', 'therapy'],
            'business': ['business', 'meeting', 'conference', 'corporate', 'office', 'work'],
            'other': ['misc', 'other', 'additional', 'extra', 'service', 'fee']
        }
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if pd.isna(text) or not isinstance(text, str):
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters but keep spaces
        text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def tokenize_text(self, text: str) -> List[str]:
        """Tokenize text into words"""
        tokens = word_tokenize(text)
        return [token for token in tokens if token.isalpha()]
    
    def remove_stop_words(self, tokens: List[str]) -> List[str]:
        """Remove stop words and hospitality-specific stop words"""
        all_stop_words = self.stop_words.union(self.hospitality_stop_words)
        return [token for token in tokens if token not in all_stop_words]
    
    def lemmatize_tokens(self, tokens: List[str]) -> List[str]:
        """Lemmatize tokens to their root form"""
        return [self.lemmatizer.lemmatize(token) for token in tokens]
    
    def stem_tokens(self, tokens: List[str]) -> List[str]:
        """Stem tokens (alternative to lemmatization)"""
        return [self.stemmer.stem(token) for token in tokens]
    
    def preprocess_text(self, text: str, use_stemming: bool = False) -> str:
        """Complete text preprocessing pipeline"""
        # Clean text
        cleaned_text = self.clean_text(text)
        
        # Tokenize
        tokens = self.tokenize_text(cleaned_text)
        
        # Remove stop words
        tokens = self.remove_stop_words(tokens)
        
        # Lemmatize or stem
        if use_stemming:
            tokens = self.stem_tokens(tokens)
        else:
            tokens = self.lemmatize_tokens(tokens)
        
        return ' '.join(tokens)
    
    def extract_entities(self, text: str) -> List[Dict[str, str]]:
        """Extract named entities from text"""
        try:
            tokens = word_tokenize(text)
            pos_tags = pos_tag(tokens)
            entities = ne_chunk(pos_tags)
            
            extracted_entities = []
            for entity in entities:
                if hasattr(entity, 'label'):
                    extracted_entities.append({
                        'text': ' '.join([token for token, pos in entity.leaves()]),
                        'label': entity.label()
                    })
            
            return extracted_entities
        except:
            return []
    
    def analyze_sentiment(self, text: str) -> Dict[str, float]:
        """Analyze sentiment of text"""
        return self.sia.polarity_scores(text)
    
    def extract_spending_category(self, text: str) -> str:
        """Extract spending category from text"""
        text_lower = text.lower()
        
        category_scores = {}
        for category, keywords in self.category_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            category_scores[category] = score
        
        if category_scores:
            return max(category_scores, key=category_scores.get)
        return 'other'

class SpendingPatternAnalyzer:
    """Analyze spending patterns and behaviors"""
    
    def __init__(self, config: SpendingAnalysisConfig):
        self.config = config
        self.preprocessor = TextPreprocessor()
        self.vectorizer = TfidfVectorizer(
            max_features=config.max_features,
            ngram_range=config.ngram_range,
            min_df=config.min_df,
            max_df=config.max_df,
            stop_words='english'
        )
        self.category_classifier = None
        self.sentiment_classifier = None
        self.spending_clusterer = None
        self.scaler = StandardScaler()
        
    def create_text_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create text-based features from transaction descriptions"""
        features = df.copy()
        
        if 'description' not in df.columns:
            logger.warning("No 'description' column found in data")
            return features
        
        # Preprocess descriptions
        features['processed_description'] = features['description'].apply(
            lambda x: self.preprocessor.preprocess_text(str(x))
        )
        
        # Text length features
        features['description_length'] = features['description'].str.len()
        features['word_count'] = features['processed_description'].str.split().str.len()
        
        # Sentiment analysis
        sentiment_scores = features['description'].apply(
            lambda x: self.preprocessor.analyze_sentiment(str(x))
        )
        features['sentiment_positive'] = sentiment_scores.apply(lambda x: x['pos'])
        features['sentiment_negative'] = sentiment_scores.apply(lambda x: x['neg'])
        features['sentiment_neutral'] = sentiment_scores.apply(lambda x: x['neu'])
        features['sentiment_compound'] = sentiment_scores.apply(lambda x: x['compound'])
        
        # Category extraction
        features['extracted_category'] = features['description'].apply(
            lambda x: self.preprocessor.extract_spending_category(str(x))
        )
        
        # Entity extraction
        features['entities'] = features['description'].apply(
            lambda x: self.preprocessor.extract_entities(str(x))
        )
        features['entity_count'] = features['entities'].apply(len)
        
        return features
    
    def create_spending_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create spending pattern features"""
        features = df.copy()
        
        # Amount-based features
        if 'amount' in df.columns:
            features['amount_log'] = np.log1p(features['amount'])
            features['amount_zscore'] = stats.zscore(features['amount'])
            features['amount_percentile'] = features['amount'].rank(pct=True)
        
        # Time-based features
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            features['hour'] = df['timestamp'].dt.hour
            features['day_of_week'] = df['timestamp'].dt.dayofweek
            features['month'] = df['timestamp'].dt.month
            features['is_weekend'] = features['day_of_week'].isin([5, 6]).astype(int)
            features['is_business_hours'] = features['hour'].between(9, 17).astype(int)
        
        # User-based features
        if 'user_id' in df.columns:
            # Spending frequency
            features['user_spending_frequency'] = df.groupby('user_id')['user_id'].transform('count')
            
            # Average spending
            features['user_avg_spending'] = df.groupby('user_id')['amount'].transform('mean')
            
            # Spending variance
            features['user_spending_variance'] = df.groupby('user_id')['amount'].transform('std')
            
            # Recent spending trend
            if 'timestamp' in df.columns:
                recent_cutoff = df['timestamp'].max() - timedelta(days=30)
                recent_mask = df['timestamp'] >= recent_cutoff
                features['recent_spending'] = df[recent_mask].groupby('user_id')['amount'].transform('sum').fillna(0)
        
        return features
    
    def train_category_classifier(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Train category classification model"""
        logger.info("Training spending category classifier...")
        
        # Prepare features
        features = self.create_text_features(df)
        
        # Prepare training data
        X_text = self.vectorizer.fit_transform(features['processed_description'])
        y_category = features['extracted_category']
        
        # Train classifier
        self.category_classifier = RandomForestClassifier(
            n_estimators=100,
            random_state=self.config.random_state,
            class_weight='balanced'
        )
        self.category_classifier.fit(X_text, y_category)
        
        # Evaluate model
        y_pred = self.category_classifier.predict(X_text)
        accuracy = (y_pred == y_category).mean()
        
        logger.info(f"Category classifier accuracy: {accuracy:.3f}")
        
        return {
            'accuracy': accuracy,
            'classification_report': classification_report(y_category, y_pred, output_dict=True)
        }
    
    def train_sentiment_classifier(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Train sentiment classification model"""
        logger.info("Training sentiment classifier...")
        
        # Prepare features
        features = self.create_text_features(df)
        
        # Prepare training data
        X_text = self.vectorizer.fit_transform(features['processed_description'])
        
        # Create sentiment labels (positive, negative, neutral)
        sentiment_labels = []
        for compound in features['sentiment_compound']:
            if compound >= self.config.sentiment_threshold:
                sentiment_labels.append('positive')
            elif compound <= -self.config.sentiment_threshold:
                sentiment_labels.append('negative')
            else:
                sentiment_labels.append('neutral')
        
        y_sentiment = pd.Series(sentiment_labels)
        
        # Train classifier
        self.sentiment_classifier = MultinomialNB()
        self.sentiment_classifier.fit(X_text, y_sentiment)
        
        # Evaluate model
        y_pred = self.sentiment_classifier.predict(X_text)
        accuracy = (y_pred == y_sentiment).mean()
        
        logger.info(f"Sentiment classifier accuracy: {accuracy:.3f}")
        
        return {
            'accuracy': accuracy,
            'classification_report': classification_report(y_sentiment, y_pred, output_dict=True)
        }
    
    def create_spending_clusters(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Create spending behavior clusters"""
        logger.info("Creating spending behavior clusters...")
        
        # Prepare features
        features = self.create_spending_features(df)
        
        # Select numeric features for clustering
        numeric_features = features.select_dtypes(include=[np.number])
        X_cluster = self.scaler.fit_transform(numeric_features)
        
        # Perform clustering
        self.spending_clusterer = KMeans(
            n_clusters=self.config.n_clusters,
            random_state=self.config.random_state,
            n_init=10
        )
        cluster_labels = self.spending_clusterer.fit_predict(X_cluster)
        
        # Calculate silhouette score
        silhouette_avg = silhouette_score(X_cluster, cluster_labels)
        
        # Analyze clusters
        cluster_analysis = self._analyze_clusters(features, cluster_labels)
        
        logger.info(f"Clustering silhouette score: {silhouette_avg:.3f}")
        
        return {
            'silhouette_score': silhouette_avg,
            'cluster_labels': cluster_labels.tolist(),
            'cluster_analysis': cluster_analysis
        }
    
    def _analyze_clusters(self, features: pd.DataFrame, cluster_labels: np.ndarray) -> Dict[str, Any]:
        """Analyze spending behavior clusters"""
        cluster_analysis = {}
        
        for cluster_id in range(self.config.n_clusters):
            cluster_mask = cluster_labels == cluster_id
            cluster_data = features[cluster_mask]
            
            if len(cluster_data) == 0:
                continue
            
            analysis = {
                'size': len(cluster_data),
                'percentage': len(cluster_data) / len(features) * 100,
                'avg_amount': cluster_data['amount'].mean() if 'amount' in cluster_data.columns else 0,
                'avg_frequency': cluster_data['user_spending_frequency'].mean() if 'user_spending_frequency' in cluster_data.columns else 0,
                'top_categories': cluster_data['extracted_category'].value_counts().head(3).to_dict() if 'extracted_category' in cluster_data.columns else {},
                'avg_sentiment': cluster_data['sentiment_compound'].mean() if 'sentiment_compound' in cluster_data.columns else 0
            }
            
            cluster_analysis[f'cluster_{cluster_id}'] = analysis
        
        return cluster_analysis
    
    def generate_insights(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Generate spending insights and recommendations"""
        insights = {}
        
        # Overall spending patterns
        if 'amount' in df.columns:
            insights['total_spending'] = df['amount'].sum()
            insights['avg_transaction'] = df['amount'].mean()
            insights['median_transaction'] = df['amount'].median()
            insights['spending_std'] = df['amount'].std()
        
        # Category distribution
        if 'extracted_category' in df.columns:
            category_dist = df['extracted_category'].value_counts(normalize=True)
            insights['category_distribution'] = category_dist.to_dict()
            insights['top_category'] = category_dist.index[0]
        
        # Sentiment analysis
        if 'sentiment_compound' in df.columns:
            avg_sentiment = df['sentiment_compound'].mean()
            insights['overall_sentiment'] = 'positive' if avg_sentiment > 0.1 else 'negative' if avg_sentiment < -0.1 else 'neutral'
            insights['sentiment_score'] = avg_sentiment
        
        # Time patterns
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            insights['peak_hour'] = df['timestamp'].dt.hour.mode().iloc[0] if len(df) > 0 else 0
            insights['peak_day'] = df['timestamp'].dt.dayofweek.mode().iloc[0] if len(df) > 0 else 0
        
        # Generate recommendations
        insights['recommendations'] = self._generate_recommendations(insights)
        
        return insights
    
    def _generate_recommendations(self, insights: Dict[str, Any]) -> List[str]:
        """Generate personalized recommendations based on insights"""
        recommendations = []
        
        # Category-based recommendations
        if 'category_distribution' in insights:
            top_category = insights.get('top_category', '')
            if top_category == 'dining':
                recommendations.append("Consider offering dining packages or loyalty programs")
            elif top_category == 'accommodation':
                recommendations.append("Focus on room upgrades and extended stay offers")
            elif top_category == 'wellness':
                recommendations.append("Promote spa packages and wellness retreats")
        
        # Sentiment-based recommendations
        if 'sentiment_score' in insights:
            sentiment_score = insights['sentiment_score']
            if sentiment_score < -0.1:
                recommendations.append("Address customer concerns - negative sentiment detected")
            elif sentiment_score > 0.3:
                recommendations.append("Leverage positive sentiment for marketing campaigns")
        
        # Spending pattern recommendations
        if 'spending_std' in insights:
            spending_std = insights['spending_std']
            avg_transaction = insights.get('avg_transaction', 0)
            if spending_std > avg_transaction * 0.5:
                recommendations.append("High spending variance - consider personalized pricing")
        
        return recommendations

class SpendingAnalysisAPI:
    """API wrapper for spending analysis system"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.analyzer = SpendingPatternAnalyzer(SpendingAnalysisConfig())
        if model_path:
            self.analyzer.load_models(model_path)
    
    def analyze_transaction(self, transaction_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze a single transaction"""
        try:
            df = pd.DataFrame([transaction_data])
            
            # Generate insights
            insights = self.analyzer.generate_insights(df)
            
            # Predict category if model is trained
            category = 'other'
            if self.analyzer.category_classifier is not None:
                processed_text = self.analyzer.preprocessor.preprocess_text(
                    str(transaction_data.get('description', ''))
                )
                X_text = self.analyzer.vectorizer.transform([processed_text])
                category = self.analyzer.category_classifier.predict(X_text)[0]
            
            # Predict sentiment if model is trained
            sentiment = 'neutral'
            if self.analyzer.sentiment_classifier is not None:
                processed_text = self.analyzer.preprocessor.preprocess_text(
                    str(transaction_data.get('description', ''))
                )
                X_text = self.analyzer.vectorizer.transform([processed_text])
                sentiment = self.analyzer.sentiment_classifier.predict(X_text)[0]
            
            return {
                'success': True,
                'transaction_id': transaction_data.get('transaction_id', 'unknown'),
                'predicted_category': category,
                'predicted_sentiment': sentiment,
                'insights': insights,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error analyzing transaction: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def batch_analyze_transactions(self, transactions_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Analyze multiple transactions"""
        results = []
        for transaction_data in transactions_data:
            result = self.analyze_transaction(transaction_data)
            results.append(result)
        return results

# Example usage and testing
if __name__ == "__main__":
    # Example configuration
    config = SpendingAnalysisConfig(
        max_features=1000,
        n_clusters=5
    )
    
    # Initialize analyzer
    analyzer = SpendingPatternAnalyzer(config)
    
    # Example training data
    np.random.seed(42)
    n_samples = 500
    
    training_data = pd.DataFrame({
        'transaction_id': range(n_samples),
        'user_id': np.random.randint(1, 50, n_samples),
        'amount': np.random.lognormal(3, 1, n_samples),
        'timestamp': pd.date_range('2024-01-01', periods=n_samples, freq='2H'),
        'description': [
            np.random.choice([
                f"Room booking for {np.random.choice(['suite', 'deluxe', 'standard'])} room",
                f"Dining at {np.random.choice(['restaurant', 'cafe', 'bar'])}",
                f"Spa treatment - {np.random.choice(['massage', 'facial', 'therapy'])}",
                f"Transportation to {np.random.choice(['airport', 'city', 'venue'])}",
                f"Shopping at {np.random.choice(['gift shop', 'boutique', 'store'])}"
            ])
            for _ in range(n_samples)
        ]
    })
    
    # Train models
    category_metrics = analyzer.train_category_classifier(training_data)
    sentiment_metrics = analyzer.train_sentiment_classifier(training_data)
    cluster_results = analyzer.create_spending_clusters(training_data)
    
    print("Training Results:")
    print(f"Category Classifier Accuracy: {category_metrics['accuracy']:.3f}")
    print(f"Sentiment Classifier Accuracy: {sentiment_metrics['accuracy']:.3f}")
    print(f"Clustering Silhouette Score: {cluster_results['silhouette_score']:.3f}")
    
    # Generate insights
    insights = analyzer.generate_insights(training_data)
    print(f"\nSpending Insights:")
    print(f"Total Spending: ${insights['total_spending']:,.2f}")
    print(f"Average Transaction: ${insights['avg_transaction']:,.2f}")
    print(f"Top Category: {insights['top_category']}")
    print(f"Overall Sentiment: {insights['overall_sentiment']}")
    
    # Test analysis
    test_transaction = {
        'transaction_id': 'test_001',
        'user_id': 1,
        'amount': 150.00,
        'timestamp': datetime.now(),
        'description': 'Deluxe suite booking with spa package'
    }
    
    api = SpendingAnalysisAPI()
    result = api.analyze_transaction(test_transaction)
    print(f"\nTest Transaction Analysis:")
    print(f"Predicted Category: {result['predicted_category']}")
    print(f"Predicted Sentiment: {result['predicted_sentiment']}")
    print(f"Recommendations: {result['insights']['recommendations']}")