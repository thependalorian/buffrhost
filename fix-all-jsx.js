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

    // Fix duplicate component functions
    if (content.includes('const AdminDashboardPage = () => {')) {
      // Find the duplicate component and remove it
      const lines = content.split('\n');
      let inDuplicate = false;
      let braceCount = 0;
      let startLine = -1;
      let endLine = -1;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('const AdminDashboardPage = () => {')) {
          inDuplicate = true;
          startLine = i;
          braceCount = 1;
        } else if (inDuplicate) {
          if (lines[i].includes('{')) braceCount++;
          if (lines[i].includes('}')) braceCount--;
          if (braceCount === 0) {
            endLine = i;
            break;
          }
        }
      }
      
      if (startLine !== -1 && endLine !== -1) {
        lines.splice(startLine, endLine - startLine + 1);
        content = lines.join('\n');
        modified = true;
      }
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
  'frontend/app/protected/admin/dashboard/page.tsx',
  'frontend/app/protected/admin/overrides/pricing/page.tsx',
  'frontend/app/protected/admin/permissions/page.tsx',
  'frontend/app/protected/admin/roles/page.tsx',
  'frontend/app/protected/admin/system/feature-flags/page.tsx'
];

console.log('Starting comprehensive JSX syntax fixes...');
files.forEach(fixJSXSyntax);
console.log('JSX syntax fixes complete!');