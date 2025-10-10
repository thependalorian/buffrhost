# Menu Service

**Status: Implemented (Production Ready)**

## 1. Overview

The Menu Service is a comprehensive service for managing menus, categories, and items for hospitality properties. It is built with FastAPI and uses Supabase for its database.

## 2. Features

-   **Full CRUD for Menus**: Create, retrieve, update, and delete menus.
-   **Menu Item Management**: Add, update, and delete items within a menu.
-   **Categorization**: Supports detailed categorization, allergens, and dietary information for items.
-   **Filtering**: Provides endpoints to list menus and items with filters.
-   **Role-Based Access**: Secures endpoints based on user roles.

## 3. API Endpoints

*   `POST /menus`: Create a new menu.
*   `GET /menus/{menu_id}`: Get details for a specific menu.
*   `GET /menus`: List and filter all menus.
*   `PUT /menus/{menu_id}`: Update a menu.
*   `POST /menus/{menu_id}/items`: Add an item to a menu.
*   `PUT /menus/{menu_id}/items/{item_id}`: Update a menu item.
*   `DELETE /menus/{menu_id}/items/{item_id}`: Delete a menu item.
*   `GET /menus/property/{property_id}`: Get all menus for a specific property.
*   `GET /menus/{menu_id}/items`: Get all items for a specific menu.
*   `GET /health`: Health check endpoint.

*(Note: A detailed OpenAPI specification is available at the service's `/docs` endpoint when running.)*

## 4. Database Schema

-   **Database**: Supabase (PostgreSQL)
-   **Key Tables**:
    -   `menus`: Stores the main details for each menu, including nested category and item data.

## 5. Key Dependencies

-   `fastapi`: Web framework
-   `supabase`: Database client
-   `pyjwt`: JSON Web Token implementation
-   `pydantic`: Data validation

