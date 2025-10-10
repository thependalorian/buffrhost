"""
Database Configuration and Connection Management
Supports PostgreSQL, MySQL, and SQLite with connection pooling
"""

from sqlalchemy import create_engine, event, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool, StaticPool
from sqlalchemy.engine import Engine
from contextlib import asynccontextmanager
from typing import Generator, AsyncGenerator
import logging
import time

from config import settings

logger = logging.getLogger(__name__)

# Database engine configuration
def create_database_engine() -> Engine:
    """Create database engine with appropriate configuration"""
    
    # Engine arguments based on database type
    engine_args = {
        "echo": settings.DATABASE_ECHO,
        "future": True,
    }
    
    # Add connection pooling for non-SQLite databases
    if not settings.DATABASE_URL.startswith("sqlite"):
        engine_args.update({
            "poolclass": QueuePool,
            "pool_size": settings.DATABASE_POOL_SIZE,
            "max_overflow": settings.DATABASE_MAX_OVERFLOW,
            "pool_pre_ping": True,
            "pool_recycle": 3600,  # Recycle connections after 1 hour
        })
    else:
        # SQLite specific configuration
        engine_args.update({
            "poolclass": StaticPool,
            "connect_args": {"check_same_thread": False},
        })
    
    # Create engine
    engine = create_engine(settings.DATABASE_URL, **engine_args)
    
    # Add connection event listeners
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        """Set SQLite pragmas for better performance"""
        if settings.DATABASE_URL.startswith("sqlite"):
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.execute("PRAGMA journal_mode=WAL")
            cursor.execute("PRAGMA synchronous=NORMAL")
            cursor.execute("PRAGMA cache_size=1000")
            cursor.execute("PRAGMA temp_store=MEMORY")
            cursor.close()
    
    @event.listens_for(engine, "before_cursor_execute")
    def receive_before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
        """Log slow queries"""
        context._query_start_time = time.time()
    
    @event.listens_for(engine, "after_cursor_execute")
    def receive_after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
        """Log slow queries"""
        total = time.time() - context._query_start_time
        if total > 1.0:  # Log queries taking more than 1 second
            logger.warning(f"Slow query detected: {total:.2f}s - {statement[:100]}...")
    
    return engine

# Create engine
engine = create_database_engine()

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """
    Dependency to get database session
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

async def get_async_db() -> AsyncGenerator[Session, None]:
    """
    Async dependency to get database session
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Async database session error: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

def create_tables():
    """Create all database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create database tables: {str(e)}")
        raise

def drop_tables():
    """Drop all database tables (use with caution!)"""
    try:
        Base.metadata.drop_all(bind=engine)
        logger.warning("All database tables dropped")
    except Exception as e:
        logger.error(f"Failed to drop database tables: {str(e)}")
        raise

def check_database_connection() -> bool:
    """Check if database connection is working"""
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        logger.info("Database connection successful")
        return True
    except Exception as e:
        logger.error(f"Database connection failed: {str(e)}")
        return False

def get_database_info() -> dict:
    """Get database information and statistics"""
    try:
        with engine.connect() as connection:
            # Get database version
            if settings.DATABASE_URL.startswith("postgresql"):
                result = connection.execute(text("SELECT version()"))
                version = result.scalar()
            elif settings.DATABASE_URL.startswith("mysql"):
                result = connection.execute(text("SELECT VERSION()"))
                version = result.scalar()
            elif settings.DATABASE_URL.startswith("sqlite"):
                result = connection.execute(text("SELECT sqlite_version()"))
                version = result.scalar()
            else:
                version = "Unknown"
            
            # Get connection pool info
            pool = engine.pool
            pool_info = {
                "size": pool.size(),
                "checked_in": pool.checkedin(),
                "checked_out": pool.checkedout(),
                "overflow": pool.overflow(),
                "invalid": pool.invalid(),
            }
            
            return {
                "url": settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else settings.DATABASE_URL,
                "version": version,
                "pool": pool_info,
                "echo": settings.DATABASE_ECHO,
            }
    except Exception as e:
        logger.error(f"Failed to get database info: {str(e)}")
        return {"error": str(e)}

def close_db():
    """Close database connections"""
    try:
        engine.dispose()
        logger.info("Database connections closed")
    except Exception as e:
        logger.error(f"Failed to close database connections: {str(e)}")

# Database health check
def health_check() -> dict:
    """Perform database health check"""
    try:
        start_time = time.time()
        
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        
        response_time = (time.time() - start_time) * 1000  # Convert to milliseconds
        
        return {
            "status": "healthy",
            "response_time_ms": round(response_time, 2),
            "database": get_database_info()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "database": None
        }

# Transaction management
class DatabaseTransaction:
    """Context manager for database transactions"""
    
    def __init__(self, db: Session):
        self.db = db
        self._transaction = None
    
    def __enter__(self):
        self._transaction = self.db.begin()
        return self.db
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            self._transaction.rollback()
            logger.error(f"Transaction rolled back due to error: {exc_val}")
        else:
            self._transaction.commit()
            logger.debug("Transaction committed successfully")

def get_transaction(db: Session) -> DatabaseTransaction:
    """Get a database transaction context manager"""
    return DatabaseTransaction(db)

# Database utilities
def execute_raw_sql(query: str, params: dict = None) -> list:
    """Execute raw SQL query"""
    try:
        with engine.connect() as connection:
            result = connection.execute(text(query), params or {})
            return [dict(row) for row in result]
    except Exception as e:
        logger.error(f"Failed to execute raw SQL: {str(e)}")
        raise

def bulk_insert(table_name: str, data: list) -> int:
    """Bulk insert data into table"""
    try:
        with engine.connect() as connection:
            # This is a simplified version - in production, use proper bulk insert
            inserted_count = 0
            for row in data:
                connection.execute(text(f"INSERT INTO {table_name} VALUES ({','.join([':' + k for k in row.keys()])})"), row)
                inserted_count += 1
            connection.commit()
            return inserted_count
    except Exception as e:
        logger.error(f"Failed to bulk insert: {str(e)}")
        raise

# Migration utilities
def get_table_names() -> list:
    """Get list of all table names"""
    try:
        return list(Base.metadata.tables.keys())
    except Exception as e:
        logger.error(f"Failed to get table names: {str(e)}")
        return []

def table_exists(table_name: str) -> bool:
    """Check if table exists"""
    try:
        with engine.connect() as connection:
            if settings.DATABASE_URL.startswith("postgresql"):
                result = connection.execute(text(
                    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table_name)"
                ), {"table_name": table_name})
            elif settings.DATABASE_URL.startswith("mysql"):
                result = connection.execute(text(
                    "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = :table_name"
                ), {"table_name": table_name})
            elif settings.DATABASE_URL.startswith("sqlite"):
                result = connection.execute(text(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name=:table_name"
                ), {"table_name": table_name})
            else:
                return False
            
            return bool(result.scalar())
    except Exception as e:
        logger.error(f"Failed to check if table exists: {str(e)}")
        return False

# Initialize database on import
if __name__ == "__main__":
    # Test database connection
    if check_database_connection():
        print("✅ Database connection successful")
        print(f"📊 Database info: {get_database_info()}")
    else:
        print("❌ Database connection failed")