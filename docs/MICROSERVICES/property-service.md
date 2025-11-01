# Property Service

**Status: Implemented (Production Ready)**

## 1. Overview

The Property Service is a comprehensive service for managing hospitality properties, including their rooms, amenities, and configurations. It is built with FastAPI and uses Supabase for its database.

## 2. Features

- **Full CRUD for Properties**: Create, retrieve, update, and delete properties.
- **Room and Amenity Management**: Manages rooms and amenities associated with properties.
- **Filtering and Searching**: Provides endpoints to list and search properties with various filters.
- **Role-Based Access**: Secures endpoints based on user roles.
- **Analytics**: Includes a summary endpoint for basic property analytics.

## 3. API Endpoints

- `POST /properties`: Create a new property.
- `GET /properties/{property_id}`: Get details for a specific property.
- `GET /properties`: List and filter all properties.
- `PUT /properties/{property_id}`: Update a property.
- `DELETE /properties/{property_id}`: Delete a property.
- `GET /properties/{property_id}/rooms`: Get all rooms for a property.
- `PUT /properties/{property_id}/rooms/{room_number}`: Update a specific room.
- `GET /properties/{property_id}/amenities`: Get all amenities for a property.
- `GET /properties/analytics/summary`: Get a summary of property analytics.
- `GET /properties/search`: Search for properties.
- `GET /health`: Health check endpoint.

_(Note: A detailed OpenAPI specification is available at the service's `/docs` endpoint when running.)_

## 4. Database Schema

- **Database**: Supabase (PostgreSQL)
- **Key Tables**:
  - `properties`: Stores the main details for each property, including address, contact info, and nested room and amenity data.

## 5. Key Dependencies

- `fastapi`: Web framework
- `supabase`: Database client
- `pyjwt`: JSON Web Token implementation
- `pydantic`: Data validation
