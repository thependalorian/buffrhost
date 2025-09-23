"""
Test database models for Buffr Host Hospitality Platform
"""
import pytest
from sqlalchemy.orm import Session
from models.hospitality_property import HospitalityProperty
from models.customer import Customer
from models.room import RoomType, Room, RoomAmenity, RoomReservation, RoomRate, RoomServiceOrder
from models.menu import MenuCategory, Menu
from models.order import Order, OrderItem
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
            is_active=True
        )
        
        db_session.add(property)
        db_session.commit()
        db_session.refresh(property)
        
        assert property.property_id is not None
        assert property.property_name == "Test Hotel"
        assert property.property_type == "hotel"
        assert property.is_active == True
    
    def test_hospitality_property_validation(self, db_session: Session):
        """Test hospitality property validation."""
        # Test required fields
        property = HospitalityProperty(
            property_name="Test Hotel",
            address="123 Test Street",
            property_type="hotel"
        )
        
        db_session.add(property)
        db_session.commit()
        db_session.refresh(property)
        
        assert property.property_id is not None
        assert property.property_name == "Test Hotel"

class TestCustomer:
    """Test Customer model."""
    
    def test_create_customer(self, db_session: Session):
        """Test creating a customer."""
        customer = Customer(
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            phone="+1234567890"
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
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com"
        )
        
        assert customer.get_full_name() == "John Doe"

class TestRoomType:
    """Test RoomType model."""
    
    def test_create_room_type(self, db_session: Session, sample_hospitality_property):
        """Test creating a room type."""
        room_type = RoomType(
            property_id=sample_hospitality_property.property_id,
            type_name="Standard Room",
            type_class="standard",
            description="A comfortable standard room",
            base_price_per_night=100.00,
            max_occupancy=2,
            bed_type="queen",
            room_size_sqft=250,
            is_active=True
        )
        
        db_session.add(room_type)
        db_session.commit()
        db_session.refresh(room_type)
        
        assert room_type.room_type_id is not None
        assert room_type.type_name == "Standard Room"
        assert room_type.base_price_per_night == 100.00
        assert room_type.max_occupancy == 2
        assert room_type.property_id == sample_hospitality_property.property_id

class TestRoom:
    """Test Room model."""
    
    def test_create_room(self, db_session: Session, sample_hospitality_property, sample_room_type):
        """Test creating a room."""
        room = Room(
            property_id=sample_hospitality_property.id,
            room_type_id=sample_room_type.id,
            room_number="101",
            floor=1,
            status="available"
        )
        
        db_session.add(room)
        db_session.commit()
        db_session.refresh(room)
        
        assert room.id is not None
        assert room.room_number == "101"
        assert room.floor == 1
        assert room.status == "available"
        assert room.property_id == sample_hospitality_property.id
        assert room.room_type_id == sample_room_type.id

class TestMenuCategory:
    """Test MenuCategory model."""
    
    def test_create_menu_category(self, db_session: Session, sample_hospitality_property):
        """Test creating a menu category."""
        category = MenuCategory(
            property_id=sample_hospitality_property.id,
            name="Appetizers",
            description="Start your meal with our delicious appetizers",
            display_order=1,
            status="active"
        )
        
        db_session.add(category)
        db_session.commit()
        db_session.refresh(category)
        
        assert category.id is not None
        assert category.name == "Appetizers"
        assert category.display_order == 1
        assert category.property_id == sample_hospitality_property.id

class TestMenuItem:
    """Test MenuItem model."""
    
    def test_create_menu_item(self, db_session: Session, sample_hospitality_property, sample_menu_category):
        """Test creating a menu item."""
        item = MenuItem(
            property_id=sample_hospitality_property.id,
            category_id=sample_menu_category.id,
            name="Caesar Salad",
            description="Fresh romaine lettuce with caesar dressing",
            price=12.99,
            preparation_time=10,
            status="active"
        )
        
        db_session.add(item)
        db_session.commit()
        db_session.refresh(item)
        
        assert item.id is not None
        assert item.name == "Caesar Salad"
        assert item.price == 12.99
        assert item.preparation_time == 10
        assert item.property_id == sample_hospitality_property.id
        assert item.category_id == sample_menu_category.id

class TestLoyaltyProgram:
    """Test LoyaltyProgram model."""
    
    def test_create_loyalty_program(self, db_session: Session, sample_hospitality_property):
        """Test creating a loyalty program."""
        program = LoyaltyProgram(
            property_id=sample_hospitality_property.id,
            name="VIP Rewards",
            description="Exclusive rewards for our VIP members",
            points_per_dollar=1.0,  # 1 point per N$1
            tier_thresholds={"silver": 100, "gold": 500, "platinum": 1000},
            status="active"
        )
        
        db_session.add(program)
        db_session.commit()
        db_session.refresh(program)
        
        assert program.id is not None
        assert program.name == "VIP Rewards"
        assert program.points_per_dollar == 1.0  # 1 point per N$1
        assert program.property_id == sample_hospitality_property.id

class TestUserType:
    """Test UserType model."""
    
    def test_create_user_type(self, db_session: Session):
        """Test creating a user type."""
        user_type = UserType(
            name="Individual",
            description="Individual customers booking for personal use",
            permissions=["book_room", "order_food", "use_spa"],
            status="active"
        )
        
        db_session.add(user_type)
        db_session.commit()
        db_session.refresh(user_type)
        
        assert user_type.id is not None
        assert user_type.name == "Individual"
        assert "book_room" in user_type.permissions

class TestCorporateCustomer:
    """Test CorporateCustomer model."""
    
    def test_create_corporate_customer(self, db_session: Session):
        """Test creating a corporate customer."""
        corporate = CorporateCustomer(
            company_name="Test Corp",
            contact_person="John Smith",
            email="john@testcorp.com",
            phone="+1234567890",
            business_type="technology",
            tax_id="123456789",
            status="active"
        )
        
        db_session.add(corporate)
        db_session.commit()
        db_session.refresh(corporate)
        
        assert corporate.id is not None
        assert corporate.company_name == "Test Corp"
        assert corporate.contact_person == "John Smith"
        assert corporate.business_type == "technology"

class TestKnowledgeBase:
    """Test KnowledgeBase model."""
    
    def test_create_knowledge_base_entry(self, db_session: Session, sample_hospitality_property):
        """Test creating a knowledge base entry."""
        kb_entry = KnowledgeBase(
            property_id=sample_hospitality_property.id,
            title="Hotel Services Guide",
            content="Our hotel offers 24/7 room service, concierge, and spa services.",
            category="services",
            tags=["room_service", "concierge", "spa"],
            status="active"
        )
        
        db_session.add(kb_entry)
        db_session.commit()
        db_session.refresh(kb_entry)
        
        assert kb_entry.id is not None
        assert kb_entry.title == "Hotel Services Guide"
        assert kb_entry.category == "services"
        assert "room_service" in kb_entry.tags
        assert kb_entry.property_id == sample_hospitality_property.id

class TestAIAgentSession:
    """Test AIAgentSession model."""
    
    def test_create_ai_agent_session(self, db_session: Session, sample_customer, sample_hospitality_property):
        """Test creating an AI agent session."""
        session = AIAgentSession(
            customer_id=sample_customer.id,
            property_id=sample_hospitality_property.id,
            session_type="guest_support",
            status="active",
            context={"language": "en", "service_type": "restaurant"}
        )
        
        db_session.add(session)
        db_session.commit()
        db_session.refresh(session)
        
        assert session.id is not None
        assert session.session_type == "guest_support"
        assert session.status == "active"
        assert session.customer_id == sample_customer.id
        assert session.property_id == sample_hospitality_property.id

class TestModelRelationships:
    """Test model relationships."""
    
    def test_property_room_type_relationship(self, db_session: Session, sample_hospitality_property):
        """Test relationship between property and room types."""
        room_type = RoomType(
            property_id=sample_hospitality_property.id,
            name="Deluxe Room",
            base_price=150.00
        )
        
        db_session.add(room_type)
        db_session.commit()
        db_session.refresh(room_type)
        
        # Test that room type is associated with property
        assert room_type.property_id == sample_hospitality_property.id
    
    def test_room_type_room_relationship(self, db_session: Session, sample_room_type):
        """Test relationship between room type and rooms."""
        room = Room(
            property_id=sample_room_type.property_id,
            room_type_id=sample_room_type.id,
            room_number="201",
            floor=2
        )
        
        db_session.add(room)
        db_session.commit()
        db_session.refresh(room)
        
        # Test that room is associated with room type
        assert room.room_type_id == sample_room_type.id
    
    def test_property_menu_relationship(self, db_session: Session, sample_hospitality_property):
        """Test relationship between property and menu items."""
        category = MenuCategory(
            property_id=sample_hospitality_property.id,
            name="Desserts",
            display_order=3
        )
        
        db_session.add(category)
        db_session.commit()
        db_session.refresh(category)
        
        item = MenuItem(
            property_id=sample_hospitality_property.id,
            category_id=category.id,
            name="Chocolate Cake",
            price=8.99
        )
        
        db_session.add(item)
        db_session.commit()
        db_session.refresh(item)
        
        # Test that menu item is associated with property and category
        assert item.property_id == sample_hospitality_property.id
        assert item.category_id == category.id
