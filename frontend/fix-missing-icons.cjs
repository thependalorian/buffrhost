#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of files that need icon imports
const filesToFix = [
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
];

// Common icons used in BI pages
const commonIcons = [
  'TrendingUp',
  'BarChart3',
  'Eye',
  'Target',
  'Users',
  'DollarSign',
  'PieChart',
  'Activity',
  'AlertTriangle',
  'CheckCircle',
  'Clock',
  'Database',
  'Filter',
  'Globe',
  'Heart',
  'Mail',
  'Phone',
  'Star',
];

function fixFile(filePath) {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Find which icons are used in the file
  const usedIcons = commonIcons.filter((icon) => content.includes(`<${icon}`));

  if (usedIcons.length > 0) {
    // Check if lucide-react import exists
    const lucideImportRegex =
      /import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"];?/;
    const lucideMatch = content.match(lucideImportRegex);

    if (lucideMatch) {
      // Add missing icons to existing import
      const existingIcons = lucideMatch[1]
        .split(',')
        .map((icon) => icon.trim());
      const newIcons = usedIcons.filter(
        (icon) => !existingIcons.includes(icon)
      );

      if (newIcons.length > 0) {
        const newImport = `import { ${[...existingIcons, ...newIcons].join(', ')} } from 'lucide-react';`;
        content = content.replace(lucideImportRegex, newImport);
        modified = true;
      }
    } else {
      // Add new lucide-react import
      const newImport = `import { ${usedIcons.join(', ')} } from 'lucide-react';`;

      // Find the last import statement and add after it
      const importRegex = /import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm;
      const matches = [...content.matchAll(importRegex)];

      if (matches.length > 0) {
        const lastImport = matches[matches.length - 1];
        const insertIndex = lastImport.index + lastImport[0].length;
        content =
          content.slice(0, insertIndex) +
          '\n' +
          newImport +
          content.slice(insertIndex);
        modified = true;
      }
    }
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

console.log('Missing icons restoration completed!');
