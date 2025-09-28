from uuid import uuid4

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from database import Base, engine, get_db
from main import app
from models.hr_payroll import (BenefitEnrollment, Employee, PayrollRecord,
                               TaxDetail)
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
        email="admin@example.com",
        name="Admin User",
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


# --- Employee Tests ---
@pytest.mark.asyncio
async def test_create_employee(
    client: AsyncClient, auth_headers: dict, admin_user: User
):
    employee_data = {
        "user_id": str(uuid4()),
        "first_name": "Test",
        "last_name": "Employee",
        "email": "test.employee@example.com",
        "job_title": "Waiter",
        "department": "Restaurant",
        "salary": 30000.00,
    }
    response = await client.post(
        "/hr-payroll/employees", json=employee_data, headers=auth_headers
    )
    assert response.status_code == 201
    assert response.json()["email"] == employee_data["email"]


@pytest.mark.asyncio
async def test_get_employees(client: AsyncClient, auth_headers: dict, admin_user: User):
    # Create an employee first
    employee_data = {
        "user_id": str(uuid4()),
        "first_name": "Test",
        "last_name": "Employee",
        "email": "test.employee2@example.com",
        "job_title": "Waiter",
        "department": "Restaurant",
        "salary": 30000.00,
    }
    await client.post("/hr-payroll/employees", json=employee_data, headers=auth_headers)

    response = await client.get("/hr-payroll/employees", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) > 0


@pytest.mark.asyncio
async def test_get_employee(client: AsyncClient, auth_headers: dict, admin_user: User):
    employee_data = {
        "user_id": str(uuid4()),
        "first_name": "Test",
        "last_name": "Employee",
        "email": "test.employee3@example.com",
        "job_title": "Waiter",
        "department": "Restaurant",
        "salary": 30000.00,
    }
    create_response = await client.post(
        "/hr-payroll/employees", json=employee_data, headers=auth_headers
    )
    employee_id = create_response.json()["id"]

    response = await client.get(
        f"/hr-payroll/employees/{employee_id}", headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["id"] == employee_id


@pytest.mark.asyncio
async def test_update_employee(
    client: AsyncClient, auth_headers: dict, admin_user: User
):
    employee_data = {
        "user_id": str(uuid4()),
        "first_name": "Test",
        "last_name": "Employee",
        "email": "test.employee4@example.com",
        "job_title": "Waiter",
        "department": "Restaurant",
        "salary": 30000.00,
    }
    create_response = await client.post(
        "/hr-payroll/employees", json=employee_data, headers=auth_headers
    )
    employee_id = create_response.json()["id"]

    update_data = {"job_title": "Senior Waiter", "salary": 35000.00}
    response = await client.put(
        f"/hr-payroll/employees/{employee_id}", json=update_data, headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["job_title"] == update_data["job_title"]
    assert response.json()["salary"] == update_data["salary"]


@pytest.mark.asyncio
async def test_delete_employee(
    client: AsyncClient, auth_headers: dict, admin_user: User
):
    employee_data = {
        "user_id": str(uuid4()),
        "first_name": "Test",
        "last_name": "Employee",
        "email": "test.employee5@example.com",
        "job_title": "Waiter",
        "department": "Restaurant",
        "salary": 30000.00,
    }
    create_response = await client.post(
        "/hr-payroll/employees", json=employee_data, headers=auth_headers
    )
    employee_id = create_response.json()["id"]

    response = await client.delete(
        f"/hr-payroll/employees/{employee_id}", headers=auth_headers
    )
    assert response.status_code == 204

    get_response = await client.get(
        f"/hr-payroll/employees/{employee_id}", headers=auth_headers
    )
    assert get_response.status_code == 404


# --- Payroll Record Tests ---
@pytest.mark.asyncio
async def test_create_payroll_record(
    client: AsyncClient, auth_headers: dict, admin_user: User, db_session: AsyncSession
):
    employee_id = str(uuid4())
    employee = Employee(
        id=employee_id,
        user_id=uuid4(),
        first_name="P",
        last_name="R",
        email="pr@example.com",
    )
    db_session.add(employee)
    await db_session.commit()
    await db_session.refresh(employee)

    payroll_data = {
        "employee_id": employee_id,
        "pay_period_start": "2025-01-01",
        "pay_period_end": "2025-01-15",
        "gross_pay": 1500.00,
        "net_pay": 1200.00,
    }
    response = await client.post(
        "/hr-payroll/payroll-records", json=payroll_data, headers=auth_headers
    )
    assert response.status_code == 201
    assert response.json()["gross_pay"] == payroll_data["gross_pay"]


# Add more tests for PayrollRecord, TaxDetail, BenefitEnrollment CRUD operations
