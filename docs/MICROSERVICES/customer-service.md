# Customer Service

**Status: Implemented (Production Ready)**

## 1. Overview

The Customer Service is a comprehensive service for managing customer profiles, preferences, and loyalty programs. It is built with FastAPI and uses Supabase for its database.

## 2. Features

- **Full CRUD for Customers**: Create, retrieve, update, and manage customer profiles.
- **Loyalty Program Management**: Includes endpoints for earning and redeeming loyalty points, and for calculating loyalty tiers.
- **Detailed Profiles**: Manages customer contact info, addresses, and personal preferences (e.g., dietary restrictions).
- **Filtering and Searching**: Provides endpoints to list and search customers with various filters.
- **Role-Based Access**: Secures endpoints based on user roles.
- **Analytics**: Includes a summary endpoint for basic customer and loyalty analytics.

## 3. API Endpoints

- `POST /customers`: Create a new customer.
- `GET /customers/{customer_id}`: Get details for a specific customer.
- `GET /customers`: List and search for customers.
- `PUT /customers/{customer_id}`: Update a customer's profile.
- `POST /customers/{customer_id}/loyalty/earn`: Add loyalty points for a customer.
- `POST /customers/{customer_id}/loyalty/redeem`: Redeem loyalty points for a customer.
- `GET /customers/{customer_id}/loyalty/transactions`: Get a customer's loyalty transaction history.
- `GET /customers/analytics/summary`: Get a summary of customer analytics.
- `GET /health`: Health check endpoint.

_(Note: A detailed OpenAPI specification is available at the service's `/docs` endpoint when running.)_

## 4. Database Schema

- **Database**: Supabase (PostgreSQL)
- **Key Tables**:
  - `customers`: Stores the main details for each customer, including contact info, preferences, and loyalty data.
  - `loyalty_transactions`: Provides an audit trail of all loyalty point transactions.

## 5. Key Dependencies

- `fastapi`: Web framework
- `supabase`: Database client
- `pyjwt`: JSON Web Token implementation
- `pydantic`: Data validation
