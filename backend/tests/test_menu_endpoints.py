"""
Test menu endpoints for Buffr Host Hospitality Platform
Tests match the actual implementation in routes/menu.py
"""
import json
from datetime import datetime, timedelta
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session


def test_get_menu_categories(
    client: TestClient, sample_user_admin, sample_hospitality_property
):
    """Test getting menu categories for a restaurant."""
    # Mock authentication
    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        response = client.get(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-categories"
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


def test_create_menu_category(
    client: TestClient, sample_user_admin, sample_hospitality_property
):
    """Test creating a new menu category."""
    category_data = {"name": "Appetizers", "display_order": 1}

    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        response = client.post(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-categories",
            json=category_data,
        )
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Appetizers"
        assert data["display_order"] == 1


def test_update_menu_category(
    client: TestClient,
    sample_user_admin,
    sample_hospitality_property,
    sample_menu_category,
):
    """Test updating a menu category."""
    update_data = {"name": "Updated Appetizers", "display_order": 2}

    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        response = client.put(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-categories/{sample_menu_category.category_id}",
            json=update_data,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Appetizers"
        assert data["display_order"] == 2


def test_delete_menu_category(
    client: TestClient,
    sample_user_admin,
    sample_hospitality_property,
    sample_menu_category,
):
    """Test deleting a menu category."""
    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        response = client.delete(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-categories/{sample_menu_category.category_id}"
        )
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Menu category deleted successfully"


def test_get_menu_items(
    client: TestClient, sample_user_admin, sample_hospitality_property
):
    """Test getting menu items for a restaurant."""
    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        response = client.get(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-items"
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


def test_get_menu_items_with_filters(
    client: TestClient,
    sample_user_admin,
    sample_hospitality_property,
    sample_menu_category,
):
    """Test getting menu items with category filter."""
    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        response = client.get(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-items",
            params={"category_id": sample_menu_category.category_id},
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


def test_get_menu_items_with_availability_filter(
    client: TestClient, sample_user_admin, sample_hospitality_property
):
    """Test getting menu items with availability filter."""
    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        response = client.get(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-items",
            params={"is_available": True},
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


def test_get_menu_items_with_pagination(
    client: TestClient, sample_user_admin, sample_hospitality_property
):
    """Test getting menu items with pagination."""
    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        response = client.get(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-items",
            params={"page": 1, "per_page": 10},
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


def test_create_menu_item(
    client: TestClient,
    sample_user_admin,
    sample_hospitality_property,
    sample_menu_category,
):
    """Test creating a new menu item."""
    menu_data = {
        "name": "Caesar Salad",
        "description": "Fresh romaine lettuce with caesar dressing",
        "base_price": 12.99,
        "category_id": sample_menu_category.category_id,
        "preparation_time": 10,
        "calories": 250,
        "dietary_tags": "vegetarian",
        "is_available": True,
        "for_type": "all",
        "is_popular": False,
        "is_all": True,
        "service_type": "restaurant",
    }

    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        response = client.post(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-items",
            json=menu_data,
        )
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Caesar Salad"
        assert data["base_price"] == 12.99
        assert data["category_id"] == sample_menu_category.category_id


def test_get_menu_item(
    client: TestClient, sample_user_admin, sample_hospitality_property, sample_menu_item
):
    """Test getting a specific menu item."""
    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        response = client.get(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-items/{sample_menu_item.menu_item_id}"
        )
        assert response.status_code == 200
        data = response.json()
        assert data["menu_item_id"] == sample_menu_item.menu_item_id
        assert data["name"] == sample_menu_item.name


def test_update_menu_item(
    client: TestClient, sample_user_admin, sample_hospitality_property, sample_menu_item
):
    """Test updating a menu item."""
    update_data = {
        "name": "Updated Caesar Salad",
        "base_price": 15.99,
        "is_available": False,
    }

    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        response = client.put(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-items/{sample_menu_item.menu_item_id}",
            json=update_data,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Caesar Salad"
        assert data["base_price"] == 15.99
        assert data["is_available"] == False


def test_delete_menu_item(
    client: TestClient, sample_user_admin, sample_hospitality_property, sample_menu_item
):
    """Test deleting a menu item."""
    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        response = client.delete(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-items/{sample_menu_item.menu_item_id}"
        )
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Menu item deleted successfully"


def test_menu_item_not_found(
    client: TestClient, sample_user_admin, sample_hospitality_property
):
    """Test getting a non-existent menu item."""
    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        response = client.get(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-items/99999"
        )
        assert response.status_code == 404
        data = response.json()
        assert "not found" in data["detail"].lower()


def test_menu_category_not_found(
    client: TestClient, sample_user_admin, sample_hospitality_property
):
    """Test getting a non-existent menu category."""
    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        response = client.get(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-categories/99999"
        )
        assert response.status_code == 404
        data = response.json()
        assert "not found" in data["detail"].lower()


def test_access_denied_for_different_restaurant(
    client: TestClient, sample_user_guest, sample_hospitality_property
):
    """Test that users cannot access menu items from different restaurants."""
    with patch("routes.menu.get_current_user", return_value=sample_user_guest):
        response = client.get(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-items"
        )
        assert response.status_code == 403
        data = response.json()
        assert "access denied" in data["detail"].lower()


def test_create_menu_item_with_invalid_category(
    client: TestClient, sample_user_admin, sample_hospitality_property
):
    """Test creating a menu item with a non-existent category."""
    menu_data = {
        "name": "Test Item",
        "description": "Test description",
        "base_price": 10.00,
        "category_id": 99999,  # Non-existent category
        "is_available": True,
    }

    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        response = client.post(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-items",
            json=menu_data,
        )
        assert response.status_code == 404
        data = response.json()
        assert "category not found" in data["detail"].lower()


def test_menu_items_pagination_limits(
    client: TestClient, sample_user_admin, sample_hospitality_property
):
    """Test that pagination respects limits."""
    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        # Test per_page limit
        response = client.get(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-items",
            params={"per_page": 150},  # Exceeds limit of 100
        )
        assert response.status_code == 422  # Validation error


def test_menu_items_negative_pagination(
    client: TestClient, sample_user_admin, sample_hospitality_property
):
    """Test that negative pagination values are rejected."""
    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        # Test negative page
        response = client.get(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-items",
            params={"page": -1},
        )
        assert response.status_code == 422  # Validation error


def test_menu_item_validation(
    client: TestClient,
    sample_user_admin,
    sample_hospitality_property,
    sample_menu_category,
):
    """Test menu item validation."""
    invalid_menu_data = {
        "name": "",  # Empty name should fail
        "base_price": -10.00,  # Negative price should fail
        "category_id": sample_menu_category.category_id,
    }

    with patch("routes.menu.get_current_user", return_value=sample_user_admin):
        response = client.post(
            f"/api/v1/restaurants/{sample_hospitality_property.property_id}/menu-items",
            json=invalid_menu_data,
        )
        assert response.status_code == 422  # Validation error
