const fs = require('fs');

// Function to fix all missing component exports
function fixAllMissingComponents(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove all non-existent component exports
    const nonExistentExports = [
      'BuffrImageCarousel as ImageCarousel,',
      'BuffrMenuSection as MenuSection,',
      'BuffrReview as Review,',
      'BuffrPropertyDashboard as PropertyDashboard,',
      'BuffrBookingCard as BookingCard,',
      'BuffrContentEditor as ContentEditor,',
      'BuffrRoomManagement as RoomManagement,',
      'BuffrMenuManagement as MenuManagement,',
      'BuffrServiceManagement as ServiceManagement,',
      'BuffrImageGallery as ImageGallery,',
      'BuffrAnalyticsDashboard as AnalyticsDashboard,',
      'BuffrBookingManagement as BookingManagement,',
      'BuffrPropertySettings as PropertySettings,',
      'BuffrImageCarousel,',
      'BuffrMenuSection,',
      'BuffrReview,',
      'BuffrPropertyDashboard,',
      'BuffrBookingCard,',
      'BuffrContentEditor,',
      'BuffrRoomManagement,',
      'BuffrMenuManagement,',
      'BuffrServiceManagement,',
      'BuffrImageGallery,',
      'BuffrAnalyticsDashboard,',
      'BuffrBookingManagement,',
      'BuffrPropertySettings,',
      'ImageCarousel: BuffrImageCarousel,',
      'MenuSection: BuffrMenuSection,',
      'Review: BuffrReview,',
      'PropertyDashboard: BuffrPropertyDashboard,',
      'BookingCard: BuffrBookingCard,',
      'ContentEditor: BuffrContentEditor,',
      'RoomManagement: BuffrRoomManagement,',
      'MenuManagement: BuffrMenuManagement,',
      'ServiceManagement: BuffrServiceManagement,',
      'ImageGallery: BuffrImageGallery,',
      'AnalyticsDashboard: BuffrAnalyticsDashboard,',
      'BookingManagement: BuffrBookingManagement,',
      'PropertySettings: BuffrPropertySettings,',
    ];

    // Remove each non-existent export
    nonExistentExports.forEach(exportLine => {
      if (content.includes(exportLine)) {
        content = content.replace(exportLine + '\n', '');
        content = content.replace(exportLine, '');
        modified = true;
      }
    });

    // Clean up any empty lines that might have been left
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed missing components in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix the daisyui-index.ts file
console.log('Starting comprehensive missing components fixes...');
fixAllMissingComponents('frontend/components/ui/daisyui-index.ts');
console.log('Missing components fixes complete!');