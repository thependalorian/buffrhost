"use client";

import Image from "next/image";
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
  Users,
  Calendar,
  TrendingUp,
  Award,
  Shield,
  Monitor,
} from "lucide-react";
import { etunaUnifiedData } from "@/lib/data/etuna-property-unified";
import { StatCard, PageHeader } from "@/src/components/ui";

export default function EtunaPropertyPage() {
  const property = etunaUnifiedData.property;
  const businessInfo = etunaUnifiedData.businessInfo;
  const contactInfo = etunaUnifiedData.contactInfo;
  const mediaAssets = etunaUnifiedData.mediaAssets;
  const roomTypes = etunaUnifiedData.roomTypes;

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title={property.property_name}
        description={`Your House Away From Home - mixed property`}
      />

      {/* Hero Section */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <figure className="relative h-96">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
            alt={property.property_name}
            width={1200}
            height={400}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-2xl font-bold mb-2">
              {property.property_name}
            </h2>
            <p className="text-lg opacity-90">
              Your House Away From Home - Etuna means &quot;He is taking care of
              us&quot; in Oshiwambo
            </p>
          </div>
        </figure>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Users className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Capacity</div>
            <div className="stat-value text-primary">
              35
            </div>
            <div className="stat-desc">guests</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="stat-title">Established</div>
            <div className="stat-value text-secondary">2006</div>
            <div className="stat-desc">years in business</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-accent">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="stat-title">Rating</div>
            <div className="stat-value text-accent">4.8</div>
            <div className="stat-desc">out of 5 stars</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-info">
              <Award className="w-8 h-8" />
            </div>
            <div className="stat-title">Awards</div>
            <div className="stat-value text-info">3</div>
            <div className="stat-desc">industry awards</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-sm text-base-content/70">
                      {String(property.address)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-sm text-base-content/70">
                      {property.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-base-content/70">
                      {property.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Website</p>
                    <p className="text-sm text-base-content/70">
                      {property.website}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Amenities & Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["wifi", "parking", "restaurant", "bar", "conference", "spa"].map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {amenity === "wifi" && (
                        <Wifi className="w-4 h-4 text-primary" />
                      )}
                      {amenity === "parking" && (
                        <Car className="w-4 h-4 text-primary" />
                      )}
                      {amenity === "restaurant" && (
                        <Utensils className="w-4 h-4 text-primary" />
                      )}
                      {amenity === "pool" && (
                        <Waves className="w-4 h-4 text-primary" />
                      )}
                      {amenity === "gym" && (
                        <Dumbbell className="w-4 h-4 text-primary" />
                      )}
                      {amenity === "business_center" && (
                        <Monitor className="w-4 h-4 text-primary" />
                      )}
                      {amenity === "security" && (
                        <Shield className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm capitalize">
                        {amenity.replace("_", " ")}
                      </p>
                      <p className="text-xs text-base-content/70">Available</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rooms Overview */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Room Types</h3>
              <div className="space-y-4">
                <div className="border border-base-300 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Standard Rooms</h4>
                    <span className="text-lg font-bold text-primary">
                      NAD 750/night
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70 mb-2">
                    Twin beds, shower, flats screen television with DSTV, fridge
                    and mosquito net
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>Capacity: 2 adults, 0 children</span>
                    <span className="badge badge-primary badge-sm">
                      Standard
                    </span>
                  </div>
                </div>
                <div className="border border-base-300 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Executive Rooms</h4>
                    <span className="text-lg font-bold text-primary">
                      NAD 900/night
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70 mb-2">
                    Great attention to every detail to make the room as
                    comfortable and relaxing as possible
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>Capacity: 2 adults, 0 children</span>
                    <span className="badge badge-primary badge-sm">
                      Executive
                    </span>
                  </div>
                </div>
                <div className="border border-base-300 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Luxury Rooms</h4>
                    <span className="text-lg font-bold text-primary">
                      NAD 1,800/night
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70 mb-2">
                    Double bed, shower, fridge, working space, mosquito net and
                    WiFi
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>Capacity: 2 adults, 0 children</span>
                    <span className="badge badge-primary badge-sm">Luxury</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Quick Actions</h3>
              <div className="space-y-2">
                <button className="btn btn-primary btn-sm w-full">
                  View Bookings
                </button>
                <button className="btn btn-secondary btn-sm w-full">
                  Manage Rooms
                </button>
                <button className="btn btn-accent btn-sm w-full">
                  Update Information
                </button>
                <button className="btn btn-outline btn-sm w-full">
                  View Analytics
                </button>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Property Policies</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold">Check-in/Check-out</p>
                  <p className="text-base-content/70">
                    Check-in: 14:00 | Check-out: 10:00
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Cancellation</p>
                  <p className="text-base-content/70">
                    Cancellation and prepayment policies vary according to room
                    type
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Pets</p>
                  <p className="text-base-content/70">Not allowed</p>
                </div>
                <div>
                  <p className="font-semibold">Smoking</p>
                  <p className="text-base-content/70">Not allowed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Certifications & Awards</h3>
              <div className="space-y-2">
                <div className="badge badge-success badge-sm mr-2 mb-2">
                  NAMFISA Licensed
                </div>
                <div className="badge badge-success badge-sm mr-2 mb-2">
                  Tourism Board Certified
                </div>
                <div className="badge badge-success badge-sm mr-2 mb-2">
                  Health & Safety Certified
                </div>
                <div className="badge badge-warning badge-sm mr-2 mb-2">
                  Best Guesthouse 2023
                </div>
                <div className="badge badge-warning badge-sm mr-2 mb-2">
                  Excellence in Service
                </div>
                <div className="badge badge-warning badge-sm mr-2 mb-2">
                  Customer Choice Award
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
