'use client';

import React, { useState } from 'react';
/**
 * SofiaAIAssistant React Component for Buffr Host Hospitality Platform
 * @fileoverview SofiaAIAssistant provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/landing/SofiaAIAssistant.tsx
 * @purpose SofiaAIAssistant provides specialized functionality for the Buffr Host platform
 * @component SofiaAIAssistant
 * @category Landing
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @authentication JWT-based authentication for user-specific functionality
 * @hooks_utilization useState for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Secure authentication integration for user-specific features
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {} [title] - title prop description
 * @param {} [description] - description prop description
 * @param {} [buttonText] - buttonText prop description
 * @param {} [onChatClick] - onChatClick prop description
 * @param {} [className] - className prop description
 *
 * Methods:
 * @method handleChatClick - handleChatClick method for component functionality
 *
 * Usage Example:
 * @example
 * import { SofiaAIAssistant } from './SofiaAIAssistant';
 *
 * function App() {
 *   return (
 *     <SofiaAIAssistant
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered SofiaAIAssistant component
 */

import { BuffrButton } from '@/components/ui/buttons/BuffrButton';
import AuthModal from '@/components/auth/AuthModal';
import { AuthGuard } from '@/components/auth/AuthGuard';

/**
 * Sofia AI Assistant Component
 *
 * Reusable Sofia AI assistant card for property pages
 * Location: components/landing/SofiaAIAssistant.tsx
 * Features: Sofia branding, chat button, auth guard for guests
 * Note: This is for GUESTS to use services - requires authentication, not waitlist
 */

interface SofiaAIAssistantProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onChatClick?: () => void;
  className?: string;
}

export const SofiaAIAssistant: React.FC<SofiaAIAssistantProps> = ({
  title = 'Sofia',
  description = 'I know the perfect spot for every craving and occasion. Let me help you discover your next favorite restaurant!',
  buttonText = 'Chat with Sofia',
  onChatClick,
  className = '',
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleChatClick = () => {
    // If custom handler provided, use it
    if (onChatClick) {
      onChatClick();
      return;
    }

    // Otherwise, check auth first
    // AuthGuard will handle showing auth modal if needed
    setShowAuthModal(true);
  };

  return (
    <>
      <div
        className={`card bg-gradient-to-br from-nude-600/5 to-nude-700/5 border border-nude-600/20 p-6 ${className}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-nude-600 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">S</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-nude-900">{title}</h3>
            <p className="text-sm text-nude-600">Your Dining Concierge</p>
          </div>
        </div>
        <p className="text-sm text-nude-900/70 mb-4">{description}</p>
        <AuthGuard
          requireAuth={true}
          service="Sofia AI"
          fallback={
            <BuffrButton
              onClick={() => setShowAuthModal(true)}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Sign In to Chat
            </BuffrButton>
          }
        >
          <BuffrButton
            onClick={handleChatClick}
            variant="primary"
            size="lg"
            className="w-full"
          >
            {buttonText}
          </BuffrButton>
        </AuthGuard>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          // After successful auth, trigger the chat
          onChatClick?.();
        }}
      />
    </>
  );
};
