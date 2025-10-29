#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the page.tsx file
const filePath = path.join(__dirname, '../app/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all icon functions to accept className parameter
content = content.replace(
  /icon: \(\) => <DaisyIcon name="([^"]+)" className="([^"]+)" \/>/g,
  'icon: ({ className }: { className?: string } = {}) => <DaisyIcon name="$1" className={className || "$2"} />'
);

// Write the updated content back
fs.writeFileSync(filePath, content);

console.log('✅ Fixed all icon functions to accept className parameter');
