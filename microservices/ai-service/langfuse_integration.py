"""
Langfuse Integration for The Shandi AI Service
Enhanced AI observability and tracing capabilities
"""

import os
import logging
import time
from datetime import datetime
from typing import Dict, List, Optional, Any
from enum import Enum

# Langfuse imports
from langfuse import get_client, observe
from langfuse.decorators import langfuse_context

# Pydantic AI imports
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIModel

# LangGraph imports
from langgraph.graph import StateGraph, MessagesState
from langchain_core.messages import HumanMessage, AIMessage

# FastAPI imports
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Langfuse client
langfuse = get_client()

class ConversationIntent(str, Enum):
    """Conversation intent types"""
    BOOKING = "booking"
    AMENITIES = "amenities"
    SUPPORT = "support"
    GENERAL = "general"
    PAYMENT = "payment"
    LOYALTY = "loyalty"

class AIResponse(BaseModel):
    """AI response model"""
    response: str
    intent: str
    confidence: float
    metadata: Dict[str, Any]
    timestamp: str

class ConversationRequest(BaseModel):
    """Conversation request model"""
    message: str
    user_id: str
    session_id: str
    context: Optional[Dict[str, Any]] = None
    property_id: Optional[str] = None

class RecommendationRequest(BaseModel):
    """Recommendation request model"""
    user_id: str
    preferences: Optional[Dict[str, Any]] = None
    context: Optional[Dict[str, Any]] = None

class AnalyticsRequest(BaseModel):
    """Analytics request model"""
    period: str
    metrics: List[str]
    filters: Optional[Dict[str, Any]] = None

class LangfuseAIService:
    """Enhanced AI Service with Langfuse observability"""
    
    def __init__(self):
        self.langfuse = langfuse
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        
        # Initialize AI agents with instrumentation
        self.conversational_agent = self._create_conversational_agent()
        self.recommendation_agent = self._create_recommendation_agent()
        self.analytics_agent = self._create_analytics_agent()
        
        # Initialize LangGraph workflows
        self.conversation_workflow = self._create_conversation_workflow()
        
        # Initialize observability components
        self.observability = HospitalityObservability()
        self.caching = AICaching()
        
        logger.info("✅ Langfuse AI Service initialized successfully")
    
    def _create_conversational_agent(self) -> Agent:
        """Create conversational AI agent with Langfuse instrumentation"""
        
        @observe(name="conversational_ai_agent")
        def create_agent():
            agent = Agent(
                model=OpenAIModel('gpt-4o', api_key=self.openai_api_key),
                system_prompt="""
                You are an AI assistant for The Shandi hospitality platform.
                Provide helpful, accurate, and context-aware responses to guests and staff.
                Always maintain a professional and friendly tone.
                Focus on hospitality excellence and guest satisfaction.
                """,
                result_type=str,
                instrument=True
            )
            
            # Add hospitality tools with observability
            @agent.tool
            @observe(name="get_property_info")
            async def get_property_info(ctx: RunContext, property_id: str) -> str:
                """Get comprehensive property information"""
                
                # Simulate property data retrieval
                property_data = {
                    "id": property_id,
                    "name": "The Shandi Resort",
                    "location": "Coastal Paradise",
                    "amenities": ["spa", "restaurant", "pool", "gym", "concierge"],
                    "rooms": 150,
                    "rating": 4.8,
                    "features": ["ocean_view", "beach_access", "fine_dining"]
                }
                
                # Log to Langfuse
                langfuse_context.update_current_trace(
                    metadata={
                        "property_id": property_id,
                        "property_data": property_data
                    },
                    tags=["property_info", "hospitality", "data_retrieval"]
                )
                
                return f"""Property: {property_data['name']}
Location: {property_data['location']}
Rooms: {property_data['rooms']}
Rating: {property_data['rating']}/5
Amenities: {', '.join(property_data['amenities'])}
Features: {', '.join(property_data['features'])}"""
            
            @agent.tool
            @observe(name="check_availability")
            async def check_availability(ctx: RunContext, date: str, room_type: str, nights: int = 1) -> str:
                """Check room availability with detailed information"""
                
                # Simulate availability check
                available_rooms = {
                    "standard": 25,
                    "deluxe": 15,
                    "suite": 8,
                    "presidential": 2
                }
                
                available = available_rooms.get(room_type, 0) > 0
                
                # Log to Langfuse
                langfuse_context.update_current_trace(
                    metadata={
                        "date": date,
                        "room_type": room_type,
                        "nights": nights,
                        "available": available,
                        "available_count": available_rooms.get(room_type, 0)
                    },
                    tags=["availability", "booking", "inventory"]
                )
                
                if available:
                    return f"✅ {room_type.title()} rooms are available on {date} for {nights} night(s). {available_rooms[room_type]} rooms remaining."
                else:
                    return f"❌ {room_type.title()} rooms are not available on {date}. Please try different dates or room types."
            
            @agent.tool
            @observe(name="get_amenities_info")
            async def get_amenities_info(ctx: RunContext, amenity_type: str = "all") -> str:
                """Get detailed amenities information"""
                
                amenities_data = {
                    "spa": {
                        "name": "Serenity Spa",
                        "services": ["massage", "facial", "body_treatment"],
                        "hours": "9:00 AM - 9:00 PM",
                        "booking_required": True
                    },
                    "restaurant": {
                        "name": "Ocean Breeze Restaurant",
                        "cuisine": "Mediterranean",
                        "hours": "7:00 AM - 11:00 PM",
                        "dress_code": "Smart Casual"
                    },
                    "pool": {
                        "name": "Infinity Pool",
                        "features": ["heated", "infinity_edge", "pool_bar"],
                        "hours": "6:00 AM - 10:00 PM",
                        "age_restriction": "Children welcome"
                    },
                    "gym": {
                        "name": "Fitness Center",
                        "equipment": ["cardio", "weights", "yoga_studio"],
                        "hours": "24/7",
                        "personal_trainer": True
                    }
                }
                
                # Log to Langfuse
                langfuse_context.update_current_trace(
                    metadata={
                        "amenity_type": amenity_type,
                        "amenities_data": amenities_data
                    },
                    tags=["amenities", "information", "services"]
                )
                
                if amenity_type == "all":
                    return f"""Available Amenities:
• Spa: {amenities_data['spa']['name']} - {amenities_data['spa']['hours']}
• Restaurant: {amenities_data['restaurant']['name']} - {amenities_data['restaurant']['cuisine']} cuisine
• Pool: {amenities_data['pool']['name']} - {amenities_data['pool']['hours']}
• Gym: {amenities_data['gym']['name']} - {amenities_data['gym']['hours']}"""
                else:
                    amenity = amenities_data.get(amenity_type, {})
                    if amenity:
                        return f"""{amenity_type.title()}: {amenity.get('name', 'N/A')}
Hours: {amenity.get('hours', 'N/A')}
Features: {', '.join(amenity.get('features', []))}"""
                    else:
                        return f"Amenity '{amenity_type}' not found. Available amenities: {', '.join(amenities_data.keys())}"
            
            return agent
        
        return create_agent()
    
    def _create_recommendation_agent(self) -> Agent:
        """Create recommendation AI agent with Langfuse instrumentation"""
        
        @observe(name="recommendation_agent")
        def create_agent():
            agent = Agent(
                model=OpenAIModel('gpt-4o-mini', api_key=self.openai_api_key),
                system_prompt="""
                You are a recommendation engine for The Shandi hospitality platform.
                Provide personalized recommendations based on user preferences, behavior, and context.
                Consider factors like past bookings, preferences, current availability, and seasonal trends.
                Always prioritize guest satisfaction and revenue optimization.
                """,
                result_type=str,
                instrument=True
            )
            
            @agent.tool
            @observe(name="analyze_user_preferences")
            async def analyze_user_preferences(ctx: RunContext, user_id: str) -> str:
                """Analyze user preferences for personalized recommendations"""
                
                # Simulate user preference analysis
                preferences = {
                    "preferred_room_type": "suite",
                    "amenities": ["spa", "restaurant", "pool"],
                    "budget_range": "premium",
                    "travel_frequency": "monthly",
                    "loyalty_tier": "gold",
                    "past_bookings": 12,
                    "average_stay": 3.5,
                    "preferred_season": "summer"
                }
                
                # Log to Langfuse
                langfuse_context.update_current_trace(
                    metadata={
                        "user_id": user_id,
                        "preferences": preferences
                    },
                    tags=["recommendation", "user_analysis", "personalization"]
                )
                
                return f"""User Profile Analysis:
• Preferred Room: {preferences['preferred_room_type']}
• Key Amenities: {', '.join(preferences['amenities'])}
• Budget Level: {preferences['budget_range']}
• Loyalty Status: {preferences['loyalty_tier']}
• Travel Pattern: {preferences['travel_frequency']} ({preferences['past_bookings']} bookings)
• Average Stay: {preferences['average_stay']} nights
• Preferred Season: {preferences['preferred_season']}"""
            
            @agent.tool
            @observe(name="get_seasonal_recommendations")
            async def get_seasonal_recommendations(ctx: RunContext, season: str) -> str:
                """Get seasonal recommendations and offers"""
                
                seasonal_data = {
                    "summer": {
                        "recommendations": ["beach_access", "pool_activities", "outdoor_dining"],
                        "offers": ["early_booking_discount", "spa_package"],
                        "activities": ["water_sports", "beach_yoga", "sunset_cruise"]
                    },
                    "winter": {
                        "recommendations": ["spa_treatments", "indoor_dining", "fireplace_rooms"],
                        "offers": ["winter_getaway", "romance_package"],
                        "activities": ["wine_tasting", "cooking_class", "indoor_spa"]
                    },
                    "spring": {
                        "recommendations": ["garden_tours", "outdoor_activities", "fresh_cuisine"],
                        "offers": ["spring_renewal", "wellness_package"],
                        "activities": ["nature_walks", "gardening", "outdoor_yoga"]
                    },
                    "fall": {
                        "recommendations": ["harvest_dining", "cozy_rooms", "cultural_tours"],
                        "offers": ["autumn_retreat", "culinary_experience"],
                        "activities": ["wine_harvest", "cultural_events", "cozy_fireplace"]
                    }
                }
                
                # Log to Langfuse
                langfuse_context.update_current_trace(
                    metadata={
                        "season": season,
                        "seasonal_data": seasonal_data.get(season, {})
                    },
                    tags=["recommendation", "seasonal", "offers"]
                )
                
                season_info = seasonal_data.get(season, {})
                if season_info:
                    return f"""Seasonal Recommendations for {season.title()}:
• Top Recommendations: {', '.join(season_info.get('recommendations', []))}
• Special Offers: {', '.join(season_info.get('offers', []))}
• Activities: {', '.join(season_info.get('activities', []))}"""
                else:
                    return f"Season '{season}' not found. Available seasons: {', '.join(seasonal_data.keys())}"
            
            return agent
        
        return create_agent()
    
    def _create_analytics_agent(self) -> Agent:
        """Create analytics AI agent with Langfuse instrumentation"""
        
        @observe(name="analytics_agent")
        def create_agent():
            agent = Agent(
                model=OpenAIModel('gpt-4o-mini', api_key=self.openai_api_key),
                system_prompt="""
                You are an analytics AI for The Shandi hospitality platform.
                Analyze data and provide insights for business optimization.
                Focus on revenue, customer satisfaction, operational efficiency, and market trends.
                Provide actionable insights and recommendations for improvement.
                """,
                result_type=str,
                instrument=True
            )
            
            @agent.tool
            @observe(name="analyze_revenue_data")
            async def analyze_revenue_data(ctx: RunContext, period: str) -> str:
                """Analyze revenue data and provide insights"""
                
                # Simulate revenue analysis
                revenue_data = {
                    "period": period,
                    "total_revenue": 125000,
                    "growth_rate": 15.5,
                    "top_services": ["spa", "restaurant", "rooms"],
                    "revenue_by_service": {
                        "rooms": 75000,
                        "spa": 25000,
                        "restaurant": 20000,
                        "other": 5000
                    },
                    "average_daily_rate": 350,
                    "occupancy_rate": 0.78,
                    "revenue_per_available_room": 273
                }
                
                # Log to Langfuse
                langfuse_context.update_current_trace(
                    metadata={
                        "period": period,
                        "revenue_data": revenue_data
                    },
                    tags=["analytics", "revenue", "business_intelligence"]
                )
                
                return f"""Revenue Analysis for {period}:
• Total Revenue: ${revenue_data['total_revenue']:,}
• Growth Rate: {revenue_data['growth_rate']}%
• Top Services: {', '.join(revenue_data['top_services'])}
• Average Daily Rate: ${revenue_data['average_daily_rate']}
• Occupancy Rate: {revenue_data['occupancy_rate']:.1%}
• RevPAR: ${revenue_data['revenue_per_available_room']}

Revenue Breakdown:
• Rooms: ${revenue_data['revenue_by_service']['rooms']:,}
• Spa: ${revenue_data['revenue_by_service']['spa']:,}
• Restaurant: ${revenue_data['revenue_by_service']['restaurant']:,}
• Other: ${revenue_data['revenue_by_service']['other']:,}"""
            
            @agent.tool
            @observe(name="analyze_customer_satisfaction")
            async def analyze_customer_satisfaction(ctx: RunContext, period: str) -> str:
                """Analyze customer satisfaction metrics"""
                
                # Simulate satisfaction analysis
                satisfaction_data = {
                    "period": period,
                    "overall_satisfaction": 4.6,
                    "satisfaction_by_service": {
                        "rooms": 4.7,
                        "spa": 4.8,
                        "restaurant": 4.5,
                        "staff": 4.9
                    },
                    "net_promoter_score": 8.2,
                    "response_rate": 0.65,
                    "top_complaints": ["wifi_speed", "room_service_timing"],
                    "top_praises": ["staff_friendliness", "room_cleanliness", "spa_quality"]
                }
                
                # Log to Langfuse
                langfuse_context.update_current_trace(
                    metadata={
                        "period": period,
                        "satisfaction_data": satisfaction_data
                    },
                    tags=["analytics", "satisfaction", "customer_experience"]
                )
                
                return f"""Customer Satisfaction Analysis for {period}:
• Overall Satisfaction: {satisfaction_data['overall_satisfaction']}/5
• Net Promoter Score: {satisfaction_data['net_promoter_score']}/10
• Response Rate: {satisfaction_data['response_rate']:.1%}

Satisfaction by Service:
• Rooms: {satisfaction_data['satisfaction_by_service']['rooms']}/5
• Spa: {satisfaction_data['satisfaction_by_service']['spa']}/5
• Restaurant: {satisfaction_data['satisfaction_by_service']['restaurant']}/5
• Staff: {satisfaction_data['satisfaction_by_service']['staff']}/5

Top Praises: {', '.join(satisfaction_data['top_praises'])}
Areas for Improvement: {', '.join(satisfaction_data['top_complaints'])}"""
            
            return agent
        
        return create_agent()
    
    def _create_conversation_workflow(self) -> StateGraph:
        """Create LangGraph conversation workflow with Langfuse tracing"""
        
        @observe(name="conversation_workflow")
        def create_workflow():
            # Define enhanced conversation state
            class EnhancedConversationState(MessagesState):
                user_id: str
                session_id: str
                property_id: Optional[str] = None
                intent: Optional[str] = None
                confidence: float = 0.0
                context: Dict[str, Any] = {}
                metadata: Dict[str, Any] = {}
            
            # Create workflow
            workflow = StateGraph(EnhancedConversationState)
            
            @observe(name="intent_classification_node")
            async def classify_intent(state: EnhancedConversationState) -> EnhancedConversationState:
                """Enhanced intent classification with observability"""
                
                last_message = state.messages[-1]
                message_content = last_message.content.lower()
                
                # Enhanced intent classification
                intent_keywords = {
                    ConversationIntent.BOOKING: ["book", "reserve", "room", "stay", "check-in", "check-out"],
                    ConversationIntent.AMENITIES: ["spa", "restaurant", "pool", "gym", "amenities", "facilities"],
                    ConversationIntent.SUPPORT: ["help", "issue", "problem", "assistance", "support"],
                    ConversationIntent.PAYMENT: ["payment", "bill", "charge", "cost", "price"],
                    ConversationIntent.LOYALTY: ["loyalty", "points", "rewards", "member", "tier"],
                    ConversationIntent.GENERAL: ["hello", "hi", "information", "about", "welcome"]
                }
                
                intent_scores = {}
                for intent, keywords in intent_keywords.items():
                    score = sum(1 for keyword in keywords if keyword in message_content)
                    intent_scores[intent] = score
                
                # Determine intent with confidence
                best_intent = max(intent_scores, key=intent_scores.get)
                confidence = intent_scores[best_intent] / len(intent_keywords[best_intent]) if intent_keywords[best_intent] else 0.0
                
                # Update state
                state.intent = best_intent
                state.confidence = confidence
                state.metadata["intent_classification"] = {
                    "intent": best_intent,
                    "confidence": confidence,
                    "scores": intent_scores,
                    "timestamp": datetime.utcnow().isoformat()
                }
                
                # Log to Langfuse
                langfuse_context.update_current_trace(
                    metadata={
                        "intent": best_intent,
                        "confidence": confidence,
                        "message": last_message.content,
                        "intent_scores": intent_scores
                    },
                    tags=["intent_classification", "nlp", "conversation"]
                )
                
                return state
            
            @observe(name="context_extraction_node")
            async def extract_context(state: EnhancedConversationState) -> EnhancedConversationState:
                """Extract relevant context with observability"""
                
                last_message = state.messages[-1]
                intent = state.intent
                
                # Extract context based on intent
                context = {}
                
                if intent == ConversationIntent.BOOKING:
                    # Extract booking-related context
                    context = {
                        "extracted_dates": ["2025-01-20", "2025-01-22"],  # Simulated
                        "room_preferences": ["suite", "ocean_view"],
                        "guest_count": 2,
                        "special_requests": ["late_checkout", "spa_access"]
                    }
                elif intent == ConversationIntent.AMENITIES:
                    # Extract amenity-related context
                    context = {
                        "requested_amenities": ["spa", "restaurant"],
                        "property_id": state.property_id or "default",
                        "availability_check": True
                    }
                elif intent == ConversationIntent.SUPPORT:
                    # Extract support-related context
                    context = {
                        "issue_type": "general",
                        "urgency": "medium",
                        "escalation_required": False
                    }
                
                # Update state
                state.context.update(context)
                state.metadata["context_extraction"] = {
                    "extracted_context": context,
                    "timestamp": datetime.utcnow().isoformat()
                }
                
                # Log to Langfuse
                langfuse_context.update_current_trace(
                    metadata={
                        "intent": intent,
                        "extracted_context": context,
                        "message": last_message.content
                    },
                    tags=["context_extraction", "nlp", "conversation"]
                )
                
                return state
            
            @observe(name="response_generation_node")
            async def generate_response(state: EnhancedConversationState) -> EnhancedConversationState:
                """Generate contextual response with observability"""
                
                intent = state.intent
                context = state.context
                confidence = state.confidence
                
                # Generate response based on intent and context
                if intent == ConversationIntent.BOOKING:
                    response = f"""I'd be happy to help you with your booking! 
Based on your preferences, I can offer you a {context.get('room_preferences', ['standard'])[0]} room.
I see you're interested in {context.get('special_requests', ['standard service'])[0]}.
Would you like me to check availability for your preferred dates?"""
                elif intent == ConversationIntent.AMENITIES:
                    response = f"""Our property offers excellent amenities including spa, restaurant, pool, and gym facilities.
I can provide detailed information about any specific amenity you're interested in.
What would you like to know more about?"""
                elif intent == ConversationIntent.SUPPORT:
                    response = """I'm here to help! I can assist you with:
• Booking and reservations
• Amenities and services
• Payment and billing
• Loyalty program information
What specific assistance do you need?"""
                elif intent == ConversationIntent.PAYMENT:
                    response = """I can help you with payment-related questions including:
• Billing inquiries
• Payment methods
• Charges and fees
• Loyalty program benefits
What payment information do you need?"""
                elif intent == ConversationIntent.LOYALTY:
                    response = """I can help you with our loyalty program including:
• Points balance and redemption
• Tier benefits and upgrades
• Special member offers
• Program enrollment
What loyalty program information do you need?"""
                else:
                    response = """Welcome to The Shandi! I'm your AI assistant and I'm here to help you with:
• Room bookings and reservations
• Amenities and services information
• Payment and billing questions
• Loyalty program benefits
How can I assist you today?"""
                
                # Add response to state
                state.messages.append(AIMessage(content=response))
                
                # Update metadata
                state.metadata["response_generation"] = {
                    "response": response,
                    "intent": intent,
                    "confidence": confidence,
                    "context_used": context,
                    "timestamp": datetime.utcnow().isoformat()
                }
                
                # Log to Langfuse
                langfuse_context.update_current_trace(
                    metadata={
                        "intent": intent,
                        "confidence": confidence,
                        "response": response,
                        "context_used": context
                    },
                    tags=["response_generation", "conversation", "hospitality"]
                )
                
                return state
            
            # Add nodes to workflow
            workflow.add_node("classify_intent", classify_intent)
            workflow.add_node("extract_context", extract_context)
            workflow.add_node("generate_response", generate_response)
            
            # Define edges
            workflow.add_edge("classify_intent", "extract_context")
            workflow.add_edge("extract_context", "generate_response")
            workflow.add_edge("generate_response", "__end__")
            
            # Set entry point
            workflow.set_entry_point("classify_intent")
            
            return workflow.compile()
        
        return create_workflow()

class HospitalityObservability:
    """Custom observability for hospitality operations"""
    
    def __init__(self):
        self.langfuse = langfuse
    
    @observe(name="booking_analytics")
    async def track_booking_metrics(self, booking_data: Dict[str, Any]):
        """Track booking-related metrics with Langfuse"""
        
        # Calculate booking metrics
        metrics = {
            "booking_value": booking_data.get("total_amount", 0),
            "room_type": booking_data.get("room_type", "standard"),
            "stay_duration": booking_data.get("nights", 1),
            "guest_count": booking_data.get("guests", 1),
            "advance_booking_days": booking_data.get("advance_days", 0),
            "loyalty_tier": booking_data.get("loyalty_tier", "bronze"),
            "revenue_per_guest": booking_data.get("total_amount", 0) / booking_data.get("guests", 1)
        }
        
        # Log to Langfuse
        langfuse_context.update_current_trace(
            metadata=metrics,
            tags=["booking", "revenue", "analytics", "hospitality"]
        )
        
        return metrics
    
    @observe(name="customer_satisfaction")
    async def track_satisfaction_metrics(self, feedback_data: Dict[str, Any]):
        """Track customer satisfaction metrics with Langfuse"""
        
        # Analyze satisfaction
        satisfaction_score = feedback_data.get("rating", 5)
        feedback_text = feedback_data.get("feedback", "")
        
        # Sentiment analysis (simplified)
        positive_words = ["excellent", "amazing", "wonderful", "perfect", "great"]
        negative_words = ["terrible", "awful", "disappointing", "poor", "bad"]
        
        sentiment_score = 0
        for word in positive_words:
            if word in feedback_text.lower():
                sentiment_score += 1
        for word in negative_words:
            if word in feedback_text.lower():
                sentiment_score -= 1
        
        sentiment = "positive" if sentiment_score > 0 else "negative" if sentiment_score < 0 else "neutral"
        
        # Log to Langfuse
        langfuse_context.update_current_trace(
            metadata={
                "satisfaction_score": satisfaction_score,
                "sentiment": sentiment,
                "sentiment_score": sentiment_score,
                "feedback_length": len(feedback_text),
                "feedback_text": feedback_text[:100]  # First 100 chars
            },
            tags=["satisfaction", "feedback", "analytics", "customer_experience"]
        )
        
        return {
            "satisfaction_score": satisfaction_score,
            "sentiment": sentiment,
            "sentiment_score": sentiment_score
        }
    
    @observe(name="revenue_optimization")
    async def track_revenue_metrics(self, revenue_data: Dict[str, Any]):
        """Track revenue optimization metrics with Langfuse"""
        
        # Calculate revenue metrics
        metrics = {
            "daily_revenue": revenue_data.get("daily_revenue", 0),
            "occupancy_rate": revenue_data.get("occupancy_rate", 0),
            "average_daily_rate": revenue_data.get("adr", 0),
            "revenue_per_available_room": revenue_data.get("revpar", 0),
            "revenue_by_service": revenue_data.get("revenue_by_service", {}),
            "growth_rate": revenue_data.get("growth_rate", 0)
        }
        
        # Log to Langfuse
        langfuse_context.update_current_trace(
            metadata=metrics,
            tags=["revenue", "optimization", "analytics", "business_intelligence"]
        )
        
        return metrics

class AICaching:
    """AI response caching with Langfuse observability"""
    
    def __init__(self):
        # In production, use Redis
        self.cache = {}
    
    @observe(name="cached_ai_response")
    async def get_cached_response(self, query: str, cache_key: str):
        """Get cached AI response with observability"""
        
        # Check cache
        cached_response = self.cache.get(cache_key)
        
        if cached_response:
            # Log cache hit
            langfuse_context.update_current_trace(
                metadata={"cache_hit": True, "query": query, "cache_key": cache_key},
                tags=["caching", "performance", "optimization"]
            )
            
            return cached_response
        
        # Cache miss - log and return None
        langfuse_context.update_current_trace(
            metadata={"cache_hit": False, "query": query, "cache_key": cache_key},
            tags=["caching", "performance", "optimization"]
        )
        
        return None
    
    @observe(name="cache_ai_response")
    async def cache_response(self, query: str, response: str, cache_key: str, ttl: int = 3600):
        """Cache AI response with observability"""
        
        # Store in cache
        self.cache[cache_key] = {
            "query": query,
            "response": response,
            "timestamp": datetime.utcnow().isoformat(),
            "ttl": ttl
        }
        
        # Log cache operation
        langfuse_context.update_current_trace(
            metadata={
                "cache_operation": "store",
                "query": query,
                "cache_key": cache_key,
                "ttl": ttl,
                "response_length": len(response)
            },
            tags=["caching", "performance", "optimization"]
        )

# Initialize AI service
ai_service = LangfuseAIService()

# FastAPI app with enhanced Langfuse integration
app = FastAPI(
    title="AI Service with Langfuse Observability",
    description="Enhanced AI service with comprehensive observability and tracing",
    version="1.0.0"
)

# API Endpoints with comprehensive Langfuse tracing
@app.post("/api/ai/conversation", response_model=AIResponse)
@observe(name="conversation_endpoint")
async def handle_conversation(request: ConversationRequest):
    """Handle conversational AI with comprehensive Langfuse tracing"""
    
    start_time = time.time()
    
    try:
        # Check cache first
        cache_key = f"conv_{hash(request.message)}_{request.user_id}"
        cached_response = await ai_service.caching.get_cached_response(request.message, cache_key)
        
        if cached_response:
            return AIResponse(
                response=cached_response["response"],
                intent="cached",
                confidence=1.0,
                metadata={"cached": True, "cache_key": cache_key},
                timestamp=cached_response["timestamp"]
            )
        
        # Create conversation state
        state = MessagesState(
            messages=[HumanMessage(content=request.message)],
            user_id=request.user_id,
            session_id=request.session_id,
            property_id=request.property_id,
            context=request.context or {}
        )
        
        # Run conversation workflow
        result = await ai_service.conversation_workflow.ainvoke(state)
        
        # Get response
        response = result.messages[-1].content
        intent = result.intent
        confidence = result.confidence
        
        # Cache response
        await ai_service.caching.cache_response(
            request.message, response, cache_key
        )
        
        end_time = time.time()
        duration = end_time - start_time
        
        # Log to Langfuse
        langfuse_context.update_current_trace(
            input={
                "message": request.message,
                "user_id": request.user_id,
                "session_id": request.session_id,
                "property_id": request.property_id
            },
            output={
                "response": response,
                "intent": intent,
                "confidence": confidence
            },
            metadata={
                "duration": duration,
                "cache_hit": False,
                "context": result.context,
                "workflow_metadata": result.metadata
            },
            tags=["conversation", "hospitality", "ai", "langfuse"]
        )
        
        return AIResponse(
            response=response,
            intent=intent,
            confidence=confidence,
            metadata={
                "duration": duration,
                "context": result.context,
                "workflow_metadata": result.metadata
            },
            timestamp=datetime.utcnow().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Conversation error: {e}")
        
        # Log error to Langfuse
        langfuse_context.update_current_trace(
            metadata={"error": str(e), "error_type": type(e).__name__},
            tags=["error", "conversation", "hospitality"]
        )
        
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/recommendations")
@observe(name="recommendations_endpoint")
async def get_recommendations(request: RecommendationRequest):
    """Get AI-powered recommendations with Langfuse tracing"""
    
    start_time = time.time()
    
    try:
        # Generate recommendations
        result = await ai_service.recommendation_agent.run(
            f"Generate personalized recommendations for user {request.user_id}",
            deps=request.user_id
        )
        
        end_time = time.time()
        duration = end_time - start_time
        
        # Log to Langfuse
        langfuse_context.update_current_trace(
            input={
                "user_id": request.user_id,
                "preferences": request.preferences,
                "context": request.context
            },
            output={"recommendations": result.data},
            metadata={
                "duration": duration,
                "recommendation_type": "personalized"
            },
            tags=["recommendations", "personalization", "ai", "hospitality"]
        )
        
        return {
            "recommendations": result.data,
            "user_id": request.user_id,
            "duration": duration,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Recommendations error: {e}")
        
        # Log error to Langfuse
        langfuse_context.update_current_trace(
            metadata={"error": str(e), "error_type": type(e).__name__},
            tags=["error", "recommendations", "hospitality"]
        )
        
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/analytics")
@observe(name="analytics_endpoint")
async def get_ai_analytics(request: AnalyticsRequest):
    """Get AI analytics with Langfuse tracing"""
    
    start_time = time.time()
    
    try:
        # Generate analytics
        result = await ai_service.analytics_agent.run(
            f"Analyze data for period: {request.period} with metrics: {', '.join(request.metrics)}",
            deps=request.period
        )
        
        end_time = time.time()
        duration = end_time - start_time
        
        # Log to Langfuse
        langfuse_context.update_current_trace(
            input={
                "period": request.period,
                "metrics": request.metrics,
                "filters": request.filters
            },
            output={"analytics": result.data},
            metadata={
                "duration": duration,
                "analytics_type": "business_intelligence"
            },
            tags=["analytics", "business_intelligence", "ai", "hospitality"]
        )
        
        return {
            "analytics": result.data,
            "period": request.period,
            "metrics": request.metrics,
            "duration": duration,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Analytics error: {e}")
        
        # Log error to Langfuse
        langfuse_context.update_current_trace(
            metadata={"error": str(e), "error_type": type(e).__name__},
            tags=["error", "analytics", "hospitality"]
        )
        
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai/metrics")
@observe(name="ai_metrics_endpoint")
async def get_ai_metrics():
    """Get AI service metrics with Langfuse tracing"""
    
    try:
        # Get Langfuse metrics
        langfuse_metrics = {
            "langfuse_connected": langfuse.auth_check(),
            "total_traces": 0,  # Would be fetched from Langfuse API
            "active_sessions": 0,
            "avg_response_time": 0,
            "error_rate": 0
        }
        
        # Log to Langfuse
        langfuse_context.update_current_trace(
            metadata=langfuse_metrics,
            tags=["metrics", "monitoring", "ai_service"]
        )
        
        return {
            "service": "ai-service",
            "status": "healthy",
            "langfuse_metrics": langfuse_metrics,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Metrics error: {e}")
        
        # Log error to Langfuse
        langfuse_context.update_current_trace(
            metadata={"error": str(e), "error_type": type(e).__name__},
            tags=["error", "metrics", "ai_service"]
        )
        
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint with Langfuse status"""
    return {
        "service": "ai-service",
        "status": "healthy",
        "langfuse_connected": langfuse.auth_check(),
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8012)