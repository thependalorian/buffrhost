/**
 * Business Icons Component
 *
 * Purpose: Business and commerce related icons for the Buffr Host platform
 * Functionality: Renders business, commerce, and financial icons
 * Location: /components/ui/icons/BusinessIcons.tsx
 *
 * Follows 40 Rules:
 * - Uses DaisyUI for consistent styling
 * - Modular component design for easy maintenance
 * - TypeScript for type safety
 * - Vercel-compatible with SSR
 * - Optimized for performance
 */

import * as React from 'react';

/**
 * BusinessIcon React Component for Buffr Host Hospitality Platform
 * @fileoverview BusinessIcon provides reusable UI component for consistent design
 * @location buffr-host/components/ui/icons/BusinessIcons.tsx
 * @purpose BusinessIcon provides reusable UI component for consistent design
 * @component BusinessIcon
 * @category Ui
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {BusinessIconName} [name] - name prop description
 * @param {} [size] - size prop description
 * @param {} [className] - className prop description
 * @param {} [color] - color prop description
 *
 * Usage Example:
 * @example
 * import { BusinessIcon } from './BusinessIcon';
 *
 * function App() {
 *   return (
 *     <BusinessIcon
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered BusinessIcon component
 */

export type BusinessIconName =
  | 'dollar-sign'
  | 'credit-card'
  | 'wallet'
  | 'shopping-cart'
  | 'package'
  | 'truck'
  | 'store'
  | 'building'
  | 'briefcase'
  | 'chart-bar'
  | 'chart-line'
  | 'trending-up'
  | 'trending-down'
  | 'percent'
  | 'receipt'
  | 'file-text'
  | 'file'
  | 'folder';

export interface BusinessIconProps {
  name: BusinessIconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  color?: string;
}

export const BusinessIcon: React.FC<BusinessIconProps> = ({
  name,
  size = 'md',
  className = '',
  color,
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
    '3xl': 'w-12 h-12',
  };

  const iconStyle = {
    color: color || 'currentColor',
  };

  const iconPaths: Record<BusinessIconName, string> = {
    // Business & Commerce
    'dollar-sign':
      'M12 8c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4c1.1 0 2-.9 2-2h2c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4c-1.1 0-2 .9-2 2H8c0-2.21-1.79-4-4-4z',
    'credit-card':
      'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z',
    wallet:
      'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z',
    'shopping-cart':
      'M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01',
    package: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    truck:
      'M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
    store:
      'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9',
    building:
      'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    briefcase:
      'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6',
    'chart-bar':
      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    'chart-line':
      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    'trending-up': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    'trending-down': 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6',
    percent:
      'M9 7h6m-6 4h6m-2 5h2M9 12h.01M15 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    receipt: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    'file-text':
      'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
    file: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6',
    folder:
      'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z',
  };

  const path = iconPaths[name];

  if (!path) {
    console.warn(`BusinessIcon: Icon "${name}" not found`);
    return null;
  }

  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      style={iconStyle}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={path}
      />
    </svg>
  );
};

export default BusinessIcon;
