#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of files that need their imports restored
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

  // Add missing imports at the top
  const missingImports = [
    "import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';",
    "import { biService, BIMetrics } from '@/lib/services/bi-service';",
  ];

  // Check if imports are missing and add them
  missingImports.forEach((importLine) => {
    if (!content.includes(importLine)) {
      // Find the last import statement and add after it
      const importRegex = /import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm;
      const matches = [...content.matchAll(importRegex)];

      if (matches.length > 0) {
        const lastImport = matches[matches.length - 1];
        const insertIndex = lastImport.index + lastImport[0].length;
        content =
          content.slice(0, insertIndex) +
          '\n' +
          importLine +
          content.slice(insertIndex);
        modified = true;
      }
    }
  });

  // Fix missing PredictionData type
  if (
    content.includes('PredictionData') &&
    !content.includes('interface PredictionData')
  ) {
    const typeDefinition = `
interface PredictionData {
  id: string;
  value: number;
  confidence: number;
  timestamp: string;
}
`;

    // Add after the last import
    const importRegex = /import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm;
    const matches = [...content.matchAll(importRegex)];

    if (matches.length > 0) {
      const lastImport = matches[matches.length - 1];
      const insertIndex = lastImport.index + lastImport[0].length;
      content =
        content.slice(0, insertIndex) +
        '\n' +
        typeDefinition +
        content.slice(insertIndex);
      modified = true;
    }
  }

  // Remove setDataQuality calls that reference undefined variables
  content = content.replace(/setDataQuality\([^)]*\);\s*/g, '');
  modified = true;

  if (modified) {
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed: ${filePath}`);
  } else {
    console.log(`No changes needed: ${filePath}`);
  }
}

// Fix all files
filesToFix.forEach(fixFile);

console.log('Missing imports restoration completed!');
