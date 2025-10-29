'use client';

import React from 'react';
import { BuffrCard, BuffrCardContent, BuffrCardHeader, BuffrCardTitle } from '@/components/ui/cards/BuffrCard';
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
  className = ''
}) => {
  return (
    <BuffrCard className={`mb-6 ${className}`}>
      <BuffrCardHeader>
        <BuffrCardTitle className="flex items-center gap-3">
          <BuffrIcon 
            name="sun" 
            className="h-6 w-6 text-amber-500" 
          />
          <span>Good {getTimeOfDay()}, {userName}!</span>
        </BuffrCardTitle>
      </BuffrCardHeader>
      <BuffrCardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Welcome back to your dashboard
            </p>
            <p className="text-lg font-semibold text-gray-800">
              {userRole} Dashboard
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {currentTime}
            </p>
            <p className="text-xs text-gray-400">
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