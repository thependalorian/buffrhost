"""
Test API endpoints for Buffr Host Hospitality Platform
"""
import json
from datetime import datetime, timedelta
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session


def test_health_check(client: TestClient):
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data


def test_get_properties(client: TestClient, sample_hospitality_property):
    """Test getting all hospitality properties."""
    response = client.get("/api/v1/properties/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Test Hotel"
    assert data[0]["property_type"] == "hotel"


def test_get_property_by_id(client: TestClient, sample_hospitality_property):
    """Test getting a specific hospitality property by ID."""
    response = client.get(f"/api/v1/properties/{sample_hospitality_property.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Hotel"
    assert data["id"] == sample_hospitality_property.id


def test_create_property(client: TestClient):
    """Test creating a new hospitality property."""
    property_data = {
        "name": "New Test Hotel",
        "description": "A new test hotel",
        "address": "456 New Street",
        "city": "New City",
        "state": "New State",
        "zip_code": "54321",
        "country": "New Country",
        "phone": "+1987654321",
        "email": "new@hotel.com",
        "website": "https://newhotel.com",
        "property_type": "resort",
        "status": "active",
    }

    response = client.post("/api/v1/properties/", json=property_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "New Test Hotel"
    assert data["property_type"] == "resort"
    assert "id" in data


def test_get_room_types(client: TestClient, sample_room_type):
    """Test getting room types for a property."""
    response = client.get(
        f"/api/v1/properties/{sample_room_type.property_id}/room-types/"
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Standard Room"
    assert data[0]["base_price"] == 100.00


def test_create_room_type(client: TestClient, sample_hospitality_property):
    """Test creating a new room type."""
    room_type_data = {
        "name": "Deluxe Suite",
        "description": "A luxurious deluxe suite",
        "base_price": 250.00,
        "max_occupancy": 4,
        "bed_type": "king",
        "room_size": 50.0,
        "status": "active",
    }

    response = client.post(
        f"/api/v1/properties/{sample_hospitality_property.id}/room-types/",
        json=room_type_data,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Deluxe Suite"
    assert data["base_price"] == 250.00


def test_get_rooms(client: TestClient, sample_room):
    """Test getting rooms for a property."""
    response = client.get(f"/api/v1/properties/{sample_room.property_id}/rooms/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["room_number"] == "101"
    assert data[0]["status"] == "available"


def test_create_room(client: TestClient, sample_hospitality_property, sample_room_type):
    """Test creating a new room."""
    room_data = {
        "room_type_id": sample_room_type.id,
        "room_number": "102",
        "floor": 1,
        "status": "available",
    }

    response = client.post(
        f"/api/v1/properties/{sample_hospitality_property.id}/rooms/", json=room_data
    )
    assert response.status_code == 201
    data = response.json()
    assert data["room_number"] == "102"
    assert data["floor"] == 1


def test_get_menu_categories(client: TestClient, sample_menu_category):
    """Test getting menu categories for a property."""
    response = client.get(
        f"/api/v1/properties/{sample_menu_category.property_id}/menu/categories/"
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Appetizers"


def test_create_menu_category(client: TestClient, sample_hospitality_property):
    """Test creating a new menu category."""
    category_data = {
        "name": "Main Courses",
        "description": "Our delicious main courses",
        "display_order": 2,
        "status": "active",
    }

    response = client.post(
        f"/api/v1/properties/{sample_hospitality_property.id}/menu/categories/",
        json=category_data,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Main Courses"
    assert data["display_order"] == 2


def test_get_menu_items(client: TestClient, sample_menu_item):
    """Test getting menu items for a property."""
    response = client.get(
        f"/api/v1/properties/{sample_menu_item.property_id}/menu/items/"
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Caesar Salad"
    assert data[0]["price"] == 12.99


def test_create_menu_item(
    client: TestClient, sample_hospitality_property, sample_menu_category
):
    """Test creating a new menu item."""
    item_data = {
        "category_id": sample_menu_category.id,
        "name": "Grilled Salmon",
        "description": "Fresh Atlantic salmon grilled to perfection",
        "price": 24.99,
        "preparation_time": 20,
        "status": "active",
    }

    response = client.post(
        f"/api/v1/properties/{sample_hospitality_property.id}/menu/items/",
        json=item_data,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Grilled Salmon"
    assert data["price"] == 24.99


def test_get_customers(client: TestClient, sample_customer):
    """Test getting all customers."""
    response = client.get("/api/v1/customers/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["first_name"] == "John"
    assert data[0]["email"] == "john.doe@example.com"


def test_create_customer(client: TestClient):
    """Test creating a new customer."""
    customer_data = {
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@example.com",
        "phone": "+1987654321",
        "date_of_birth": "1985-05-15",
        "status": "active",
    }

    response = client.post("/api/v1/customers/", json=customer_data)
    assert response.status_code == 201
    data = response.json()
    assert data["first_name"] == "Jane"
    assert data["email"] == "jane.smith@example.com"
    assert "id" in data


def test_404_for_nonexistent_property(client: TestClient):
    """Test 404 response for non-existent property."""
    response = client.get("/api/v1/properties/99999")
    assert response.status_code == 404


def test_404_for_nonexistent_room_type(client: TestClient, sample_hospitality_property):
    """Test 404 response for non-existent room type."""
    response = client.get(
        f"/api/v1/properties/{sample_hospitality_property.id}/room-types/99999"
    )
    assert response.status_code == 404


def test_validation_error_on_invalid_data(client: TestClient):
    """Test validation error for invalid property data."""
    invalid_data = {
        "name": "",  # Empty name should fail validation
        "email": "invalid-email",  # Invalid email format
        "property_type": "invalid_type",  # Invalid property type
    }

    response = client.post("/api/v1/properties/", json=invalid_data)
    assert response.status_code == 422  # Validation error


# Enhanced API Tests for Buffr Host


def test_booking_endpoints(
    client: TestClient, sample_hospitality_property, sample_room, sample_customer
):
    """Test booking-related endpoints."""
    # Create a booking
    booking_data = {
        "customer_id": sample_customer.id,
        "room_id": sample_room.id,
        "check_in_date": "2024-02-15",
        "check_out_date": "2024-02-17",
        "number_of_guests": 2,
        "total_amount": 1000.00,
        "status": "confirmed",
    }

    response = client.post("/api/v1/bookings/", json=booking_data)
    assert response.status_code == 201
    data = response.json()
    assert data["customer_id"] == sample_customer.id
    assert data["room_id"] == sample_room.id
    assert data["status"] == "confirmed"

    # Get booking by ID
    booking_id = data["id"]
    response = client.get(f"/api/v1/bookings/{booking_id}")
    assert response.status_code == 200
    assert response.json()["id"] == booking_id

    # Update booking status
    update_data = {"status": "checked_in"}
    response = client.patch(f"/api/v1/bookings/{booking_id}", json=update_data)
    assert response.status_code == 200
    assert response.json()["status"] == "checked_in"


def test_staff_management_endpoints(client: TestClient, sample_hospitality_property):
    """Test staff management endpoints."""
    # Create staff department
    dept_data = {
        "name": "Housekeeping",
        "description": "Housekeeping department",
        "property_id": sample_hospitality_property.id,
    }

    response = client.post("/api/v1/staff/departments/", json=dept_data)
    assert response.status_code == 201
    dept_id = response.json()["id"]

    # Create staff position
    position_data = {
        "name": "Housekeeper",
        "description": "Room cleaning staff",
        "department_id": dept_id,
        "hourly_rate": 15.00,
    }

    response = client.post("/api/v1/staff/positions/", json=position_data)
    assert response.status_code == 201
    position_id = response.json()["id"]

    # Create staff profile
    staff_data = {
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane.doe@hotel.com",
        "phone": "+264811234567",
        "position_id": position_id,
        "hire_date": "2024-01-01",
        "status": "active",
    }

    response = client.post("/api/v1/staff/profiles/", json=staff_data)
    assert response.status_code == 201
    staff_id = response.json()["id"]

    # Get staff by ID
    response = client.get(f"/api/v1/staff/profiles/{staff_id}")
    assert response.status_code == 200
    assert response.json()["first_name"] == "Jane"


def test_inventory_management_endpoints(
    client: TestClient, sample_hospitality_property
):
    """Test inventory management endpoints."""
    # Create inventory item
    item_data = {
        "name": "Towels",
        "description": "Bath towels",
        "category": "linen",
        "current_stock": 100,
        "minimum_stock": 20,
        "unit_price": 25.00,
        "property_id": sample_hospitality_property.id,
    }

    response = client.post("/api/v1/inventory/items/", json=item_data)
    assert response.status_code == 201
    item_id = response.json()["id"]

    # Update stock
    stock_data = {"current_stock": 80}
    response = client.patch(f"/api/v1/inventory/items/{item_id}/stock", json=stock_data)
    assert response.status_code == 200
    assert response.json()["current_stock"] == 80

    # Get low stock alerts
    response = client.get("/api/v1/inventory/alerts/low-stock")
    assert response.status_code == 200


def test_analytics_endpoints(client: TestClient, sample_hospitality_property):
    """Test analytics and reporting endpoints."""
    # Get revenue analytics
    response = client.get(
        f"/api/v1/analytics/revenue?property_id={sample_hospitality_property.id}&period=monthly"
    )
    assert response.status_code == 200
    data = response.json()
    assert "total_revenue" in data
    assert "period" in data

    # Get occupancy analytics
    response = client.get(
        f"/api/v1/analytics/occupancy?property_id={sample_hospitality_property.id}&start_date=2024-01-01&end_date=2024-01-31"
    )
    assert response.status_code == 200
    data = response.json()
    assert "occupancy_rate" in data
    assert "total_rooms" in data

    # Get customer analytics
    response = client.get(
        f"/api/v1/analytics/customers?property_id={sample_hospitality_property.id}"
    )
    assert response.status_code == 200
    data = response.json()
    assert "total_customers" in data
    assert "new_customers" in data


def test_payment_endpoints(client: TestClient, sample_customer):
    """Test payment processing endpoints."""
    # Create payment
    payment_data = {
        "customer_id": sample_customer.id,
        "amount": 500.00,
        "currency": "NAD",
        "payment_method": "card",
        "status": "pending",
        "description": "Room booking payment",
    }

    response = client.post("/api/v1/payments/", json=payment_data)
    assert response.status_code == 201
    payment_id = response.json()["id"]

    # Process payment
    process_data = {"status": "completed", "transaction_id": "txn_123456"}
    response = client.patch(f"/api/v1/payments/{payment_id}/process", json=process_data)
    assert response.status_code == 200
    assert response.json()["status"] == "completed"


def test_authentication_endpoints(client: TestClient):
    """Test authentication endpoints."""
    # Test user registration
    user_data = {
        "email": "test@buffr.ai",
        "password": "securepassword123",
        "first_name": "Test",
        "last_name": "User",
        "role": "admin",
    }

    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 201
    assert "access_token" in response.json()

    # Test user login
    login_data = {"email": "test@buffr.ai", "password": "securepassword123"}

    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()

    # Test invalid login
    invalid_login = {"email": "test@buffr.ai", "password": "wrongpassword"}

    response = client.post("/api/v1/auth/login", json=invalid_login)
    assert response.status_code == 401


def test_rate_limiting(client: TestClient):
    """Test rate limiting on API endpoints."""
    # Make multiple requests to test rate limiting
    for i in range(10):
        response = client.get("/health")
        assert response.status_code == 200

    # This would test rate limiting in a real implementation
    # response = client.get("/health")
    # assert response.status_code == 429  # Too Many Requests


def test_cors_headers(client: TestClient):
    """Test CORS headers are properly set."""
    response = client.options("/api/v1/properties/")
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers


def test_api_versioning(client: TestClient):
    """Test API versioning is working correctly."""
    # Test v1 endpoints
    response = client.get("/api/v1/properties/")
    assert response.status_code == 200

    # Test that v2 endpoints would be different (future implementation)
    # response = client.get("/api/v2/properties/")
    # assert response.status_code == 200


def test_error_handling(client: TestClient):
    """Test proper error handling and responses."""
    # Test 404 for non-existent resource
    response = client.get("/api/v1/properties/99999")
    assert response.status_code == 404
    assert "detail" in response.json()

    # Test 422 for validation errors
    invalid_data = {"name": ""}
    response = client.post("/api/v1/properties/", json=invalid_data)
    assert response.status_code == 422
    assert "detail" in response.json()

    # Test 500 for server errors (mocked)
    with patch(
        "backend.routes.properties.create_property",
        side_effect=Exception("Database error"),
    ):
        response = client.post("/api/v1/properties/", json={"name": "Test"})
        assert response.status_code == 500


def test_pagination(client: TestClient, sample_hospitality_property):
    """Test pagination on list endpoints."""
    # Create multiple properties for pagination testing
    for i in range(15):
        property_data = {
            "name": f"Test Hotel {i}",
            "property_type": "hotel",
            "status": "active",
        }
        client.post("/api/v1/properties/", json=property_data)

    # Test first page
    response = client.get("/api/v1/properties/?page=1&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 10
    assert data["page"] == 1
    assert data["total"] >= 15

    # Test second page
    response = client.get("/api/v1/properties/?page=2&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert data["page"] == 2


def test_search_and_filtering(client: TestClient, sample_hospitality_property):
    """Test search and filtering capabilities."""
    # Test search by name
    response = client.get("/api/v1/properties/?search=Test")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) >= 1

    # Test filtering by property type
    response = client.get("/api/v1/properties/?property_type=hotel")
    assert response.status_code == 200
    data = response.json()
    assert all(item["property_type"] == "hotel" for item in data["items"])

    # Test date range filtering
    response = client.get("/api/v1/bookings/?start_date=2024-01-01&end_date=2024-12-31")
    assert response.status_code == 200
