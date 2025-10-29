const fs = require('fs');

// Function to fix missing component exports
function fixMissingExports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove non-existent component exports
    const nonExistentExports = [
      'BuffrSelect as Select,',
      'BuffrSelectTrigger as SelectTrigger,',
      'BuffrSelectValue as SelectValue,',
      'BuffrSelectContent as SelectContent,',
      'BuffrSelectItem as SelectItem,',
      'BuffrSwitch as Switch,',
      'BuffrTextarea as Textarea,',
      'BuffrActionButton as ActionButton,',
      'BuffrIconButton as IconButton,',
      'BuffrAnalyticsDashboard as AnalyticsDashboard,',
      'BuffrBookingCard as BookingCard,',
      'BuffrBookingManagement as BookingManagement,',
      'BuffrContentEditor as ContentEditor,',
      'BuffrImageCarousel as ImageCarousel,',
      'BuffrImageGallery as ImageGallery,',
      'BuffrMenuManagement as MenuManagement,',
      'BuffrMenuSection as MenuSection,',
      'BuffrPropertyDashboard as PropertyDashboard,',
      'BuffrPropertySettings as PropertySettings,',
      'BuffrReview as Review,',
      'BuffrRoomManagement as RoomManagement,',
      'BuffrServiceManagement as ServiceManagement,',
    ];

    // Remove each non-existent export
    nonExistentExports.forEach(exportLine => {
      if (content.includes(exportLine)) {
        content = content.replace(exportLine + '\n', '');
        modified = true;
      }
    });

    // Add missing BuffrSwitch export (we'll create a simple one)
    if (content.includes('BuffrSwitch')) {
      // Replace BuffrSwitch with BuffrToggle for now
      content = content.replace(/BuffrSwitch/g, 'BuffrToggle');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed missing exports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix the daisyui-index.ts file
console.log('Starting missing exports fixes...');
fixMissingExports('frontend/components/ui/daisyui-index.ts');
console.log('Missing exports fixes complete!');