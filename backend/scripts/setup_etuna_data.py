#!/usr/bin/env python3
"""
Etuna Data Setup Script

This script sets up the Etuna Guesthouse data in the database
by running the migration SQL file.
"""

import asyncio
import os
import sys
from pathlib import Path

import asyncpg

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from config import settings


async def setup_etuna_data():
    """Set up Etuna data in the database."""

    # Database connection parameters
    db_params = {
        "host": settings.DATABASE_HOST,
        "port": settings.DATABASE_PORT,
        "user": settings.DATABASE_USER,
        "password": settings.DATABASE_PASSWORD,
        "database": settings.DATABASE_NAME,
    }

    try:
        # Connect to the database
        print("Connecting to database...")
        conn = await asyncpg.connect(**db_params)

        # Read the migration SQL file
        migration_file = (
            backend_dir
            / "sql"
            / "custom_migrations"
            / "001_create_etuna_property_data.sql"
        )

        if not migration_file.exists():
            print(f"Migration file not found: {migration_file}")
            return False

        print(f"Reading migration file: {migration_file}")
        with open(migration_file, "r") as f:
            migration_sql = f.read()

        # Execute the migration
        print("Executing migration...")
        await conn.execute(migration_sql)

        print("✅ Etuna data setup completed successfully!")

        # Verify the data was inserted
        print("\nVerifying data insertion...")

        # Check property
        property_count = await conn.fetchval(
            "SELECT COUNT(*) FROM hospitality_properties WHERE property_id = 1"
        )
        print(f"Properties inserted: {property_count}")

        # Check room types
        room_types_count = await conn.fetchval(
            "SELECT COUNT(*) FROM room_types WHERE property_id = 1"
        )
        print(f"Room types inserted: {room_types_count}")

        # Check menu items
        menu_items_count = await conn.fetchval(
            "SELECT COUNT(*) FROM menu WHERE property_id = 1"
        )
        print(f"Menu items inserted: {menu_items_count}")

        # Check services
        transportation_count = await conn.fetchval(
            "SELECT COUNT(*) FROM transportation_services WHERE property_id = 1"
        )
        recreation_count = await conn.fetchval(
            "SELECT COUNT(*) FROM recreation_services WHERE property_id = 1"
        )
        specialized_count = await conn.fetchval(
            "SELECT COUNT(*) FROM specialized_services WHERE property_id = 1"
        )

        print(f"Transportation services inserted: {transportation_count}")
        print(f"Recreation services inserted: {recreation_count}")
        print(f"Specialized services inserted: {specialized_count}")

        # Check rooms
        rooms_count = await conn.fetchval(
            "SELECT COUNT(*) FROM rooms WHERE property_id = 1"
        )
        print(f"Rooms inserted: {rooms_count}")

        # Check reservations
        reservations_count = await conn.fetchval(
            "SELECT COUNT(*) FROM room_reservations WHERE property_id = 1"
        )
        print(f"Sample reservations inserted: {reservations_count}")

        # Check orders
        orders_count = await conn.fetchval(
            "SELECT COUNT(*) FROM orders WHERE property_id = 1"
        )
        print(f"Sample orders inserted: {orders_count}")

        # Check admin user
        admin_user = await conn.fetchval(
            "SELECT email FROM users WHERE user_id = 'etuna-admin-001'"
        )
        if admin_user:
            print(f"Admin user created: {admin_user}")
        else:
            print("❌ Admin user not found")

        await conn.close()
        return True

    except Exception as e:
        print(f"❌ Error setting up Etuna data: {e}")
        return False


async def main():
    """Main function."""
    print("🏨 Setting up Etuna Guesthouse data...")
    print("=" * 50)

    success = await setup_etuna_data()

    if success:
        print("\n🎉 Etuna data setup completed successfully!")
        print("\nYou can now:")
        print("1. Start the backend server: python -m uvicorn main:app --reload")
        print("2. Visit the Etuna showcase: http://localhost:3000/guest/etuna")
        print(
            "3. Access the admin dashboard: http://localhost:3000/protected/etuna/dashboard"
        )
        print("4. Login with admin@etunaguesthouse.com / etuna123")
    else:
        print("\n❌ Etuna data setup failed!")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
