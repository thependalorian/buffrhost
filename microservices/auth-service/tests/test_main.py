
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch

# Import the FastAPI app from the main module
from main import app, supabase_client

# Test data
test_user = {
    "email": "test@example.com",
    "password": "Password123!",
    "first_name": "Test",
    "last_name": "User",
}

@pytest.fixture
def mock_supabase():
    """Fixture to mock the Supabase client."""
    mock = AsyncMock()
    
    # Mock the fluent API (table, select, eq, insert, etc.)
    mock.table.return_value.select.return_value.eq.return_value.execute = AsyncMock()
    mock.table.return_value.insert.return_value.execute = AsyncMock()
    
    return mock

@pytest.mark.asyncio
async def test_register_user_success(mock_supabase):
    """Test successful user registration."""
    with patch('main.supabase_client', mock_supabase):
        # Mock that the user does not exist
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
        
        # Mock the insert response
        mock_supabase.table.return_value.insert.return_value.execute.return_value.data = [
            {
                "id": "some-uuid",
                **test_user,
                "is_active": True,
                "email_verified": False,
                "created_at": "2025-10-06T12:00:00",
                "updated_at": "2025-10-06T12:00:00",
            }
        ]

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.post("/register", json=test_user)

        assert response.status_code == 200
        data = response.json()
        assert data["user"]["email"] == test_user["email"]
        assert "access_token" in data
        assert "refresh_token" in data

@pytest.mark.asyncio
async def test_register_existing_user(mock_supabase):
    """Test registration with an email that already exists."""
    with patch('main.supabase_client', mock_supabase):
        # Mock that the user *does* exist
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": "some-uuid"}]

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.post("/register", json=test_user)

        assert response.status_code == 400
        assert response.json()["detail"] == "User with this email already exists"

@pytest.mark.asyncio
async def test_login_user_success(mock_supabase):
    """Test successful user login."""
    hashed_password = "$2b$12$EixZaYVK1xKIv.X2a/E93u2YpBCe2v5a2z.N5Rz9i.G.f.sB5f1/." # "Password123!"
    
    with patch('main.supabase_client', mock_supabase):
        # Mock the user lookup
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
            {
                "id": "some-uuid",
                "email": test_user["email"],
                "password_hash": hashed_password,
                "first_name": "Test",
                "last_name": "User",
                "phone": None,
                "role": "customer",
                "property_id": None,
                "is_active": True,
                "email_verified": False,
                "created_at": "2025-10-06T12:00:00",
                "updated_at": "2025-10-06T12:00:00",
            }
        ]
        # Mock the update call for last_login
        mock_supabase.table.return_value.update.return_value.eq.return_value.execute = AsyncMock()

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.post("/login", json={"email": test_user["email"], "password": test_user["password"]})

        assert response.status_code == 200
        data = response.json()
        assert data["user"]["email"] == test_user["email"]
        assert "access_token" in data

@pytest.mark.asyncio
async def test_login_user_incorrect_password(mock_supabase):
    """Test login with an incorrect password."""
    hashed_password = "$2b$12$EixZaYVK1xKIv.X2a/E93u2YpBCe2v5a2z.N5Rz9i.G.f.sB5f1/." # "Password123!"
    
    with patch('main.supabase_client', mock_supabase):
        # Mock the user lookup
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
            {
                "id": "some-uuid",
                "email": test_user["email"],
                "password_hash": hashed_password,
                "is_active": True,
            }
        ]

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.post("/login", json={"email": test_user["email"], "password": "WrongPassword!"})

        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid email or password"
