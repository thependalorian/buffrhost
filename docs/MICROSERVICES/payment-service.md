# Payment Service

**Status: Implemented (Production Ready)**

## 1. Overview

The Payment Service is a comprehensive service for processing payments, handling refunds, and managing transactions. It is built with FastAPI and integrates with Stripe and PayPal.

## 2. Features

- **Multi-Gateway Integration**: Supports payment processing through both Stripe and PayPal.
- **Payment Creation**: Creates and processes charges associated with an order.
- **Refunds**: Manages full or partial refunds for transactions.
- **Webhook Handling**: Includes an endpoint to receive and process webhooks from Stripe for payment status updates.
- **Card Validation**: Includes a Luhn algorithm check for validating card numbers.
- **Role-Based Access**: Secures endpoints based on user roles.
- **Analytics**: Provides a summary endpoint for payment analytics.

## 3. API Endpoints

- `POST /payments`: Create a new payment and process it through a selected gateway.
- `GET /payments/{payment_id}`: Get details for a specific payment.
- `POST /payments/{payment_id}/confirm`: Confirm a payment (e.g., for manual or callback-based flows).
- `POST /payments/{payment_id}/refund`: Create a refund for a payment.
- `GET /payments`: List and filter all payments.
- `GET /payments/analytics/summary`: Get a summary of payment analytics.
- `POST /webhooks/stripe`: Handle incoming webhook events from Stripe.
- `GET /health`: Health check endpoint.

_(Note: A detailed OpenAPI specification is available at the service's `/docs` endpoint when running.)_

## 4. Database Schema

- **Database**: Supabase (PostgreSQL)
- **Key Tables**:
  - `payments`: Stores a record of every payment, its status, and the gateway transaction ID.
  - `refunds`: Stores information about all refund transactions.

## 5. Key Dependencies

- `fastapi`: Web framework
- `supabase`: Database client
- `pyjwt`: JSON Web Token implementation
- `pydantic`: Data validation
- `httpx`: HTTP client for gateway communication
