'use client';
/**
 * Star Rating Component
 *
 * A reusable star rating component for customer reviews
 * Features: Interactive rating, half-star support, customizable size
 * Location: components/reviews/star-rating.tsx
 */

import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function StarRating({
  rating,
  onRatingChange,
  interactive = false,
  size = 'md',
  showLabel = false,
  className = '',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleMouseEnter = (starRating: number) => {
    if (interactive) {
      setHoverRating(starRating);
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
      setIsHovering(false);
    }
  };

  const getRatingLabel = (rating: number) => {
    const labels = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent',
    };
    return labels[rating as keyof typeof labels] || '';
  };

  const displayRating = isHovering ? hoverRating : rating;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating;
          const isHalfFilled =
            star === Math.ceil(displayRating) && displayRating % 1 !== 0;

          return (
            <button
              key={star}
              type="button"
              className={`${sizeClasses[size]} transition-colors duration-300 duration-150 ${
                interactive
                  ? 'cursor-pointer hover:scale-110'
                  : 'cursor-default'
              }`}
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
              disabled={!interactive}
            >
              <svg
                className={`w-full h-full ${
                  isFilled
                    ? 'text-yellow-400'
                    : isHalfFilled
                      ? 'text-yellow-400'
                      : 'text-nude-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                {isHalfFilled ? (
                  <defs>
                    <linearGradient id={`half-${star}`}>
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                ) : null}
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  fill={isHalfFilled ? `url(#half-${star})` : 'currentColor'}
                />
              </svg>
            </button>
          );
        })}
      </div>

      {showLabel && (
        <span className="ml-2 text-sm text-nude-600">
          {getRatingLabel(Math.round(displayRating))}
        </span>
      )}

      {interactive && (
        <span className="ml-2 text-sm text-nude-500">{displayRating}/5</span>
      )}
    </div>
  );
}
