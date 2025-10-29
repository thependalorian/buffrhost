import React from 'react';

interface PsychologyHeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export const PsychologyHeading: React.FC<PsychologyHeadingProps> = ({
  children,
  level = 1,
  className = '',
}) => {
  const getHeadingClasses = () => {
    switch (level) {
      case 1:
        return 'text-5xl md:text-6xl lg:text-7xl font-display font-bold text-nude-900 leading-tight tracking-tight bg-gradient-to-r from-nude-900 via-nude-800 to-luxury-gold bg-clip-text text-transparent';
      case 2:
        return 'text-3xl md:text-4xl font-display font-semibold text-nude-800 leading-tight tracking-tight';
      case 3:
        return 'text-xl md:text-2xl font-display font-medium text-nude-800 leading-snug';
      case 4:
        return 'text-lg md:text-xl font-display font-medium text-nude-800 leading-snug';
      case 5:
        return 'text-base md:text-lg font-display font-medium text-nude-800 leading-snug';
      case 6:
        return 'text-sm md:text-base font-display font-medium text-nude-800 leading-snug';
      default:
        return 'text-3xl md:text-4xl font-display font-semibold text-nude-800 leading-tight tracking-tight';
    }
  };

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag className={`${getHeadingClasses()} ${className}`}>
      {children}
    </HeadingTag>
  );
};
