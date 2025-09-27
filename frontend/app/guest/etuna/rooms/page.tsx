/**
 * Etuna Rooms Page - Customer View
 * 
 * Comprehensive room browsing with image carousels, booking, and quote requests
 * Demonstrates Buffr Host platform capabilities for customer experience
 */

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Bed,
  Users,
  Wifi,
  Car,
  Coffee,
  Waves,
  Shield,
  Star,
  Heart,
  Utensils,
  Monitor,
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Plus,
  Minus,
  ShoppingCart,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import { useEtunaRooms } from '@/lib/hooks/useEtunaDemoApi';

export const metadata: Metadata = {
  title: 'Rooms & Suites - Etuna Guesthouse & Tours',
  description: 'Browse our comfortable rooms and suites. Book your stay with modern amenities and authentic Namibian hospitality.',
};

export default function EtunaRoomsPage() {
  // Use real API data
  const { data: apiRooms, loading, error } = useEtunaRooms();

  // Demo room data with comprehensive details (fallback)
  const fallbackRooms = [
    {
      id: 'room-001',
      name: 'Standard Room',
      type: 'Standard',
      description: 'Comfortable twin bed accommodation with all essential amenities for a pleasant stay.',
      price: 750,
      currency: 'NAD',
      size: '25 sqm',
      maxOccupancy: 2,
      bedType: 'Twin Beds',
      images: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611892440501-80a6f7044b70?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop'
      ],
      amenities: [
        'Air Conditioning',
        'Free WiFi',
        'Flat-screen TV with DSTV',
        'Refrigerator',
        'En-suite Bathroom',
        'Mosquito Net',
        'Daily Housekeeping'
      ],
      availability: 'available',
      rating: 4.5,
      reviews: 127,
      specialOffers: ['Free Airport Transfer', 'Welcome Drink']
    },
    {
      id: 'room-002',
      name: 'Executive Room',
      type: 'Executive',
      description: 'Spacious double bed room with working space, perfect for business travelers.',
      price: 1000,
      currency: 'NAD',
      size: '35 sqm',
      maxOccupancy: 2,
      bedType: 'Double Bed',
      images: [
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop'
      ],
      amenities: [
        'Air Conditioning',
        'Free WiFi',
        'Flat-screen TV with DSTV',
        'Refrigerator',
        'En-suite Bathroom',
        'Working Space',
        'Mosquito Net',
        'Daily Housekeeping'
      ],
      availability: 'available',
      rating: 4.7,
      reviews: 89,
      specialOffers: ['Free Airport Transfer', 'Welcome Drink', 'Business Center Access']
    },
    {
      id: 'room-003',
      name: 'Luxury Room',
      type: 'Luxury',
      description: 'Elegant double bed room with premium amenities and enhanced comfort.',
      price: 830,
      currency: 'NAD',
      size: '30 sqm',
      maxOccupancy: 2,
      bedType: 'Double Bed',
      images: [
        'https://images.unsplash.com/photo-1611892440501-80a6f7044b70?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop'
      ],
      amenities: [
        'Air Conditioning',
        'Free WiFi',
        'Flat-screen TV with DSTV',
        'Refrigerator',
        'En-suite Bathroom',
        'Working Space',
        'Mosquito Net',
        'Daily Housekeeping',
        'Premium Linens'
      ],
      availability: 'limited',
      rating: 4.6,
      reviews: 156,
      specialOffers: ['Free Airport Transfer', 'Welcome Drink']
    },
    {
      id: 'room-004',
      name: 'Family Suite',
      type: 'Family',
      description: 'Spacious two-room suite perfect for families, with shared bathroom and comfortable sleeping arrangements.',
      price: 1200,
      currency: 'NAD',
      size: '45 sqm',
      maxOccupancy: 4,
      bedType: 'Double + Twin Beds',
      images: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611892440501-80a6f7044b70?q=80&w=2070&auto=format&fit=crop'
      ],
      amenities: [
        'Air Conditioning',
        'Free WiFi',
        'Flat-screen TV with DSTV',
        'Refrigerator',
        'Shared Bathroom',
        'Mosquito Net',
        'Daily Housekeeping',
        'Extra Bed Available'
      ],
      availability: 'available',
      rating: 4.8,
      reviews: 78,
      specialOffers: ['Free Airport Transfer', 'Welcome Drink', 'Children Welcome']
    },
    {
      id: 'room-005',
      name: 'Premier Room',
      type: 'Premier',
      description: 'Our most luxurious accommodation with two bedrooms, lounge area, and private balcony.',
      price: 2000,
      currency: 'NAD',
      size: '65 sqm',
      maxOccupancy: 4,
      bedType: 'King + Queen Beds',
      images: [
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611892440501-80a6f7044b70?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop'
      ],
      amenities: [
        'Air Conditioning',
        'Free WiFi',
        'Flat-screen TV with DSTV',
        'Refrigerator',
        'Two En-suite Bathrooms',
        'Private Balcony',
        'Lounge Area',
        'Mosquito Net',
        'Daily Housekeeping',
        'Premium Linens',
        'Mini Bar'
      ],
      availability: 'available',
      rating: 4.9,
      reviews: 45,
      specialOffers: ['Free Airport Transfer', 'Welcome Drink', 'Concierge Service', 'Room Service']
    }
  ];

  // Transform API data to match the expected format
  const rooms = apiRooms ? apiRooms.map(room => ({
    id: `room-${room.room_type_id}`,
    name: room.type_name,
    type: room.type_class,
    description: room.description,
    price: room.base_price_per_night,
    currency: 'NAD',
    size: `${room.room_size_sqft} sqm`,
    maxOccupancy: room.max_occupancy,
    bedType: room.bed_type,
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611892440501-80a6f7044b70?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop'
    ],
    amenities: [
      'Air Conditioning',
      'Free WiFi',
      'Flat-screen TV with DSTV',
      'Refrigerator',
      'En-suite Bathroom',
      'Mosquito Net',
      'Daily Housekeeping'
    ],
    availability: 'available',
    rating: 4.5,
    reviews: 127,
    specialOffers: ['Free Airport Transfer', 'Welcome Drink']
  })) : fallbackRooms;

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'badge-success';
      case 'limited':
        return 'badge-warning';
      case 'unavailable':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-lg text-base-content/70">Loading rooms...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-error mb-2">Error Loading Rooms</h2>
          <p className="text-base-content/70 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-primary text-primary-content py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-4">
            <Link href="/guest/etuna" className="btn btn-ghost text-primary-content hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Etuna
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Our Rooms & Suites</h1>
            <p className="text-xl text-primary-content/80 max-w-3xl mx-auto">
              Experience comfort and authentic Namibian hospitality in our carefully designed accommodations
            </p>
          </div>
        </div>
      </div>

      {/* Quick Booking Bar */}
      <div className="bg-base-200 py-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Check Availability</span>
              </div>
              <input type="date" className="input input-bordered input-sm" />
              <input type="date" className="input input-bordered input-sm" />
              <select className="select select-bordered select-sm">
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3 Guests</option>
                <option>4+ Guests</option>
              </select>
            </div>
            <button className="btn btn-primary">
              <Bed className="w-4 h-4 mr-2" />
              Search Rooms
            </button>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="space-y-12">
          {rooms.map((room, index) => (
            <div key={room.id} className="card bg-base-100 shadow-xl">
              <div className="card-body p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Image Carousel */}
                  <div className="relative">
                    <div className="carousel w-full h-80">
                      {room.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="carousel-item w-full">
                          <Image
                            src={image}
                            alt={`${room.name} - Image ${imgIndex + 1}`}
                            width={800}
                            height={400}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {room.images.map((_, imgIndex) => (
                        <button key={imgIndex} className="btn btn-xs btn-circle bg-white/20 border-white/30">
                          {imgIndex + 1}
                        </button>
                      ))}
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className={`badge ${getAvailabilityColor(room.availability)}`}>
                        {room.availability.charAt(0).toUpperCase() + room.availability.slice(1)}
                      </div>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-base-content">{room.name}</h3>
                        <p className="text-base-content/70 mt-1">{room.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">
                          {room.currency} {room.price}
                          <span className="text-sm font-normal text-base-content/70">/night</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-semibold">{room.rating}</span>
                          <span className="text-sm text-base-content/70">({room.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>

                    {/* Room Specifications */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm">Max {room.maxOccupancy} guests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-primary" />
                        <span className="text-sm">{room.bedType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm">{room.size}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-primary" />
                        <span className="text-sm">Free WiFi</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.slice(0, 6).map((amenity, amenityIndex) => (
                          <div key={amenityIndex} className="badge badge-outline badge-sm">
                            {amenity}
                          </div>
                        ))}
                        {room.amenities.length > 6 && (
                          <div className="badge badge-outline badge-sm">
                            +{room.amenities.length - 6} more
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Special Offers */}
                    {room.specialOffers && room.specialOffers.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3">Special Offers</h4>
                        <div className="space-y-2">
                          {room.specialOffers.map((offer, offerIndex) => (
                            <div key={offerIndex} className="flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>{offer}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button className="btn btn-primary flex-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Now
                      </button>
                      <button className="btn btn-outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Request Quote
                      </button>
                      <button className="btn btn-ghost">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Assistance */}
      <div className="bg-base-200 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="text-base-content/70 mb-8 max-w-2xl mx-auto">
              Our friendly staff is here to help you find the perfect room for your stay. 
              Contact us for personalized recommendations and special requests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                <span className="font-medium">+264 65 231 177</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <span className="font-medium">bookings@etunaguesthouse.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Enhance Your Stay</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <Utensils className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="card-title justify-center">Restaurant</h3>
              <p className="text-base-content/70">Traditional Namibian cuisine and international dishes</p>
              <div className="card-actions justify-center">
                <Link href="/guest/etuna/menu" className="btn btn-primary btn-sm">
                  View Menu
                </Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <Car className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="card-title justify-center">Tours</h3>
              <p className="text-base-content/70">Cultural excursions and wildlife safaris</p>
              <div className="card-actions justify-center">
                <Link href="/guest/etuna/tours" className="btn btn-primary btn-sm">
                  Explore Tours
                </Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <Monitor className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="card-title justify-center">Conference</h3>
              <p className="text-base-content/70">Business meetings and events facilities</p>
              <div className="card-actions justify-center">
                <Link href="/guest/etuna/services" className="btn btn-primary btn-sm">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
