/**
 * Buffr Icons Component - Modular Implementation
 *
 * Purpose: Centralized icon management with modular architecture
 * Functionality: Renders icons from different categories with consistent API
 * Location: /components/ui/icons/BuffrIconsModular.tsx
 *
 * Follows 40 Rules:
 * - Uses DaisyUI for consistent styling
 * - Modular component design for easy maintenance
 * - TypeScript for type safety
 * - Vercel-compatible with SSR
 * - Optimized for performance
 */

import * as React from 'react';
import NavigationIcon, { NavigationIconName } from './icons/NavigationIcons';
import ActionIcon, { ActionIconName } from './icons/ActionIcons';
import BusinessIcon, { BusinessIconName } from './icons/BusinessIcons';
import HospitalityIcon, { HospitalityIconName } from './icons/HospitalityIcons';

// Combined icon name type
export type BuffrIconName =
  | NavigationIconName
  | ActionIconName
  | BusinessIconName
  | HospitalityIconName;

export interface BuffrIconProps {
  name: BuffrIconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  color?: string;
}

// Icon category mapping
const ICON_CATEGORIES = {
  // Navigation icons
  menu: 'navigation',
  home: 'navigation',
  search: 'navigation',
  filter: 'navigation',
  settings: 'navigation',
  user: 'navigation',
  users: 'navigation',
  bell: 'navigation',
  mail: 'navigation',
  phone: 'navigation',
  calendar: 'navigation',
  clock: 'navigation',
  'map-pin': 'navigation',
  navigation: 'navigation',
  globe: 'navigation',
  'external-link': 'navigation',
  link: 'navigation',
  'chevron-up': 'navigation',
  'chevron-down': 'navigation',
  'chevron-left': 'navigation',
  'chevron-right': 'navigation',
  'arrow-up': 'navigation',
  'arrow-down': 'navigation',
  'arrow-left': 'navigation',
  'arrow-right': 'navigation',

  // Action icons
  plus: 'action',
  minus: 'action',
  x: 'action',
  check: 'action',
  edit: 'action',
  trash: 'action',
  copy: 'action',
  download: 'action',
  upload: 'action',
  save: 'action',
  refresh: 'action',
  play: 'action',
  pause: 'action',
  stop: 'action',
  eye: 'action',
  'eye-off': 'action',
  lock: 'action',
  unlock: 'action',
  shield: 'action',
  'alert-triangle': 'action',
  'alert-circle': 'action',
  info: 'action',
  'help-circle': 'action',
  'check-circle': 'action',
  'x-circle': 'action',

  // Business icons
  'dollar-sign': 'business',
  'credit-card': 'business',
  wallet: 'business',
  'shopping-cart': 'business',
  package: 'business',
  truck: 'business',
  store: 'business',
  building: 'business',
  briefcase: 'business',
  'chart-bar': 'business',
  'chart-line': 'business',
  'trending-up': 'business',
  'trending-down': 'business',
  percent: 'business',
  receipt: 'business',
  'file-text': 'business',
  file: 'business',
  folder: 'business',

  // Hospitality icons
  bed: 'hospitality',
  hotel: 'hospitality',
  map: 'hospitality',
  car: 'hospitality',
  plane: 'hospitality',
  camera: 'hospitality',
  image: 'hospitality',
  wifi: 'hospitality',
  utensils: 'hospitality',
  coffee: 'hospitality',
  wine: 'hospitality',
  beer: 'hospitality',
  'chef-hat': 'hospitality',
  plate: 'hospitality',
  glass: 'hospitality',
  heart: 'hospitality',
  'heart-filled': 'hospitality',
  star: 'hospitality',
  'star-filled': 'hospitality',
  share: 'hospitality',
  message: 'hospitality',
  send: 'hospitality',
  loading: 'hospitality',
  success: 'hospitality',
  warning: 'hospitality',
  error: 'hospitality',
} as const;

type IconCategory = 'navigation' | 'action' | 'business' | 'hospitality';

// Main Buffr Icon Component
export const BuffrIcon: React.FC<BuffrIconProps> = ({
  name,
  size = 'md',
  className = '',
  color,
}) => {
  const category = ICON_CATEGORIES[name] as IconCategory;

  if (!category) {
    console.warn(`BuffrIcon: Icon "${name}" not found in any category`);
    return null;
  }

  const commonProps = {
    name: name as unknown,
    size,
    className,
    color,
  };

  switch (category) {
    case 'navigation':
      return <NavigationIcon {...commonProps} />;
    case 'action':
      return <ActionIcon {...commonProps} />;
    case 'business':
      return <BusinessIcon {...commonProps} />;
    case 'hospitality':
      return <HospitalityIcon {...commonProps} />;
    default:
      console.warn(
        `BuffrIcon: Unknown category "${category}" for icon "${name}"`
      );
      return null;
  }
};

// Icon category components for direct use
export { NavigationIcon, ActionIcon, BusinessIcon, HospitalityIcon };

// Export types
export type {
  NavigationIconName,
  ActionIconName,
  BusinessIconName,
  HospitalityIconName,
  BuffrIconName,
};

export default BuffrIcon;
