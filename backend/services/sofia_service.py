"""
Sofia AI Service for Buffr Host
Consolidated AI service for hospitality recommendations and analytics
"""
from datetime import date, datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple
from decimal import Decimal
import json
import asyncio
import logging

from sqlalchemy import and_, or_, select, func, text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.hospitality_property import HospitalityProperty
from models.user import User

logger = logging.getLogger(__name__)

class SofiaService:
    """Consolidated Sofia AI service for hospitality recommendations and analytics."""

    def __init__(self, db: AsyncSession):
        self.db = db

    # =============================================================================
    # RECOMMENDATION ENGINE
    # =============================================================================

    async def get_recommendations(
        self, 
        property_id: int, 
        guest_id: int, 
        recommendation_type: str = 'general',
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get AI-powered recommendations for a guest."""
        try:
            # Get guest profile
            guest_profile = await self._get_guest_profile(guest_id, property_id)
            
            # Get property data
            property_data = await self._get_property_data(property_id)
            
            # Generate recommendations based on type
            if recommendation_type == 'rooms':
                recommendations = await self._get_room_recommendations(property_id, guest_id, guest_profile)
            elif recommendation_type == 'restaurants':
                recommendations = await self._get_restaurant_recommendations(property_id, guest_id, guest_profile)
            elif recommendation_type == 'services':
                recommendations = await self._get_service_recommendations(property_id, guest_id, guest_profile)
            else:
                recommendations = await self._get_general_recommendations(property_id, guest_id, guest_profile)
            
            # Rank and limit recommendations
            recommendations = self._rank_recommendations(recommendations, guest_profile)[:limit]
            
            return recommendations

        except Exception as e:
            logger.error(f"Error getting recommendations: {e}")
            return []

    async def _get_room_recommendations(
        self, 
        property_id: int, 
        guest_id: int, 
        guest_profile: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Get room recommendations based on guest preferences."""
        # Query available rooms
        query = """
        SELECT r.id, r.room_number, r.room_type, r.capacity, r.base_price, r.amenities
        FROM rooms r
        WHERE r.property_id = :property_id
        AND r.is_available = true
        ORDER BY r.base_price ASC
        """
        
        result = await self.db.execute(text(query), {"property_id": property_id})
        rooms = result.fetchall()
        
        recommendations = []
        for room in rooms:
            # Calculate recommendation score based on guest preferences
            score = self._calculate_room_score(room, guest_profile)
            
            if score > 0.5:  # Only recommend rooms with score > 0.5
                recommendations.append({
                    "id": str(room.id),
                    "type": "room",
                    "title": f"Room {room.room_number} - {room.room_type}",
                    "description": f"Capacity: {room.capacity}, Price: ${room.base_price}",
                    "score": score,
                    "reasoning": self._get_room_reasoning(room, guest_profile),
                    "data": {
                        "room_id": room.id,
                        "room_number": room.room_number,
                        "room_type": room.room_type,
                        "capacity": room.capacity,
                        "price": float(room.base_price),
                        "amenities": room.amenities
                    }
                })
        
        return recommendations

    async def _get_restaurant_recommendations(
        self, 
        property_id: int, 
        guest_id: int, 
        guest_profile: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Get restaurant recommendations based on guest preferences."""
        # Query restaurants
        query = """
        SELECT r.id, r.name, r.cuisine_type, r.price_range, r.rating, r.description
        FROM restaurants r
        WHERE r.property_id = :property_id
        AND r.is_active = true
        ORDER BY r.rating DESC
        """
        
        result = await self.db.execute(text(query), {"property_id": property_id})
        restaurants = result.fetchall()
        
        recommendations = []
        for restaurant in restaurants:
            score = self._calculate_restaurant_score(restaurant, guest_profile)
            
            if score > 0.5:
                recommendations.append({
                    "id": str(restaurant.id),
                    "type": "restaurant",
                    "title": restaurant.name,
                    "description": f"{restaurant.cuisine_type} - {restaurant.price_range}",
                    "score": score,
                    "reasoning": self._get_restaurant_reasoning(restaurant, guest_profile),
                    "data": {
                        "restaurant_id": restaurant.id,
                        "name": restaurant.name,
                        "cuisine_type": restaurant.cuisine_type,
                        "price_range": restaurant.price_range,
                        "rating": float(restaurant.rating) if restaurant.rating else 0,
                        "description": restaurant.description
                    }
                })
        
        return recommendations

    async def _get_service_recommendations(
        self, 
        property_id: int, 
        guest_id: int, 
        guest_profile: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Get service recommendations (spa, conference, etc.)."""
        # Query services
        query = """
        SELECT s.id, s.name, s.service_type, s.description, s.price, s.duration_minutes
        FROM spa_services s
        WHERE s.property_id = :property_id
        AND s.is_active = true
        ORDER BY s.price ASC
        """
        
        result = await self.db.execute(text(query), {"property_id": property_id})
        services = result.fetchall()
        
        recommendations = []
        for service in services:
            score = self._calculate_service_score(service, guest_profile)
            
            if score > 0.5:
                recommendations.append({
                    "id": str(service.id),
                    "type": "service",
                    "title": service.name,
                    "description": f"{service.service_type} - {service.duration_minutes} minutes",
                    "score": score,
                    "reasoning": self._get_service_reasoning(service, guest_profile),
                    "data": {
                        "service_id": service.id,
                        "name": service.name,
                        "service_type": service.service_type,
                        "description": service.description,
                        "price": float(service.price) if service.price else 0,
                        "duration_minutes": service.duration_minutes
                    }
                })
        
        return recommendations

    async def _get_general_recommendations(
        self, 
        property_id: int, 
        guest_id: int, 
        guest_profile: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Get general recommendations combining all types."""
        all_recommendations = []
        
        # Get recommendations from all categories
        room_recs = await self._get_room_recommendations(property_id, guest_id, guest_profile)
        restaurant_recs = await self._get_restaurant_recommendations(property_id, guest_id, guest_profile)
        service_recs = await self._get_service_recommendations(property_id, guest_id, guest_profile)
        
        all_recommendations.extend(room_recs)
        all_recommendations.extend(restaurant_recs)
        all_recommendations.extend(service_recs)
        
        return all_recommendations

    # =============================================================================
    # ANALYTICS AND INSIGHTS
    # =============================================================================

    async def get_property_analytics(
        self, 
        property_id: int, 
        days: int = 30
    ) -> Dict[str, Any]:
        """Get analytics insights for a property."""
        try:
            # Get booking analytics
            booking_analytics = await self._get_booking_analytics(property_id, days)
            
            # Get revenue analytics
            revenue_analytics = await self._get_revenue_analytics(property_id, days)
            
            # Get guest satisfaction analytics
            satisfaction_analytics = await self._get_satisfaction_analytics(property_id, days)
            
            # Get occupancy analytics
            occupancy_analytics = await self._get_occupancy_analytics(property_id, days)
            
            return {
                "property_id": property_id,
                "period_days": days,
                "booking_analytics": booking_analytics,
                "revenue_analytics": revenue_analytics,
                "satisfaction_analytics": satisfaction_analytics,
                "occupancy_analytics": occupancy_analytics,
                "generated_at": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Error getting property analytics: {e}")
            return {}

    async def _get_booking_analytics(self, property_id: int, days: int) -> Dict[str, Any]:
        """Get booking analytics."""
        query = """
        SELECT 
            COUNT(*) as total_bookings,
            AVG(amount) as avg_booking_value,
            COUNT(DISTINCT guest_id) as unique_guests,
            COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
            COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings
        FROM bookings 
        WHERE property_id = :property_id 
        AND created_at >= :start_date
        """
        
        start_date = datetime.now() - timedelta(days=days)
        result = await self.db.execute(text(query), {
            "property_id": property_id,
            "start_date": start_date
        })
        
        row = result.fetchone()
        return {
            "total_bookings": row.total_bookings or 0,
            "avg_booking_value": float(row.avg_booking_value or 0),
            "unique_guests": row.unique_guests or 0,
            "confirmed_bookings": row.confirmed_bookings or 0,
            "cancelled_bookings": row.cancelled_bookings or 0,
            "cancellation_rate": (row.cancelled_bookings or 0) / max(row.total_bookings or 1, 1)
        }

    async def _get_revenue_analytics(self, property_id: int, days: int) -> Dict[str, Any]:
        """Get revenue analytics."""
        query = """
        SELECT 
            SUM(amount) as total_revenue,
            AVG(amount) as avg_revenue_per_booking,
            COUNT(*) as total_transactions
        FROM bookings 
        WHERE property_id = :property_id 
        AND created_at >= :start_date
        AND status = 'confirmed'
        """
        
        start_date = datetime.now() - timedelta(days=days)
        result = await self.db.execute(text(query), {
            "property_id": property_id,
            "start_date": start_date
        })
        
        row = result.fetchone()
        return {
            "total_revenue": float(row.total_revenue or 0),
            "avg_revenue_per_booking": float(row.avg_revenue_per_booking or 0),
            "total_transactions": row.total_transactions or 0
        }

    async def _get_satisfaction_analytics(self, property_id: int, days: int) -> Dict[str, Any]:
        """Get guest satisfaction analytics."""
        query = """
        SELECT 
            AVG(rating) as avg_rating,
            COUNT(*) as total_reviews,
            COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_reviews
        FROM reviews 
        WHERE property_id = :property_id 
        AND created_at >= :start_date
        """
        
        start_date = datetime.now() - timedelta(days=days)
        result = await self.db.execute(text(query), {
            "property_id": property_id,
            "start_date": start_date
        })
        
        row = result.fetchone()
        return {
            "avg_rating": float(row.avg_rating or 0),
            "total_reviews": row.total_reviews or 0,
            "positive_reviews": row.positive_reviews or 0,
            "satisfaction_rate": (row.positive_reviews or 0) / max(row.total_reviews or 1, 1)
        }

    async def _get_occupancy_analytics(self, property_id: int, days: int) -> Dict[str, Any]:
        """Get occupancy analytics."""
        query = """
        SELECT 
            COUNT(DISTINCT room_id) as total_rooms,
            COUNT(DISTINCT CASE WHEN status = 'confirmed' THEN room_id END) as occupied_rooms
        FROM bookings 
        WHERE property_id = :property_id 
        AND created_at >= :start_date
        """
        
        start_date = datetime.now() - timedelta(days=days)
        result = await self.db.execute(text(query), {
            "property_id": property_id,
            "start_date": start_date
        })
        
        row = result.fetchone()
        total_rooms = row.total_rooms or 1
        occupied_rooms = row.occupied_rooms or 0
        
        return {
            "total_rooms": total_rooms,
            "occupied_rooms": occupied_rooms,
            "occupancy_rate": occupied_rooms / total_rooms
        }

    # =============================================================================
    # HELPER METHODS
    # =============================================================================

    async def _get_guest_profile(self, guest_id: int, property_id: int) -> Dict[str, Any]:
        """Get guest profile and preferences."""
        # This would query the database for guest data
        # For now, return a mock profile
        return {
            "guest_id": guest_id,
            "preferences": {
                "room_types": ["deluxe", "suite"],
                "cuisines": ["italian", "asian"],
                "services": ["spa", "conference"],
                "price_range": "mid"
            },
            "booking_history": {
                "total_bookings": 5,
                "avg_booking_value": 250.0,
                "favorite_room_type": "deluxe",
                "favorite_cuisine": "italian"
            }
        }

    async def _get_property_data(self, property_id: int) -> Dict[str, Any]:
        """Get property data and amenities."""
        # This would query the database for property data
        return {
            "property_id": property_id,
            "name": "Sample Hotel",
            "amenities": ["spa", "restaurant", "conference_room"],
            "room_types": ["standard", "deluxe", "suite"]
        }

    def _calculate_room_score(self, room: Any, guest_profile: Dict[str, Any]) -> float:
        """Calculate recommendation score for a room."""
        score = 0.5  # Base score
        
        # Price preference
        if guest_profile["preferences"]["price_range"] == "budget" and room.base_price < 200:
            score += 0.3
        elif guest_profile["preferences"]["price_range"] == "mid" and 200 <= room.base_price <= 400:
            score += 0.3
        elif guest_profile["preferences"]["price_range"] == "luxury" and room.base_price > 400:
            score += 0.3
        
        # Room type preference
        if room.room_type.lower() in [t.lower() for t in guest_profile["preferences"]["room_types"]]:
            score += 0.2
        
        return min(1.0, score)

    def _calculate_restaurant_score(self, restaurant: Any, guest_profile: Dict[str, Any]) -> float:
        """Calculate recommendation score for a restaurant."""
        score = 0.5  # Base score
        
        # Cuisine preference
        if restaurant.cuisine_type.lower() in [c.lower() for c in guest_profile["preferences"]["cuisines"]]:
            score += 0.3
        
        # Rating preference
        if restaurant.rating and restaurant.rating >= 4.0:
            score += 0.2
        
        return min(1.0, score)

    def _calculate_service_score(self, service: Any, guest_profile: Dict[str, Any]) -> float:
        """Calculate recommendation score for a service."""
        score = 0.5  # Base score
        
        # Service type preference
        if service.service_type.lower() in [s.lower() for s in guest_profile["preferences"]["services"]]:
            score += 0.3
        
        # Price preference
        if service.price and service.price < 100:
            score += 0.2
        
        return min(1.0, score)

    def _get_room_reasoning(self, room: Any, guest_profile: Dict[str, Any]) -> str:
        """Get reasoning for room recommendation."""
        reasons = []
        
        if room.room_type.lower() in [t.lower() for t in guest_profile["preferences"]["room_types"]]:
            reasons.append(f"Matches your preferred room type: {room.room_type}")
        
        if room.base_price < 200:
            reasons.append("Great value for money")
        elif room.base_price > 400:
            reasons.append("Premium luxury option")
        
        return "; ".join(reasons) if reasons else "Recommended based on availability"

    def _get_restaurant_reasoning(self, restaurant: Any, guest_profile: Dict[str, Any]) -> str:
        """Get reasoning for restaurant recommendation."""
        reasons = []
        
        if restaurant.cuisine_type.lower() in [c.lower() for c in guest_profile["preferences"]["cuisines"]]:
            reasons.append(f"Matches your cuisine preference: {restaurant.cuisine_type}")
        
        if restaurant.rating and restaurant.rating >= 4.0:
            reasons.append(f"Highly rated ({restaurant.rating}/5)")
        
        return "; ".join(reasons) if reasons else "Recommended based on popularity"

    def _get_service_reasoning(self, service: Any, guest_profile: Dict[str, Any]) -> str:
        """Get reasoning for service recommendation."""
        reasons = []
        
        if service.service_type.lower() in [s.lower() for s in guest_profile["preferences"]["services"]]:
            reasons.append(f"Matches your service preference: {service.service_type}")
        
        if service.duration_minutes and service.duration_minutes <= 60:
            reasons.append("Quick service option")
        
        return "; ".join(reasons) if reasons else "Recommended based on availability"

    def _rank_recommendations(self, recommendations: List[Dict[str, Any]], guest_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Rank recommendations by score and relevance."""
        return sorted(recommendations, key=lambda x: x["score"], reverse=True)