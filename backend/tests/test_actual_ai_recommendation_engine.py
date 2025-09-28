"""
Test the actual AI Recommendation Engine implementation
Tests match the actual implementation in ai/recommendation_engine.py
"""
from datetime import datetime, timedelta
from typing import Any, Dict, List
from unittest.mock import AsyncMock, MagicMock, patch

import numpy as np
import pytest

# Import the actual recommendation engine
from ai.recommendation_engine import (RecommendationEngine,
                                      RecommendationRequest,
                                      RecommendationResponse,
                                      RecommendationType, ServiceCategory)


class TestRecommendationEngine:
    """Test the actual AI recommendation engine functionality."""

    @pytest.fixture
    def recommendation_engine(self):
        """Create a recommendation engine instance for testing."""
        return RecommendationEngine()

    @pytest.fixture
    def sample_customer_data(self):
        """Sample customer data matching actual model structure."""
        return {
            "customer_id": 1,
            "age": 30,
            "gender": "female",
            "dietary_preferences": ["vegetarian"],
            "allergies": ["nuts"],
            "previous_orders": [
                {"menu_item_id": 1, "rating": 5, "category": "appetizers"},
                {"menu_item_id": 2, "rating": 4, "category": "main_courses"},
                {"menu_item_id": 3, "rating": 3, "category": "desserts"},
            ],
            "visit_frequency": "weekly",
            "average_spending": 45.50,
            "loyalty_points": 1500,
            "preferred_service_types": ["restaurant", "spa"],
        }

    @pytest.fixture
    def sample_menu_items(self):
        """Sample menu items matching actual model structure."""
        return [
            {
                "menu_item_id": 1,
                "name": "Caesar Salad",
                "category_id": 1,
                "base_price": 12.99,
                "dietary_tags": "vegetarian",
                "is_available": True,
                "is_popular": True,
                "preparation_time": 10,
                "calories": 250,
                "service_type": "restaurant",
            },
            {
                "menu_item_id": 2,
                "name": "Grilled Salmon",
                "category_id": 2,
                "base_price": 24.99,
                "dietary_tags": "gluten-free",
                "is_available": True,
                "is_popular": True,
                "preparation_time": 20,
                "calories": 400,
                "service_type": "restaurant",
            },
            {
                "menu_item_id": 3,
                "name": "Chocolate Cake",
                "category_id": 3,
                "base_price": 8.99,
                "dietary_tags": "vegetarian",
                "is_available": True,
                "is_popular": False,
                "preparation_time": 5,
                "calories": 500,
                "service_type": "restaurant",
            },
        ]

    def test_initialize_models(self, recommendation_engine):
        """Test that all ML models are properly initialized."""
        # The actual implementation initializes models in __init__
        assert recommendation_engine is not None
        # Check if models are initialized (they should be in the actual implementation)
        assert hasattr(recommendation_engine, "random_forest_model")
        assert hasattr(recommendation_engine, "gradient_boosting_model")
        assert hasattr(recommendation_engine, "linear_regression_model")
        assert hasattr(recommendation_engine, "logistic_regression_model")
        assert hasattr(recommendation_engine, "knn_model")
        assert hasattr(recommendation_engine, "kmeans_model")

    def test_feature_engineering(
        self, recommendation_engine, sample_customer_data, sample_menu_items
    ):
        """Test feature engineering for recommendations."""
        features = recommendation_engine._engineer_features(
            sample_customer_data, sample_menu_items[0]
        )

        # Check that features are properly engineered
        assert len(features) == 20  # Expected number of features
        assert features["customer_age"] == 30
        assert features["customer_gender_female"] == 1
        assert features["customer_gender_male"] == 0
        assert features["item_price"] == 12.99
        assert features["item_is_vegetarian"] == 1
        assert (
            features["dietary_match"] == 1
        )  # Customer is vegetarian, item is vegetarian
        assert features["allergy_conflict"] == 0  # No nut allergy conflict

    def test_collaborative_filtering(
        self, recommendation_engine, sample_customer_data, sample_menu_items
    ):
        """Test collaborative filtering recommendations."""
        # Mock similar customers
        similar_customers = [
            {
                "customer_id": 2,
                "similarity": 0.8,
                "orders": [{"menu_item_id": 1, "rating": 5}],
            },
            {
                "customer_id": 3,
                "similarity": 0.7,
                "orders": [{"menu_item_id": 2, "rating": 4}],
            },
        ]

        with patch.object(
            recommendation_engine,
            "_find_similar_customers",
            return_value=similar_customers,
        ):
            recommendations = recommendation_engine._collaborative_filtering(
                sample_customer_data, sample_menu_items
            )

            assert len(recommendations) > 0
            assert all("score" in rec for rec in recommendations)

    def test_content_based_filtering(
        self, recommendation_engine, sample_customer_data, sample_menu_items
    ):
        """Test content-based filtering recommendations."""
        recommendations = recommendation_engine._content_based_filtering(
            sample_customer_data, sample_menu_items
        )

        assert len(recommendations) > 0
        # Vegetarian customer should get higher scores for vegetarian items
        vegetarian_scores = [
            rec["score"]
            for rec in recommendations
            if rec["item"]["dietary_tags"] == "vegetarian"
        ]
        non_vegetarian_scores = [
            rec["score"]
            for rec in recommendations
            if rec["item"]["dietary_tags"] != "vegetarian"
        ]

        if vegetarian_scores and non_vegetarian_scores:
            assert max(vegetarian_scores) > max(non_vegetarian_scores)

    def test_popularity_based_filtering(self, recommendation_engine, sample_menu_items):
        """Test popularity-based filtering recommendations."""
        recommendations = recommendation_engine._popularity_based_filtering(
            sample_menu_items
        )

        assert len(recommendations) > 0
        # Items should be sorted by popularity score
        scores = [rec["score"] for rec in recommendations]
        assert scores == sorted(scores, reverse=True)

    def test_hybrid_recommendation(
        self, recommendation_engine, sample_customer_data, sample_menu_items
    ):
        """Test hybrid recommendation combining multiple approaches."""
        recommendations = recommendation_engine.get_recommendations(
            sample_customer_data, sample_menu_items
        )

        assert len(recommendations) > 0
        assert all("item" in rec for rec in recommendations)
        assert all("score" in rec for rec in recommendations)
        assert all("reason" in rec for rec in recommendations)

        # Recommendations should be sorted by score
        scores = [rec["score"] for rec in recommendations]
        assert scores == sorted(scores, reverse=True)

    def test_dietary_preference_matching(self, recommendation_engine):
        """Test that dietary preferences are properly matched."""
        vegetarian_customer = {"dietary_preferences": ["vegetarian"], "allergies": []}

        vegan_customer = {"dietary_preferences": ["vegan"], "allergies": []}

        vegetarian_item = {"dietary_tags": "vegetarian"}
        vegan_item = {"dietary_tags": "vegan"}
        meat_item = {"dietary_tags": "meat"}

        # Vegetarian customer should prefer vegetarian items
        veg_score = recommendation_engine._calculate_dietary_score(
            vegetarian_customer, vegetarian_item
        )
        meat_score = recommendation_engine._calculate_dietary_score(
            vegetarian_customer, meat_item
        )
        assert veg_score > meat_score

        # Vegan customer should prefer vegan items
        vegan_score = recommendation_engine._calculate_dietary_score(
            vegan_customer, vegan_item
        )
        veg_score = recommendation_engine._calculate_dietary_score(
            vegan_customer, vegetarian_item
        )
        assert vegan_score > veg_score

    def test_allergy_conflict_detection(self, recommendation_engine):
        """Test that allergy conflicts are properly detected."""
        customer_with_nut_allergy = {"allergies": ["nuts", "dairy"]}

        safe_item = {"dietary_tags": "gluten-free"}
        nut_item = {"dietary_tags": "contains-nuts"}
        dairy_item = {"dietary_tags": "contains-dairy"}

        safe_score = recommendation_engine._calculate_allergy_score(
            customer_with_nut_allergy, safe_item
        )
        nut_score = recommendation_engine._calculate_allergy_score(
            customer_with_nut_allergy, nut_item
        )
        dairy_score = recommendation_engine._calculate_allergy_score(
            customer_with_nut_allergy, dairy_item
        )

        assert safe_score > nut_score
        assert safe_score > dairy_score
        assert nut_score == 0  # Should be 0 due to allergy conflict
        assert dairy_score == 0  # Should be 0 due to allergy conflict

    def test_price_preference_matching(self, recommendation_engine):
        """Test that price preferences are properly matched."""
        budget_customer = {"average_spending": 20.00}
        premium_customer = {"average_spending": 80.00}

        budget_item = {"base_price": 15.99}
        premium_item = {"base_price": 45.99}

        # Budget customer should prefer budget items
        budget_score_budget = recommendation_engine._calculate_price_score(
            budget_customer, budget_item
        )
        budget_score_premium = recommendation_engine._calculate_price_score(
            budget_customer, premium_item
        )
        assert budget_score_budget > budget_score_premium

        # Premium customer should prefer premium items
        premium_score_budget = recommendation_engine._calculate_price_score(
            premium_customer, budget_item
        )
        premium_score_premium = recommendation_engine._calculate_price_score(
            premium_customer, premium_item
        )
        assert premium_score_premium > premium_score_budget

    def test_seasonal_recommendations(
        self, recommendation_engine, sample_customer_data, sample_menu_items
    ):
        """Test seasonal recommendation adjustments."""
        # Mock current season
        with patch(
            "ai.recommendation_engine.get_current_season", return_value="summer"
        ):
            recommendations = recommendation_engine.get_recommendations(
                sample_customer_data, sample_menu_items
            )

            # Should adjust scores based on season
            assert len(recommendations) > 0

    def test_time_based_recommendations(
        self, recommendation_engine, sample_customer_data, sample_menu_items
    ):
        """Test time-based recommendation adjustments."""
        # Mock current time
        with patch(
            "ai.recommendation_engine.get_current_time", return_value="breakfast"
        ):
            recommendations = recommendation_engine.get_recommendations(
                sample_customer_data, sample_menu_items
            )

            # Should adjust scores based on time of day
            assert len(recommendations) > 0

    def test_recommendation_diversity(
        self, recommendation_engine, sample_customer_data, sample_menu_items
    ):
        """Test that recommendations include diverse categories."""
        recommendations = recommendation_engine.get_recommendations(
            sample_customer_data, sample_menu_items
        )

        categories = [rec["item"]["category_id"] for rec in recommendations]
        unique_categories = set(categories)

        # Should have recommendations from multiple categories
        assert len(unique_categories) > 1

    def test_cold_start_problem(self, recommendation_engine):
        """Test recommendations for new customers with no history."""
        new_customer = {
            "customer_id": 999,
            "age": 25,
            "gender": "male",
            "dietary_preferences": [],
            "allergies": [],
            "previous_orders": [],
            "visit_frequency": "first_time",
            "average_spending": 0,
            "loyalty_points": 0,
            "preferred_service_types": [],
        }

        sample_menu_items = [
            {
                "menu_item_id": 1,
                "name": "Caesar Salad",
                "category_id": 1,
                "base_price": 12.99,
                "dietary_tags": "vegetarian",
                "is_available": True,
                "is_popular": True,
                "preparation_time": 10,
                "calories": 250,
                "service_type": "restaurant",
            }
        ]

        recommendations = recommendation_engine.get_recommendations(
            new_customer, sample_menu_items
        )

        # Should still provide recommendations based on popularity and general preferences
        assert len(recommendations) > 0
        assert all("reason" in rec for rec in recommendations)

    def test_model_performance_metrics(self, recommendation_engine):
        """Test that model performance metrics are calculated correctly."""
        # Mock test data
        test_data = [
            {
                "customer_id": 1,
                "menu_item_id": 1,
                "actual_rating": 5,
                "predicted_rating": 4.5,
            },
            {
                "customer_id": 2,
                "menu_item_id": 2,
                "actual_rating": 3,
                "predicted_rating": 3.2,
            },
            {
                "customer_id": 3,
                "menu_item_id": 3,
                "actual_rating": 4,
                "predicted_rating": 4.1,
            },
        ]

        metrics = recommendation_engine._calculate_performance_metrics(test_data)

        assert "mae" in metrics  # Mean Absolute Error
        assert "rmse" in metrics  # Root Mean Square Error
        assert "precision" in metrics
        assert "recall" in metrics
        assert "f1_score" in metrics

    def test_recommendation_explanation(
        self, recommendation_engine, sample_customer_data, sample_menu_items
    ):
        """Test that recommendations include explanations."""
        recommendations = recommendation_engine.get_recommendations(
            sample_customer_data, sample_menu_items
        )

        for rec in recommendations:
            assert "reason" in rec
            assert isinstance(rec["reason"], str)
            assert len(rec["reason"]) > 0

    def test_recommendation_caching(
        self, recommendation_engine, sample_customer_data, sample_menu_items
    ):
        """Test that recommendations are properly cached."""
        # First call
        recommendations1 = recommendation_engine.get_recommendations(
            sample_customer_data, sample_menu_items
        )

        # Second call should use cache
        recommendations2 = recommendation_engine.get_recommendations(
            sample_customer_data, sample_menu_items
        )

        # Results should be identical
        assert len(recommendations1) == len(recommendations2)
        assert all(
            r1["item"]["menu_item_id"] == r2["item"]["menu_item_id"]
            for r1, r2 in zip(recommendations1, recommendations2)
        )

    def test_error_handling(self, recommendation_engine):
        """Test error handling in recommendation engine."""
        # Test with invalid customer data
        invalid_customer = None
        recommendations = recommendation_engine.get_recommendations(
            invalid_customer, []
        )

        # Should return empty list or default recommendations
        assert isinstance(recommendations, list)

        # Test with empty menu items
        recommendations = recommendation_engine.get_recommendations(
            sample_customer_data, []
        )
        assert isinstance(recommendations, list)

    def test_model_retraining(self, recommendation_engine):
        """Test model retraining functionality."""
        # Mock new training data
        new_data = [
            {
                "customer_id": 1,
                "menu_item_id": 1,
                "rating": 5,
                "features": [1, 2, 3, 4, 5],
            },
            {
                "customer_id": 2,
                "menu_item_id": 2,
                "rating": 4,
                "features": [2, 3, 4, 5, 6],
            },
        ]

        # Should be able to retrain models
        recommendation_engine.retrain_models(new_data)

        # Models should still be functional after retraining
        assert recommendation_engine.random_forest_model is not None
        assert recommendation_engine.gradient_boosting_model is not None
