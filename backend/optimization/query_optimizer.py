"""
Database Query Optimization System
Provides query optimization, caching, and performance monitoring for Buffr Host platform.
"""

import asyncio
import logging
import time
from typing import Any, Dict, List, Optional, Union
from functools import wraps
from dataclasses import dataclass
from enum import Enum

import redis
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload, joinedload

logger = logging.getLogger(__name__)

class CacheStrategy(Enum):
    """Cache strategy types"""
    NO_CACHE = "no_cache"
    SHORT_TERM = "short_term"  # 5 minutes
    MEDIUM_TERM = "medium_term"  # 30 minutes
    LONG_TERM = "long_term"  # 2 hours
    PERSISTENT = "persistent"  # Until manually invalidated

@dataclass
class QueryMetrics:
    """Query performance metrics"""
    query_id: str
    execution_time: float
    cache_hit: bool
    rows_returned: int
    memory_usage: int
    timestamp: float

class QueryOptimizer:
    """Advanced query optimization and caching system"""
    
    def __init__(self, redis_client: Optional[redis.Redis] = None):
        self.redis_client = redis_client
        self.query_metrics: List[QueryMetrics] = []
        self.slow_query_threshold = 1.0  # seconds
        
    def cache_key(self, query: str, params: Dict[str, Any]) -> str:
        """Generate cache key for query"""
        import hashlib
        key_data = f"{query}:{sorted(params.items())}"
        return f"query_cache:{hashlib.md5(key_data.encode()).hexdigest()}"
    
    def get_cache_ttl(self, strategy: CacheStrategy) -> int:
        """Get TTL for cache strategy"""
        ttl_map = {
            CacheStrategy.NO_CACHE: 0,
            CacheStrategy.SHORT_TERM: 300,  # 5 minutes
            CacheStrategy.MEDIUM_TERM: 1800,  # 30 minutes
            CacheStrategy.LONG_TERM: 7200,  # 2 hours
            CacheStrategy.PERSISTENT: -1,  # No expiration
        }
        return ttl_map[strategy]
    
    async def get_cached_result(self, cache_key: str) -> Optional[Any]:
        """Get result from cache"""
        if not self.redis_client:
            return None
            
        try:
            import json
            cached_data = self.redis_client.get(cache_key)
            if cached_data:
                logger.debug(f"Cache hit for key: {cache_key}")
                return json.loads(cached_data)
        except Exception as e:
            logger.warning(f"Cache retrieval error: {e}")
        return None
    
    async def set_cached_result(self, cache_key: str, data: Any, ttl: int):
        """Set result in cache"""
        if not self.redis_client:
            return
            
        try:
            import json
            serialized_data = json.dumps(data, default=str)
            if ttl > 0:
                self.redis_client.setex(cache_key, ttl, serialized_data)
            else:
                self.redis_client.set(cache_key, serialized_data)
            logger.debug(f"Cached result for key: {cache_key}")
        except Exception as e:
            logger.warning(f"Cache storage error: {e}")
    
    def optimize_query(self, query: str) -> str:
        """Apply query optimizations"""
        # Remove unnecessary whitespace
        query = " ".join(query.split())
        
        # Add query hints for common patterns
        if "SELECT" in query.upper() and "LIMIT" not in query.upper():
            # Add default limit for unbounded queries
            query += " LIMIT 1000"
        
        return query
    
    def track_query_metrics(self, query_id: str, execution_time: float, 
                          cache_hit: bool, rows_returned: int):
        """Track query performance metrics"""
        metrics = QueryMetrics(
            query_id=query_id,
            execution_time=execution_time,
            cache_hit=cache_hit,
            rows_returned=rows_returned,
            memory_usage=0,  # TODO: Implement memory tracking
            timestamp=time.time()
        )
        
        self.query_metrics.append(metrics)
        
        # Keep only last 1000 metrics
        if len(self.query_metrics) > 1000:
            self.query_metrics = self.query_metrics[-1000:]
        
        # Log slow queries
        if execution_time > self.slow_query_threshold:
            logger.warning(f"Slow query detected: {query_id} took {execution_time:.2f}s")
    
    def get_performance_report(self) -> Dict[str, Any]:
        """Generate performance report"""
        if not self.query_metrics:
            return {"message": "No query metrics available"}
        
        total_queries = len(self.query_metrics)
        cache_hits = sum(1 for m in self.query_metrics if m.cache_hit)
        avg_execution_time = sum(m.execution_time for m in self.query_metrics) / total_queries
        slow_queries = sum(1 for m in self.query_metrics if m.execution_time > self.slow_query_threshold)
        
        return {
            "total_queries": total_queries,
            "cache_hit_rate": (cache_hits / total_queries) * 100 if total_queries > 0 else 0,
            "average_execution_time": avg_execution_time,
            "slow_queries_count": slow_queries,
            "slow_query_percentage": (slow_queries / total_queries) * 100 if total_queries > 0 else 0,
            "recent_metrics": self.query_metrics[-10:]  # Last 10 queries
        }

def optimize_query(cache_strategy: CacheStrategy = CacheStrategy.MEDIUM_TERM):
    """Decorator for query optimization and caching"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract query information
            query_id = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
            cache_key = None
            
            # Try to get from cache first
            if cache_strategy != CacheStrategy.NO_CACHE:
                optimizer = QueryOptimizer()
                cache_key = optimizer.cache_key(func.__name__, kwargs)
                cached_result = await optimizer.get_cached_result(cache_key)
                
                if cached_result is not None:
                    optimizer.track_query_metrics(query_id, 0.0, True, len(cached_result) if isinstance(cached_result, list) else 1)
                    return cached_result
            
            # Execute query
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                execution_time = time.time() - start_time
                
                # Cache result if applicable
                if cache_strategy != CacheStrategy.NO_CACHE and cache_key:
                    ttl = optimizer.get_cache_ttl(cache_strategy)
                    await optimizer.set_cached_result(cache_key, result, ttl)
                
                # Track metrics
                optimizer.track_query_metrics(
                    query_id, 
                    execution_time, 
                    False, 
                    len(result) if isinstance(result, list) else 1
                )
                
                return result
                
            except Exception as e:
                execution_time = time.time() - start_time
                logger.error(f"Query {query_id} failed after {execution_time:.2f}s: {e}")
                raise
                
        return wrapper
    return decorator

class DatabaseConnectionPool:
    """Enhanced database connection pool with optimization"""
    
    def __init__(self, engine):
        self.engine = engine
        self.active_connections = 0
        self.max_connections = 20
        
    async def get_optimized_session(self) -> AsyncSession:
        """Get optimized database session"""
        if self.active_connections >= self.max_connections:
            logger.warning("Connection pool limit reached")
        
        self.active_connections += 1
        session = AsyncSession(self.engine)
        
        # Configure session for optimal performance
        await session.execute(text("SET work_mem = '256MB'"))
        await session.execute(text("SET random_page_cost = 1.1"))
        await session.execute(text("SET effective_cache_size = '1GB'"))
        
        return session
    
    async def close_session(self, session: AsyncSession):
        """Close session and update connection count"""
        await session.close()
        self.active_connections = max(0, self.active_connections - 1)

# Query optimization utilities
class QueryBuilder:
    """Advanced query builder with optimization"""
    
    @staticmethod
    def build_optimized_select(table_name: str, 
                             columns: List[str] = None,
                             joins: List[Dict[str, str]] = None,
                             filters: Dict[str, Any] = None,
                             order_by: str = None,
                             limit: int = None,
                             offset: int = None) -> str:
        """Build optimized SELECT query"""
        
        # Select columns
        if columns:
            select_clause = f"SELECT {', '.join(columns)}"
        else:
            select_clause = "SELECT *"
        
        # From clause
        from_clause = f"FROM {table_name}"
        
        # Joins
        join_clauses = []
        if joins:
            for join in joins:
                join_clauses.append(f"JOIN {join['table']} ON {join['condition']}")
        
        # Where clause
        where_clause = ""
        if filters:
            conditions = []
            for key, value in filters.items():
                if isinstance(value, str):
                    conditions.append(f"{key} = '{value}'")
                else:
                    conditions.append(f"{key} = {value}")
            where_clause = f"WHERE {' AND '.join(conditions)}"
        
        # Order by
        order_clause = f"ORDER BY {order_by}" if order_by else ""
        
        # Limit and offset
        limit_clause = ""
        if limit:
            limit_clause = f"LIMIT {limit}"
            if offset:
                limit_clause += f" OFFSET {offset}"
        
        # Combine all clauses
        query_parts = [select_clause, from_clause] + join_clauses
        if where_clause:
            query_parts.append(where_clause)
        if order_clause:
            query_parts.append(order_clause)
        if limit_clause:
            query_parts.append(limit_clause)
        
        return " ".join(query_parts)

# Index recommendations
class IndexAnalyzer:
    """Analyze queries and recommend indexes"""
    
    @staticmethod
    def analyze_query_for_indexes(query: str) -> List[str]:
        """Analyze query and recommend indexes"""
        recommendations = []
        
        # Simple analysis for common patterns
        if "WHERE" in query.upper():
            # Extract WHERE conditions
            where_start = query.upper().find("WHERE")
            where_end = query.upper().find("ORDER BY", where_start)
            if where_end == -1:
                where_end = query.upper().find("LIMIT", where_start)
            if where_end == -1:
                where_end = len(query)
            
            where_clause = query[where_start:where_end]
            
            # Look for equality conditions
            if "=" in where_clause:
                recommendations.append("Consider adding index on columns used in WHERE = conditions")
            
            # Look for range conditions
            if any(op in where_clause for op in [">", "<", ">=", "<=", "BETWEEN"]):
                recommendations.append("Consider adding index on columns used in range conditions")
        
        # Look for ORDER BY
        if "ORDER BY" in query.upper():
            recommendations.append("Consider adding index on ORDER BY columns")
        
        # Look for JOINs
        if "JOIN" in query.upper():
            recommendations.append("Ensure foreign key columns have indexes")
        
        return recommendations

# Usage examples and best practices
class QueryOptimizationExamples:
    """Examples of optimized queries for common use cases"""
    
    @staticmethod
    async def get_restaurant_menu_optimized(db: AsyncSession, restaurant_id: int):
        """Optimized query for restaurant menu with categories"""
        query = """
        SELECT 
            m.id, m.name, m.description, m.price, m.image_url,
            c.name as category_name, c.id as category_id
        FROM menu_items m
        JOIN categories c ON m.category_id = c.id
        WHERE m.restaurant_id = :restaurant_id
        AND m.is_active = true
        ORDER BY c.sort_order, m.sort_order
        """
        
        result = await db.execute(text(query), {"restaurant_id": restaurant_id})
        return result.fetchall()
    
    @staticmethod
    async def get_customer_orders_optimized(db: AsyncSession, customer_id: int, limit: int = 50):
        """Optimized query for customer orders with pagination"""
        query = """
        SELECT 
            o.id, o.order_number, o.status, o.total_amount, o.created_at,
            r.name as restaurant_name
        FROM orders o
        JOIN restaurants r ON o.restaurant_id = r.id
        WHERE o.customer_id = :customer_id
        ORDER BY o.created_at DESC
        LIMIT :limit
        """
        
        result = await db.execute(text(query), {
            "customer_id": customer_id,
            "limit": limit
        })
        return result.fetchall()
    
    @staticmethod
    async def get_analytics_data_optimized(db: AsyncSession, 
                                        start_date: str, 
                                        end_date: str,
                                        restaurant_id: Optional[int] = None):
        """Optimized query for analytics data"""
        base_query = """
        SELECT 
            DATE(o.created_at) as order_date,
            COUNT(*) as order_count,
            SUM(o.total_amount) as total_revenue,
            AVG(o.total_amount) as avg_order_value
        FROM orders o
        WHERE o.created_at BETWEEN :start_date AND :end_date
        """
        
        params = {"start_date": start_date, "end_date": end_date}
        
        if restaurant_id:
            base_query += " AND o.restaurant_id = :restaurant_id"
            params["restaurant_id"] = restaurant_id
        
        base_query += """
        GROUP BY DATE(o.created_at)
        ORDER BY order_date DESC
        """
        
        result = await db.execute(text(base_query), params)
        return result.fetchall()