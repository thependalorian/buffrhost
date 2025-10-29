"""
Buffr Host Agent Configuration with Mem0 and Neon DB Integration

This module provides the main agent configuration for the Buffr Host platform,
integrating Mem0 for persistent memory, Arcade AI for tool integration,
and Neon DB for data storage with multi-tenant isolation.
"""

import asyncio
import logging
import os
from datetime import datetime
from typing import Any, Dict, List, Optional

from config import settings

logger = logging.getLogger(__name__)


class BuffrAgentConfig:
    """
    Configuration class for Buffr Host AI Agent with Mem0 and Neon DB integration.
    
    This configuration manages:
    - Mem0 memory integration with Neon DB
    - Arcade AI tool configuration
    - Multi-tenant isolation
    - Deepseek LLM integration
    - Agent memory and conversation management
    """
    
    def __init__(self):
        """Initialize the agent configuration."""
        self.tenant_id = None
        self.user_id = None
        self.property_id = None
        
        # Mem0 Configuration
        self.mem0_config = {
            "llm": {
                "provider": "deepseek",
                "model": "deepseek-chat",
                "api_key": os.getenv("DEEPSEEK_API_KEY"),
                "base_url": "https://api.deepseek.com"
            },
            "vector_store": {
                "provider": "neon",
                "connection_string": os.getenv("NEON_DATABASE_URL"),
                "table_name": "agent_memories"
            },
            "embedder": {
                "provider": "openai",
                "model": "text-embedding-3-small",
                "api_key": os.getenv("OPENAI_API_KEY")
            }
        }
        
        # Arcade AI Configuration
        self.arcade_config = {
            "available_tools": [
                "gmail_send_booking_confirmation",
                "calendar_create_booking_event", 
                "slack_staff_notification",
                "notion_create_guest_profile",
                "gmail_send_marketing_campaign",
                "calendar_schedule_staff_shift"
            ],
            "hospitality_scopes": {
                "gmail": ["https://www.googleapis.com/auth/gmail.send"],
                "calendar": ["https://www.googleapis.com/auth/calendar"],
                "slack": ["chat:write", "channels:read"],
                "notion": ["write"]
            }
        }
        
        # Neon DB Configuration
        self.neon_config = {
            "connection_string": os.getenv("NEON_DATABASE_URL"),
            "pool_size": 10,
            "max_overflow": 20,
            "pool_timeout": 30,
            "pool_recycle": 3600
        }
        
        # Agent Behavior Configuration
        self.agent_behavior = {
            "max_memory_entries": 1000,
            "memory_retention_days": 365,
            "conversation_timeout": 1800,  # 30 minutes
            "max_tool_calls_per_message": 5,
            "enable_voice_responses": True,
            "enable_streaming": True
        }
        
        # Multi-tenant Configuration
        self.tenant_config = {
            "isolation_level": "strict",  # strict, moderate, permissive
            "shared_memory": False,
            "cross_tenant_tools": False,
            "tenant_specific_models": True
        }
    
    def set_context(self, tenant_id: str, user_id: str, property_id: int = None):
        """Set the current context for the agent."""
        self.tenant_id = tenant_id
        self.user_id = user_id
        self.property_id = property_id
        
        # Update Mem0 config with tenant isolation
        self.mem0_config["vector_store"]["tenant_id"] = tenant_id
        self.mem0_config["vector_store"]["user_namespace"] = f"{tenant_id}::{user_id}"
        
        logger.info(f"Agent context set: tenant={tenant_id}, user={user_id}, property={property_id}")
    
    def get_mem0_config(self) -> Dict[str, Any]:
        """Get Mem0 configuration for the current context."""
        if not self.tenant_id or not self.user_id:
            raise ValueError("Agent context not set. Call set_context() first.")
        
        return {
            **self.mem0_config,
            "tenant_id": self.tenant_id,
            "user_id": self.user_id,
            "property_id": self.property_id
        }
    
    def get_arcade_tools(self) -> List[Dict[str, Any]]:
        """Get available Arcade tools for the current context."""
        base_tools = [
            {
                "name": "gmail_send_booking_confirmation",
                "description": "Send booking confirmation emails to customers",
                "provider": "google",
                "scopes": self.arcade_config["hospitality_scopes"]["gmail"],
                "hospitality_use": "Customer booking confirmations, reservation updates",
                "requires_auth": True
            },
            {
                "name": "calendar_create_booking_event",
                "description": "Create calendar events for room reservations, spa bookings",
                "provider": "google", 
                "scopes": self.arcade_config["hospitality_scopes"]["calendar"],
                "hospitality_use": "Room bookings, spa appointments, conference scheduling",
                "requires_auth": True
            },
            {
                "name": "slack_staff_notification",
                "description": "Send staff notifications for orders, bookings, and alerts",
                "provider": "slack",
                "scopes": self.arcade_config["hospitality_scopes"]["slack"],
                "hospitality_use": "Kitchen orders, housekeeping alerts, maintenance requests",
                "requires_auth": True
            },
            {
                "name": "notion_create_guest_profile",
                "description": "Create guest profiles and notes in Notion",
                "provider": "notion",
                "scopes": self.arcade_config["hospitality_scopes"]["notion"],
                "hospitality_use": "Guest preferences, special requests, loyalty tracking",
                "requires_auth": True
            }
        ]
        
        # Add tenant-specific tools if configured
        if self.tenant_config["tenant_specific_models"]:
            base_tools.extend([
                {
                    "name": "gmail_send_marketing_campaign",
                    "description": "Send marketing emails to loyalty program members",
                    "provider": "google",
                    "scopes": self.arcade_config["hospitality_scopes"]["gmail"],
                    "hospitality_use": "Promotional campaigns, loyalty rewards, special offers",
                    "requires_auth": True,
                    "tenant_specific": True
                },
                {
                    "name": "calendar_schedule_staff_shift",
                    "description": "Schedule staff shifts and manage work schedules",
                    "provider": "google",
                    "scopes": self.arcade_config["hospitality_scopes"]["calendar"],
                    "hospitality_use": "Staff scheduling, shift management, availability tracking",
                    "requires_auth": True,
                    "tenant_specific": True
                }
            ])
        
        return base_tools
    
    def get_system_prompt(self) -> str:
        """Get the system prompt for the agent based on current context."""
        if not self.tenant_id or not self.user_id:
            raise ValueError("Agent context not set. Call set_context() first.")
        
        base_prompt = f"""You are Buffr Host AI, a sophisticated AI assistant for the Buffr Host hospitality platform.

Your role is to assist guests and staff with:
- Hotel information and services
- Booking assistance and confirmations
- Service requests and special accommodations
- General inquiries and support
- Emergency situations and urgent requests

Current Context:
- Tenant ID: {self.tenant_id}
- User ID: {self.user_id}
- Property ID: {self.property_id}

Capabilities:
- Persistent memory using Mem0 with Neon DB
- Arcade AI tool integration (Gmail, Calendar, Slack, Notion)
- Multi-tenant isolation and security
- Real-time streaming responses
- Voice interaction support

Always be professional, helpful, and maintain the luxury hospitality standard.
Use your memory to provide personalized service and remember guest preferences.
When using tools, ensure proper authorization and tenant isolation."""

        return base_prompt
    
    def get_memory_config(self) -> Dict[str, Any]:
        """Get memory configuration for Mem0 integration."""
        return {
            "max_entries": self.agent_behavior["max_memory_entries"],
            "retention_days": self.agent_behavior["memory_retention_days"],
            "tenant_isolation": self.tenant_config["isolation_level"],
            "shared_memory": self.tenant_config["shared_memory"],
            "vector_search": True,
            "similarity_threshold": 0.7
        }
    
    def validate_config(self) -> bool:
        """Validate the agent configuration."""
        required_env_vars = [
            "DEEPSEEK_API_KEY",
            "OPENAI_API_KEY", 
            "NEON_DATABASE_URL"
        ]
        
        missing_vars = [var for var in required_env_vars if not os.getenv(var)]
        
        if missing_vars:
            logger.error(f"Missing required environment variables: {missing_vars}")
            return False
        
        if not self.tenant_id or not self.user_id:
            logger.error("Agent context not set")
            return False
        
        return True
    
    def get_health_status(self) -> Dict[str, Any]:
        """Get the health status of the agent configuration."""
        return {
            "config_valid": self.validate_config(),
            "tenant_id": self.tenant_id,
            "user_id": self.user_id,
            "property_id": self.property_id,
            "mem0_configured": bool(self.mem0_config.get("llm", {}).get("api_key")),
            "arcade_tools_count": len(self.get_arcade_tools()),
            "neon_configured": bool(self.neon_config.get("connection_string")),
            "timestamp": datetime.utcnow().isoformat()
        }


# Global agent configuration instance
agent_config = BuffrAgentConfig()


def get_agent_config() -> BuffrAgentConfig:
    """Get the global agent configuration instance."""
    return agent_config


async def initialize_agent_config(tenant_id: str, user_id: str, property_id: int = None):
    """Initialize the agent configuration with context."""
    config = get_agent_config()
    config.set_context(tenant_id, user_id, property_id)
    
    if not config.validate_config():
        raise ValueError("Agent configuration validation failed")
    
    logger.info(f"Agent configuration initialized for tenant={tenant_id}, user={user_id}")
    return config
