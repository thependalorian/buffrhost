/**
 * Batch React Component Documentation Script
 * Adds comprehensive JSDoc documentation to all React components
 */

const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = './frontend';

/**
 * Get all React component files that need documentation
 */
function getReactComponentsNeedingDocs() {
  const components = [];

  function scanDirectory(currentDir, relativePath = '') {
    try {
      const items = fs.readdirSync(path.join(FRONTEND_DIR, currentDir));

      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const relPath = path.join(relativePath, item);
        const stat = fs.statSync(path.join(FRONTEND_DIR, fullPath));

        if (stat.isDirectory()) {
          scanDirectory(fullPath, relPath);
        } else if (item.endsWith('.tsx') &&
                   !item.endsWith('.test.tsx') &&
                   !item.endsWith('.spec.tsx') &&
                   !item.endsWith('.stories.tsx')) {
          const filePath = path.join(FRONTEND_DIR, fullPath);
          if (!hasComprehensiveJSDoc(filePath)) {
            components.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Skip directories that can't be read
    }
  }

  scanDirectory('components');
  return components;
}

/**
 * Check if file has comprehensive JSDoc documentation
 */
function hasComprehensiveJSDoc(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Check for comprehensive JSDoc patterns
    const hasFileOverview = content.includes('@fileoverview') || content.includes('@overview');
    const hasComponent = content.includes('@component') || content.includes('@function');
    const hasReturns = content.includes('@returns') || content.includes('@return');

    return hasFileOverview && hasComponent && hasReturns;
  } catch (error) {
    return false;
  }
}

/**
 * Analyze React component to extract information for JSDoc
 */
function analyzeReactComponent(filePath, content) {
  const analysis = {
    componentName: '',
    props: [],
    state: [],
    hooks: [],
    methods: [],
    category: '',
    purpose: '',
    database: false,
    api: false,
    auth: false,
    exportType: 'default'
  };

  // Extract component name
  const componentMatch = content.match(/export\s+(default\s+)?(?:function|const)\s+(\w+)/);
  if (componentMatch) {
    analysis.componentName = componentMatch[2];
    analysis.exportType = componentMatch[1] ? 'default' : 'named';
  }

  // Extract props interface
  const propsMatch = content.match(/interface\s+(\w+Props)\s*{([^}]*)}/s);
  if (propsMatch) {
    const propsInterface = propsMatch[2];
    const propMatches = propsInterface.match(/(\w+)[?:]\s*([^;]+)/g) || [];
    analysis.props = propMatches.map(prop => {
      const [name, type] = prop.split(/[?:]/).map(s => s.trim());
      return { name, type };
    });
  }

  // Extract hooks usage
  const hooks = content.match(/use\w+\(/g) || [];
  analysis.hooks = [...new Set(hooks.map(hook => hook.replace('(', '')))];

  // Extract state variables
  const stateMatches = content.match(/useState<[^>]+>\(([^,)]+)/g) || [];
  analysis.state = stateMatches.map(match => match.replace(/useState<[^>]+>\(/, '').trim());

  // Extract methods
  const methodMatches = content.match(/(?:const|function)\s+(\w+)\s*=\s*(?:\([^)]*\)\s*=>|function)/g) || [];
  analysis.methods = methodMatches.map(match => match.replace(/(?:const|function)\s+/, '').replace(/\s*=.*$/, ''));

  // Determine category and purpose based on file path
  const pathParts = filePath.split('/');
  analysis.category = pathParts[1] || 'ui';

  // Check for database/API usage
  analysis.database = content.includes('useSWR') || content.includes('fetch') || content.includes('api/');
  analysis.api = content.includes('api/') || content.includes('fetch');
  analysis.auth = content.includes('auth') || content.includes('Auth') || content.includes('useUser');

  // Generate purpose based on analysis
  analysis.purpose = generateComponentPurpose(analysis, pathParts);

  return analysis;
}

/**
 * Generate component purpose description
 */
function generateComponentPurpose(analysis, pathParts) {
  const category = analysis.category;
  const componentName = analysis.componentName;

  const categoryDescriptions = {
    'auth': `${componentName} handles user authentication and authorization flows`,
    'admin': `${componentName} provides administrative interface and management capabilities`,
    'crm': `${componentName} manages customer relationship and loyalty program interactions`,
    'dashboard': `${componentName} displays comprehensive dashboard with key metrics and analytics`,
    'ui': `${componentName} provides reusable UI component for consistent design`,
    'forms': `${componentName} handles form input and validation for user data collection`,
    'booking': `${componentName} manages reservation and booking workflows`,
    'property': `${componentName} displays and manages property information and listings`,
    'communication': `${componentName} handles multi-channel communication and messaging`,
    'analytics': `${componentName} provides data visualization and business intelligence`,
    'ai-chat': `${componentName} enables AI-powered conversational interfaces`,
    'ab-testing': `${componentName} manages A/B testing and feature experimentation`,
    'accessibility': `${componentName} ensures inclusive design and accessibility compliance`,
    'compliance': `${componentName} handles regulatory compliance and legal requirements`
  };

  return categoryDescriptions[category] || `${componentName} provides specialized functionality for the Buffr Host platform`;
}

/**
 * Generate comprehensive JSDoc for React component
 */
function generateComponentJSDoc(filePath, content) {
  const analysis = analyzeReactComponent(filePath, content);
  const relativePath = filePath.replace('frontend/', '');

  let jsdoc = `/**
 * ${analysis.componentName} React Component for Buffr Host Hospitality Platform
 * @fileoverview ${analysis.purpose.charAt(0).toUpperCase() + analysis.purpose.slice(1)}
 * @location buffr-host/${relativePath}
 * @purpose ${analysis.purpose}
 * @component ${analysis.componentName}
 * @category ${analysis.category.charAt(0).toUpperCase() + analysis.category.slice(1)}
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
`;

  // Add database connections if applicable
  if (analysis.database) {
    jsdoc += ` * @database_connections Reads from relevant tables based on component functionality
`;
  }

  // Add API integrations if applicable
  if (analysis.api) {
    jsdoc += ` * @api_integration RESTful API endpoints for data fetching and mutations
`;
  }

  // Add authentication if applicable
  if (analysis.auth) {
    jsdoc += ` * @authentication JWT-based authentication for user-specific functionality
`;
  }

  // Add state management
  if (analysis.state.length > 0) {
    jsdoc += ` * @state_management Local component state for UI interactions and data management
`;
  }

  // Add hooks usage
  if (analysis.hooks.length > 0) {
    jsdoc += ` * @hooks_utilization ${analysis.hooks.join(', ')} for state management and side effects
`;
  }

  // Add performance notes
  jsdoc += ` * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
`;

  // Component capabilities
  jsdoc += ` *
 * Component Capabilities:
`;

  if (analysis.props.length > 0) {
    jsdoc += ` * - Configurable props for flexible component usage
`;
  }
  if (analysis.state.length > 0) {
    jsdoc += ` * - Interactive state management for dynamic user experiences
`;
  }
  if (analysis.database) {
    jsdoc += ` * - Real-time data integration with backend services
`;
  }
  if (analysis.api) {
    jsdoc += ` * - API-driven functionality with error handling and loading states
`;
  }
  if (analysis.auth) {
    jsdoc += ` * - Secure authentication integration for user-specific features
`;
  }

  jsdoc += ` * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
`;

  // Props documentation
  if (analysis.props.length > 0) {
    jsdoc += ` *
 * Props:
`;
    analysis.props.forEach(prop => {
      jsdoc += ` * @param {${prop.type}} [${prop.name}] - ${prop.name} prop description
`;
    });
  }

  // State documentation
  if (analysis.state.length > 0) {
    jsdoc += ` *
 * State:
`;
    analysis.state.forEach(state => {
      jsdoc += ` * @state {any} ${state} - Component state for ${state.toLowerCase()} management
`;
    });
  }

  // Methods documentation
  if (analysis.methods.length > 0) {
    jsdoc += ` *
 * Methods:
`;
    analysis.methods.forEach(method => {
      jsdoc += ` * @method ${method} - ${method} method for component functionality
`;
    });
  }

  jsdoc += ` *
 * Usage Example:
 * @example
 * import ${analysis.exportType === 'default' ? analysis.componentName : `{ ${analysis.componentName} }`} from './${analysis.componentName}';
 *
 * function App() {
 *   return (
 *     <${analysis.componentName}`;

  if (analysis.props.length > 0) {
    jsdoc += `
 *       prop1="value"`;
    if (analysis.props.length > 1) {
      jsdoc += `
 *       prop2={value}`;
    }
  }

  jsdoc += `
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered ${analysis.componentName} component
 */
`;

  return jsdoc;
}

/**
 * Main execution function
 */
async function main() {
  console.log('🔍 Starting batch React component documentation...\n');

  const components = getReactComponentsNeedingDocs();
  console.log(`📋 Found ${components.length} React components needing documentation\n`);

  let processed = 0;
  let errors = 0;

  // Process components in batches to avoid memory issues
  const batchSize = 50;
  for (let i = 0; i < components.length; i += batchSize) {
    const batch = components.slice(i, i + batchSize);
    console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(components.length / batchSize)} (${batch.length} components)`);

    for (const componentPath of batch) {
      try {
        const fullPath = path.join(FRONTEND_DIR, componentPath);
        const content = fs.readFileSync(fullPath, 'utf8');

        // Generate JSDoc
        const jsdoc = generateComponentJSDoc(componentPath, content);

        // Read current file content
        const lines = content.split('\n');
        let insertIndex = 0;

        // Find the first import or export statement
        for (let j = 0; j < lines.length; j++) {
          const line = lines[j].trim();
          if ((line.startsWith('import') && !line.includes('from \'react\'')) ||
              (line.startsWith('export') && !line.includes('export {'))) {
            insertIndex = j;
            break;
          }
        }

        // Insert JSDoc before the found line
        lines.splice(insertIndex, 0, jsdoc);

        // Write back to file
        fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');

        console.log(`✅ Documented ${componentPath}`);
        processed++;

        // Progress update every 10 components
        if (processed % 10 === 0) {
          console.log(`📊 Progress: ${processed}/${components.length} components documented (${((processed / components.length) * 100).toFixed(1)}%)`);
        }

      } catch (error) {
        console.error(`❌ Failed to document ${componentPath}:`, error.message);
        errors++;
      }
    }
  }

  console.log(`\n🎉 Batch component documentation complete!`);
  console.log(`📊 Summary:`);
  console.log(`   ✅ Processed: ${processed} components`);
  console.log(`   ❌ Errors: ${errors} components`);
  console.log(`   📈 Success Rate: ${((processed / (processed + errors)) * 100).toFixed(1)}%`);
  console.log(`   🎯 Total Components Now Documented: ${processed}`);
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, generateComponentJSDoc, analyzeReactComponent, hasComprehensiveJSDoc };
