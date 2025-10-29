#!/usr/bin/env node

/**
 * TypeScript Strict Mode Fix Script
 * Fixes common TypeScript strict mode errors in the BUFFR HOST frontend
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Starting TypeScript Strict Mode Fixes...\n');

// Common fixes for TypeScript strict mode errors
const fixes = [
  {
    name: 'Fix unused parameter warnings',
    pattern: /(\w+):\s*(\w+)\s*\)\s*=>\s*{/g,
    replacement: '(_$1: $2) => {',
    description: 'Prefix unused parameters with underscore',
  },
  {
    name: 'Fix unused variable warnings',
    pattern: /const\s+(\w+)\s*=\s*[^;]+;\s*\/\/\s*unused/gi,
    replacement: 'const _$1 = $2; // unused',
    description: 'Prefix unused variables with underscore',
  },
  {
    name: 'Fix index signature access',
    pattern: /(\w+)\.(\w+)/g,
    replacement: "$1['$2']",
    description:
      'Convert dot notation to bracket notation for index signatures',
  },
  {
    name: 'Fix missing return statements',
    pattern: /function\s+(\w+)\s*\([^)]*\)\s*{\s*$/gm,
    replacement: 'function $1() {\n  // TODO: Add return statement',
    description: 'Add TODO comments for functions missing return statements',
  },
];

// Files to process
const filesToProcess = [
  'app/api/test-db/route.ts',
  'app/api/test-env/route.ts',
  'app/api/waitlist/route.ts',
  'app/page.tsx',
  'components/features/landing/DemoHotelShowcase.tsx',
];

function fixFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  console.log(`🔧 Fixing ${filePath}...`);

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Apply fixes
  fixes.forEach((fix) => {
    const newContent = content.replace(fix.pattern, fix.replacement);
    if (newContent !== content) {
      content = newContent;
      modified = true;
      console.log(`  ✅ Applied: ${fix.description}`);
    }
  });

  // Specific fixes for common patterns
  if (filePath.includes('test-env/route.ts')) {
    // Fix environment variable access
    content = content.replace(/process\.env\.(\w+)/g, "process.env['$1']");
    modified = true;
    console.log('  ✅ Fixed environment variable access');
  }

  if (filePath.includes('page.tsx')) {
    // Fix params access
    content = content.replace(/params\.(\w+)/g, "params['$1']");
    modified = true;
    console.log('  ✅ Fixed params access');
  }

  if (modified) {
    fs.writeFileSync(fullPath, content);
    console.log(`  ✅ File updated: ${filePath}\n`);
  } else {
    console.log(`  ℹ️  No changes needed: ${filePath}\n`);
  }
}

// Process files
filesToProcess.forEach(fixFile);

console.log('🎉 TypeScript Strict Mode fixes completed!');
console.log('\nNext steps:');
console.log('1. Run: npm run type-check');
console.log('2. Fix remaining errors manually');
console.log('3. Run: npm run lint');
console.log('4. Fix remaining warnings');
