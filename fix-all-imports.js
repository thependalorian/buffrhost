const fs = require('fs');
const path = require('path');

// Function to fix imports in a file
function fixImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace individual imports with combined import from @/components/ui
    const importReplacements = [
      // Card, Button, Badge combinations
      {
        pattern: /import\s*{\s*Card,\s*CardContent,\s*CardHeader,\s*CardTitle\s*}\s*from\s*['"]@\/components\/ui\/card['"];\s*\nimport\s*{\s*Button\s*}\s*from\s*['"]@\/components\/ui\/button['"];\s*\nimport\s*{\s*Badge\s*}\s*from\s*['"]@\/components\/ui\/badge['"];/g,
        replacement: "import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';"
      },
      {
        pattern: /import\s*{\s*Card,\s*CardContent,\s*CardHeader,\s*CardTitle\s*}\s*from\s*['"]@\/components\/ui\/card['"];\s*\nimport\s*{\s*Button\s*}\s*from\s*['"]@\/components\/ui\/button['"];/g,
        replacement: "import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';"
      },
      {
        pattern: /import\s*{\s*Card,\s*CardContent\s*}\s*from\s*['"]@\/components\/ui\/card['"];\s*\nimport\s*{\s*Button\s*}\s*from\s*['"]@\/components\/ui\/button['"];/g,
        replacement: "import { Card, CardContent, Button } from '@/components/ui';"
      },
      {
        pattern: /import\s*{\s*Card\s*}\s*from\s*['"]@\/components\/ui\/card['"]/g,
        replacement: "import { Card } from '@/components/ui'"
      },
      {
        pattern: /import\s*{\s*Button\s*}\s*from\s*['"]@\/components\/ui\/button['"]/g,
        replacement: "import { Button } from '@/components/ui'"
      },
      {
        pattern: /import\s*{\s*Badge\s*}\s*from\s*['"]@\/components\/ui\/badge['"]/g,
        replacement: "import { Badge } from '@/components/ui'"
      },
      
      // Input, Select combinations
      {
        pattern: /import\s*{\s*Input\s*}\s*from\s*['"]@\/components\/ui\/input['"];\s*\nimport\s*{\s*Select,\s*SelectContent,\s*SelectItem,\s*SelectTrigger,\s*SelectValue\s*}\s*from\s*['"]@\/components\/ui\/select['"];/g,
        replacement: "import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';"
      },
      {
        pattern: /import\s*{\s*Input\s*}\s*from\s*['"]@\/components\/ui\/input['"]/g,
        replacement: "import { Input } from '@/components/ui'"
      },
      {
        pattern: /import\s*{\s*Select,\s*SelectContent,\s*SelectItem,\s*SelectTrigger,\s*SelectValue\s*}\s*from\s*['"]@\/components\/ui\/select['"]/g,
        replacement: "import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'"
      },
      
      // Tabs combinations
      {
        pattern: /import\s*{\s*Tabs,\s*TabsContent,\s*TabsList,\s*TabsTrigger\s*}\s*from\s*['"]@\/components\/ui\/tabs['"]/g,
        replacement: "import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'"
      },
      
      // Complex combinations with multiple imports
      {
        pattern: /import\s*{\s*Card,\s*CardContent,\s*CardHeader,\s*CardTitle\s*}\s*from\s*['"]@\/components\/ui\/card['"];\s*\nimport\s*{\s*Button\s*}\s*from\s*['"]@\/components\/ui\/button['"];\s*\nimport\s*{\s*Badge\s*}\s*from\s*['"]@\/components\/ui\/badge['"];\s*\nimport\s*{\s*Input\s*}\s*from\s*['"]@\/components\/ui\/input['"];\s*\nimport\s*{\s*Select,\s*SelectContent,\s*SelectItem,\s*SelectTrigger,\s*SelectValue\s*}\s*from\s*['"]@\/components\/ui\/select['"];/g,
        replacement: "import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';"
      },
      {
        pattern: /import\s*{\s*Card,\s*CardContent,\s*CardHeader,\s*CardTitle\s*}\s*from\s*['"]@\/components\/ui\/card['"];\s*\nimport\s*{\s*Button\s*}\s*from\s*['"]@\/components\/ui\/button['"];\s*\nimport\s*{\s*Badge\s*}\s*from\s*['"]@\/components\/ui\/badge['"];\s*\nimport\s*{\s*Input\s*}\s*from\s*['"]@\/components\/ui\/input['"];/g,
        replacement: "import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input } from '@/components/ui';"
      },
      {
        pattern: /import\s*{\s*Card,\s*CardContent,\s*CardHeader,\s*CardTitle\s*}\s*from\s*['"]@\/components\/ui\/card['"];\s*\nimport\s*{\s*Button\s*}\s*from\s*['"]@\/components\/ui\/button['"];\s*\nimport\s*{\s*Input\s*}\s*from\s*['"]@\/components\/ui\/input['"];\s*\nimport\s*{\s*Select,\s*SelectContent,\s*SelectItem,\s*SelectTrigger,\s*SelectValue\s*}\s*from\s*['"]@\/components\/ui\/select['"];/g,
        replacement: "import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';"
      }
    ];
    
    importReplacements.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed imports in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find and fix all component files
function fixAllImports(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixedCount += fixAllImports(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (fixImports(filePath)) {
        fixedCount++;
      }
    }
  });
  
  return fixedCount;
}

// Main execution
const componentsDir = path.join(__dirname, 'frontend', 'components');
console.log('Starting comprehensive import fixes...');
const fixedCount = fixAllImports(componentsDir);
console.log(`Fixed imports in ${fixedCount} files`);