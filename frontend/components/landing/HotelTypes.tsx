'use client';

import React from 'react';

/**
 * Hotel Types Component
 * 
 * Displays different types of accommodation that can use the platform
 * Location: components/landing/HotelTypes.tsx
 * Features: Hotel type cards with services, responsive grid
 */

interface HotelType {
  title: string;
  description: string;
  services: string[];
  imageUrl: string;
}

interface HotelTypeCardProps {
  title: string;
  description: string;
  services: string[];
  imageUrl: string;
}

const HotelTypeCard: React.FC<HotelTypeCardProps> = ({ title, description, services, imageUrl }) => (
  <div className="bg-white rounded-2xl shadow-luxury-soft border border-nude-200/50 hover:shadow-luxury-medium transition-all duration-300 hover:-translate-y-1 overflow-hidden">
    <div className="w-full h-48">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
    </div>
    <div className="p-8">
      <h3 className="text-2xl font-semibold text-nude-900 mb-4">{title}</h3>
      <p className="text-nude-700 mb-6 leading-relaxed">{description}</p>
      <div className="space-y-2">
        {services.map((service, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-nude-600">
            <div className="w-1.5 h-1.5 bg-nude-400 rounded-full"></div>
            {service}
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface HotelTypesProps {
  className?: string;
}

export const HotelTypes: React.FC<HotelTypesProps> = ({ className = '' }) => {
  const hotelTypes: HotelType[] = [
    {
      title: "Vacation Rentals",
      description: "Airbnb, holiday homes, and short-term rentals", 
      imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      services: ["Self Check-in", "Cleaning", "Guest Communication", "Pricing"]
    },
    {
      title: "Resorts & Lodges",
      description: "Large properties with multiple amenities",
      imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      services: ["Multiple Restaurants", "Activities", "Spa", "Tours"]
    },
    {
      title: "Guest Houses",
      description: "Smaller properties with intimate service",
      imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      services: ["Breakfast", "Housekeeping", "Local Tours", "Personal Service"]
    }
  ];

  return (
    <section id="hotels" className={`py-24 md:py-32 bg-white ${className}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-nude-900">
            Accommodation
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-nude-700 leading-relaxed">
            Comprehensive property management for every type of accommodation business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {hotelTypes.map((hotel, index) => (
            <HotelTypeCard key={index} {...hotel} />
          ))}
        </div>
      </div>
    </section>
  );
};
