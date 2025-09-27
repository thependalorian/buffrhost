from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
import pytest
from uuid import uuid4
from datetime import datetime

from main import app
from database import Base, engine, get_db
from models.banking_financial import Transaction, PaymentGateway, Disbursement
from models.user import User # Assuming User is defined here

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
        email="admin_fin@example.com",
        name="Admin Fin User",
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

# --- Bank Account Tests ---
@pytest.mark.asyncio
async def test_create_bank_account(client: AsyncClient, auth_headers: dict, admin_user: User):
    account_data = {
        "user_id": str(uuid4()),
        "account_name": "Checking",
        "bank_name": "Test Bank",
        "account_number": "1234567890"
    }
    response = await client.post("/banking-financial/bank-accounts", json=account_data, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["account_name"] == account_data["account_name"]

@pytest.mark.asyncio
async def test_get_bank_accounts(client: AsyncClient, auth_headers: dict, admin_user: User):
    response = await client.get("/banking-financial/bank-accounts", headers=auth_headers)
    assert response.status_code == 200

# Add more tests for Transaction, PaymentGateway, Disbursement CRUD operations
