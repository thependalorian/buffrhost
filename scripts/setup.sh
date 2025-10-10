#!/bin/bash

# Buffr Host Development Setup Script
# This script sets up the development environment for Buffr Host platform

set -e  # Exit on any error

echo "Setting up Buffr Host development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.11+ and try again."
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker and try again."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
    
    print_success "All requirements are met!"
}

# Create environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Copy environment template
    if [ ! -f .env.development ]; then
        cp env.example .env.development
        print_success "Created .env.development from template"
    else
        print_warning ".env.development already exists, skipping..."
    fi
    
    # Copy frontend environment template
    if [ ! -f frontend/.env.local ]; then
        cp frontend/.env.example frontend/.env.local 2>/dev/null || echo "NEXT_PUBLIC_API_URL=http://localhost:8000/v1" > frontend/.env.local
        print_success "Created frontend/.env.local"
    else
        print_warning "frontend/.env.local already exists, skipping..."
    fi
}

# Start Docker services
start_services() {
    print_status "Starting Docker services..."
    
    # Start PostgreSQL and Redis
    docker-compose up -d postgres redis
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check if services are healthy
    if docker-compose ps postgres | grep -q "healthy"; then
        print_success "PostgreSQL is ready"
    else
        print_error "PostgreSQL failed to start properly"
        exit 1
    fi
    
    if docker-compose ps redis | grep -q "healthy"; then
        print_success "Redis is ready"
    else
        print_error "Redis failed to start properly"
        exit 1
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Create virtual environment
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        print_success "Created Python virtual environment"
    else
        print_warning "Virtual environment already exists, skipping..."
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Upgrade pip
    pip install --upgrade pip
    
    # Install dependencies
    pip install -r requirements.txt
    
    # Install development dependencies
    if [ -f "requirements-dev.txt" ]; then
        pip install -r requirements-dev.txt
    fi
    
    # Set up pre-commit hooks
    if command -v pre-commit &> /dev/null; then
        pre-commit install
        print_success "Pre-commit hooks installed"
    fi
    
    cd ..
    print_success "Backend setup complete"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Create database if it doesn't exist
    docker-compose exec postgres psql -U theshandi -d postgres -c "CREATE DATABASE theshandi_dev;" 2>/dev/null || true
    
    # Run schema
    docker-compose exec -T postgres psql -U theshandi -d theshandi_dev < database/schema.sql
    
    # Run migrations if Alembic is available
    cd backend
    source venv/bin/activate
    if command -v alembic &> /dev/null; then
        alembic upgrade head
        print_success "Database migrations applied"
    fi
    cd ..
    
    print_success "Database setup complete"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    npm install
    
    # Install development dependencies
    npm install --save-dev
    
    cd ..
    print_success "Frontend setup complete"
}

# Run initial tests
run_tests() {
    print_status "Running initial tests..."
    
    # Backend tests
    cd backend
    source venv/bin/activate
    if [ -d "tests" ]; then
        python -m pytest tests/ -v --tb=short || print_warning "Some backend tests failed"
    fi
    cd ..
    
    # Frontend tests
    cd frontend
    if [ -d "__tests__" ] || [ -d "tests" ]; then
        npm test -- --passWithNoTests || print_warning "Some frontend tests failed"
    fi
    cd ..
    
    print_success "Initial tests completed"
}

# Create useful scripts
create_scripts() {
    print_status "Creating utility scripts..."
    
    # Create start script
    cat > start.sh << 'EOF'
#!/bin/bash
echo "Starting Buffr Host development environment..."

# Start Docker services
docker-compose up -d

# Start backend
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Development environment started!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo "pgAdmin: http://localhost:5050"
echo "🔴 RedisInsight: http://localhost:8001"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; docker-compose down; exit" INT
wait
EOF
    
    chmod +x start.sh
    
    # Create stop script
    cat > stop.sh << 'EOF'
#!/bin/bash
echo "🛑 Stopping Buffr Host development environment..."

# Stop Docker services
docker-compose down

# Kill any remaining processes
pkill -f "uvicorn main:app"
pkill -f "npm run dev"

echo "Development environment stopped"
EOF
    
    chmod +x stop.sh
    
    # Create test script
    cat > test.sh << 'EOF'
#!/bin/bash
echo "Running Buffr Host tests..."

# Backend tests
echo "Running backend tests..."
cd backend
source venv/bin/activate
python -m pytest tests/ -v --cov=. --cov-report=html
cd ..

# Frontend tests
echo "Running frontend tests..."
cd frontend
npm test -- --coverage
cd ..

echo "All tests completed"
EOF
    
    chmod +x test.sh
    
    print_success "Utility scripts created"
}

# Main setup function
main() {
    echo "Buffr Host Development Setup"
    echo "================================"
    echo ""
    
    check_requirements
    setup_environment
    start_services
    setup_backend
    setup_database
    setup_frontend
    run_tests
    create_scripts
    
    echo ""
    echo "Setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env.development with your configuration"
    echo "2. Run ./start.sh to start the development environment"
    echo "3. Visit http://localhost:3000 to see the frontend"
    echo "4. Visit http://localhost:8000/docs to see the API documentation"
    echo ""
    echo "Available commands:"
    echo "  ./start.sh  - Start development environment"
    echo "  ./stop.sh   - Stop development environment"
    echo "  ./test.sh   - Run all tests"
    echo ""
    echo "📚 Documentation:"
    echo "  docs/development-guide.md - Development guidelines"
    echo "  docs/api-specification.md - API documentation"
    echo "  docs/architecture.md - System architecture"
    echo ""
}

# Run main function
main "$@"
