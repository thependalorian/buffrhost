import { Metadata } from "next";
import Link from "next/link";
import {
  Bed,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Wrench,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  ArrowLeft,
  Home,
  Users,
  Calendar,
  Wifi,
  Car,
  Coffee,
  Tv,
  Droplets,
  AirVent,
} from "lucide-react";
import { etunaUnifiedData } from "@/lib/data/etuna-property-unified";

export const metadata: Metadata = {
  title: "Etuna Guesthouse - Room Management",
  description:
    "Manage room inventory, status, and maintenance for Etuna Guesthouse",
};

export default function EtunaRoomsPage() {
  const property = etunaUnifiedData.property;

  // Sample room data
  const rooms = [
    {
      id: "S-101",
      type: "Standard Room",
      floor: 1,
      status: "available",
      occupancy: 0,
      maxOccupancy: 2,
      bedType: "Twin",
      size: "200 sqft",
      rate: 750,
      amenities: ["WiFi", "TV", "Shower", "Fridge"],
      lastCleaned: "2024-01-14",
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-02-10",
      currentGuest: null,
      checkInDate: null,
      checkOutDate: null,
      issues: [],
    },
    {
      id: "E-201",
      type: "Executive Room",
      floor: 2,
      status: "occupied",
      occupancy: 2,
      maxOccupancy: 2,
      bedType: "Queen",
      size: "300 sqft",
      rate: 1000,
      amenities: ["WiFi", "TV", "Shower", "Fridge", "Balcony"],
      lastCleaned: "2024-01-15",
      lastMaintenance: "2024-01-12",
      nextMaintenance: "2024-02-12",
      currentGuest: "John Smith",
      checkInDate: "2024-01-15",
      checkOutDate: "2024-01-17",
      issues: [],
    },
    {
      id: "L-205",
      type: "Luxury Room",
      floor: 2,
      status: "maintenance",
      occupancy: 0,
      maxOccupancy: 2,
      bedType: "Double",
      size: "350 sqft",
      rate: 830,
      amenities: ["WiFi", "TV", "Shower", "Fridge", "Working Space"],
      lastCleaned: "2024-01-13",
      lastMaintenance: "2024-01-16",
      nextMaintenance: "2024-02-16",
      currentGuest: null,
      checkInDate: null,
      checkOutDate: null,
      issues: ["AC not working", "TV remote missing"],
    },
    {
      id: "FS-301",
      type: "Family Suite 1",
      floor: 3,
      status: "cleaning",
      occupancy: 0,
      maxOccupancy: 4,
      bedType: "Double + Twin",
      size: "500 sqft",
      rate: 1500,
      amenities: ["WiFi", "TV", "Shower", "Fridge", "Kitchenette"],
      lastCleaned: "2024-01-16",
      lastMaintenance: "2024-01-14",
      nextMaintenance: "2024-02-14",
      currentGuest: null,
      checkInDate: null,
      checkOutDate: null,
      issues: [],
    },
    {
      id: "P-401",
      type: "Premier Room",
      floor: 4,
      status: "available",
      occupancy: 0,
      maxOccupancy: 4,
      bedType: "King + Queen",
      size: "800 sqft",
      rate: 2000,
      amenities: ["WiFi", "TV", "Shower", "Fridge", "Balcony", "Lounge"],
      lastCleaned: "2024-01-15",
      lastMaintenance: "2024-01-11",
      nextMaintenance: "2024-02-11",
      currentGuest: null,
      checkInDate: null,
      checkOutDate: null,
      issues: [],
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <span className="badge badge-success">Available</span>;
      case "occupied":
        return <span className="badge badge-info">Occupied</span>;
      case "cleaning":
        return <span className="badge badge-warning">Cleaning</span>;
      case "maintenance":
        return <span className="badge badge-error">Maintenance</span>;
      case "out-of-order":
        return <span className="badge badge-error">Out of Order</span>;
      default:
        return <span className="badge badge-ghost">{status}</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "occupied":
        return <Users className="w-4 h-4 text-info" />;
      case "cleaning":
        return <Clock className="w-4 h-4 text-warning" />;
      case "maintenance":
        return <Wrench className="w-4 h-4 text-error" />;
      case "out-of-order":
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return <AlertCircle className="w-4 h-4 text-ghost" />;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="w-4 h-4" />;
      case "tv":
        return <Tv className="w-4 h-4" />;
      case "shower":
        return <Droplets className="w-4 h-4" />;
      case "fridge":
        return <Coffee className="w-4 h-4" />;
      case "balcony":
        return <AirVent className="w-4 h-4" />;
      case "parking":
        return <Car className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/demo/etuna/admin-dashboard-demo/dashboard"
                className="btn btn-ghost text-primary-content hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <Bed className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Room Management</h1>
                  <p className="text-primary-content/80">
                    Manage room inventory and status
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Room
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Filters and Search */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search rooms..."
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select className="select select-bordered">
                  <option>All Status</option>
                  <option>Available</option>
                  <option>Occupied</option>
                  <option>Cleaning</option>
                  <option>Maintenance</option>
                  <option>Out of Order</option>
                </select>
                <select className="select select-bordered">
                  <option>All Types</option>
                  <option>Standard Room</option>
                  <option>Executive Room</option>
                  <option>Luxury Room</option>
                  <option>Family Suite</option>
                  <option>Premier Room</option>
                </select>
                <select className="select select-bordered">
                  <option>All Floors</option>
                  <option>Floor 1</option>
                  <option>Floor 2</option>
                  <option>Floor 3</option>
                  <option>Floor 4</option>
                </select>
                <button className="btn btn-outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="card-title text-lg">Room {room.id}</h3>
                    <p className="text-sm text-base-content/70">{room.type}</p>
                    <p className="text-xs text-base-content/50">
                      Floor {room.floor} • {room.size}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(room.status)}
                    {getStatusBadge(room.status)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rate per night:</span>
                    <span className="font-bold text-primary">
                      N$ {room.rate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Occupancy:</span>
                    <span className="text-sm">
                      {room.occupancy}/{room.maxOccupancy} guests
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Bed Type:</span>
                    <span className="text-sm">{room.bedType}</span>
                  </div>

                  {room.currentGuest && (
                    <div className="alert alert-info">
                      <Users className="w-4 h-4" />
                      <div>
                        <div className="font-semibold">Current Guest</div>
                        <div className="text-sm">{room.currentGuest}</div>
                        <div className="text-xs">
                          {room.checkInDate} - {room.checkOutDate}
                        </div>
                      </div>
                    </div>
                  )}

                  {room.issues.length > 0 && (
                    <div className="alert alert-error">
                      <AlertCircle className="w-4 h-4" />
                      <div>
                        <div className="font-semibold">Issues Reported</div>
                        <div className="text-sm">
                          {room.issues.map((issue, index) => (
                            <div key={index}>• {issue}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="divider my-4"></div>

                <div className="space-y-2">
                  <div className="font-semibold text-sm text-base-content/70">
                    Amenities
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1 text-xs"
                      >
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="text-xs text-base-content/70">
                    <div>Last cleaned: {room.lastCleaned}</div>
                    <div>Last maintenance: {room.lastMaintenance}</div>
                    <div>Next maintenance: {room.nextMaintenance}</div>
                  </div>
                </div>

                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-ghost btn-sm" title="View Details">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm" title="Edit Room">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm" title="Maintenance">
                    <Wrench className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Bed className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Rooms</div>
              <div className="stat-value text-primary">{rooms.length}</div>
              <div className="stat-desc">Property capacity</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-success">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Available</div>
              <div className="stat-value text-success">
                {rooms.filter((r) => r.status === "available").length}
              </div>
              <div className="stat-desc">Ready for guests</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Occupied</div>
              <div className="stat-value text-info">
                {rooms.filter((r) => r.status === "occupied").length}
              </div>
              <div className="stat-desc">Currently occupied</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-warning">
                <Wrench className="w-8 h-8" />
              </div>
              <div className="stat-title">Maintenance</div>
              <div className="stat-value text-warning">
                {rooms.filter((r) => r.status === "maintenance").length}
              </div>
              <div className="stat-desc">Under repair</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
