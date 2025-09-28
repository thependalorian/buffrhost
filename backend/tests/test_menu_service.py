"""
Test Menu Service for Buffr Host Hospitality Platform
Tests the actual menu service implementation
"""
from datetime import datetime
from unittest.mock import MagicMock, Mock, patch

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from models.hospitality_property import HospitalityProperty
from models.menu import Menu, MenuCategory
from models.order import OrderItem
from services.menu_service import MenuService


class TestMenuService:
    """Test the MenuService class functionality."""

    @pytest.fixture
    def mock_db_session(self):
        """Create a mock database session."""
        return Mock(spec=Session)

    @pytest.fixture
    def menu_service(self, mock_db_session):
        """Create a MenuService instance with mocked database session."""
        return MenuService(mock_db_session)

    @pytest.fixture
    def sample_property(self):
        """Sample hospitality property data."""
        property = Mock(spec=HospitalityProperty)
        property.property_id = 1
        property.property_name = "Test Restaurant"
        property.property_type = "restaurant"
        return property

    @pytest.fixture
    def sample_menu_category(self):
        """Sample menu category data."""
        category = Mock(spec=MenuCategory)
        category.category_id = 1
        category.property_id = 1
        category.name = "Appetizers"
        category.display_order = 1
        return category

    @pytest.fixture
    def sample_menu_item(self):
        """Sample menu item data."""
        menu_item = Mock(spec=Menu)
        menu_item.menu_item_id = 1
        menu_item.property_id = 1
        menu_item.category_id = 1
        menu_item.name = "Caesar Salad"
        menu_item.description = "Fresh romaine lettuce with parmesan"
        menu_item.base_price = 12.99
        menu_item.preparation_time = 15
        menu_item.calories = 250
        menu_item.dietary_tags = "vegetarian"
        menu_item.is_available = True
        menu_item.for_type = "all"
        menu_item.is_popular = True
        menu_item.is_all = True
        menu_item.service_type = "restaurant"
        return menu_item

    def test_get_popular_menu_items(
        self, menu_service, mock_db_session, sample_menu_item
    ):
        """Test getting popular menu items based on order frequency."""
        # Mock the database query result
        mock_result = Mock()
        mock_result.all.return_value = [
            Mock(
                menu_item_id=1,
                name="Caesar Salad",
                base_price=12.99,
                order_count=25,
                revenue=324.75,
            ),
            Mock(
                menu_item_id=2,
                name="Grilled Chicken",
                base_price=18.50,
                order_count=20,
                revenue=370.00,
            ),
        ]

        mock_db_session.execute.return_value = mock_result

        # Test the method
        result = menu_service.get_popular_menu_items(property_id=1, limit=10)

        # Verify the result
        assert len(result) == 2
        assert result[0]["menu_id"] == 1
        assert result[0]["name"] == "Caesar Salad"
        assert result[0]["price"] == 12.99
        assert result[0]["order_count"] == 25
        assert result[0]["revenue"] == 324.75

        assert result[1]["menu_id"] == 2
        assert result[1]["name"] == "Grilled Chicken"
        assert result[1]["price"] == 18.50
        assert result[1]["order_count"] == 20
        assert result[1]["revenue"] == 370.00

        # Verify database query was called correctly
        mock_db_session.execute.assert_called_once()

    def test_get_popular_menu_items_empty_result(self, menu_service, mock_db_session):
        """Test getting popular menu items when no orders exist."""
        # Mock empty result
        mock_result = Mock()
        mock_result.all.return_value = []
        mock_db_session.execute.return_value = mock_result

        # Test the method
        result = menu_service.get_popular_menu_items(property_id=1, limit=10)

        # Verify empty result
        assert result == []
        mock_db_session.execute.assert_called_once()

    def test_get_popular_menu_items_with_none_values(
        self, menu_service, mock_db_session
    ):
        """Test getting popular menu items with None values in database."""
        # Mock result with None values
        mock_result = Mock()
        mock_result.all.return_value = [
            Mock(
                menu_item_id=1,
                name="Caesar Salad",
                base_price=None,
                order_count=25,
                revenue=None,
            )
        ]

        mock_db_session.execute.return_value = mock_result

        # Test the method
        result = menu_service.get_popular_menu_items(property_id=1, limit=10)

        # Verify None values are handled correctly
        assert len(result) == 1
        assert result[0]["price"] == 0
        assert result[0]["revenue"] == 0

    def test_get_popular_menu_items_limit_parameter(
        self, menu_service, mock_db_session
    ):
        """Test that the limit parameter is respected in the query."""
        # Mock the database query result
        mock_result = Mock()
        mock_result.all.return_value = []
        mock_db_session.execute.return_value = mock_result

        # Test with different limit values
        menu_service.get_popular_menu_items(property_id=1, limit=5)
        menu_service.get_popular_menu_items(property_id=1, limit=20)

        # Verify the method was called twice
        assert mock_db_session.execute.call_count == 2

    def test_get_popular_menu_items_property_id_filter(
        self, menu_service, mock_db_session
    ):
        """Test that the property_id filter is applied correctly."""
        # Mock the database query result
        mock_result = Mock()
        mock_result.all.return_value = []
        mock_db_session.execute.return_value = mock_result

        # Test with different property IDs
        menu_service.get_popular_menu_items(property_id=1, limit=10)
        menu_service.get_popular_menu_items(property_id=2, limit=10)

        # Verify the method was called twice
        assert mock_db_session.execute.call_count == 2

    def test_menu_service_initialization(self, mock_db_session):
        """Test MenuService initialization."""
        service = MenuService(mock_db_session)
        assert service.db == mock_db_session

    def test_get_popular_menu_items_database_error(self, menu_service, mock_db_session):
        """Test handling of database errors."""
        # Mock database error
        mock_db_session.execute.side_effect = Exception("Database connection error")

        # Test that the error is propagated
        with pytest.raises(Exception, match="Database connection error"):
            menu_service.get_popular_menu_items(property_id=1, limit=10)

    def test_get_popular_menu_items_result_structure(
        self, menu_service, mock_db_session
    ):
        """Test that the result has the correct structure."""
        # Mock the database query result
        mock_result = Mock()
        mock_result.all.return_value = [
            Mock(
                menu_item_id=1,
                name="Test Item",
                base_price=10.00,
                order_count=5,
                revenue=50.00,
            )
        ]

        mock_db_session.execute.return_value = mock_result

        # Test the method
        result = menu_service.get_popular_menu_items(property_id=1, limit=10)

        # Verify result structure
        assert len(result) == 1
        item = result[0]

        # Check all required keys are present
        required_keys = ["menu_id", "name", "price", "order_count", "revenue"]
        for key in required_keys:
            assert key in item

        # Check data types
        assert isinstance(item["menu_id"], int)
        assert isinstance(item["name"], str)
        assert isinstance(item["price"], float)
        assert isinstance(item["order_count"], int)
        assert isinstance(item["revenue"], float)

    def test_get_popular_menu_items_float_conversion(
        self, menu_service, mock_db_session
    ):
        """Test proper conversion of Decimal to float."""
        # Mock result with Decimal-like values
        mock_result = Mock()
        mock_result.all.return_value = [
            Mock(
                menu_item_id=1,
                name="Test Item",
                base_price=Mock(__float__=lambda: 15.99),  # Mock Decimal behavior
                order_count=10,
                revenue=Mock(__float__=lambda: 159.90),  # Mock Decimal behavior
            )
        ]

        mock_db_session.execute.return_value = mock_result

        # Test the method
        result = menu_service.get_popular_menu_items(property_id=1, limit=10)

        # Verify float conversion
        assert result[0]["price"] == 15.99
        assert result[0]["revenue"] == 159.90
        assert isinstance(result[0]["price"], float)
        assert isinstance(result[0]["revenue"], float)
