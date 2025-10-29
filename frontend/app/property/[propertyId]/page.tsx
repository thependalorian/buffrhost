'use client';

import React, { useEffect, useState } from 'react';
import { Navigation, Footer, PropertyHero, PropertyActions, PropertyDetails } from '@/components/landing';
import { Property } from '@/lib/types/database';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';

interface PropertyPageProps {
  params: { propertyId: string };
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        console.log('Fetching property:', params.propertyId);
        const response = await fetch(`/api/properties/${params.propertyId}`);
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
          console.log('Setting property:', data.data);
          setProperty(data.data);
        } else {
          console.error('API error:', data.message);
          setError(data.message || 'Property not found');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load property details');
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.propertyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-error mb-4">Property Not Found</h1>
            <p className="text-base-content/70 mb-6">{error || 'The requested property could not be found.'}</p>
            <BuffrButton 
              onClick={() => window.location.href = '/'}
              variant="primary"
              size="md"
            >
              Back to Home
            </BuffrButton>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBookNow = (id: string) => {
    // Handle booking logic
    console.log('Book now for property:', id);
  };

  const handleContact = (id: string) => {
    // Handle contact logic
    console.log('Contact property:', id);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navigation />
      
      {/* Hero Section */}
      <PropertyHero
        title={property.name}
        subtitle={property.description}
        location={`${property.city}, ${property.region}`}
        rating={property.average_rating}
        reviewCount={property.total_reviews}
        type={property.property_type as 'hotel' | 'restaurant'}
        backgroundImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <PropertyDetails property={property} />
          </div>

          {/* Sidebar */}
          <div>
            <PropertyActions
              property={{
                id: property.id,
                name: property.name,
                address: property.address,
                phone: property.phone,
                email: property.email,
                website: property.website,
                type: property.property_type as 'hotel' | 'restaurant'
              }}
              onBookNow={handleBookNow}
              onContact={handleContact}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}