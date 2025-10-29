'use client';

import React from 'react';

/**
 * Page Hero Component
 * 
 * Reusable hero section for About, Contact, Privacy and other pages
 * Location: components/landing/PageHero.tsx
 * Features: Consistent styling, customizable content, medium size
 */

interface PageHeroProps {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage?: string;
  className?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({ 
  title, 
  subtitle, 
  description, 
  backgroundImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  className = '' 
}) => {
  return (
    <section className={`relative py-20 flex items-center justify-center ${className}`}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-nude-900/85 via-nude-900/75 to-nude-900/65"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="space-y-8">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white">
            {title}
            <span className="block text-xl md:text-2xl lg:text-3xl text-nude-200 mt-4">
              {subtitle}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-nude-100 leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};