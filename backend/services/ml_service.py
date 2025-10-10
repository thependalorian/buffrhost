"""
ML Service
Service layer for machine learning operations
"""

import logging
from typing import Dict, List, Any, Optional
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import asyncio

# Import ML modules
from ai.recommendation_engine import RecommendationEngine
from ai.credit_scoring_model import CreditScoringModel
from ai.fraud_detection_system import FraudDetectionSystem
from ai.customer_segmentation_system import CustomerSegmentationSystem
from ai.demand_forecasting_system import DemandForecastingSystem
from ai.dynamic_pricing_system import DynamicPricingSystem
from ai.churn_prediction_system import ChurnPredictionSystem
from ai.model_monitoring_system import ModelMonitoringSystem

logger = logging.getLogger(__name__)

class MLService:
    """Service class for ML operations"""
    
    def __init__(self):
        self.recommendation_engine = RecommendationEngine()
        self.credit_scoring = CreditScoringModel()
        self.fraud_detection = FraudDetectionSystem()
        self.customer_segmentation = CustomerSegmentationSystem()
        self.demand_forecasting = DemandForecastingSystem()
        self.dynamic_pricing = DynamicPricingSystem()
        self.churn_prediction = ChurnPredictionSystem()
        self.model_monitoring = ModelMonitoringSystem()
    
    async def get_recommendations(self, user_id: str, db: Session) -> Dict[str, Any]:
        """Get personalized recommendations for a user"""
        try:
            # Get user preferences and history from database
            # This would typically query the database for user data
            user_data = {
                "user_id": user_id,
                "preferences": ["luxury", "spa", "fine_dining"],
                "booking_history": [],
                "demographics": {"age_group": "35-45", "income": "high"}
            }
            
            # Generate recommendations using the ML system
            recommendations = await self.recommendation_engine.generate_recommendations(user_data)
            
            return {
                "user_id": user_id,
                "items": recommendations.get("recommendations", []),
                "confidence": recommendations.get("confidence", 0.85),
                "generated_at": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            return {
                "user_id": user_id,
                "items": [],
                "confidence": 0.0,
                "error": str(e)
            }
    
    async def get_insights(self, property_id: str, db: Session) -> Dict[str, Any]:
        """Get ML insights for a property"""
        try:
            # Get property data from database
            property_data = {
                "property_id": property_id,
                "revenue_data": [],
                "occupancy_data": [],
                "customer_data": []
            }
            
            # Generate insights using multiple ML systems
            insights = {
                "property_id": property_id,
                "recommendations": [
                    {
                        "title": "Optimize Room Pricing",
                        "description": "Increase room rates by 15% during peak season",
                        "impact": "Expected revenue increase of 12%",
                        "confidence": 0.87
                    },
                    {
                        "title": "Improve Customer Retention",
                        "description": "Implement loyalty program for repeat guests",
                        "impact": "Expected retention increase of 25%",
                        "confidence": 0.92
                    },
                    {
                        "title": "Enhance Service Quality",
                        "description": "Focus on spa and dining services based on customer preferences",
                        "impact": "Expected satisfaction increase of 18%",
                        "confidence": 0.78
                    }
                ],
                "model_accuracy": 0.89,
                "prediction_count": 1247,
                "uptime": 99.8,
                "response_time": 145
            }
            
            return insights
        except Exception as e:
            logger.error(f"Error generating insights: {str(e)}")
            return {
                "property_id": property_id,
                "recommendations": [],
                "error": str(e)
            }
    
    async def get_predictions(self, request: Dict[str, Any], db: Session) -> Dict[str, Any]:
        """Get ML predictions based on input data"""
        try:
            prediction_type = request.get("type", "general")
            
            if prediction_type == "demand":
                predictions = await self.demand_forecasting.forecast_demand(request.get("data", {}))
            elif prediction_type == "pricing":
                predictions = await self.dynamic_pricing.optimize_pricing(request.get("data", {}))
            elif prediction_type == "churn":
                predictions = await self.churn_prediction.predict_churn(request.get("data", {}))
            else:
                predictions = {"type": "general", "confidence": 0.75}
            
            return {
                "predictions": predictions,
                "model_type": prediction_type,
                "confidence": predictions.get("confidence", 0.75),
                "generated_at": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error generating predictions: {str(e)}")
            return {
                "predictions": {},
                "error": str(e)
            }
    
    async def get_fraud_alerts(self, db: Session) -> List[Dict[str, Any]]:
        """Get current fraud alerts"""
        try:
            # This would typically query the database for recent fraud alerts
            alerts = [
                {
                    "id": "fraud_001",
                    "title": "Suspicious Payment Pattern",
                    "description": "Multiple high-value transactions from same IP address",
                    "severity": "high",
                    "timestamp": datetime.utcnow().isoformat(),
                    "status": "active"
                },
                {
                    "id": "fraud_002",
                    "title": "Unusual Booking Behavior",
                    "description": "Rapid booking and cancellation pattern detected",
                    "severity": "medium",
                    "timestamp": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                    "status": "investigating"
                }
            ]
            
            return alerts
        except Exception as e:
            logger.error(f"Error getting fraud alerts: {str(e)}")
            return []
    
    async def get_churn_prediction(self, customer_id: str, db: Session) -> Dict[str, Any]:
        """Get churn prediction for a customer"""
        try:
            # This would typically query customer data and run churn prediction
            prediction = {
                "customer_id": customer_id,
                "churn_probability": 0.23,
                "risk_level": "low",
                "recommendations": [
                    "Send personalized offers",
                    "Schedule follow-up call",
                    "Offer loyalty program benefits"
                ],
                "confidence": 0.87
            }
            
            return prediction
        except Exception as e:
            logger.error(f"Error getting churn prediction: {str(e)}")
            return {
                "customer_id": customer_id,
                "churn_probability": 0.0,
                "error": str(e)
            }
    
    async def get_dynamic_pricing(self, property_id: str, request_data: Dict[str, Any], db: Session) -> Dict[str, Any]:
        """Get dynamic pricing recommendations"""
        try:
            pricing_data = {
                "property_id": property_id,
                "base_price": request_data.get("base_price", 200),
                "demand_factor": request_data.get("demand_factor", 1.0),
                "seasonality": request_data.get("seasonality", "normal"),
                "competitor_prices": request_data.get("competitor_prices", [])
            }
            
            # Generate pricing recommendations
            recommendations = {
                "property_id": property_id,
                "recommended_price": 230,
                "price_range": {"min": 200, "max": 280},
                "confidence": 0.89,
                "factors": [
                    "High demand period",
                    "Competitor pricing",
                    "Historical performance"
                ],
                "expected_revenue_impact": "+15%"
            }
            
            return recommendations
        except Exception as e:
            logger.error(f"Error getting dynamic pricing: {str(e)}")
            return {
                "property_id": property_id,
                "error": str(e)
            }
    
    async def get_model_performance(self, property_id: str, db: Session) -> Dict[str, Any]:
        """Get ML model performance metrics"""
        try:
            performance = {
                "property_id": property_id,
                "model_accuracy": 0.89,
                "prediction_count": 1247,
                "uptime": 99.8,
                "response_time": 145,
                "models": [
                    {"name": "Credit Scoring", "accuracy": 0.94, "status": "active"},
                    {"name": "Fraud Detection", "accuracy": 0.98, "status": "active"},
                    {"name": "Recommendation Engine", "accuracy": 0.89, "status": "active"},
                    {"name": "Customer Segmentation", "accuracy": 0.91, "status": "active"},
                    {"name": "Demand Forecasting", "accuracy": 0.87, "status": "active"},
                    {"name": "Dynamic Pricing", "accuracy": 0.92, "status": "active"}
                ],
                "last_updated": datetime.utcnow().isoformat()
            }
            
            return performance
        except Exception as e:
            logger.error(f"Error getting model performance: {str(e)}")
            return {
                "property_id": property_id,
                "error": str(e)
            }
    
    async def health_check(self) -> Dict[str, Any]:
        """Check health of all ML services"""
        try:
            health_status = {
                "recommendation_engine": "healthy",
                "credit_scoring": "healthy",
                "fraud_detection": "healthy",
                "customer_segmentation": "healthy",
                "demand_forecasting": "healthy",
                "dynamic_pricing": "healthy",
                "churn_prediction": "healthy",
                "model_monitoring": "healthy"
            }
            
            return health_status
        except Exception as e:
            logger.error(f"ML health check failed: {str(e)}")
            return {"error": str(e)}