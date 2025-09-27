#!/bin/bash

# Etuna AI Agent Setup Script
# This script sets up the AI agent environment and dependencies

echo "🤖 Setting up Etuna AI Agent..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install dependencies
echo "📦 Installing AI agent dependencies..."
npm install @langchain/anthropic @langchain/core @langchain/langgraph duck-duck-scrape dotenv

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

# Check for environment variables
echo "🔧 Checking environment configuration..."

if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found. Creating template..."
    cat > .env.local << EOF
# Etuna AI Agent Environment Configuration

# AI API Keys (Required)
NEXT_PUBLIC_DEEPSEEK_API_KEY=your_deepseek_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Frontend Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
EOF
    echo "📝 Created .env.local template. Please update with your API keys."
else
    echo "✅ .env.local file found"
fi

# Check for required API keys
if grep -q "your_.*_api_key_here" .env.local; then
    echo "⚠️  Please update your API keys in .env.local file"
    echo "   - NEXT_PUBLIC_DEEPSEEK_API_KEY"
    echo "   - ANTHROPIC_API_KEY"
else
    echo "✅ API keys appear to be configured"
fi

# Test the setup
echo "🧪 Testing AI agent setup..."
if node scripts/test-ai-agent.js; then
    echo "✅ AI agent test passed"
else
    echo "⚠️  AI agent test failed. Please check your configuration."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update your API keys in .env.local"
echo "2. Start the development server: npm run dev"
echo "3. Visit: http://localhost:3000/guest/etuna/ai-assistant"
echo ""
echo "📚 For more information, see AI_AGENT_README.md"
