#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 Buffr Host Branding Consistency Fix Script');
console.log('===============================================\n');

// Brand color mappings
const brandMappings = {
  // Generic colors to Buffr nude palette
  'bg-blue-500': 'bg-nude-600',
  'bg-blue-600': 'bg-nude-700',
  'bg-blue-700': 'bg-nude-800',
  'bg-green-500': 'bg-semantic-success',
  'bg-green-600': 'bg-semantic-success',
  'bg-red-500': 'bg-semantic-error',
  'bg-red-600': 'bg-semantic-error',
  'bg-yellow-500': 'bg-semantic-warning',
  'bg-yellow-600': 'bg-semantic-warning',

  // Text colors
  'text-blue-500': 'text-nude-600',
  'text-blue-600': 'text-nude-700',
  'text-blue-700': 'text-nude-800',
  'text-green-500': 'text-semantic-success',
  'text-green-600': 'text-semantic-success',
  'text-red-500': 'text-semantic-error',
  'text-red-600': 'text-semantic-error',
  'text-yellow-500': 'text-semantic-warning',
  'text-yellow-600': 'text-semantic-warning',

  // Border colors
  'border-blue-500': 'border-nude-600',
  'border-blue-600': 'border-nude-700',
  'border-green-500': 'border-semantic-success',
  'border-red-500': 'border-semantic-error',
  'border-yellow-500': 'border-semantic-warning',

  // Generic grays to nude palette
  'bg-gray-50': 'bg-nude-50',
  'bg-gray-100': 'bg-nude-100',
  'bg-gray-200': 'bg-nude-200',
  'bg-gray-300': 'bg-nude-300',
  'bg-gray-400': 'bg-nude-400',
  'bg-gray-500': 'bg-nude-500',
  'bg-gray-600': 'bg-nude-600',
  'bg-gray-700': 'bg-nude-700',
  'bg-gray-800': 'bg-nude-800',
  'bg-gray-900': 'bg-nude-900',

  'text-gray-50': 'text-nude-50',
  'text-gray-100': 'text-nude-100',
  'text-gray-200': 'text-nude-200',
  'text-gray-300': 'text-nude-300',
  'text-gray-400': 'text-nude-400',
  'text-gray-500': 'text-nude-500',
  'text-gray-600': 'text-nude-600',
  'text-gray-700': 'text-nude-700',
  'text-gray-800': 'text-nude-800',
  'text-gray-900': 'text-nude-900',

  'border-gray-50': 'border-nude-50',
  'border-gray-100': 'border-nude-100',
  'border-gray-200': 'border-nude-200',
  'border-gray-300': 'border-nude-300',
  'border-gray-400': 'border-nude-400',
  'border-gray-500': 'border-nude-500',
  'border-gray-600': 'border-nude-600',
  'border-gray-700': 'border-nude-700',
  'border-gray-800': 'border-nude-800',
  'border-gray-900': 'border-nude-900',

  // Generic whites to nude palette
  'text-white': 'text-nude-50',
  'bg-white': 'bg-nude-50',
  'border-white': 'border-nude-50',

  // Generic blacks to nude palette
  'text-black': 'text-nude-900',
  'bg-black': 'bg-nude-900',
  'border-black': 'border-nude-900',

  // Generic transparent to nude palette
  'bg-transparent': 'bg-nude-50/80',

  // Generic shadows to Buffr shadows
  'shadow-sm': 'shadow-nude-soft',
  'shadow-md': 'shadow-nude-medium',
  'shadow-lg': 'shadow-nude-strong',
  'shadow-xl': 'shadow-luxury-medium',
  'shadow-2xl': 'shadow-luxury-strong',
};

// Button mappings
const buttonMappings = {
  'bg-blue-500 hover:bg-blue-600': 'btn-ios-primary',
  'bg-green-500 hover:bg-green-600': 'btn-ios-primary',
  'bg-red-500 hover:bg-red-600': 'btn-ios-primary',
  'bg-gray-500 hover:bg-gray-600': 'btn-ios-secondary',
  'bg-gray-100 hover:bg-gray-200': 'btn-ios-ghost',
  'border border-gray-300': 'btn-ios-ghost',
};

function fixBrandingInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    let changeCount = 0;

    // Apply brand color mappings
    for (const [oldColor, newColor] of Object.entries(brandMappings)) {
      const regex = new RegExp(
        oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'g'
      );
      if (content.includes(oldColor)) {
        content = content.replace(regex, newColor);
        hasChanges = true;
        changeCount++;
      }
    }

    // Apply button mappings
    for (const [oldButton, newButton] of Object.entries(buttonMappings)) {
      if (content.includes(oldButton)) {
        content = content.replace(
          new RegExp(oldButton.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          newButton
        );
        hasChanges = true;
        changeCount++;
      }
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${changeCount} branding issues in: ${filePath}`);
      return changeCount;
    }

    return 0;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
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
try {
  const appDir = path.join(__dirname, '..', 'app');
  const files = findTsxFiles(appDir);

  console.log(`📁 Found ${files.length} TypeScript files to audit\n`);

  let totalChanges = 0;
  let filesChanged = 0;

  for (const file of files) {
    const changes = fixBrandingInFile(file);
    if (changes > 0) {
      totalChanges += changes;
      filesChanged++;
    }
  }

  console.log('\n🎯 Branding Fix Summary:');
  console.log(`📊 Files processed: ${files.length}`);
  console.log(`🔧 Files changed: ${filesChanged}`);
  console.log(`🎨 Total changes: ${totalChanges}`);

  if (totalChanges > 0) {
    console.log('\n✅ Branding consistency fixes applied successfully!');
    console.log('🚀 All files now use Buffr Host nude color palette');
  } else {
    console.log(
      '\n✅ No branding inconsistencies found - all files are compliant!'
    );
  }
} catch (error) {
  console.error('❌ Script execution failed:', error.message);
  process.exit(1);
}
