const fs = require('fs');
const path = require('path');

// Function to fix comprehensive TypeScript issues
function fixTypeScriptIssues(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix array type declarations
    const arrayFixes = [
      { from: /const (\w+) = \[\];/g, to: 'const $1: (string | number)[] = [];' },
      { from: /let (\w+) = \[\];/g, to: 'let $1: (string | number)[] = [];' },
      { from: /const (\w+Fields) = \[\];/g, to: 'const $1: string[] = [];' },
      { from: /const (\w+Values) = \[\];/g, to: 'const $1: (string | number)[] = [];' },
      { from: /const (\w+Conditions) = \[\];/g, to: 'const $1: string[] = [];' },
      { from: /const (\w+Params) = \[\];/g, to: 'const $1: (string | number)[] = [];' },
    ];

    arrayFixes.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        modified = true;
      }
    });

    // Fix any types
    const anyFixes = [
      { from: /: any\[\]/g, to: ': (string | number | boolean)[]' },
      { from: /: any\s*=/g, to: ': unknown =' },
      { from: /: any\s*\)/g, to: ': unknown)' },
      { from: /: any\s*;/g, to: ': unknown;' },
      { from: /: any\s*\{/g, to: ': Record<string, unknown> {' },
      { from: /: any\s*\[/g, to: ': unknown[]' },
      { from: /let\s+(\w+):\s*any\s*=/g, to: 'let $1: unknown =' },
      { from: /const\s+(\w+):\s*any\s*=/g, to: 'const $1: unknown =' },
      { from: /var\s+(\w+):\s*any\s*=/g, to: 'var $1: unknown =' },
      { from: /\):\s*any\s*\{/g, to: '): unknown {' },
      { from: /\):\s*any\s*=>/g, to: '): unknown =>' },
      { from: /(\w+):\s*any\s*,/g, to: '$1: unknown,' },
      { from: /(\w+):\s*any\s*;/g, to: '$1: unknown;' },
      { from: /Array<any>/g, to: 'Array<unknown>' },
      { from: /any\[\]/g, to: 'unknown[]' },
      { from: /<any>/g, to: '<unknown>' },
      { from: /as any/g, to: 'as unknown' },
      { from: /(\w+)\s*:\s*any\s*;/g, to: '$1: unknown;' },
    ];

    anyFixes.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        modified = true;
      }
    });

    // Fix specific patterns
    if (content.includes('const queryParams = []')) {
      content = content.replace(/const queryParams = \[\];/g, 'const queryParams: (string | number)[] = [];');
      modified = true;
    }

    if (content.includes('const whereConditions = []')) {
      content = content.replace(/const whereConditions = \[\];/g, 'const whereConditions: string[] = [];');
      modified = true;
    }

    if (content.includes('const updateFields = []')) {
      content = content.replace(/const updateFields = \[\];/g, 'const updateFields: string[] = [];');
      modified = true;
    }

    if (content.includes('const updateValues = []')) {
      content = content.replace(/const updateValues = \[\];/g, 'const updateValues: (string | number)[] = [];');
      modified = true;
    }

    // Fix null assignment issues
    if (content.includes('let crossProjectData = null')) {
      content = content.replace(/let crossProjectData = null/g, 'let crossProjectData: unknown = null');
      modified = true;
    }

    // Fix user type issues
    if (content.includes('let user = null')) {
      content = content.replace(/let user = null/g, 'let user: any = null');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed TypeScript issues in: ${filePath}`);
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
      fixTypeScriptIssues(filePath);
    }
  });
}

console.log('Starting comprehensive TypeScript fixes...');
fixFilesInDirectory('frontend');
console.log('Comprehensive TypeScript fixes complete!');