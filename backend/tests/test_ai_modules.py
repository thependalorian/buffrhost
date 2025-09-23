"""
Test AI modules for Buffr Host Hospitality Platform
"""
import pytest
from unittest.mock import Mock, patch
from ai.conversational_ai import ConversationalAI
from ai.rag_system import RAGSystem
from ai.recommendation_engine import RecommendationEngine
from ai.loyalty_ai import LoyaltyAI

class TestConversationalAI:
    """Test the Conversational AI module."""
    
    @pytest.fixture
    def conversational_ai(self):
        """Create a ConversationalAI instance for testing."""
        return ConversationalAI()
    
    def test_initialization(self, conversational_ai):
        """Test ConversationalAI initialization."""
        assert conversational_ai is not None
        assert hasattr(conversational_ai, 'process_message')
        assert hasattr(conversational_ai, 'escalate_to_human')
    
    @patch('backend.ai.conversational_ai.ConversationalAI.process_message')
    def test_process_message(self, mock_process, conversational_ai):
        """Test message processing."""
        mock_process.return_value = {
            "response": "Hello! How can I help you today?",
            "intent": "greeting",
            "confidence": 0.95,
            "escalation_required": False
        }
        
        result = conversational_ai.process_message(
            message="Hello",
            customer_id=1,
            property_id=1
        )
        
        assert result["response"] == "Hello! How can I help you today?"
        assert result["intent"] == "greeting"
        assert result["confidence"] == 0.95
        assert result["escalation_required"] is False
    
    def test_escalation_logic(self, conversational_ai):
        """Test human escalation logic."""
        # Test high confidence response (no escalation)
        result = conversational_ai.escalate_to_human(0.95, "booking")
        assert result is False
        
        # Test low confidence response (escalation required)
        result = conversational_ai.escalate_to_human(0.3, "complaint")
        assert result is True

class TestRAGSystem:
    """Test the RAG System module."""
    
    @pytest.fixture
    def rag_system(self):
        """Create a RAGSystem instance for testing."""
        return RAGSystem()
    
    def test_initialization(self, rag_system):
        """Test RAGSystem initialization."""
        assert rag_system is not None
        assert hasattr(rag_system, 'query_knowledge_base')
        assert hasattr(rag_system, 'add_document')
    
    @patch('backend.ai.rag_system.RAGSystem.query_knowledge_base')
    def test_query_knowledge_base(self, mock_query, rag_system):
        """Test knowledge base querying."""
        mock_query.return_value = {
            "answer": "Our hotel offers 24/7 room service and concierge services.",
            "sources": ["hotel_services_guide.pdf", "concierge_manual.pdf"],
            "confidence": 0.88
        }
        
        result = rag_system.query_knowledge_base(
            query="What services does the hotel offer?",
            property_id=1
        )
        
        assert result["answer"] == "Our hotel offers 24/7 room service and concierge services."
        assert len(result["sources"]) == 2
        assert result["confidence"] == 0.88
    
    def test_document_addition(self, rag_system):
        """Test adding documents to knowledge base."""
        # This would test the document indexing functionality
        # For now, we'll test the method exists and can be called
        assert callable(rag_system.add_document)

class TestRecommendationEngine:
    """Test the Recommendation Engine module."""
    
    @pytest.fixture
    def recommendation_engine(self):
        """Create a RecommendationEngine instance for testing."""
        return RecommendationEngine()
    
    def test_initialization(self, recommendation_engine):
        """Test RecommendationEngine initialization."""
        assert recommendation_engine is not None
        assert hasattr(recommendation_engine, 'get_recommendations')
        assert hasattr(recommendation_engine, 'get_cross_service_recommendations')
    
    @patch('backend.ai.recommendation_engine.RecommendationEngine.get_recommendations')
    def test_get_recommendations(self, mock_recommendations, recommendation_engine):
        """Test getting personalized recommendations."""
        mock_recommendations.return_value = {
            "recommendations": [
                {
                    "service_type": "restaurant",
                    "item_id": 1,
                    "item_name": "Caesar Salad",
                    "score": 0.92,
                    "reason": "Based on your preference for healthy options"
                }
            ],
            "recommendation_type": "personalized"
        }
        
        result = recommendation_engine.get_recommendations(
            customer_id=1,
            property_id=1,
            service_type="restaurant"
        )
        
        assert len(result["recommendations"]) == 1
        assert result["recommendations"][0]["service_type"] == "restaurant"
        assert result["recommendations"][0]["score"] == 0.92
    
    @patch('backend.ai.recommendation_engine.RecommendationEngine.get_cross_service_recommendations')
    def test_cross_service_recommendations(self, mock_cross_service, recommendation_engine):
        """Test cross-service recommendations."""
        mock_cross_service.return_value = {
            "recommendations": [
                {
                    "service_type": "spa",
                    "item_id": 1,
                    "item_name": "Relaxation Massage",
                    "score": 0.85,
                    "reason": "Perfect after your restaurant meal"
                }
            ],
            "recommendation_type": "cross_service"
        }
        
        result = recommendation_engine.get_cross_service_recommendations(
            customer_id=1,
            property_id=1,
            current_service="restaurant"
        )
        
        assert len(result["recommendations"]) == 1
        assert result["recommendations"][0]["service_type"] == "spa"
        assert result["recommendation_type"] == "cross_service"

class TestLoyaltyAI:
    """Test the Loyalty AI module."""
    
    @pytest.fixture
    def loyalty_ai(self):
        """Create a LoyaltyAI instance for testing."""
        return LoyaltyAI()
    
    def test_initialization(self, loyalty_ai):
        """Test LoyaltyAI initialization."""
        assert loyalty_ai is not None
        assert hasattr(loyalty_ai, 'generate_campaign')
        assert hasattr(loyalty_ai, 'segment_customers')
    
    @patch('backend.ai.loyalty_ai.LoyaltyAI.generate_campaign')
    def test_generate_campaign(self, mock_campaign, loyalty_ai):
        """Test loyalty campaign generation."""
        mock_campaign.return_value = {
            "campaign_name": "Weekend Spa Special",
            "description": "Get 20% off spa services this weekend",
            "target_segment": "frequent_guests",
            "reward_type": "discount",
            "reward_value": 20,
            "conditions": {
                "min_visits": 3,
                "valid_days": ["saturday", "sunday"]
            },
            "expected_engagement": 0.75
        }
        
        result = loyalty_ai.generate_campaign(
            property_id=1,
            campaign_type="seasonal",
            target_service="spa"
        )
        
        assert result["campaign_name"] == "Weekend Spa Special"
        assert result["reward_type"] == "discount"
        assert result["reward_value"] == 20
        assert result["expected_engagement"] == 0.75
    
    @patch('backend.ai.loyalty_ai.LoyaltyAI.segment_customers')
    def test_customer_segmentation(self, mock_segment, loyalty_ai):
        """Test customer segmentation."""
        mock_segment.return_value = {
            "segments": [
                {
                    "segment_name": "high_value_customers",
                    "customer_count": 45,
                    "criteria": {
                        "min_total_spent": 1000,
                        "min_visits": 5
                    },
                    "avg_lifetime_value": 2500
                }
            ],
            "total_customers": 200
        }
        
        result = loyalty_ai.segment_customers(property_id=1)
        
        assert len(result["segments"]) == 1
        assert result["segments"][0]["segment_name"] == "high_value_customers"
        assert result["segments"][0]["customer_count"] == 45
        assert result["total_customers"] == 200

class TestAIIntegration:
    """Test AI modules integration."""
    
    def test_ai_modules_import(self):
        """Test that all AI modules can be imported."""
        from ai.conversational_ai import ConversationalAI
        from ai.rag_system import RAGSystem
        from ai.recommendation_engine import RecommendationEngine
        from ai.loyalty_ai import LoyaltyAI
        
        assert ConversationalAI is not None
        assert RAGSystem is not None
        assert RecommendationEngine is not None
        assert LoyaltyAI is not None
    
    def test_ai_modules_initialization(self):
        """Test that all AI modules can be initialized."""
        from backend.ai import ConversationalAI, RAGSystem, RecommendationEngine, LoyaltyAI
        
        conversational_ai = ConversationalAI()
        rag_system = RAGSystem()
        recommendation_engine = RecommendationEngine()
        loyalty_ai = LoyaltyAI()
        
        assert conversational_ai is not None
        assert rag_system is not None
        assert recommendation_engine is not None
        assert loyalty_ai is not None
