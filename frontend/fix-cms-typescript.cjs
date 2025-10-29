#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = 'app/protected/cms/page.tsx';
const fullPath = path.join(__dirname, filePath);

if (!fs.existsSync(fullPath)) {
  console.log(`File not found: ${filePath}`);
  process.exit(1);
}

let content = fs.readFileSync(fullPath, 'utf8');
let modified = false;

// Fix all property access issues by converting dot notation to bracket notation
// for properties that come from index signatures

// Fix stats.by_type.image -> stats.by_type['image']
content = content.replace(/stats\.by_type\.(\w+)/g, "stats.by_type['$1']");
modified = true;

// Fix stats.by_status.published -> stats.by_status['published']
content = content.replace(/stats\.by_status\.(\w+)/g, "stats.by_status['$1']");
modified = true;

// Fix stats.by_author.(\w+) -> stats.by_author['$1']
content = content.replace(/stats\.by_author\.(\w+)/g, "stats.by_author['$1']");
modified = true;

// Fix any other similar patterns
content = content.replace(/\.(\w+)\s*\|\|/g, "['$1'] ||");
modified = true;

if (modified) {
  fs.writeFileSync(fullPath, content);
  console.log(`Fixed TypeScript issues in: ${filePath}`);
} else {
  console.log(`No changes needed: ${filePath}`);
}

console.log('CMS TypeScript fixes completed!');
