#!/usr/bin/env node

/**
 * Fix All Parameter Issues Script
 * Fixes all remaining parameter naming issues from TypeScript strict mode conversion
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing all parameter naming issues...\n');

// Get all TypeScript files
const files = await glob('**/*.{ts,tsx}', {
  cwd: path.join(__dirname, '..'),
  ignore: [
    'node_modules/**',
    '.next/**',
    'coverage/**',
    'test-results/**',
    'playwright-report/**',
  ],
});

console.log(`Found ${files.length} TypeScript files to process\n`);

let fixedFiles = 0;

for (const file of files) {
  const filePath = path.join(__dirname, '..', file);

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix 1: Function parameters with underscore prefix but used in function body
    const patterns = [
      // Pattern: const func = (_param: type) => { ... param ... }
      {
        regex:
          /const\s+(\w+)\s*=\s*\([^)]*_(\w+):\s*([^)]+)\)\s*=>\s*{([^}]*\b\2\b[^}]*)}/g,
        replacement: (match, funcName, paramName, paramType, body) => {
          return match.replace(`_${paramName}:`, `${paramName}:`);
        },
      },
      // Pattern: async function with underscore prefix
      {
        regex:
          /const\s+(\w+)\s*=\s*async\s*\([^)]*_(\w+):\s*([^)]+)\)\s*=>\s*{([^}]*\b\2\b[^}]*)}/g,
        replacement: (match, funcName, paramName, paramType, body) => {
          return match.replace(`_${paramName}:`, `${paramName}:`);
        },
      },
      // Pattern: useCallback with underscore prefix
      {
        regex:
          /const\s+(\w+)\s*=\s*useCallback\s*\([^)]*_(\w+):\s*([^)]+)\)\s*=>\s*{([^}]*\b\2\b[^}]*)}/g,
        replacement: (match, funcName, paramName, paramType, body) => {
          return match.replace(`_${paramName}:`, `${paramName}:`);
        },
      },
    ];

    for (const pattern of patterns) {
      const newContent = content.replace(pattern.regex, pattern.replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }

    // Fix 2: Specific common patterns
    const specificFixes = [
      // Fix getSeverityColor pattern
      {
        from: /const getSeverityColor = \(_severity: string\) => {[\s\S]*?switch \(severity\)/g,
        to: 'const getSeverityColor = (severity: string) => {\n    switch (severity)',
      },
      // Fix getStatusColor pattern
      {
        from: /const getStatusColor = \(_status: string\) => {[\s\S]*?switch \(status\)/g,
        to: 'const getStatusColor = (status: string) => {\n    switch (status)',
      },
      // Fix getTypeIcon pattern
      {
        from: /const getTypeIcon = \(_type: string\) => {[\s\S]*?switch \(type\)/g,
        to: 'const getTypeIcon = (type: string) => {\n    switch (type)',
      },
      // Fix getEnvironmentColor pattern
      {
        from: /const getEnvironmentColor = \(_environment: string\) => {[\s\S]*?switch \(environment\)/g,
        to: 'const getEnvironmentColor = (environment: string) => {\n    switch (environment)',
      },
      // Fix formatCurrency pattern
      {
        from: /const formatCurrency = \(_amount: number\) => {[\s\S]*?format\(amount\)/g,
        to: "const formatCurrency = (amount: number) => {\n    return new Intl.NumberFormat('en-US', {\n      style: 'currency',\n      currency: 'USD'\n    }).format(amount);",
      },
      // Fix formatDate pattern
      {
        from: /const formatDate = \(_dateString: string\) => {[\s\S]*?Date\(dateString\)/g,
        to: 'const formatDate = (dateString: string) => {\n    return new Date(dateString).toLocaleString();',
      },
    ];

    for (const fix of specificFixes) {
      const newContent = content.replace(fix.from, fix.to);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${file}`);
      fixedFiles++;
    }
  } catch (error) {
    console.log(`❌ Error processing ${file}: ${error.message}`);
  }
}

console.log(
  `\n🎉 Fixed ${fixedFiles} files out of ${files.length} total files`
);
console.log('\nNext steps:');
console.log('1. Run: npm run build');
console.log('2. Check for any remaining errors');
