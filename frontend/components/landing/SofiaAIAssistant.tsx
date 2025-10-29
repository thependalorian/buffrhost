'use client';

import React, { useState } from 'react';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';
import { AuthModal } from '@/components/auth/AuthModal';
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
  title = "Sofia",
  description = "I know the perfect spot for every craving and occasion. Let me help you discover your next favorite restaurant!",
  buttonText = "Chat with Sofia",
  onChatClick,
  className = ''
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
      <div className={`card bg-gradient-to-br from-nude-600/5 to-nude-700/5 border border-nude-600/20 p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-nude-600 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">S</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-nude-900">{title}</h3>
            <p className="text-sm text-nude-600">Your Dining Concierge</p>
          </div>
        </div>
        <p className="text-sm text-nude-900/70 mb-4">
          {description}
        </p>
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