const fs = require('fs');
const path = require('path');

// Function to fix specific files with proper structure
function fixSpecificFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix DaisyIcon to BuffrIcon
    if (content.includes('DaisyIcon')) {
      content = content.replace(/DaisyIcon/g, 'BuffrIcon');
      modified = true;
    }

    // Fix Card to BuffrCard
    if (content.includes('<Card') || content.includes('</Card>')) {
      content = content.replace(/<Card/g, '<BuffrCard');
      content = content.replace(/<\/Card>/g, '</BuffrCard>');
      modified = true;
    }

    // Fix BuffrBuffrCard to BuffrCard
    if (content.includes('BuffrBuffrCard')) {
      content = content.replace(/BuffrBuffrCard/g, 'BuffrCard');
      modified = true;
    }

    // Remove broken function definitions that are outside components
    const lines = content.split('\n');
    let newLines = [];
    let inMainComponent = false;
    let braceCount = 0;
    let skipUntilNextFunction = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if we're starting the main component
      if (line.includes('export default function') && line.includes('(')) {
        inMainComponent = true;
        braceCount = 1;
        newLines.push(line);
        continue;
      }
      
      if (inMainComponent) {
        // Count braces
        if (line.includes('{')) braceCount++;
        if (line.includes('}')) braceCount--;
        
        // Skip broken function definitions
        if (line.trim().startsWith('switch (') && !line.includes('const ') && !line.includes('function')) {
          skipUntilNextFunction = true;
          continue;
        }
        
        if (skipUntilNextFunction) {
          if (line.trim().startsWith('}') && !line.includes('const ') && !line.includes('function')) {
            skipUntilNextFunction = false;
            continue;
          }
          continue;
        }
        
        // Skip standalone return statements outside functions
        if (line.trim().startsWith('return ') && !line.includes('const ') && !line.includes('function')) {
          continue;
        }
        
        // Skip standalone if statements outside functions
        if (line.trim().startsWith('if (') && !line.includes('const ') && !line.includes('function')) {
          continue;
        }
        
        newLines.push(line);
        
        // Check if main component is complete
        if (braceCount === 0) {
          inMainComponent = false;
        }
      } else {
        newLines.push(line);
      }
    }
    
    const newContent = newLines.join('\n');
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed specific file: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Get all TypeScript/JSX files that are failing
const files = [
  'frontend/app/protected/admin/overrides/pricing/page.tsx',
  'frontend/app/protected/admin/permissions/page.tsx',
  'frontend/app/protected/admin/system/feature-flags/page.tsx',
  'frontend/app/protected/admin/system/health/page.tsx',
  'frontend/app/protected/admin/tenants/page.tsx'
];

console.log('Starting specific file fixes...');
files.forEach(fixSpecificFile);
console.log('Specific file fixes complete!');