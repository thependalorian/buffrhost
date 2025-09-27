/**
 * ContentPreview Component for Buffr Host
 * 
 * A reusable preview component that shows how content will appear to visitors
 * when users upload menus, property information, and other content.
 */

"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Eye, Smartphone, Monitor, Tablet, X, RefreshCw } from 'lucide-react';

interface ContentPreviewProps {
  content: {
    type: 'menu' | 'property' | 'cms' | 'image';
    data: any;
    title?: string;
    description?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSave?: (content: any) => void;
  showDeviceToggle?: boolean;
  showSaveButton?: boolean;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const ContentPreview: React.FC<ContentPreviewProps> = ({
  content,
  isOpen,
  onClose,
  onSave,
  showDeviceToggle = true,
  showSaveButton = true
}) => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [isLoading, setIsLoading] = useState(false);

  const deviceConfig = {
    desktop: { width: '100%', maxWidth: '1200px', icon: Monitor },
    tablet: { width: '768px', maxWidth: '768px', icon: Tablet },
    mobile: { width: '375px', maxWidth: '375px', icon: Smartphone }
  };

  const DeviceIcon = deviceConfig[deviceType].icon;

  const renderMenuPreview = (menuData: any) => (
    <div className="bg-white min-h-screen">
      {/* Restaurant Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <h1 className="text-3xl font-bold mb-2">{menuData.restaurantName || 'Restaurant Name'}</h1>
        <p className="text-blue-100">{menuData.description || 'Delicious food and great service'}</p>
      </div>

      {/* Menu Categories */}
      <div className="max-w-4xl mx-auto p-6">
        {menuData.categories?.map((category: any, index: number) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">
              {category.name}
            </h2>
            <div className="grid gap-4">
              {category.items?.map((item: any, itemIndex: number) => (
                <div key={itemIndex} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      {item.isPopular && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Popular</span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                    {item.allergens && (
                      <p className="text-sm text-orange-600 mt-2">
                        Contains: {item.allergens.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <span className="text-xl font-bold text-blue-600">${item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPropertyPreview = (propertyData: any) => (
    <div className="bg-white min-h-screen">
      {/* Property Hero */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-white text-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">{propertyData.name || 'Property Name'}</h1>
            <p className="text-xl">{propertyData.tagline || 'Your perfect hospitality experience'}</p>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Us</h2>
            <p className="text-gray-600 leading-relaxed">
              {propertyData.description || 'Welcome to our beautiful property where we provide exceptional hospitality services.'}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Amenities</h2>
            <ul className="space-y-2">
              {propertyData.amenities?.map((amenity: string, index: number) => (
                <li key={index} className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  {amenity}
                </li>
              )) || (
                <li className="text-gray-500">No amenities listed</li>
              )}
            </ul>
          </div>
        </div>

        {/* Services */}
        {propertyData.services && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Services</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {propertyData.services.map((service: any, index: number) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCMSContent = (cmsData: any) => (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{cmsData.title || 'Content Title'}</h1>
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: cmsData.content || '<p>No content available</p>' }} />
        </div>
      </div>
    </div>
  );

  const renderImagePreview = (imageData: any) => (
    <div className="bg-white min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        <Image
          src={imageData.url || imageData.preview}
          alt={imageData.alt || 'Preview image'}
          width={800}
          height={600}
          className="max-w-full h-auto rounded-lg shadow-lg"
        />
        {imageData.caption && (
          <p className="text-gray-600 mt-4 text-lg">{imageData.caption}</p>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (content.type) {
      case 'menu':
        return renderMenuPreview(content.data);
      case 'property':
        return renderPropertyPreview(content.data);
      case 'cms':
        return renderCMSContent(content.data);
      case 'image':
        return renderImagePreview(content.data);
      default:
        return (
          <div className="bg-white min-h-screen flex items-center justify-center">
            <p className="text-gray-500">No preview available for this content type</p>
          </div>
        );
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsLoading(true);
    try {
      await onSave(content.data);
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
              Preview: {content.title || 'Content Preview'}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {showDeviceToggle && (
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
            )}
            
            {showSaveButton && (
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Save
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
              {renderContent()}
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
            <p>This is how your content will appear to visitors</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;
