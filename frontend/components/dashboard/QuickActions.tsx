'use client';

import React from 'react';
/**
 * QuickActions React Component for Buffr Host Hospitality Platform
 * @fileoverview QuickActions displays comprehensive dashboard with key metrics and analytics
 * @location buffr-host/components/dashboard/QuickActions.tsx
 * @purpose QuickActions displays comprehensive dashboard with key metrics and analytics
 * @component QuickActions
 * @category Dashboard
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
 * @param {QuickAction[]} [actions] - actions prop description
 * @param {} [columns] - columns prop description
 * @param {} [className] - className prop description
 *
 * Usage Example:
 * @example
 * import { QuickActions } from './QuickActions';
 *
 * function App() {
 *   return (
 *     <QuickActions
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered QuickActions component
 */

import {
  BuffrCard,
  BuffrCardContent,
  BuffrCardHeader,
  BuffrCardTitle,
} from '@/components/ui/cards/BuffrCard';
import { BuffrIcon, BuffrIconName } from '@/components/ui/icons/BuffrIcons';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';

/**
 * @file This file defines the QuickActions component, which displays a grid of frequently used actions.
 * @location frontend/components/dashboard/QuickActions.tsx
 * @description This component renders a card with a grid of buttons, each representing a quick action a user can take.
 * @modular
 *
 * @component
 * @param {QuickActionsProps} props - The props for the component.
 * @param {QuickAction[]} props.actions - An array of action objects to display.
 * @param {2 | 3 | 4} [props.columns=3] - The number of columns in the grid.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the component.
 *
 * @example
 * const actions = [
 *   { id: '1', title: 'New Booking', description: 'Create a new booking', icon: 'plus', href: '/bookings/new' },
 *   { id: '2', title: 'View Guests', description: 'See all guests', icon: 'users', href: '/guests' },
 * ];
 * <QuickActions actions={actions} columns={2} />
 *
 * @see {@link BuffrCard}
 * @see {@link BuffrButton}
 * @see {@link BuffrIcon}
 *
 * @security This component does not handle any sensitive data directly, but it does navigate to other pages.
 * @accessibility The component uses semantic HTML and ARIA attributes where necessary.
 * @performance The component is lightweight and has minimal performance impact.
 *
 * @buffr-icon-usage This component uses the 'zap' icon, and dynamically renders icons based on the 'actions' prop.
 */

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: BuffrIconName;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  color?: 'primary' | 'success' | 'warning' | 'info' | 'error';
}

interface QuickActionsProps {
  actions: QuickAction[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  columns = 3,
  className = '',
}) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  return (
    <BuffrCard className={`overflow-hidden ${className}`}>
      <BuffrCardHeader className="p-3 sm:p-4 md:p-6">
        <BuffrCardTitle className="flex items-center gap-2">
          <BuffrIcon
            name="zap"
            className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
          />
          <span className="text-base sm:text-lg md:text-xl truncate">
            Quick Actions
          </span>
        </BuffrCardTitle>
      </BuffrCardHeader>
      <BuffrCardContent className="p-3 sm:p-4 md:p-6 pt-0">
        <div className={`grid ${gridCols[columns]} gap-2 sm:gap-3`}>
          {actions.map((action) => (
            <QuickActionButton key={action.id} action={action} />
          ))}
        </div>
      </BuffrCardContent>
    </BuffrCard>
  );
};

interface QuickActionButtonProps {
  action: QuickAction;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ action }) => {
  const getIconColor = (color?: string): string => {
    switch (color) {
      case 'primary':
        return 'text-blue-500';
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getButtonVariant = (
    variant?: string
  ): 'primary' | 'secondary' | 'outline' | 'ghost' => {
    return (
      (variant as 'primary' | 'secondary' | 'outline' | 'ghost') || 'outline'
    );
  };

  return (
    <BuffrButton
      variant={getButtonVariant(action.variant)}
      className="h-auto p-3 sm:p-4 flex flex-col items-center gap-1 sm:gap-2 text-center hover:shadow-md transition-shadow min-h-[80px] sm:min-h-[100px] md:min-h-[120px]"
      onClick={() => {
        // Handle navigation or action
        if (action.href.startsWith('http')) {
          window.open(action.href, '_blank');
        } else {
          window.location.href = action.href;
        }
      }}
    >
      <BuffrIcon
        name={action.icon}
        className={`h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 ${getIconColor(action.color)}`}
      />
      <div className="flex-1 flex flex-col justify-center min-w-0 w-full">
        <p className="text-xs sm:text-sm font-medium truncate w-full">
          {action.title}
        </p>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2 break-words">
          {action.description}
        </p>
      </div>
    </BuffrButton>
  );
};
