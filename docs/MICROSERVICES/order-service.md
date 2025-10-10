# Order Service

**Status: Implemented (Production Ready)**

## 1. Overview

The Order Service is a comprehensive service for managing the entire lifecycle of customer orders. It is built with FastAPI and uses Supabase for its database.

## 2. Features

-   **Order Creation**: Creates complex orders with multiple items, modifiers, and special instructions.
-   **Status Management**: Manages the order lifecycle with a state machine for statuses (e.g., `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`).
-   **Totals Calculation**: Automatically calculates subtotals, taxes, and grand totals.
-   **Filtering & Listing**: Provides endpoints to list and filter orders by status, customer, or property.
-   **Role-Based Access**: Secures endpoints based on user roles (e.g., staff, manager).
-   **Analytics**: Includes a summary endpoint for basic order analytics.
-   **Order History**: Maintains a history of status changes for each order.

## 3. API Endpoints

*   `POST /orders`: Create a new order.
*   `GET /orders/{order_id}`: Get details for a specific order.
*   `GET /orders`: List and filter all orders.
*   `PUT /orders/{order_id}/status`: Update the status of an order.
*   `POST /orders/{order_id}/cancel`: Cancel an order.
*   `GET /orders/{order_id}/status-history`: Retrieve the status history for an order.
*   `GET /orders/customer/{customer_id}`: Get all orders for a specific customer.
*   `GET /orders/property/{property_id}`: Get all orders for a specific property.
*   `GET /orders/analytics/summary`: Get a summary of order analytics.
*   `GET /health`: Health check endpoint.

*(Note: A detailed OpenAPI specification is available at the service's `/docs` endpoint when running.)*

## 4. Database Schema

-   **Database**: Supabase (PostgreSQL)
-   **Key Tables**:
    -   `orders`: Stores the main details for each order, including calculated totals and customer information.
    -   `order_status_history`: Provides an audit trail of all status changes for an order.

## 5. Key Dependencies

-   `fastapi`: Web framework
-   `supabase`: Database client
-   `pyjwt`: JSON Web Token implementation
-   `pydantic`: Data validation

