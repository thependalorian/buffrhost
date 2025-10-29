import React from 'react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  showValue?: boolean;
  className?: string;
  onRatingChange?: (rating: number) => void;
}

export const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  (
    {
      rating,
      maxRating = 5,
      size = 'md',
      interactive = false,
      showValue = false,
      className,
      onRatingChange,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };

    const starSizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
    };

    const handleStarClick = (starRating: number) => {
      if (interactive && onRatingChange) {
        onRatingChange(starRating);
      }
    };

    const renderStar = (starIndex: number) => {
      const isFilled = starIndex < rating;
      const isHalfFilled = starIndex === Math.floor(rating) && rating % 1 !== 0;

      return (
        <button
          key={starIndex}
          type="button"
          className={cn(
            'transition-colors duration-300 duration-200 focus:outline-none focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-gold-400 focus:ring-offset-1 rounded-sm',
            interactive && 'cursor-pointer hover:scale-110',
            !interactive && 'cursor-default'
          )}
          onClick={() => handleStarClick(starIndex + 1)}
          disabled={!interactive}
          aria-label={`Rate ${starIndex + 1} out of ${maxRating} stars`}
        >
          <svg
            className={cn(
              starSizeClasses[size],
              'transition-all duration-300 duration-200',
              isFilled && 'text-gold-500 fill-current',
              isHalfFilled && 'text-gold-500 fill-current',
              !isFilled && !isHalfFilled && 'text-base-content/30 fill-current'
            )}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      );
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-1', sizeClasses[size], className)}
        role="img"
        aria-label={`Rating: ${rating} out of ${maxRating} stars`}
        {...props}
      >
        {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
        {showValue && (
          <span className="ml-2 text-nude-700 font-medium">
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    );
  }
);

StarRating.displayName = 'StarRating';
