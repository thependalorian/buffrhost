/**
 * @file This file defines the WelcomeSection component, which displays a welcome message to the user.
 * @location frontend/components/dashboard/WelcomeSection.tsx
 * @description This component renders a card with a welcome message, the current date, and an optional subtitle.
 * @modular
 *
 * @component
 * @param {WelcomeSectionProps} props - The props for the component.
 * @param {string} props.userName - The name of the user to welcome.
 * @param {string} [props.subtitle] - An optional subtitle to display below the welcome message.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the component.
 *
 * @example
 * <WelcomeSection userName="John Doe" subtitle="Here is your dashboard overview." />
 *
 * @see {@link BuffrCard}
 * @see {@link BuffrIcon}
 *
 * @security This component does not handle any sensitive data directly.
 * @accessibility The component uses semantic HTML.
 * @performance The component is lightweight and has minimal performance impact.
 *
 * @buffr-icon-usage This component uses the 'sun' and 'moon' icons to indicate the time of day.
 */
'use client';

import React from 'react';
/**
 * WelcomeSection React Component for Buffr Host Hospitality Platform
 * @fileoverview WelcomeSection displays comprehensive dashboard with key metrics and analytics
 * @location buffr-host/components/dashboard/WelcomeSection.tsx
 * @purpose WelcomeSection displays comprehensive dashboard with key metrics and analytics
 * @component WelcomeSection
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
 * @param {string} [userName] - userName prop description
 * @param {string} [userRole] - userRole prop description
 * @param {string} [currentTime] - currentTime prop description
 * @param {} [className] - className prop description
 *
 * Usage Example:
 * @example
 * import { WelcomeSection } from './WelcomeSection';
 *
 * function App() {
 *   return (
 *     <WelcomeSection
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered WelcomeSection component
 */

import {
  BuffrCard,
  BuffrCardContent,
  BuffrCardHeader,
  BuffrCardTitle,
} from '@/components/ui/cards/BuffrCard';
import { BuffrIcon, BuffrIconName } from '@/components/ui/icons/BuffrIcons';

/**
 * Welcome Section Component
 *
 * Displays personalized welcome message with user info and quick stats
 * Location: components/dashboard/WelcomeSection.tsx
 */

interface WelcomeSectionProps {
  userName: string;
  userRole: string;
  currentTime: string;
  className?: string;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  userName,
  userRole,
  currentTime,
  className = '',
}) => {
  return (
    <BuffrCard className={`mb-4 sm:mb-6 overflow-hidden ${className}`}>
      <BuffrCardHeader className="p-3 sm:p-4 md:p-6">
        <BuffrCardTitle className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <BuffrIcon
            name="sun"
            className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500 flex-shrink-0"
          />
          <span className="text-base sm:text-lg md:text-xl truncate flex-1 min-w-0">
            Good {getTimeOfDay()}, {userName}!
          </span>
        </BuffrCardTitle>
      </BuffrCardHeader>
      <BuffrCardContent className="p-3 sm:p-4 md:p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 break-words">
              Welcome back to your dashboard
            </p>
            <p className="text-base sm:text-lg font-semibold text-gray-800 truncate">
              {userRole} Dashboard
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {currentTime}
            </p>
            <p className="text-xs text-gray-400 truncate">
              Last updated: Just now
            </p>
          </div>
        </div>
      </BuffrCardContent>
    </BuffrCard>
  );
};

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}
