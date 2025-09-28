"""
RAG Pipeline Example for Buffr Host Hospitality Platform

This example demonstrates how to use the RAG pipeline to manage
knowledge base and provide AI-powered responses.
"""

import asyncio
import logging
from typing import Any, Dict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def demonstrate_rag_pipeline():
    """Demonstrate the RAG pipeline functionality."""

    print("🏨 Buffr Host RAG Pipeline Demo")
    print("=" * 50)

    # Example 1: Adding Company Information
    print("\n1. Adding Company Information to Knowledge Base")
    print("-" * 45)

    company_info = """
    Buffr Host Hotel is a luxury boutique hotel located in the heart of Windhoek, Namibia.
    We offer 50 elegantly designed rooms, world-class dining, and exceptional service.
    
    Our amenities include:
    - 24/7 concierge service
    - Rooftop infinity pool
    - Spa and wellness center
    - Business center
    - Free WiFi throughout the property
    - Valet parking
    - Airport shuttle service
    
    Check-in time: 3:00 PM
    Check-out time: 11:00 AM
    
    Contact Information:
    Phone: +264 61 123 4567
    Email: info@theshandi.com
    Address: 123 Independence Avenue, Windhoek, Namibia
    """

    print("✅ Company information prepared for knowledge base")

    # Example 2: Adding Policies
    print("\n2. Adding Hotel Policies")
    print("-" * 25)

    cancellation_policy = """
    CANCELLATION POLICY:
    
    - Free cancellation up to 24 hours before check-in
    - Cancellations within 24 hours: 50% charge
    - No-show: Full charge
    - Group bookings (5+ rooms): 48-hour cancellation required
    
    REFUND POLICY:
    - Refunds processed within 5-7 business days
    - Refunds issued to original payment method
    - Processing fees may apply for international cards
    """

    print("✅ Cancellation policy prepared for knowledge base")

    # Example 3: Adding FAQ
    print("\n3. Adding Frequently Asked Questions")
    print("-" * 40)

    faq_content = """
    FREQUENTLY ASKED QUESTIONS:
    
    Q: What time is check-in and check-out?
    A: Check-in is at 3:00 PM and check-out is at 11:00 AM.
    
    Q: Do you offer airport shuttle service?
    A: Yes, we provide complimentary airport shuttle service. Please arrange in advance.
    
    Q: Is WiFi free?
    A: Yes, complimentary WiFi is available throughout the property.
    
    Q: Do you have a spa?
    A: Yes, we have a full-service spa and wellness center open daily from 6 AM to 10 PM.
    
    Q: What dining options are available?
    A: We have a fine dining restaurant, casual café, and 24/7 room service.
    
    Q: Is parking available?
    A: Yes, we offer valet parking service for all guests.
    """

    print("✅ FAQ content prepared for knowledge base")

    # Example 4: Simulating Guest Queries
    print("\n4. Simulating Guest Queries")
    print("-" * 30)

    guest_queries = [
        "What time is check-in?",
        "Do you have a spa?",
        "What is your cancellation policy?",
        "How can I contact the hotel?",
        "What amenities do you offer?",
        "Is WiFi free?",
        "Do you have airport shuttle service?",
        "What dining options are available?",
    ]

    print("Guest queries that would be processed:")
    for i, query in enumerate(guest_queries, 1):
        print(f"  {i}. {query}")

    # Example 5: Expected AI Responses
    print("\n5. Expected AI Agent Responses")
    print("-" * 35)

    sample_responses = {
        "What time is check-in?": {
            "answer": "Check-in time is 3:00 PM. If you need early check-in, please contact our front desk to check availability.",
            "confidence": 0.95,
            "sources": ["Company Information", "FAQ"],
            "query_type": "general_info",
        },
        "Do you have a spa?": {
            "answer": "Yes, we have a full-service spa and wellness center that is open daily from 6 AM to 10 PM. Our spa offers a variety of treatments and services.",
            "confidence": 0.90,
            "sources": ["Company Information", "FAQ"],
            "query_type": "service_info",
        },
        "What is your cancellation policy?": {
            "answer": "Our cancellation policy allows free cancellation up to 24 hours before check-in. Cancellations within 24 hours incur a 50% charge, and no-shows are charged the full amount.",
            "confidence": 0.95,
            "sources": ["Cancellation Policy"],
            "query_type": "policy_question",
        },
    }

    for query, response in sample_responses.items():
        print(f"\nQ: {query}")
        print(f"A: {response['answer']}")
        print(f"   Confidence: {response['confidence']}")
        print(f"   Sources: {', '.join(response['sources'])}")
        print(f"   Query Type: {response['query_type']}")

    # Example 6: Knowledge Base Analytics
    print("\n6. Knowledge Base Analytics")
    print("-" * 30)

    analytics = {
        "total_documents": 3,
        "document_types": {"company_info": 1, "policies": 1, "faq": 1},
        "total_queries_processed": 8,
        "average_confidence": 0.93,
        "most_common_query_types": ["general_info", "service_info", "policy_question"],
        "knowledge_gaps": [
            "Room service menu details",
            "Local attraction recommendations",
            "Transportation options",
        ],
    }

    print("📊 Knowledge Base Statistics:")
    print(f"   Total Documents: {analytics['total_documents']}")
    print(f"   Document Types: {analytics['document_types']}")
    print(f"   Queries Processed: {analytics['total_queries_processed']}")
    print(f"   Average Confidence: {analytics['average_confidence']}")
    print(f"   Knowledge Gaps: {len(analytics['knowledge_gaps'])} identified")

    # Example 7: Integration with AI Agents
    print("\n7. Integration with AI Agents")
    print("-" * 35)

    print("🤖 The RAG pipeline integrates with:")
    print("   • Conversational AI (Guest messaging)")
    print("   • Smart Concierge (Service assistance)")
    print("   • Booking Agent (Reservation help)")
    print("   • Customer Support (Staff assistance)")

    print("\n✨ Benefits:")
    print("   • Accurate, contextual responses")
    print("   • Consistent information across all touchpoints")
    print("   • Reduced staff workload")
    print("   • Improved guest satisfaction")
    print("   • 24/7 availability")

    print("\n🎯 Use Cases:")
    print("   • Guest inquiries about amenities")
    print("   • Policy questions and clarifications")
    print("   • Service information and booking help")
    print("   • Emergency procedure guidance")
    print("   • Staff training and reference")

    print("\n" + "=" * 50)
    print("🏁 RAG Pipeline Demo Complete!")
    print("The knowledge base is ready to power AI agents with")
    print("accurate, contextual information about your property.")


async def demonstrate_api_usage():
    """Demonstrate API usage for the RAG pipeline."""

    print("\n🌐 API Usage Examples")
    print("=" * 25)

    # Example API calls
    api_examples = [
        {
            "method": "POST",
            "endpoint": "/api/v1/knowledge/properties/1/documents",
            "description": "Add a new document to knowledge base",
            "payload": {
                "title": "Hotel Overview",
                "content": "Buffr Host Hotel is a luxury boutique hotel...",
                "document_type": "company_info",
                "tags": ["overview", "luxury"],
            },
        },
        {
            "method": "POST",
            "endpoint": "/api/v1/knowledge/properties/1/query",
            "description": "Query the knowledge base",
            "payload": {
                "question": "What amenities do you offer?",
                "context": {"user_type": "guest"},
            },
        },
        {
            "method": "POST",
            "endpoint": "/api/v1/knowledge/properties/1/search",
            "description": "Search documents",
            "payload": {
                "query": "spa services",
                "document_types": ["services"],
                "limit": 5,
            },
        },
    ]

    for example in api_examples:
        print(f"\n{example['method']} {example['endpoint']}")
        print(f"Description: {example['description']}")
        print(f"Payload: {example['payload']}")


if __name__ == "__main__":
    # Run the demonstration
    asyncio.run(demonstrate_rag_pipeline())
    asyncio.run(demonstrate_api_usage())
