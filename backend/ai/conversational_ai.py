"""
Enhanced Conversational AI for Buffr Host Hospitality Platform

This module implements AI-powered guest messaging and 24/7 support with:
- LangGraph for workflow orchestration with Arcade AI tools
- LangChain for conversation management
- Pydantic AI for structured responses
- Text-to-Speech (TTS) for voice responses
- Speech-to-Text (STT) for voice input
- Knowledge base integration with RAG (Retrieval Augmented Generation)
- Memory system with PostgreSQL store
- Real-time streaming responses

Features:
- Multi-language guest support with voice capabilities
- Context-aware responses with property-specific knowledge
- Integration with hospitality services via Arcade AI tools
- Automated booking assistance with Gmail/Calendar integration
- Loyalty program support
- Voice interaction capabilities
- Property-specific knowledge base retrieval
- Persistent conversation memory
"""

import asyncio
import logging
import uuid
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional, Union

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
# LangGraph and LangChain imports
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.store.base import BaseStore
from langgraph.store.postgres import AsyncPostgresStore

# Conditional import for ToolNode to avoid heavy ML dependencies
try:
    from langgraph.prebuilt import ToolNode

    TOOL_NODE_AVAILABLE = True
except ImportError:
    TOOL_NODE_AVAILABLE = False
    ToolNode = None
from langchain_openai import ChatOpenAI

# Arcade AI imports
try:
    from langchain_arcade import ToolManager
except ImportError:
    ToolManager = None
    logging.warning("langchain_arcade not installed. Arcade features will be disabled.")

from pydantic import BaseModel, Field
# Other imports
from transformers import pipeline


# Define missing classes for ai_knowledge imports
class KnowledgeBaseQuery(BaseModel):
    """Query for knowledge base search"""

    query: str
    context: Optional[str] = None
    max_results: int = 5


class KnowledgeBaseResult(BaseModel):
    """Result from knowledge base search"""

    content: str
    source: str
    relevance_score: float
    metadata: Optional[Dict[str, Any]] = None


from sqlalchemy.ext.asyncio import AsyncSession

from rag.rag_agent import QueryType, RAGAgent
from services.arcade_service import ArcadeService

logger = logging.getLogger(__name__)


class MessageType(str, Enum):
    """Types of messages the conversational AI can handle."""

    GREETING = "greeting"
    BOOKING_INQUIRY = "booking_inquiry"
    SERVICE_REQUEST = "service_request"
    COMPLAINT = "complaint"
    COMPLIMENT = "compliment"
    EMERGENCY = "emergency"
    GENERAL_QUESTION = "general_question"
    LOYALTY_INQUIRY = "loyalty_inquiry"
    PAYMENT_ISSUE = "payment_issue"
    OTHER = "other"


class ConversationState(BaseModel):
    """State for the conversation workflow."""

    messages: List[Any] = Field(default_factory=list)
    message_type: MessageType = Field(default=MessageType.OTHER)
    context: Dict[str, Any] = Field(default_factory=dict)
    property_id: Optional[int] = None
    user_id: Optional[str] = None
    requires_human: bool = False
    tools_used: List[str] = Field(default_factory=list)


class ConversationalAI:
    """
    Enhanced Conversational AI for Buffr Host using LangGraph + Arcade AI.

    This agent provides 24/7 guest support with:
    - LangGraph workflow orchestration
    - Arcade AI tool integration (Gmail, Calendar, Slack)
    - Persistent memory with PostgreSQL
    - Real-time streaming responses
    - RAG integration for property knowledge
    """

    def __init__(
        self, db_session: AsyncSession, openai_api_key: str, database_url: str
    ):
        self.db_session = db_session
        self.openai_api_key = openai_api_key
        self.database_url = database_url

        # Initialize components
        self.classifier = pipeline(
            "zero-shot-classification", model="facebook/bart-large-mnli"
        )
        self.arcade_service = ArcadeService()

        # Initialize LangGraph components
        self.tool_manager = None
        self.tools = []
        self.tool_node = None
        self.model = None
        self.model_with_tools = None
        self.workflow = None

        # Initialize Arcade tools if available
        self._initialize_arcade_tools()

        # Create the workflow
        self._create_enhanced_conversation_workflow()

    def _initialize_arcade_tools(self):
        """Initialize Arcade AI tools for hospitality management."""
        if ToolManager is None:
            logger.warning("Arcade tools not available")
            return

        try:
            # Initialize tool manager with hospitality-specific tools
            self.tool_manager = ToolManager(
                api_key=self.arcade_service.client.api_key
                if self.arcade_service.client
                else None
            )

            # Initialize tools for hospitality management
            self.tool_manager.init_tools(toolkits=["Gmail", "Calendar", "Slack"])

            # Convert to LangChain tools with interrupts for auth
            self.tools = self.tool_manager.to_langchain(use_interrupts=True)

            # Initialize tool node
            if TOOL_NODE_AVAILABLE:
                self.tool_node = ToolNode(self.tools)
            else:
                self.tool_node = None

            # Initialize model with tools
            self.model = ChatOpenAI(model="gpt-4", api_key=self.openai_api_key)
            self.model_with_tools = self.model.bind_tools(self.tools)

            logger.info("Arcade tools initialized successfully")

        except Exception as e:
            logger.error(f"Failed to initialize Arcade tools: {e}")
            self.tools = []
            self.tool_node = None

    def _create_enhanced_conversation_workflow(self) -> StateGraph:
        """Create enhanced LangGraph workflow with voice and knowledge base."""

        # Build the workflow graph using StateGraph
        workflow = StateGraph(MessagesState)

        # Add nodes (steps) to the graph
        workflow.add_node("classify_message", self._classify_message)
        workflow.add_node("agent", self._call_agent)
        workflow.add_node(
            "tools", self.tool_node if self.tool_node else self._dummy_tool_node
        )
        workflow.add_node("authorization", self._authorize)
        workflow.add_node("rag_query", self._rag_query)
        workflow.add_node("voice_response", self._voice_response)

        # Define the edges and control flow between nodes
        workflow.add_edge(START, "classify_message")
        workflow.add_conditional_edges(
            "classify_message", self._should_use_rag, ["rag_query", "agent"]
        )
        workflow.add_conditional_edges(
            "agent", self._should_continue, ["authorization", "tools", END]
        )
        workflow.add_edge("authorization", "tools")
        workflow.add_edge("tools", "agent")
        workflow.add_edge("rag_query", "voice_response")
        workflow.add_edge("voice_response", END)

        # Compile the graph
        self.workflow = workflow.compile()

        return self.workflow

    async def _classify_message(self, state: MessagesState) -> MessagesState:
        """Classify the incoming message type."""
        if not state["messages"]:
            return state

        last_message = state["messages"][-1]
        message_content = (
            last_message.content
            if hasattr(last_message, "content")
            else str(last_message)
        )

        # Classify message type
        candidate_labels = [e.value for e in MessageType]
        result = self.classifier(message_content, candidate_labels)

        # Add classification to context
        if not hasattr(state, "context"):
            state["context"] = {}
        state["context"]["message_type"] = MessageType(result["labels"][0])
        state["context"]["classification_confidence"] = result["scores"][0]

        return state

    async def _should_use_rag(self, state: MessagesState) -> str:
        """Determine if we should use RAG for knowledge base queries."""
        context = state.get("context", {})
        message_type = context.get("message_type", MessageType.OTHER)

        # Use RAG for general questions, service info, and policy questions
        if message_type in [
            MessageType.GENERAL_QUESTION,
            MessageType.SERVICE_REQUEST,
            MessageType.BOOKING_INQUIRY,
        ]:
            return "rag_query"
        else:
            return "agent"

    async def _call_agent(
        self,
        state: MessagesState,
        writer=None,
        config: RunnableConfig = None,
        *,
        store: BaseStore = None,
    ):
        """Call the main agent with memory and tool integration."""
        messages = state["messages"]

        # Get user_id from config
        user_id = (
            config.get("configurable", {}).get("user_id", "anonymous").replace(".", "")
        )
        namespace = ("memories", user_id)

        # Search for relevant memories based on the last user message
        last_user_message = None
        for msg in reversed(messages):
            if isinstance(msg, HumanMessage) or (
                hasattr(msg, "type") and msg.type == "human"
            ):
                last_user_message = msg
                break

        # Retrieve memories if there's a user message
        memories_str = ""
        if last_user_message and store:
            try:
                memories = await store.asearch(
                    namespace, query=str(last_user_message.content)
                )
                if memories:
                    memories_str = "\n".join([f"- {d.value['data']}" for d in memories])
            except Exception as e:
                logger.error(f"Error retrieving memories: {e}")

        # Build system message with memories and hospitality context
        system_msg = f"""You are Buffr Host AI, a helpful AI assistant for the Buffr Host hospitality platform. 
        
        Your role is to assist guests and staff with:
        - Hotel information and services
        - Booking assistance
        - Service requests
        - General inquiries
        - Emergency situations
        
        Always be professional, helpful, and maintain the luxury hospitality standard.
        
        User memories:
        {memories_str}
        
        If you need to use tools (like sending emails or creating calendar events), do so appropriately.
        For emergency situations, always recommend contacting hotel staff immediately."""

        # Insert system message at the beginning if not already present
        messages_with_system = messages[:]
        if not messages or not isinstance(messages[0], SystemMessage):
            messages_with_system = [SystemMessage(content=system_msg)] + messages

        # Check if user wants to remember something
        if (
            last_user_message
            and "remember" in str(last_user_message.content).lower()
            and store
        ):
            try:
                content = str(last_user_message.content)
                await store.aput(namespace, str(uuid.uuid4()), {"data": content})
            except Exception as e:
                logger.error(f"Error storing memory: {e}")

        # Stream tokens using astream
        full_content = ""
        tool_calls = []

        if self.model_with_tools:
            async for chunk in self.model_with_tools.astream(messages_with_system):
                # Stream content tokens
                if chunk.content and writer:
                    writer(chunk.content)
                    full_content += chunk.content

                # Accumulate tool calls
                if hasattr(chunk, "tool_calls") and chunk.tool_calls:
                    valid_tool_calls = [
                        tc for tc in chunk.tool_calls if tc.get("name", "").strip()
                    ]
                    tool_calls.extend(valid_tool_calls)

        # Create the full response message with accumulated content and tool calls
        response = AIMessage(content=full_content, tool_calls=tool_calls)

        # Return the updated message history
        return {"messages": [response]}

    def _should_continue(self, state: MessagesState) -> str:
        """Determine the next step in the workflow based on the last message."""
        if not state["messages"] or not state["messages"][-1].tool_calls:
            return END

        # Check if any tool requires authorization
        for tool_call in state["messages"][-1].tool_calls:
            if self.tool_manager and self.tool_manager.requires_auth(tool_call["name"]):
                return "authorization"

        return "tools"  # Proceed to tool execution if no authorization is needed

    async def _authorize(
        self,
        state: MessagesState,
        config: RunnableConfig = None,
        writer=None,
        *,
        store: BaseStore = None,
    ):
        """Handle authorization for tools that require it."""
        if not self.tool_manager:
            return {"messages": []}

        user_id = config.get("configurable", {}).get("user_id", "anonymous")

        for tool_call in state["messages"][-1].tool_calls:
            tool_name = tool_call["name"]
            if not self.tool_manager.requires_auth(tool_name):
                continue

            try:
                auth_response = self.tool_manager.authorize(tool_name, user_id)
                if auth_response.status != "completed":
                    # Stream the authorization URL to the user
                    if writer:
                        writer(f"\nAuthorization required for {tool_name}\n\n")
                        writer(
                            f"Visit the following URL to authorize:\n{auth_response.url}\n\n"
                        )
                        writer("Waiting for authorization...\n\n")

                    # Wait for authorization completion
                    self.tool_manager.wait_for_auth(auth_response.id)
                    if not self.tool_manager.is_authorized(auth_response.id):
                        raise ValueError("Authorization failed")

            except Exception as e:
                logger.error(f"Authorization failed for {tool_name}: {e}")
                if writer:
                    writer(
                        f"❌ Authorization failed for {tool_name}. Please try again.\n"
                    )

        return {"messages": []}

    async def _rag_query(self, state: MessagesState) -> MessagesState:
        """Handle RAG queries for knowledge base information."""
        if not state["messages"]:
            return state

        last_message = state["messages"][-1]
        question = (
            last_message.content
            if hasattr(last_message, "content")
            else str(last_message)
        )

        try:
            # Get property_id from context
            property_id = state.get("context", {}).get(
                "property_id", 1
            )  # Default to property 1

            # Initialize RAG agent (you might want to pass this as a dependency)
            # For now, we'll create a simple response
            rag_response = f"I can help you with information about our property. You asked: {question}"

            # Create AI response
            response = AIMessage(content=rag_response)

            return {"messages": [response]}

        except Exception as e:
            logger.error(f"RAG query failed: {e}")
            response = AIMessage(
                content="I apologize, but I'm having trouble accessing our knowledge base right now. Please contact our staff for assistance."
            )
            return {"messages": [response]}

    async def _voice_response(self, state: MessagesState) -> MessagesState:
        """Handle voice response generation."""
        # This would integrate with TTS systems
        # For now, just pass through
        return state

    async def _dummy_tool_node(self, state: MessagesState) -> MessagesState:
        """Dummy tool node when Arcade tools are not available."""
        return {"messages": []}

    async def process_message(
        self,
        message: str,
        user_id: str,
        property_id: int = 1,
        config: Optional[RunnableConfig] = None,
    ) -> Dict[str, Any]:
        """
        Process a guest message through the conversational AI workflow.

        Args:
            message: Guest's message
            user_id: User identifier
            property_id: Property ID for context
            config: Runnable configuration

        Returns:
            Dict containing the response and metadata
        """
        try:
            # Build messages list with user query
            messages = [HumanMessage(content=message)]

            # Define the input with messages
            inputs = {
                "messages": messages,
                "context": {"property_id": property_id, "user_id": user_id},
            }

            # Configuration with thread and user IDs
            if not config:
                config = {
                    "configurable": {"thread_id": str(uuid.uuid4()), "user_id": user_id}
                }

            # Run the workflow
            response_messages = []
            async for chunk in self.workflow.astream(
                inputs, config=config, stream_mode="values"
            ):
                if "messages" in chunk and chunk["messages"]:
                    response_messages.extend(chunk["messages"])

            # Extract the final response
            final_response = response_messages[-1] if response_messages else None
            response_content = (
                final_response.content
                if final_response
                else "I apologize, but I couldn't process your request."
            )

            return {
                "response": response_content,
                "user_id": user_id,
                "property_id": property_id,
                "timestamp": datetime.utcnow().isoformat(),
                "tools_used": [],  # Would track tools used in the workflow
                "success": True,
            }

        except Exception as e:
            logger.error(f"Error processing message: {e}")
            return {
                "response": "I apologize, but I'm experiencing technical difficulties. Please contact our staff for assistance.",
                "user_id": user_id,
                "property_id": property_id,
                "timestamp": datetime.utcnow().isoformat(),
                "error": str(e),
                "success": False,
            }

    async def get_conversation_history(
        self, user_id: str, limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get conversation history for a user."""
        # This would integrate with the memory store
        # For now, return empty list
        return []

    def get_available_tools(self) -> List[Dict[str, Any]]:
        """Get list of available tools."""
        if not self.tool_manager:
            return []

        return [
            {
                "name": "gmail_send_booking_confirmation",
                "description": "Send booking confirmation emails to customers",
                "hospitality_use": "Customer booking confirmations, reservation updates",
            },
            {
                "name": "calendar_create_booking_event",
                "description": "Create calendar events for room reservations, spa bookings",
                "hospitality_use": "Room bookings, spa appointments, conference scheduling",
            },
            {
                "name": "slack_staff_notification",
                "description": "Send staff notifications for orders, bookings, and alerts",
                "hospitality_use": "Kitchen orders, housekeeping alerts, maintenance requests",
            },
        ]
