'use client';

import { Metadata } from "next";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ActionButton,
  ModalForm,
  FormField,
  FormSelect,
  FormTextarea,
  Alert,
  PageHeader,
} from "@/src/components/ui";
import {
  Tent,
  Shirt,
  Monitor,
  Car,
  Wifi,
  Coffee,
  Utensils,
  Waves,
  Shield,
  Clock,
  Users,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  ArrowRight,
  Calendar,
  DollarSign,
  Heart,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
/**
 * Etuna Services Page - Customer View
 *
 * Comprehensive services showcase including camping, laundry, conference facilities
 * Demonstrates Buffr Host platform capabilities for service management
 */


import Link from "next/link";

// Metadata moved to layout or removed for client component

export default function EtunaServicesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("etuna-favorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: Set<string>) => {
    localStorage.setItem("etuna-favorites", JSON.stringify([...newFavorites]));
    setFavorites(newFavorites);
  };

  // Toggle favorite
  const toggleFavorite = (serviceId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(serviceId)) {
      newFavorites.delete(serviceId);
    } else {
      newFavorites.add(serviceId);
    }
    saveFavorites(newFavorites);

    // Send to AI recommendation engine
    sendRecommendationData(serviceId, newFavorites.has(serviceId));
  };

  // Send data to AI recommendation engine
  const sendRecommendationData = async (
    serviceId: string,
    isFavorite: boolean,
  ) => {
    try {
      await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "guest",
          itemId: serviceId,
          itemType: "service",
          action: isFavorite ? "like" : "unlike",
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.log("Recommendation data sent to AI engine");
    }
  };

  // Handle booking
  const handleBookNow = (service: any) => {
    router.push(
      `/guest/etuna/checkout?type=service&id=${
        service.id
      }&name=${encodeURIComponent(service.name)}&price=${service.price}`,
    );
  };

  // Handle inquiry
  const handleInquire = (service: any) => {
    setSelectedService(service);
    setShowInquiryModal(true);
  };

  // Comprehensive services data
  const services = [
    {
      id: "service-001",
      name: "Camping Facilities",
      category: "Accommodation",
      description:
        "Experience the great outdoors with our well-equipped camping facilities. Perfect for adventure seekers and nature lovers.",
      price: 200,
      currency: "NAD",
      perUnit: "per person per night",
      image:
        "https://images.unsplash.com/photo-1551524164-6cf2ac5313f7?q=80&w=2070&auto=format&fit=crop",
      availability: "available",
      capacity: "Up to 20 people",
      amenities: [
        "Tent rental available",
        "Shared bathroom facilities",
        "Cooking area with braai",
        "Safe parking",
        "24/7 security",
        "Water and electricity",
      ],
      features: [
        "Fire pit and braai area",
        "Communal kitchen",
        "Washing facilities",
        "Storage lockers",
        "Tourist information",
      ],
      rating: 4.6,
      reviews: 89,
      popular: true,
    },
    {
      id: "service-002",
      name: "Laundry Service",
      category: "Housekeeping",
      description:
        "Professional laundry and dry cleaning services for all your clothing needs during your stay.",
      price: 50,
      currency: "NAD",
      perUnit: "per item",
      image:
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=2070&auto=format&fit=crop",
      availability: "available",
      capacity: "Unlimited items",
      amenities: [
        "Same-day service available",
        "Professional cleaning",
        "Dry cleaning",
        "Ironing service",
        "Express service",
        "Pick-up and delivery",
      ],
      features: [
        "24-hour turnaround",
        "Eco-friendly detergents",
        "Delicate fabric care",
        "Stain removal",
        "Garment pressing",
      ],
      rating: 4.8,
      reviews: 156,
      popular: true,
    },
    {
      id: "service-003",
      name: "Conference Facility",
      category: "Business",
      description:
        "Professional conference hall for meetings, trainings, seminars, and corporate events with modern amenities.",
      price: 1500,
      currency: "NAD",
      perUnit: "per day",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
      availability: "available",
      capacity: "60-80 people",
      amenities: [
        "Audio-visual equipment",
        "High-speed WiFi",
        "Air conditioning",
        "Projector and screen",
        "Whiteboard",
        "Catering available",
      ],
      features: [
        "Flexible seating arrangements",
        "Break-out rooms",
        "Coffee and tea service",
        "Lunch catering",
        "Technical support",
        "Parking for attendees",
      ],
      rating: 4.7,
      reviews: 45,
      popular: false,
    },
    {
      id: "service-004",
      name: "Airport Transfer",
      category: "Transportation",
      description:
        "Convenient airport pickup and drop-off service to and from Ondangwa Airport.",
      price: 300,
      currency: "NAD",
      perUnit: "per trip",
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop",
      availability: "available",
      capacity: "Up to 4 passengers",
      amenities: [
        "Professional driver",
        "Air-conditioned vehicle",
        "Flight tracking",
        "Meet and greet service",
        "Luggage assistance",
        "Flexible timing",
      ],
      features: [
        "24/7 availability",
        "Child safety seats",
        "WiFi in vehicle",
        "Bottled water",
        "Tourist information",
        "Local recommendations",
      ],
      rating: 4.9,
      reviews: 234,
      popular: true,
    },
    {
      id: "service-005",
      name: "Swimming Pool",
      category: "Recreation",
      description:
        "Relax and unwind in our clean, well-maintained swimming pool with comfortable seating areas.",
      price: 0,
      currency: "NAD",
      perUnit: "complimentary",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2070&auto=format&fit=crop",
      availability: "available",
      capacity: "Unlimited guests",
      amenities: [
        "Pool towels provided",
        "Sun loungers",
        "Poolside bar service",
        "Shower facilities",
        "Safety equipment",
        "Pool maintenance",
      ],
      features: [
        "6:00 AM - 10:00 PM daily",
        "Poolside dining",
        "Children's area",
        "Pool games available",
        "Swimming lessons",
        "Pool parties welcome",
      ],
      rating: 4.5,
      reviews: 178,
      popular: true,
    },
    {
      id: "service-006",
      name: "Private Bar",
      category: "Entertainment",
      description:
        "Exclusive bar service for private events, celebrations, and special occasions.",
      price: 800,
      currency: "NAD",
      perUnit: "per event",
      image:
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2070&auto=format&fit=crop",
      availability: "available",
      capacity: "Up to 50 people",
      amenities: [
        "Full bar service",
        "Professional bartender",
        "Premium beverages",
        "Cocktail menu",
        "Snacks and appetizers",
        "Music system",
      ],
      features: [
        "Custom cocktail creation",
        "Wine selection",
        "Beer on tap",
        "Non-alcoholic options",
        "Event planning",
        "Decorations available",
      ],
      rating: 4.8,
      reviews: 67,
      popular: false,
    },
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "badge-success";
      case "limited":
        return "badge-warning";
      case "unavailable":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case "available":
        return <CheckCircle className="w-4 h-4" />;
      case "limited":
        return <Clock className="w-4 h-4" />;
      case "unavailable":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const categories = [
    { id: "all", name: "All Services", icon: Star },
    { id: "Accommodation", name: "Accommodation", icon: Tent },
    { id: "Housekeeping", name: "Housekeeping", icon: Shirt },
    { id: "Business", name: "Business", icon: Monitor },
    { id: "Transportation", name: "Transportation", icon: Car },
    { id: "Recreation", name: "Recreation", icon: Waves },
    { id: "Entertainment", name: "Entertainment", icon: Coffee },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-primary text-primary-content py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-4">
            <Link
              href="/guest/etuna"
              className="btn btn-ghost text-primary-content hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Etuna
            </Link>
          </div>
          <PageHeader
            title="Services & Facilities"
            description="Discover our comprehensive range of services designed to make your stay comfortable and memorable"
            className="text-center text-primary-content"
          />
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-base-200 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button key={category.id} className="btn btn-sm btn-outline">
                <category.icon className="w-4 h-4 mr-1" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="card bg-base-100 shadow-xl">
              <figure className="h-64 relative">
                <Image
                  src={service.image}
                  alt={service.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  {service.popular && (
                    <div className="badge badge-warning">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </div>
                  )}
                  <div
                    className={`badge ${getAvailabilityColor(
                      service.availability,
                    )} gap-1`}
                  >
                    {getAvailabilityIcon(service.availability)}
                    {service.availability.charAt(0).toUpperCase() +
                      service.availability.slice(1)}
                  </div>
                </div>
              </figure>

              <div className="card-body">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="card-title text-xl">{service.name}</h3>
                  <div className="text-right">
                    {service.price === 0 ? (
                      <div className="text-2xl font-bold text-green-600">
                        Free
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-primary">
                        {service.currency} {service.price}
                        <span className="text-sm font-normal text-base-content/70">
                          /{service.perUnit}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-base-content/70 mb-4">
                  {service.description}
                </p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">
                      {service.rating}
                    </span>
                    <span className="text-xs text-base-content/70">
                      ({service.reviews})
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-base-content/50" />
                    <span className="text-sm">{service.capacity}</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {service.amenities.slice(0, 4).map((amenity, index) => (
                      <div key={index} className="badge badge-outline badge-sm">
                        {amenity}
                      </div>
                    ))}
                    {service.amenities.length > 4 && (
                      <div className="badge badge-outline badge-sm">
                        +{service.amenities.length - 4} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="card-actions justify-between">
                  <button
                    onClick={() => handleBookNow(service)}
                    className="btn btn-primary"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now
                  </button>
                  <button
                    onClick={() => handleInquire(service)}
                    className="btn btn-outline"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Inquire
                  </button>
                  <button
                    onClick={() => toggleFavorite(service.id)}
                    className={`btn btn-ghost ${
                      favorites.has(service.id) ? "text-red-500" : ""
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.has(service.id) ? "fill-current" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-base-200 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="card-title justify-center">24/7 Security</h3>
                <p className="text-base-content/70">
                  Round-the-clock security for your peace of mind
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <Wifi className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="card-title justify-center">Free WiFi</h3>
                <p className="text-base-content/70">
                  High-speed internet throughout the property
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <Utensils className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="card-title justify-center">Room Service</h3>
                <p className="text-base-content/70">
                  24/7 room service for your convenience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Need More Information?</h2>
          <p className="text-base-content/70 mb-8 max-w-2xl mx-auto">
            Our friendly staff is here to help you with service bookings,
            special requests, and any questions you may have.
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

      {/* Inquiry Modal */}
      {showInquiryModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              Inquire about {selectedService.name}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Inquiry submitted! We'll contact you soon.");
                setShowInquiryModal(false);
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <input type="tel" className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Preferred Date
                  </label>
                  <input type="date" className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Service Details
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    rows={3}
                    placeholder="Tell us more about your needs..."
                  ></textarea>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn btn-primary flex-1">
                  Send Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setShowInquiryModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
