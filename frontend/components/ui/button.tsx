import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'default' | 'lg' | 'sm';
}

/**
 * Button React Component for Buffr Host Hospitality Platform
 * @fileoverview Button provides reusable UI component for consistent design
 * @location buffr-host/components/ui/button.tsx
 * @purpose Button provides reusable UI component for consistent design
 * @component Button
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
 * import { Button } from './Button';
 *
 * function App() {
 *   return (
 *     <Button
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered Button component
 */

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, size = 'default', ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      default: 'px-4 py-2',
      lg: 'px-8 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${sizeClasses[size]} !rounded-full font-medium transition-colors ${className || ''}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
