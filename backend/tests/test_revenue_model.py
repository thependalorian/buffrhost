from datetime import datetime, timedelta
from uuid import uuid4

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from database import Base, engine, get_db
from main import app
from models.revenue_model import CommissionStructure, ServiceFee, Subscription
from models.user import User  # Assuming User is defined here


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
        email="admin_rev@example.com",
        name="Admin Rev User",
        property_id=1,  # Mock property ID
        role="admin",
        password="hashed_password",  # In a real test, hash this
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


# --- Subscription Tests ---
@pytest.mark.asyncio
async def test_create_subscription(
    client: AsyncClient, auth_headers: dict, admin_user: User
):
    subscription_data = {
        "user_id": str(uuid4()),
        "plan_name": "Basic",
        "price": 10.00,
        "start_date": datetime.now().isoformat(),
    }
    response = await client.post(
        "/revenue-model/subscriptions", json=subscription_data, headers=auth_headers
    )
    assert response.status_code == 201
    assert response.json()["plan_name"] == subscription_data["plan_name"]


@pytest.mark.asyncio
async def test_get_subscriptions(
    client: AsyncClient, auth_headers: dict, admin_user: User
):
    response = await client.get("/revenue-model/subscriptions", headers=auth_headers)
    assert response.status_code == 200


# Add more tests for Subscription, ServiceFee, CommissionStructure, CRUD operations
