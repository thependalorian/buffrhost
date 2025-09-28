import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Truck,
  User,
  Building,
  Home,
  Star
} from 'lucide-react';
/**
 * Etuna Map Page
 * 
 * Dedicated page for location, directions, and interactive map
 * Includes comprehensive travel information and local attractions
 */

// import EtunaMap from '@/components/EtunaMap';

export const metadata: Metadata = {
  title: 'Etuna Guesthouse Location & Directions - Find Us',
  description: 'Find Etuna Guesthouse & Tours in Ongwediva, Namibia. Interactive map, directions from airport, and local attractions.',
};

export default function EtunaMapPage() {
  const localAttractions = [
    {
      name: 'Ongwediva Trade Fair',
      distance: '100 meters',
      description: 'Annual trade fair showcasing local crafts and culture',
      type: 'Cultural'
    },
    {
      name: 'Ondangwa Airport',
      distance: '15 km',
      description: 'Nearest airport with domestic and international flights',
      type: 'Transport'
    },
    {
      name: 'Oshakati Town Center',
      distance: '25 km',
      description: 'Regional shopping and business center',
      type: 'Shopping'
    },
    {
      name: 'Etosha National Park',
      distance: '180 km',
      description: 'World-famous wildlife sanctuary',
      type: 'Nature'
    }
  ];

  const transportationOptions = [
    {
      name: 'Airport Shuttle',
      description: 'Complimentary shuttle service to/from Ondangwa Airport',
      availability: '24/7 (advance booking required)',
      contact: '+264 65 231 177'
    },
    {
      name: 'Taxi Service',
      description: 'Local taxi service available 24/7',
      availability: '24/7',
      contact: 'Ask front desk for assistance'
    },
    {
      name: 'Car Rental',
      description: 'Car rental services available through our partners',
      availability: 'Business hours',
      contact: 'Ask front desk for assistance'
    },
    {
      name: 'Public Transport',
      description: 'Bus and minibus services to nearby towns',
      availability: 'Daily services',
      contact: 'Ask front desk for schedules'
    }
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-primary text-primary-content">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/guest/etuna" 
                className="btn btn-ghost btn-sm text-primary-content hover:bg-primary-content/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Etuna
              </Link>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <MapPin className="w-8 h-8" />
                  Location & Directions
                </h1>
                <p className="text-primary-content/80 mt-2">
                  Find Etuna Guesthouse & Tours in Ongwediva, Namibia
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Open 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Map */}
          <div className="lg:col-span-2">
            <div className="bg-gray-200 rounded-lg flex items-center justify-center h-[600px]">
              <div className="text-center">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-lg font-semibold text-gray-700">Interactive Map</h3>
                <p className="text-gray-500">Map component would be integrated here</p>
              </div>
            </div>
          </div>

          {/* Information Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Contact Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-semibold">Address</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        5544 Valley Street<br />
                        Ongwediva, Namibia
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-semibold">Phone</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        +264 65 231 177
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-semibold">Hours</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        24/7 Front Desk
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transportation Options */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Transportation</h3>
                <div className="space-y-3">
                  {transportationOptions.map((option, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                      <div className="font-semibold text-sm">{option.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {option.description}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {option.availability}
                      </div>
                      <div className="text-xs text-primary">
                        {option.contact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Local Attractions */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Nearby Attractions</h3>
                <div className="space-y-3">
                  {localAttractions.map((attraction, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{attraction.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {attraction.description}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {attraction.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {attraction.distance}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-primary text-primary-content shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Quick Actions</h3>
                <div className="space-y-2">
                  <Link 
                    href="/guest/etuna/ai-assistant" 
                    className="btn btn-accent btn-sm w-full"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Ask AI Assistant
                  </Link>
                  <Link 
                    href="/guest/etuna" 
                    className="btn btn-outline btn-sm w-full"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Back to Etuna
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Travel Tips */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Travel Tips</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Truck className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <div className="font-semibold">Driving</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Free parking available on-site. GPS coordinates: -17.7833, 15.7667
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <div className="font-semibold">Walking</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Safe to walk around the area. Main attractions within 2km radius.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <div className="font-semibold">Public Transport</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Bus stops nearby. Ask front desk for current schedules and routes.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather & Best Time to Visit */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Best Time to Visit</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold">Dry Season (May - October)</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Best weather for outdoor activities and wildlife viewing
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Wet Season (November - April)</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Lush landscapes and bird watching opportunities
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Temperature</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Average 20-30°C year-round. Cooler nights in winter.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
