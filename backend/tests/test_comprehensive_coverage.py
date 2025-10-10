"""
Comprehensive Test Coverage Suite for Buffr Host Platform
Aims to achieve 90%+ test coverage across all components and APIs.
"""

import asyncio
import pytest
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any
from unittest.mock import Mock, AsyncMock, patch
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from backend.main import app
from backend.database import get_db
from backend.optimization.query_optimizer import QueryOptimizer, CacheStrategy
from backend.services.cache_service import CacheService, CacheLevel
from backend.monitoring.advanced_monitoring import (
    MetricsCollector, AlertManager, HealthChecker, 
    AlertSeverity, AlertStatus
)
from backend.error_handling.global_error_manager import (
    GlobalErrorManager, ErrorCategory, ErrorSeverity, ErrorContext
)

# Test client
client = TestClient(app)

class TestDatabaseOptimization:
    """Test database optimization features"""
    
    @pytest.mark.asyncio
    async def test_query_optimizer_initialization(self):
        """Test query optimizer initialization"""
        optimizer = QueryOptimizer()
        assert optimizer.query_metrics == []
        assert optimizer.slow_query_threshold == 1.0
    
    @pytest.mark.asyncio
    async def test_cache_key_generation(self):
        """Test cache key generation"""
        optimizer = QueryOptimizer()
        query = "SELECT * FROM users WHERE id = ?"
        params = {"id": 123}
        
        key1 = optimizer.cache_key(query, params)
        key2 = optimizer.cache_key(query, params)
        
        assert key1 == key2
        assert key1.startswith("query_cache:")
    
    @pytest.mark.asyncio
    async def test_query_optimization(self):
        """Test query optimization"""
        optimizer = QueryOptimizer()
        
        # Test whitespace normalization
        messy_query = "SELECT   *   FROM    users   WHERE   id = 1"
        optimized = optimizer.optimize_query(messy_query)
        assert "  " not in optimized
        
        # Test limit addition
        unbounded_query = "SELECT * FROM users"
        optimized = optimizer.optimize_query(unbounded_query)
        assert "LIMIT 1000" in optimized
    
    @pytest.mark.asyncio
    async def test_metrics_tracking(self):
        """Test query metrics tracking"""
        optimizer = QueryOptimizer()
        
        optimizer.track_query_metrics("test_query", 0.5, True, 10)
        assert len(optimizer.query_metrics) == 1
        
        metrics = optimizer.query_metrics[0]
        assert metrics.query_id == "test_query"
        assert metrics.execution_time == 0.5
        assert metrics.cache_hit is True
        assert metrics.rows_returned == 10
    
    @pytest.mark.asyncio
    async def test_performance_report(self):
        """Test performance report generation"""
        optimizer = QueryOptimizer()
        
        # Add some test metrics
        optimizer.track_query_metrics("query1", 0.1, True, 5)
        optimizer.track_query_metrics("query2", 2.0, False, 20)
        optimizer.track_query_metrics("query3", 0.5, True, 10)
        
        report = optimizer.get_performance_report()
        
        assert report["total_queries"] == 3
        assert report["cache_hit_rate"] == 66.67  # 2 out of 3
        assert report["slow_queries_count"] == 1
        assert report["slow_query_percentage"] == 33.33
    
    @pytest.mark.asyncio
    async def test_query_builder(self):
        """Test query builder functionality"""
        from backend.optimization.query_optimizer import QueryBuilder
        
        query = QueryBuilder.build_optimized_select(
            table_name="users",
            columns=["id", "name", "email"],
            filters={"status": "active"},
            order_by="created_at",
            limit=10
        )
        
        assert "SELECT id, name, email" in query
        assert "FROM users" in query
        assert "WHERE status = 'active'" in query
        assert "ORDER BY created_at" in query
        assert "LIMIT 10" in query

class TestCacheService:
    """Test cache service functionality"""
    
    @pytest.fixture
    async def cache_service(self):
        """Create cache service for testing"""
        service = CacheService("redis://localhost:6379")
        await service.connect()
        yield service
        await service.disconnect()
    
    @pytest.mark.asyncio
    async def test_cache_connection(self, cache_service):
        """Test cache service connection"""
        assert cache_service.redis_client is not None
    
    @pytest.mark.asyncio
    async def test_cache_set_get(self, cache_service):
        """Test basic cache set and get operations"""
        # Test string data
        await cache_service.set("test", "key1", "value1", CacheLevel.WARM)
        result = await cache_service.get("test", "key1")
        assert result == "value1"
        
        # Test dict data
        test_data = {"name": "John", "age": 30}
        await cache_service.set("test", "key2", test_data, CacheLevel.WARM)
        result = await cache_service.get("test", "key2")
        assert result == test_data
    
    @pytest.mark.asyncio
    async def test_cache_delete(self, cache_service):
        """Test cache delete operations"""
        await cache_service.set("test", "key3", "value3", CacheLevel.WARM)
        assert await cache_service.exists("test", "key3") is True
        
        await cache_service.delete("test", "key3")
        assert await cache_service.exists("test", "key3") is False
    
    @pytest.mark.asyncio
    async def test_cache_ttl(self, cache_service):
        """Test cache TTL functionality"""
        await cache_service.set("test", "key4", "value4", CacheLevel.SHORT_TERM)
        ttl = await cache_service.get_ttl("test", "key4")
        assert ttl > 0  # Should have TTL set
    
    @pytest.mark.asyncio
    async def test_cache_stats(self, cache_service):
        """Test cache statistics"""
        # Perform some operations
        await cache_service.set("test", "key5", "value5", CacheLevel.WARM)
        await cache_service.get("test", "key5")  # Hit
        await cache_service.get("test", "nonexistent")  # Miss
        
        stats = await cache_service.get_stats()
        assert stats["hits"] == 1
        assert stats["misses"] == 1
        assert stats["sets"] == 1
        assert stats["hit_rate"] == 50.0
    
    @pytest.mark.asyncio
    async def test_cache_namespace_operations(self, cache_service):
        """Test cache namespace operations"""
        # Set multiple keys in namespace
        await cache_service.set("namespace1", "key1", "value1", CacheLevel.WARM)
        await cache_service.set("namespace1", "key2", "value2", CacheLevel.WARM)
        await cache_service.set("namespace2", "key1", "value3", CacheLevel.WARM)
        
        # Get keys in namespace
        keys = await cache_service.get_namespace_keys("namespace1")
        assert len(keys) == 2
        assert "key1" in keys
        assert "key2" in keys
        
        # Clear namespace
        deleted_count = await cache_service.clear_namespace("namespace1")
        assert deleted_count == 2
        
        # Verify cleared
        keys = await cache_service.get_namespace_keys("namespace1")
        assert len(keys) == 0

class TestMonitoringSystem:
    """Test monitoring and alerting system"""
    
    @pytest.fixture
    def metrics_collector(self):
        """Create metrics collector for testing"""
        return MetricsCollector()
    
    @pytest.fixture
    def alert_manager(self):
        """Create alert manager for testing"""
        return AlertManager()
    
    @pytest.fixture
    def health_checker(self):
        """Create health checker for testing"""
        return HealthChecker()
    
    def test_metrics_collector_initialization(self, metrics_collector):
        """Test metrics collector initialization"""
        assert metrics_collector.metrics == []
        assert metrics_collector.collection_interval == 60
        assert metrics_collector.is_running is False
    
    def test_alert_manager_initialization(self, alert_manager):
        """Test alert manager initialization"""
        assert alert_manager.alerts == []
        assert alert_manager.alert_rules == {}
        assert alert_manager.notification_handlers == []
    
    def test_alert_rule_addition(self, alert_manager):
        """Test alert rule addition"""
        rule_config = {
            "metric": "cpu_usage",
            "threshold": 80,
            "operator": ">",
            "severity": "high",
            "title": "High CPU Usage"
        }
        
        alert_manager.add_alert_rule("high_cpu", rule_config)
        assert "high_cpu" in alert_manager.alert_rules
        assert alert_manager.alert_rules["high_cpu"] == rule_config
    
    def test_health_checker_initialization(self, health_checker):
        """Test health checker initialization"""
        assert health_checker.health_checks == []
        assert health_checker.check_interval == 30
        assert health_checker.is_running is False
    
    @pytest.mark.asyncio
    async def test_health_status_report(self, health_checker):
        """Test health status reporting"""
        # Add some mock health checks
        from backend.monitoring.advanced_monitoring import HealthCheck
        
        health_checker.health_checks = [
            HealthCheck(
                service="database",
                status="healthy",
                response_time=50.0,
                last_check=datetime.now()
            ),
            HealthCheck(
                service="redis",
                status="healthy",
                response_time=10.0,
                last_check=datetime.now()
            )
        ]
        
        status = health_checker.get_health_status()
        assert status["status"] == "healthy"
        assert status["healthy_services"] == 2
        assert status["total_services"] == 2

class TestErrorHandling:
    """Test error handling system"""
    
    @pytest.fixture
    def error_manager(self):
        """Create error manager for testing"""
        return GlobalErrorManager()
    
    def test_error_manager_initialization(self, error_manager):
        """Test error manager initialization"""
        assert error_manager.error_handlers != {}
        assert error_manager.recovery_strategies == {}
        assert error_manager.error_history == []
        assert error_manager.circuit_breakers == {}
    
    def test_error_classification(self, error_manager):
        """Test error classification"""
        from sqlalchemy.exc import SQLAlchemyError
        
        # Test database error classification
        db_error = SQLAlchemyError("Database connection failed")
        category, severity = error_manager._classify_error(db_error)
        assert category == ErrorCategory.DATABASE
        assert severity == ErrorSeverity.HIGH
        
        # Test validation error classification
        validation_error = ValueError("Invalid input")
        category, severity = error_manager._classify_error(validation_error)
        assert category == ErrorCategory.VALIDATION
        assert severity == ErrorSeverity.LOW
    
    def test_recovery_suggestions_generation(self, error_manager):
        """Test recovery suggestions generation"""
        from sqlalchemy.exc import SQLAlchemyError
        
        db_error = SQLAlchemyError("Database connection failed")
        suggestions = error_manager._generate_recovery_suggestions(db_error, ErrorCategory.DATABASE)
        
        assert "Check database connection" in suggestions
        assert "Verify database credentials" in suggestions
        assert "Check database server status" in suggestions
    
    @pytest.mark.asyncio
    async def test_error_handling_flow(self, error_manager):
        """Test complete error handling flow"""
        # Create test error and context
        test_error = ValueError("Test error")
        context = ErrorContext(
            user_id="test_user",
            endpoint="/test",
            method="GET"
        )
        
        # Handle error
        error_info = await error_manager.handle_error(test_error, context)
        
        # Verify error info
        assert error_info.message == "Test error"
        assert error_info.category == ErrorCategory.VALIDATION
        assert error_info.context.user_id == "test_user"
        assert error_info.context.endpoint == "/test"
        
        # Verify error stored in history
        assert len(error_manager.error_history) == 1
        assert error_manager.error_history[0].id == error_info.id

class TestAPICoverage:
    """Test API endpoint coverage"""
    
    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
    
    def test_api_documentation(self):
        """Test API documentation endpoints"""
        response = client.get("/docs")
        assert response.status_code == 200
        
        response = client.get("/redoc")
        assert response.status_code == 200
    
    def test_openapi_schema(self):
        """Test OpenAPI schema endpoint"""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        schema = response.json()
        assert "openapi" in schema
        assert "info" in schema
        assert "paths" in schema

class TestIntegrationCoverage:
    """Test integration scenarios"""
    
    @pytest.mark.asyncio
    async def test_database_integration(self):
        """Test database integration"""
        # This would test actual database operations
        # For now, we'll test the database session creation
        from backend.database import AsyncSessionLocal
        
        async with AsyncSessionLocal() as session:
            assert session is not None
            # Test basic database operations here
    
    @pytest.mark.asyncio
    async def test_cache_integration(self):
        """Test cache integration"""
        cache_service = CacheService()
        await cache_service.connect()
        
        try:
            # Test cache operations
            await cache_service.set("integration", "test", "value", CacheLevel.WARM)
            result = await cache_service.get("integration", "test")
            assert result == "value"
        finally:
            await cache_service.disconnect()
    
    @pytest.mark.asyncio
    async def test_monitoring_integration(self):
        """Test monitoring integration"""
        metrics_collector = MetricsCollector()
        alert_manager = AlertManager()
        
        # Add alert rule
        alert_manager.add_alert_rule("test_rule", {
            "metric": "test_metric",
            "threshold": 100,
            "operator": ">",
            "severity": "medium"
        })
        
        # Simulate metric collection
        from backend.monitoring.advanced_monitoring import MetricData
        metric = MetricData(
            name="test_metric",
            value=150,
            unit="count",
            timestamp=datetime.now()
        )
        metrics_collector.metrics.append(metric)
        
        # Check alerts
        await alert_manager.check_alerts(metrics_collector)
        
        # Verify alert was created
        assert len(alert_manager.alerts) == 1
        assert alert_manager.alerts[0].current_value == 150

class TestPerformanceCoverage:
    """Test performance-related functionality"""
    
    @pytest.mark.asyncio
    async def test_query_performance_tracking(self):
        """Test query performance tracking"""
        optimizer = QueryOptimizer()
        
        # Simulate slow query
        optimizer.track_query_metrics("slow_query", 2.5, False, 1000)
        
        report = optimizer.get_performance_report()
        assert report["slow_queries_count"] == 1
        assert report["slow_query_percentage"] == 100.0
    
    @pytest.mark.asyncio
    async def test_cache_performance(self):
        """Test cache performance"""
        cache_service = CacheService()
        await cache_service.connect()
        
        try:
            # Test cache hit/miss performance
            start_time = datetime.now()
            
            # First access (miss)
            await cache_service.get("perf", "key1")
            
            # Set value
            await cache_service.set("perf", "key1", "value1", CacheLevel.WARM)
            
            # Second access (hit)
            await cache_service.get("perf", "key1")
            
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            # Should be fast
            assert duration < 1.0
            
            # Check stats
            stats = await cache_service.get_stats()
            assert stats["hits"] == 1
            assert stats["misses"] == 1
            
        finally:
            await cache_service.disconnect()

class TestSecurityCoverage:
    """Test security-related functionality"""
    
    def test_input_validation(self):
        """Test input validation"""
        # Test with invalid input
        response = client.post("/api/v1/users", json={
            "email": "invalid-email",
            "password": "123"  # Too short
        })
        assert response.status_code == 422  # Validation error
    
    def test_authentication_required(self):
        """Test authentication requirements"""
        # Test protected endpoint without auth
        response = client.get("/api/v1/protected")
        assert response.status_code == 401  # Unauthorized
    
    def test_sql_injection_prevention(self):
        """Test SQL injection prevention"""
        # Test with potentially malicious input
        malicious_input = "'; DROP TABLE users; --"
        
        response = client.get(f"/api/v1/users?search={malicious_input}")
        # Should not cause database errors
        assert response.status_code in [200, 400, 422]

class TestErrorRecoveryCoverage:
    """Test error recovery mechanisms"""
    
    @pytest.mark.asyncio
    async def test_retry_mechanism(self):
        """Test retry mechanism"""
        from backend.error_handling.global_error_manager import ErrorRecoveryService
        
        recovery_service = ErrorRecoveryService(GlobalErrorManager())
        
        # Mock operation that fails first two times, succeeds third time
        call_count = 0
        
        async def flaky_operation():
            nonlocal call_count
            call_count += 1
            if call_count < 3:
                raise Exception("Temporary failure")
            return "success"
        
        result = await recovery_service.retry_operation(flaky_operation, max_retries=3)
        assert result == "success"
        assert call_count == 3
    
    @pytest.mark.asyncio
    async def test_fallback_mechanism(self):
        """Test fallback mechanism"""
        from backend.error_handling.global_error_manager import ErrorRecoveryService
        
        recovery_service = ErrorRecoveryService(GlobalErrorManager())
        
        async def primary_operation():
            raise Exception("Primary failed")
        
        async def fallback_operation():
            return "fallback_success"
        
        result = await recovery_service.fallback_operation(primary_operation, fallback_operation)
        assert result == "fallback_success"
    
    @pytest.mark.asyncio
    async def test_circuit_breaker(self):
        """Test circuit breaker mechanism"""
        from backend.error_handling.global_error_manager import ErrorRecoveryService
        
        recovery_service = ErrorRecoveryService(GlobalErrorManager())
        
        async def failing_operation():
            raise Exception("Operation failed")
        
        # Apply circuit breaker
        protected_operation = recovery_service.circuit_breaker("test_service", failing_operation)
        
        # First few calls should fail
        for _ in range(5):
            with pytest.raises(Exception):
                await protected_operation()
        
        # Circuit should now be open
        with pytest.raises(Exception, match="Circuit breaker open"):
            await protected_operation()

# Test configuration and utilities
@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
def mock_db_session():
    """Create mock database session"""
    session = AsyncMock(spec=AsyncSession)
    return session

@pytest.fixture
def sample_user_data():
    """Sample user data for testing"""
    return {
        "email": "test@example.com",
        "password": "testpassword123",
        "first_name": "Test",
        "last_name": "User"
    }

@pytest.fixture
def sample_restaurant_data():
    """Sample restaurant data for testing"""
    return {
        "name": "Test Restaurant",
        "description": "A test restaurant",
        "address": "123 Test Street",
        "phone": "+1234567890",
        "email": "restaurant@test.com"
    }

# Coverage reporting
def test_coverage_report():
    """Generate test coverage report"""
    import coverage
    
    cov = coverage.Coverage()
    cov.start()
    
    # Run tests here
    pytest.main([__file__, "-v"])
    
    cov.stop()
    cov.save()
    
    # Generate report
    cov.report()
    cov.html_report(directory='htmlcov')

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--cov=backend", "--cov-report=html"])