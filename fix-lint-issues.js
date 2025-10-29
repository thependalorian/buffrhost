const fs = require('fs');
const path = require('path');

// Function to fix common linting issues
function fixLintIssues(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix 1: Remove unused DaisyUI imports
    if (content.includes("import { DaisyUI } from '@/components/ui/daisyui-index';")) {
      content = content.replace(/import { DaisyUI } from '@\/components\/ui\/daisyui-index';\n/g, '');
      modified = true;
    }

    // Fix 2: Remove unused InputSanitizer imports
    if (content.includes("import { InputSanitizer } from")) {
      content = content.replace(/import { InputSanitizer } from[^;]+;\n/g, '');
      modified = true;
    }

    // Fix 3: Remove unused crypto imports
    if (content.includes("import crypto from 'crypto';")) {
      content = content.replace(/import crypto from 'crypto';\n/g, '');
      modified = true;
    }

    // Fix 4: Remove unused DatabaseService imports
    if (content.includes("import { DatabaseService } from")) {
      content = content.replace(/import { DatabaseService } from[^;]+;\n/g, '');
      modified = true;
    }

    // Fix 5: Fix prefer-const issues (let to const for variables that are never reassigned)
    // This is a basic fix - more complex cases need manual review
    content = content.replace(/let queryParams = \[\];/g, 'const queryParams = [];');
    content = content.replace(/let whereConditions = \[\];/g, 'const whereConditions = [];');
    content = content.replace(/let params = \[\];/g, 'const params = [];');

    // Fix 6: Remove unused variables by commenting them out (safer than deletion)
    // This will be handled case by case

    // Fix 7: Replace console statements with proper logging (commented out for now)
    // This should be done carefully as console statements might be needed for debugging

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed linting issues in: ${filePath}`);
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
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
      fixLintIssues(filePath);
    }
  });
}

console.log('Starting linting fixes...');
fixFilesInDirectory('frontend');
console.log('Linting fixes complete!');