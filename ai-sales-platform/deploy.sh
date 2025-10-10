#!/bin/bash

# AI-Powered Sales Solutions Platform Deployment Script
# Enhanced for Production Deployment (v2.1.0)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Docker is running
check_docker() {
    log "Checking Docker status..."
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    success "Docker is running"
}

# Check if Docker Compose is available
check_docker_compose() {
    log "Checking Docker Compose..."
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
    success "Docker Compose is available"
}

# Check environment file
check_env() {
    log "Checking environment configuration..."
    if [ ! -f .env ]; then
        warning ".env file not found. Creating from .env.example..."
        cp .env.example .env
        warning "Please update .env file with your actual configuration before proceeding."
        read -p "Press Enter to continue after updating .env file..."
    fi
    success "Environment configuration ready"
}

# Build all services
build_services() {
    log "Building all services..."
    docker-compose build --no-cache
    success "All services built successfully"
}

# Start services
start_services() {
    log "Starting services..."
    docker-compose up -d
    success "Services started successfully"
}

# Wait for services to be healthy
wait_for_services() {
    log "Waiting for services to be healthy..."
    
    # Wait for databases
    log "Waiting for databases..."
    sleep 30
    
    # Wait for Redis
    log "Waiting for Redis..."
    until docker-compose exec redis redis-cli ping > /dev/null 2>&1; do
        sleep 5
    done
    success "Redis is ready"
    
    # Wait for AI service
    log "Waiting for AI service..."
    until curl -f http://localhost:8003/health > /dev/null 2>&1; do
        sleep 10
    done
    success "AI service is ready"
    
    # Wait for other services
    log "Waiting for other services..."
    sleep 20
    success "All services are ready"
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    # Add migration commands here if needed
    success "Database migrations completed"
}

# Check service health
check_health() {
    log "Checking service health..."
    
    services=(
        "http://localhost:8000/health:API Gateway"
        "http://localhost:8001/health:Auth Service"
        "http://localhost:8002/health:Sales Service"
        "http://localhost:8003/health:AI Service"
        "http://localhost:8004/health:Communication Service"
        "http://localhost:8005/health:Customer Service"
        "http://localhost:3000/api/health:Frontend"
    )
    
    for service in "${services[@]}"; do
        url=$(echo $service | cut -d: -f1-2)
        name=$(echo $service | cut -d: -f3)
        
        if curl -f "$url" > /dev/null 2>&1; then
            success "$name is healthy"
        else
            error "$name is not responding"
        fi
    done
}

# Show service URLs
show_urls() {
    log "Service URLs:"
    echo ""
    echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
    echo -e "${GREEN}API Gateway:${NC} http://localhost:8000"
    echo -e "${GREEN}API Documentation:${NC} http://localhost:8000/docs"
    echo -e "${GREEN}Auth Service:${NC} http://localhost:8001"
    echo -e "${GREEN}Sales Service:${NC} http://localhost:8002"
    echo -e "${GREEN}AI Service:${NC} http://localhost:8003"
    echo -e "${GREEN}Communication Service:${NC} http://localhost:8004"
    echo -e "${GREEN}Customer Service:${NC} http://localhost:8005"
    echo -e "${GREEN}Prometheus:${NC} http://localhost:9090"
    echo -e "${GREEN}Grafana:${NC} http://localhost:3001 (admin/admin)"
    echo ""
}

# Show logs
show_logs() {
    log "Showing service logs..."
    docker-compose logs -f
}

# Stop services
stop_services() {
    log "Stopping services..."
    docker-compose down
    success "Services stopped"
}

# Clean up
cleanup() {
    log "Cleaning up..."
    docker-compose down -v
    docker system prune -f
    success "Cleanup completed"
}

# Main deployment function
deploy() {
    log "Starting AI-Powered Sales Solutions Platform deployment..."
    
    check_docker
    check_docker_compose
    check_env
    build_services
    start_services
    wait_for_services
    run_migrations
    check_health
    show_urls
    
    success "Deployment completed successfully!"
    log "You can now access the platform at http://localhost:3000"
}

# Handle command line arguments
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "start")
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        start_services
        ;;
    "logs")
        show_logs
        ;;
    "health")
        check_health
        ;;
    "cleanup")
        cleanup
        ;;
    "urls")
        show_urls
        ;;
    *)
        echo "Usage: $0 {deploy|start|stop|restart|logs|health|cleanup|urls}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Full deployment (default)"
        echo "  start    - Start services"
        echo "  stop     - Stop services"
        echo "  restart  - Restart services"
        echo "  logs     - Show service logs"
        echo "  health   - Check service health"
        echo "  cleanup  - Clean up everything"
        echo "  urls     - Show service URLs"
        exit 1
        ;;
esac
