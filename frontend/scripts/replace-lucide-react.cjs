#!/usr/bin/env node

/**
 * Script to replace Lucid React icons with DaisyUI icons
 * This script will:
 * 1. Find all files that import from 'lucide-react'
 * 2. Replace the imports with DaisyUI icon imports
 * 3. Replace icon usage with DaisyIcon components
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Icon mapping from Lucid React to DaisyUI
const iconMapping = {
  // Navigation & UI
  Menu: 'menu',
  Home: 'home',
  Search: 'search',
  Filter: 'filter',
  Settings: 'settings',
  User: 'user',
  Users: 'users',
  Bell: 'bell',
  Mail: 'mail',
  Phone: 'phone',
  Calendar: 'calendar',
  Clock: 'clock',
  MapPin: 'map-pin',
  Navigation: 'navigation',
  Globe: 'globe',
  ExternalLink: 'external-link',
  Link: 'link',
  ChevronUp: 'chevron-up',
  ChevronDown: 'chevron-down',
  ChevronLeft: 'chevron-left',
  ChevronRight: 'chevron-right',
  ArrowUp: 'arrow-up',
  ArrowDown: 'arrow-down',
  ArrowLeft: 'arrow-left',
  ArrowRight: 'arrow-right',
  ArrowUpRight: 'arrow-up-right',
  ArrowDownRight: 'arrow-down-right',
  ArrowDownLeft: 'arrow-down-left',
  ArrowUpLeft: 'arrow-up-left',

  // Actions & Controls
  Plus: 'plus',
  Minus: 'minus',
  X: 'x',
  Check: 'check',
  Edit: 'edit',
  Trash: 'trash',
  Copy: 'copy',
  Download: 'download',
  Upload: 'upload',
  Save: 'save',
  Refresh: 'refresh',
  Rotate: 'rotate',
  Play: 'play',
  Pause: 'pause',
  Stop: 'stop',
  SkipForward: 'skip-forward',
  SkipBack: 'skip-back',
  Volume: 'volume',
  VolumeX: 'volume-x',
  Eye: 'eye',
  EyeOff: 'eye-off',
  Lock: 'lock',
  Unlock: 'unlock',
  Shield: 'shield',
  ShieldCheck: 'shield-check',
  AlertTriangle: 'alert-triangle',
  AlertCircle: 'alert-circle',
  Info: 'info',
  HelpCircle: 'help-circle',
  QuestionMark: 'question-mark',
  CheckCircle: 'check-circle',
  XCircle: 'x-circle',
  MinusCircle: 'minus-circle',
  PlusCircle: 'plus-circle',

  // Business & Commerce
  DollarSign: 'dollar-sign',
  CreditCard: 'credit-card',
  Wallet: 'wallet',
  ShoppingCart: 'shopping-cart',
  ShoppingBag: 'shopping-bag',
  Package: 'package',
  Truck: 'truck',
  Store: 'store',
  Building: 'building',
  Briefcase: 'briefcase',
  ChartBar: 'chart-bar',
  ChartLine: 'chart-line',
  ChartPie: 'chart-pie',
  TrendingUp: 'trending-up',
  TrendingDown: 'trending-down',
  Percent: 'percent',
  Calculator: 'calculator',
  Receipt: 'receipt',
  FileText: 'file-text',
  File: 'file',
  Folder: 'folder',
  FolderOpen: 'folder-open',

  // Hospitality & Travel
  Bed: 'bed',
  Home: 'home',
  Building2: 'building-2',
  Map: 'map',
  Car: 'car',
  Plane: 'plane',
  Train: 'train',
  Bus: 'bus',
  Bike: 'bike',
  Walking: 'walking',
  Camera: 'camera',
  Image: 'image',
  Images: 'images',
  Video: 'video',
  Music: 'music',
  Headphones: 'headphones',
  Tv: 'tv',
  Monitor: 'monitor',
  Laptop: 'laptop',
  Smartphone: 'smartphone',
  Wifi: 'wifi',
  Bluetooth: 'bluetooth',
  Battery: 'battery',
  BatteryCharging: 'battery-charging',
  Power: 'power',
  Zap: 'zap',
  Sun: 'sun',
  Moon: 'moon',
  Cloud: 'cloud',
  CloudRain: 'cloud-rain',

  // Food & Dining
  Utensils: 'utensils',
  Coffee: 'coffee',
  Wine: 'wine',
  Beer: 'beer',
  Cake: 'cake',
  Pizza: 'pizza',
  Hamburger: 'hamburger',
  IceCream: 'ice-cream',
  Apple: 'apple',
  Banana: 'banana',
  Cherry: 'cherry',
  Grapes: 'grapes',
  Lemon: 'lemon',
  Orange: 'orange',
  Peach: 'peach',
  Pear: 'pear',
  Strawberry: 'strawberry',
  Watermelon: 'watermelon',

  // Social & Communication
  Heart: 'heart',
  HeartFilled: 'heart-filled',
  ThumbsUp: 'thumbs-up',
  ThumbsDown: 'thumbs-down',
  Star: 'star',
  StarFilled: 'star-filled',
  Share: 'share',
  Share2: 'share-2',
  MessageCircle: 'message-circle',
  MessageSquare: 'message-square',
  Chat: 'chat',
  Comments: 'comments',
  Send: 'send',
  Reply: 'reply',
  Forward: 'forward',
  Facebook: 'facebook',
  Twitter: 'twitter',
  Instagram: 'instagram',
  Linkedin: 'linkedin',
  Youtube: 'youtube',
  Github: 'github',
  Gitlab: 'gitlab',
  Discord: 'discord',
  Slack: 'slack',

  // System & Status
  Cpu: 'cpu',
  HardDrive: 'hard-drive',
  Database: 'database',
  Server: 'server',
  Cloud: 'cloud',
  CloudUpload: 'cloud-upload',
  CloudDownload: 'cloud-download',
  Sync: 'sync',
  Wifi: 'wifi',
  WifiOff: 'wifi-off',
  Signal: 'signal',
  SignalZero: 'signal-zero',
  SignalOne: 'signal-one',
  SignalTwo: 'signal-two',
  SignalThree: 'signal-three',
  Battery: 'battery',
  BatteryLow: 'battery-low',
  BatteryMedium: 'battery-medium',
  BatteryHigh: 'battery-high',
  BatteryFull: 'battery-full',

  // Weather & Nature
  Sun: 'sun',
  Moon: 'moon',
  Cloud: 'cloud',
  CloudRain: 'cloud-rain',
  CloudSnow: 'cloud-snow',
  CloudLightning: 'cloud-lightning',
  CloudSun: 'cloud-sun',
  CloudMoon: 'cloud-moon',
  Wind: 'wind',
  Droplet: 'droplet',
  Snowflake: 'snowflake',
  Thermometer: 'thermometer',
  Umbrella: 'umbrella',
  Tree: 'tree',
  Flower: 'flower',
  Leaf: 'leaf',
  Mountain: 'mountain',

  // Animals & Pets
  Cat: 'cat',
  Dog: 'dog',
  Fish: 'fish',
  Bird: 'bird',
  Bug: 'bug',
  Spider: 'spider',
  Butterfly: 'butterfly',
  Bee: 'bee',
  Snail: 'snail',
  Frog: 'frog',

  // Sports & Activities
  Football: 'football',
  Basketball: 'basketball',
  Soccer: 'soccer',
  Tennis: 'tennis',
  Golf: 'golf',
  Swimming: 'swimming',
  Running: 'running',
  Cycling: 'cycling',
  Skiing: 'skiing',
  Snowboarding: 'snowboarding',
  Dumbbell: 'dumbbell',
  Trophy: 'trophy',
  Medal: 'medal',
  Award: 'award',
  Target: 'target',
  Dart: 'dart',
  Bowling: 'bowling',
  Pool: 'pool',
  Chess: 'chess',
  Puzzle: 'puzzle',

  // Education & Learning
  Book: 'book',
  BookOpen: 'book-open',
  GraduationCap: 'graduation-cap',
  Pencil: 'pencil',
  Pen: 'pen',
  Highlighter: 'highlighter',
  Marker: 'marker',
  Ruler: 'ruler',
  Compass: 'compass',
  Microscope: 'microscope',
  Telescope: 'telescope',
  Flask: 'flask',
  Atom: 'atom',
  Calculator: 'calculator',
  Abacus: 'abacus',
  Puzzle: 'puzzle',
  Brain: 'brain',
  Lightbulb: 'lightbulb',

  // Entertainment & Media
  Play: 'play',
  Pause: 'pause',
  Stop: 'stop',
  SkipForward: 'skip-forward',
  SkipBack: 'skip-back',
  Rewind: 'rewind',
  FastForward: 'fast-forward',
  Volume: 'volume',
  VolumeX: 'volume-x',
  Music: 'music',
  Headphones: 'headphones',
  Speaker: 'speaker',
  Mic: 'mic',
  MicOff: 'mic-off',
  Camera: 'camera',
  Video: 'video',
  Film: 'film',
  Tv: 'tv',
  Radio: 'radio',
  Gamepad: 'gamepad',
  Joystick: 'joystick',
  Dice: 'dice',
  Cards: 'cards',
  Puzzle: 'puzzle',
  MagicWand: 'magic-wand',
  Crown: 'crown',
  Gem: 'gem',
  Diamond: 'diamond',

  // Technology & Development
  Code: 'code',
  Terminal: 'terminal',
  Command: 'command',
  Keyboard: 'keyboard',
  Mouse: 'mouse',
  Monitor: 'monitor',
  Laptop: 'laptop',
  Smartphone: 'smartphone',
  Tablet: 'tablet',
  Cpu: 'cpu',
  Memory: 'memory',
  HardDrive: 'hard-drive',
  Ssd: 'ssd',
  Usb: 'usb',
  Ethernet: 'ethernet',
  Wifi: 'wifi',
  Bluetooth: 'bluetooth',
  Nfc: 'nfc',
  QrCode: 'qr-code',
  Barcode: 'barcode',
  Fingerprint: 'fingerprint',
  FaceId: 'face-id',
  TouchId: 'touch-id',
  Shield: 'shield',
  Lock: 'lock',
  Key: 'key',
  Unlock: 'unlock',
  Eye: 'eye',
  EyeOff: 'eye-off',

  // Health & Medical
  Heart: 'heart',
  HeartPulse: 'heart-pulse',
  Activity: 'activity',
  Thermometer: 'thermometer',
  Stethoscope: 'stethoscope',
  Pill: 'pill',
  Syringe: 'syringe',
  Bandage: 'bandage',
  Cross: 'cross',
  Plus: 'plus',
  Minus: 'minus',
  X: 'x',
  Check: 'check',
  AlertTriangle: 'alert-triangle',
  AlertCircle: 'alert-circle',
  Info: 'info',
  HelpCircle: 'help-circle',

  // Tools & Utilities
  Wrench: 'wrench',
  Screwdriver: 'screwdriver',
  Hammer: 'hammer',
  Saw: 'saw',
  Drill: 'drill',
  Screw: 'screw',
  Nut: 'nut',
  Bolt: 'bolt',
  Gear: 'gear',
  Cog: 'cog',
  Tool: 'tool',
  Tools: 'tools',
  Box: 'box',
  Package: 'package',
  Archive: 'archive',
  Folder: 'folder',
  File: 'file',
  Clipboard: 'clipboard',
  Scissors: 'scissors',
  Cut: 'cut',

  // Transportation & Logistics
  Car: 'car',
  Truck: 'truck',
  Bus: 'bus',
  Train: 'train',
  Plane: 'plane',
  Helicopter: 'helicopter',
  Rocket: 'rocket',
  Ship: 'ship',
  Anchor: 'anchor',
  Compass: 'compass',
  Map: 'map',
  Navigation: 'navigation',
  Route: 'route',
  Road: 'road',
  Highway: 'highway',
  Bridge: 'bridge',
  Tunnel: 'tunnel',
  Parking: 'parking',
  GasStation: 'gas-station',

  // Time & Calendar
  Clock: 'clock',
  Watch: 'watch',
  Timer: 'timer',
  Stopwatch: 'stopwatch',
  Hourglass: 'hourglass',
  Calendar: 'calendar',
  CalendarDays: 'calendar-days',
  CalendarWeek: 'calendar-week',
  CalendarMonth: 'calendar-month',
  CalendarYear: 'calendar-year',
  Schedule: 'schedule',
  Event: 'event',
  Reminder: 'reminder',
  Alarm: 'alarm',
  Bell: 'bell',
  Notification: 'notification',

  // Security & Privacy
  Shield: 'shield',
  ShieldCheck: 'shield-check',
  ShieldAlert: 'shield-alert',
  ShieldX: 'shield-x',
  Lock: 'lock',
  Unlock: 'unlock',
  Key: 'key',
  Keyhole: 'keyhole',
  Fingerprint: 'fingerprint',
  FaceId: 'face-id',
  TouchId: 'touch-id',
  Eye: 'eye',
  EyeOff: 'eye-off',
  Visibility: 'visibility',
  VisibilityOff: 'visibility-off',
  Private: 'private',

  // Communication & Social
  Mail: 'mail',
  MailOpen: 'mail-open',
  MailCheck: 'mail-check',
  MailX: 'mail-x',
  Phone: 'phone',
  PhoneCall: 'phone-call',
  PhoneIncoming: 'phone-incoming',
  PhoneOutgoing: 'phone-outgoing',
  Message: 'message',
  MessageCircle: 'message-circle',
  MessageSquare: 'message-square',
  Chat: 'chat',
  Comments: 'comments',
  Forum: 'forum',
  Discussion: 'discussion',
  Conversation: 'conversation',
  Send: 'send',
  Reply: 'reply',
  Forward: 'forward',
  Share: 'share',
  Share2: 'share-2',
  Retweet: 'retweet',
  Quote: 'quote',
  Mention: 'mention',
  Hashtag: 'hashtag',

  // Status & Indicators
  Check: 'check',
  CheckCircle: 'check-circle',
  CheckSquare: 'check-square',
  X: 'x',
  XCircle: 'x-circle',
  XSquare: 'x-square',
  Minus: 'minus',
  MinusCircle: 'minus-circle',
  Plus: 'plus',
  PlusCircle: 'plus-circle',
  PlusSquare: 'plus-square',
  Question: 'question',
  QuestionCircle: 'question-circle',
  Exclamation: 'exclamation',
  ExclamationCircle: 'exclamation-circle',
  Info: 'info',
  InfoCircle: 'info-circle',
  Help: 'help',
  HelpCircle: 'help-circle',
  Alert: 'alert',
  AlertTriangle: 'alert-triangle',
  AlertCircle: 'alert-circle',
  Warning: 'warning',
  Error: 'error',
  Success: 'success',
  Pending: 'pending',
  Loading: 'loading',
  Spinner: 'spinner',
  Dots: 'dots',
  Pulse: 'pulse',
  Wave: 'wave',
  Ripple: 'ripple',

  // Shapes & Symbols
  Circle: 'circle',
  Square: 'square',
  Triangle: 'triangle',
  Diamond: 'diamond',
  Hexagon: 'hexagon',
  Octagon: 'octagon',
  Pentagon: 'pentagon',
  Star: 'star',
  Heart: 'heart',
  Spade: 'spade',
  Club: 'club',
  DiamondSuit: 'diamond-suit',
  Infinity: 'infinity',
  InfinitySymbol: 'infinity-symbol',
  Pi: 'pi',
  Sigma: 'sigma',
  Alpha: 'alpha',
  Beta: 'beta',
  Gamma: 'gamma',
  Delta: 'delta',
  Epsilon: 'epsilon',
  Zeta: 'zeta',
  Eta: 'eta',
  Theta: 'theta',
  Iota: 'iota',
  Kappa: 'kappa',
  Lambda: 'lambda',
  Mu: 'mu',
  Nu: 'nu',
  Xi: 'xi',
  Omicron: 'omicron',
  Rho: 'rho',
  Sigma: 'sigma',
  Tau: 'tau',
  Upsilon: 'upsilon',
  Phi: 'phi',
  Chi: 'chi',
  Psi: 'psi',
  Omega: 'omega',
};

// Function to find all files that import from 'lucide-react'
function findLucideReactFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (
        stat.isDirectory() &&
        !item.startsWith('.') &&
        item !== 'node_modules'
      ) {
        traverse(fullPath);
      } else if (
        stat.isFile() &&
        (item.endsWith('.tsx') ||
          item.endsWith('.ts') ||
          item.endsWith('.jsx') ||
          item.endsWith('.js'))
      ) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (
          content.includes("from 'lucide-react'") ||
          content.includes('from "lucide-react"')
        ) {
          files.push(fullPath);
        }
      }
    }
  }

  traverse(dir);
  return files;
}

// Function to replace Lucid React imports and usage
function replaceLucideReactInFile(filePath) {
  console.log(`Processing: ${filePath}`);

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace import statement
  const importRegex =
    /import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"];?/g;
  const importMatch = importRegex.exec(content);

  if (importMatch) {
    const importedIcons = importMatch[1]
      .split(',')
      .map((icon) => icon.trim())
      .filter((icon) => icon.length > 0);

    // Replace the import with DaisyIcon import
    content = content.replace(
      importRegex,
      "import { DaisyIcon } from '@/components/ui/daisy-icons';"
    );
    modified = true;

    // Replace icon usage
    for (const iconName of importedIcons) {
      const daisyIconName = iconMapping[iconName];
      if (daisyIconName) {
        // Replace <IconName with <DaisyIcon name="daisy-icon-name"
        const iconRegex = new RegExp(`<${iconName}\\b`, 'g');
        content = content.replace(
          iconRegex,
          `<DaisyIcon name="${daisyIconName}"`
        );
        modified = true;
      } else {
        console.warn(`Warning: No mapping found for icon: ${iconName}`);
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  } else {
    console.log(`⏭️  No changes needed: ${filePath}`);
  }
}

// Main execution
function main() {
  console.log('🚀 Starting Lucid React to DaisyUI icon replacement...\n');

  const frontendDir = path.join(__dirname, '..');
  const lucideFiles = findLucideReactFiles(frontendDir);

  console.log(`Found ${lucideFiles.length} files with Lucid React imports:\n`);
  lucideFiles.forEach((file) => console.log(`  - ${file}`));
  console.log('');

  // Process each file
  for (const file of lucideFiles) {
    try {
      replaceLucideReactInFile(file);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  console.log('\n🎉 Lucid React to DaisyUI replacement completed!');
  console.log('\nNext steps:');
  console.log('1. Run "npm run dev" to test the application');
  console.log('2. Check for any remaining Lucid React references');
  console.log('3. Remove lucide-react from package.json if no longer needed');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  iconMapping,
  replaceLucideReactInFile,
  findLucideReactFiles,
};
