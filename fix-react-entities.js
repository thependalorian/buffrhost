const fs = require('fs');
const path = require('path');

// Function to fix React unescaped entities
function fixReactEntities(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix apostrophes in JSX content
    // This is a simple approach - replace straight apostrophes with &apos;
    const apostrophePattern = /([^&])'([^;])/g;
    if (apostrophePattern.test(content)) {
      content = content.replace(apostrophePattern, '$1&apos;$2');
      modified = true;
    }

    // Fix quotes in JSX content
    const quotePattern = /([^&])"([^;])/g;
    if (quotePattern.test(content)) {
      content = content.replace(quotePattern, '$1&quot;$2');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed React entities in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Function to recursively find and fix files
function fixFilesInDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      fixFilesInDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      fixReactEntities(filePath);
    }
  });
}

console.log('Starting React entities fixes...');
fixFilesInDirectory('frontend');
console.log('React entities fixes complete!');