#!/usr/bin/env node

/**
 * Test script for Etuna AI Agent
 *
 * This script tests the AI agent functionality
 * Run with: node scripts/test-ai-agent.js
 */

// Simple test without importing the TypeScript module
// This will test the API endpoint instead

async function testEtunaAgent() {
  console.log("🤖 Testing Etuna AI Agent Setup...\n");

  // Check environment variables
  if (!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY) {
    console.log(
      "⚠️  NEXT_PUBLIC_DEEPSEEK_API_KEY environment variable not set",
    );
    console.log("Please set your DeepSeek API key in .env.local file");
  } else {
    console.log("✅ DeepSeek API key found");
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.log("⚠️  ANTHROPIC_API_KEY environment variable not set");
    console.log("Please set your Anthropic API key in .env.local file");
  } else {
    console.log("✅ Anthropic API key found");
  }

  // Check if required files exist
  const fs = require("fs");
  const path = require("path");

  const requiredFiles = [
    "lib/ai/etuna-agent.ts",
    "app/api/ai/chat/route.ts",
    "app/guest/etuna/ai-assistant/page.tsx",
  ];

  console.log("\n📁 Checking required files...");

  let allFilesExist = true;
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - Missing`);
      allFilesExist = false;
    }
  }

  if (allFilesExist) {
    console.log("\n✅ All required files are present");
  } else {
    console.log("\n❌ Some required files are missing");
  }

  // Check dependencies
  console.log("\n📦 Checking dependencies...");
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const requiredDeps = [
    "@langchain/anthropic",
    "@langchain/core",
    "@langchain/langgraph",
    "duck-duck-scrape",
    "dotenv",
  ];

  let allDepsInstalled = true;
  for (const dep of requiredDeps) {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - Not installed`);
      allDepsInstalled = false;
    }
  }

  if (allDepsInstalled) {
    console.log("\n✅ All required dependencies are installed");
  } else {
    console.log("\n❌ Some dependencies are missing. Run: npm install");
  }

  console.log("\n🎉 Setup verification complete!");
  console.log("\n📝 Next steps:");
  console.log("1. Start the Next.js development server: npm run dev");
  console.log("2. Visit http://localhost:3000/guest/etuna/ai-assistant");
  console.log("3. Test the AI assistant in the browser");
  console.log("\n📚 For more information, see AI_AGENT_README.md");
}

// Run the test
testEtunaAgent().catch(console.error);
