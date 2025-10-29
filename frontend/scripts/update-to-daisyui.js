#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Component mappings from old patterns to DaisyUI
const componentMappings = {
  // Button patterns
  'className="btn': 'className="btn',
  'btn-primary':
    'btn-primary bg-gradient-to-r from-nude-600 to-nude-700 hover:from-nude-700 hover:to-nude-800 text-white shadow-luxury-soft',
  'btn-secondary':
    'btn-secondary bg-nude-500 hover:bg-nude-600 text-white shadow-nude-soft',
  'btn-ghost': 'btn-ghost text-nude-600 hover:bg-nude-100 hover:text-nude-700',

  // Card patterns
  'className="card': 'className="card',
  'bg-white': 'bg-nude-50',
  'border-gray-200': 'border-nude-200',
  'shadow-sm': 'shadow-nude-soft',
  'shadow-md': 'shadow-luxury-medium',
  'shadow-lg': 'shadow-luxury-strong',

  // Input patterns
  'className="input': 'className="input',
  'border-gray-300': 'border-nude-300',
  'focus:border-blue-500': 'focus:border-luxury-charlotte',
  'focus:ring-blue-500': 'focus:ring-luxury-charlotte/20',

  // Text colors
  'text-gray-900': 'text-nude-900',
  'text-gray-800': 'text-nude-800',
  'text-gray-700': 'text-nude-700',
  'text-gray-600': 'text-nude-600',
  'text-gray-500': 'text-nude-500',
  'text-gray-400': 'text-nude-400',

  // Background colors
  'bg-gray-50': 'bg-nude-50',
  'bg-gray-100': 'bg-nude-100',
  'bg-gray-200': 'bg-nude-200',

  // Border colors
  'border-gray-200': 'border-nude-200',
  'border-gray-300': 'border-nude-300',

  // Hover effects
  'hover:shadow-md': 'hover:shadow-luxury-medium hover-lift-emotional',
  'hover:shadow-lg': 'hover:shadow-luxury-strong hover-lift-emotional',
  'hover:bg-gray-50': 'hover:bg-nude-100',
  'hover:bg-gray-100': 'hover:bg-nude-200',

  // Focus effects
  'focus:ring-2': 'focus:ring-2 focus:ring-luxury-charlotte/20',
  'focus:ring-blue-500': 'focus:ring-luxury-charlotte/20',
  'focus:border-blue-500': 'focus:border-luxury-charlotte',

  // Transitions
  'transition-all': 'transition-all duration-300',
  'transition-colors': 'transition-colors duration-300',
  'transition-shadow': 'transition-shadow duration-300',
  'transition-transform': 'transition-transform duration-300',
};

// Function to update a single file
function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // Add DaisyUI import if not present and file uses DaisyUI classes
  if (
    content.includes('nude-') ||
    content.includes('luxury-') ||
    content.includes('semantic-')
  ) {
    if (
      !content.includes('import { DaisyUI') &&
      !content.includes("from './daisyui")
    ) {
      // Find the last import statement
      const importRegex = /import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm;
      const imports = content.match(importRegex);
      if (imports) {
        const lastImport = imports[imports.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport);
        const insertIndex = lastImportIndex + lastImport.length;

        content =
          content.slice(0, insertIndex) +
          "\nimport { DaisyUI } from '@/components/ui/daisyui-index';" +
          content.slice(insertIndex);
        hasChanges = true;
      }
    }
  }

  // Apply component mappings
  for (const [oldPattern, newPattern] of Object.entries(componentMappings)) {
    if (content.includes(oldPattern)) {
      content = content.replace(
        new RegExp(oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        newPattern
      );
      hasChanges = true;
    }
  }

  // Add hover-lift-emotional class to interactive elements
  const interactiveElements = [
    'className="card',
    'className="btn',
    'className="badge',
    'className="alert',
  ];

  interactiveElements.forEach((element) => {
    if (
      content.includes(element) &&
      !content.includes('hover-lift-emotional')
    ) {
      content = content.replace(
        new RegExp(`(${element}[^"]*)"`, 'g'),
        '$1 hover-lift-emotional"'
      );
      hasChanges = true;
    }
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${filePath}`);
    return true;
  }
  return false;
}

// Main execution
async function main() {
  console.log('🎨 Updating all components to use DaisyUI system...');

  const files = await glob('**/*.{ts,tsx}', {
    cwd: path.join(__dirname, '..'),
    ignore: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      '**/daisyui-*.tsx',
    ],
  });

  console.log(`📁 Found ${files.length} files to check`);

  let updatedCount = 0;
  for (const file of files) {
    const filePath = path.join(__dirname, '..', file);
    if (updateFile(filePath)) {
      updatedCount++;
    }
  }

  console.log(`\n🎉 Updated ${updatedCount} files with DaisyUI brand identity`);
  console.log('✨ All components now embody our Buffr Host brand identity!');
}

main().catch(console.error);
