"""
Performance tests for API endpoints
"""
import pytest
import time
import asyncio
from fastapi.testclient import TestClient
from concurrent.futures import ThreadPoolExecutor
import statistics

class TestAPIPerformance:
    """Test API performance and response times."""
    
    def test_health_check_performance(self, client: TestClient):
        """Test health check endpoint performance."""
        start_time = time.time()
        response = client.get("/health")
        end_time = time.time()
        
        response_time = end_time - start_time
        assert response.status_code == 200
        assert response_time < 0.1  # Should respond within 100ms
    
    def test_properties_list_performance(self, client: TestClient, sample_hospitality_property):
        """Test properties list endpoint performance."""
        start_time = time.time()
        response = client.get("/api/v1/properties/")
        end_time = time.time()
        
        response_time = end_time - start_time
        assert response.status_code == 200
        assert response_time < 0.5  # Should respond within 500ms
    
    def test_property_detail_performance(self, client: TestClient, sample_hospitality_property):
        """Test property detail endpoint performance."""
        start_time = time.time()
        response = client.get(f"/api/v1/properties/{sample_hospitality_property.id}")
        end_time = time.time()
        
        response_time = end_time - start_time
        assert response.status_code == 200
        assert response_time < 0.3  # Should respond within 300ms
    
    def test_booking_creation_performance(self, client: TestClient, sample_customer, sample_room):
        """Test booking creation performance."""
        booking_data = {
            "customer_id": sample_customer.id,
            "room_id": sample_room.id,
            "check_in_date": "2024-02-15",
            "check_out_date": "2024-02-17",
            "number_of_guests": 2,
            "total_amount": 1000.00,
            "status": "confirmed"
        }
        
        start_time = time.time()
        response = client.post("/api/v1/bookings/", json=booking_data)
        end_time = time.time()
        
        response_time = end_time - start_time
        assert response.status_code == 201
        assert response_time < 1.0  # Should respond within 1 second
    
    def test_concurrent_requests_performance(self, client: TestClient):
        """Test performance under concurrent requests."""
        def make_request():
            return client.get("/health")
        
        # Test with 10 concurrent requests
        with ThreadPoolExecutor(max_workers=10) as executor:
            start_time = time.time()
            futures = [executor.submit(make_request) for _ in range(10)]
            responses = [future.result() for future in futures]
            end_time = time.time()
        
        total_time = end_time - start_time
        assert all(response.status_code == 200 for response in responses)
        assert total_time < 2.0  # All requests should complete within 2 seconds
    
    def test_database_query_performance(self, client: TestClient, sample_hospitality_property):
        """Test database query performance."""
        # Test complex query performance
        start_time = time.time()
        response = client.get(f"/api/v1/properties/{sample_hospitality_property.id}/analytics")
        end_time = time.time()
        
        response_time = end_time - start_time
        assert response.status_code == 200
        assert response_time < 2.0  # Complex queries should complete within 2 seconds
    
    def test_pagination_performance(self, client: TestClient):
        """Test pagination performance with large datasets."""
        # Create multiple properties for pagination testing
        for i in range(100):
            property_data = {
                "name": f"Test Hotel {i}",
                "property_type": "hotel",
                "status": "active"
            }
            client.post("/api/v1/properties/", json=property_data)
        
        # Test pagination performance
        start_time = time.time()
        response = client.get("/api/v1/properties/?page=1&limit=50")
        end_time = time.time()
        
        response_time = end_time - start_time
        assert response.status_code == 200
        assert response_time < 1.0  # Pagination should be fast
    
    def test_search_performance(self, client: TestClient):
        """Test search functionality performance."""
        start_time = time.time()
        response = client.get("/api/v1/properties/?search=Test")
        end_time = time.time()
        
        response_time = end_time - start_time
        assert response.status_code == 200
        assert response_time < 1.0  # Search should be fast
    
    def test_authentication_performance(self, client: TestClient):
        """Test authentication endpoint performance."""
        login_data = {
            "email": "test@buffr.ai",
            "password": "securepassword123"
        }
        
        start_time = time.time()
        response = client.post("/api/v1/auth/login", json=login_data)
        end_time = time.time()
        
        response_time = end_time - start_time
        assert response.status_code == 200
        assert response_time < 0.5  # Authentication should be fast
    
    def test_file_upload_performance(self, client: TestClient):
        """Test file upload performance."""
        # Test with a small file
        files = {"file": ("test.txt", b"test content", "text/plain")}
        
        start_time = time.time()
        response = client.post("/api/v1/upload", files=files)
        end_time = time.time()
        
        response_time = end_time - start_time
        assert response.status_code == 200
        assert response_time < 2.0  # File upload should be reasonable
    
    def test_api_response_size(self, client: TestClient, sample_hospitality_property):
        """Test API response size optimization."""
        response = client.get("/api/v1/properties/")
        assert response.status_code == 200
        
        # Check response size
        response_size = len(response.content)
        assert response_size < 100000  # Response should be under 100KB
    
    def test_memory_usage_under_load(self, client: TestClient):
        """Test memory usage under load."""
        import psutil
        import os
        
        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss
        
        # Make many requests
        for i in range(100):
            response = client.get("/health")
            assert response.status_code == 200
        
        final_memory = process.memory_info().rss
        memory_increase = final_memory - initial_memory
        
        # Memory increase should be reasonable (less than 10MB)
        assert memory_increase < 10 * 1024 * 1024


class TestDatabasePerformance:
    """Test database performance and optimization."""
    
    def test_database_connection_pool(self, client: TestClient):
        """Test database connection pool performance."""
        # Test multiple concurrent database operations
        def make_db_request():
            return client.get("/api/v1/properties/")
        
        with ThreadPoolExecutor(max_workers=20) as executor:
            start_time = time.time()
            futures = [executor.submit(make_db_request) for _ in range(20)]
            responses = [future.result() for future in futures]
            end_time = time.time()
        
        total_time = end_time - start_time
        assert all(response.status_code == 200 for response in responses)
        assert total_time < 3.0  # Should handle concurrent connections well
    
    def test_database_query_optimization(self, client: TestClient, sample_hospitality_property):
        """Test database query optimization."""
        # Test that queries use proper indexes
        start_time = time.time()
        response = client.get(f"/api/v1/properties/{sample_hospitality_property.id}/rooms/")
        end_time = time.time()
        
        response_time = end_time - start_time
        assert response.status_code == 200
        assert response_time < 0.5  # Indexed queries should be fast
    
    def test_database_transaction_performance(self, client: TestClient, sample_customer, sample_room):
        """Test database transaction performance."""
        booking_data = {
            "customer_id": sample_customer.id,
            "room_id": sample_room.id,
            "check_in_date": "2024-02-15",
            "check_out_date": "2024-02-17",
            "number_of_guests": 2,
            "total_amount": 1000.00,
            "status": "confirmed"
        }
        
        start_time = time.time()
        response = client.post("/api/v1/bookings/", json=booking_data)
        end_time = time.time()
        
        response_time = end_time - start_time
        assert response.status_code == 201
        assert response_time < 1.0  # Transactions should be fast


class TestCachingPerformance:
    """Test caching performance and effectiveness."""
    
    def test_response_caching(self, client: TestClient, sample_hospitality_property):
        """Test response caching performance."""
        # First request (cache miss)
        start_time = time.time()
        response1 = client.get(f"/api/v1/properties/{sample_hospitality_property.id}")
        end_time = time.time()
        first_request_time = end_time - start_time
        
        # Second request (cache hit)
        start_time = time.time()
        response2 = client.get(f"/api/v1/properties/{sample_hospitality_property.id}")
        end_time = time.time()
        second_request_time = end_time - start_time
        
        assert response1.status_code == 200
        assert response2.status_code == 200
        assert second_request_time < first_request_time  # Cached should be faster
    
    def test_static_content_caching(self, client: TestClient):
        """Test static content caching."""
        # Test that static content has proper cache headers
        response = client.get("/static/css/main.css")
        assert "cache-control" in response.headers
        assert "max-age" in response.headers["cache-control"]


class TestLoadTesting:
    """Test system behavior under load."""
    
    def test_gradual_load_increase(self, client: TestClient):
        """Test system behavior with gradual load increase."""
        response_times = []
        
        # Gradually increase load
        for num_requests in [1, 5, 10, 20, 50]:
            def make_request():
                start_time = time.time()
                response = client.get("/health")
                end_time = time.time()
                return end_time - start_time, response.status_code
            
            with ThreadPoolExecutor(max_workers=num_requests) as executor:
                futures = [executor.submit(make_request) for _ in range(num_requests)]
                results = [future.result() for future in futures]
            
            avg_response_time = statistics.mean([result[0] for result in results])
            success_rate = sum(1 for result in results if result[1] == 200) / len(results)
            
            response_times.append(avg_response_time)
            
            # Success rate should remain high
            assert success_rate >= 0.95  # 95% success rate minimum
        
        # Response times should not degrade significantly
        assert max(response_times) < 2.0  # Max response time under load
    
    def test_peak_load_handling(self, client: TestClient):
        """Test system behavior under peak load."""
        def make_request():
            return client.get("/health")
        
        # Simulate peak load
        with ThreadPoolExecutor(max_workers=100) as executor:
            start_time = time.time()
            futures = [executor.submit(make_request) for _ in range(100)]
            responses = [future.result() for future in futures]
            end_time = time.time()
        
        total_time = end_time - start_time
        success_count = sum(1 for response in responses if response.status_code == 200)
        success_rate = success_count / len(responses)
        
        assert success_rate >= 0.90  # 90% success rate under peak load
        assert total_time < 10.0  # Should handle peak load within 10 seconds
    
    def test_memory_leak_detection(self, client: TestClient):
        """Test for memory leaks under sustained load."""
        import psutil
        import os
        
        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss
        
        # Sustained load for 1000 requests
        for i in range(1000):
            response = client.get("/health")
            assert response.status_code == 200
            
            # Check memory every 100 requests
            if i % 100 == 0:
                current_memory = process.memory_info().rss
                memory_increase = current_memory - initial_memory
                
                # Memory increase should be reasonable
                assert memory_increase < 50 * 1024 * 1024  # Less than 50MB increase
