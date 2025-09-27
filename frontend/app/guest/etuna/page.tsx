import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Star, 
  Wifi, 
  Car, 
  Coffee, 
  Dumbbell, 
  Waves, 
  Utensils,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  Shield,
  Award,
  Heart,
  ArrowRight,
  CheckCircle,
  Monitor,
  MessageCircle,
  MapIcon,
  SparklesIcon
} from 'lucide-react';
import { etunaUnifiedData } from '@/lib/data/etuna-property-unified';
import EtunaMap from '@/components/EtunaMap';
import { useEtunaProperty, useEtunaRooms, useEtunaTransportationServices, useEtunaRecreationServices, useEtunaSpecializedServices } from '@/lib/hooks/useEtunaDemoApi';

export const metadata: Metadata = {
  title: 'Etuna Guesthouse & Tours - Your House Away From Home',
  description: 'Experience authentic Namibian hospitality at Etuna Guesthouse and Tours in Ongwediva. 35-room property with cultural excursions and guided tours.',
};

export default function EtunaGuestPage() {
  // Use real API data with fallback to static data
  const { data: apiProperty, loading: propertyLoading } = useEtunaProperty();
  const { data: apiRooms, loading: roomsLoading } = useEtunaRooms();
  const { data: apiTransportationServices, loading: transportationLoading } = useEtunaTransportationServices();
  const { data: apiRecreationServices, loading: recreationLoading } = useEtunaRecreationServices();
  const { data: apiSpecializedServices, loading: specializedLoading } = useEtunaSpecializedServices();

  // Use API data if available, otherwise fallback to static data
  const property = apiProperty || etunaUnifiedData.property;
  const businessInfo = etunaUnifiedData.businessInfo;
  const contactInfo = etunaUnifiedData.contactInfo;
  const mediaAssets = etunaUnifiedData.mediaAssets;
  const roomTypes = apiRooms || etunaUnifiedData.roomTypes;
  const transportationServices = apiTransportationServices || etunaUnifiedData.transportationServices;
  const recreationServices = apiRecreationServices || etunaUnifiedData.recreationServices;
  const specializedServices = apiSpecializedServices || etunaUnifiedData.specializedServices;

  // Show loading state if any critical data is still loading
  const isLoading = propertyLoading || roomsLoading;

  // Show loading spinner if data is still loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-lg text-base-content/70">Loading Etuna Guesthouse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
          alt={property.property_name}
          width={1200}
          height={500}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 nude-gradient-deep opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{property.property_name}</h1>
            <p className="text-xl md:text-2xl mb-6">Your House Away From Home - {property.property_type} property</p>
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="flex items-center">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <span className="ml-2 text-xl font-semibold">4.8</span>
                <span className="ml-2 text-lg">(127 reviews)</span>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5" />
                <span className="ml-2">Ongwediva, Namibia</span>
              </div>
            </div>
            <button className="nude-button btn-lg">
              Book Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* About Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Welcome to Etuna Guesthouse</h2>
              <p className="text-lg text-base-content/80 mb-6">Etuna means &quot;He is taking care of us&quot; in Oshiwambo, and we put this into practice by making our guests feel at home. We provide modern, comfortable rooms in midst of a tropical garden with lemon- and passion fruit trees as well as the famous Marula tree which is unique to Africa.</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-nude-700" />
                  <div>
                    <p className="font-semibold">Check-in: {property.check_in_time}</p>
                    <p className="text-sm text-nude-700">Check-out: {property.check_out_time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-nude-700" />
                  <div>
                    <p className="font-semibold">Capacity: {property.total_rooms}</p>
                    <p className="text-sm text-nude-700">guests</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <Link href="/guest/etuna/rooms" className="btn btn-primary">View Rooms</Link>
                <Link href="/guest/etuna/services" className="btn btn-outline">View Services</Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
                alt="Etuna Guesthouse Interior"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Award className="w-6 h-6 text-yellow-500" />
                  <div>
                    <p className="font-semibold">Best Guesthouse 2023</p>
                    <p className="text-sm text-nude-700">Tourism Board Award</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Amenities & Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Core Amenities */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-nude-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wifi className="w-8 h-8 text-nude-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Free WiFi</h3>
                <p className="text-sm text-nude-700">High-speed internet</p>
              </div>
            </div>
            
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-nude-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-nude-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Free Parking</h3>
                <p className="text-sm text-nude-700">Secure parking</p>
              </div>
            </div>
            
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-nude-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-8 h-8 text-nude-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 text-nude-800">Restaurant</h3>
                <p className="text-sm text-nude-700">Traditional Namibian cuisine</p>
              </div>
            </div>
            
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-nude-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Waves className="w-8 h-8 text-nude-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 text-nude-800">Swimming Pool</h3>
                <p className="text-sm text-nude-700">Outdoor pool</p>
              </div>
            </div>
            
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-nude-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-8 h-8 text-nude-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Conference Hall</h3>
                <p className="text-sm text-nude-700">Meeting facilities</p>
              </div>
            </div>
            
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-nude-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-nude-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">24/7 Security</h3>
                <p className="text-sm text-nude-700">Safe & secure</p>
              </div>
            </div>
            
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-nude-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-nude-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Concierge</h3>
                <p className="text-sm text-nude-700">Personal assistance</p>
              </div>
            </div>
            
            <div className="nude-card hover:shadow-nude transition-shadow">
                <div className="card-body text-center">
                <div className="w-16 h-16 bg-nude-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapIcon className="w-8 h-8 text-nude-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Tour Guide</h3>
                <p className="text-sm text-nude-700">Local expertise</p>
              </div>
                  </div>
            
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-nude-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-nude-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Airport Shuttle</h3>
                <p className="text-sm text-nude-700">Complimentary service</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Rooms</h2>
            <Link href="/guest/etuna/rooms" className="btn btn-outline">
              View All Rooms
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomTypes.map((room) => (
              <div key={room.room_type_id} className={`nude-card ${room.type_name === 'Premier Room' ? 'ring-2 ring-nude-500 ring-opacity-50' : ''}`}>
                <figure className="relative h-48">
                  <Image
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
                    alt={room.type_name}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`badge badge-lg ${room.type_name === 'Premier Room' ? 'charlotte-pillow-talk' : 'nude-button'}`}>
                      NAD {room.base_price_per_night}/night
                    </span>
                  </div>
                  {room.type_name === 'Premier Room' && (
                    <div className="absolute top-4 left-4">
                      <span className="badge badge-warning badge-lg">
                        <Star className="w-4 h-4 mr-1" />
                        Premium
                      </span>
                    </div>
                  )}
                </figure>
                <div className="card-body">
                  <h3 className="card-title">
                    {room.type_name}
                    {room.type_name === 'Premier Room' && (
                      <span className="badge badge-warning badge-sm ml-2">Luxury</span>
                    )}
                  </h3>
                  <p className="text-nude-700 mb-4">{room.description}</p>
                  {room.type_name === 'Premier Room' && (
                    <div className="alert alert-info mb-4">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">Our most luxurious accommodation with 2 bedrooms, lounge area, and private balcony</span>
                    </div>
                  )}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-nude-700" />
                      <span className="text-sm">Capacity: {room.max_occupancy} guests</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="badge badge-outline badge-sm">{room.type_class}</span>
                      <span className="badge badge-outline badge-sm">{room.bed_type}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <Link href="/guest/etuna/rooms" className={`btn btn-sm flex-1 ${room.type_name === 'Premier Room' ? 'charlotte-pillow-talk' : 'nude-button'}`}>
                      {room.type_name === 'Premier Room' ? 'Book Premium' : 'Book Now'}
                    </Link>
                    <Link href="/guest/etuna/rooms" className="btn btn-outline btn-sm">View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Premier Room Section */}
        <div className="mb-16">
          <div className="card bg-gradient-to-r from-primary to-secondary text-nude-700-content shadow-2xl">
            <div className="card-body">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-8 h-8 text-warning fill-current" />
                    <h2 className="text-3xl font-bold">Premier Room</h2>
                    <span className="badge badge-warning badge-lg">Luxury</span>
                  </div>
                  <p className="text-lg mb-6 text-nude-700-content/90">
                    Experience our most luxurious accommodation - the Premier Room. This spacious suite features 
                    2 separate bedrooms, a private lounge area, 2 full bathrooms, and a private balcony with 
                    garden views. Perfect for families or guests seeking the ultimate in comfort and space.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span>Up to 4 guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      <span>2 bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Waves className="w-5 h-5" />
                      <span>2 bathrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      <span>Private balcony</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold">NAD 2,000/night</span>
                    <Link href="/guest/etuna/rooms" className="btn btn-accent btn-lg">
                      Book Premier Room
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <Image
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
                    alt="Premier Room Interior"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-xl"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-2">
                      <Award className="w-6 h-6 text-yellow-500" />
                      <div>
                        <p className="font-semibold text-sm">Most Popular</p>
                        <p className="text-xs text-nude-700">Luxury Choice</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tours & Services Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Tours & Services</h2>
            <Link href="/guest/etuna/services" className="btn btn-outline">
              View All Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Transportation Services */}
            {transportationServices.filter(service => service.service_name !== 'Airport Shuttle').slice(0, 2).map((service) => (
              <div key={service.service_id} className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title">{service.service_name}</h3>
                  <p className="text-nude-700 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-2xl font-bold text-nude-700">
                        {service.base_price === 0 ? 'Free' : `NAD ${service.base_price}`}
                      </span>
                      {service.duration_minutes && (
                        <span className="text-sm text-nude-700 ml-2">({Math.round(service.duration_minutes / 60)} hours)</span>
                      )}
                    </div>
                    <span className="badge badge-primary">{service.service_type}</span>
                  </div>
                  <Link href="/guest/etuna/services" className="btn btn-primary btn-sm w-full">Book Service</Link>
                </div>
              </div>
            ))}
            
            {/* Recreation Services */}
            {recreationServices.slice(0, 1).map((service) => (
              <div key={service.recreation_id} className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title">{service.service_name}</h3>
                  <p className="text-nude-700 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-2xl font-bold text-nude-700">
                        {service.base_price === 0 ? 'Free' : `NAD ${service.base_price}`}
                      </span>
                      {service.duration_minutes && (
                        <span className="text-sm text-nude-700 ml-2">({Math.round(service.duration_minutes / 60)} hours)</span>
                      )}
                    </div>
                    <span className="badge badge-secondary">{service.service_type}</span>
                  </div>
                  <Link href="/guest/etuna/services" className="btn btn-primary btn-sm w-full">Book Service</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant & Map Section */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Get Help & Find Us</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* AI Assistant Card */}
              <div className="card bg-gradient-to-br from-primary to-secondary text-nude-700-content shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <SparklesIcon className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">AI Assistant</h3>
                      <p className="text-nude-700-content/80">24/7 AI-powered concierge service</p>
                    </div>
                  </div>
                  <p className="text-nude-700-content/90 mb-6">
                    Get instant help with bookings, local information, restaurant recommendations, 
                    tour bookings, and any questions about your stay. Our AI assistant is always available.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Book rooms and services</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Local attraction recommendations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Restaurant menu assistance</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Tour information and booking</span>
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-6">
                    <Link href="/guest/etuna/ai-assistant-new" className="btn btn-accent">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat with AI Assistant
                    </Link>
                  </div>
                </div>
              </div>

              {/* Map Card */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-primary text-nude-700-content flex items-center justify-center">
                        <MapIcon className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Find Us</h3>
                      <p className="text-nude-700">Interactive map with directions</p>
                    </div>
                  </div>
                  <p className="text-base-content/80 mb-6">
                    Located in the heart of Ongwediva, we&apos;re easily accessible from the airport 
                    and major attractions. Get turn-by-turn directions and explore the area.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-nude-700" />
                      <span>5544 Valley Street, Ongwediva</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="w-4 h-4 text-nude-700" />
                      <span>15 minutes from Ondangwa Airport</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-nude-700" />
                      <span>24/7 Front Desk</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-nude-700" />
                      <span>Free parking available</span>
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-6">
                    <Link href="/guest/etuna/map" className="btn btn-primary">
                      <MapIcon className="w-4 h-4 mr-2" />
                      View Map & Directions
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Map Section */}
        <div className="py-16 bg-base-200">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Location & Directions</h2>
            <EtunaMap showDirections={true} height="500px" />
          </div>
        </div>

        {/* Contact Section */}
        <div className="card bg-primary text-nude-700-content shadow-xl">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Phone className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Call Us</h3>
                <p className="text-nude-700-content/80">{property.phone}</p>
                <p className="text-sm text-nude-700-content/70 mt-1">Emergency: {contactInfo.emergencyPhone}</p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Email Us</h3>
                <p className="text-nude-700-content/80">{property.email}</p>
              </div>
              <div className="text-center">
                <Globe className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Visit Our Website</h3>
                <p className="text-nude-700-content/80">{property.website}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
