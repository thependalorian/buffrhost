"""
Buffr Host Agent with Memory - LangGraph + Arcade AI Implementation

This module demonstrates how to use the enhanced ConversationalAI with:
- LangGraph workflow orchestration
- Arcade AI tool integration
- PostgreSQL memory store
- Real-time streaming responses
- Hospitality-specific tool management

Based on the LangGraph + Arcade AI pattern for production-ready AI agents.
"""

import asyncio
import logging
import os
import sys
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
# LangGraph imports
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from langgraph.store.base import BaseStore
from langgraph.store.postgres import AsyncPostgresStore

from config import settings
from database import get_db

# Local imports
from .conversational_ai import ConversationalAI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BuffrHostAgent:
    """
    Buffr Host Agent with Memory - Production-ready AI agent for hospitality management.

    This agent combines:
    - LangGraph workflow orchestration
    - Arcade AI tool integration (Gmail, Calendar, Slack)
    - PostgreSQL memory store for persistent conversations
    - Real-time streaming responses
    - Hospitality-specific knowledge and tools
    """

    def __init__(self, database_url: str, openai_api_key: str):
        self.database_url = database_url
        self.openai_api_key = openai_api_key
        self.conversational_ai = None
        self.store = None
        self.checkpointer = None

    async def initialize(self):
        """Initialize the agent with database connections and memory store."""
        try:
            # Initialize PostgreSQL store and checkpointer
            self.store = AsyncPostgresStore.from_conn_string(self.database_url)
            self.checkpointer = AsyncPostgresSaver.from_conn_string(self.database_url)

            # Set up database tables (run once)
            # await self.checkpointer.setup()
            # await self.store.setup()

            # Initialize conversational AI
            async for db in get_db():
                self.conversational_ai = ConversationalAI(
                    db_session=db,
                    openai_api_key=self.openai_api_key,
                    database_url=self.database_url,
                )
                break

            logger.info("Buffr Host Agent initialized successfully")

        except Exception as e:
            logger.error(f"Failed to initialize Buffr Host Agent: {e}")
            raise

    async def process_guest_message(
        self, message: str, user_id: str, property_id: int = 1, stream_writer=None
    ) -> Dict[str, Any]:
        """
        Process a guest message with memory and tool integration.

        Args:
            message: Guest's message
            user_id: User identifier
            property_id: Property ID for context
            stream_writer: Optional function to stream responses

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

            # Configuration with thread and user IDs for authorization purposes
            config = {
                "configurable": {"thread_id": str(uuid.uuid4()), "user_id": user_id}
            }

            # Run the graph and stream the outputs
            response_messages = []
            async for chunk in self.conversational_ai.workflow.astream(
                inputs, config=config, stream_mode="values"
            ):
                if "messages" in chunk and chunk["messages"]:
                    response_messages.extend(chunk["messages"])

                    # Stream the response if writer is provided
                    if stream_writer and chunk["messages"]:
                        last_message = chunk["messages"][-1]
                        if hasattr(last_message, "content") and last_message.content:
                            stream_writer(last_message.content)

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
                "success": True,
            }

        except Exception as e:
            logger.error(f"Error processing guest message: {e}")
            return {
                "response": "I apologize, but I'm experiencing technical difficulties. Please contact our staff for assistance.",
                "user_id": user_id,
                "property_id": property_id,
                "timestamp": datetime.utcnow().isoformat(),
                "error": str(e),
                "success": False,
            }

    async def send_booking_confirmation(
        self, user_id: str, booking_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Send booking confirmation using Arcade AI tools.

        Args:
            user_id: User ID for authentication
            booking_data: Booking information

        Returns:
            Dict containing the result
        """
        try:
            if not self.conversational_ai.arcade_service.is_available:
                return {"success": False, "error": "Arcade service not available"}

            # Use the Arcade service to send booking confirmation
            result = (
                await self.conversational_ai.arcade_service.send_booking_confirmation(
                    user_id=user_id, booking_data=booking_data
                )
            )

            return {
                "success": True,
                "result": result,
                "message": "Booking confirmation sent successfully",
            }

        except Exception as e:
            logger.error(f"Failed to send booking confirmation: {e}")
            return {"success": False, "error": str(e)}

    async def create_calendar_event(
        self, user_id: str, event_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Create calendar event using Arcade AI tools.

        Args:
            user_id: User ID for authentication
            event_data: Event information

        Returns:
            Dict containing the result
        """
        try:
            if not self.conversational_ai.arcade_service.is_available:
                return {"success": False, "error": "Arcade service not available"}

            # Use the Arcade service to create calendar event
            result = await self.conversational_ai.arcade_service.create_booking_calendar_event(
                user_id=user_id, booking_details=event_data
            )

            return {
                "success": True,
                "result": result,
                "message": "Calendar event created successfully",
            }

        except Exception as e:
            logger.error(f"Failed to create calendar event: {e}")
            return {"success": False, "error": str(e)}

    async def send_staff_notification(
        self, user_id: str, notification_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Send staff notification using Arcade AI tools.

        Args:
            user_id: User ID for authentication
            notification_data: Notification information

        Returns:
            Dict containing the result
        """
        try:
            if not self.conversational_ai.arcade_service.is_available:
                return {"success": False, "error": "Arcade service not available"}

            # Use the Arcade service to send staff notification
            result = (
                await self.conversational_ai.arcade_service.send_staff_notification(
                    user_id=user_id,
                    staff_member=notification_data.get("staff_member", "Staff"),
                    message=notification_data.get("message", ""),
                    channel=notification_data.get("channel"),
                )
            )

            return {
                "success": True,
                "result": result,
                "message": "Staff notification sent successfully",
            }

        except Exception as e:
            logger.error(f"Failed to send staff notification: {e}")
            return {"success": False, "error": str(e)}

    async def get_conversation_memories(
        self, user_id: str, query: str = ""
    ) -> List[Dict[str, Any]]:
        """
        Get conversation memories for a user.

        Args:
            user_id: User identifier
            query: Optional search query

        Returns:
            List of memories
        """
        try:
            if not self.store:
                return []

            namespace = ("memories", user_id.replace(".", ""))

            if query:
                memories = await self.store.asearch(namespace, query=query)
                return [{"data": d.value["data"], "id": d.key} for d in memories]
            else:
                # Get all memories (this would need pagination in production)
                memories = await self.store.asearch(namespace, query="*")
                return [{"data": d.value["data"], "id": d.key} for d in memories]

        except Exception as e:
            logger.error(f"Error retrieving memories: {e}")
            return []

    async def store_memory(self, user_id: str, content: str) -> bool:
        """
        Store a memory for a user.

        Args:
            user_id: User identifier
            content: Memory content

        Returns:
            Success status
        """
        try:
            if not self.store:
                return False

            namespace = ("memories", user_id.replace(".", ""))
            await self.store.aput(namespace, str(uuid.uuid4()), {"data": content})
            return True

        except Exception as e:
            logger.error(f"Error storing memory: {e}")
            return False

    def get_available_tools(self) -> List[Dict[str, Any]]:
        """Get list of available tools."""
        return (
            self.conversational_ai.get_available_tools()
            if self.conversational_ai
            else []
        )

    async def health_check(self) -> Dict[str, Any]:
        """Get agent health status."""
        return {
            "status": "healthy" if self.conversational_ai else "unhealthy",
            "arcade_available": self.conversational_ai.arcade_service.is_available
            if self.conversational_ai
            else False,
            "store_available": self.store is not None,
            "checkpointer_available": self.checkpointer is not None,
            "timestamp": datetime.utcnow().isoformat(),
        }


# Global agent instance
buffr_agent = None


async def get_buffr_agent() -> BuffrHostAgent:
    """Get or create the global Buffr Host agent instance."""
    global buffr_agent

    if buffr_agent is None:
        buffr_agent = BuffrHostAgent(
            database_url=settings.DATABASE_URL, openai_api_key=settings.OPENAI_API_KEY
        )
        await buffr_agent.initialize()

    return buffr_agent


async def main():
    """Main function to demonstrate the Buffr Host Agent."""

    print("Buffr Host Agent with Memory Demo")
    print("=" * 50)

    try:
        # Initialize the agent
        agent = await get_buffr_agent()

        # Health check
        health = await agent.health_check()
        print(f"Agent Status: {health['status']}")
        print(f"Arcade Available: {health['arcade_available']}")
        print(f"Memory Store: {health['store_available']}")

        # Example 1: Process a guest message
        print("\n1. Processing Guest Message")
        print("-" * 30)

        guest_message = "Hi, I'd like to book a spa appointment for tomorrow afternoon. Also, remember that I prefer the deep tissue massage."

        def stream_writer(content):
            print(content, end="", flush=True)

        result = await agent.process_guest_message(
            message=guest_message,
            user_id="guest@example.com",
            property_id=1,
            stream_writer=stream_writer,
        )

        print(f"\n\nResponse: {result['response']}")
        print(f"Success: {result['success']}")

        # Example 2: Store a memory
        print("\n2. Storing Memory")
        print("-" * 20)

        memory_stored = await agent.store_memory(
            user_id="guest@example.com",
            content="Guest prefers deep tissue massage for spa appointments",
        )
        print(f"Memory stored: {memory_stored}")

        # Example 3: Retrieve memories
        print("\n3. Retrieving Memories")
        print("-" * 25)

        memories = await agent.get_conversation_memories(
            user_id="guest@example.com", query="spa massage"
        )

        for memory in memories:
            print(f"Memory: {memory['data']}")

        # Example 4: Send booking confirmation (if Arcade is available)
        print("\n4. Sending Booking Confirmation")
        print("-" * 35)

        if health["arcade_available"]:
            booking_data = {
                "customer_name": "John Doe",
                "customer_email": "john@example.com",
                "service_type": "Spa Appointment",
                "property_name": "Buffr Host Hotel",
                "booking_id": "SPA-001",
                "booking_date": "2024-01-15",
                "booking_time": "2:00 PM",
                "duration": "90 minutes",
                "special_requests": "Deep tissue massage preferred",
            }

            confirmation_result = await agent.send_booking_confirmation(
                user_id="staff@buffr.ai", booking_data=booking_data
            )

            print(f"Confirmation sent: {confirmation_result['success']}")
            if confirmation_result["success"]:
                print(f"Message: {confirmation_result['message']}")
        else:
            print("Arcade service not available - skipping booking confirmation")

        # Example 5: Available tools
        print("\n5. Available Tools")
        print("-" * 20)

        tools = agent.get_available_tools()
        for tool in tools:
            print(f"• {tool['name']}: {tool['description']}")

        print("\n" + "=" * 50)
        print("Buffr Host Agent Demo Complete!")
        print("The agent is ready to handle guest interactions with")
        print("memory, tool integration, and real-time responses.")

    except Exception as e:
        logger.error(f"Demo failed: {e}")
        print(f"❌ Demo failed: {e}")


if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    asyncio.run(main())
