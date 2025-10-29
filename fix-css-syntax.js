const fs = require('fs');

// Function to fix CSS syntax errors
function fixCSSSyntax(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix hover:transform syntax errors
    if (content.includes('hover:transform:')) {
      content = content.replace(/hover:transform:\s*([^;]+);/g, '&:hover { transform: $1; }');
      modified = true;
    }

    // Fix undefined CSS classes by replacing with valid Tailwind classes
    const classReplacements = {
      'from-primary-action': 'from-blue-600',
      'to-primary-hover': 'to-blue-700',
      'hover:from-primary-hover': 'hover:from-blue-700',
      'hover:to-primary-action': 'hover:to-blue-600',
      'text-primary-action': 'text-blue-600',
      'border-primary-action': 'border-blue-600',
      'bg-primary-action': 'bg-blue-600',
      'hover:bg-primary-hover': 'hover:bg-blue-700',
      'shadow-primary-action': 'shadow-blue-600',
      'ring-primary-action': 'ring-blue-600',
      'focus:ring-primary-action': 'focus:ring-blue-600',
      'focus:border-primary-action': 'focus:border-blue-600',
      'from-primary-hover': 'from-blue-700',
      'to-primary-action': 'to-blue-600',
      'bg-primary-hover': 'bg-blue-700',
      'text-primary-hover': 'text-blue-700',
      'border-primary-hover': 'border-blue-700',
      'hover:text-primary-action': 'hover:text-blue-600',
      'hover:border-primary-action': 'hover:border-blue-600',
      'hover:shadow-primary-action': 'hover:shadow-blue-600',
      'hover:ring-primary-action': 'hover:ring-blue-600',
      'active:bg-primary-action': 'active:bg-blue-600',
      'active:text-white': 'active:text-white',
      'active:shadow-primary-action': 'active:shadow-blue-600',
      'active:ring-primary-action': 'active:ring-blue-600',
      'active:border-primary-action': 'active:border-blue-600',
      'disabled:bg-primary-action': 'disabled:bg-blue-600',
      'disabled:text-white': 'disabled:text-white',
      'disabled:opacity-50': 'disabled:opacity-50',
      'disabled:cursor-not-allowed': 'disabled:cursor-not-allowed',
      'disabled:shadow-none': 'disabled:shadow-none',
      'disabled:ring-0': 'disabled:ring-0',
      'disabled:border-primary-action': 'disabled:border-blue-600',
      'disabled:hover:bg-primary-hover': 'disabled:hover:bg-blue-700',
      'disabled:hover:text-white': 'disabled:hover:text-white',
      'disabled:hover:shadow-none': 'disabled:hover:shadow-none',
      'disabled:hover:ring-0': 'disabled:hover:ring-0',
      'disabled:hover:border-primary-action': 'disabled:hover:border-blue-600',
      'disabled:active:bg-primary-action': 'disabled:active:bg-blue-600',
      'disabled:active:text-white': 'disabled:active:text-white',
      'disabled:active:shadow-none': 'disabled:active:shadow-none',
      'disabled:active:ring-0': 'disabled:active:ring-0',
      'disabled:active:border-primary-action': 'disabled:active:border-blue-600',
      // Secondary action classes
      'bg-secondary-action': 'bg-gray-600',
      'text-secondary-action': 'text-gray-600',
      'border-secondary-action': 'border-gray-600',
      'hover:bg-secondary-hover': 'hover:bg-gray-700',
      'hover:text-secondary-hover': 'hover:text-gray-700',
      'hover:border-secondary-hover': 'hover:border-gray-700',
      'hover:shadow-secondary-action': 'hover:shadow-gray-600',
      'hover:ring-secondary-action': 'hover:ring-gray-600',
      'active:bg-secondary-action': 'active:bg-gray-600',
      'active:shadow-secondary-action': 'active:shadow-gray-600',
      'active:ring-secondary-action': 'active:ring-gray-600',
      'active:border-secondary-action': 'active:border-gray-600',
      'focus:ring-secondary-action': 'focus:ring-gray-600',
      'focus:border-secondary-action': 'focus:border-gray-600',
      'disabled:bg-secondary-action': 'disabled:bg-gray-600',
      'disabled:border-secondary-action': 'disabled:border-gray-600',
      'disabled:hover:bg-secondary-hover': 'disabled:hover:bg-gray-700',
      'disabled:hover:border-secondary-action': 'disabled:hover:border-gray-600',
      'disabled:active:bg-secondary-action': 'disabled:active:bg-gray-600',
      'disabled:active:border-secondary-action': 'disabled:active:border-gray-600',
      // Tertiary action classes
      'bg-tertiary-action': 'bg-green-600',
      'text-tertiary-action': 'text-green-600',
      'border-tertiary-action': 'border-green-600',
      'hover:bg-tertiary-hover': 'hover:bg-green-700',
      'hover:text-tertiary-hover': 'hover:text-green-700',
      'hover:border-tertiary-hover': 'hover:border-green-700',
      'hover:shadow-tertiary-action': 'hover:shadow-green-600',
      'hover:ring-tertiary-action': 'hover:ring-green-600',
      'active:bg-tertiary-action': 'active:bg-green-600',
      'active:shadow-tertiary-action': 'active:shadow-green-600',
      'active:ring-tertiary-action': 'active:ring-green-600',
      'active:border-tertiary-action': 'active:border-green-600',
      'focus:ring-tertiary-action': 'focus:ring-green-600',
      'focus:border-tertiary-action': 'focus:border-green-600',
      'disabled:bg-tertiary-action': 'disabled:bg-green-600',
      'disabled:border-tertiary-action': 'disabled:border-green-600',
      'disabled:hover:bg-tertiary-hover': 'disabled:hover:bg-green-700',
      'disabled:hover:border-tertiary-action': 'disabled:hover:border-green-600',
      'disabled:active:bg-tertiary-action': 'disabled:active:bg-green-600',
      'disabled:active:border-tertiary-action': 'disabled:active:border-green-600'
    };

    // Apply class replacements
    for (const [oldClass, newClass] of Object.entries(classReplacements)) {
      if (content.includes(oldClass)) {
        content = content.replace(new RegExp(oldClass, 'g'), newClass);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed CSS syntax in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix the globals.css file
console.log('Starting CSS syntax fixes...');
fixCSSSyntax('frontend/app/globals.css');
console.log('CSS syntax fixes complete!');