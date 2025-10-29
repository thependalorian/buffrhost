import React from 'react';

interface PsychologyCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'prime' | 'luxury' | 'interactive';
  onClick?: () => void;
}

export const PsychologyCard: React.FC<PsychologyCardProps> = ({
  children,
  className = '',
  variant = 'prime',
  onClick,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'prime':
        return 'bg-white border border-nude-200 shadow-nude-soft hover:shadow-nude-medium';
      case 'luxury':
        return 'bg-luxury-champagne border border-luxury-charlotte shadow-luxury-soft hover:shadow-luxury-medium';
      case 'interactive':
        return 'bg-white border border-nude-200 shadow-nude-soft hover:shadow-nude-medium cursor-pointer';
      default:
        return 'bg-white border border-nude-200 shadow-nude-soft hover:shadow-nude-medium';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        ${getVariantClasses()}
        rounded-lg p-6
        transition-all duration-300 hover:-translate-y-1
        focus-within:ring-2 focus-within:ring-cta-primary focus-within:ring-offset-2
        ${className}
      `}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? 'Interactive card' : undefined}
    >
      {children}
    </div>
  );
};
