#!/bin/bash

# Environment Configuration and Credentials Audit Script
# Validates all required environment variables and configurations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED=0
FAILED=0
WARNINGS=0

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    local details=$3
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    case $status in
        "PASS")
            echo -e "${GREEN}✅ $message${NC}"
            PASSED=$((PASSED + 1))
            ;;
        "FAIL")
            echo -e "${RED}❌ $message${NC}"
            if [ -n "$details" ]; then
                echo -e "   ${RED}Details: $details${NC}"
            fi
            FAILED=$((FAILED + 1))
            ;;
        "WARN")
            echo -e "${YELLOW}⚠️  $message${NC}"
            if [ -n "$details" ]; then
                echo -e "   ${YELLOW}Details: $details${NC}"
            fi
            WARNINGS=$((WARNINGS + 1))
            ;;
    esac
}

# Function to check if environment variable is set and not a placeholder
check_env_var() {
    local var_name=$1
    local severity=$2
    local description=$3
    
    if [ -z "${!var_name}" ]; then
        print_status "FAIL" "$description not set" "Variable: $var_name"
        return 1
    elif [[ "${!var_name}" == *"your-"* ]] || [[ "${!var_name}" == *"sk-proj-your-"* ]]; then
        print_status "FAIL" "$description contains placeholder value" "Variable: $var_name"
        return 1
    else
        print_status "PASS" "$description is configured"
        return 0
    fi
}

echo "🔍 Starting Environment Configuration and Credentials Audit..."
echo "=================================================================="

# Load environment files
if [ -f ".env.local" ]; then
    source .env.local
fi

if [ -f "frontend/.env.local" ]; then
    source frontend/.env.local
fi

if [ -f "backend/.env.local" ]; then
    source backend/.env.local
fi

echo ""
echo "📋 1. REQUIRED ENVIRONMENT VARIABLES"
echo "------------------------------------"

# Critical environment variables
check_env_var "DATABASE_URL" "critical" "Database URL"
check_env_var "SENDGRID_API_KEY" "critical" "SendGrid API Key"
check_env_var "DEEPSEEK_API_KEY" "critical" "Deepseek API Key"
check_env_var "NEXT_PUBLIC_STACK_PROJECT_ID" "critical" "Stack Auth Project ID"
check_env_var "STACK_SECRET_SERVER_KEY" "critical" "Stack Auth Secret Key"

# Important variables
check_env_var "FROM_EMAIL" "high" "From Email Address"
check_env_var "NEXT_PUBLIC_APP_URL" "high" "App URL"
check_env_var "NODE_ENV" "medium" "Node Environment"

echo ""
echo "🗄️  2. DATABASE CONNECTIONS"
echo "---------------------------"

# Check database URL format
if [ -n "$DATABASE_URL" ]; then
    if [[ "$DATABASE_URL" == *"neon.tech"* ]] || [[ "$DATABASE_URL" == *"postgresql://"* ]]; then
        print_status "PASS" "Database URL format is valid for PostgreSQL"
    else
        print_status "WARN" "Database URL format may not be PostgreSQL" "URL: ${DATABASE_URL:0:30}..."
    fi
    
    if [[ "$DATABASE_URL" == *"sslmode=require"* ]]; then
        print_status "PASS" "Database URL includes SSL requirement"
    else
        print_status "WARN" "Database URL missing SSL mode requirement" "Add ?sslmode=require"
    fi
else
    print_status "FAIL" "No database URL configured"
fi

echo ""
echo "🔑 3. API KEY CONFIGURATIONS"
echo "----------------------------"

# SendGrid API Key format
if [ -n "$SENDGRID_API_KEY" ]; then
    if [[ "$SENDGRID_API_KEY" == SG.* ]]; then
        print_status "PASS" "SendGrid API key format is valid"
    else
        print_status "FAIL" "SendGrid API key format is invalid" "Should start with 'SG.'"
    fi
fi

# Deepseek API Key format
if [ -n "$DEEPSEEK_API_KEY" ]; then
    if [[ "$DEEPSEEK_API_KEY" == sk-* ]]; then
        print_status "PASS" "Deepseek API key format is valid"
    else
        print_status "FAIL" "Deepseek API key format is invalid" "Should start with 'sk-'"
    fi
fi

# OpenAI API Key format (optional)
if [ -n "$OPENAI_API_KEY" ]; then
    if [[ "$OPENAI_API_KEY" == sk-proj-* ]]; then
        print_status "PASS" "OpenAI API key format is valid"
    else
        print_status "WARN" "OpenAI API key format may be invalid" "Should start with 'sk-proj-'"
    fi
else
    print_status "WARN" "OpenAI API key not configured" "Optional but recommended"
fi

# Stack Auth configuration
if [ -n "$NEXT_PUBLIC_STACK_PROJECT_ID" ]; then
    if [[ "$NEXT_PUBLIC_STACK_PROJECT_ID" =~ ^[a-f0-9-]{36}$ ]]; then
        print_status "PASS" "Stack Auth Project ID format is valid"
    else
        print_status "FAIL" "Stack Auth Project ID format is invalid" "Should be UUID format"
    fi
fi

if [ -n "$STACK_SECRET_SERVER_KEY" ]; then
    if [[ "$STACK_SECRET_SERVER_KEY" == ssk_* ]]; then
        print_status "PASS" "Stack Auth Secret Key format is valid"
    else
        print_status "FAIL" "Stack Auth Secret Key format is invalid" "Should start with 'ssk_'"
    fi
fie
cho ""
echo "📄 4. ENVIRONMENT FILE CONSISTENCY"
echo "----------------------------------"

# Check if required files exist
files_to_check=(
    ".env.example:.env.local"
    "frontend/.env.example:frontend/.env.local"
    "backend/.env:backend/.env.local"
)

for file_pair in "${files_to_check[@]}"; do
    IFS=':' read -r example_file local_file <<< "$file_pair"
    
    if [ -f "$example_file" ]; then
        print_status "PASS" "Example file exists: $example_file"
    else
        print_status "WARN" "Example file missing: $example_file"
    fi
    
    if [ -f "$local_file" ]; then
        print_status "PASS" "Local file exists: $local_file"
    else
        print_status "FAIL" "Local file missing: $local_file" "Copy from $example_file"
    fi
done

echo ""
echo "🚀 5. VERCEL DEPLOYMENT CONFIGURATION"
echo "------------------------------------"

# Check Vercel configuration files
vercel_configs=("vercel.json" "frontend/vercel.json")
vercel_found=false

for config in "${vercel_configs[@]}"; do
    if [ -f "$config" ]; then
        vercel_found=true
        print_status "PASS" "Vercel config found: $config"
        
        # Check if it's valid JSON
        if jq empty "$config" 2>/dev/null; then
            print_status "PASS" "Vercel config is valid JSON"
        else
            print_status "FAIL" "Vercel config is invalid JSON" "File: $config"
        fi
    fi
done

if [ "$vercel_found" = false ]; then
    print_status "FAIL" "No Vercel configuration found" "Create vercel.json"
fi

# Check package.json for build script
if [ -f "frontend/package.json" ]; then
    if jq -e '.scripts.build' frontend/package.json > /dev/null 2>&1; then
        print_status "PASS" "Build script found in package.json"
    else
        print_status "FAIL" "Build script missing in package.json" "Add build script"
    fi
else
    print_status "FAIL" "frontend/package.json not found"
fi

# Check for production-ready URLs
prod_vars=("NEXT_PUBLIC_APP_URL" "NEXT_PUBLIC_API_URL")
for var in "${prod_vars[@]}"; do
    if [ -n "${!var}" ]; then
        if [[ "${!var}" == *"localhost"* ]] || [[ "${!var}" == *"127.0.0.1"* ]]; then
            print_status "WARN" "$var contains development URL" "Update for production: ${!var}"
        else
            print_status "PASS" "$var is production-ready"
        fi
    fi
done

echo ""
echo "=================================================================="
echo "🔍 AUDIT SUMMARY"
echo "=================================================================="

# Calculate overall status
if [ $FAILED -gt 0 ]; then
    overall_status="FAILED"
    status_color=$RED
    exit_code=1
elif [ $WARNINGS -gt 0 ]; then
    overall_status="WARNING"
    status_color=$YELLOW
    exit_code=0
else
    overall_status="PASSED"
    status_color=$GREEN
    exit_code=0
fi

echo -e "${status_color}Overall Status: $overall_status${NC}"
echo "Total Checks: $TOTAL_CHECKS"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"

echo ""
echo "💡 RECOMMENDATIONS"
echo "------------------"

if [ $FAILED -gt 0 ]; then
    echo "🚨 Fix critical environment configuration issues before deployment"
fi

if [ $WARNINGS -gt 5 ]; then
    echo "📋 Review and resolve configuration warnings for optimal setup"
fi

# Specific recommendations
if [ -z "$DATABASE_URL" ]; then
    echo "🗄️  Configure Neon PostgreSQL database connection"
fi

if [ -z "$SENDGRID_API_KEY" ] || [[ "$SENDGRID_API_KEY" == *"your-"* ]]; then
    echo "📧 Configure SendGrid API key for email functionality"
fi

if [ -z "$DEEPSEEK_API_KEY" ] || [[ "$DEEPSEEK_API_KEY" == *"your-"* ]]; then
    echo "🤖 Configure Deepseek API key for AI functionality"
fi

if [ "$vercel_found" = false ]; then
    echo "🚀 Create Vercel configuration for deployment"
fi

echo ""
echo "=================================================================="

exit $exit_code