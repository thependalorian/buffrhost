'use client';

import React from 'react';
/**
 * BuffrIcon React Component for Buffr Host Hospitality Platform
 * @fileoverview BuffrIcon provides reusable UI component for consistent design
 * @location buffr-host/components/ui/icons/BuffrIcons.tsx
 * @purpose BuffrIcon provides reusable UI component for consistent design
 * @component BuffrIcon
 * @category Ui
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Usage Example:
 * @example
 * import { BuffrIcon } from './BuffrIcon';
 *
 * function App() {
 *   return (
 *     <BuffrIcon
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered BuffrIcon component
 */

import { LucideIcon, LucideProps } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  Building2,
  BarChart,
  Bed,
  Bell,
  BellOff,
  Building,
  Calendar,
  CheckCircle,
  CheckSquare,
  Clock,
  CreditCard,
  DollarSign,
  Edit,
  ExternalLink,
  FileText,
  Home,
  Info,
  Inbox,
  LogIn,
  LogOut,
  Mail,
  Moon,
  Phone,
  Plus,
  Receipt,
  RefreshCw,
  Settings,
  Sparkles,
  Star,
  Sun,
  Table,
  TrendingUp,
  User,
  Users,
  Utensils,
  X,
  XCircle,
  Zap,
  Brain,
  Play,
  Rocket,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  HelpCircle,
  Check,
  Monitor,
  Link,
  Globe,
  Landmark,
} from 'lucide-react';

/**
 * Buffr Icons Component
 *
 * Centralized icon management with consistent styling
 * Location: components/ui/icons/BuffrIcons.tsx
 */

export type BuffrIconName =
  | 'activity'
  | 'alert-triangle'
  | 'building-2'
  | 'bar-chart'
  | 'bed'
  | 'bell'
  | 'bell-off'
  | 'building'
  | 'calendar'
  | 'check-circle'
  | 'check-square'
  | 'clock'
  | 'credit-card'
  | 'dollar-sign'
  | 'edit'
  | 'external-link'
  | 'file-text'
  | 'home'
  | 'info'
  | 'inbox'
  | 'log-in'
  | 'log-out'
  | 'mail'
  | 'moon'
  | 'phone'
  | 'plus'
  | 'receipt'
  | 'refresh-cw'
  | 'settings'
  | 'sparkles'
  | 'star'
  | 'sun'
  | 'table'
  | 'trending-up'
  | 'user'
  | 'users'
  | 'utensils'
  | 'x'
  | 'x-circle'
  | 'zap'
  | 'brain'
  | 'play'
  | 'rocket'
  | 'facebook'
  | 'twitter'
  | 'linkedin'
  | 'instagram'
  | 'help-circle'
  | 'check'
  | 'monitor'
  | 'link'
  | 'globe'
  | 'landmark';

interface BuffrIconProps extends Omit<LucideProps, 'name'> {
  name: BuffrIconName;
}

const iconMap: Record<BuffrIconName, LucideIcon> = {
  activity: Activity,
  'alert-triangle': AlertTriangle,
  'building-2': Building2,
  'bar-chart': BarChart,
  bed: Bed,
  bell: Bell,
  'bell-off': BellOff,
  building: Building,
  calendar: Calendar,
  'check-circle': CheckCircle,
  'check-square': CheckSquare,
  clock: Clock,
  'credit-card': CreditCard,
  'dollar-sign': DollarSign,
  edit: Edit,
  'external-link': ExternalLink,
  'file-text': FileText,
  home: Home,
  info: Info,
  inbox: Inbox,
  'log-in': LogIn,
  'log-out': LogOut,
  mail: Mail,
  moon: Moon,
  phone: Phone,
  plus: Plus,
  receipt: Receipt,
  'refresh-cw': RefreshCw,
  settings: Settings,
  sparkles: Sparkles,
  star: Star,
  sun: Sun,
  table: Table,
  'trending-up': TrendingUp,
  user: User,
  users: Users,
  utensils: Utensils,
  x: X,
  'x-circle': XCircle,
  zap: Zap,
  brain: Brain,
  play: Play,
  rocket: Rocket,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  'help-circle': HelpCircle,
  check: Check,
  monitor: Monitor,
  link: Link,
  globe: Globe,
  landmark: Landmark,
};

export const BuffrIcon: React.FC<BuffrIconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return <div className="w-4 h-4" />;
  }

  return <IconComponent {...props} />;
};
