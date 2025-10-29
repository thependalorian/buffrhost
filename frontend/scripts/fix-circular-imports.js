#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, '../components/ui');

// List of files that should not import from daisyui-index
const daisyuiComponentFiles = [
  'daisy-button.tsx',
  'daisy-card.tsx',
  'daisy-input.tsx',
  'daisy-alert.tsx',
  'daisy-badge.tsx',
  'daisy-modal.tsx',
  'daisy-tabs.tsx',
  'daisy-icons.tsx',
];

function fixCircularImports() {
  const files = fs.readdirSync(componentsDir);

  files.forEach((file) => {
    if (file.endsWith('.tsx') && daisyuiComponentFiles.includes(file)) {
      const filePath = path.join(componentsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');

      // Remove circular imports
      content = content.replace(
        /import\s*{\s*DaisyUI\s*}\s*from\s*['"]@\/components\/ui\/daisyui-index['"];?\s*\n?/g,
        ''
      );

      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed circular imports in ${file}`);
    }
  });
}

fixCircularImports();
console.log('🎉 All circular imports fixed!');
