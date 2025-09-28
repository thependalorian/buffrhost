# Buffr Host Hospitality Ecosystem Management Platform
# Development and deployment commands

.PHONY: help install test lint format build deploy clean

# Default target
help:
	@echo "Buffr Host Hospitality Ecosystem Management Platform"
	@echo "Available commands:"
	@echo "  install     - Install all dependencies"
	@echo "  test        - Run all tests"
	@echo "  lint        - Run linting checks"
	@echo "  format      - Format code"
	@echo "  build       - Build Docker images"
	@echo "  dev         - Start development environment"
	@echo "  prod        - Start production environment"
	@echo "  deploy      - Deploy to production"
	@echo "  clean       - Clean up containers and volumes"

# Install dependencies
install:
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# Run tests
test:
	@echo "Running backend tests..."
	cd backend && python -m pytest tests/ -v
	@echo "Running frontend tests..."
	cd frontend && npm test

# Run linting
lint:
	@echo "Linting backend..."
	cd backend && flake8 --exclude=venv . && black --check . && isort --check-only .

# Format code
format:
	@echo "Formatting backend..."
	cd backend && black . && isort .
	@echo "Formatting frontend..."
	cd frontend && npm run format

# Build Docker images
build:
	@echo "Building Docker images..."
	docker-compose build

# Start development environment
dev:
	@echo "Starting development environment..."
	docker-compose -f docker-compose.dev.yml up -d

# Start production environment
prod:
	@echo "Starting production environment..."
	docker-compose -f docker-compose.prod.yml up -d

# Deploy to production
deploy:
	@echo "Deploying to production..."
	# Add your deployment commands here
	# This could be pushing to a registry, updating Kubernetes, etc.

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
