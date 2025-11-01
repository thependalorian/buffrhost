# Buffr Host Hospitality Ecosystem Management Platform
# Next.js + Microservices + AI Platform

.PHONY: help install test lint format build deploy clean dev frontend-dev backend-dev kyc-test email-test ai-test

# Default target
help:
	@echo "Buffr Host Hospitality Ecosystem Management Platform"
	@echo "Available commands:"
	@echo "  install       - Install all dependencies"
	@echo "  test          - Run all tests (frontend + e2e)"
	@echo "  lint          - Run linting checks"
	@echo "  format        - Format code with Prettier"
	@echo "  build         - Build Docker images"
	@echo "  dev           - Start full development environment"
	@echo "  frontend-dev  - Start frontend development server"
	@echo "  backend-dev   - Start backend services"
	@echo "  kyc-test      - Test KYC system integration"
	@echo "  email-test    - Test email system"
	@echo "  ai-test       - Test AI integrations"
	@echo "  deploy        - Deploy to production"
	@echo "  clean         - Clean up containers and volumes"

# Install dependencies
install:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Setting up microservices..."
	@echo "Note: Microservices are containerized - use 'make dev' to start"

# Run tests
test:
	@echo "Running frontend unit tests..."
	cd frontend && npm test
	@echo "Running e2e tests..."
	cd frontend && npx playwright test
	@echo "Running KYC integration tests..."
	cd frontend && node scripts/test-kyc-connection.js

# Run linting
lint:
	@echo "Running ESLint..."
	cd frontend && npm run lint

# Format code
format:
	@echo "Formatting frontend code..."
	cd frontend && npx prettier --write .

# Build Docker images
build:
	@echo "Building Docker images..."
	docker-compose build

# Start full development environment
dev:
	@echo "Starting full development environment..."
	docker-compose -f docker-compose.dev.yml up -d

# Start frontend development server
frontend-dev:
	@echo "Starting frontend development server..."
	cd frontend && npm run dev

# Start backend services
backend-dev:
	@echo "Starting backend services..."
	docker-compose -f docker-compose.dev.yml up postgres redis

# Test KYC system
kyc-test:
	@echo "Testing KYC system integration..."
	cd frontend && node scripts/test-kyc-connection.js

# Test email system
email-test:
	@echo "Testing email system..."
	cd frontend && node scripts/test-email-comprehensive.mjs

# Test AI integrations
ai-test:
	@echo "Testing AI integrations..."
	cd frontend && node scripts/test-sofia-ai-capabilities.mjs

# Deploy to production
deploy:
	@echo "Deploying to production..."
	@echo "Building and pushing Docker images..."
	docker-compose build
	docker tag buffrhost-frontend:latest gcr.io/$(PROJECT_ID)/buffrhost-frontend:latest
	docker tag buffrhost-api:latest gcr.io/$(PROJECT_ID)/buffrhost-api:latest
	docker push gcr.io/$(PROJECT_ID)/buffrhost-frontend:latest
	docker push gcr.io/$(PROJECT_ID)/buffrhost-api:latest
	@echo "Deploying to Cloud Run..."
	# Add Cloud Run deployment commands

# Clean up
clean:
	@echo "Cleaning up containers and volumes..."
	docker-compose down -v
	docker system prune -f

# Database operations
db-migrate:
	@echo "Running database migrations..."
	cd backend && alembic upgrade head

db-rollback:
	@echo "Rolling back database migrations..."
	cd backend && alembic downgrade -1

# Security checks
security:
	@echo "Running security checks..."
	cd backend && bandit -r . && safety check

# Pre-deployment validation
validate:
	@echo "Running pre-deployment validation..."
	cd backend && python -c "import main; print('✅ Import successful')"
	cd backend && python validate_models.py
	cd backend && python test_imports.py

# Validate dependencies only
validate-deps:
	@echo "Validating dependencies..."
	cd backend && pip check

# Validate imports only
validate-imports:
	@echo "Validating imports..."
	cd backend && python test_imports.py

# Full pre-deployment check
pre-deploy:
	@echo "Running full pre-deployment check..."
	cd backend && python -c "import main; print('✅ Import successful')"

# Performance tests
perf:
	@echo "Running performance tests..."
	cd backend && python -m pytest tests/ --benchmark-only

# Documentation
docs:
	@echo "Generating documentation..."
	cd backend && sphinx-build -b html docs/ docs/_build/html
	cd frontend && npm run docs

# Backup database
backup:
	@echo "Backing up database..."
	docker exec shandi_postgres_1 pg_dump -U postgres shandi_dev > backup_$(shell date +%Y%m%d_%H%M%S).sql

# Restore database
restore:
	@echo "Restoring database from backup..."
	# Usage: make restore BACKUP_FILE=backup_20240101_120000.sql
	docker exec -i shandi_postgres_1 psql -U postgres shandi_dev < $(BACKUP_FILE)
