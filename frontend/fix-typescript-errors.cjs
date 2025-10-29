#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of files with unused imports that need to be fixed
const filesToFix = [
  'app/protected/bi/data-visualization/page.tsx',
  'app/protected/bi/dynamic-pricing/page.tsx',
  'app/protected/bi/financial-education/page.tsx',
  'app/protected/bi/fraud-detection/page.tsx',
  'app/protected/bi/gamification/page.tsx',
  'app/protected/bi/mlops/page.tsx',
  'app/protected/bi/model-monitoring/page.tsx',
  'app/protected/bi/predictive-analytics/page.tsx',
  'app/protected/bi/realtime-analytics/page.tsx',
  'app/protected/bi/recommendations/page.tsx',
  'app/protected/bi/spending-analysis/page.tsx',
  'app/restaurants/page.tsx',
  'app/restaurants/[id]/page.tsx',
  'app/protected/customers/page.tsx',
];

// Common unused imports to remove
const unusedImports = [
  'PredictionChart',
  'DataQualityIndicator',
  'DataQualityMetrics',
  'Phone',
  'Mail',
  'Globe',
  'CardHeader',
  'MapPin',
  'Calendar',
  'Trash2',
  'Heart',
  'FileText',
];

// Common unused variables to remove
const unusedVariables = ['dataQuality', 'setRestaurants', 'action'];

function fixFile(filePath) {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Remove unused imports
  unusedImports.forEach((importName) => {
    const importRegex = new RegExp(
      `import\\s*{[^}]*\\b${importName}\\b[^}]*}\\s*from\\s*['"][^'"]+['"];?\\s*\\n?`,
      'g'
    );
    if (content.match(importRegex)) {
      content = content.replace(importRegex, '');
      modified = true;
    }
  });

  // Remove unused variables
  unusedVariables.forEach((varName) => {
    // Handle useState destructuring
    const useStateRegex = new RegExp(
      `\\s*const\\s+\\[${varName}[^\\]]*\\]\\s*=\\s*useState[^;]*;\\s*\\n?`,
      'g'
    );
    if (content.match(useStateRegex)) {
      content = content.replace(useStateRegex, '');
      modified = true;
    }

    // Handle regular const declarations
    const varRegex = new RegExp(`\\s*const\\s+${varName}[^;]*;\\s*\\n?`, 'g');
    if (content.match(varRegex)) {
      content = content.replace(varRegex, '');
      modified = true;
    }
  });

  // Fix specific issues
  if (filePath.includes('restaurants/[id]/page.tsx')) {
    // Fix unused action parameter
    content = content.replace(
      /const handleActionClick = \(action: string\) => {/,
      'const handleActionClick = (_action: string) => {'
    );
    modified = true;
  }

  if (filePath.includes('restaurants/page.tsx')) {
    // Remove setRestaurants from useState
    content = content.replace(
      /const \[restaurants, setRestaurants\] = useState/,
      'const [restaurants] = useState'
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed: ${filePath}`);
  } else {
    console.log(`No changes needed: ${filePath}`);
  }
}

// Fix all files
filesToFix.forEach(fixFile);

console.log('TypeScript error fixes completed!');
