"""
Etuna Demo AI Assistant API Routes

This module provides AI-powered guest assistance for the Etuna Guesthouse demo,
using DeepSeek API and the website as a knowledge base for realistic simulations.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging
import os
import json
import requests
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()

class EtunaChatRequest(BaseModel):
    message: str
    user_id: str = "etuna_guest"
    property_id: int = 1
    context: Optional[Dict[str, Any]] = None

class EtunaChatResponse(BaseModel):
    response: str
    suggestions: Optional[list] = None
    requires_action: bool = False
    action_type: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class EtunaDemoAI:
    """
    AI Assistant for Etuna Guesthouse Demo using DeepSeek API
    """
    
    def __init__(self):
        self.deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")
        self.base_url = "https://api.deepseek.com/v1"
        self.website_knowledge_base = self._load_website_knowledge()
        
    def _load_website_knowledge(self) -> Dict[str, Any]:
        """Load website knowledge base for realistic simulations"""
        return {
            "property_info": {
                "name": "Etuna Guesthouse & Tours",
                "location": "5544 Valley Street, Ongwediva, Namibia",
                "phone": "+264 65 231 177",
                "email": "bookings@etunaguesthouse.com",
                "website": "http://www.etunaguesthouse.com",
                "rooms": 35,
                "services": ["accommodation", "restaurant", "tours", "spa", "conference"]
            },
            "room_types": [
                {"name": "Standard Room", "price": 450, "capacity": 2},
                {"name": "Deluxe Room", "price": 650, "capacity": 2},
                {"name": "Family Suite", "price": 850, "capacity": 4},
                {"name": "Executive Suite", "price": 1200, "capacity": 2}
            ],
            "restaurant_menu": {
                "breakfast": ["Continental Breakfast", "Full English", "Namibian Special"],
                "lunch": ["Grilled Fish", "Beef Steak", "Vegetarian Options"],
                "dinner": ["Traditional Braai", "Seafood Platter", "International Cuisine"]
            },
            "tours": [
                {"name": "Cultural Village Tour", "duration": "4 hours", "price": 350},
                {"name": "Wildlife Safari", "duration": "6 hours", "price": 500},
                {"name": "City Walking Tour", "duration": "2 hours", "price": 150}
            ],
            "pricing": {
                "currency": "NAD",
                "tax_rate": 0.15,
                "service_charge": 0.10
            },
            "booking_policies": {
                "cancellation": "Free cancellation 24 hours before arrival",
                "check_in": "14:00",
                "check_out": "11:00",
                "payment": "Credit cards, cash, bank transfer accepted"
            }
        }
    
    async def process_message(self, request: EtunaChatRequest) -> EtunaChatResponse:
        """Process guest message with DeepSeek AI and website knowledge"""
        try:
            # Prepare the system prompt with website knowledge
            system_prompt = self._create_system_prompt(request.context)
            
            # Prepare the user message with context
            user_message = self._enhance_user_message(request.message, request.context)
            
            # Call DeepSeek API
            response = await self._call_deepseek_api(system_prompt, user_message)
            
            # Process response for demo purposes
            processed_response = self._process_response_for_demo(response, request.message)
            
            return EtunaChatResponse(
                response=processed_response["response"],
                suggestions=processed_response.get("suggestions"),
                requires_action=processed_response.get("requires_action", False),
                action_type=processed_response.get("action_type"),
                metadata=processed_response.get("metadata")
            )
            
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            return EtunaChatResponse(
                response="I apologize, but I'm experiencing technical difficulties. Please contact our front desk at +264 65 231 177 for immediate assistance.",
                requires_action=True,
                action_type="contact_staff"
            )
    
    def _create_system_prompt(self, context: Optional[Dict[str, Any]]) -> str:
        """Create system prompt with website knowledge base"""
        knowledge = self.website_knowledge_base
        
        return f"""You are the AI assistant for Etuna Guesthouse & Tours, powered by Buffr Host. You have access to our complete knowledge base and can help with all aspects of guest service.

PROPERTY INFORMATION:
- Name: {knowledge['property_info']['name']}
- Location: {knowledge['property_info']['location']}
- Phone: {knowledge['property_info']['phone']}
- Email: {knowledge['property_info']['email']}
- Rooms: {knowledge['property_info']['rooms']} rooms available
- Services: {', '.join(knowledge['property_info']['services'])}

ROOM TYPES & PRICING:
{self._format_room_types(knowledge['room_types'])}

RESTAURANT & DINING:
{self._format_restaurant_info(knowledge['restaurant_menu'])}

TOURS & ACTIVITIES:
{self._format_tours_info(knowledge['tours'])}

BOOKING POLICIES:
- Cancellation: {knowledge['booking_policies']['cancellation']}
- Check-in: {knowledge['booking_policies']['check_in']}
- Check-out: {knowledge['booking_policies']['check_out']}
- Payment: {knowledge['booking_policies']['payment']}

DEMO SIMULATION MODE:
You are in demo mode for potential customers. Be helpful and realistic in your responses. You can:
1. Provide detailed quotations for bookings
2. Explain how to sign up for full platform features
3. Simulate booking processes
4. Provide realistic pricing and availability
5. Guide users through the platform features

Always be professional, helpful, and maintain the luxury hospitality standard. If you need to use tools or perform actions, do so appropriately. For complex requests, offer to connect them with our staff.
"""
    
    def _enhance_user_message(self, message: str, context: Optional[Dict[str, Any]]) -> str:
        """Enhance user message with context"""
        if context and context.get("simulation_mode"):
            return f"[DEMO MODE] {message}"
        return message
    
    async def _call_deepseek_api(self, system_prompt: str, user_message: str) -> str:
        """Call DeepSeek API with the message"""
        headers = {
            "Authorization": f"Bearer {self.deepseek_api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=30
            )
            response.raise_for_status()
            
            data = response.json()
            return data["choices"][0]["message"]["content"]
            
        except Exception as e:
            logger.error(f"DeepSeek API error: {e}")
            raise
    
    def _process_response_for_demo(self, response: str, original_message: str) -> Dict[str, Any]:
        """Process AI response for demo purposes"""
        suggestions = []
        requires_action = False
        action_type = None
        metadata = {}
        
        # Check for specific demo scenarios
        if "quote" in original_message.lower() or "quotation" in original_message.lower():
            suggestions = [
                "View detailed pricing",
                "Check availability",
                "Book now",
                "Contact sales team"
            ]
            requires_action = True
            action_type = "quotation"
            metadata = {"quote_requested": True}
            
        elif "book" in original_message.lower() or "reservation" in original_message.lower():
            suggestions = [
                "Select room type",
                "Choose dates",
                "Add services",
                "Proceed to payment"
            ]
            requires_action = True
            action_type = "booking"
            metadata = {"booking_initiated": True}
            
        elif "sign up" in original_message.lower() or "register" in original_message.lower():
            suggestions = [
                "Create account",
                "Choose plan",
                "Start free trial",
                "Contact sales"
            ]
            requires_action = True
            action_type = "registration"
            metadata = {"registration_requested": True}
        
        return {
            "response": response,
            "suggestions": suggestions if suggestions else None,
            "requires_action": requires_action,
            "action_type": action_type,
            "metadata": metadata
        }
    
    def _format_room_types(self, room_types: list) -> str:
        """Format room types for system prompt"""
        formatted = []
        for room in room_types:
            formatted.append(f"- {room['name']}: NAD {room['price']}/night (sleeps {room['capacity']})")
        return "\n".join(formatted)
    
    def _format_restaurant_info(self, menu: dict) -> str:
        """Format restaurant information for system prompt"""
        formatted = []
        for meal_type, items in menu.items():
            formatted.append(f"{meal_type.title()}: {', '.join(items)}")
        return "\n".join(formatted)
    
    def _format_tours_info(self, tours: list) -> str:
        """Format tours information for system prompt"""
        formatted = []
        for tour in tours:
            formatted.append(f"- {tour['name']}: {tour['duration']} - NAD {tour['price']}")
        return "\n".join(formatted)

# Initialize the AI instance
etuna_ai = EtunaDemoAI()

@router.post("/chat", response_model=EtunaChatResponse)
async def chat_with_etuna_ai(request: EtunaChatRequest):
    """Chat with Etuna AI assistant using DeepSeek and website knowledge base"""
    try:
        response = await etuna_ai.process_message(request)
        return response
        
    except Exception as e:
        logger.error(f"Error in Etuna AI chat: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to process message with AI assistant"
        )

@router.get("/knowledge")
async def get_knowledge_base():
    """Get the current knowledge base for debugging"""
    return {
        "property_info": etuna_ai.website_knowledge_base["property_info"],
        "room_types": etuna_ai.website_knowledge_base["room_types"],
        "tours": etuna_ai.website_knowledge_base["tours"]
    }
