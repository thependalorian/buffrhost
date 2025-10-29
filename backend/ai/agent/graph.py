"""
LangGraph Orchestration for Buffr Host Agent
Stateful workflow management for agent interactions
"""

from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from typing import TypedDict, Annotated, Dict, List, Any, Optional
import operator
from datetime import datetime

from .agent import BuffrHostAgent
from .personality import AgentPersonality
from .property_context import PropertyContext


class BuffrAgentState(TypedDict):
    """State for Buffr agent workflow"""
    messages: Annotated[List[Dict[str, str]], operator.add]
    property_context: Dict[str, Any]
    personality: Dict[str, Any]
    memories: List[Dict[str, Any]]
    interaction_metadata: Dict[str, Any]
    user_id: str
    tenant_id: str
    property_id: int
    session_id: str
    current_intent: Optional[str]
    pending_booking: Optional[Dict[str, Any]]
    pending_order: Optional[Dict[str, Any]]
    pending_service: Optional[Dict[str, Any]]
    response: Optional[str]
    requires_human: bool
    confidence_score: float


class BuffrAgentGraph:
    """LangGraph workflow for Buffr agent"""
    
    def __init__(self, neon_client, tenant_id: str, property_id: int):
        self.neon_client = neon_client
        self.tenant_id = tenant_id
        self.property_id = property_id
        self.agent: Optional[BuffrHostAgent] = None
        self.graph = None
        self._build_graph()
    
    def _build_graph(self):
        """Build the LangGraph workflow"""
        workflow = StateGraph(BuffrAgentState)
        
        # Add nodes
        workflow.add_node("load_context", self._load_context_node)
        workflow.add_node("load_memory", self._load_memory_node)
        workflow.add_node("classify_intent", self._classify_intent_node)
        workflow.add_node("call_agent", self._call_agent_node)
        workflow.add_node("update_personality", self._update_personality_node)
        workflow.add_node("save_memory", self._save_memory_node)
        workflow.add_node("generate_response", self._generate_response_node)
        
        # Add edges
        workflow.add_edge(START, "load_context")
        workflow.add_edge("load_context", "load_memory")
        workflow.add_edge("load_memory", "classify_intent")
        workflow.add_edge("classify_intent", "call_agent")
        workflow.add_edge("call_agent", "update_personality")
        workflow.add_edge("update_personality", "save_memory")
        workflow.add_edge("save_memory", "generate_response")
        workflow.add_edge("generate_response", END)
        
        # Compile with checkpointer
        memory = MemorySaver()
        self.graph = workflow.compile(checkpointer=memory)
    
    async def _load_context_node(self, state: BuffrAgentState) -> BuffrAgentState:
        """Load property context and personality"""
        try:
            if not self.agent:
                self.agent = BuffrHostAgent(
                    self.neon_client, 
                    state["tenant_id"], 
                    state["property_id"], 
                    state["user_id"]
                )
                await self.agent.initialize(state.get("session_id"))
            
            # Update state with context
            state["property_context"] = {
                "property_name": self.agent.property_context.property_name,
                "formatted_context": self.agent.property_context_service.format_for_prompt(self.agent.property_context)
            }
            
            state["personality"] = self.agent.personality.get_personality_summary()
            
        except Exception as e:
            print(f"Error loading context: {e}")
            state["property_context"] = {}
            state["personality"] = {}
        
        return state
    
    async def _load_memory_node(self, state: BuffrAgentState) -> BuffrAgentState:
        """Load relevant memories for context"""
        try:
            # Load memories from Mem0 or database
            # This would integrate with the memory service
            state["memories"] = []  # Placeholder for now
            
        except Exception as e:
            print(f"Error loading memory: {e}")
            state["memories"] = []
        
        return state
    
    async def _classify_intent_node(self, state: BuffrAgentState) -> BuffrAgentState:
        """Classify user intent from message"""
        try:
            if not state["messages"]:
                state["current_intent"] = "greeting"
                return state
            
            last_message = state["messages"][-1]["content"].lower()
            
            # Simple intent classification
            if any(word in last_message for word in ["book", "reservation", "room"]):
                state["current_intent"] = "booking"
            elif any(word in last_message for word in ["order", "food", "menu", "restaurant"]):
                state["current_intent"] = "ordering"
            elif any(word in last_message for word in ["spa", "massage", "treatment"]):
                state["current_intent"] = "spa_service"
            elif any(word in last_message for word in ["shuttle", "transport", "airport"]):
                state["current_intent"] = "transport"
            elif any(word in last_message for word in ["tour", "excursion", "activity"]):
                state["current_intent"] = "tour"
            elif any(word in last_message for word in ["price", "cost", "rate", "how much"]):
                state["current_intent"] = "pricing"
            elif any(word in last_message for word in ["available", "availability", "free"]):
                state["current_intent"] = "availability"
            else:
                state["current_intent"] = "general_inquiry"
            
        except Exception as e:
            print(f"Error classifying intent: {e}")
            state["current_intent"] = "general_inquiry"
        
        return state
    
    async def _call_agent_node(self, state: BuffrAgentState) -> BuffrAgentState:
        """Call the main agent with context"""
        try:
            if not self.agent:
                raise Exception("Agent not initialized")
            
            # Get last message
            last_message = state["messages"][-1]["content"] if state["messages"] else "Hello"
            
            # Call agent
            response = await self.agent.chat(last_message, state["user_id"])
            
            # Update state with response
            state["response"] = response.message
            state["confidence_score"] = response.confidence_score
            state["requires_human"] = response.requires_follow_up
            
        except Exception as e:
            print(f"Error calling agent: {e}")
            state["response"] = "I apologize, but I encountered an error. Please try again."
            state["confidence_score"] = 0.3
            state["requires_human"] = True
        
        return state
    
    async def _update_personality_node(self, state: BuffrAgentState) -> BuffrAgentState:
        """Update personality based on interaction"""
        try:
            if self.agent and self.agent.personality:
                # Update personality with interaction data
                interaction_data = {
                    "success": state["confidence_score"] > 0.7,
                    "complexity": 0.5,  # Could be calculated from message complexity
                    "sentiment": "positive" if state["confidence_score"] > 0.8 else "neutral"
                }
                
                await self.agent.personality_manager.update_personality(
                    self.agent.personality,
                    interaction_data,
                    critical=state["requires_human"]
                )
                
                # Update personality in state
                state["personality"] = self.agent.personality.get_personality_summary()
            
        except Exception as e:
            print(f"Error updating personality: {e}")
        
        return state
    
    async def _save_memory_node(self, state: BuffrAgentState) -> BuffrAgentState:
        """Save interaction to memory"""
        try:
            # Save interaction to memory service
            # This would integrate with Mem0
            interaction = {
                "timestamp": datetime.now().isoformat(),
                "user_id": state["user_id"],
                "message": state["messages"][-1]["content"] if state["messages"] else "",
                "response": state["response"],
                "intent": state["current_intent"],
                "confidence": state["confidence_score"]
            }
            
            state["memories"].append(interaction)
            
        except Exception as e:
            print(f"Error saving memory: {e}")
        
        return state
    
    async def _generate_response_node(self, state: BuffrAgentState) -> BuffrAgentState:
        """Generate final response with personality context"""
        try:
            # Add personality context to response
            personality = state.get("personality", {})
            communication_style = personality.get("communication_style", "professional and attentive")
            
            # Enhance response with personality
            if state["response"]:
                # Could add personality-specific enhancements here
                pass
            
        except Exception as e:
            print(f"Error generating response: {e}")
        
        return state
    
    async def run(self, message: str, user_id: str, session_id: Optional[str] = None) -> Dict[str, Any]:
        """Run the complete workflow"""
        try:
            # Initialize state
            initial_state = BuffrAgentState(
                messages=[{"role": "user", "content": message}],
                property_context={},
                personality={},
                memories=[],
                interaction_metadata={},
                user_id=user_id,
                tenant_id=self.tenant_id,
                property_id=self.property_id,
                session_id=session_id or f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                current_intent=None,
                pending_booking=None,
                pending_order=None,
                pending_service=None,
                response=None,
                requires_human=False,
                confidence_score=0.0
            )
            
            # Run workflow
            final_state = await self.graph.ainvoke(initial_state)
            
            return {
                "response": final_state["response"],
                "confidence_score": final_state["confidence_score"],
                "requires_human": final_state["requires_human"],
                "intent": final_state["current_intent"],
                "personality": final_state["personality"],
                "session_id": final_state["session_id"]
            }
            
        except Exception as e:
            print(f"Error running workflow: {e}")
            return {
                "response": "I apologize, but I encountered an error. Please try again.",
                "confidence_score": 0.0,
                "requires_human": True,
                "intent": "error",
                "personality": {},
                "session_id": session_id
            }
    
    async def get_health_status(self) -> Dict[str, Any]:
        """Get workflow health status"""
        if not self.agent:
            return {"status": "not_initialized"}
        
        return await self.agent.get_health_status()
    
    async def get_personality_analytics(self) -> Dict[str, Any]:
        """Get personality analytics"""
        if not self.agent:
            return {"error": "Agent not initialized"}
        
        return await self.agent.get_personality_analytics()


# Factory function for creating graph
def create_buffr_graph(neon_client, tenant_id: str, property_id: int) -> BuffrAgentGraph:
    """Create a new Buffr agent graph instance"""
    return BuffrAgentGraph(neon_client, tenant_id, property_id)


# Export the graph for LangGraph configuration
def buffr_graph(neon_client, tenant_id: str, property_id: int) -> BuffrAgentGraph:
    """Export function for LangGraph configuration"""
    return create_buffr_graph(neon_client, tenant_id, property_id)
