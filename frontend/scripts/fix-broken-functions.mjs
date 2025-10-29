#!/usr/bin/env node

/**
 * Fix Broken Functions Script
 * Fixes all broken function signatures from the earlier TypeScript strict mode script
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing broken function signatures...\n');

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

    // Fix 1: Broken function signatures with double parentheses
    const brokenFunctionPattern = /const\s+(\w+)\s*=\s*\(\(([^)]+)\)\s*=>\s*{/g;
    const newContent1 = content.replace(
      brokenFunctionPattern,
      'const $1 = ($2) => {'
    );
    if (newContent1 !== content) {
      content = newContent1;
      modified = true;
    }

    // Fix 2: Missing default cases in switch statements
    const switchPattern = /switch\s*\([^)]+\)\s*{\s*([^}]*)\s*}\s*;?\s*$/gm;
    const newContent2 = content.replace(switchPattern, (match, body) => {
      if (!body.includes('default:')) {
        return match.replace('}', '      default:\n        break;\n    }');
      }
      return match;
    });
    if (newContent2 !== content) {
      content = newContent2;
      modified = true;
    }

    // Fix 3: Fix async function signatures
    const asyncFunctionPattern =
      /const\s+(\w+)\s*=\s*async\s*\(\(([^)]+)\)\s*=>\s*{/g;
    const newContent3 = content.replace(
      asyncFunctionPattern,
      'const $1 = async ($2) => {'
    );
    if (newContent3 !== content) {
      content = newContent3;
      modified = true;
    }

    // Fix 4: Fix function calls with await in non-async functions
    const awaitInNonAsyncPattern =
      /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*{[\s\S]*?await[\s\S]*?}/g;
    const newContent4 = content.replace(
      awaitInNonAsyncPattern,
      (match, funcName) => {
        if (!match.includes('async')) {
          return match.replace(
            `const ${funcName} = (`,
            `const ${funcName} = async (`
          );
        }
        return match;
      }
    );
    if (newContent4 !== content) {
      content = newContent4;
      modified = true;
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
console.log('2. Fix any remaining errors manually');
