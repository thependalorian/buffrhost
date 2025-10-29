const fs = require('fs');
const path = require('path');

// Function to fix JSX syntax errors in a file
function fixJSXSyntax(filePath) {
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

    // Fix missing closing braces before return statements
    // This is a more sophisticated approach to fix the JSX syntax errors
    const lines = content.split('\n');
    let newLines = [];
    let braceCount = 0;
    let inFunction = false;
    let functionStart = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if we're starting a function
      if (line.includes('const ') && line.includes(' = () => {') && !line.includes('return')) {
        inFunction = true;
        functionStart = i;
        braceCount = 1;
        newLines.push(line);
        continue;
      }
      
      // Check if we're starting a function with export default
      if (line.includes('export default function') && line.includes('(')) {
        inFunction = true;
        functionStart = i;
        braceCount = 1;
        newLines.push(line);
        continue;
      }
      
      if (inFunction) {
        // Count braces
        if (line.includes('{')) braceCount++;
        if (line.includes('}')) braceCount--;
        
        // Check if we hit a return statement without proper closing
        if (line.trim().startsWith('return (') && braceCount > 1) {
          // Add missing closing brace
          newLines.push('  };');
          newLines.push('');
          newLines.push(line);
        } else {
          newLines.push(line);
        }
        
        // Check if function is complete
        if (braceCount === 0) {
          inFunction = false;
          functionStart = -1;
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
      console.log(`Fixed JSX syntax in: ${filePath}`);
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

console.log('Starting comprehensive JSX syntax fixes...');
files.forEach(fixJSXSyntax);
console.log('JSX syntax fixes complete!');