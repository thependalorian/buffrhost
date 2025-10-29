const fs = require('fs');
const path = require('path');

// Function to fix Card to BuffrCard in a file
function fixCardComponents(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

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

    // Fix other common component issues
    if (content.includes('<Button') || content.includes('</Button>')) {
      content = content.replace(/<Button/g, '<BuffrButton');
      content = content.replace(/<\/Button>/g, '</BuffrButton>');
      modified = true;
    }

    if (content.includes('<TabsList') || content.includes('</TabsList>')) {
      content = content.replace(/<TabsList/g, '<BuffrTabsList');
      content = content.replace(/<\/TabsList>/g, '</BuffrTabsList>');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed Card components in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Get all BI pages that need fixing
const biPages = [
  'frontend/app/protected/bi/ab-testing/page.tsx',
  'frontend/app/protected/bi/advanced-analytics/page.tsx',
  'frontend/app/protected/bi/business-intelligence/page.tsx',
  'frontend/app/protected/bi/churn-prediction/page.tsx',
  'frontend/app/protected/bi/customer-segmentation/page.tsx',
  'frontend/app/protected/bi/data-quality/page.tsx',
  'frontend/app/protected/bi/data-visualization/page.tsx',
  'frontend/app/protected/bi/financial-education/page.tsx',
  'frontend/app/protected/bi/fraud-detection/page.tsx',
  'frontend/app/protected/bi/gamification/page.tsx',
  'frontend/app/protected/bi/mlops/page.tsx',
  'frontend/app/protected/bi/model-monitoring/page.tsx',
  'frontend/app/protected/bi/predictive-analytics/page.tsx',
  'frontend/app/protected/bi/realtime-analytics/page.tsx',
  'frontend/app/protected/bi/recommendations/page.tsx',
  'frontend/app/protected/bi/spending-analysis/page.tsx'
];

// Also fix other pages with Card issues
const otherPages = [
  'frontend/app/protected/cms/page.tsx',
  'frontend/app/protected/customers/page.tsx',
  'frontend/app/test-buffr-ids/page.tsx'
];

console.log('Starting comprehensive Card component fixes...');
[...biPages, ...otherPages].forEach(fixCardComponents);
console.log('Card component fixes complete!');