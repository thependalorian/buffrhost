'use client';

import React from 'react';
import { BuffrCard, BuffrCardContent, BuffrCardHeader, BuffrCardTitle } from '@/components/ui/cards/BuffrCard';
import { BuffrIcon, BuffrIconName } from '@/components/ui/icons/BuffrIcons';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';

/**
 * Quick Actions Component
 * 
 * Displays frequently used actions as buttons
 * Location: components/dashboard/QuickActions.tsx
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
  className = ''
}) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4'
  };

  return (
    <BuffrCard className={className}>
      <BuffrCardHeader>
        <BuffrCardTitle className="flex items-center gap-2">
          <BuffrIcon name="zap" className="h-5 w-5" />
          Quick Actions
        </BuffrCardTitle>
      </BuffrCardHeader>
      <BuffrCardContent>
        <div className={`grid ${gridCols[columns]} gap-3`}>
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

  const getButtonVariant = (variant?: string): 'primary' | 'secondary' | 'outline' | 'ghost' => {
    return (variant as 'primary' | 'secondary' | 'outline' | 'ghost') || 'outline';
  };

  return (
    <BuffrButton
      variant={getButtonVariant(action.variant)}
      className="h-auto p-4 flex flex-col items-center gap-2 text-center hover:shadow-md transition-shadow"
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
        className={`h-6 w-6 ${getIconColor(action.color)}`}
      />
      <div>
        <p className="text-sm font-medium">{action.title}</p>
        <p className="text-xs text-gray-600 mt-1">{action.description}</p>
      </div>
    </BuffrButton>
  );
};