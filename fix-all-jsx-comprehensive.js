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

    // Fix the main JSX syntax issues
    const lines = content.split('\n');
    let newLines = [];
    let inMainComponent = false;
    let inDuplicateComponent = false;
    let braceCount = 0;
    let mainComponentStart = -1;
    let duplicateComponentStart = -1;
    let functionsOutsideComponent = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if we're starting the main component
      if (line.includes('export default function') && line.includes('(')) {
        inMainComponent = true;
        mainComponentStart = i;
        braceCount = 1;
        newLines.push(line);
        continue;
      }
      
      // Check if we're starting a duplicate component
      if (line.includes('const ') && line.includes('Page = () => {') && inMainComponent) {
        inDuplicateComponent = true;
        duplicateComponentStart = i;
        // Don't add this line, we'll skip the duplicate component
        continue;
      }
      
      // Check for functions defined outside component
      if (!inMainComponent && !inDuplicateComponent && 
          (line.includes('const ') && line.includes(' = (') && line.includes('=>'))) {
        functionsOutsideComponent.push(line);
        continue;
      }
      
      if (inMainComponent && !inDuplicateComponent) {
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
        
        // Check if main component is complete
        if (braceCount === 0) {
          inMainComponent = false;
          mainComponentStart = -1;
        }
      } else if (inDuplicateComponent) {
        // Skip lines until we find the end of the duplicate component
        if (line.includes('{')) braceCount++;
        if (line.includes('}')) braceCount--;
        
        if (braceCount === 0) {
          inDuplicateComponent = false;
          duplicateComponentStart = -1;
          // Skip the export statement of the duplicate component
          continue;
        }
        // Skip all lines in the duplicate component
        continue;
      } else {
        newLines.push(line);
      }
    }
    
    // If we found functions outside component, move them inside
    if (functionsOutsideComponent.length > 0 && inMainComponent) {
      // Find the right place to insert them (after the component starts)
      let insertIndex = -1;
      for (let i = 0; i < newLines.length; i++) {
        if (newLines[i].includes('export default function') && newLines[i].includes('(')) {
          insertIndex = i + 1;
          break;
        }
      }
      
      if (insertIndex !== -1) {
        // Insert functions after component declaration
        newLines.splice(insertIndex, 0, '');
        functionsOutsideComponent.forEach(func => {
          newLines.splice(insertIndex + 1, 0, func);
        });
        modified = true;
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