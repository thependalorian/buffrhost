#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all files that have "use client" not at the top
const findFiles = () => {
  try {
    const result = execSync(
      'grep -l "use client" --include="*.tsx" --include="*.ts" .',
      {
        cwd: '/Users/georgenekwaya/ai-agent-mastery/buffr-host/frontend',
        encoding: 'utf8',
      }
    );
    return result.split('\n').filter((line) => line.trim());
  } catch (error) {
    return [];
  }
};

// Update a single file
const updateFile = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Check if "use client" is not at the very top
    const lines = content.split('\n');
    const firstNonEmptyLine = lines.findIndex((line) => line.trim() !== '');

    if (
      firstNonEmptyLine !== -1 &&
      lines[firstNonEmptyLine].trim() !== "'use client';" &&
      lines[firstNonEmptyLine].trim() !== '"use client";'
    ) {
      // Find "use client" directive
      const useClientIndex = lines.findIndex(
        (line) =>
          line.trim() === "'use client';" || line.trim() === '"use client";'
      );

      if (useClientIndex !== -1) {
        // Remove the "use client" line from its current position
        const useClientLine = lines[useClientIndex];
        lines.splice(useClientIndex, 1);

        // Add it at the top
        lines.unshift(useClientLine);

        content = lines.join('\n');
        updated = true;
      }
    }

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
console.log(`Found ${files.length} files to check`);

let updatedCount = 0;
files.forEach((file) => {
  if (updateFile(file)) {
    updatedCount++;
  }
});

console.log(`Updated ${updatedCount} files`);
