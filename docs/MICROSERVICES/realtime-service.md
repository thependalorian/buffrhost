# Realtime Service

**Status: Basic Implementation**

## 1. Overview

The Realtime Service provides real-time communication capabilities using WebSockets for features like live collaboration and notifications.

## 2. Responsibilities

- **WebSocket Connections**: Manages WebSocket connections from clients.
- **Message Broadcasting**: Broadcasts messages to connected clients in specific channels or rooms.
- **Collaboration**: Enables real-time features, such as multiple users editing a document simultaneously.

## 3. API Endpoints

- `WS /ws/{channel_id}`: The WebSocket endpoint for clients to connect to a specific channel.

_(Note: A detailed OpenAPI specification is available at the service's `/docs` endpoint.)_

## 4. Database Schema

- **Database**: Supabase (PostgreSQL) - Used for persisting messages or state if required.
- **Key Tables**:
  - `realtime_messages`: (Optional) Can be used to store a history of messages for later retrieval.

## 5. Configuration

| Environment Variable | Description                            | Example                          |
| -------------------- | -------------------------------------- | -------------------------------- |
| `DATABASE_URL`       | Connection string for the Supabase DB. | `postgresql://user:pass@host/db` |
