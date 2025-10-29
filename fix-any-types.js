const fs = require('fs');
const path = require('path');

// Function to fix any types in a file
function fixAnyTypes(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Common any type replacements
    const replacements = [
      // Function parameters
      { from: /: any\[\]/g, to: ': (string | number | boolean)[]' },
      { from: /: any\s*=/g, to: ': unknown =' },
      { from: /: any\s*\)/g, to: ': unknown)' },
      { from: /: any\s*;/g, to: ': unknown;' },
      { from: /: any\s*\{/g, to: ': Record<string, unknown> {' },
      { from: /: any\s*\[/g, to: ': unknown[]' },
      
      // Variable declarations
      { from: /let\s+(\w+):\s*any\s*=/g, to: 'let $1: unknown =' },
      { from: /const\s+(\w+):\s*any\s*=/g, to: 'const $1: unknown =' },
      { from: /var\s+(\w+):\s*any\s*=/g, to: 'var $1: unknown =' },
      
      // Function return types
      { from: /\):\s*any\s*\{/g, to: '): unknown {' },
      { from: /\):\s*any\s*=>/g, to: '): unknown =>' },
      
      // Object properties
      { from: /(\w+):\s*any\s*,/g, to: '$1: unknown,' },
      { from: /(\w+):\s*any\s*;/g, to: '$1: unknown;' },
      
      // Array types
      { from: /Array<any>/g, to: 'Array<unknown>' },
      { from: /any\[\]/g, to: 'unknown[]' },
      
      // Generic types
      { from: /<any>/g, to: '<unknown>' },
      
      // Type assertions
      { from: /as any/g, to: 'as unknown' },
      
      // Interface properties
      { from: /(\w+)\s*:\s*any\s*;/g, to: '$1: unknown;' },
    ];

    replacements.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        modified = true;
      }
    });

    // Special cases for common patterns
    if (content.includes('params: any[]')) {
      content = content.replace(/params:\s*any\[\]/g, 'params: (string | number | boolean)[]');
      modified = true;
    }

    if (content.includes('queryParams: any[]')) {
      content = content.replace(/queryParams:\s*any\[\]/g, 'queryParams: (string | number | boolean)[]');
      modified = true;
    }

    if (content.includes('whereConditions: any[]')) {
      content = content.replace(/whereConditions:\s*any\[\]/g, 'whereConditions: string[]');
      modified = true;
    }

    if (content.includes('filters: any[]')) {
      content = content.replace(/filters:\s*any\[\]/g, 'filters: (string | number | boolean)[]');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed any types in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Function to recursively find and fix files
function fixFilesInDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      fixFilesInDirectory(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fixAnyTypes(filePath);
    }
  });
}

console.log('Starting any type fixes...');
fixFilesInDirectory('frontend');
console.log('Any type fixes complete!');