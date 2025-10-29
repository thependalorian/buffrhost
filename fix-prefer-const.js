const fs = require('fs');
const path = require('path');

// Function to fix prefer-const issues
function fixPreferConst(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Common variables that should be const
    const constVariables = [
      'whereConditions',
      'centroids',
      'labels',
      'alpha',
      'beta',
      'omega',
      'emailBody',
      'paramCount',
      'queryParams',
      'params',
      'filters',
      'conditions',
    ];

    constVariables.forEach(varName => {
      // Fix let to const for specific variables
      const letPattern = new RegExp(`let\\s+${varName}\\s*=`, 'g');
      if (letPattern.test(content)) {
        content = content.replace(letPattern, `const ${varName} =`);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed prefer-const issues in: ${filePath}`);
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
      fixPreferConst(filePath);
    }
  });
}

console.log('Starting prefer-const fixes...');
fixFilesInDirectory('frontend');
console.log('Prefer-const fixes complete!');