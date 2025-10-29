"""
Buffr Host Agent - Main Pydantic AI Agent
Unified hospitality concierge agent with personality and tools
"""

import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime

from pydantic_ai import Agent, RunContext
from pydantic import BaseModel

from .personality import AgentPersonality, PersonalityManager, create_personality_manager
from .property_context import PropertyContext, PropertyContextService, create_property_context_service
from .tools import BuffrAgentTools, create_buffr_tools
from .models import (
    AgentDependencies, BookingRequest, RestaurantOrder, ServiceRequest,
    AgentResponse, InteractionMetadata, ToolResult
)


class BuffrHostAgent:
    """Main Buffr Host agent with personality and tools"""
    
    def __init__(self, neon_client, tenant_id: str, property_id: int, user_id: str):
        self.neon_client = neon_client
        self.tenant_id = tenant_id
        self.property_id = property_id
        self.user_id = user_id
        
        # Initialize services
        self.personality_manager = create_personality_manager(neon_client, tenant_id, property_id)
        self.property_context_service = create_property_context_service(neon_client)
        self.tools = create_buffr_tools(neon_client, tenant_id, property_id)
        
        # Agent state
        self.personality: Optional[AgentPersonality] = None
        self.property_context: Optional[PropertyContext] = None
        self.session_id: Optional[str] = None
        
        # Create Pydantic AI agent
        self.agent = Agent(
            'openai:gpt-4o',  # or 'deepseek:deepseek-chat'
            deps_type=AgentDependencies,
            system_prompt=self._generate_system_prompt
        )
        
        # Register tools
        self._register_tools()
    
    def _generate_system_prompt(self, ctx: RunContext[AgentDependencies]) -> str:
        """Generate personality-driven system prompt"""
        deps = ctx.deps
        personality = deps.personality
        property_context = deps.property_context
        
        style = personality.get('communication_style', 'professional and attentive')
        mood = personality.get('current_mood', 'professional')
        confidence = personality.get('confidence_level', 0.8)
        
        return f"""You are {personality.get('name', 'Sofia')}, a {personality.get('role', 'Professional Concierge')} for {property_context.get('property_name', 'our property')}.

PERSONALITY:
- You are {style}
- Current mood: {mood}
- Confidence level: {confidence:.1%}
- Core traits: {personality.get('traits', {})}

PROPERTY CONTEXT:
{property_context.get('formatted_context', 'Standard property information')}

CAPABILITIES:
- Make bookings (rooms, services, spa, tours, shuttle)
- Take restaurant orders with menu knowledge
- Calculate totals and process payments
- Answer questions about services, hours, policies
- Send confirmations via email
- Provide personalized recommendations

COMMUNICATION STYLE:
- Always be warm, professional, and attentive
- Anticipate guest needs and offer proactive suggestions
- Use the guest's name when available
- Be specific about times, prices, and policies
- Offer alternatives when something isn't available

TOOLS AVAILABLE:
- create_booking: For room, spa, tour, shuttle bookings
- place_restaurant_order: For food and beverage orders
- calculate_cost: For price calculations with taxes
- check_availability: For service and room availability
- get_service_info: For detailed service information
- send_confirmation: For booking and order confirmations

Always be proactive and anticipate guest needs. If you're unsure about something, ask clarifying questions rather than making assumptions."""

    def _register_tools(self):
        """Register all agent tools"""
        
        @self.agent.tool
        async def create_booking(
            ctx: RunContext[AgentDependencies],
            booking_type: str,
            guest_name: str,
            date: str,
            time: Optional[str] = None,
            service_name: Optional[str] = None,
            special_requests: Optional[str] = None,
            party_size: int = 1
        ) -> Dict:
            """Create a booking for room, service, spa, tour, shuttle, etc"""
            try:
                booking_request = BookingRequest(
                    booking_type=booking_type,
                    guest_name=guest_name,
                    date=datetime.strptime(date, "%Y-%m-%d").date(),
                    time=datetime.strptime(time, "%H:%M").time() if time else None,
                    service_name=service_name,
                    special_requests=special_requests,
                    party_size=party_size
                )
                
                result = await self.tools.create_booking(booking_request)
                return result.dict()
                
            except Exception as e:
                return {"success": False, "error": str(e)}
        
        @self.agent.tool
        async def place_restaurant_order(
            ctx: RunContext[AgentDependencies],
            items: List[Dict[str, Any]],
            table_number: Optional[int] = None,
            delivery_room: Optional[str] = None,
            special_instructions: Optional[str] = None
        ) -> Dict:
            """Place an order from the restaurant menu"""
            try:
                from .models import OrderItem
                
                order_items = [OrderItem(**item) for item in items]
                order = RestaurantOrder(
                    items=order_items,
                    table_number=table_number,
                    delivery_room=delivery_room,
                    special_instructions=special_instructions
                )
                
                result = await self.tools.place_restaurant_order(order)
                return result.dict()
                
            except Exception as e:
                return {"success": False, "error": str(e)}
        
        @self.agent.tool
        async def calculate_cost(
            ctx: RunContext[AgentDependencies],
            items: List[Dict],
            apply_taxes: bool = True,
            apply_service_charge: bool = True
        ) -> Dict:
            """Calculate total cost with taxes and fees"""
            try:
                result = await self.tools.calculate_cost(items, apply_taxes, apply_service_charge)
                return result.dict()
                
            except Exception as e:
                return {"success": False, "error": str(e)}
        
        @self.agent.tool
        async def check_availability(
            ctx: RunContext[AgentDependencies],
            service_type: str,
            date: str,
            time: Optional[str] = None
        ) -> Dict:
            """Check availability for a service or room"""
            try:
                from datetime import datetime
                
                date_obj = datetime.strptime(date, "%Y-%m-%d").date()
                time_obj = datetime.strptime(time, "%H:%M").time() if time else None
                
                result = await self.tools.check_availability(service_type, date_obj, time_obj)
                return result.dict()
                
            except Exception as e:
                return {"success": False, "error": str(e)}
        
        @self.agent.tool
        async def get_service_info(
            ctx: RunContext[AgentDependencies],
            service_type: str,
            service_name: Optional[str] = None
        ) -> Dict:
            """Get information about available services"""
            try:
                result = await self.tools.get_service_info(service_type, service_name)
                return result.dict()
                
            except Exception as e:
                return {"success": False, "error": str(e)}
        
        @self.agent.tool
        async def send_confirmation(
            ctx: RunContext[AgentDependencies],
            confirmation_type: str,
            recipient_email: str,
            recipient_name: str,
            subject: str,
            content: str
        ) -> Dict:
            """Send confirmation email for booking or order"""
            try:
                confirmation_data = {
                    "email": recipient_email,
                    "name": recipient_name,
                    "subject": subject,
                    "content": content
                }
                
                result = await self.tools.send_confirmation(confirmation_type, confirmation_data)
                return result.dict()
                
            except Exception as e:
                return {"success": False, "error": str(e)}
    
    async def initialize(self, session_id: Optional[str] = None):
        """Initialize agent with personality and property context"""
        self.session_id = session_id or f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Load personality
        self.personality = await self.personality_manager.load_personality("buffr_concierge")
        
        # Load property context
        self.property_context = await self.property_context_service.load_property_context(self.property_id)
        
        print(f"Agent initialized for property {self.property_id} with personality {self.personality.name}")
    
    async def chat(self, message: str, user_id: Optional[str] = None) -> AgentResponse:
        """Main chat method with personality integration"""
        if not self.personality or not self.property_context:
            await self.initialize()
        
        # Create dependencies
        deps = AgentDependencies(
            tenant_id=self.tenant_id,
            user_id=user_id or self.user_id,
            property_id=self.property_id,
            property_context={
                "property_name": self.property_context.property_name,
                "formatted_context": self.property_context_service.format_for_prompt(self.property_context)
            },
            personality=self.personality.get_personality_summary(),
            mem0_service=None,  # Will be injected if needed
            session_id=self.session_id
        )
        
        try:
            # Run agent with context
            result = await self.agent.run_sync(message, deps=deps)
            
            # Extract response
            response_text = result.data if hasattr(result, 'data') else str(result)
            
            # Create interaction metadata
            interaction_metadata = InteractionMetadata(
                interaction_id=f"int_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                user_id=user_id or self.user_id,
                tenant_id=self.tenant_id,
                property_id=self.property_id,
                timestamp=datetime.now(),
                interaction_type="chat",
                success=True,
                complexity=0.5,  # Could be calculated based on message complexity
                sentiment="neutral"
            )
            
            # Update personality based on interaction
            await self.personality_manager.update_personality(
                self.personality, 
                {
                    "success": True,
                    "complexity": interaction_metadata.complexity,
                    "sentiment": interaction_metadata.sentiment
                }
            )
            
            return AgentResponse(
                message=response_text,
                personality_state=self.personality.get_personality_summary(),
                suggested_actions=[],
                requires_follow_up=False,
                confidence_score=self.personality.confidence_level,
                response_type="text"
            )
            
        except Exception as e:
            print(f"Error in agent chat: {e}")
            
            # Update personality with failure
            await self.personality_manager.update_personality(
                self.personality,
                {
                    "success": False,
                    "complexity": 0.8,
                    "sentiment": "negative"
                }
            )
            
            return AgentResponse(
                message="I apologize, but I encountered an error. Please try again or contact our staff for assistance.",
                personality_state=self.personality.get_personality_summary(),
                suggested_actions=["Contact staff", "Try again"],
                requires_follow_up=True,
                confidence_score=0.3,
                response_type="text"
            )
    
    async def get_health_status(self) -> Dict[str, Any]:
        """Get agent health status"""
        return {
            "status": "healthy" if self.personality and self.property_context else "initializing",
            "personality_loaded": self.personality is not None,
            "property_context_loaded": self.property_context is not None,
            "memory_service_available": True,  # Mem0 integration
            "tools_available": [
                "create_booking", "place_restaurant_order", "calculate_cost",
                "check_availability", "get_service_info", "send_confirmation"
            ],
            "last_interaction": datetime.now().isoformat(),
            "uptime_seconds": 0.0,  # Could track actual uptime
            "error_count": 0,
            "success_rate": self.personality.successful_interactions / max(self.personality.total_interactions, 1) if self.personality else 0.0
        }
    
    async def get_personality_analytics(self) -> Dict[str, Any]:
        """Get personality analytics and insights"""
        return await self.personality_manager.get_personality_analytics("buffr_concierge")
    
    def clear_cache(self):
        """Clear all caches"""
        self.personality_manager.clear_cache()
        self.property_context_service.clear_cache(self.property_id)


# Factory function for creating agent
def create_buffr_agent(neon_client, tenant_id: str, property_id: int, user_id: str) -> BuffrHostAgent:
    """Create a new Buffr Host agent instance"""
    return BuffrHostAgent(neon_client, tenant_id, property_id, user_id)
