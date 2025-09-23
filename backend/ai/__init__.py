# AI Module for Buffr Host Hospitality Platform
# 
# This module contains AI-powered features including:
# - Conversational AI for guest messaging and 24/7 support
# - RAG-powered business insights and Q&A system
# - AI-powered cross-service recommendations
# - Intelligent loyalty campaign optimization

from .conversational_ai import ConversationalAI
from .rag_system import RAGSystem
from .recommendation_engine import (
    RecommendationEngine, 
    RecommendationRequest, 
    RecommendationResponse,
    Recommendation,
    GuestProfile,
    RecommendationType,
    ServiceCategory
)
from .loyalty_ai import LoyaltyAI

__all__ = [
    "ConversationalAI", 
    "RAGSystem",
    "RecommendationEngine",
    "RecommendationRequest",
    "RecommendationResponse", 
    "Recommendation",
    "GuestProfile",
    "RecommendationType",
    "ServiceCategory",
    "LoyaltyAI"
]
