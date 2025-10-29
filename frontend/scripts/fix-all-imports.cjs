#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Component mapping
const componentMappings = {
  Button: 'BuffrButton',
  Card: 'BuffrCard',
  CardBody: 'BuffrCardBody',
  CardHeader: 'BuffrCardHeader',
  CardTitle: 'BuffrCardTitle',
  CardContent: 'BuffrCardContent',
  Input: 'BuffrInput',
  Badge: 'BuffrBadge',
  Label: 'BuffrLabel',
  Checkbox: 'BuffrCheckbox',
  Divider: 'BuffrDivider',
  Select: 'BuffrSelect',
  Tabs: 'BuffrTabs',
  TabsList: 'BuffrTabsList',
  TabsTrigger: 'BuffrTabsTrigger',
  TabsContent: 'BuffrTabsContent',
  Table: 'BuffrTable',
  Alert: 'BuffrAlert',
  Switch: 'BuffrSwitch',
  Progress: 'BuffrProgress',
  Textarea: 'BuffrTextarea',
};

function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix import statements
    Object.entries(componentMappings).forEach(([oldName, newName]) => {
      const importRegex = new RegExp(
        `import\\s*\\{[^}]*\\b${oldName}\\b[^}]*\\}\\s*from\\s*['"]@/components/ui['"]`,
        'g'
      );
      if (importRegex.test(content)) {
        content = content.replace(new RegExp(`\\b${oldName}\\b`, 'g'), newName);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed imports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function findTsxFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (
        stat.isDirectory() &&
        !item.startsWith('.') &&
        item !== 'node_modules'
      ) {
        traverse(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

// Main execution
const appDir = path.join(__dirname, '../app');
const files = findTsxFiles(appDir);

console.log(`Found ${files.length} TypeScript files to process...`);

files.forEach((file) => {
  fixImportsInFile(file);
});

console.log('Import fixing completed!');
