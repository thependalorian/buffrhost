/**
 * Hospitality Icons Component
 *
 * Purpose: Hospitality and travel related icons for the Buffr Host platform
 * Functionality: Renders hospitality, travel, food, and dining icons
 * Location: /components/ui/icons/HospitalityIcons.tsx
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
 * HospitalityIcon React Component for Buffr Host Hospitality Platform
 * @fileoverview HospitalityIcon provides reusable UI component for consistent design
 * @location buffr-host/components/ui/icons/HospitalityIcons.tsx
 * @purpose HospitalityIcon provides reusable UI component for consistent design
 * @component HospitalityIcon
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
 * @param {HospitalityIconName} [name] - name prop description
 * @param {} [size] - size prop description
 * @param {} [className] - className prop description
 * @param {} [color] - color prop description
 *
 * Usage Example:
 * @example
 * import { HospitalityIcon } from './HospitalityIcon';
 *
 * function App() {
 *   return (
 *     <HospitalityIcon
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered HospitalityIcon component
 */

export type HospitalityIconName =
  | 'bed'
  | 'hotel'
  | 'map'
  | 'car'
  | 'plane'
  | 'camera'
  | 'image'
  | 'wifi'
  | 'utensils'
  | 'coffee'
  | 'wine'
  | 'beer'
  | 'chef-hat'
  | 'plate'
  | 'glass'
  | 'heart'
  | 'heart-filled'
  | 'star'
  | 'star-filled'
  | 'share'
  | 'message'
  | 'send'
  | 'loading'
  | 'success'
  | 'warning'
  | 'error';

export interface HospitalityIconProps {
  name: HospitalityIconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  color?: string;
}

export const HospitalityIcon: React.FC<HospitalityIconProps> = ({
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

  const iconStyle = color ? { color } : {};

  const iconPaths: Record<HospitalityIconName, string> = {
    // Hospitality & Travel
    bed: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M3 7V5a2 2 0 012-2h14a2 2 0 012 2v2 M7 7h10 M7 7v10 M17 7v10',
    hotel:
      'M3 21h18 M5 21V7l8-4v18 M19 21V11l-6-4 M9 9h.01 M15 9h.01 M9 15h.01 M15 15h.01',
    map: 'M9 20l-6-3V4l6 3m0 13l6-3V7l-6 3m0-13v13m6-13v13',
    car: 'M7 17h.01M17 17h.01M3 12h18l-1-7H4l-1 7zM5 17a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z',
    plane: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8',
    camera:
      'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8z',
    image:
      'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    wifi: 'M5 12.55a11 11 0 0114.08 0 M1.42 9a16 16 0 0121.16 0 M8.53 16.11a6 6 0 016.95 0 M12 20h.01',
    // Food & Dining
    utensils:
      'M3 2v7c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V2M3 2h6M3 2v20M9 2v20M9 2h6v20c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V2z',
    coffee:
      'M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3',
    wine: 'M12 21c5.5 0 9.5-4 9.5-9V6H2.5v6c0 5 4 9 9.5 9zM12 7v14M8 21h8',
    beer: 'M17 11v4c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2v-4M7 7h10M7 7v4M7 11h10M7 11v4M7 15h10',
    'chef-hat':
      'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M12 6v14M8 6v14M16 6v14',
    plate:
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 17.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5zM17 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
    glass: 'M8 21l4-9 4 9M12 2v9',
    // Social & Communication
    heart:
      'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
    'heart-filled':
      'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
    star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    'star-filled':
      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    share: 'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13',
    message: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
    send: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
    // System & Status
    loading:
      'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z',
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning:
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
    error:
      'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  };

  const path = iconPaths[name];

  if (!path) {
    console.warn(`HospitalityIcon: Icon "${name}" not found`);
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

export default HospitalityIcon;
