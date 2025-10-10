"""
ML/AI Routes
FastAPI routes for machine learning and AI services
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import logging

from database import get_db
from auth.dependencies import get_current_user
from services.ml_service import MLService
from schemas.ml import (
    MLRecommendationRequest,
    MLRecommendationResponse,
    MLInsightRequest,
    MLInsightResponse,
    MLPredictionRequest,
    MLPredictionResponse,
    FraudAlertResponse,
    ModelPerformanceResponse
)

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize ML service
ml_service = MLService()

@router.get("/recommendations/{user_id}", response_model=MLRecommendationResponse)
async def get_recommendations(
    user_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get personalized recommendations for a user"""
    try:
        recommendations = await ml_service.get_recommendations(user_id, db)
        return MLRecommendationResponse(
            success=True,
            data=recommendations,
            message="Recommendations generated successfully"
        )
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate recommendations"
        )

@router.get("/insights/{property_id}", response_model=MLInsightResponse)
async def get_insights(
    property_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get ML insights for a property"""
    try:
        insights = await ml_service.get_insights(property_id, db)
        return MLInsightResponse(
            success=True,
            data=insights,
            message="Insights generated successfully"
        )
    except Exception as e:
        logger.error(f"Error getting insights: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate insights"
        )

@router.post("/predictions", response_model=MLPredictionResponse)
async def get_predictions(
    request: MLPredictionRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get ML predictions based on input data"""
    try:
        predictions = await ml_service.get_predictions(request, db)
        return MLPredictionResponse(
            success=True,
            data=predictions,
            message="Predictions generated successfully"
        )
    except Exception as e:
        logger.error(f"Error getting predictions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate predictions"
        )

@router.get("/fraud-alerts", response_model=List[FraudAlertResponse])
async def get_fraud_alerts(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current fraud alerts"""
    try:
        alerts = await ml_service.get_fraud_alerts(db)
        return [FraudAlertResponse(
            id=alert['id'],
            title=alert['title'],
            description=alert['description'],
            severity=alert['severity'],
            timestamp=alert['timestamp'],
            status=alert['status']
        ) for alert in alerts]
    except Exception as e:
        logger.error(f"Error getting fraud alerts: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve fraud alerts"
        )

@router.get("/churn-prediction/{customer_id}")
async def get_churn_prediction(
    customer_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get churn prediction for a customer"""
    try:
        prediction = await ml_service.get_churn_prediction(customer_id, db)
        return {
            "success": True,
            "data": prediction,
            "message": "Churn prediction generated successfully"
        }
    except Exception as e:
        logger.error(f"Error getting churn prediction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate churn prediction"
        )

@router.post("/dynamic-pricing/{property_id}")
async def get_dynamic_pricing(
    property_id: str,
    request_data: Dict[str, Any],
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get dynamic pricing recommendations for a property"""
    try:
        pricing = await ml_service.get_dynamic_pricing(property_id, request_data, db)
        return {
            "success": True,
            "data": pricing,
            "message": "Dynamic pricing generated successfully"
        }
    except Exception as e:
        logger.error(f"Error getting dynamic pricing: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate dynamic pricing"
        )

@router.get("/model-performance/{property_id}", response_model=ModelPerformanceResponse)
async def get_model_performance(
    property_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get ML model performance metrics for a property"""
    try:
        performance = await ml_service.get_model_performance(property_id, db)
        return ModelPerformanceResponse(
            success=True,
            data=performance,
            message="Model performance retrieved successfully"
        )
    except Exception as e:
        logger.error(f"Error getting model performance: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve model performance"
        )

@router.get("/health")
async def ml_health_check():
    """Health check for ML services"""
    try:
        health_status = await ml_service.health_check()
        return {
            "status": "healthy",
            "services": health_status,
            "timestamp": "2024-01-20T10:00:00Z"
        }
    except Exception as e:
        logger.error(f"ML health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": "2024-01-20T10:00:00Z"
        }