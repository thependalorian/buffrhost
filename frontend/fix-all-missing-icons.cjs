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

function fixFile(filePath) {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Find all icon components used in JSX
  const iconRegex = /<([A-Z][a-zA-Z0-9]*)\s+className/g;
  const matches = [...content.matchAll(iconRegex)];
  const usedIcons = [...new Set(matches.map((match) => match[1]))];

  // Filter out non-icon components (like Card, Button, etc.)
  const iconComponents = usedIcons.filter(
    (icon) =>
      ![
        'Card',
        'CardHeader',
        'CardTitle',
        'CardContent',
        'Button',
        'Input',
        'Badge',
        'div',
        'span',
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
      ].includes(icon)
  );

  if (iconComponents.length > 0) {
    console.log(`Found icons in ${filePath}:`, iconComponents);

    // Check if lucide-react import exists
    const lucideImportRegex =
      /import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"];?/;
    const lucideMatch = content.match(lucideImportRegex);

    if (lucideMatch) {
      // Add missing icons to existing import
      const existingIcons = lucideMatch[1]
        .split(',')
        .map((icon) => icon.trim());
      const newIcons = iconComponents.filter(
        (icon) => !existingIcons.includes(icon)
      );

      if (newIcons.length > 0) {
        const allIcons = [...existingIcons, ...newIcons].sort();
        const newImport = `import { ${allIcons.join(', ')} } from 'lucide-react';`;
        content = content.replace(lucideImportRegex, newImport);
        modified = true;
        console.log(`Added icons: ${newIcons.join(', ')}`);
      }
    } else {
      // Add new lucide-react import
      const newImport = `import { ${iconComponents.sort().join(', ')} } from 'lucide-react';`;

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
        console.log(
          `Added new import with icons: ${iconComponents.join(', ')}`
        );
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

console.log('All missing icons restoration completed!');
