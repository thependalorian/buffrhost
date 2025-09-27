#!/bin/bash

# Langfuse Setup Verification Script
echo "🔍 Verifying Langfuse Setup for The Shandi Microservices"
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

# Check configuration files
echo "2. Checking configuration files..."
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

echo ""
echo "🎉 Langfuse setup verification complete!"
echo "Next steps:"
echo "1. Update your .env files with actual Langfuse credentials"
echo "2. Get your API keys from https://cloud.langfuse.com"
echo "3. Install dependencies: pip install -r microservices/ai-service/requirements.txt"
echo "4. Start the services with: docker-compose -f docker-compose.langfuse.yml up"
echo "5. Test the AI endpoints at http://localhost:8012"
echo "6. View traces in your Langfuse dashboard"
