"""
Test data factories for consistent test data generation
Matches the actual model structure from the codebase
"""
import uuid
from datetime import datetime, timedelta

import factory
from factory.fuzzy import FuzzyChoice, FuzzyFloat, FuzzyInteger, FuzzyText

from models.hospitality_property import HospitalityProperty
from models.inventory import InventoryItem
from models.menu import Menu, MenuCategory
from models.order import Order, OrderItem
from models.staff import StaffDepartment, StaffPosition, StaffProfile
from models.user import Profile, User


class HospitalityPropertyFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for creating HospitalityProperty test data."""

    class Meta:
        model = HospitalityProperty
        sqlalchemy_session_persistence = "commit"

    property_name = factory.Sequence(lambda n: f"Test Hotel {n}")
    property_type = FuzzyChoice(["hotel", "restaurant", "lodge", "spa", "conference"])
    address = factory.Faker("street_address")
    phone = factory.Faker("phone_number")
    email = factory.Faker("email")
    website = factory.Faker("url")
    is_active = True
    timezone = "UTC"
    total_rooms = FuzzyInteger(10, 100)
    cuisine_type = FuzzyChoice(
        ["international", "local", "italian", "asian", "african"]
    )
    max_capacity = FuzzyInteger(50, 500)
    services_offered = factory.List(
        [factory.Faker("word") for _ in range(FuzzyInteger(3, 8).fuzz())]
    )
    amenities = factory.List(
        [factory.Faker("word") for _ in range(FuzzyInteger(5, 12).fuzz())]
    )


class CustomerFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for creating Customer test data."""

    class Meta:
        model = Customer
        sqlalchemy_session_persistence = "commit"

    customer_id = factory.LazyFunction(lambda: uuid.uuid4())
    email = factory.Faker("email")
    phone = factory.Faker("phone_number")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    date_of_birth = factory.Faker("date_of_birth", minimum_age=18, maximum_age=80)
    nationality = factory.Faker("country")
    address = factory.Faker("address")
    city = factory.Faker("city")
    country = factory.Faker("country")
    kyc_status = FuzzyChoice(["pending", "verified", "rejected"])
    loyalty_points = FuzzyInteger(0, 10000)


class MenuCategoryFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for creating MenuCategory test data."""

    class Meta:
        model = MenuCategory
        sqlalchemy_session_persistence = "commit"

    property_id = factory.SubFactory(HospitalityPropertyFactory)
    name = FuzzyChoice(
        ["Appetizers", "Main Courses", "Desserts", "Beverages", "Specials"]
    )
    display_order = FuzzyInteger(1, 10)


class MenuFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for creating Menu test data."""

    class Meta:
        model = Menu
        sqlalchemy_session_persistence = "commit"

    property_id = factory.SubFactory(HospitalityPropertyFactory)
    category_id = factory.SubFactory(MenuCategoryFactory)
    name = factory.Faker("word")
    description = factory.Faker("text", max_nb_chars=300)
    base_price = FuzzyFloat(5.0, 50.0)
    preparation_time = FuzzyInteger(5, 45)
    calories = FuzzyInteger(100, 1000)
    dietary_tags = factory.Faker("word")
    is_available = True
    for_type = "all"
    is_popular = factory.Faker("boolean")
    is_all = True
    service_type = "restaurant"


class OrderFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for creating Order test data."""

    class Meta:
        model = Order
        sqlalchemy_session_persistence = "commit"

    order_id = factory.LazyFunction(lambda: uuid.uuid4())
    customer_id = factory.SubFactory(CustomerFactory)
    property_id = factory.SubFactory(HospitalityPropertyFactory)
    status = FuzzyChoice(["pending", "confirmed", "completed", "cancelled"])
    total = FuzzyFloat(10.0, 500.0)
    payment_method = FuzzyChoice(["cash", "card", "mobile_money"])
    payment_status = FuzzyChoice(["unpaid", "pending", "paid", "failed", "refunded"])
    service_type = "restaurant"
    order_type = FuzzyChoice(["dine_in", "takeaway", "delivery"])
    special_instructions = factory.Faker("text", max_nb_chars=200)


class OrderItemFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for creating OrderItem test data."""

    class Meta:
        model = OrderItem
        sqlalchemy_session_persistence = "commit"

    order_id = factory.SubFactory(OrderFactory)
    menu_item_id = factory.SubFactory(MenuFactory)
    quantity = FuzzyInteger(1, 5)
    price_at_order = FuzzyFloat(5.0, 50.0)
    special_instructions = factory.Faker("text", max_nb_chars=100)


class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for creating User test data."""

    class Meta:
        model = User
        sqlalchemy_session_persistence = "commit"

    owner_id = factory.Sequence(lambda n: f"user_{n}")
    email = factory.Faker("email")
    name = factory.Faker("name")
    password = factory.Faker("password")
    property_id = factory.SubFactory(HospitalityPropertyFactory)
    role = FuzzyChoice(["admin", "manager", "staff", "guest"])
    is_active = True
    permissions = factory.List(
        [factory.Faker("word") for _ in range(FuzzyInteger(1, 5).fuzz())]
    )


class StaffDepartmentFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for creating StaffDepartment test data."""

    class Meta:
        model = StaffDepartment
        sqlalchemy_session_persistence = "commit"

    property_id = factory.SubFactory(HospitalityPropertyFactory)
    name = FuzzyChoice(
        ["Front Desk", "Housekeeping", "Kitchen", "Management", "Maintenance"]
    )
    description = factory.Faker("text", max_nb_chars=200)
    is_active = True


class StaffPositionFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for creating StaffPosition test data."""

    class Meta:
        model = StaffPosition
        sqlalchemy_session_persistence = "commit"

    property_id = factory.SubFactory(HospitalityPropertyFactory)
    department_id = factory.SubFactory(StaffDepartmentFactory)
    title = FuzzyChoice(["Manager", "Supervisor", "Staff", "Intern"])
    description = factory.Faker("text", max_nb_chars=200)
    is_active = True


class StaffProfileFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for creating StaffProfile test data."""

    class Meta:
        model = StaffProfile
        sqlalchemy_session_persistence = "commit"

    property_id = factory.SubFactory(HospitalityPropertyFactory)
    department_id = factory.SubFactory(StaffDepartmentFactory)
    position_id = factory.SubFactory(StaffPositionFactory)
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    email = factory.Faker("email")
    phone = factory.Faker("phone_number")
    hire_date = factory.Faker("date_between", start_date="-2y", end_date="today")
    salary = FuzzyFloat(1000.0, 10000.0)
    is_active = True


class InventoryItemFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for creating InventoryItem test data."""

    class Meta:
        model = InventoryItem
        sqlalchemy_session_persistence = "commit"

    property_id = factory.SubFactory(HospitalityPropertyFactory)
    name = factory.Faker("word")
    description = factory.Faker("text", max_nb_chars=200)
    category = FuzzyChoice(["food", "beverage", "cleaning", "maintenance", "office"])
    current_stock = FuzzyInteger(0, 1000)
    minimum_stock = FuzzyInteger(5, 50)
    unit_price = FuzzyFloat(1.0, 100.0)
    supplier = factory.Faker("company")
    is_active = True


# Test data fixtures for common test scenarios
def create_test_property():
    """Create a test hospitality property with all related data."""
    property = HospitalityPropertyFactory()

    # Create menu categories and items
    for i in range(3):
        category = MenuCategoryFactory(property_id=property.property_id)
        for j in range(5):
            MenuFactory(
                property_id=property.property_id, category_id=category.category_id
            )

    # Create staff structure
    department = StaffDepartmentFactory(property_id=property.property_id)
    position = StaffPositionFactory(
        property_id=property.property_id, department_id=department.department_id
    )
    StaffProfileFactory(
        property_id=property.property_id,
        department_id=department.department_id,
        position_id=position.position_id,
    )

    # Create inventory items
    for i in range(10):
        InventoryItemFactory(property_id=property.property_id)

    return property


def create_test_customer_with_orders():
    """Create a test customer with order history."""
    customer = CustomerFactory()

    # Create multiple orders
    for i in range(3):
        order = OrderFactory(customer_id=customer.customer_id)
        # Create order items
        for j in range(2):
            OrderItemFactory(order_id=order.order_id)

    return customer


def create_test_user_with_property():
    """Create a test user with associated property."""
    property = HospitalityPropertyFactory()
    user = UserFactory(property_id=property.property_id)
    return user, property
