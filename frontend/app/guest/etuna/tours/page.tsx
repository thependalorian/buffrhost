/**
 * Etuna Tours Page - Enhanced Customer View
 * 
 * Comprehensive tours showcase with booking, checkout, and detailed information
 * Demonstrates Buffr Host platform capabilities for tour management
 */

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Camera,
  Mountain,
  TreePine,
  Building,
  Heart,
  Compass,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  CheckCircle,
  ArrowRight,
  Plus,
  Minus,
  ShoppingCart,
  MessageCircle,
  Shield,
  Wifi,
  Car,
  Utensils,
  ArrowLeft
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tours & Excursions - Etuna Guesthouse & Tours',
  description: 'Discover Namibia\'s North with our guided tours including Etosha National Park, Ruacana Falls, and cultural experiences.',
};

export default function EtunaToursPage() {
  // Comprehensive tours data with booking information
  const tours = [
    {
      id: 'tour-001',
      name: 'Etosha National Park Safari',
      category: 'Wildlife',
      description: 'Full-day safari to Namibia\'s premier wildlife destination. Experience the Big Five and incredible wildlife viewing opportunities.',
      price: 1200,
      currency: 'NAD',
      duration: 'Full Day (8 hours)',
      maxParticipants: 8,
      difficulty: 'Easy',
      rating: 4.9,
      reviews: 156,
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544966503-7cc4bb7b5b3c?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop'
      ],
      includes: [
        'Professional guide',
        'Transportation',
        'Park entrance fees',
        'Lunch and refreshments',
        'Binoculars provided',
        'Photography assistance'
      ],
      highlights: [
        'Elephant herds at waterholes',
        'Lion sightings',
        'Rhino conservation areas',
        'Bird watching opportunities',
        'Landscape photography',
        'Sunset viewing'
      ],
      departureTime: '06:00',
      returnTime: '18:00',
      availability: 'available',
      popular: true,
      specialOffers: ['Early Bird Discount', 'Group Discounts Available']
    },
    {
      id: 'tour-002',
      name: 'Ruacana Falls Tour',
      category: 'Nature',
      description: 'Half-day tour to the spectacular Ruacana Falls. Experience the power of nature and learn about local hydroelectric power.',
      price: 800,
      currency: 'NAD',
      duration: 'Half Day (4 hours)',
      maxParticipants: 6,
      difficulty: 'Easy',
      rating: 4.7,
      reviews: 89,
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2070&auto=format&fit=crop'
      ],
      includes: [
        'Professional guide',
        'Transportation',
        'Entrance fees',
        'Refreshments',
        'Photography stops',
        'Local history insights'
      ],
      highlights: [
        'Spectacular waterfall views',
        'Hydroelectric power plant tour',
        'Local cultural insights',
        'Photography opportunities',
        'Nature walk',
        'Scenic viewpoints'
      ],
      departureTime: '09:00',
      returnTime: '13:00',
      availability: 'available',
      popular: true,
      specialOffers: ['Family Package Available']
    },
    {
      id: 'tour-003',
      name: 'Omhedi Palace Tour',
      category: 'Cultural',
      description: 'Explore the historic Omhedi Palace and learn about Ovambo royal history and traditional architecture.',
      price: 600,
      currency: 'NAD',
      duration: 'Half Day (4 hours)',
      maxParticipants: 10,
      difficulty: 'Easy',
      rating: 4.6,
      reviews: 67,
      images: [
        'https://images.unsplash.com/photo-1544966503-7cc4bb7b5b3c?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop'
      ],
      includes: [
        'Cultural guide',
        'Transportation',
        'Entrance fees',
        'Traditional refreshments',
        'Cultural storytelling',
        'Photography opportunities'
      ],
      highlights: [
        'Historic palace architecture',
        'Royal history insights',
        'Traditional ceremonies',
        'Cultural artifacts',
        'Local community interaction',
        'Traditional music'
      ],
      departureTime: '10:00',
      returnTime: '14:00',
      availability: 'available',
      popular: false,
      specialOffers: ['Cultural Experience Package']
    },
    {
      id: 'tour-004',
      name: 'Baobab Tree Heritage Tour',
      category: 'Cultural',
      description: 'Explore the ancient baobab trees and learn about their cultural significance in Ovambo heritage.',
      price: 400,
      currency: 'NAD',
      duration: 'Half Day (4 hours)',
      maxParticipants: 8,
      difficulty: 'Easy',
      rating: 4.5,
      reviews: 45,
      images: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611892440501-80a6f7044b70?q=80&w=2070&auto=format&fit=crop'
      ],
      includes: [
        'Cultural guide',
        'Transportation',
        'Traditional refreshments',
        'Cultural storytelling',
        'Photography opportunities',
        'Local community insights'
      ],
      highlights: [
        'Ancient baobab trees',
        'Traditional Ovambo heritage',
        'Cultural significance',
        'Photography opportunities',
        'Local community insights',
        'Traditional knowledge'
      ],
      departureTime: '09:00',
      returnTime: '13:00',
      availability: 'available',
      popular: false,
      specialOffers: ['Heritage Experience']
    },
    {
      id: 'tour-005',
      name: 'Himba Tribes Experience',
      category: 'Cultural',
      description: 'Full-day cultural immersion with the Himba people. Learn about their traditional way of life and customs.',
      price: 1500,
      currency: 'NAD',
      duration: 'Full Day (8 hours)',
      maxParticipants: 6,
      difficulty: 'Moderate',
      rating: 4.8,
      reviews: 34,
      images: [
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop'
      ],
      includes: [
        'Cultural guide',
        'Transportation',
        'Traditional meals',
        'Cultural activities',
        'Photography opportunities',
        'Cultural gifts'
      ],
      highlights: [
        'Traditional Himba village',
        'Cultural ceremonies',
        'Traditional crafts',
        'Local cuisine',
        'Photography opportunities',
        'Cultural exchange'
      ],
      departureTime: '07:00',
      returnTime: '19:00',
      availability: 'limited',
      popular: true,
      specialOffers: ['Authentic Cultural Experience']
    },
    {
      id: 'tour-006',
      name: 'Sossusvlei Dunes Tour',
      category: 'Adventure',
      description: 'Two-day adventure to the iconic red sand dunes of Sossusvlei. Experience the world\'s highest sand dunes.',
      price: 1800,
      currency: 'NAD',
      duration: '2 Days',
      maxParticipants: 6,
      difficulty: 'Moderate',
      rating: 4.9,
      reviews: 23,
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2070&auto=format&fit=crop'
      ],
      includes: [
        'Professional guide',
        'Transportation',
        'Accommodation',
        'All meals',
        'Park entrance fees',
        'Photography assistance'
      ],
      highlights: [
        'Dune 45 sunrise climb',
        'Dead Vlei photography',
        'Sesriem Canyon',
        'Desert wildlife',
        'Stargazing',
        'Desert camping'
      ],
      departureTime: '06:00',
      returnTime: '18:00 (Day 2)',
      availability: 'available',
      popular: true,
      specialOffers: ['Adventure Package', 'Photography Workshop']
    }
  ];

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'badge-success';
      case 'Moderate':
        return 'badge-warning';
      case 'Hard':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const categories = [
    { id: 'all', name: 'All Tours', icon: Compass },
    { id: 'Wildlife', name: 'Wildlife', icon: Mountain },
    { id: 'Nature', name: 'Nature', icon: TreePine },
    { id: 'Cultural', name: 'Cultural', icon: Building },
    { id: 'Adventure', name: 'Adventure', icon: Camera }
  ];

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
            <h1 className="text-4xl font-bold mb-4">Tours & Excursions</h1>
            <p className="text-xl text-primary-content/80 max-w-3xl mx-auto">
              Discover the beauty of Namibia&apos;s North with our guided tours and authentic cultural experiences
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-base-200 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                className="btn btn-sm btn-outline"
              >
                <category.icon className="w-4 h-4 mr-1" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="space-y-12">
          {tours.map((tour, index) => (
            <div key={tour.id} className="card bg-base-100 shadow-xl">
              <div className="card-body p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Image Carousel */}
                  <div className="relative">
                    <div className="carousel w-full h-80">
                      {tour.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="carousel-item w-full">
                          <Image
                            src={image}
                            alt={`${tour.name} - Image ${imgIndex + 1}`}
                            width={800}
                            height={400}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {tour.images.map((_, imgIndex) => (
                        <button key={imgIndex} className="btn btn-xs btn-circle bg-white/20 border-white/30">
                          {imgIndex + 1}
                        </button>
                      ))}
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      {tour.popular && (
                        <div className="badge badge-warning">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </div>
                      )}
                      <div className={`badge ${getAvailabilityColor(tour.availability)}`}>
                        {tour.availability.charAt(0).toUpperCase() + tour.availability.slice(1)}
                      </div>
                    </div>
                  </div>

                  {/* Tour Details */}
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-base-content">{tour.name}</h3>
                        <p className="text-base-content/70 mt-1">{tour.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">
                          {tour.currency} {tour.price}
                          <span className="text-sm font-normal text-base-content/70">/person</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-semibold">{tour.rating}</span>
                          <span className="text-sm text-base-content/70">({tour.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>

                    {/* Tour Specifications */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm">{tour.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm">Max {tour.maxParticipants} people</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm">{tour.departureTime} - {tour.returnTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`badge ${getDifficultyColor(tour.difficulty)} badge-sm`}>
                          {tour.difficulty}
                        </div>
                      </div>
                    </div>

                    {/* Includes */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">What&apos;s Included:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {tour.includes.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Special Offers */}
                    {tour.specialOffers && tour.specialOffers.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3">Special Offers:</h4>
                        <div className="space-y-2">
                          {tour.specialOffers.map((offer, offerIndex) => (
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
                        Inquire
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

      {/* Tour Highlights Section */}
      <div className="bg-base-200 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Our Tours?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="card-title justify-center">Safe & Secure</h3>
                <p className="text-base-content/70">Fully insured tours with experienced guides</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="card-title justify-center">Small Groups</h3>
                <p className="text-base-content/70">Intimate experiences with maximum 10 people</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <Camera className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="card-title justify-center">Photography</h3>
                <p className="text-base-content/70">Perfect opportunities for stunning photos</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <Utensils className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="card-title justify-center">Local Cuisine</h3>
                <p className="text-base-content/70">Authentic Namibian meals included</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-base-content/70 mb-8 max-w-2xl mx-auto">
            Book your adventure today or contact us for personalized tour recommendations. 
            Our expert guides are ready to show you the best of Namibia.
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
  );
}