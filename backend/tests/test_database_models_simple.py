"""
Simplified test database models for Buffr Host Hospitality Platform
Tests only the models that actually exist and work.
"""
import pytest
from sqlalchemy.orm import Session

from models.hospitality_property import HospitalityProperty
from models.menu import Menu, MenuCategory
from models.room import Room, RoomType
from models.user import Profile, User
from models.user_type import UserType


class TestHospitalityProperty:
    """Test HospitalityProperty model."""

    def test_create_hospitality_property(self, db_session: Session):
        """Test creating a hospitality property."""
        property = HospitalityProperty(
            property_name="Test Hotel",
            address="123 Test Street",
            phone="+1234567890",
            email="test@hotel.com",
            website="https://testhotel.com",
            property_type="hotel",
            is_active=True,
        )

        db_session.add(property)
        db_session.commit()
        db_session.refresh(property)

        assert property.property_id is not None
        assert property.property_name == "Test Hotel"
        assert property.property_type == "hotel"
        assert property.is_active == True


class TestCustomer:
    """Test Customer model."""

    def test_create_customer(self, db_session: Session):
        """Test creating a customer."""
        customer = Customer(
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            phone="+1234567890",
        )

        db_session.add(customer)
        db_session.commit()
        db_session.refresh(customer)

        assert customer.customer_id is not None
        assert customer.first_name == "John"
        assert customer.last_name == "Doe"
        assert customer.email == "john.doe@example.com"

    def test_customer_full_name_property(self, db_session: Session):
        """Test customer full name property."""
        customer = Customer(
            first_name="John", last_name="Doe", email="john.doe@example.com"
        )

        assert customer.get_full_name() == "John Doe"


class TestRoomType:
    """Test RoomType model."""

    def test_create_room_type(self, db_session: Session):
        """Test creating a room type."""
        # First create a property
        property = HospitalityProperty(
            property_name="Test Hotel", address="123 Test Street", property_type="hotel"
        )
        db_session.add(property)
        db_session.commit()
        db_session.refresh(property)

        room_type = RoomType(
            property_id=property.property_id,
            type_name="Standard Room",
            type_class="standard",
            description="A comfortable standard room",
            base_price_per_night=100.00,
            max_occupancy=2,
            bed_type="queen",
            room_size_sqft=250,
            is_active=True,
        )

        db_session.add(room_type)
        db_session.commit()
        db_session.refresh(room_type)

        assert room_type.room_type_id is not None
        assert room_type.type_name == "Standard Room"
        assert room_type.base_price_per_night == 100.00
        assert room_type.max_occupancy == 2
        assert room_type.property_id == property.property_id


class TestRoom:
    """Test Room model."""

    def test_create_room(self, db_session: Session):
        """Test creating a room."""
        # First create a property
        property = HospitalityProperty(
            property_name="Test Hotel", address="123 Test Street", property_type="hotel"
        )
        db_session.add(property)
        db_session.commit()
        db_session.refresh(property)

        # Create a room type
        room_type = RoomType(
            property_id=property.property_id,
            type_name="Standard Room",
            type_class="standard",
            base_price_per_night=100.00,
            max_occupancy=2,
        )
        db_session.add(room_type)
        db_session.commit()
        db_session.refresh(room_type)

        room = Room(
            property_id=property.property_id,
            room_type_id=room_type.room_type_id,
            room_number="101",
            floor=1,
            status="available",
        )

        db_session.add(room)
        db_session.commit()
        db_session.refresh(room)

        assert room.room_id is not None
        assert room.room_number == "101"
        assert room.floor == 1
        assert room.status == "available"
        assert room.property_id == property.property_id
        assert room.room_type_id == room_type.room_type_id


class TestMenuCategory:
    """Test MenuCategory model."""

    def test_create_menu_category(self, db_session: Session):
        """Test creating a menu category."""
        # First create a property
        property = HospitalityProperty(
            property_name="Test Restaurant",
            address="123 Test Street",
            property_type="restaurant",
        )
        db_session.add(property)
        db_session.commit()
        db_session.refresh(property)

        category = MenuCategory(
            property_id=property.property_id,
            name="Appetizers",
            description="Start your meal with our delicious appetizers",
            display_order=1,
            is_active=True,
        )

        db_session.add(category)
        db_session.commit()
        db_session.refresh(category)

        assert category.category_id is not None
        assert category.name == "Appetizers"
        assert category.display_order == 1
        assert category.property_id == property.property_id


class TestMenu:
    """Test Menu model."""

    def test_create_menu_item(self, db_session: Session):
        """Test creating a menu item."""
        # First create a property
        property = HospitalityProperty(
            property_name="Test Restaurant",
            address="123 Test Street",
            property_type="restaurant",
        )
        db_session.add(property)
        db_session.commit()
        db_session.refresh(property)

        # Create a category
        category = MenuCategory(
            property_id=property.property_id, name="Appetizers", display_order=1
        )
        db_session.add(category)
        db_session.commit()
        db_session.refresh(category)

        item = Menu(
            property_id=property.property_id,
            category_id=category.category_id,
            name="Caesar Salad",
            description="Fresh romaine lettuce with caesar dressing",
            price=12.99,
            preparation_time=10,
            is_active=True,
        )

        db_session.add(item)
        db_session.commit()
        db_session.refresh(item)

        assert item.menu_id is not None
        assert item.name == "Caesar Salad"
        assert item.price == 12.99
        assert item.preparation_time == 10
        assert item.property_id == property.property_id
        assert item.category_id == category.category_id


class TestUserType:
    """Test UserType model."""

    def test_create_user_type(self, db_session: Session):
        """Test creating a user type."""
        user_type = UserType(
            name="Individual",
            description="Individual customers booking for personal use",
            permissions=["book_room", "order_food", "use_spa"],
            is_active=True,
        )

        db_session.add(user_type)
        db_session.commit()
        db_session.refresh(user_type)

        assert user_type.user_type_id is not None
        assert user_type.name == "Individual"
        assert "book_room" in user_type.permissions


class TestModelRelationships:
    """Test model relationships."""

    def test_property_room_type_relationship(self, db_session: Session):
        """Test relationship between property and room types."""
        property = HospitalityProperty(
            property_name="Test Hotel", address="123 Test Street", property_type="hotel"
        )
        db_session.add(property)
        db_session.commit()
        db_session.refresh(property)

        room_type = RoomType(
            property_id=property.property_id,
            type_name="Deluxe Room",
            type_class="deluxe",
            base_price_per_night=150.00,
            max_occupancy=2,
        )

        db_session.add(room_type)
        db_session.commit()
        db_session.refresh(room_type)

        # Test that room type is associated with property
        assert room_type.property_id == property.property_id

    def test_room_type_room_relationship(self, db_session: Session):
        """Test relationship between room type and rooms."""
        # Create property
        property = HospitalityProperty(
            property_name="Test Hotel", address="123 Test Street", property_type="hotel"
        )
        db_session.add(property)
        db_session.commit()
        db_session.refresh(property)

        # Create room type
        room_type = RoomType(
            property_id=property.property_id,
            type_name="Standard Room",
            type_class="standard",
            base_price_per_night=100.00,
            max_occupancy=2,
        )
        db_session.add(room_type)
        db_session.commit()
        db_session.refresh(room_type)

        room = Room(
            property_id=property.property_id,
            room_type_id=room_type.room_type_id,
            room_number="201",
            floor=2,
        )

        db_session.add(room)
        db_session.commit()
        db_session.refresh(room)

        # Test that room is associated with room type
        assert room.room_type_id == room_type.room_type_id

    def test_property_menu_relationship(self, db_session: Session):
        """Test relationship between property and menu items."""
        property = HospitalityProperty(
            property_name="Test Restaurant",
            address="123 Test Street",
            property_type="restaurant",
        )
        db_session.add(property)
        db_session.commit()
        db_session.refresh(property)

        category = MenuCategory(
            property_id=property.property_id, name="Desserts", display_order=3
        )

        db_session.add(category)
        db_session.commit()
        db_session.refresh(category)

        item = Menu(
            property_id=property.property_id,
            category_id=category.category_id,
            name="Chocolate Cake",
            price=8.99,
        )

        db_session.add(item)
        db_session.commit()
        db_session.refresh(item)

        # Test that menu item is associated with property and category
        assert item.property_id == property.property_id
        assert item.category_id == category.category_id
