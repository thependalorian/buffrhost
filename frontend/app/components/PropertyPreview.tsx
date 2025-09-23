/**
 * PropertyPreview Component for Buffr Host
 * 
 * Specialized preview component for property content including amenities,
 * services, rooms, and guest-facing information.
 */

"use client";

import React, { useState } from 'react';
import { 
  MapPin, 
  Star, 
  Wifi, 
  Car, 
  Coffee, 
  Dumbbell, 
  Waves, 
  Utensils,
  Smartphone, 
  Monitor, 
  Tablet, 
  Eye, 
  Share2,
  X,
  Phone,
  Mail,
  Globe
} from 'lucide-react';

interface PropertyData {
  name: string;
  description: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  heroImage?: string;
  logo?: string;
  rating?: number;
  amenities: string[];
  services: Array<{
    name: string;
    description: string;
    icon?: string;
  }>;
  rooms?: Array<{
    name: string;
    description: string;
    price: number;
    image?: string;
    amenities: string[];
  }>;
  gallery?: string[];
  policies?: Array<{
    title: string;
    description: string;
  }>;
  theme: 'modern' | 'classic' | 'luxury' | 'boutique';
}

interface PropertyPreviewProps {
  propertyData: PropertyData;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (propertyData: PropertyData) => void;
  showContactInfo?: boolean;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const PropertyPreview: React.FC<PropertyPreviewProps> = ({
  propertyData,
  isOpen,
  onClose,
  onSave,
  showContactInfo = true
}) => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  const deviceConfig = {
    desktop: { width: '100%', maxWidth: '1200px', icon: Monitor },
    tablet: { width: '768px', maxWidth: '768px', icon: Tablet },
    mobile: { width: '375px', maxWidth: '375px', icon: Smartphone }
  };

  const DeviceIcon = deviceConfig[deviceType].icon;

  const getThemeClasses = () => {
    switch (propertyData.theme) {
      case 'luxury':
        return {
          primary: 'bg-gradient-to-r from-yellow-600 to-yellow-800',
          secondary: 'bg-yellow-50',
          accent: 'text-yellow-600',
          card: 'bg-white shadow-xl'
        };
      case 'boutique':
        return {
          primary: 'bg-gradient-to-r from-purple-600 to-pink-600',
          secondary: 'bg-purple-50',
          accent: 'text-purple-600',
          card: 'bg-white shadow-lg'
        };
      case 'classic':
        return {
          primary: 'bg-gradient-to-r from-gray-700 to-gray-900',
          secondary: 'bg-gray-50',
          accent: 'text-gray-700',
          card: 'bg-white shadow-md'
        };
      default: // modern
        return {
          primary: 'bg-gradient-to-r from-blue-600 to-blue-800',
          secondary: 'bg-blue-50',
          accent: 'text-blue-600',
          card: 'bg-white shadow-lg'
        };
    }
  };

  const theme = getThemeClasses();

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi className="w-5 h-5" />;
    if (amenityLower.includes('parking')) return <Car className="w-5 h-5" />;
    if (amenityLower.includes('restaurant') || amenityLower.includes('dining')) return <Utensils className="w-5 h-5" />;
    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return <Dumbbell className="w-5 h-5" />;
    if (amenityLower.includes('pool')) return <Waves className="w-5 h-5" />;
    if (amenityLower.includes('coffee') || amenityLower.includes('cafe')) return <Coffee className="w-5 h-5" />;
    return <Star className="w-5 h-5" />;
  };

  const renderAmenities = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {propertyData.amenities.map((amenity, index) => (
        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className={theme.accent}>
            {getAmenityIcon(amenity)}
          </div>
          <span className="text-sm font-medium text-gray-700">{amenity}</span>
        </div>
      ))}
    </div>
  );

  const renderServices = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {propertyData.services.map((service, index) => (
        <div key={index} className={`p-6 ${theme.card} rounded-lg`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
          <p className="text-gray-600">{service.description}</p>
        </div>
      ))}
    </div>
  );

  const renderRooms = () => {
    if (!propertyData.rooms || propertyData.rooms.length === 0) return null;

    return (
      <div className="space-y-6">
        {propertyData.rooms.map((room, index) => (
          <div key={index} className={`${theme.card} rounded-lg overflow-hidden`}>
            {room.image && (
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
                <span className="text-2xl font-bold text-blue-600">${room.price}/night</span>
              </div>
              <p className="text-gray-600 mb-4">{room.description}</p>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity, amenityIndex) => (
                  <span
                    key={amenityIndex}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPropertyContent = () => (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-96">
        {propertyData.heroImage ? (
          <img
            src={propertyData.heroImage}
            alt={propertyData.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full ${theme.primary} flex items-center justify-center`}>
            <div className="text-white text-center">
              {propertyData.logo && (
                <img
                  src={propertyData.logo}
                  alt={propertyData.name}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-white p-2"
                />
              )}
              <h1 className="text-4xl font-bold">{propertyData.name}</h1>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center text-white text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{propertyData.name}</h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{propertyData.address}</span>
            </div>
            {propertyData.rating && (
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < propertyData.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-2 text-lg">{propertyData.rating}/5</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* About Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About {propertyData.name}</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{propertyData.description}</p>
        </section>

        {/* Amenities Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Amenities</h2>
          {renderAmenities()}
        </section>

        {/* Services Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Services</h2>
          {renderServices()}
        </section>

        {/* Rooms Section */}
        {propertyData.rooms && propertyData.rooms.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Accommodations</h2>
            {renderRooms()}
          </section>
        )}

        {/* Gallery Section */}
        {propertyData.gallery && propertyData.gallery.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {propertyData.gallery.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </section>
        )}

        {/* Policies Section */}
        {propertyData.policies && propertyData.policies.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Policies</h2>
            <div className="space-y-4">
              {propertyData.policies.map((policy, index) => (
                <div key={index} className={`p-4 ${theme.card} rounded-lg`}>
                  <h3 className="font-semibold text-gray-900 mb-2">{policy.title}</h3>
                  <p className="text-gray-600">{policy.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        {showContactInfo && (
          <section className={`p-8 ${theme.secondary} rounded-lg`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {propertyData.phone && (
                <div className="flex items-center gap-3">
                  <Phone className={`w-6 h-6 ${theme.accent}`} />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">{propertyData.phone}</p>
                  </div>
                </div>
              )}
              {propertyData.email && (
                <div className="flex items-center gap-3">
                  <Mail className={`w-6 h-6 ${theme.accent}`} />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">{propertyData.email}</p>
                  </div>
                </div>
              )}
              {propertyData.website && (
                <div className="flex items-center gap-3">
                  <Globe className={`w-6 h-6 ${theme.accent}`} />
                  <div>
                    <p className="font-medium text-gray-900">Website</p>
                    <p className="text-gray-600">{propertyData.website}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className={`${theme.primary} text-white p-8 text-center`}>
        <p className="text-lg font-semibold mb-2">{propertyData.name}</p>
        <p className="text-white opacity-80">Powered by Buffr Host</p>
      </footer>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative flex flex-col h-full bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Eye className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Property Preview: {propertyData.name}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Device Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {Object.entries(deviceConfig).map(([device, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={device}
                    onClick={() => setDeviceType(device as DeviceType)}
                    className={`p-2 rounded-md transition-colors ${
                      deviceType === device
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title={`${device.charAt(0).toUpperCase() + device.slice(1)} view`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
            
            {/* Save Button */}
            {onSave && (
              <button
                onClick={() => onSave(propertyData)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Share2 className="w-4 h-4" />
                Save Property
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="mx-auto" style={{ width: deviceConfig[deviceType].width, maxWidth: deviceConfig[deviceType].maxWidth }}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {renderPropertyContent()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <DeviceIcon className="w-4 h-4" />
              <span>{deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} View</span>
            </div>
            <p>This is how your property will appear to guests</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPreview;
