const fs = require('fs');
const path = require('path');

// Function to fix JSX syntax errors in a file
function fixJSXSyntax(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix missing closing braces before return statements
    const returnPattern = /(\s+)(return\s*\(<)/g;
    if (returnPattern.test(content)) {
      content = content.replace(returnPattern, (match, indent, returnPart) => {
        // Check if there's a missing closing brace before this return
        const beforeReturn = content.substring(0, content.indexOf(match));
        const openBraces = (beforeReturn.match(/\{/g) || []).length;
        const closeBraces = (beforeReturn.match(/\}/g) || []).length;
        
        if (openBraces > closeBraces) {
          modified = true;
          return `${indent}};\n${indent}${returnPart}`;
        }
        return match;
      });
    }

    // Fix functions defined outside component functions
    const functionPattern = /(const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*{[^}]*};\s*)(const\s+\w+Page\s*=\s*\(\)\s*=>\s*{)/g;
    if (functionPattern.test(content)) {
      content = content.replace(functionPattern, (match, functions, component) => {
        modified = true;
        return `${component}\n${functions}`;
      });
    }

    // Fix duplicate component function definitions
    const duplicatePattern = /(const\s+\w+Page\s*=\s*\(\)\s*=>\s*{[^}]*};\s*)(const\s+\w+Page\s*=\s*\(\)\s*=>\s*{)/g;
    if (duplicatePattern.test(content)) {
      content = content.replace(duplicatePattern, (match, first, second) => {
        modified = true;
        return first;
      });
    }

    // Fix DaisyIcon to BuffrIcon
    if (content.includes('DaisyIcon')) {
      content = content.replace(/DaisyIcon/g, 'BuffrIcon');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed JSX syntax in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Get all TypeScript/JSX files that are failing
const files = [
  'frontend/app/property-owner/page.tsx',
  'frontend/app/protected/admin/dashboard/page.tsx',
  'frontend/app/protected/admin/overrides/pricing/page.tsx',
  'frontend/app/protected/admin/permissions/page.tsx',
  'frontend/app/protected/admin/roles/page.tsx'
];

console.log('Starting JSX syntax fixes...');
files.forEach(fixJSXSyntax);
console.log('JSX syntax fixes complete!');