# Buffr Host API Specification

> **Note:** This API is currently under active development. Some endpoints may not be fully functional or may be subject to change.

## Overview

The Buffr Host API is a RESTful service built with FastAPI that provides comprehensive hospitality ecosystem management functionality. This document outlines all available endpoints, request/response formats, and authentication requirements for managing restaurants, hotels, spas, conference facilities, transportation services, and all hospitality amenities.

## Base URL

```
Production: https://api.buffr.ai/v1
Development: http://localhost:8000/v1
Subdomain: https://host.buffr.ai/api/v1
```

## Authentication

All API endpoints require authentication using JWT tokens, except for public endpoints like login and registration.

---

## Arcade MCP Integration

**Status:** Implemented

The Buffr Host platform integrates with Arcade's MCP (Model Context Protocol) tools to enable AI agents to perform authenticated actions like sending emails, managing calendars, and interacting with external APIs.

### Arcade Service Status

#### Get Arcade Service Status

```http
GET /api/v1/arcade/status
```

**Response:**
```json
{
  "success": true,
  "status": {
    "available": true,
    "client_initialized": true,
    "sdk_version": "arcade-ai>=0.1.0",
    "hospitality_tools": 6,
    "last_check": "2024-01-01T00:00:00Z"
  },
  "message": "Arcade service status retrieved successfully"
}
```

### Available Tools

#### Get Available Arcade Tools

```http
GET /api/v1/arcade/tools
```

**Response:**
```json
{
  "success": true,
  "tools": [
    {
      "name": "gmail_send_booking_confirmation",
      "description": "Send booking confirmation emails to customers",
      "provider": "google",
      "scopes": ["https://www.googleapis.com/auth/gmail.send"],
      "hospitality_use": "Customer booking confirmations, reservation updates"
    },
    {
      "name": "calendar_create_booking_event",
      "description": "Create calendar events for room reservations, spa bookings, conference rooms",
      "provider": "google",
      "scopes": ["https://www.googleapis.com/auth/calendar"],
      "hospitality_use": "Room bookings, spa appointments, conference scheduling"
    },
    {
      "name": "slack_staff_notification",
      "description": "Send staff notifications for orders, bookings, and alerts",
      "provider": "slack",
      "scopes": ["chat:write", "channels:read"],
      "hospitality_use": "Kitchen orders, housekeeping alerts, maintenance requests"
    }
  ],
  "count": 6,
  "message": "Available tools retrieved successfully"
}
```

### Hospitality-Specific Endpoints

#### Send Booking Confirmation

```http
POST /api/v1/arcade/hospitality/booking-confirmation
```

**Request Body:**
```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "service_type": "Room Reservation",
  "property_name": "Buffr Host Hotel",
  "booking_id": "BH-2024-001",
  "booking_date": "2024-01-15",
  "booking_time": "14:00",
  "duration": "2 nights",
  "special_requests": "High floor, city view"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "tool_name": "gmail_send_booking_confirmation",
    "user_id": "user123",
    "status": "executed",
    "result": "Tool gmail_send_booking_confirmation executed successfully",
    "executed_at": "2024-01-01T00:00:00Z"
  },
  "message": "Booking confirmation email sent successfully"
}
```

#### Create Staff Schedule Event

```http
POST /api/v1/arcade/hospitality/staff-schedule
```

**Request Body:**
```json
{
  "staff_name": "Jane Smith",
  "staff_email": "jane@buffr.ai",
  "shift_type": "Morning Shift",
  "department": "Housekeeping",
  "role": "Supervisor",
  "start_time": "2024-01-15T08:00:00Z",
  "end_time": "2024-01-15T16:00:00Z",
  "timezone": "UTC",
  "notes": "Training new staff member"
}
```

#### Send Kitchen Order Notification

```http
POST /api/v1/arcade/hospitality/kitchen-order
```

**Request Body:**
```json
{
  "order_id": "ORD-2024-001",
  "table_number": "12",
  "items": [
    {
      "name": "Grilled Salmon",
      "quantity": 2
    },
    {
      "name": "Caesar Salad",
      "quantity": 1
    }
  ],
  "special_instructions": "Salmon medium-rare, no croutons on salad"
}
```

---

## Hospitality Services Management

### Spa Services

**Status:** Implemented

#### Get Spa Services

```http
GET /properties/{property_id}/spa/services
```

#### Get Spa Appointments

```http
GET /properties/{property_id}/spa/appointments
```

#### Create Spa Appointment

```http
POST /properties/{property_id}/spa/appointments
```

#### Get Spa Therapists

```http
GET /properties/{property_id}/spa/therapists
```

### Conference Services

**Status:** Implemented

#### Get Conference Rooms

```http
GET /properties/{property_id}/conference/rooms
```

#### Get Conference Bookings

```http
GET /properties/{property_id}/conference/bookings
```

#### Create Conference Booking

```http
POST /properties/{property_id}/conference/bookings
```

### Transportation Services

**Status:** Implemented

#### Get Transportation Services

```http
GET /properties/{property_id}/transportation/services
```

#### Get Transportation Bookings

```http
GET /properties/{property_id}/transportation/bookings
```

#### Create Transportation Booking

```http
POST /properties/{property_id}/transportation/bookings
```

#### Get Transportation Vehicles

```http
GET /properties/{property_id}/transportation/vehicles
```

---

## Loyalty Management

**Status:** Implemented

### Get Loyalty Members

```http
GET /properties/{property_id}/loyalty/members
```

### Get Loyalty Member Details

```http
GET /properties/{property_id}/loyalty/members/{customer_id}
```

### Earn Loyalty Points

```http
POST /properties/{property_id}/loyalty/earn-points
```

### Redeem Loyalty Points

```http
POST /properties/{property_id}/loyalty/redeem-points
```

### Get Loyalty Campaigns

```http
GET /properties/{property_id}/loyalty/campaigns
```

### Create Loyalty Campaign

```http
POST /properties/{property_id}/loyalty/campaigns
```

---

## AI & Machine Learning

**Status:** Implemented

### Recommendation Engine

#### Get Recommendations

```http
POST /api/v1/ai/recommendations
```

**Request Body:**
```json
{
  "customer_id": 123,
  "property_id": 456,
  "service_type": "restaurant",
  "context": {
    "time_of_day": "dinner",
    "party_size": 2,
    "preferences": ["vegetarian", "spicy"]
  },
  "limit": 10
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "service_id": 789,
      "service_name": "Grilled Salmon",
      "service_type": "restaurant",
      "confidence_score": 0.95,
      "reasoning": "Based on your preference for healthy options and previous orders",
      "price": 45.00,
      "rating": 4.8,
      "popularity_score": 0.87
    }
  ],
  "model_metrics": {
    "random_forest_r2": 0.89,
    "gradient_boosting_r2": 0.91,
    "cross_validation_score": 0.88
  }
}
```

#### Train ML Models

```http
POST /api/v1/ai/train-models
```

**Response:**
```json
{
  "success": true,
  "training_results": {
    "models_trained": ["random_forest", "gradient_boosting", "linear_regression", "kmeans"],
    "feature_count": 20,
    "training_samples": 1500,
    "evaluation_metrics": {
      "random_forest": {
        "mse": 0.12,
        "rmse": 0.35,
        "r2": 0.89,
        "cv_mean": 0.88,
        "cv_std": 0.02
      }
    },
    "feature_importance": [
      {"feature": "normalized_rating", "importance": 0.23},
      {"feature": "popularity", "importance": 0.19}
    ]
  }
}
```

### Buffr Host Agent

#### Chat with AI Agent

```http
POST /api/v1/agent/chat
```

**Request Body:**
```json
{
  "message": "I need help with a customer complaint about room service",
  "customer_id": 123,
  "property_id": 456,
  "context": {
    "session_id": "session_789",
    "user_role": "manager"
  }
}
```

**Response:**
```json
{
  "success": true,
  "response": "I can help you with that customer complaint. Let me check the room service records and provide you with the best resolution approach.",
  "tools_used": ["gmail_send_follow_up", "calendar_schedule_meeting"],
  "session_id": "session_789",
  "memory_updated": true
}
```

#### Get Agent Tools

```http
GET /api/v1/agent/tools
```

**Response:**
```json
{
  "success": true,
  "available_tools": [
    {
      "name": "gmail_send_booking_confirmation",
      "description": "Send booking confirmation emails",
      "provider": "google",
      "authorized": true
    },
    {
      "name": "calendar_create_booking_event",
      "description": "Create calendar events for bookings",
      "provider": "google",
      "authorized": true
    }
  ]
}
```

---

## Order Management

**Status:** Implemented

### Create Order

```http
POST /properties/{property_id}/orders
```

---

## Analytics & Reporting

**Status:** Implemented

### Get Inventory Analytics

```http
GET /properties/{property_id}/analytics/inventory
```

### Get Customer Analytics

```http
GET /properties/{property_id}/customers/{customer_id}/analytics
```

### Get Property Statistics

```http
GET /properties/{property_id}/statistics
```

---

## User Management

**Status:** Implemented

### Forgot Password

```http
POST /auth/forgot-password
```

### Reset Password

```http
POST /auth/reset-password
```
