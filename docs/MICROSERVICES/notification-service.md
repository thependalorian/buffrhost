# Notification Service

**Status: Basic Implementation (Integrations Missing)**

## 1. Overview

The Notification Service is responsible for sending communications to users via multiple channels. The current implementation is a basic placeholder and does not integrate with actual delivery providers.

## 2. Responsibilities

- **Notification Sending (Placeholder)**: Provides an endpoint to send notifications. **This does not currently send real emails, SMS, or push notifications.**
- **Channel Management**: Designed to manage different communication channels (Email, SMS, Push).

## 3. API Endpoints

- `POST /api/notifications/send`: Send a notification (currently logs to console).

_(Note: A detailed OpenAPI specification is available at the service's `/docs` endpoint.)_

## 4. Database Schema

- **Database**: Supabase (PostgreSQL)
- **Key Tables**:
  - `notifications`: Stores a log of all sent notifications, their channel, and status.
  - `notification_templates`: Intended to store templates for different types of communications.

## 5. Configuration

| Environment Variable | Description                            | Example                          |
| -------------------- | -------------------------------------- | -------------------------------- |
| `DATABASE_URL`       | Connection string for the Supabase DB. | `postgresql://user:pass@host/db` |
