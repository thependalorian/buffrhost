#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all files that import remaining old components
const findFiles = () => {
  try {
    const result = execSync(
      'grep -r "@/components/ui/\\(checkbox\\|separator\\|select\\|textarea\\)" --include="*.tsx" --include="*.ts" .',
      {
        cwd: '/Users/georgenekwaya/ai-agent-mastery/buffr-host/frontend',
        encoding: 'utf8',
      }
    );
    return result
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.split(':')[0]);
  } catch (error) {
    return [];
  }
};

// Update a single file
const updateFile = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Replace old component imports with Buffr components
    const replacements = [
      { from: '@/components/ui/checkbox', to: 'BuffrCheckbox' },
      { from: '@/components/ui/separator', to: 'BuffrDivider' },
      { from: '@/components/ui/select', to: 'BuffrSelect' },
      { from: '@/components/ui/textarea', to: 'BuffrTextarea' },
    ];

    replacements.forEach(({ from, to }) => {
      if (content.includes(from)) {
        // Remove old import
        content = content.replace(
          new RegExp(
            `import\\s*{[^}]*}\\s*from\\s*['"]${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"];?\\s*`,
            'g'
          ),
          ''
        );

        // Add to existing Buffr import or create new one
        if (content.includes("from '@/components/ui'")) {
          const importMatch = content.match(
            /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/components\/ui['"];?/
          );
          if (importMatch) {
            const existingImports = importMatch[1];
            if (!existingImports.includes(to)) {
              const newImports = existingImports + ', ' + to;
              content = content.replace(
                /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/components\/ui['"];?/,
                `import { ${newImports} } from '@/components/ui';`
              );
            }
          }
        } else {
          // Add new import
          content = `import { ${to} } from '@/components/ui';\n${content}`;
        }

        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
    return false;
  }
};

// Main execution
const files = findFiles();
console.log(`Found ${files.length} files to update`);

let updatedCount = 0;
files.forEach((file) => {
  if (updateFile(file)) {
    updatedCount++;
  }
});

console.log(`Updated ${updatedCount} files`);
