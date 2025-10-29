'use client';

import React from 'react';

/**
 * Restaurant Types Component
 * 
 * Displays different types of restaurants that can use the platform
 * Location: components/landing/RestaurantTypes.tsx
 * Features: Restaurant type cards with services, responsive grid
 */

interface RestaurantType {
  title: string;
  description: string;
  features: string[];
  imageUrl: string;
}

interface RestaurantTypeCardProps {
  title: string;
  description: string;
  features: string[];
  imageUrl: string;
}

const RestaurantTypeCard: React.FC<RestaurantTypeCardProps> = ({ title, description, features, imageUrl }) => (
  <div className="bg-white rounded-2xl shadow-luxury-soft border border-nude-200/50 hover:shadow-luxury-medium transition-all duration-300 hover:-translate-y-1 overflow-hidden">
    <div className="w-full h-48">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
    </div>
    <div className="p-8">
      <h3 className="text-2xl font-semibold text-nude-900 mb-4">{title}</h3>
      <p className="text-nude-700 mb-6 leading-relaxed">{description}</p>
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-nude-600">
            <div className="w-1.5 h-1.5 bg-nude-400 rounded-full"></div>
            {feature}
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface RestaurantTypesProps {
  className?: string;
}

export const RestaurantTypes: React.FC<RestaurantTypesProps> = ({ className = '' }) => {
  const restaurantTypes: RestaurantType[] = [
    {
      title: "Standalone Restaurants",
      description: "Complete F&B system for restaurants without accommodation",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["Menu Management", "Table Booking", "Order Management", "Inventory Control"]
    },
    {
      title: "Bars & Lounges",
      description: "Specialized for beverage-focused establishments", 
      imageUrl: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["Bar Management", "Bottle Service", "Inventory Control", "Staff Scheduling"]
    }
  ];

  return (
    <section id="restaurants" className={`py-24 md:py-32 bg-white ${className}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-nude-900">
            Food & Beverage
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-nude-700 leading-relaxed">
            Complete F&B management solutions for restaurants and bars of all sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {restaurantTypes.map((type, index) => (
            <RestaurantTypeCard key={index} {...type} />
          ))}
        </div>
      </div>
    </section>
  );
};
