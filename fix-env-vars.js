const fs = require('fs');

// Function to fix environment variable access
function fixEnvVars(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix process.env.BACKEND_URL to process.env['BACKEND_URL']
    if (content.includes('process.env.BACKEND_URL')) {
      content = content.replace(/process\.env\.BACKEND_URL/g, "process.env['BACKEND_URL']");
      modified = true;
    }

    // Fix process.env.API_KEY to process.env['API_KEY']
    if (content.includes('process.env.API_KEY')) {
      content = content.replace(/process\.env\.API_KEY/g, "process.env['API_KEY']");
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed environment variables in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix the availability route file
console.log('Starting environment variable fixes...');
fixEnvVars('frontend/app/api/secure/availability/route.ts');
console.log('Environment variable fixes complete!');