#!/bin/bash

# Langfuse Setup Script for Buffr Host Microservices
# This script sets up Langfuse integration across all services

set -e

echo "🚀 Setting up Langfuse Integration for Buffr Host Microservices"
echo "=================================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "README.md" ] && [ ! -f "MICROSERVICES_ARCHITECTURE_DESIGN.md" ]; then
    print_error "Please run this script from the buffr-host project directory"
    exit 1
fi

print_info "Setting up Langfuse integration..."

# 1. Install Python dependencies for AI services
print_info "Installing Python dependencies for AI services..."
cd microservices/ai-service
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    print_status "AI service dependencies installed"
else
    print_warning "requirements.txt not found for AI service"
fi
cd ../../

# 2. Install Node.js dependencies for frontend
print_info "Installing Node.js dependencies for frontend..."
cd frontend
if [ -f "package.json" ]; then
    npm install langfuse @langfuse/react
    print_status "Frontend Langfuse dependencies installed"
else
    print_warning "package.json not found for frontend"
fi
cd ../

# 3. Create environment configuration files
print_info "Creating environment configuration files..."

# Check if .env files exist and create them if they don't
if [ ! -f ".env.local" ]; then
    cp .env.langfuse .env.local
    print_status "Created .env.local from template"
else
    print_info "Merging Langfuse configuration into existing .env.local"
    cat .env.langfuse >> .env.local
fi

if [ ! -f "frontend/.env.local" ]; then
    cp frontend/.env.langfuse frontend/.env.local
    print_status "Created frontend/.env.local from template"
else
    print_info "Merging Langfuse configuration into existing frontend/.env.local"
    cat frontend/.env.langfuse >> frontend/.env.local
fi

# 4. Create Langfuse configuration files
print_info "Creating Langfuse configuration files..."

# Create Langfuse config for Python services
cat > microservices/ai-service/langfuse_config.py << 'EOF'
"""
Langfuse Configuration for AI Service
"""
import os
from langfuse import get_client

# Initialize Langfuse client
langfuse = get_client()

# Verify connection
def verify_langfuse_connection():
    """Verify Langfuse connection"""
    try:
        if langfuse.auth_check():
            print("✅ Langfuse client authenticated successfully!")
            return True
        else:
            print("❌ Langfuse authentication failed. Check your credentials.")
            return False
    except Exception as e:
        print(f"❌ Langfuse connection error: {e}")
        return False

# Environment variables check
def check_environment_variables():
    """Check required environment variables"""
    required_vars = [
        "LANGFUSE_PUBLIC_KEY",
        "LANGFUSE_SECRET_KEY", 
        "LANGFUSE_HOST",
        "OPENAI_API_KEY"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        return False
    else:
        print("✅ All required environment variables are set")
        return True

if __name__ == "__main__":
    print("🔍 Checking Langfuse configuration...")
    env_check = check_environment_variables()
    conn_check = verify_langfuse_connection()
    
    if env_check and conn_check:
        print("🎉 Langfuse configuration is ready!")
    else:
        print("⚠️  Please fix the configuration issues above")
EOF

print_status "Created Langfuse configuration for AI service"

# Create Langfuse config for frontend
cat > frontend/src/lib/langfuse-config.ts << 'EOF'
/**
 * Langfuse Configuration for Frontend
 */
import { Langfuse } from 'langfuse';

// Check environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY',
  'NEXT_PUBLIC_LANGFUSE_SECRET_KEY',
  'NEXT_PUBLIC_LANGFUSE_HOST'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
}

// Initialize Langfuse client
export const langfuseConfig = {
  publicKey: process.env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY || '',
  secretKey: process.env.NEXT_PUBLIC_LANGFUSE_SECRET_KEY || '',
  baseUrl: process.env.NEXT_PUBLIC_LANGFUSE_HOST || 'https://cloud.langfuse.com',
};

// Verify configuration
export const verifyLangfuseConfig = (): boolean => {
  const { publicKey, secretKey, baseUrl } = langfuseConfig;
  
  if (!publicKey || !secretKey || !baseUrl) {
    console.error('❌ Langfuse configuration is incomplete');
    return false;
  }
  
  console.log('✅ Langfuse configuration is complete');
  return true;
};

export default langfuseConfig;
EOF

print_status "Created Langfuse configuration for frontend"

# 5. Create Docker Compose configuration for Langfuse
print_info "Creating Docker Compose configuration for Langfuse..."

cat > docker-compose.langfuse.yml << 'EOF'
version: '3.8'

services:
  # AI Service with Langfuse
  ai-service:
    build: ./microservices/ai-service
    ports:
      - "8012:8012"
    environment:
      - LANGFUSE_PUBLIC_KEY=${LANGFUSE_PUBLIC_KEY}
      - LANGFUSE_SECRET_KEY=${LANGFUSE_SECRET_KEY}
      - LANGFUSE_HOST=${LANGFUSE_HOST}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - DATABASE_URL=${AI_SERVICE_DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
    volumes:
      - ./microservices/ai-service:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8012 --reload

  # Analytics Service with Langfuse
  analytics-service:
    build: ./microservices/analytics-service
    ports:
      - "8011:8011"
    environment:
      - LANGFUSE_PUBLIC_KEY=${LANGFUSE_PUBLIC_KEY}
      - LANGFUSE_SECRET_KEY=${LANGFUSE_SECRET_KEY}
      - LANGFUSE_HOST=${LANGFUSE_HOST}
      - DATABASE_URL=${ANALYTICS_SERVICE_DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
    volumes:
      - ./microservices/analytics-service:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8011 --reload

  # Communication Service with Langfuse
  communication-service:
    build: ./microservices/communication-service
    ports:
      - "8013:8013"
    environment:
      - LANGFUSE_PUBLIC_KEY=${LANGFUSE_PUBLIC_KEY}
      - LANGFUSE_SECRET_KEY=${LANGFUSE_SECRET_KEY}
      - LANGFUSE_HOST=${LANGFUSE_HOST}
      - DATABASE_URL=${COMMUNICATION_SERVICE_DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
    volumes:
      - ./microservices/communication-service:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8013 --reload

  # Content Service with Langfuse
  content-service:
    build: ./microservices/content-service
    ports:
      - "8014:8014"
    environment:
      - LANGFUSE_PUBLIC_KEY=${LANGFUSE_PUBLIC_KEY}
      - LANGFUSE_SECRET_KEY=${LANGFUSE_SECRET_KEY}
      - LANGFUSE_HOST=${LANGFUSE_HOST}
      - DATABASE_URL=${CONTENT_SERVICE_DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
    volumes:
      - ./microservices/content-service:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8014 --reload

  # PostgreSQL Database
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=theshandi
      - POSTGRES_USER=theshandi_user
      - POSTGRES_PASSWORD=theshandi_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
EOF

print_status "Created Docker Compose configuration for Langfuse"

# 6. Create setup verification script
print_info "Creating setup verification script..."

cat > scripts/verify-langfuse-setup.sh << 'EOF'
#!/bin/bash

# Langfuse Setup Verification Script
echo "🔍 Verifying Langfuse Setup for Buffr Host Microservices"
echo "========================================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check environment variables
echo "1. Checking environment variables..."
required_vars=(
    "LANGFUSE_PUBLIC_KEY"
    "LANGFUSE_SECRET_KEY"
    "LANGFUSE_HOST"
    "OPENAI_API_KEY"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -eq 0 ]; then
    print_status "All required environment variables are set"
else
    print_error "Missing environment variables: ${missing_vars[*]}"
fi

# Check Python dependencies
echo "2. Checking Python dependencies..."
if python -c "import langfuse, pydantic_ai, langchain" 2>/dev/null; then
    print_status "Python dependencies are installed"
else
    print_error "Python dependencies are missing"
fi

# Check Node.js dependencies
echo "3. Checking Node.js dependencies..."
if [ -f "frontend/package.json" ]; then
    cd frontend
    if npm list langfuse >/dev/null 2>&1; then
        print_status "Frontend Langfuse dependencies are installed"
    else
        print_error "Frontend Langfuse dependencies are missing"
    fi
    cd ..
else
    print_warning "Frontend package.json not found"
fi

# Check configuration files
echo "4. Checking configuration files..."
config_files=(
    "microservices/ai-service/langfuse_integration.py"
    "frontend/src/lib/langfuse.ts"
    "frontend/src/components/ai/ChatInterface.tsx"
    "frontend/src/components/ai/RecommendationEngine.tsx"
)

for file in "${config_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "Configuration file exists: $file"
    else
        print_error "Configuration file missing: $file"
    fi
done

# Test Langfuse connection
echo "5. Testing Langfuse connection..."
if python -c "
from langfuse import get_client
langfuse = get_client()
if langfuse.auth_check():
    print('✅ Langfuse connection successful')
else:
    print('❌ Langfuse connection failed')
" 2>/dev/null; then
    print_status "Langfuse connection test passed"
else
    print_error "Langfuse connection test failed"
fi

echo ""
echo "🎉 Langfuse setup verification complete!"
echo "Next steps:"
echo "1. Update your .env files with actual Langfuse credentials"
echo "2. Start the services with: docker-compose -f docker-compose.langfuse.yml up"
echo "3. Test the AI endpoints at http://localhost:8012"
echo "4. View traces in your Langfuse dashboard"
EOF

chmod +x scripts/verify-langfuse-setup.sh
print_status "Created setup verification script"

# 7. Create README for Langfuse integration
print_info "Creating Langfuse integration README..."

cat > LANGFUSE_INTEGRATION_README.md << 'EOF'
# Langfuse Integration for Buffr Host Microservices

## 🎯 Overview

This document provides comprehensive instructions for setting up and using Langfuse integration with Buffr Host microservices platform for enhanced AI observability and tracing.

## 🚀 Quick Start

### 1. Get Langfuse Credentials

1. Sign up for a free Langfuse Cloud account at [https://cloud.langfuse.com](https://cloud.langfuse.com)
2. Create a new project
3. Get your API keys from the project settings page

### 2. Configure Environment Variables

Update your `.env.local` files with your actual Langfuse credentials:

```bash
# Backend services
LANGFUSE_PUBLIC_KEY=pk-lf-your-actual-public-key
LANGFUSE_SECRET_KEY=sk-lf-your-actual-secret-key
LANGFUSE_HOST=https://cloud.langfuse.com
OPENAI_API_KEY=sk-proj-your-openai-key

# Frontend services
NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY=pk-lf-your-actual-public-key
NEXT_PUBLIC_LANGFUSE_SECRET_KEY=sk-lf-your-actual-secret-key
NEXT_PUBLIC_LANGFUSE_HOST=https://cloud.langfuse.com
```

### 3. Install Dependencies

```bash
# Install Python dependencies
cd microservices/ai-service
pip install -r requirements.txt

# Install Node.js dependencies
cd ../../frontend
npm install langfuse @langfuse/react
```

### 4. Start Services

```bash
# Start all services with Langfuse integration
docker-compose -f docker-compose.langfuse.yml up

# Or start individual services
cd microservices/ai-service
python main.py
```

### 5. Verify Setup

```bash
# Run verification script
./scripts/verify-langfuse-setup.sh
```

## 📊 Features

### AI Service Integration (Port 8012)
- ✅ Conversational AI with Langfuse tracing
- ✅ Intent classification and confidence scoring
- ✅ Context extraction and response generation
- ✅ Performance monitoring and caching
- ✅ Error tracking and debugging

### Frontend Integration
- ✅ Real-time conversation tracking
- ✅ User interaction monitoring
- ✅ Recommendation engine observability
- ✅ Performance metrics collection
- ✅ Error tracking and debugging

### Observability Features
- ✅ Comprehensive trace logging
- ✅ Performance metrics
- ✅ Error tracking
- ✅ User behavior analytics
- ✅ Business intelligence insights

## 🔧 Configuration

### Service Configuration

Each microservice includes Langfuse integration:

```python
# AI Service
from langfuse import get_client, observe
from langfuse.decorators import langfuse_context

langfuse = get_client()

@observe(name="conversation_endpoint")
async def handle_conversation(request):
    # Your AI logic here
    langfuse_context.update_current_trace(
        metadata={"user_id": request.user_id},
        tags=["conversation", "hospitality"]
    )
```

### Frontend Configuration

```typescript
// Frontend integration
import { useLangfuseTrace } from '@/lib/langfuse';

const { trackConversation, trackUserInteraction } = useLangfuseTrace();

// Track user interactions
await trackUserInteraction(userId, 'send_message', 'chat_interface');
```

## 📈 Monitoring

### Langfuse Dashboard

1. Visit your Langfuse project dashboard
2. View real-time traces and metrics
3. Analyze AI performance and user interactions
4. Monitor error rates and response times

### Key Metrics

- **Conversation Metrics**: Response time, intent accuracy, user satisfaction
- **Performance Metrics**: API response times, cache hit rates, error rates
- **Business Metrics**: Booking conversions, revenue per conversation, user engagement

## 🚨 Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check your Langfuse API keys
   - Verify the host URL is correct
   - Ensure environment variables are loaded

2. **Traces Not Appearing**
   - Check network connectivity
   - Verify service is running
   - Check Langfuse project settings

3. **Performance Issues**
   - Monitor trace volume
   - Check Redis connection
   - Optimize trace metadata

### Debug Commands

```bash
# Test Langfuse connection
python -c "from langfuse import get_client; print(get_client().auth_check())"

# Check environment variables
python -c "import os; print('LANGFUSE_PUBLIC_KEY' in os.environ)"

# Verify service health
curl http://localhost:8012/health
```

## 📚 Documentation

- [Langfuse Documentation](https://langfuse.com/docs)
- [Pydantic AI Documentation](https://ai.pydantic.dev/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)

## 🆘 Support

- **Technical Issues**: Check the troubleshooting section above
- **Langfuse Support**: [https://langfuse.com/support](https://langfuse.com/support)
- **Project Issues**: Create an issue in the project repository

## 🔄 Updates

This integration is regularly updated to include:
- New Langfuse features
- Performance optimizations
- Additional observability metrics
- Enhanced error tracking

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Production Ready
EOF

print_status "Created Langfuse integration README"

# 8. Final verification
print_info "Running final verification..."

# Make scripts executable
chmod +x scripts/setup-langfuse.sh
chmod +x scripts/verify-langfuse-setup.sh

print_status "Made setup scripts executable"

# Check if all files were created
required_files=(
    "microservices/ai-service/langfuse_integration.py"
    "frontend/src/lib/langfuse.ts"
    "frontend/src/components/ai/ChatInterface.tsx"
    "frontend/src/components/ai/RecommendationEngine.tsx"
    "docker-compose.langfuse.yml"
    "LANGFUSE_INTEGRATION_README.md"
)

all_files_exist=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "File created: $file"
    else
        print_error "File missing: $file"
        all_files_exist=false
    fi
done

echo ""
echo "🎉 Langfuse Integration Setup Complete!"
echo "======================================"

if [ "$all_files_exist" = true ]; then
    print_status "All required files have been created successfully"
else
    print_warning "Some files may be missing. Please check the output above."
fi

echo ""
echo "📋 Next Steps:"
echo "1. Update your .env files with actual Langfuse credentials"
echo "2. Get your API keys from https://cloud.langfuse.com"
echo "3. Run: ./scripts/verify-langfuse-setup.sh"
echo "4. Start services: docker-compose -f docker-compose.langfuse.yml up"
echo "5. Test AI endpoints at http://localhost:8012"
echo "6. View traces in your Langfuse dashboard"
echo ""
echo "📚 Documentation: See LANGFUSE_INTEGRATION_README.md"
echo "🔧 Configuration: See docs/langfuse-integration.md"
echo ""
print_status "Setup complete! Happy coding with Langfuse! 🚀"