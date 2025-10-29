#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../components/ui/daisy-icons.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the iconMap object and remove duplicates
const iconMapStart = content.indexOf(
  'const iconMap: Record<DaisyIconName, { iconClass: string; cssClass?: string }> = {'
);
const iconMapEnd = content.indexOf('};', iconMapStart) + 2;

if (iconMapStart !== -1 && iconMapEnd !== -1) {
  const iconMapContent = content.substring(iconMapStart, iconMapEnd);

  // Split into lines and remove duplicates
  const lines = iconMapContent.split('\n');
  const seen = new Set();
  const uniqueLines = [];

  for (const line of lines) {
    // Extract the key from lines like "  'key': { ... },"
    const keyMatch = line.match(/^\s*'([^']+)':/);
    if (keyMatch) {
      const key = keyMatch[1];
      if (!seen.has(key)) {
        seen.add(key);
        uniqueLines.push(line);
      }
    } else {
      uniqueLines.push(line);
    }
  }

  const newIconMapContent = uniqueLines.join('\n');
  content =
    content.substring(0, iconMapStart) +
    newIconMapContent +
    content.substring(iconMapEnd);

  fs.writeFileSync(filePath, content);
  console.log('✅ Removed duplicate icon properties');
} else {
  console.log('❌ Could not find iconMap in file');
}
