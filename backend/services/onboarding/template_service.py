"""
Property Template Service
Generates intelligent property templates based on industry, service level, and characteristics
"""

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from models.tenant import TenantUser
from schemas.onboarding import IndustryType, ServiceLevel, OnboardingTier
import json
import logging

logger = logging.getLogger(__name__)

class PropertyTemplateService:
    def __init__(self, db_session: Session):
        self.db = db_session
        
        # Industry-specific templates
        self.INDUSTRY_TEMPLATES = {
            IndustryType.HOTEL: self._get_hotel_template(),
            IndustryType.RESORT: self._get_resort_template(),
            IndustryType.VACATION_RENTAL: self._get_vacation_rental_template(),
            IndustryType.HOSTEL: self._get_hostel_template(),
            IndustryType.BOUTIQUE_HOTEL: self._get_boutique_hotel_template(),
            IndustryType.BED_AND_BREAKFAST: self._get_bed_breakfast_template(),
            IndustryType.APARTMENT_HOTEL: self._get_apartment_hotel_template()
        }
        
        # Service level multipliers
        self.SERVICE_LEVEL_MULTIPLIERS = {
            ServiceLevel.LUXURY: 2.5,
            ServiceLevel.PREMIUM: 1.8,
            ServiceLevel.STANDARD: 1.0,
            ServiceLevel.BUDGET: 0.6
        }
        
        # Regional price adjustments
        self.REGIONAL_MULTIPLIERS = {
            "north-america": 1.2,
            "europe": 1.1,
            "asia": 0.8,
            "africa": 0.6,
            "south-america": 0.7,
            "oceania": 1.3
        }
    
    async def generate_property_template(self, tenant_id: str, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate customized property template based on tenant data"""
        
        try:
            # Get tenant profile
            tenant = await self.db.query(TenantUser).filter(
                TenantUser.id == tenant_id
            ).first()
            
            if not tenant:
                raise ValueError("Tenant not found")
            
            # Determine template type
            template_type = self._determine_template_type(tenant, property_data)
            
            # Get base template
            base_template = self.INDUSTRY_TEMPLATES.get(tenant.industry, self._get_hotel_template())
            
            # Customize template based on property characteristics
            customized_template = await self._customize_template(base_template, property_data, tenant)
            
            # Apply tier-specific features
            tier_adjusted_template = self._apply_tier_features(customized_template, tenant.tier)
            
            # Add AI recommendations
            recommendations = await self._generate_recommendations(tenant, property_data, customized_template)
            
            return {
                "tenant_id": tenant_id,
                "template_type": template_type,
                "room_types": customized_template["room_types"],
                "rate_plans": customized_template["rate_plans"],
                "services": customized_template["services"],
                "default_settings": customized_template["default_settings"],
                "available_features": tier_adjusted_template["available_features"],
                "customization_suggestions": recommendations,
                "industry_insights": await self._get_industry_insights(tenant.industry),
                "pricing_guidance": await self._get_pricing_guidance(property_data, tenant)
            }
            
        except Exception as e:
            logger.error(f"Failed to generate property template: {str(e)}")
            raise ValueError(f"Template generation failed: {str(e)}")
    
    def _determine_template_type(self, tenant: TenantUser, property_data: Dict[str, Any]) -> str:
        """Determine the most appropriate template type"""
        
        room_count = property_data.get("room_count", 0)
        service_level = property_data.get("service_level", "standard")
        
        if room_count > 500:
            return "mega-hotel"
        elif room_count > 200:
            return "large-hotel"
        elif room_count > 50:
            return "medium-hotel"
        elif service_level == "luxury":
            return "luxury-boutique"
        elif tenant.industry == IndustryType.VACATION_RENTAL:
            return "vacation-rental"
        elif tenant.industry == IndustryType.HOSTEL:
            return "hostel"
        else:
            return "standard-hotel"
    
    def _get_hotel_template(self) -> Dict[str, Any]:
        """Get standard hotel template"""
        
        return {
            "room_types": [
                {
                    "name": "Standard Room",
                    "description": "Comfortable room with essential amenities",
                    "base_occupancy": 2,
                    "max_occupancy": 3,
                    "base_price": 120.00,
                    "amenities": ["wifi", "tv", "air-conditioning", "work-desk", "coffee-maker"],
                    "images": [],
                    "room_size_sqft": 250,
                    "bed_type": "queen"
                },
                {
                    "name": "Deluxe Room",
                    "description": "Spacious room with enhanced amenities",
                    "base_occupancy": 2,
                    "max_occupancy": 4,
                    "base_price": 180.00,
                    "amenities": ["wifi", "tv", "air-conditioning", "work-desk", "minibar", "premium-toiletries", "balcony"],
                    "images": [],
                    "room_size_sqft": 350,
                    "bed_type": "king"
                },
                {
                    "name": "Suite",
                    "description": "Luxurious suite with separate living area",
                    "base_occupancy": 2,
                    "max_occupancy": 6,
                    "base_price": 300.00,
                    "amenities": ["wifi", "tv", "air-conditioning", "work-desk", "minibar", "premium-toiletries", "balcony", "living-room", "kitchenette"],
                    "images": [],
                    "room_size_sqft": 600,
                    "bed_type": "king"
                }
            ],
            "rate_plans": [
                {
                    "name": "Best Available Rate",
                    "description": "Standard rate with flexible cancellation",
                    "cancellation_policy": "flexible",
                    "advance_booking": 0,
                    "min_stay": 1,
                    "max_stay": 30
                },
                {
                    "name": "Advance Purchase",
                    "description": "Discounted rate for advance bookings",
                    "cancellation_policy": "restrictive",
                    "advance_booking": 14,
                    "min_stay": 2,
                    "max_stay": 7,
                    "discount_percentage": 15
                },
                {
                    "name": "Non-Refundable",
                    "description": "Lowest rate with no cancellation",
                    "cancellation_policy": "non-refundable",
                    "advance_booking": 0,
                    "min_stay": 1,
                    "max_stay": 14,
                    "discount_percentage": 25
                }
            ],
            "services": [
                {
                    "name": "Breakfast",
                    "type": "restaurant",
                    "price": 25.00,
                    "included": False,
                    "description": "Continental breakfast buffet"
                },
                {
                    "name": "Airport Transfer",
                    "type": "transportation",
                    "price": 50.00,
                    "included": False,
                    "description": "One-way airport transfer"
                },
                {
                    "name": "Room Service",
                    "type": "restaurant",
                    "price": 0.00,
                    "included": True,
                    "description": "24/7 room service available"
                },
                {
                    "name": "WiFi",
                    "type": "internet",
                    "price": 0.00,
                    "included": True,
                    "description": "Complimentary high-speed WiFi"
                }
            ],
            "default_settings": {
                "check_in_time": "15:00",
                "check_out_time": "11:00",
                "min_stay": 1,
                "max_stay": 30,
                "advance_booking_days": 365,
                "cancellation_hours": 24,
                "currency": "USD",
                "timezone": "UTC"
            }
        }
    
    def _get_resort_template(self) -> Dict[str, Any]:
        """Get resort-specific template"""
        
        base_template = self._get_hotel_template()
        
        # Add resort-specific room types
        base_template["room_types"].extend([
            {
                "name": "Ocean View Room",
                "description": "Room with stunning ocean views",
                "base_occupancy": 2,
                "max_occupancy": 4,
                "base_price": 250.00,
                "amenities": ["wifi", "tv", "air-conditioning", "ocean-view", "balcony", "premium-toiletries"],
                "images": [],
                "room_size_sqft": 300,
                "bed_type": "king"
            },
            {
                "name": "Villa",
                "description": "Private villa with pool access",
                "base_occupancy": 4,
                "max_occupancy": 8,
                "base_price": 800.00,
                "amenities": ["wifi", "tv", "air-conditioning", "private-pool", "kitchen", "living-room", "dining-room"],
                "images": [],
                "room_size_sqft": 1200,
                "bed_type": "multiple"
            }
        ])
        
        # Add resort-specific services
        base_template["services"].extend([
            {
                "name": "Spa Services",
                "type": "spa",
                "price": 150.00,
                "included": False,
                "description": "Full-service spa treatments"
            },
            {
                "name": "Water Sports",
                "type": "recreation",
                "price": 75.00,
                "included": False,
                "description": "Snorkeling, kayaking, and water activities"
            },
            {
                "name": "Golf Course",
                "type": "recreation",
                "price": 100.00,
                "included": False,
                "description": "18-hole championship golf course"
            }
        ])
        
        return base_template
    
    def _get_vacation_rental_template(self) -> Dict[str, Any]:
        """Get vacation rental template"""
        
        return {
            "room_types": [
                {
                    "name": "Studio Apartment",
                    "description": "Cozy studio with kitchenette",
                    "base_occupancy": 2,
                    "max_occupancy": 3,
                    "base_price": 80.00,
                    "amenities": ["wifi", "kitchenette", "air-conditioning", "tv", "parking"],
                    "images": [],
                    "room_size_sqft": 400,
                    "bed_type": "queen"
                },
                {
                    "name": "One Bedroom",
                    "description": "Spacious one bedroom with full kitchen",
                    "base_occupancy": 2,
                    "max_occupancy": 4,
                    "base_price": 120.00,
                    "amenities": ["wifi", "kitchen", "air-conditioning", "tv", "parking", "balcony"],
                    "images": [],
                    "room_size_sqft": 600,
                    "bed_type": "queen"
                },
                {
                    "name": "Two Bedroom",
                    "description": "Two bedroom apartment perfect for families",
                    "base_occupancy": 4,
                    "max_occupancy": 6,
                    "base_price": 180.00,
                    "amenities": ["wifi", "kitchen", "air-conditioning", "tv", "parking", "balcony", "washing-machine"],
                    "images": [],
                    "room_size_sqft": 900,
                    "bed_type": "multiple"
                }
            ],
            "rate_plans": [
                {
                    "name": "Standard Rate",
                    "description": "Standard vacation rental rate",
                    "cancellation_policy": "moderate",
                    "advance_booking": 0,
                    "min_stay": 3,
                    "max_stay": 30
                },
                {
                    "name": "Weekly Rate",
                    "description": "Discounted rate for weekly stays",
                    "cancellation_policy": "moderate",
                    "advance_booking": 0,
                    "min_stay": 7,
                    "max_stay": 30,
                    "discount_percentage": 10
                }
            ],
            "services": [
                {
                    "name": "Cleaning Fee",
                    "type": "cleaning",
                    "price": 50.00,
                    "included": False,
                    "description": "One-time cleaning fee"
                },
                {
                    "name": "Pet Fee",
                    "type": "pet",
                    "price": 25.00,
                    "included": False,
                    "description": "Per pet per stay"
                },
                {
                    "name": "Parking",
                    "type": "parking",
                    "price": 0.00,
                    "included": True,
                    "description": "Complimentary parking"
                }
            ],
            "default_settings": {
                "check_in_time": "16:00",
                "check_out_time": "10:00",
                "min_stay": 3,
                "max_stay": 30,
                "advance_booking_days": 365,
                "cancellation_hours": 48,
                "currency": "USD",
                "timezone": "UTC"
            }
        }
    
    def _get_hostel_template(self) -> Dict[str, Any]:
        """Get hostel template"""
        
        return {
            "room_types": [
                {
                    "name": "Dormitory (6 beds)",
                    "description": "Shared dormitory with 6 beds",
                    "base_occupancy": 1,
                    "max_occupancy": 6,
                    "base_price": 25.00,
                    "amenities": ["wifi", "locker", "shared-bathroom", "linens"],
                    "images": [],
                    "room_size_sqft": 200,
                    "bed_type": "bunk"
                },
                {
                    "name": "Dormitory (4 beds)",
                    "description": "Shared dormitory with 4 beds",
                    "base_occupancy": 1,
                    "max_occupancy": 4,
                    "base_price": 30.00,
                    "amenities": ["wifi", "locker", "shared-bathroom", "linens"],
                    "images": [],
                    "room_size_sqft": 150,
                    "bed_type": "bunk"
                },
                {
                    "name": "Private Room",
                    "description": "Private room with shared bathroom",
                    "base_occupancy": 2,
                    "max_occupancy": 2,
                    "base_price": 60.00,
                    "amenities": ["wifi", "private-room", "shared-bathroom", "linens"],
                    "images": [],
                    "room_size_sqft": 100,
                    "bed_type": "twin"
                }
            ],
            "rate_plans": [
                {
                    "name": "Standard Rate",
                    "description": "Standard hostel rate",
                    "cancellation_policy": "flexible",
                    "advance_booking": 0,
                    "min_stay": 1,
                    "max_stay": 14
                }
            ],
            "services": [
                {
                    "name": "Breakfast",
                    "type": "restaurant",
                    "price": 8.00,
                    "included": False,
                    "description": "Continental breakfast"
                },
                {
                    "name": "Locker",
                    "type": "storage",
                    "price": 0.00,
                    "included": True,
                    "description": "Personal locker for valuables"
                },
                {
                    "name": "WiFi",
                    "type": "internet",
                    "price": 0.00,
                    "included": True,
                    "description": "Complimentary WiFi"
                }
            ],
            "default_settings": {
                "check_in_time": "14:00",
                "check_out_time": "10:00",
                "min_stay": 1,
                "max_stay": 14,
                "advance_booking_days": 90,
                "cancellation_hours": 24,
                "currency": "USD",
                "timezone": "UTC"
            }
        }
    
    def _get_boutique_hotel_template(self) -> Dict[str, Any]:
        """Get boutique hotel template"""
        
        base_template = self._get_hotel_template()
        
        # Adjust for boutique hotel characteristics
        for room_type in base_template["room_types"]:
            room_type["base_price"] = room_type["base_price"] * 1.3  # 30% premium
            room_type["amenities"].extend(["artwork", "local-touches", "premium-linens"])
        
        # Add boutique-specific services
        base_template["services"].extend([
            {
                "name": "Concierge Service",
                "type": "concierge",
                "price": 0.00,
                "included": True,
                "description": "Personalized concierge service"
            },
            {
                "name": "Local Experiences",
                "type": "experience",
                "price": 75.00,
                "included": False,
                "description": "Curated local experiences and tours"
            }
        ])
        
        return base_template
    
    def _get_bed_breakfast_template(self) -> Dict[str, Any]:
        """Get bed and breakfast template"""
        
        return {
            "room_types": [
                {
                    "name": "Standard Room",
                    "description": "Cozy room with private bathroom",
                    "base_occupancy": 2,
                    "max_occupancy": 2,
                    "base_price": 100.00,
                    "amenities": ["wifi", "private-bathroom", "breakfast", "parking"],
                    "images": [],
                    "room_size_sqft": 200,
                    "bed_type": "queen"
                },
                {
                    "name": "Deluxe Room",
                    "description": "Spacious room with garden view",
                    "base_occupancy": 2,
                    "max_occupancy": 2,
                    "base_price": 140.00,
                    "amenities": ["wifi", "private-bathroom", "breakfast", "parking", "garden-view", "fireplace"],
                    "images": [],
                    "room_size_sqft": 250,
                    "bed_type": "king"
                }
            ],
            "rate_plans": [
                {
                    "name": "Room Only",
                    "description": "Room without breakfast",
                    "cancellation_policy": "moderate",
                    "advance_booking": 0,
                    "min_stay": 1,
                    "max_stay": 7
                },
                {
                    "name": "Bed & Breakfast",
                    "description": "Room with breakfast included",
                    "cancellation_policy": "moderate",
                    "advance_booking": 0,
                    "min_stay": 1,
                    "max_stay": 7
                }
            ],
            "services": [
                {
                    "name": "Breakfast",
                    "type": "restaurant",
                    "price": 0.00,
                    "included": True,
                    "description": "Homemade breakfast included"
                },
                {
                    "name": "Parking",
                    "type": "parking",
                    "price": 0.00,
                    "included": True,
                    "description": "Complimentary parking"
                }
            ],
            "default_settings": {
                "check_in_time": "15:00",
                "check_out_time": "11:00",
                "min_stay": 1,
                "max_stay": 7,
                "advance_booking_days": 180,
                "cancellation_hours": 48,
                "currency": "USD",
                "timezone": "UTC"
            }
        }
    
    def _get_apartment_hotel_template(self) -> Dict[str, Any]:
        """Get apartment hotel template"""
        
        return {
            "room_types": [
                {
                    "name": "Studio Apartment",
                    "description": "Self-contained studio with kitchen",
                    "base_occupancy": 2,
                    "max_occupancy": 3,
                    "base_price": 100.00,
                    "amenities": ["wifi", "kitchen", "air-conditioning", "tv", "parking", "weekly-cleaning"],
                    "images": [],
                    "room_size_sqft": 400,
                    "bed_type": "queen"
                },
                {
                    "name": "One Bedroom Apartment",
                    "description": "One bedroom with full kitchen and living area",
                    "base_occupancy": 2,
                    "max_occupancy": 4,
                    "base_price": 150.00,
                    "amenities": ["wifi", "kitchen", "air-conditioning", "tv", "parking", "weekly-cleaning", "balcony"],
                    "images": [],
                    "room_size_sqft": 600,
                    "bed_type": "queen"
                }
            ],
            "rate_plans": [
                {
                    "name": "Daily Rate",
                    "description": "Standard daily rate",
                    "cancellation_policy": "moderate",
                    "advance_booking": 0,
                    "min_stay": 1,
                    "max_stay": 30
                },
                {
                    "name": "Weekly Rate",
                    "description": "Discounted weekly rate",
                    "cancellation_policy": "moderate",
                    "advance_booking": 0,
                    "min_stay": 7,
                    "max_stay": 30,
                    "discount_percentage": 15
                },
                {
                    "name": "Monthly Rate",
                    "description": "Best value monthly rate",
                    "cancellation_policy": "restrictive",
                    "advance_booking": 0,
                    "min_stay": 30,
                    "max_stay": 365,
                    "discount_percentage": 30
                }
            ],
            "services": [
                {
                    "name": "Weekly Cleaning",
                    "type": "cleaning",
                    "price": 0.00,
                    "included": True,
                    "description": "Weekly housekeeping service"
                },
                {
                    "name": "Parking",
                    "type": "parking",
                    "price": 0.00,
                    "included": True,
                    "description": "Complimentary parking"
                },
                {
                    "name": "Gym Access",
                    "type": "fitness",
                    "price": 0.00,
                    "included": True,
                    "description": "Access to fitness center"
                }
            ],
            "default_settings": {
                "check_in_time": "15:00",
                "check_out_time": "11:00",
                "min_stay": 1,
                "max_stay": 365,
                "advance_booking_days": 365,
                "cancellation_hours": 24,
                "currency": "USD",
                "timezone": "UTC"
            }
        }
    
    async def _customize_template(self, template: Dict[str, Any], property_data: Dict[str, Any], tenant: TenantUser) -> Dict[str, Any]:
        """Customize template based on property data and tenant characteristics"""
        
        customized = template.copy()
        
        # Adjust prices based on service level and location
        service_level = property_data.get("service_level", "standard")
        location = property_data.get("location", "global")
        
        service_multiplier = self.SERVICE_LEVEL_MULTIPLIERS.get(service_level, 1.0)
        regional_multiplier = self.REGIONAL_MULTIPLIERS.get(location, 1.0)
        total_multiplier = service_multiplier * regional_multiplier
        
        # Adjust room prices
        for room_type in customized["room_types"]:
            room_type["base_price"] = round(room_type["base_price"] * total_multiplier, 2)
        
        # Adjust service prices
        for service in customized["services"]:
            if service["price"] > 0:  # Only adjust paid services
                service["price"] = round(service["price"] * total_multiplier, 2)
        
        # Customize based on room count
        room_count = property_data.get("room_count", 0)
        if room_count < 20:
            # Small property - focus on quality over quantity
            for room_type in customized["room_types"]:
                room_type["amenities"].extend(["personalized-service", "local-recommendations"])
        elif room_count > 200:
            # Large property - add efficiency features
            for room_type in customized["room_types"]:
                room_type["amenities"].extend(["mobile-checkin", "digital-key"])
        
        return customized
    
    def _apply_tier_features(self, template: Dict[str, Any], tier: str) -> Dict[str, Any]:
        """Apply tier-specific features to template"""
        
        tier_features = {
            "essential": [
                "basic-analytics", "standard-support", "mobile-app", "booking-engine"
            ],
            "professional": [
                "advanced-analytics", "channel-manager", "priority-support", 
                "revenue-optimization", "multi-currency", "api-access"
            ],
            "enterprise": [
                "advanced-analytics", "multi-property", "custom-integrations", 
                "dedicated-support", "white-labeling", "advanced-reporting",
                "custom-branding", "api-access", "webhooks"
            ]
        }
        
        template["available_features"] = tier_features.get(tier, tier_features["essential"])
        return template
    
    async def _generate_recommendations(self, tenant: TenantUser, property_data: Dict[str, Any], template: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate AI-powered recommendations for property setup"""
        
        recommendations = []
        
        # Industry-specific recommendations
        if tenant.industry == IndustryType.RESORT:
            recommendations.append({
                "type": "feature",
                "title": "Add Spa Services",
                "description": "Resorts typically benefit from spa and wellness services",
                "priority": "high",
                "estimated_impact": "increases_revenue"
            })
        
        # Service level recommendations
        service_level = property_data.get("service_level", "standard")
        if service_level == "luxury":
            recommendations.append({
                "type": "amenity",
                "title": "Premium Amenities",
                "description": "Consider adding premium toiletries and luxury linens",
                "priority": "medium",
                "estimated_impact": "improves_guest_satisfaction"
            })
        
        # Room count recommendations
        room_count = property_data.get("room_count", 0)
        if room_count > 100:
            recommendations.append({
                "type": "efficiency",
                "title": "Mobile Check-in",
                "description": "Large properties benefit from mobile check-in to reduce front desk wait times",
                "priority": "high",
                "estimated_impact": "improves_guest_experience"
            })
        
        return recommendations
    
    async def _get_industry_insights(self, industry: IndustryType) -> Dict[str, Any]:
        """Get industry-specific insights and benchmarks"""
        
        insights = {
            IndustryType.HOTEL: {
                "average_occupancy": 65,
                "average_daily_rate": 150,
                "key_trends": ["contactless_checkin", "sustainability", "personalization"],
                "seasonal_patterns": "peak_summer_winter"
            },
            IndustryType.RESORT: {
                "average_occupancy": 70,
                "average_daily_rate": 300,
                "key_trends": ["wellness_tourism", "experiential_travel", "sustainability"],
                "seasonal_patterns": "peak_summer_holidays"
            },
            IndustryType.VACATION_RENTAL: {
                "average_occupancy": 60,
                "average_daily_rate": 120,
                "key_trends": ["remote_work", "extended_stays", "local_experiences"],
                "seasonal_patterns": "peak_summer_holidays"
            }
        }
        
        return insights.get(industry, {
            "average_occupancy": 60,
            "average_daily_rate": 100,
            "key_trends": ["digital_transformation", "sustainability"],
            "seasonal_patterns": "moderate_seasonality"
        })
    
    async def _get_pricing_guidance(self, property_data: Dict[str, Any], tenant: TenantUser) -> Dict[str, Any]:
        """Get pricing guidance based on property characteristics"""
        
        room_count = property_data.get("room_count", 0)
        service_level = property_data.get("service_level", "standard")
        location = property_data.get("location", "global")
        
        # Base pricing recommendations
        base_price_ranges = {
            "budget": {"min": 50, "max": 100},
            "standard": {"min": 100, "max": 200},
            "premium": {"min": 200, "max": 400},
            "luxury": {"min": 400, "max": 1000}
        }
        
        price_range = base_price_ranges.get(service_level, base_price_ranges["standard"])
        
        # Adjust for location
        regional_adjustments = {
            "north-america": 1.2,
            "europe": 1.1,
            "asia": 0.8,
            "africa": 0.6,
            "south-america": 0.7,
            "oceania": 1.3
        }
        
        adjustment = regional_adjustments.get(location, 1.0)
        adjusted_min = price_range["min"] * adjustment
        adjusted_max = price_range["max"] * adjustment
        
        return {
            "recommended_price_range": {
                "min": round(adjusted_min, 2),
                "max": round(adjusted_max, 2)
            },
            "pricing_strategy": "dynamic_pricing" if room_count > 50 else "fixed_pricing",
            "seasonal_adjustments": "recommended" if room_count > 20 else "optional",
            "competitor_analysis": "available" if tenant.tier in ["professional", "enterprise"] else "basic"
        }