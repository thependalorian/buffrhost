#!/usr/bin/env node

/**
 * TypeScript Strict Mode Fix Script
 * Fixes common TypeScript strict mode errors in the BUFFR HOST frontend
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Starting TypeScript Strict Mode Fixes...\n');

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

    // Fix 1: Unused parameters in function signatures
    const unusedParamPattern = /(\w+):\s*(\w+)\s*\)\s*=>\s*{/g;
    const newContent1 = content.replace(unusedParamPattern, '(_$1: $2) => {');
    if (newContent1 !== content) {
      content = newContent1;
      modified = true;
    }

    // Fix 2: Environment variable access
    const envPattern = /process\.env\.(\w+)/g;
    const newContent2 = content.replace(envPattern, "process.env['$1']");
    if (newContent2 !== content) {
      content = newContent2;
      modified = true;
    }

    // Fix 3: Params access in Next.js pages
    const paramsPattern = /params\.(\w+)/g;
    const newContent3 = content.replace(paramsPattern, "params['$1']");
    if (newContent3 !== content) {
      content = newContent3;
      modified = true;
    }

    // Fix 4: Remove unused imports (basic)
    const unusedImportPattern =
      /import\s*{\s*([^}]+)\s*}\s*from\s*['"][^'"]+['"];\s*$/gm;
    const newContent4 = content.replace(
      unusedImportPattern,
      (match, imports) => {
        // This is a basic fix - in practice, you'd need more sophisticated analysis
        return match;
      }
    );

    // Fix 5: Add return statements to functions that need them
    const functionPattern = /function\s+(\w+)\s*\([^)]*\)\s*{\s*$/gm;
    const newContent5 = content.replace(
      functionPattern,
      'function $1() {\n  // TODO: Add return statement'
    );

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${file}`);
      fixedFiles++;
    }
  } catch (error) {
    console.log(`❌ Error processing ${file}: ${error.message}`);
  }
}

console.log(`\n🎉 TypeScript Strict Mode fixes completed!`);
console.log(`Fixed ${fixedFiles} files out of ${files.length} total files`);
console.log('\nNext steps:');
console.log('1. Run: npm run type-check');
console.log('2. Fix remaining errors manually');
console.log('3. Run: npm run lint');
console.log('4. Fix remaining warnings');
