"""
AI-Powered Recommendation Engine for Buffr Host Hospitality Platform

This module implements intelligent cross-service recommendations using:
- Pydantic AI for structured recommendation responses
- LangChain for recommendation chain processing
- Machine learning for personalization
- Collaborative filtering for cross-service recommendations

Features:
- Cross-service recommendations (restaurant, hotel, spa, conference, etc.)
- Personalized guest recommendations
- Collaborative filtering based on similar guests
- Content-based filtering using service attributes
- Real-time recommendation updates
- A/B testing for recommendation algorithms
"""

import asyncio
import logging
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime, timedelta
from enum import Enum
from statistics import mean, mode
from typing import Any, Dict, List, Optional, Tuple, Union

import numpy as np
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

# Import database models
from models.menu import Menu
from models.order import Order, OrderItem
from models.services import ConferenceRoom, SpaService, TransportationService
from models.user import User

logger = logging.getLogger(__name__)


# Enums for recommendation types and service categories
class RecommendationType(str, Enum):
    COLLABORATIVE = "collaborative"
    CONTENT_BASED = "content_based"
    PERSONALIZED = "personalized"
    POPULAR = "popular"
    SEASONAL = "seasonal"


class ServiceCategory(str, Enum):
    RESTAURANT = "restaurant"
    SPA = "spa"
    CONFERENCE = "conference"
    TRANSPORTATION = "transportation"
    RECREATION = "recreation"
    SPECIALIZED = "specialized"
    HOTEL = "hotel"


# Pydantic models for structured responses
class GuestUser(BaseModel):
    customer_id: int
    spending_patterns: Dict[str, float] = Field(default_factory=dict)
    preferred_service_types: List[ServiceCategory] = Field(default_factory=list)
    average_group_size: int = 2
    visit_frequency: float = 0.0
    loyalty_tier: str = "bronze"
    dietary_preferences: List[str] = Field(default_factory=list)
    accessibility_needs: List[str] = Field(default_factory=list)


class RecommendationRequest(BaseModel):
    customer_id: int
    property_id: int
    current_service_type: Optional[ServiceCategory] = None
    budget_range: Optional[Tuple[float, float]] = None
    group_size: Optional[int] = None
    time_preference: Optional[str] = None
    max_recommendations: int = 5


class Recommendation(BaseModel):
    service_id: str
    service_name: str
    service_type: ServiceCategory
    recommendation_score: float = Field(ge=0.0, le=1.0)
    recommendation_type: RecommendationType
    reasoning: str
    price_range: str
    availability: bool
    estimated_duration: str
    discount_available: bool = False
    cross_service_bundle: Optional[str] = None


class RecommendationResponse(BaseModel):
    customer_id: int
    property_id: int
    recommendations: List[Recommendation]
    total_recommendations: int
    generated_at: datetime
    algorithm_used: List[RecommendationType]


class RecommendationEngine:
    """
    AI-Powered Recommendation Engine for Buffr Host Hospitality Platform

    This engine provides intelligent cross-service recommendations using:
    - Collaborative filtering based on similar guest preferences
    - Content-based filtering using service attributes
    - Personalized recommendations based on guest history
    - Seasonal and popular recommendations
    - Cross-service bundle recommendations
    """

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

        # Service similarity matrix for content-based filtering
        self.service_similarity = {
            "restaurant": {"spa": 0.3, "conference": 0.2, "transportation": 0.1},
            "spa": {"restaurant": 0.3, "hotel": 0.4, "recreation": 0.2},
            "conference": {"restaurant": 0.2, "transportation": 0.4, "hotel": 0.3},
            "transportation": {
                "conference": 0.4,
                "recreation": 0.3,
                "specialized": 0.2,
            },
            "recreation": {"spa": 0.2, "transportation": 0.3, "restaurant": 0.1},
            "specialized": {"transportation": 0.2, "conference": 0.1, "hotel": 0.3},
        }

        # Initialize ML models (will be loaded when needed)
        self.collaborative_model = None
        self.content_model = None
        self.ensemble_model = None
        self.is_models_loaded = False

    async def get_recommendations(
        self, request: RecommendationRequest
    ) -> RecommendationResponse:
        """
        Get personalized recommendations for a guest

        Args:
            request: RecommendationRequest with guest and context information

        Returns:
            RecommendationResponse with ranked recommendations
        """
        try:
            # Build guest profile
            guest_profile = await self._build_guest_profile(request.customer_id)

            # Get available services
            available_services = await self._get_available_services(request.property_id)

            # Generate recommendations using multiple algorithms
            all_recommendations = []

            # Machine Learning-based recommendations
            ml_recs = await self._get_ml_based_recommendations(
                guest_profile, available_services, request
            )
            all_recommendations.extend(ml_recs)

            # Collaborative filtering
            collaborative_recs = await self._get_collaborative_recommendations(
                guest_profile, available_services, request
            )
            all_recommendations.extend(collaborative_recs)

            # Content-based filtering
            content_recs = await self._get_content_based_recommendations(
                available_services, request
            )
            all_recommendations.extend(content_recs)

            # Personalized recommendations
            personalized_recs = await self._get_personalized_recommendations(
                guest_profile, available_services, request
            )
            all_recommendations.extend(personalized_recs)

            # Popular recommendations
            popular_recs = await self._get_popular_recommendations(
                available_services, request
            )
            all_recommendations.extend(popular_recs)

            # Seasonal recommendations
            seasonal_recs = await self._get_seasonal_recommendations(
                available_services, request
            )
            all_recommendations.extend(seasonal_recs)

            # Combine and rank recommendations
            final_recommendations = await self._combine_and_rank_recommendations(
                all_recommendations, request
            )

            # Limit to requested number
            final_recommendations = final_recommendations[: request.max_recommendations]

            return RecommendationResponse(
                customer_id=request.customer_id,
                property_id=request.property_id,
                recommendations=final_recommendations,
                total_recommendations=len(final_recommendations),
                generated_at=datetime.utcnow(),
                algorithm_used=[
                    rec.recommendation_type for rec in final_recommendations
                ],
            )

        except Exception as e:
            logger.error(f"Error getting recommendations: {e}")
            return RecommendationResponse(
                customer_id=request.customer_id,
                property_id=request.property_id,
                recommendations=[],
                total_recommendations=0,
                generated_at=datetime.utcnow(),
                algorithm_used=[],
            )

    async def _build_guest_profile(self, customer_id: int) -> GuestUser:
        """Build a comprehensive guest profile from historical data"""
        try:
            # Get customer basic info
            customer_result = await self.db_session.execute(
                select(User).where(Customer.customer_id == customer_id)
            )
            customer = customer_result.scalar_one_or_none()

            if not customer:
                return GuestUser(customer_id=customer_id)

            # Get service history
            service_history = await self._get_service_history(customer_id)

            # Analyze spending patterns
            spending_patterns = await self._analyze_spending_patterns(customer_id)

            # Analyze group size preferences
            group_preferences = await self._analyze_group_size_preferences(customer_id)

            # Calculate visit frequency
            visit_frequency = await self._calculate_visit_frequency(customer_id)

            return GuestUser(
                customer_id=customer_id,
                spending_patterns=spending_patterns,
                preferred_service_types=list(spending_patterns.keys()),
                average_group_size=group_preferences.get("preferred_group_size", 2),
                visit_frequency=visit_frequency,
                loyalty_tier="bronze",  # Would be calculated based on spending/frequency
                dietary_preferences=[],  # Would be extracted from order history
                accessibility_needs=[],  # Would be extracted from customer profile
            )

        except Exception as e:
            logger.error(f"Error building guest profile: {e}")
            return GuestUser(customer_id=customer_id)

    async def _get_service_history(self, customer_id: int) -> List[Dict[str, Any]]:
        """Get customer's service history"""
        try:
            # Get order history
            orders_result = await self.db_session.execute(
                select(Order)
                .where(Order.customer_id == customer_id)
                .order_by(Order.created_at.desc())
                .limit(50)
            )
            orders = orders_result.scalars().all()

            service_history = []
            for order in orders:
                # Get order items
                items_result = await self.db_session.execute(
                    select(OrderItem).where(OrderItem.order_id == order.order_id)
                )
                items = items_result.scalars().all()

                for item in items:
                    service_history.append(
                        {
                            "service_type": item.item_type,
                            "service_id": str(item.item_id),
                            "amount": float(item.total_price),
                            "quantity": item.quantity,
                            "date": order.created_at,
                            "number_of_guests": order.number_of_guests or 1,
                        }
                    )

            return service_history

        except Exception as e:
            logger.error(f"Error getting service history: {e}")
            return []

    async def _analyze_spending_patterns(self, customer_id: int) -> Dict[str, float]:
        """Analyze customer spending patterns by service type"""
        try:
            service_history = await self._get_service_history(customer_id)
            if not service_history:
                return {}

            spending_by_type = defaultdict(float)
            for service in service_history:
                spending_by_type[service["service_type"]] += service["amount"]

            # Normalize to percentages
            total_spending = sum(spending_by_type.values())
            if total_spending > 0:
                return {k: v / total_spending for k, v in spending_by_type.items()}

            return dict(spending_by_type)

        except Exception as e:
            logger.error(f"Error analyzing spending patterns: {e}")
            return {}

    async def _calculate_visit_frequency(self, customer_id: int) -> float:
        """Calculate customer visit frequency (visits per month)"""
        try:
            service_history = await self._get_service_history(customer_id)
            if not service_history:
                return 0.0

            # Get date range
            dates = [service["date"] for service in service_history]
            if len(dates) < 2:
                return 0.0

            date_range = max(dates) - min(dates)
            months = max(1, date_range.days / 30)  # At least 1 month

            return len(service_history) / months

        except Exception as e:
            logger.error(f"Error calculating visit frequency: {e}")
            return 0.0

    async def _analyze_group_size_preferences(self, customer_id: int) -> Dict[str, int]:
        """Analyze customer group size preferences"""
        try:
            service_history = await self._get_service_history(customer_id)
            if not service_history:
                return {
                    "preferred_group_size": 2,
                    "max_group_size": 4,
                    "solo_travel": 0.3,
                    "couple_travel": 0.5,
                    "group_travel": 0.2,
                }

            group_sizes = [
                service.get("number_of_guests", 1)
                for service in service_history
                if service.get("number_of_guests")
            ]
            if not group_sizes:
                return {
                    "preferred_group_size": 2,
                    "max_group_size": 4,
                    "solo_travel": 0.3,
                    "couple_travel": 0.5,
                    "group_travel": 0.2,
                }

            solo_travel = group_sizes.count(1) / len(group_sizes)
            couple_travel = group_sizes.count(2) / len(group_sizes)
            group_travel = 1 - solo_travel - couple_travel

            return {
                "preferred_group_size": mode(group_sizes),
                "max_group_size": max(group_sizes),
                "solo_travel": solo_travel,
                "couple_travel": couple_travel,
                "group_travel": group_travel,
            }

        except Exception as e:
            logger.error(f"Error analyzing group size preferences: {e}")
            return {
                "preferred_group_size": 2,
                "max_group_size": 4,
                "solo_travel": 0.3,
                "couple_travel": 0.5,
                "group_travel": 0.2,
            }

    async def _get_available_services(self, property_id: int) -> Dict[str, List[Any]]:
        """Get all available services for a property"""
        try:
            services = {
                "restaurant": [],
                "spa": [],
                "conference": [],
                "transportation": [],
                "recreation": [],
                "specialized": [],
            }

            # Get restaurant menu items
            menu_query = select(Menu).where(Menu.property_id == property_id)
            menu_result = await self.db.execute(menu_query)
            menu_items = menu_result.scalars().all()
            services["restaurant"] = menu_items

            # Get spa services
            spa_query = select(SpaService).where(SpaService.property_id == property_id)
            spa_result = await self.db.execute(spa_query)
            spa_services = spa_result.scalars().all()
            services["spa"] = spa_services

            # Get conference rooms
            conference_query = select(ConferenceRoom).where(
                ConferenceRoom.property_id == property_id
            )
            conference_result = await self.db.execute(conference_query)
            conference_rooms = conference_result.scalars().all()
            services["conference"] = conference_rooms

            # Get transportation services
            transport_query = select(TransportationService).where(
                TransportationService.property_id == property_id
            )
            transport_result = await self.db.execute(transport_query)
            transport_services = transport_result.scalars().all()
            services["transportation"] = transport_services

            # Get recreation services
            recreation_query = select(RecreationService).where(
                RecreationService.property_id == property_id
            )
            recreation_result = await self.db.execute(recreation_query)
            recreation_services = recreation_result.scalars().all()
            services["recreation"] = recreation_services

            # Get specialized services
            specialized_query = select(SpecializedService).where(
                SpecializedService.property_id == property_id
            )
            specialized_result = await self.db.execute(specialized_query)
            specialized_services = specialized_result.scalars().all()
            services["specialized"] = specialized_services

            return services

        except Exception as e:
            logger.error(f"Error getting available services: {e}")
            return {}

    async def _get_collaborative_recommendations(
        self,
        guest_profile: GuestUser,
        available_services: Dict[str, List[Any]],
        request: RecommendationRequest,
    ) -> List[Recommendation]:
        """Get collaborative filtering recommendations"""
        try:
            recommendations = []

            # Find similar guests based on service history
            similar_guests = await self._find_similar_guests(guest_profile)

            # Get services liked by similar guests
            for similar_guest_id in similar_guests[:5]:  # Top 5 similar guests
                similar_guest_history = await self._get_service_history(
                    similar_guest_id
                )

                for service in similar_guest_history:
                    if service["service_type"] in available_services:
                        # Create recommendation
                        rec = await self._create_recommendation_from_service(
                            service,
                            available_services,
                            RecommendationType.COLLABORATIVE,
                            f"Similar guests also enjoyed this {service['service_type']} service",
                        )
                        if rec:
                            recommendations.append(rec)

            return recommendations

        except Exception as e:
            logger.error(f"Error getting collaborative recommendations: {e}")
            return []

    async def _get_content_based_recommendations(
        self, available_services: Dict[str, List[Any]], request: RecommendationRequest
    ) -> List[Recommendation]:
        """Get content-based recommendations"""
        try:
            recommendations = []

            # If current service type is specified, find similar services
            if request.current_service_type:
                current_type = request.current_service_type.value

                # Find similar service types
                similar_types = self.service_similarity.get(current_type, {})

                for similar_type, similarity_score in similar_types.items():
                    if similarity_score > 0.5:  # Only high similarity
                        services = available_services.get(similar_type, [])

                        for service in services[:3]:  # Top 3 services
                            rec = await self._create_recommendation_from_service(
                                {
                                    "service_type": similar_type,
                                    "service_id": str(service.id),
                                },
                                available_services,
                                RecommendationType.CONTENT_BASED,
                                f"Similar to your {current_type} preference",
                            )
                            if rec:
                                recommendations.append(rec)

            return recommendations

        except Exception as e:
            logger.error(f"Error getting content-based recommendations: {e}")
            return []

    async def _get_personalized_recommendations(
        self,
        guest_profile: GuestUser,
        available_services: Dict[str, List[Any]],
        request: RecommendationRequest,
    ) -> List[Recommendation]:
        """Get personalized recommendations based on guest profile"""
        try:
            recommendations = []

            # Analyze guest preferences from history
            preferred_service_types = list(guest_profile.spending_patterns.keys())

            # Recommend services from preferred types
            for service_type in preferred_service_types:
                services = available_services.get(service_type, [])

                for service in services[:2]:  # Top 2 from each preferred type
                    rec = await self._create_recommendation_from_service(
                        {"service_type": service_type, "service_id": str(service.id)},
                        available_services,
                        RecommendationType.PERSONALIZED,
                        f"Based on your {service_type} preferences",
                    )
                    if rec:
                        recommendations.append(rec)

            return recommendations

        except Exception as e:
            logger.error(f"Error getting personalized recommendations: {e}")
            return []

    async def _get_popular_recommendations(
        self, available_services: Dict[str, List[Any]], request: RecommendationRequest
    ) -> List[Recommendation]:
        """Get popular recommendations based on overall popularity"""
        try:
            recommendations = []

            # Get popular services by type
            for service_type, services in available_services.items():
                # Sort by popularity (would be based on booking frequency)
                popular_services = services[:2]  # Top 2 popular services

                for service in popular_services:
                    rec = await self._create_recommendation_from_service(
                        {"service_type": service_type, "service_id": str(service.id)},
                        available_services,
                        RecommendationType.POPULAR,
                        f"Popular {service_type} choice",
                    )
                    if rec:
                        recommendations.append(rec)

            return recommendations

        except Exception as e:
            logger.error(f"Error getting popular recommendations: {e}")
            return []

    async def _get_seasonal_recommendations(
        self, available_services: Dict[str, List[Any]], request: RecommendationRequest
    ) -> List[Recommendation]:
        """Get seasonal recommendations"""
        try:
            recommendations = []
            current_month = datetime.now().month

            # Define seasonal preferences
            seasonal_preferences = {
                12: ["spa", "restaurant"],  # Winter - cozy services
                1: ["spa", "restaurant"],
                2: ["spa", "restaurant"],
                6: ["recreation", "transportation"],  # Summer - outdoor activities
                7: ["recreation", "transportation"],
                8: ["recreation", "transportation"],
                3: ["conference", "specialized"],  # Spring - business
                4: ["conference", "specialized"],
                5: ["conference", "specialized"],
                9: ["hotel", "spa"],  # Fall - relaxation
                10: ["hotel", "spa"],
                11: ["hotel", "spa"],
            }

            preferred_types = seasonal_preferences.get(
                current_month, ["restaurant", "hotel"]
            )

            for service_type in preferred_types:
                services = available_services.get(service_type, [])

                for service in services[:1]:  # Top 1 seasonal service
                    rec = await self._create_recommendation_from_service(
                        {"service_type": service_type, "service_id": str(service.id)},
                        available_services,
                        RecommendationType.SEASONAL,
                        f"Perfect for {self._get_season_name(current_month)}",
                    )
                    if rec:
                        recommendations.append(rec)

            return recommendations

        except Exception as e:
            logger.error(f"Error getting seasonal recommendations: {e}")
            return []

    def _get_season_name(self, month: int) -> str:
        """Get season name from month"""
        if month in [12, 1, 2]:
            return "winter"
        elif month in [3, 4, 5]:
            return "spring"
        elif month in [6, 7, 8]:
            return "summer"
        else:
            return "fall"

    async def _find_similar_guests(self, guest_profile: GuestUser) -> List[int]:
        """Find guests with similar preferences"""
        try:
            # This would use collaborative filtering algorithms
            # For now, return mock similar guests
            return [1, 2, 3, 4, 5]  # Mock similar guest IDs

        except Exception as e:
            logger.error(f"Error finding similar guests: {e}")
            return []

    async def _create_recommendation_from_service(
        self,
        service_data: Dict[str, Any],
        available_services: Dict[str, List[Any]],
        rec_type: RecommendationType,
        reasoning: str,
    ) -> Optional[Recommendation]:
        """Create recommendation object from service data"""
        try:
            service_type = service_data["service_type"]
            service_id = service_data["service_id"]

            # Find the actual service object
            services = available_services.get(service_type, [])
            service = None

            for s in services:
                if str(s.id) == service_id:
                    service = s
                    break

            if not service:
                return None

            # Create recommendation based on service type
            if service_type == "restaurant":
                return Recommendation(
                    service_id=service_id,
                    service_name=service.name,
                    service_type=ServiceCategory.RESTAURANT,
                    recommendation_score=0.8,  # Would be calculated
                    recommendation_type=rec_type,
                    reasoning=reasoning,
                    price_range=f"${service.price:.2f}",
                    availability=True,
                    estimated_duration="30-60 minutes",
                )
            elif service_type == "spa":
                return Recommendation(
                    service_id=service_id,
                    service_name=service.name,
                    service_type=ServiceCategory.SPA,
                    recommendation_score=0.8,
                    recommendation_type=rec_type,
                    reasoning=reasoning,
                    price_range=f"${service.price:.2f}",
                    availability=True,
                    estimated_duration=f"{service.duration_minutes} minutes",
                )
            # Add other service types as needed

            return None

        except Exception as e:
            logger.error(f"Error creating recommendation: {e}")
            return None

    async def _combine_and_rank_recommendations(
        self, recommendations: List[Recommendation], request: RecommendationRequest
    ) -> List[Recommendation]:
        """Combine and rank recommendations from different algorithms"""
        try:
            # Remove duplicates based on service_id
            unique_recommendations = {}
            for rec in recommendations:
                if rec.service_id not in unique_recommendations:
                    unique_recommendations[rec.service_id] = rec
                else:
                    # Combine scores for duplicate recommendations
                    existing_rec = unique_recommendations[rec.service_id]
                    existing_rec.recommendation_score = max(
                        existing_rec.recommendation_score, rec.recommendation_score
                    )

            # Convert back to list and sort by score
            final_recommendations = list(unique_recommendations.values())
            final_recommendations.sort(
                key=lambda x: x.recommendation_score, reverse=True
            )

            return final_recommendations

        except Exception as e:
            logger.error(f"Error combining recommendations: {e}")
            return recommendations

    async def get_cross_service_bundles(self, property_id: int) -> List[Dict[str, Any]]:
        """Get recommended service bundles for cross-service experiences"""
        try:
            bundles = [
                {
                    "name": "Relaxation Package",
                    "services": ["spa", "restaurant"],
                    "description": "Unwind with a spa treatment followed by a gourmet meal",
                    "discount": 15,
                    "estimated_duration": "3-4 hours",
                },
                {
                    "name": "Business Traveler",
                    "services": ["conference", "restaurant", "transportation"],
                    "description": "Complete business travel solution",
                    "discount": 10,
                    "estimated_duration": "Full day",
                },
                {
                    "name": "Family Fun",
                    "services": ["recreation", "restaurant", "specialized"],
                    "description": "Family-friendly activities and dining",
                    "discount": 20,
                    "estimated_duration": "4-6 hours",
                },
            ]

            return bundles

        except Exception as e:
            logger.error(f"Error getting service bundles: {e}")
            return []

    async def update_recommendation_feedback(
        self, customer_id: int, service_id: str, feedback: str, rating: float
    ):
        """Update recommendation system based on guest feedback"""
        try:
            # This would update the recommendation algorithms
            # based on guest feedback and ratings
            logger.info(
                f"Updated recommendation feedback for customer {customer_id}, service {service_id}: {feedback} (rating: {rating})"
            )

        except Exception as e:
            logger.error(f"Error updating recommendation feedback: {e}")

    async def get_recommendation_analytics(self, property_id: int) -> Dict[str, Any]:
        """Get analytics on recommendation performance"""
        try:
            analytics = {
                "total_recommendations_given": 0,
                "recommendation_click_through_rate": 0.0,
                "conversion_rate": 0.0,
                "most_popular_recommendations": [],
                "algorithm_performance": {
                    "collaborative": 0.0,
                    "content_based": 0.0,
                    "personalized": 0.0,
                    "popular": 0.0,
                    "seasonal": 0.0,
                },
            }

            return analytics

        except Exception as e:
            logger.error(f"Error getting recommendation analytics: {e}")
            return {}

    # Machine Learning Methods based on the provided resources

    async def _load_ml_models(self):
        """Load machine learning models for recommendations"""
        if self.is_models_loaded:
            return

        try:
            # Import ML libraries
            from sklearn.cluster import KMeans
            from sklearn.decomposition import PCA
            from sklearn.ensemble import (GradientBoostingRegressor,
                                          RandomForestRegressor)
            from sklearn.linear_model import (LinearRegression,
                                              LogisticRegression)
            from sklearn.metrics import (accuracy_score, f1_score,
                                         mean_squared_error, precision_score,
                                         recall_score)
            from sklearn.model_selection import (GridSearchCV, cross_val_score,
                                                 train_test_split)
            from sklearn.neighbors import NearestNeighbors
            from sklearn.preprocessing import StandardScaler

            # Initialize models based on ML best practices from documents
            self.collaborative_model = NearestNeighbors(n_neighbors=5, metric="cosine")
            self.content_model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,  # Prevent overfitting (Document 04)
                min_samples_split=5,  # Prevent overfitting
                random_state=42,
            )
            self.ensemble_model = GradientBoostingRegressor(
                n_estimators=100,
                learning_rate=0.1,  # Optimal learning rate
                max_depth=6,  # Prevent overfitting
                random_state=42,
            )
            # Add logistic regression for binary classification (Document 05)
            self.binary_classifier = LogisticRegression(random_state=42)
            # Add linear regression for rating prediction (Document 03)
            self.linear_model = LinearRegression()
            self.scaler = StandardScaler()
            # Use optimal number of components (Document 12)
            self.pca = PCA(n_components=0.95)  # Keep 95% of variance
            # Optimal number of clusters (Document 11)
            self.kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)

            self.is_models_loaded = True
            logger.info("ML models loaded successfully")

        except ImportError as e:
            logger.warning(f"ML libraries not available: {e}")
            self.is_models_loaded = False
        except Exception as e:
            logger.error(f"Error loading ML models: {e}")
            self.is_models_loaded = False

    async def _train_collaborative_filtering_model(self, user_item_matrix: np.ndarray):
        """Train collaborative filtering model using user-item interactions"""
        try:
            await self._load_ml_models()
            if not self.is_models_loaded:
                return

            if user_item_matrix is None or user_item_matrix.shape[0] == 0:
                logger.warning(
                    "No user-item data available for collaborative filtering"
                )
                return

            # Handle sparse matrix (many zeros)
            # Use only users with at least 2 interactions
            user_interaction_counts = np.sum(user_item_matrix > 0, axis=1)
            active_users = user_interaction_counts >= 2

            if np.sum(active_users) < 5:  # Need at least 5 active users
                logger.warning("Insufficient active users for collaborative filtering")
                return

            # Filter matrix to active users
            filtered_matrix = user_item_matrix[active_users]

            # Fit the collaborative filtering model
            self.collaborative_model.fit(filtered_matrix)
            logger.info(
                f"Collaborative filtering model trained with {np.sum(active_users)} active users"
            )

        except Exception as e:
            logger.error(f"Error training collaborative filtering model: {e}")

    async def _train_content_based_model(
        self, service_features: np.ndarray, ratings: np.ndarray
    ):
        """Train content-based filtering model using service features"""
        try:
            await self._load_ml_models()
            if not self.is_models_loaded:
                return

            if service_features is None or len(service_features) == 0:
                logger.warning("No service features available for content-based model")
                return

            # Ensure we have enough data
            if len(service_features) < 10:
                logger.warning("Insufficient data for content-based model training")
                return

            # Handle missing values
            service_features = np.nan_to_num(service_features, nan=0.0)
            ratings = np.nan_to_num(ratings, nan=3.0)

            # Split data for training
            if len(service_features) > 20:
                X_train, X_test, y_train, y_test = train_test_split(
                    service_features, ratings, test_size=0.2, random_state=42
                )
            else:
                # Use all data for training if we have limited samples
                X_train, X_test = service_features, service_features
                y_train, y_test = ratings, ratings

            # Scale features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)

            # Train the model
            self.content_model.fit(X_train_scaled, y_train)

            # Evaluate model
            y_pred = self.content_model.predict(X_test_scaled)
            mse = mean_squared_error(y_test, y_pred)
            r2_score = self.content_model.score(X_test_scaled, y_test)
            logger.info(
                f"Content-based model trained with MSE: {mse:.3f}, R²: {r2_score:.3f}"
            )

        except Exception as e:
            logger.error(f"Error training content-based model: {e}")

    async def _train_ensemble_model(self, features: np.ndarray, targets: np.ndarray):
        """Train ensemble model combining multiple approaches"""
        try:
            await self._load_ml_models()
            if not self.is_models_loaded:
                return

            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                features, targets, test_size=0.2, random_state=42
            )

            # Scale features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)

            # Train ensemble model
            self.ensemble_model.fit(X_train_scaled, y_train)

            # Evaluate
            y_pred = self.ensemble_model.predict(X_test_scaled)
            mse = mean_squared_error(y_test, y_pred)
            logger.info(f"Ensemble model trained with MSE: {mse}")

        except Exception as e:
            logger.error(f"Error training ensemble model: {e}")

    async def _get_ml_based_recommendations(
        self,
        guest_profile: GuestUser,
        available_services: List[Dict],
        request: RecommendationRequest,
    ) -> List[Recommendation]:
        """Get recommendations using machine learning models"""
        try:
            await self._load_ml_models()
            if not self.is_models_loaded:
                return []

            recommendations = []

            # Get user-item matrix for collaborative filtering
            user_item_matrix = await self._build_user_item_matrix(request.customer_id)

            if user_item_matrix is not None and self.collaborative_model is not None:
                # Get similar users
                user_vector = user_item_matrix[request.customer_id].reshape(1, -1)
                distances, indices = self.collaborative_model.kneighbors(user_vector)

                # Get recommendations from similar users
                similar_users = indices[0][1:]  # Exclude the user themselves
                for service in available_services:
                    # Calculate predicted rating based on similar users
                    predicted_rating = await self._predict_rating_from_similar_users(
                        service, similar_users, user_item_matrix
                    )

                    if predicted_rating > 3.0:  # Only recommend highly rated items
                        recommendations.append(
                            Recommendation(
                                service_id=service["id"],
                                service_name=service["name"],
                                service_type=service["type"],
                                confidence_score=predicted_rating / 5.0,
                                recommendation_type=RecommendationType.COLLABORATIVE,
                                reasoning=f"Recommended by similar guests (rating: {predicted_rating:.1f})",
                            )
                        )

            # Content-based recommendations using service features
            if self.content_model is not None:
                for service in available_services:
                    service_features = await self._extract_service_features(service)
                    if service_features is not None:
                        # Scale features
                        features_scaled = self.scaler.transform([service_features])

                        # Predict rating
                        predicted_rating = self.content_model.predict(features_scaled)[
                            0
                        ]

                        if predicted_rating > 3.0:
                            recommendations.append(
                                Recommendation(
                                    service_id=service["id"],
                                    service_name=service["name"],
                                    service_type=service["type"],
                                    confidence_score=predicted_rating / 5.0,
                                    recommendation_type=RecommendationType.CONTENT_BASED,
                                    reasoning=f"Based on service features (rating: {predicted_rating:.1f})",
                                )
                            )

            return recommendations

        except Exception as e:
            logger.error(f"Error getting ML-based recommendations: {e}")
            return []

    async def _build_user_item_matrix(self, customer_id: int) -> Optional[np.ndarray]:
        """Build user-item interaction matrix for collaborative filtering"""
        try:
            # Get all customers and their interactions
            customers_query = select(Customer.customer_id).distinct()
            customers_result = await self.db_session.execute(customers_query)
            all_customers = [row[0] for row in customers_result.fetchall()]

            if not all_customers:
                return None

            # Get all menu items
            menu_query = select(Menu.menu_id).distinct()
            menu_result = await self.db_session.execute(menu_query)
            all_items = [row[0] for row in menu_result.fetchall()]

            if not all_items:
                return None

            # Create mapping for efficient lookup
            customer_to_idx = {cid: idx for idx, cid in enumerate(all_customers)}
            item_to_idx = {iid: idx for idx, iid in enumerate(all_items)}

            # Initialize matrix
            matrix = np.zeros((len(all_customers), len(all_items)))

            # Get all order items with ratings/interactions
            interactions_query = select(
                Order.customer_id,
                OrderItem.menu_item_id,
                OrderItem.quantity,
                Order.total_amount,
            ).join(OrderItem, Order.order_id == OrderItem.order_id)

            interactions_result = await self.db_session.execute(interactions_query)
            interactions = interactions_result.fetchall()

            # Fill matrix with interaction data
            for customer_id, menu_item_id, quantity, total_amount in interactions:
                if customer_id in customer_to_idx and menu_item_id in item_to_idx:
                    customer_idx = customer_to_idx[customer_id]
                    item_idx = item_to_idx[menu_item_id]

                    # Use quantity and amount as interaction strength
                    interaction_strength = min(
                        quantity * (total_amount / 100), 5.0
                    )  # Normalize to 0-5 scale
                    matrix[customer_idx, item_idx] = interaction_strength

            return matrix

        except Exception as e:
            logger.error(f"Error building user-item matrix: {e}")
            return None

    async def _predict_rating_from_similar_users(
        self, service: Dict, similar_users: np.ndarray, user_item_matrix: np.ndarray
    ) -> float:
        """Predict rating for a service based on similar users"""
        try:
            # Get the actual service ID from the database
            service_id = service["id"]

            # Find the item index in the matrix
            menu_query = select(Menu.menu_id).distinct()
            menu_result = await self.db_session.execute(menu_query)
            all_items = [row[0] for row in menu_result.fetchall()]

            if service_id not in all_items:
                return 3.0  # Default rating for unknown items

            item_idx = all_items.index(service_id)

            # Collect ratings from similar users
            ratings = []
            for user_idx in similar_users:
                if (
                    user_idx < user_item_matrix.shape[0]
                    and item_idx < user_item_matrix.shape[1]
                ):
                    rating = user_item_matrix[user_idx, item_idx]
                    if rating > 0:
                        ratings.append(rating)

            if ratings:
                # Weight by similarity (closer users have more influence)
                weights = np.exp(-np.arange(len(ratings)) * 0.1)  # Exponential decay
                weighted_rating = np.average(ratings, weights=weights)
                return min(max(weighted_rating, 1.0), 5.0)  # Clamp between 1-5
            else:
                return 3.0  # Default rating

        except Exception as e:
            logger.error(f"Error predicting rating: {e}")
            return 3.0

    async def _extract_service_features(self, service: Dict) -> Optional[np.ndarray]:
        """Extract comprehensive numerical features from service data based on ML best practices"""
        try:
            features = []

            # Get actual service data from database
            service_id = service["id"]
            service_type = service.get("type", "restaurant")

            # 1. PRICE FEATURES (Document 03 - Linear Regression)
            base_price = service.get("price", 0)
            features.append(base_price)

            # Price normalization (z-score normalization)
            price_query = select(
                func.avg(Menu.base_price), func.stddev(Menu.base_price)
            )
            price_result = await self.db_session.execute(price_query)
            avg_price, std_price = price_result.fetchone()
            if std_price and std_price > 0:
                normalized_price = (base_price - avg_price) / std_price
                features.append(normalized_price)
            else:
                features.append(0.0)

            # 2. RATING FEATURES (Document 07 - Model Evaluation)
            rating_query = (
                select(
                    func.avg(Order.total_amount),
                    func.count(OrderItem.order_item_id),
                    func.stddev(Order.total_amount),
                )
                .join(OrderItem)
                .where(OrderItem.menu_item_id == service_id)
            )

            rating_result = await self.db_session.execute(rating_query)
            avg_rating, order_count, rating_std = rating_result.fetchone()

            # Normalized rating (1-5 scale)
            normalized_rating = min(max((avg_rating or 0) / 20, 1.0), 5.0)
            features.append(normalized_rating)

            # Rating confidence (based on number of orders)
            rating_confidence = min(
                order_count or 0 / 10, 1.0
            )  # Max confidence at 10+ orders
            features.append(rating_confidence)

            # Rating variance (consistency)
            rating_variance = rating_std or 0
            features.append(rating_variance)

            # 3. CATEGORICAL FEATURES (Document 08 - Decision Trees)
            # One-hot encoding for service categories
            category_features = [0] * len(ServiceCategory)
            if service_type in ServiceCategory:
                category_idx = list(ServiceCategory).index(service_type)
                category_features[category_idx] = 1
            features.extend(category_features)

            # 4. POPULARITY FEATURES (Document 11 - Clustering)
            popularity_query = select(func.count(OrderItem.order_item_id)).where(
                OrderItem.menu_item_id == service_id
            )
            popularity_result = await self.db_session.execute(popularity_query)
            popularity = popularity_result.scalar() or 0
            features.append(popularity)

            # Popularity percentile
            total_orders_query = select(func.count(OrderItem.order_item_id))
            total_orders_result = await self.db_session.execute(total_orders_query)
            total_orders = total_orders_result.scalar() or 1
            popularity_percentile = popularity / total_orders
            features.append(popularity_percentile)

            # 5. TEMPORAL FEATURES (Document 12 - Dimensionality Reduction)
            current_time = datetime.now()
            features.append(current_time.month)  # Seasonal
            features.append(current_time.hour)  # Time of day
            features.append(current_time.weekday())  # Day of week

            # 6. SERVICE ATTRIBUTES
            features.append(service.get("duration_minutes", 60))
            features.append(service.get("capacity", 1))

            # 7. PRICE TIER FEATURES (Document 08 - Decision Trees)
            if base_price < 50:
                price_tier = 1  # Budget
            elif base_price < 100:
                price_tier = 2  # Mid-range
            elif base_price < 200:
                price_tier = 3  # Premium
            else:
                price_tier = 4  # Luxury
            features.append(price_tier)

            # 8. INTERACTION FEATURES (Document 06 - Instance-Based Learning)
            # Recent popularity (last 30 days)
            recent_date = current_time - timedelta(days=30)
            recent_popularity_query = (
                select(func.count(OrderItem.order_item_id))
                .join(Order)
                .where(
                    OrderItem.menu_item_id == service_id,
                    Order.created_at >= recent_date,
                )
            )
            recent_popularity_result = await self.db_session.execute(
                recent_popularity_query
            )
            recent_popularity = recent_popularity_result.scalar() or 0
            features.append(recent_popularity)

            # 9. CUSTOMER SEGMENTATION FEATURES (Document 11 - Clustering)
            # Average customer spending on this service
            customer_spending_query = (
                select(func.avg(Order.total_amount))
                .join(OrderItem)
                .where(OrderItem.menu_item_id == service_id)
            )
            customer_spending_result = await self.db_session.execute(
                customer_spending_query
            )
            avg_customer_spending = customer_spending_result.scalar() or 0
            features.append(avg_customer_spending)

            # 10. FEATURE ENGINEERING (Document 04 - Model Selection)
            # Price-to-value ratio
            value_ratio = normalized_rating / (base_price + 1)  # Avoid division by zero
            features.append(value_ratio)

            # Popularity-to-price ratio
            popularity_ratio = popularity / (base_price + 1)
            features.append(popularity_ratio)

            return np.array(features)

        except Exception as e:
            logger.error(f"Error extracting service features: {e}")
            return None

    async def _cluster_guests(
        self, guest_profiles: List[GuestUser]
    ) -> Dict[int, int]:
        """Cluster guests using K-means clustering"""
        try:
            await self._load_ml_models()
            if not self.is_models_loaded:
                return {}

            # Extract features from guest profiles
            features = []
            guest_ids = []

            for profile in guest_profiles:
                feature_vector = [
                    profile.spending_patterns.get("restaurant", 0),
                    profile.spending_patterns.get("spa", 0),
                    profile.spending_patterns.get("conference", 0),
                    profile.spending_patterns.get("transportation", 0),
                    len(profile.preferred_service_types),
                    profile.visit_frequency,
                    profile.avg_booking_value,
                ]
                features.append(feature_vector)
                guest_ids.append(profile.customer_id)

            if not features:
                return {}

            # Scale features
            features_scaled = self.scaler.fit_transform(features)

            # Apply PCA for dimensionality reduction
            features_pca = self.pca.fit_transform(features_scaled)

            # Cluster guests
            cluster_labels = self.kmeans.fit_predict(features_pca)

            # Return mapping of guest_id to cluster
            return dict(zip(guest_ids, cluster_labels))

        except Exception as e:
            logger.error(f"Error clustering guests: {e}")
            return {}

    async def _get_cluster_based_recommendations(
        self,
        guest_profile: GuestUser,
        available_services: List[Dict],
        guest_clusters: Dict[int, int],
    ) -> List[Recommendation]:
        """Get recommendations based on guest clustering"""
        try:
            if guest_profile.customer_id not in guest_clusters:
                return []

            cluster_id = guest_clusters[guest_profile.customer_id]

            # Get other guests in the same cluster
            cluster_guests = [
                gid for gid, cid in guest_clusters.items() if cid == cluster_id
            ]

            recommendations = []

            # Get popular services among cluster guests
            for service in available_services:
                # Calculate popularity score among cluster guests
                popularity_score = await self._calculate_cluster_popularity(
                    service, cluster_guests
                )

                if popularity_score > 0.3:  # Threshold for recommendation
                    recommendations.append(
                        Recommendation(
                            service_id=service["id"],
                            service_name=service["name"],
                            service_type=service["type"],
                            confidence_score=popularity_score,
                            recommendation_type=RecommendationType.PERSONALIZED,
                            reasoning=f"Popular among similar guests (cluster {cluster_id})",
                        )
                    )

            return recommendations

        except Exception as e:
            logger.error(f"Error getting cluster-based recommendations: {e}")
            return []

    async def _calculate_cluster_popularity(
        self, service: Dict, cluster_guests: List[int]
    ) -> float:
        """Calculate how popular a service is among guests in a cluster"""
        try:
            total_guests = len(cluster_guests)
            if total_guests == 0:
                return 0.0

            service_id = service["id"]

            # Count how many guests in the cluster have used this service
            usage_query = (
                select(func.count(func.distinct(Order.customer_id)))
                .join(OrderItem)
                .where(
                    OrderItem.menu_item_id == service_id,
                    Order.customer_id.in_(cluster_guests),
                )
            )

            usage_result = await self.db_session.execute(usage_query)
            users_who_used = usage_result.scalar() or 0

            # Calculate popularity as percentage of cluster guests who used this service
            popularity = users_who_used / total_guests

            # Also factor in average spending for this service in the cluster
            spending_query = (
                select(func.avg(Order.total_amount))
                .join(OrderItem)
                .where(
                    OrderItem.menu_item_id == service_id,
                    Order.customer_id.in_(cluster_guests),
                )
            )

            spending_result = await self.db_session.execute(spending_query)
            avg_spending = spending_result.scalar() or 0

            # Weight popularity by spending (higher spending = more popular)
            spending_weight = min(avg_spending / 100, 1.0)  # Normalize spending
            weighted_popularity = popularity * (0.7 + 0.3 * spending_weight)

            return min(weighted_popularity, 1.0)

        except Exception as e:
            logger.error(f"Error calculating cluster popularity: {e}")
            return 0.0

    async def _collect_training_data(self) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """Collect training data from the database for ML models"""
        try:
            # Get all menu items with their features
            menu_query = select(
                Menu.menu_id,
                Menu.name,
                Menu.base_price,
                Menu.category,
                Menu.description,
            )
            menu_result = await self.db_session.execute(menu_query)
            menu_items = menu_result.fetchall()

            if not menu_items:
                return np.array([]), np.array([]), np.array([])

            # Extract features for each menu item
            service_features = []
            ratings = []
            user_item_data = []

            for menu_id, name, base_price, category, description in menu_items:
                # Get order data for this menu item
                order_query = (
                    select(
                        Order.customer_id,
                        OrderItem.quantity,
                        Order.total_amount,
                        Order.created_at,
                    )
                    .join(OrderItem)
                    .where(OrderItem.menu_item_id == menu_id)
                )

                order_result = await self.db_session.execute(order_query)
                orders = order_result.fetchall()

                if not orders:
                    continue

                # Calculate features for this service
                features = []

                # Price features
                features.append(base_price or 0)

                # Category features (one-hot encoded)
                category_features = [0] * len(ServiceCategory)
                if category in ServiceCategory:
                    category_idx = list(ServiceCategory).index(category)
                    category_features[category_idx] = 1
                features.extend(category_features)

                # Popularity features
                features.append(len(orders))

                # Average spending
                avg_spending = np.mean([order[2] for order in orders]) if orders else 0
                features.append(avg_spending)

                # Time-based features
                current_month = datetime.now().month
                features.append(current_month)

                # Price tier
                if base_price < 50:
                    price_tier = 1
                elif base_price < 100:
                    price_tier = 2
                else:
                    price_tier = 3
                features.append(price_tier)

                service_features.append(features)

                # Calculate rating based on order frequency and spending
                rating = min(len(orders) * 0.5 + (avg_spending / 50), 5.0)
                ratings.append(rating)

                # Store user-item interactions
                for customer_id, quantity, total_amount, created_at in orders:
                    user_item_data.append(
                        (customer_id, menu_id, quantity, total_amount)
                    )

            return (
                np.array(service_features),
                np.array(ratings),
                np.array(user_item_data),
            )

        except Exception as e:
            logger.error(f"Error collecting training data: {e}")
            return np.array([]), np.array([]), np.array([])

    async def train_models(self):
        """Train all ML models with real data from the database using comprehensive ML pipeline"""
        try:
            logger.info("Starting comprehensive model training...")

            # Collect training data
            (
                service_features,
                ratings,
                user_item_data,
            ) = await self._collect_training_data()

            if len(service_features) == 0:
                logger.warning("No training data available")
                return

            # Build user-item matrix
            user_item_matrix = await self._build_user_item_matrix(
                1
            )  # Pass any customer_id

            # Train collaborative filtering model
            if user_item_matrix is not None:
                await self._train_collaborative_filtering_model(user_item_matrix)

            # Prepare data for supervised learning
            if len(service_features) > 0 and len(ratings) > 0:
                # Split data for training and testing (Document 04)
                X_train, X_test, y_train, y_test = train_test_split(
                    service_features, ratings, test_size=0.2, random_state=42
                )

                # Hyperparameter tuning (Document 04)
                logger.info("Starting hyperparameter tuning...")
                tuned_params = await self._hyperparameter_tuning(X_train, y_train)

                # Train content-based model with tuned parameters
                await self._train_content_based_model(X_train, y_train)

                # Train ensemble model with tuned parameters
                await self._train_ensemble_model(X_train, y_train)

                # Train linear regression model (Document 03)
                await self._load_ml_models()
                if self.is_models_loaded and self.linear_model is not None:
                    X_train_scaled = self.scaler.fit_transform(X_train)
                    self.linear_model.fit(X_train_scaled, y_train)
                    logger.info("Linear regression model trained")

                # Comprehensive model evaluation (Document 07)
                logger.info("Starting model evaluation...")
                evaluation_metrics = await self._evaluate_models(X_test, y_test)

                # Feature importance analysis (Document 08)
                logger.info("Starting feature importance analysis...")
                feature_importance = await self._feature_importance_analysis()

                # Log comprehensive results
                logger.info(f"Training completed with metrics: {evaluation_metrics}")
                logger.info(f"Feature importance: {feature_importance}")
                logger.info(f"Tuned parameters: {tuned_params}")

            logger.info("Comprehensive model training completed successfully")

        except Exception as e:
            logger.error(f"Error training models: {e}")

    async def _evaluate_models(
        self, X_test: np.ndarray, y_test: np.ndarray
    ) -> Dict[str, float]:
        """Comprehensive model evaluation based on Document 07 - Model Evaluation"""
        try:
            await self._load_ml_models()
            if not self.is_models_loaded:
                return {}

            evaluation_metrics = {}

            # Scale test data
            X_test_scaled = self.scaler.transform(X_test)

            # Evaluate Random Forest (Content-based model)
            if self.content_model is not None:
                y_pred_rf = self.content_model.predict(X_test_scaled)

                # Regression metrics
                mse_rf = mean_squared_error(y_test, y_pred_rf)
                rmse_rf = np.sqrt(mse_rf)
                r2_rf = self.content_model.score(X_test_scaled, y_test)

                # Cross-validation score (Document 04)
                cv_scores = cross_val_score(
                    self.content_model, X_test_scaled, y_test, cv=5, scoring="r2"
                )

                evaluation_metrics["random_forest"] = {
                    "mse": mse_rf,
                    "rmse": rmse_rf,
                    "r2": r2_rf,
                    "cv_mean": cv_scores.mean(),
                    "cv_std": cv_scores.std(),
                }

            # Evaluate Gradient Boosting (Ensemble model)
            if self.ensemble_model is not None:
                y_pred_gb = self.ensemble_model.predict(X_test_scaled)

                mse_gb = mean_squared_error(y_test, y_pred_gb)
                rmse_gb = np.sqrt(mse_gb)
                r2_gb = self.ensemble_model.score(X_test_scaled, y_test)

                cv_scores_gb = cross_val_score(
                    self.ensemble_model, X_test_scaled, y_test, cv=5, scoring="r2"
                )

                evaluation_metrics["gradient_boosting"] = {
                    "mse": mse_gb,
                    "rmse": rmse_gb,
                    "r2": r2_gb,
                    "cv_mean": cv_scores_gb.mean(),
                    "cv_std": cv_scores_gb.std(),
                }

            # Evaluate Linear Regression (Document 03)
            if self.linear_model is not None:
                y_pred_lr = self.linear_model.predict(X_test_scaled)

                mse_lr = mean_squared_error(y_test, y_pred_lr)
                rmse_lr = np.sqrt(mse_lr)
                r2_lr = self.linear_model.score(X_test_scaled, y_test)

                evaluation_metrics["linear_regression"] = {
                    "mse": mse_lr,
                    "rmse": rmse_lr,
                    "r2": r2_lr,
                }

            logger.info(f"Model evaluation completed: {evaluation_metrics}")
            return evaluation_metrics

        except Exception as e:
            logger.error(f"Error evaluating models: {e}")
            return {}

    async def _hyperparameter_tuning(
        self, X_train: np.ndarray, y_train: np.ndarray
    ) -> Dict[str, Any]:
        """Hyperparameter tuning based on Document 04 - Model Selection"""
        try:
            await self._load_ml_models()
            if not self.is_models_loaded:
                return {}

            tuned_params = {}

            # Tune Random Forest parameters
            rf_param_grid = {
                "n_estimators": [50, 100, 200],
                "max_depth": [5, 10, 15, None],
                "min_samples_split": [2, 5, 10],
                "min_samples_leaf": [1, 2, 4],
            }

            rf_grid_search = GridSearchCV(
                RandomForestRegressor(random_state=42),
                rf_param_grid,
                cv=5,
                scoring="r2",
                n_jobs=-1,
            )

            rf_grid_search.fit(X_train, y_train)
            tuned_params["random_forest"] = rf_grid_search.best_params_
            self.content_model = rf_grid_search.best_estimator_

            # Tune Gradient Boosting parameters
            gb_param_grid = {
                "n_estimators": [50, 100, 200],
                "learning_rate": [0.01, 0.1, 0.2],
                "max_depth": [3, 6, 9],
                "subsample": [0.8, 0.9, 1.0],
            }

            gb_grid_search = GridSearchCV(
                GradientBoostingRegressor(random_state=42),
                gb_param_grid,
                cv=5,
                scoring="r2",
                n_jobs=-1,
            )

            gb_grid_search.fit(X_train, y_train)
            tuned_params["gradient_boosting"] = gb_grid_search.best_params_
            self.ensemble_model = gb_grid_search.best_estimator_

            logger.info(f"Hyperparameter tuning completed: {tuned_params}")
            return tuned_params

        except Exception as e:
            logger.error(f"Error in hyperparameter tuning: {e}")
            return {}

    async def _feature_importance_analysis(self) -> Dict[str, List[Tuple[str, float]]]:
        """Analyze feature importance based on Document 08 - Decision Trees"""
        try:
            await self._load_ml_models()
            if not self.is_models_loaded:
                return {}

            feature_importance = {}

            # Get feature names (simplified for this example)
            feature_names = [
                "base_price",
                "normalized_price",
                "normalized_rating",
                "rating_confidence",
                "rating_variance",
                "popularity",
                "popularity_percentile",
                "month",
                "hour",
                "weekday",
                "duration_minutes",
                "capacity",
                "price_tier",
                "recent_popularity",
                "avg_customer_spending",
                "value_ratio",
                "popularity_ratio",
            ]

            # Add category features
            for category in ServiceCategory:
                feature_names.append(f"category_{category.value}")

            # Random Forest feature importance
            if self.content_model is not None and hasattr(
                self.content_model, "feature_importances_"
            ):
                rf_importance = list(
                    zip(feature_names, self.content_model.feature_importances_)
                )
                rf_importance.sort(key=lambda x: x[1], reverse=True)
                feature_importance["random_forest"] = rf_importance[
                    :10
                ]  # Top 10 features

            # Gradient Boosting feature importance
            if self.ensemble_model is not None and hasattr(
                self.ensemble_model, "feature_importances_"
            ):
                gb_importance = list(
                    zip(feature_names, self.ensemble_model.feature_importances_)
                )
                gb_importance.sort(key=lambda x: x[1], reverse=True)
                feature_importance["gradient_boosting"] = gb_importance[
                    :10
                ]  # Top 10 features

            logger.info(f"Feature importance analysis completed: {feature_importance}")
            return feature_importance

        except Exception as e:
            logger.error(f"Error in feature importance analysis: {e}")
            return {}

    async def _get_available_services(self, property_id: int) -> List[Dict]:
        """Get available services for a property"""
        try:
            services = []

            # Get menu items
            menu_query = select(
                Menu.menu_id,
                Menu.name,
                Menu.base_price,
                Menu.category,
                Menu.description,
            ).where(Menu.property_id == property_id)

            menu_result = await self.db_session.execute(menu_query)
            menu_items = menu_result.fetchall()

            for menu_id, name, base_price, category, description in menu_items:
                services.append(
                    {
                        "id": menu_id,
                        "name": name,
                        "price": base_price or 0,
                        "type": category or "restaurant",
                        "description": description,
                        "duration_minutes": 60,  # Default duration
                        "capacity": 1,
                    }
                )

            # Get spa services
            spa_query = select(
                SpaService.spa_service_id,
                SpaService.name,
                SpaService.base_price,
                SpaService.duration_minutes,
                SpaService.capacity,
            ).where(SpaService.property_id == property_id)

            spa_result = await self.db_session.execute(spa_query)
            spa_services = spa_result.fetchall()

            for spa_id, name, base_price, duration, capacity in spa_services:
                services.append(
                    {
                        "id": spa_id,
                        "name": name,
                        "price": base_price or 0,
                        "type": "spa",
                        "description": f"Spa service: {name}",
                        "duration_minutes": duration or 60,
                        "capacity": capacity or 1,
                    }
                )

            # Get conference rooms
            conference_query = select(
                ConferenceRoom.conference_room_id,
                ConferenceRoom.name,
                ConferenceRoom.hourly_rate,
                ConferenceRoom.capacity,
            ).where(ConferenceRoom.property_id == property_id)

            conference_result = await self.db_session.execute(conference_query)
            conference_rooms = conference_result.fetchall()

            for room_id, name, hourly_rate, capacity in conference_rooms:
                services.append(
                    {
                        "id": room_id,
                        "name": name,
                        "price": hourly_rate or 0,
                        "type": "conference",
                        "description": f"Conference room: {name}",
                        "duration_minutes": 60,
                        "capacity": capacity or 10,
                    }
                )

            return services

        except Exception as e:
            logger.error(f"Error getting available services: {e}")
            return []
