const fs = require('fs');
const path = require('path');

// Function to fix HTML entities in JSX
function fixHtmlEntities(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix common HTML entities that shouldn't be in JSX
    const replacements = [
      { from: /&quot;/g, to: '"' },
      { from: /&apos;/g, to: "'" },
      { from: /&lt;/g, to: '<' },
      { from: /&gt;/g, to: '>' },
      { from: /&amp;/g, to: '&' },
    ];

    replacements.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed HTML entities in: ${filePath}`);
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
      fixHtmlEntities(filePath);
    }
  });
}

console.log('Starting HTML entities fixes...');
fixFilesInDirectory('frontend');
console.log('HTML entities fixes complete!');