# Inventory Service

**Status: Implemented (Production Ready)**

## 1. Overview

The Inventory Service is a comprehensive service for managing stock levels, suppliers, and inventory transactions. It is built with FastAPI and uses Supabase for its database.

## 2. Features

- **Full CRUD for Inventory Items**: Create, retrieve, update, and delete inventory items.
- **Stock Management**: Includes endpoints for stock transactions (e.g., IN, OUT, WASTE) and direct stock adjustments.
- **Supplier Information**: Can store supplier details on a per-item basis.
- **Alerting**: Provides an endpoint to get a list of items that are at or below their minimum stock level.
- **Role-Based Access**: Secures endpoints based on user roles.
- **Analytics**: Includes a summary endpoint for basic inventory analytics.

## 3. API Endpoints

- `POST /inventory/items`: Create a new inventory item.
- `GET /inventory/items/{item_id}`: Get details for a specific inventory item.
- `GET /inventory/items`: List and filter all inventory items.
- `PUT /inventory/items/{item_id}`: Update an inventory item.
- `POST /inventory/transactions`: Create a new stock transaction (e.g., receive or use stock).
- `POST /inventory/adjustments`: Directly adjust the stock level of an item.
- `GET /inventory/transactions/{item_id}`: Get the transaction history for an item.
- `GET /inventory/alerts/low-stock`: Get a list of items with low stock.
- `GET /inventory/analytics/summary`: Get a summary of inventory analytics.
- `GET /health`: Health check endpoint.

_(Note: A detailed OpenAPI specification is available at the service's `/docs` endpoint when running.)_

## 4. Database Schema

- **Database**: Supabase (PostgreSQL)
- **Key Tables**:
  - `inventory_items`: Stores the main details for each inventory item, including stock levels and supplier info.
  - `stock_transactions`: Provides an audit trail of all movements for each inventory item.

## 5. Key Dependencies

- `fastapi`: Web framework
- `supabase`: Database client
- `pyjwt`: JSON Web Token implementation
- `pydantic`: Data validation
