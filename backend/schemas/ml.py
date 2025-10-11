"""
ML Schemas
Pydantic models for ML/AI API requests and responses
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class MLRecommendationRequest(BaseModel):
    """Request model for ML recommendations"""
    user_id: str
    context: Optional[Dict[str, Any]] = None
    limit: Optional[int] = Field(default=10, ge=1, le=50)

class MLRecommendationItem(BaseModel):
    """Individual recommendation item"""
    id: str
    title: str
    description: str
    confidence: float = Field(ge=0.0, le=1.0)
    priority: str = Field(..., pattern="^(low|medium|high)$")
    icon: Optional[str] = None
    action_url: Optional[str] = None

class MLRecommendationResponse(BaseModel):
    """Response model for ML recommendations"""
    success: bool
    data: Dict[str, Any]
    message: str

class MLInsightRequest(BaseModel):
    """Request model for ML insights"""
    property_id: str
    time_range: Optional[str] = "30d"
    include_recommendations: Optional[bool] = True

class MLInsightRecommendation(BaseModel):
    """Individual insight recommendation"""
    title: str
    description: str
    impact: str
    confidence: float = Field(ge=0.0, le=1.0)

class MLInsightResponse(BaseModel):
    """Response model for ML insights"""
    success: bool
    data: Dict[str, Any]
    message: str

class MLPredictionRequest(BaseModel):
    """Request model for ML predictions"""
    type: str = Field(..., pattern="^(demand|pricing|churn|general)$")
    data: Dict[str, Any]
    property_id: Optional[str] = None

class MLPredictionResponse(BaseModel):
    """Response model for ML predictions"""
    success: bool
    data: Dict[str, Any]
    message: str

class FraudAlertResponse(BaseModel):
    """Response model for fraud alerts"""
    id: str
    title: str
    description: str
    severity: str = Field(..., pattern="^(low|medium|high|critical)$")
    timestamp: datetime
    status: str = Field(..., pattern="^(active|investigating|resolved|false_positive)$")

class ModelPerformanceMetrics(BaseModel):
    """Model performance metrics"""
    model_accuracy: float = Field(ge=0.0, le=1.0)
    prediction_count: int = Field(ge=0)
    uptime: float = Field(ge=0.0, le=100.0)
    response_time: int = Field(ge=0)  # milliseconds
    models: List[Dict[str, Any]] = []

class ModelPerformanceResponse(BaseModel):
    """Response model for model performance"""
    success: bool
    data: ModelPerformanceMetrics
    message: str

class ChurnPredictionRequest(BaseModel):
    """Request model for churn prediction"""
    customer_id: str
    include_recommendations: Optional[bool] = True

class ChurnPredictionResponse(BaseModel):
    """Response model for churn prediction"""
    customer_id: str
    churn_probability: float = Field(ge=0.0, le=1.0)
    risk_level: str = Field(..., pattern="^(low|medium|high)$")
    recommendations: List[str] = []
    confidence: float = Field(ge=0.0, le=1.0)

class DynamicPricingRequest(BaseModel):
    """Request model for dynamic pricing"""
    property_id: str
    base_price: float = Field(gt=0)
    demand_factor: float = Field(ge=0.0, le=2.0)
    seasonality: str = Field(..., pattern="^(low|normal|high|peak)$")
    competitor_prices: List[float] = []
    date_range: Optional[Dict[str, str]] = None

class DynamicPricingResponse(BaseModel):
    """Response model for dynamic pricing"""
    property_id: str
    recommended_price: float = Field(gt=0)
    price_range: Dict[str, float]
    confidence: float = Field(ge=0.0, le=1.0)
    factors: List[str] = []
    expected_revenue_impact: str

class MLHealthCheck(BaseModel):
    """ML service health check response"""
    status: str = Field(..., pattern="^(healthy|unhealthy|degraded)$")
    services: Dict[str, str]
    timestamp: datetime
    error: Optional[str] = None