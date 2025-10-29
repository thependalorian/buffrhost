const fs = require('fs');
const path = require('path');

// Function to fix remaining TypeScript issues
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

console.log('Starting final TypeScript fixes...');
fixFilesInDirectory('frontend');
console.log('Final TypeScript fixes complete!');