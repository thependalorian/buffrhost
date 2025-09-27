/**
 * Etuna Map Component
 * 
 * Embedded map with directions to Etuna Guesthouse & Tours
 * Includes interactive features and property information
 */

'use client';

import { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock,
  Truck,
  User,
  Building,
  ArrowRight
} from 'lucide-react';

interface EtunaMapProps {
  className?: string;
  showDirections?: boolean;
  height?: string;
}

export default function EtunaMap({ 
  className = '', 
  showDirections = true, 
  height = '400px' 
}: EtunaMapProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'directions'>('map');

  const propertyInfo = {
    name: 'Etuna Guesthouse & Tours',
    address: '5544 Valley Street, Ongwediva, Namibia',
    coordinates: {
      lat: -17.7833,
      lng: 15.7667
    },
    phone: '+264 65 231 177',
    email: 'bookings@etunaguesthouse.com',
    website: 'http://www.etunaguesthouse.com'
  };

  const directions = [
    {
      from: 'Ondangwa Airport',
      distance: '15 km',
      duration: '20 minutes',
      method: 'car',
      steps: [
        'Exit Ondangwa Airport',
        'Take C46 towards Ongwediva',
        'Turn right onto Valley Street',
        'Etuna Guesthouse is on your left'
      ]
    },
    {
      from: 'Windhoek (City Center)',
      distance: '450 km',
      duration: '5 hours',
      method: 'car',
      steps: [
        'Take B1 north from Windhoek',
        'Continue on B1 through Otjiwarongo',
        'Take C46 towards Ongwediva',
        'Turn right onto Valley Street',
        'Etuna Guesthouse is on your left'
      ]
    },
    {
      from: 'Ongwediva Town Center',
      distance: '2 km',
      duration: '5 minutes',
      method: 'walking',
      steps: [
        'Head south on Main Street',
        'Turn left onto Valley Street',
        'Etuna Guesthouse is 200m on your right'
      ]
    }
  ];

  const getGoogleMapsUrl = () => {
    const { lat, lng } = propertyInfo.coordinates;
    return `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBvOkBwJcSxqK8Q9R2T3U4V5W6X7Y8Z9A'}&q=${lat},${lng}&zoom=15`;
  };

  const getDirectionsUrl = (destination: string) => {
    const { lat, lng } = propertyInfo.coordinates;
    return `https://www.google.com/maps/dir/${destination}/${lat},${lng}`;
  };

  return (
    <div className={`card bg-base-100 shadow-xl ${className}`}>
      <div className="card-body p-0">
        {/* Header */}
        <div className="bg-primary text-primary-content p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-lg">Etuna Guesthouse Location</h3>
                <p className="text-primary-content/80 text-sm">
                  {propertyInfo.address}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Open 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed bg-gray-100 dark:bg-gray-800 m-4">
          <button
            className={`tab ${activeTab === 'map' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Map
          </button>
          <button
            className={`tab ${activeTab === 'directions' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('directions')}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Directions
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'map' ? (
            <div className="space-y-4">
              {/* Embedded Map */}
              <div 
                className="rounded-lg overflow-hidden border"
                style={{ height }}
              >
                <iframe
                  src={getGoogleMapsUrl()}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Etuna Guesthouse Location"
                />
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <a href={`tel:${propertyInfo.phone}`} className="link link-primary">
                        {propertyInfo.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>24/7 Front Desk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{propertyInfo.address}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Quick Actions</h4>
                  <div className="space-y-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${propertyInfo.coordinates.lat},${propertyInfo.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm w-full"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Open in Google Maps
                    </a>
                    <a
                      href={`tel:${propertyInfo.phone}`}
                      className="btn btn-outline btn-sm w-full"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-semibold">Directions to Etuna Guesthouse</h4>
              
              {directions.map((direction, index) => (
                <div key={index} className="card bg-base-200 shadow-sm">
                  <div className="card-body p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-semibold">{direction.from}</h5>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{direction.distance}</span>
                          <span>{direction.duration}</span>
                          <div className="flex items-center gap-1">
                            {direction.method === 'car' && <Truck className="w-4 h-4" />}
                            {direction.method === 'walking' && <User className="w-4 h-4" />}
                            {direction.method === 'bus' && <Building className="w-4 h-4" />}
                            <span className="capitalize">{direction.method}</span>
                          </div>
                        </div>
                      </div>
                      <a
                        href={getDirectionsUrl(direction.from)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        Get Directions
                      </a>
                    </div>
                    
                    <div className="space-y-2">
                      {direction.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-2 text-sm">
                          <span className="w-6 h-6 bg-primary text-primary-content rounded-full flex items-center justify-center text-xs font-semibold">
                            {stepIndex + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Additional Info */}
              <div className="alert alert-info">
                <div>
                  <h4 className="font-semibold">Travel Tips</h4>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Free parking available on-site</li>
                    <li>• Airport shuttle service available (advance booking required)</li>
                    <li>• Located in the heart of Ongwediva, close to local attractions</li>
                    <li>• GPS coordinates: -17.7833, 15.7667</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
