#!/bin/bash

# Buffr Host Microservices Deployment Script
# Deploys all microservices to Google Cloud Platform

set -e

# Configuration
PROJECT_ID=${PROJECT_ID:-"buffr-host-dev"}
REGION=${REGION:-"us-central1"}
ENVIRONMENT=${ENVIRONMENT:-"dev"}

echo "🚀 Deploying Buffr Host Microservices to GCP"
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo "Environment: $ENVIRONMENT"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Check if terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install it first."
    exit 1
fi

# Set project
echo "📋 Setting GCP project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable redis.googleapis.com
gcloud services enable secretmanager.googleapis.com

# Build and push Docker images
echo "🐳 Building and pushing Docker images..."

# API Gateway
echo "Building API Gateway..."
cd microservices/api-gateway
gcloud builds submit --tag gcr.io/$PROJECT_ID/api-gateway:latest .
cd ../..

# Auth Service
echo "Building Auth Service..."
cd microservices/auth-service
gcloud builds submit --tag gcr.io/$PROJECT_ID/auth-service:latest .
cd ../..

# Hospitality Service
echo "Building Hospitality Service..."
cd microservices/hospitality-service
gcloud builds submit --tag gcr.io/$PROJECT_ID/hospitality-service:latest .
cd ../..

# Menu Service
echo "Building Menu Service..."
cd microservices/menu-service
gcloud builds submit --tag gcr.io/$PROJECT_ID/menu-service:latest .
cd ../..

# Booking Service
echo "Building Booking Service..."
cd microservices/booking-service
gcloud builds submit --tag gcr.io/$PROJECT_ID/booking-service:latest .
cd ../..

# Payment Service
echo "Building Payment Service..."
cd microservices/payment-service
gcloud builds submit --tag gcr.io/$PROJECT_ID/payment-service:latest .
cd ../..

# Notification Service
echo "Building Notification Service..."
cd microservices/notification-service
gcloud builds submit --tag gcr.io/$PROJECT_ID/notification-service:latest .
cd ../..

# Analytics Service
echo "Building Analytics Service..."
cd microservices/analytics-service
gcloud builds submit --tag gcr.io/$PROJECT_ID/analytics-service:latest .
cd ../..

# Deploy infrastructure with Terraform
echo "🏗️ Deploying infrastructure with Terraform..."
cd terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -var="project_id=$PROJECT_ID" -var="region=$REGION" -var="environment=$ENVIRONMENT"

# Apply deployment
terraform apply -var="project_id=$PROJECT_ID" -var="region=$REGION" -var="environment=$ENVIRONMENT" -auto-approve

# Get outputs
API_GATEWAY_URL=$(terraform output -raw api_gateway_url)
DATABASE_CONNECTION_NAME=$(terraform output -raw database_connection_name)
REDIS_HOST=$(terraform output -raw redis_host)

echo "✅ Deployment completed successfully!"
echo ""
echo "📊 Deployment Summary:"
echo "API Gateway URL: $API_GATEWAY_URL"
echo "Database Connection: $DATABASE_CONNECTION_NAME"
echo "Redis Host: $REDIS_HOST"
echo ""
echo "🔗 Service URLs:"
echo "API Gateway: $API_GATEWAY_URL"
echo "Auth Service: $API_GATEWAY_URL/api/v1/auth"
echo "Hospitality Service: $API_GATEWAY_URL/api/v1/hospitality"
echo "Menu Service: $API_GATEWAY_URL/api/v1/menu"
echo "Booking Service: $API_GATEWAY_URL/api/v1/booking"
echo "Payment Service: $API_GATEWAY_URL/api/v1/payment"
echo "Notification Service: $API_GATEWAY_URL/api/v1/notification"
echo "Analytics Service: $API_GATEWAY_URL/api/v1/analytics"
echo ""
echo "📚 API Documentation:"
echo "Swagger UI: $API_GATEWAY_URL/docs"
echo "ReDoc: $API_GATEWAY_URL/redoc"
echo ""
echo "🎉 Buffr Host microservices are now deployed and ready to use!"
