# API Endpoints Overview

**Status: High-Level Summary (Based on Design)**

This document provides a high-level overview of the primary API endpoints for the Buffr Host microservices. The API Gateway at `/` is the single entry point for all client requests.

--- 

### Auth Service (`/api/auth`)

-   `POST /register`: Register a new user.
-   `POST /login`: Authenticate a user and receive JWT tokens.
-   `POST /refresh`: Refresh an expired access token.
-   `GET /profile`: Retrieve the current user's profile.

### Property Service (`/api/properties`)

-   `GET /`: Retrieve a list of all properties.
-   `POST /`: Create a new property.
-   `GET /{id}`: Get details for a specific property.
-   `PUT /{id}`: Update a specific property.

### Menu Service (`/api/menus`)

-   `GET /`: Retrieve all menus for a property.
-   `POST /`: Create a new menu.
-   `GET /{id}`: Get details for a specific menu.
-   `POST /{id}/items`: Add a new item to a menu.

### Inventory Service (`/api/inventory`)

-   `GET /items`: Retrieve a list of all inventory items.
-   `POST /items`: Add a new item to the inventory.
-   `GET /suppliers`: List all suppliers.
-   `POST /orders`: Create a new purchase order.

### Customer Service (`/api/customers`)

-   `GET /`: Retrieve a list of all customers.
-   `POST /`: Create a new customer profile.
-   `GET /{id}`: Get details for a specific customer.

### Order Service (`/api/orders`)

-   `POST /`: Create a new order.
-   `GET /`: Retrieve a list of recent orders.
-   `GET /{id}`: Get details for a specific order.
-   `PUT /{id}/status`: Update the status of an order.

### Payment Service (`/api/payments`)

-   `POST /charge`: Create a new payment charge for an order.
-   `GET /transactions`: Retrieve a list of transactions.
-   `POST /refunds`: Process a refund for a transaction.

*(Note: This is not an exhaustive list. Each service will have a detailed OpenAPI specification.)*

