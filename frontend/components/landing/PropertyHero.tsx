'use client';

import React from 'react';
import { MapPin, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/**
 * Property Hero Component
 * 
 * Modular hero section for property pages with consistent styling and image support
 * Location: components/landing/PropertyHero.tsx
 * Features: Background image, property info, navigation, consistent design
 */

interface PropertyHeroProps {
  title: string;
  subtitle?: string;
  location: string;
  rating: number;
  reviewCount: number;
  type: 'hotel' | 'restaurant';
  backgroundImage?: string;
  showBackButton?: boolean;
  backButtonHref?: string;
  backButtonText?: string;
  className?: string;
}

export const PropertyHero: React.FC<PropertyHeroProps> = ({
  title,
  subtitle,
  location,
  rating,
  reviewCount,
  type,
  backgroundImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  showBackButton = true,
  backButtonHref = type === 'hotel' ? '/hotels' : '/restaurants',
  backButtonText = type === 'hotel' ? 'Back to Hotels' : 'Back to Restaurants',
  className = ''
}) => {
  const getTypeDisplay = () => {
    return type === 'hotel' ? 'Hotel' : 'Restaurant';
  };

  const getTypeIcon = () => {
    return type === 'hotel' ? 'H' : 'R';
  };

  return (
    <section 
      className={`relative py-20 px-4 text-center ${className}`}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="relative max-w-4xl mx-auto">
        {showBackButton && (
          <div className="flex items-center justify-center mb-6">
            <Link 
              href={backButtonHref} 
              className="btn btn-ghost text-white hover:text-white/80 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {backButtonText}
            </Link>
          </div>
        )}
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        
        <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Star className="w-5 h-5 fill-current text-yellow-400" />
            <span className="text-lg font-semibold">{rating.toFixed(1)}</span>
            <span className="text-white/70">({reviewCount} reviews)</span>
          </div>
        </div>
        
        <div className="badge badge-lg badge-secondary bg-white/90 text-nude-900">
          <span className="w-6 h-6 bg-nude-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">
            {getTypeIcon()}
          </span>
          {getTypeDisplay()}
        </div>
      </div>
    </section>
  );
};