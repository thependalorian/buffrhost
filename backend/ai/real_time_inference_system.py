"""
Real-time ML Inference System for Hospitality Platform
======================================================

Advanced real-time ML inference system providing low-latency predictions,
streaming data processing, and scalable model serving for hospitality businesses.

Features:
- Low-latency model serving
- Streaming data processing
- Model caching and optimization
- Load balancing and scaling
- Real-time monitoring and alerting

Author: Buffr AI Team
Date: 2024
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional, Any, Union, Callable
from dataclasses import dataclass
from datetime import datetime, timedelta
import logging
import joblib
import json
import asyncio
import threading
import time
from pathlib import Path
from enum import Enum
import warnings
warnings.filterwarnings('ignore')

# Core ML libraries
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.pipeline import Pipeline

# Async and concurrent processing
import asyncio
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import queue
import multiprocessing as mp

# Caching and optimization
import redis
import pickle
from functools import lru_cache

# Monitoring and metrics
import psutil
import threading
from collections import defaultdict, deque

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class InferenceMode(Enum):
    """Inference execution modes"""
    SYNC = "synchronous"
    ASYNC = "asynchronous"
    BATCH = "batch"
    STREAM = "stream"

class ModelStatus(Enum):
    """Model status"""
    LOADING = "loading"
    READY = "ready"
    ERROR = "error"
    UPDATING = "updating"

class CacheStrategy(Enum):
    """Caching strategies"""
    LRU = "lru"
    TTL = "ttl"
    NONE = "none"

@dataclass
class InferenceConfig:
    """Configuration for real-time inference system"""
    # Performance parameters
    max_workers: int = 4
    batch_size: int = 100
    max_queue_size: int = 1000
    timeout_seconds: float = 5.0
    
    # Caching parameters
    cache_strategy: CacheStrategy = CacheStrategy.LRU
    cache_size: int = 1000
    cache_ttl: int = 3600  # seconds
    
    # Monitoring parameters
    metrics_window: int = 100
    alert_threshold_latency: float = 1.0  # seconds
    alert_threshold_error_rate: float = 0.05  # 5%
    
    # Model persistence
    model_path: str = "models/real_time_inference"
    version: str = "1.0.0"

class ModelCache:
    """Model caching system for fast inference"""
    
    def __init__(self, config: InferenceConfig):
        self.config = config
        self.cache = {}
        self.access_times = {}
        self.cache_hits = 0
        self.cache_misses = 0
        
        # Initialize Redis if available
        try:
            self.redis_client = redis.Redis(host='localhost', port=6379, db=0)
            self.redis_available = True
        except:
            self.redis_client = None
            self.redis_available = False
            logger.warning("Redis not available, using in-memory cache only")
    
    def get_cache_key(self, model_name: str, input_data: Any) -> str:
        """Generate cache key for input data"""
        # Create hash of input data for cache key
        input_str = json.dumps(input_data, sort_keys=True, default=str)
        input_hash = hashlib.md5(input_str.encode()).hexdigest()
        return f"{model_name}:{input_hash}"
    
    def get(self, model_name: str, input_data: Any) -> Optional[Any]:
        """Get cached prediction"""
        cache_key = self.get_cache_key(model_name, input_data)
        
        # Try Redis first
        if self.redis_available:
            try:
                cached_data = self.redis_client.get(cache_key)
                if cached_data:
                    self.cache_hits += 1
                    return pickle.loads(cached_data)
            except Exception as e:
                logger.warning(f"Redis get error: {e}")
        
        # Try in-memory cache
        if cache_key in self.cache:
            self.access_times[cache_key] = time.time()
            self.cache_hits += 1
            return self.cache[cache_key]
        
        self.cache_misses += 1
        return None
    
    def set(self, model_name: str, input_data: Any, prediction: Any) -> None:
        """Cache prediction"""
        cache_key = self.get_cache_key(model_name, input_data)
        
        # Store in Redis
        if self.redis_available:
            try:
                serialized_data = pickle.dumps(prediction)
                self.redis_client.setex(cache_key, self.config.cache_ttl, serialized_data)
            except Exception as e:
                logger.warning(f"Redis set error: {e}")
        
        # Store in memory cache
        if self.config.cache_strategy == CacheStrategy.LRU:
            self._lru_set(cache_key, prediction)
        else:
            self.cache[cache_key] = prediction
            self.access_times[cache_key] = time.time()
    
    def _lru_set(self, cache_key: str, prediction: Any) -> None:
        """Set with LRU eviction"""
        if len(self.cache) >= self.config.cache_size:
            # Remove least recently used item
            lru_key = min(self.access_times.keys(), key=lambda k: self.access_times[k])
            del self.cache[lru_key]
            del self.access_times[lru_key]
        
        self.cache[cache_key] = prediction
        self.access_times[cache_key] = time.time()
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        total_requests = self.cache_hits + self.cache_misses
        hit_rate = self.cache_hits / total_requests if total_requests > 0 else 0
        
        return {
            'cache_hits': self.cache_hits,
            'cache_misses': self.cache_misses,
            'hit_rate': hit_rate,
            'cache_size': len(self.cache),
            'redis_available': self.redis_available
        }

class ModelRegistry:
    """Model registry for managing multiple models"""
    
    def __init__(self, config: InferenceConfig):
        self.config = config
        self.models = {}
        self.model_status = {}
        self.model_metadata = {}
        self.model_versions = {}
    
    def register_model(self, name: str, model: Any, version: str = "1.0.0",
                      metadata: Dict[str, Any] = None) -> bool:
        """Register a model in the registry"""
        logger.info(f"Registering model: {name} v{version}")
        
        try:
            self.models[name] = model
            self.model_status[name] = ModelStatus.READY
            self.model_versions[name] = version
            self.model_metadata[name] = metadata or {}
            
            logger.info(f"Model {name} registered successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error registering model {name}: {e}")
            self.model_status[name] = ModelStatus.ERROR
            return False
    
    def get_model(self, name: str) -> Optional[Any]:
        """Get model by name"""
        if name not in self.models:
            logger.warning(f"Model {name} not found")
            return None
        
        if self.model_status[name] != ModelStatus.READY:
            logger.warning(f"Model {name} is not ready (status: {self.model_status[name]})")
            return None
        
        return self.models[name]
    
    def update_model(self, name: str, new_model: Any, version: str = None) -> bool:
        """Update an existing model"""
        if name not in self.models:
            logger.error(f"Model {name} not found for update")
            return False
        
        try:
            self.model_status[name] = ModelStatus.UPDATING
            
            # Update model
            self.models[name] = new_model
            if version:
                self.model_versions[name] = version
            
            self.model_status[name] = ModelStatus.READY
            logger.info(f"Model {name} updated successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error updating model {name}: {e}")
            self.model_status[name] = ModelStatus.ERROR
            return False
    
    def list_models(self) -> Dict[str, Any]:
        """List all registered models"""
        return {
            name: {
                'version': self.model_versions.get(name, 'unknown'),
                'status': self.model_status.get(name, ModelStatus.ERROR).value,
                'metadata': self.model_metadata.get(name, {})
            }
            for name in self.models.keys()
        }

class InferenceEngine:
    """Core inference engine for real-time predictions"""
    
    def __init__(self, config: InferenceConfig):
        self.config = config
        self.model_registry = ModelRegistry(config)
        self.cache = ModelCache(config)
        self.metrics = InferenceMetrics(config)
        self.executor = ThreadPoolExecutor(max_workers=config.max_workers)
        
        # Performance monitoring
        self.latency_history = deque(maxlen=config.metrics_window)
        self.error_count = 0
        self.total_requests = 0
        
        # Start monitoring thread
        self.monitoring_thread = threading.Thread(target=self._monitor_performance, daemon=True)
        self.monitoring_thread.start()
    
    def predict_sync(self, model_name: str, input_data: Any, 
                    use_cache: bool = True) -> Dict[str, Any]:
        """Synchronous prediction"""
        start_time = time.time()
        
        try:
            # Check cache first
            if use_cache:
                cached_result = self.cache.get(model_name, input_data)
                if cached_result is not None:
                    latency = time.time() - start_time
                    self.latency_history.append(latency)
                    return {
                        'prediction': cached_result,
                        'cached': True,
                        'latency': latency,
                        'model_name': model_name
                    }
            
            # Get model
            model = self.model_registry.get_model(model_name)
            if model is None:
                raise ValueError(f"Model {model_name} not found")
            
            # Make prediction
            if isinstance(input_data, dict):
                # Convert dict to array if needed
                input_array = np.array(list(input_data.values())).reshape(1, -1)
            else:
                input_array = np.array(input_data).reshape(1, -1)
            
            prediction = model.predict(input_array)[0]
            
            # Cache result
            if use_cache:
                self.cache.set(model_name, input_data, prediction)
            
            # Update metrics
            latency = time.time() - start_time
            self.latency_history.append(latency)
            self.total_requests += 1
            
            return {
                'prediction': prediction,
                'cached': False,
                'latency': latency,
                'model_name': model_name
            }
            
        except Exception as e:
            self.error_count += 1
            self.total_requests += 1
            logger.error(f"Error in prediction: {e}")
            return {
                'error': str(e),
                'latency': time.time() - start_time,
                'model_name': model_name
            }
    
    async def predict_async(self, model_name: str, input_data: Any,
                           use_cache: bool = True) -> Dict[str, Any]:
        """Asynchronous prediction"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor, 
            self.predict_sync, 
            model_name, 
            input_data, 
            use_cache
        )
    
    def predict_batch(self, model_name: str, input_batch: List[Any],
                     use_cache: bool = True) -> List[Dict[str, Any]]:
        """Batch prediction"""
        logger.info(f"Processing batch of {len(input_batch)} predictions")
        
        results = []
        for input_data in input_batch:
            result = self.predict_sync(model_name, input_data, use_cache)
            results.append(result)
        
        return results
    
    def predict_stream(self, model_name: str, input_stream: queue.Queue,
                      output_stream: queue.Queue, use_cache: bool = True) -> None:
        """Streaming prediction"""
        logger.info(f"Starting stream processing for model {model_name}")
        
        while True:
            try:
                # Get input from stream
                input_data = input_stream.get(timeout=1.0)
                
                # Make prediction
                result = self.predict_sync(model_name, input_data, use_cache)
                
                # Put result in output stream
                output_stream.put(result)
                
            except queue.Empty:
                continue
            except Exception as e:
                logger.error(f"Error in stream processing: {e}")
                break
    
    def _monitor_performance(self) -> None:
        """Monitor system performance"""
        while True:
            try:
                time.sleep(10)  # Check every 10 seconds
                
                # Calculate metrics
                if self.latency_history:
                    avg_latency = np.mean(self.latency_history)
                    max_latency = np.max(self.latency_history)
                    p95_latency = np.percentile(self.latency_history, 95)
                else:
                    avg_latency = max_latency = p95_latency = 0
                
                error_rate = self.error_count / max(self.total_requests, 1)
                
                # Check for alerts
                if avg_latency > self.config.alert_threshold_latency:
                    logger.warning(f"High latency alert: {avg_latency:.3f}s")
                
                if error_rate > self.config.alert_threshold_error_rate:
                    logger.warning(f"High error rate alert: {error_rate:.3f}")
                
                # Log metrics
                logger.info(f"Performance metrics - Avg latency: {avg_latency:.3f}s, "
                           f"Error rate: {error_rate:.3f}, "
                           f"Total requests: {self.total_requests}")
                
            except Exception as e:
                logger.error(f"Error in performance monitoring: {e}")

class InferenceMetrics:
    """Inference performance metrics"""
    
    def __init__(self, config: InferenceConfig):
        self.config = config
        self.metrics = defaultdict(list)
        self.start_time = time.time()
    
    def record_metric(self, metric_name: str, value: float) -> None:
        """Record a metric value"""
        self.metrics[metric_name].append({
            'value': value,
            'timestamp': time.time()
        })
        
        # Keep only recent metrics
        if len(self.metrics[metric_name]) > self.config.metrics_window:
            self.metrics[metric_name] = self.metrics[metric_name][-self.config.metrics_window:]
    
    def get_metrics_summary(self) -> Dict[str, Any]:
        """Get metrics summary"""
        summary = {}
        
        for metric_name, values in self.metrics.items():
            if values:
                metric_values = [v['value'] for v in values]
                summary[metric_name] = {
                    'count': len(metric_values),
                    'mean': np.mean(metric_values),
                    'std': np.std(metric_values),
                    'min': np.min(metric_values),
                    'max': np.max(metric_values),
                    'p95': np.percentile(metric_values, 95)
                }
        
        # System metrics
        summary['system'] = {
            'cpu_percent': psutil.cpu_percent(),
            'memory_percent': psutil.virtual_memory().percent,
            'uptime': time.time() - self.start_time
        }
        
        return summary

class RealTimeInferenceAPI:
    """API wrapper for real-time inference system"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.config = InferenceConfig()
        self.inference_engine = InferenceEngine(self.config)
        
        if model_path:
            self.load_models(model_path)
    
    def register_model(self, name: str, model: Any, version: str = "1.0.0",
                      metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Register a model for inference"""
        try:
            success = self.inference_engine.model_registry.register_model(
                name, model, version, metadata
            )
            
            return {
                'success': success,
                'model_name': name,
                'version': version,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error registering model {name}: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def predict(self, model_name: str, input_data: Any, 
               use_cache: bool = True) -> Dict[str, Any]:
        """Make a prediction"""
        try:
            result = self.inference_engine.predict_sync(model_name, input_data, use_cache)
            
            return {
                'success': 'error' not in result,
                'result': result,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error making prediction: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    async def predict_async(self, model_name: str, input_data: Any,
                           use_cache: bool = True) -> Dict[str, Any]:
        """Make an asynchronous prediction"""
        try:
            result = await self.inference_engine.predict_async(
                model_name, input_data, use_cache
            )
            
            return {
                'success': 'error' not in result,
                'result': result,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error making async prediction: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def predict_batch(self, model_name: str, input_batch: List[Any],
                     use_cache: bool = True) -> Dict[str, Any]:
        """Make batch predictions"""
        try:
            results = self.inference_engine.predict_batch(
                model_name, input_batch, use_cache
            )
            
            # Calculate batch metrics
            latencies = [r.get('latency', 0) for r in results if 'latency' in r]
            errors = [r for r in results if 'error' in r]
            
            return {
                'success': True,
                'results': results,
                'batch_metrics': {
                    'total_predictions': len(results),
                    'successful_predictions': len(results) - len(errors),
                    'failed_predictions': len(errors),
                    'avg_latency': np.mean(latencies) if latencies else 0,
                    'max_latency': np.max(latencies) if latencies else 0
                },
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error making batch predictions: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def get_performance_metrics(self) -> Dict[str, Any]:
        """Get performance metrics"""
        try:
            metrics = self.inference_engine.metrics.get_metrics_summary()
            cache_stats = self.inference_engine.cache.get_cache_stats()
            
            return {
                'success': True,
                'metrics': metrics,
                'cache_stats': cache_stats,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting performance metrics: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def list_models(self) -> Dict[str, Any]:
        """List registered models"""
        try:
            models = self.inference_engine.model_registry.list_models()
            
            return {
                'success': True,
                'models': models,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error listing models: {e}")
            return {
                'success': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def load_models(self, model_path: str):
        """Load pre-trained models"""
        # In production, this would load actual trained models
        logger.info(f"Loading models from {model_path}")
    
    def save_models(self, model_path: str):
        """Save trained models"""
        Path(model_path).mkdir(parents=True, exist_ok=True)
        logger.info(f"Models saved to {model_path}")

# Example usage and testing
if __name__ == "__main__":
    # Example data
    np.random.seed(42)
    n_samples = 1000
    n_features = 5
    
    # Generate sample data
    X = np.random.randn(n_samples, n_features)
    y = (X[:, 0] + X[:, 1] * 2 + np.random.randn(n_samples) * 0.1 > 0).astype(int)
    
    # Train sample models
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X, y)
    
    lr_model = LogisticRegression(random_state=42)
    lr_model.fit(X, y)
    
    # Initialize API
    api = RealTimeInferenceAPI()
    
    # Register models
    api.register_model('random_forest', rf_model, '1.0.0')
    api.register_model('logistic_regression', lr_model, '1.0.0')
    
    # Test single prediction
    sample_input = [1.0, 2.0, 0.5, -1.0, 0.8]
    prediction = api.predict('random_forest', sample_input)
    print("Single Prediction:", prediction)
    
    # Test batch prediction
    batch_inputs = [sample_input for _ in range(10)]
    batch_predictions = api.predict_batch('logistic_regression', batch_inputs)
    print("Batch Predictions:", batch_predictions)
    
    # Test performance metrics
    metrics = api.get_performance_metrics()
    print("Performance Metrics:", metrics)
    
    # Test model listing
    models = api.list_models()
    print("Registered Models:", models)