"""
Test configuration and fixtures for Buffr Host Hospitality Platform
"""
import asyncio

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Import only what we need for testing
try:
    from database import Base
    # Import all models to ensure they're registered with Base
    from models import *

    app = None  # We'll create a minimal app for testing
except ImportError as e:
    print(f"Warning: Could not import backend modules: {e}")
    # Create minimal test setup
    app = None
    Base = None

# Test database URL (use PostgreSQL for testing to support ARRAY types)
import os

SQLALCHEMY_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL", "postgresql://buffrhost:password@localhost:5432/buffrhost_test"
)

# Create test engine
engine = create_engine(SQLALCHEMY_DATABASE_URL, poolclass=StaticPool)

# Create test session
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Create session
    session = TestingSessionLocal()

    try:
        yield session
    finally:
        session.close()
        # Drop tables after test
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with database dependency override."""

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def sample_hospitality_property(db_session):
    """Create a sample hospitality property for testing."""
    property = HospitalityProperty(
        name="Test Hotel",
        description="A test hotel for unit testing",
        address="123 Test Street",
        city="Test City",
        state="Test State",
        zip_code="12345",
        country="Test Country",
        phone="+1234567890",
        email="test@hotel.com",
        website="https://testhotel.com",
        property_type="hotel",
        status="active",
    )
    db_session.add(property)
    db_session.commit()
    db_session.refresh(property)
    return property


@pytest.fixture
def sample_customer(db_session):
    """Create a sample customer for testing."""
    customer = Customer(
        first_name="John",
        last_name="Doe",
        email="john.doe@example.com",
        phone="+1234567890",
        date_of_birth="1990-01-01",
        status="active",
    )
    db_session.add(customer)
    db_session.commit()
    db_session.refresh(customer)
    return customer


@pytest.fixture
def sample_room_type(db_session, sample_hospitality_property):
    """Create a sample room type for testing."""
    room_type = RoomType(
        property_id=sample_hospitality_property.id,
        name="Standard Room",
        description="A comfortable standard room",
        base_price=100.00,
        max_occupancy=2,
        bed_type="queen",
        room_size=25.0,
        status="active",
    )
    db_session.add(room_type)
    db_session.commit()
    db_session.refresh(room_type)
    return room_type


@pytest.fixture
def sample_room(db_session, sample_hospitality_property, sample_room_type):
    """Create a sample room for testing."""
    room = Room(
        property_id=sample_hospitality_property.id,
        room_type_id=sample_room_type.id,
        room_number="101",
        floor=1,
        status="available",
    )
    db_session.add(room)
    db_session.commit()
    db_session.refresh(room)
    return room


@pytest.fixture
def sample_menu_category(db_session, sample_hospitality_property):
    """Create a sample menu category for testing."""
    category = MenuCategory(
        property_id=sample_hospitality_property.id,
        name="Appetizers",
        description="Start your meal with our delicious appetizers",
        display_order=1,
        status="active",
    )
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)
    return category


@pytest.fixture
def sample_menu_item(db_session, sample_hospitality_property, sample_menu_category):
    """Create a sample menu item for testing."""
    item = MenuItem(
        property_id=sample_hospitality_property.id,
        category_id=sample_menu_category.id,
        name="Caesar Salad",
        description="Fresh romaine lettuce with caesar dressing",
        price=12.99,
        preparation_time=10,
        status="active",
    )
    db_session.add(item)
    db_session.commit()
    db_session.refresh(item)
    return item
