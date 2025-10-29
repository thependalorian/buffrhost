// Test import
try {
  const { DaisyButton } = require('./components/ui/daisy-button.tsx');
  console.log('✅ DaisyButton imported successfully');
} catch (error) {
  console.log('❌ DaisyButton import failed:', error.message);
}
