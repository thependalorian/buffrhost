"""
Redis Cache Service for Buffr Host Platform
Provides intelligent caching with TTL management, cache invalidation, and performance monitoring.
"""

import asyncio
import json
import logging
import time
from typing import Any, Dict, List, Optional, Union
from dataclasses import dataclass
from enum import Enum

import redis.asyncio as redis
from redis.asyncio import Redis

logger = logging.getLogger(__name__)

class CacheLevel(Enum):
    """Cache levels with different TTL strategies"""
    HOT = "hot"          # 5 minutes - frequently accessed data
    WARM = "warm"        # 30 minutes - moderately accessed data
    COLD = "cold"        # 2 hours - rarely accessed data
    PERSISTENT = "persistent"  # Until manually invalidated

@dataclass
class CacheStats:
    """Cache performance statistics"""
    hits: int = 0
    misses: int = 0
    sets: int = 0
    deletes: int = 0
    errors: int = 0
    
    @property
    def hit_rate(self) -> float:
        """Calculate cache hit rate"""
        total = self.hits + self.misses
        return (self.hits / total * 100) if total > 0 else 0.0

class CacheService:
    """Advanced Redis cache service with intelligent TTL management"""
    
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis_url = redis_url
        self.redis_client: Optional[Redis] = None
        self.stats = CacheStats()
        self.ttl_map = {
            CacheLevel.HOT: 300,        # 5 minutes
            CacheLevel.WARM: 1800,      # 30 minutes
            CacheLevel.COLD: 7200,      # 2 hours
            CacheLevel.PERSISTENT: -1,  # No expiration
        }
        
    async def connect(self):
        """Connect to Redis"""
        try:
            self.redis_client = redis.from_url(self.redis_url, decode_responses=True)
            await self.redis_client.ping()
            logger.info("Connected to Redis cache service")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            self.redis_client = None
    
    async def disconnect(self):
        """Disconnect from Redis"""
        if self.redis_client:
            await self.redis_client.close()
            logger.info("Disconnected from Redis cache service")
    
    def _serialize(self, data: Any) -> str:
        """Serialize data for caching"""
        try:
            return json.dumps(data, default=str)
        except Exception as e:
            logger.error(f"Serialization error: {e}")
            raise
    
    def _deserialize(self, data: str) -> Any:
        """Deserialize cached data"""
        try:
            return json.loads(data)
        except Exception as e:
            logger.error(f"Deserialization error: {e}")
            raise
    
    def _get_cache_key(self, namespace: str, key: str) -> str:
        """Generate cache key with namespace"""
        return f"{namespace}:{key}"
    
    async def get(self, namespace: str, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self.redis_client:
            self.stats.misses += 1
            return None
        
        try:
            cache_key = self._get_cache_key(namespace, key)
            cached_data = await self.redis_client.get(cache_key)
            
            if cached_data:
                self.stats.hits += 1
                logger.debug(f"Cache hit: {cache_key}")
                return self._deserialize(cached_data)
            else:
                self.stats.misses += 1
                logger.debug(f"Cache miss: {cache_key}")
                return None
                
        except Exception as e:
            self.stats.errors += 1
            logger.error(f"Cache get error: {e}")
            return None
    
    async def set(self, namespace: str, key: str, value: Any, 
                 cache_level: CacheLevel = CacheLevel.WARM) -> bool:
        """Set value in cache"""
        if not self.redis_client:
            return False
        
        try:
            cache_key = self._get_cache_key(namespace, key)
            serialized_value = self._serialize(value)
            ttl = self.ttl_map[cache_level]
            
            if ttl > 0:
                await self.redis_client.setex(cache_key, ttl, serialized_value)
            else:
                await self.redis_client.set(cache_key, serialized_value)
            
            self.stats.sets += 1
            logger.debug(f"Cached: {cache_key} (TTL: {ttl}s)")
            return True
            
        except Exception as e:
            self.stats.errors += 1
            logger.error(f"Cache set error: {e}")
            return False
    
    async def delete(self, namespace: str, key: str) -> bool:
        """Delete value from cache"""
        if not self.redis_client:
            return False
        
        try:
            cache_key = self._get_cache_key(namespace, key)
            result = await self.redis_client.delete(cache_key)
            self.stats.deletes += 1
            logger.debug(f"Deleted from cache: {cache_key}")
            return bool(result)
            
        except Exception as e:
            self.stats.errors += 1
            logger.error(f"Cache delete error: {e}")
            return False
    
    async def delete_pattern(self, namespace: str, pattern: str) -> int:
        """Delete all keys matching pattern"""
        if not self.redis_client:
            return 0
        
        try:
            cache_pattern = self._get_cache_key(namespace, pattern)
            keys = await self.redis_client.keys(cache_pattern)
            
            if keys:
                deleted_count = await self.redis_client.delete(*keys)
                self.stats.deletes += deleted_count
                logger.debug(f"Deleted {deleted_count} keys matching pattern: {cache_pattern}")
                return deleted_count
            
            return 0
            
        except Exception as e:
            self.stats.errors += 1
            logger.error(f"Cache pattern delete error: {e}")
            return 0
    
    async def exists(self, namespace: str, key: str) -> bool:
        """Check if key exists in cache"""
        if not self.redis_client:
            return False
        
        try:
            cache_key = self._get_cache_key(namespace, key)
            return bool(await self.redis_client.exists(cache_key))
        except Exception as e:
            self.stats.errors += 1
            logger.error(f"Cache exists check error: {e}")
            return False
    
    async def get_ttl(self, namespace: str, key: str) -> int:
        """Get TTL for key"""
        if not self.redis_client:
            return -1
        
        try:
            cache_key = self._get_cache_key(namespace, key)
            return await self.redis_client.ttl(cache_key)
        except Exception as e:
            self.stats.errors += 1
            logger.error(f"Cache TTL check error: {e}")
            return -1
    
    async def extend_ttl(self, namespace: str, key: str, additional_seconds: int) -> bool:
        """Extend TTL for existing key"""
        if not self.redis_client:
            return False
        
        try:
            cache_key = self._get_cache_key(namespace, key)
            current_ttl = await self.redis_client.ttl(cache_key)
            
            if current_ttl > 0:
                new_ttl = current_ttl + additional_seconds
                return bool(await self.redis_client.expire(cache_key, new_ttl))
            
            return False
            
        except Exception as e:
            self.stats.errors += 1
            logger.error(f"Cache TTL extension error: {e}")
            return False
    
    async def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        return {
            "hits": self.stats.hits,
            "misses": self.stats.misses,
            "sets": self.stats.sets,
            "deletes": self.stats.deletes,
            "errors": self.stats.errors,
            "hit_rate": self.stats.hit_rate,
            "connected": self.redis_client is not None
        }
    
    async def clear_namespace(self, namespace: str) -> int:
        """Clear all keys in namespace"""
        return await self.delete_pattern(namespace, "*")
    
    async def get_namespace_keys(self, namespace: str) -> List[str]:
        """Get all keys in namespace"""
        if not self.redis_client:
            return []
        
        try:
            pattern = self._get_cache_key(namespace, "*")
            keys = await self.redis_client.keys(pattern)
            # Remove namespace prefix from keys
            return [key.split(":", 1)[1] for key in keys]
        except Exception as e:
            self.stats.errors += 1
            logger.error(f"Cache namespace keys error: {e}")
            return []

# Cache decorators and utilities
def cache_result(namespace: str, 
                 cache_level: CacheLevel = CacheLevel.WARM,
                 key_func: Optional[callable] = None):
    """Decorator to cache function results"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Generate cache key
            if key_func:
                cache_key = key_func(*args, **kwargs)
            else:
                cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            cache_service = CacheService()
            await cache_service.connect()
            
            try:
                cached_result = await cache_service.get(namespace, cache_key)
                if cached_result is not None:
                    return cached_result
                
                # Execute function and cache result
                result = await func(*args, **kwargs)
                await cache_service.set(namespace, cache_key, result, cache_level)
                return result
                
            finally:
                await cache_service.disconnect()
        
        return wrapper
    return decorator

class CacheInvalidationService:
    """Service for intelligent cache invalidation"""
    
    def __init__(self, cache_service: CacheService):
        self.cache_service = cache_service
        self.invalidation_rules: Dict[str, List[str]] = {}
    
    def add_invalidation_rule(self, trigger_key: str, affected_keys: List[str]):
        """Add cache invalidation rule"""
        self.invalidation_rules[trigger_key] = affected_keys
    
    async def invalidate_on_update(self, entity_type: str, entity_id: str):
        """Invalidate related cache entries when entity is updated"""
        trigger_key = f"{entity_type}:{entity_id}"
        
        if trigger_key in self.invalidation_rules:
            affected_keys = self.invalidation_rules[trigger_key]
            for key_pattern in affected_keys:
                await self.cache_service.delete_pattern("", key_pattern)
                logger.info(f"Invalidated cache pattern: {key_pattern}")

# Specialized cache services for different data types
class RestaurantCacheService:
    """Specialized cache service for restaurant data"""
    
    def __init__(self, cache_service: CacheService):
        self.cache_service = cache_service
        self.namespace = "restaurants"
    
    async def get_menu(self, restaurant_id: int) -> Optional[Dict]:
        """Get cached restaurant menu"""
        return await self.cache_service.get(self.namespace, f"menu:{restaurant_id}")
    
    async def set_menu(self, restaurant_id: int, menu_data: Dict):
        """Cache restaurant menu"""
        await self.cache_service.set(
            self.namespace, 
            f"menu:{restaurant_id}", 
            menu_data, 
            CacheLevel.WARM
        )
    
    async def invalidate_menu(self, restaurant_id: int):
        """Invalidate restaurant menu cache"""
        await self.cache_service.delete(self.namespace, f"menu:{restaurant_id}")
    
    async def get_restaurant_info(self, restaurant_id: int) -> Optional[Dict]:
        """Get cached restaurant information"""
        return await self.cache_service.get(self.namespace, f"info:{restaurant_id}")
    
    async def set_restaurant_info(self, restaurant_id: int, info_data: Dict):
        """Cache restaurant information"""
        await self.cache_service.set(
            self.namespace, 
            f"info:{restaurant_id}", 
            info_data, 
            CacheLevel.COLD
        )

class UserCacheService:
    """Specialized cache service for user data"""
    
    def __init__(self, cache_service: CacheService):
        self.cache_service = cache_service
        self.namespace = "users"
    
    async def get_user_profile(self, user_id: int) -> Optional[Dict]:
        """Get cached user profile"""
        return await self.cache_service.get(self.namespace, f"profile:{user_id}")
    
    async def set_user_profile(self, user_id: int, profile_data: Dict):
        """Cache user profile"""
        await self.cache_service.set(
            self.namespace, 
            f"profile:{user_id}", 
            profile_data, 
            CacheLevel.WARM
        )
    
    async def get_user_preferences(self, user_id: int) -> Optional[Dict]:
        """Get cached user preferences"""
        return await self.cache_service.get(self.namespace, f"preferences:{user_id}")
    
    async def set_user_preferences(self, user_id: int, preferences_data: Dict):
        """Cache user preferences"""
        await self.cache_service.set(
            self.namespace, 
            f"preferences:{user_id}", 
            preferences_data, 
            CacheLevel.COLD
        )

# Cache warming service
class CacheWarmingService:
    """Service to pre-warm frequently accessed cache entries"""
    
    def __init__(self, cache_service: CacheService):
        self.cache_service = cache_service
    
    async def warm_restaurant_caches(self, restaurant_ids: List[int]):
        """Pre-warm restaurant-related caches"""
        restaurant_cache = RestaurantCacheService(self.cache_service)
        
        for restaurant_id in restaurant_ids:
            # This would typically fetch from database and cache
            # For now, we'll just ensure the cache structure is ready
            logger.info(f"Warming cache for restaurant {restaurant_id}")
    
    async def warm_user_caches(self, user_ids: List[int]):
        """Pre-warm user-related caches"""
        user_cache = UserCacheService(self.cache_service)
        
        for user_id in user_ids:
            logger.info(f"Warming cache for user {user_id}")

# Global cache service instance
cache_service = CacheService()

# Convenience functions
async def get_cache_service() -> CacheService:
    """Get global cache service instance"""
    if not cache_service.redis_client:
        await cache_service.connect()
    return cache_service

async def cache_get(namespace: str, key: str) -> Optional[Any]:
    """Convenience function to get from cache"""
    service = await get_cache_service()
    return await service.get(namespace, key)

async def cache_set(namespace: str, key: str, value: Any, 
                   cache_level: CacheLevel = CacheLevel.WARM) -> bool:
    """Convenience function to set cache"""
    service = await get_cache_service()
    return await service.set(namespace, key, value, cache_level)

async def cache_delete(namespace: str, key: str) -> bool:
    """Convenience function to delete from cache"""
    service = await get_cache_service()
    return await service.delete(namespace, key)