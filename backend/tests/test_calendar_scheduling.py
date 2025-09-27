from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
import pytest
from uuid import uuid4
from datetime import datetime, timedelta

from main import app
from database import Base, engine, get_db
from models.calendar_scheduling import Booking, Schedule, Resource, Event
from models.user import User # Assuming User is defined here
from models.hr_payroll import Employee # Assuming Employee is defined here for schedules

# Setup for async tests
@pytest.fixture(autouse=True)
async def setup_and_teardown_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def db_session():
    async with AsyncSession(engine) as session:
        yield session

@pytest.fixture
async def client(db_session: AsyncSession):
    app.dependency_overrides[get_db] = lambda: db_session
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()

@pytest.fixture
async def admin_user(db_session: AsyncSession):
    user_id = uuid4()
    admin = User(
        owner_id=user_id,
        email="admin_cal@example.com",
        name="Admin Cal User",
        property_id=1, # Mock property ID
        role="admin",
        password="hashed_password" # In a real test, hash this
    )
    db_session.add(admin)
    await db_session.commit()
    await db_session.refresh(admin)
    return admin

@pytest.fixture
async def auth_headers(admin_user: User):
    # In a real test, generate a valid JWT token for the admin_user
    # For now, a placeholder
    return {"Authorization": "Bearer mock_admin_token"}

# --- Booking Tests ---
@pytest.mark.asyncio
async def test_create_booking(client: AsyncClient, auth_headers: dict, admin_user: User):
    booking_data = {
        "user_id": str(uuid4()),
        "resource_id": str(uuid4()),
        "resource_type": "room",
        "start_time": datetime.now().isoformat(),
        "end_time": (datetime.now() + timedelta(hours=2)).isoformat()
    }
    response = await client.post("/calendar-scheduling/bookings", json=booking_data, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["resource_type"] == booking_data["resource_type"]

@pytest.mark.asyncio
async def test_get_bookings(client: AsyncClient, auth_headers: dict, admin_user: User):
    response = await client.get("/calendar-scheduling/bookings", headers=auth_headers)
    assert response.status_code == 200

# Add more tests for Booking, Schedule, Resource, Event CRUD operations
