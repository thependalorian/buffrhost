import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Bed,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Home,
  CreditCard,
  FileText
} from 'lucide-react';
import { etunaUnifiedData } from '@/lib/data/etuna-property-unified';

export const metadata: Metadata = {
  title: 'Etuna Guesthouse - Guest Management',
  description: 'Manage guest profiles, check-ins, and guest history for Etuna Guesthouse',
};

export default function EtunaGuestsPage() {
  const property = etunaUnifiedData.property;

  // Sample guest data
  const guests = [
    {
      id: 'GUEST001',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '+264 81 234 5678',
      nationality: 'Namibian',
      idNumber: '1234567890123',
      address: '123 Main Street, Windhoek, Namibia',
      loyaltyPoints: 1250,
      totalStays: 8,
      lastVisit: '2024-01-15',
      currentStatus: 'checked-in',
      currentRoom: 'E-201',
      checkInDate: '2024-01-15',
      checkOutDate: '2024-01-17',
      preferences: ['Non-smoking', 'High floor', 'City view'],
      specialRequests: 'Late check-in requested',
      emergencyContact: {
        name: 'Jane Smith',
        phone: '+264 81 234 5679',
        relationship: 'Spouse'
      }
    },
    {
      id: 'GUEST002',
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@email.com',
      phone: '+264 81 345 6789',
      nationality: 'South African',
      idNumber: '9876543210987',
      address: '456 Oak Avenue, Cape Town, South Africa',
      loyaltyPoints: 3200,
      totalStays: 15,
      lastVisit: '2024-01-16',
      currentStatus: 'pending',
      currentRoom: 'FS-301',
      checkInDate: '2024-01-16',
      checkOutDate: '2024-01-19',
      preferences: ['Family room', 'Ground floor', 'Pool view'],
      specialRequests: 'High chair needed for toddler',
      emergencyContact: {
        name: 'Carlos Garcia',
        phone: '+264 81 345 6790',
        relationship: 'Husband'
      }
    },
    {
      id: 'GUEST003',
      firstName: 'Ahmed',
      lastName: 'Hassan',
      email: 'ahmed.hassan@email.com',
      phone: '+264 81 456 7890',
      nationality: 'Egyptian',
      idNumber: '4567891234567',
      address: '789 Pine Street, Cairo, Egypt',
      loyaltyPoints: 800,
      totalStays: 3,
      lastVisit: '2024-01-14',
      currentStatus: 'checked-out',
      currentRoom: null,
      checkInDate: '2024-01-14',
      checkOutDate: '2024-01-16',
      preferences: ['Vegetarian meals', 'Quiet room'],
      specialRequests: 'Vegetarian meals only',
      emergencyContact: {
        name: 'Fatima Hassan',
        phone: '+264 81 456 7891',
        relationship: 'Sister'
      }
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'checked-in':
        return <span className="badge badge-success">Checked In</span>;
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
      case 'checked-out':
        return <span className="badge badge-neutral">Checked Out</span>;
      case 'no-show':
        return <span className="badge badge-error">No Show</span>;
      default:
        return <span className="badge badge-ghost">{status}</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checked-in':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'checked-out':
        return <Clock className="w-4 h-4 text-neutral" />;
      case 'no-show':
        return <AlertCircle className="w-4 h-4 text-error" />;
      default:
        return <AlertCircle className="w-4 h-4 text-ghost" />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/protected/etuna/dashboard" className="btn btn-ghost text-primary-content hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Guest Management</h1>
                  <p className="text-primary-content/80">Manage guest profiles and check-ins</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="btn btn-primary">
                <UserPlus className="w-4 h-4 mr-2" />
                New Guest
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
                    placeholder="Search guests..." 
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select className="select select-bordered">
                  <option>All Status</option>
                  <option>Checked In</option>
                  <option>Pending</option>
                  <option>Checked Out</option>
                  <option>No Show</option>
                </select>
                <select className="select select-bordered">
                  <option>All Nationalities</option>
                  <option>Namibian</option>
                  <option>South African</option>
                  <option>Egyptian</option>
                  <option>Other</option>
                </select>
                <button className="btn btn-outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Guests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {guests.map((guest) => (
            <div key={guest.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="card-title text-lg">
                      {guest.firstName} {guest.lastName}
                    </h3>
                    <p className="text-sm text-base-content/70">ID: {guest.id}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(guest.currentStatus)}
                    {getStatusBadge(guest.currentStatus)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-sm">{guest.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-sm">{guest.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm">{guest.nationality}</span>
                  </div>
                  
                  {guest.currentRoom && (
                    <div className="flex items-center space-x-2">
                      <Bed className="w-4 h-4 text-info" />
                      <span className="text-sm">Room {guest.currentRoom}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-info" />
                    <span className="text-sm">
                      {guest.checkInDate} - {guest.checkOutDate}
                    </span>
                  </div>
                </div>

                <div className="divider my-4"></div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-base-content/70">Loyalty Points</div>
                    <div className="text-lg font-bold text-primary">{guest.loyaltyPoints}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-base-content/70">Total Stays</div>
                    <div className="text-lg font-bold text-secondary">{guest.totalStays}</div>
                  </div>
                </div>

                {guest.preferences.length > 0 && (
                  <div className="mt-4">
                    <div className="font-semibold text-sm text-base-content/70 mb-2">Preferences</div>
                    <div className="flex flex-wrap gap-1">
                      {guest.preferences.map((pref, index) => (
                        <span key={index} className="badge badge-outline badge-sm">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-ghost btn-sm" title="View Profile">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm" title="Check-in/out">
                    <CheckCircle className="w-4 h-4" />
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
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Guests</div>
              <div className="stat-value text-primary">{guests.length}</div>
              <div className="stat-desc">Registered guests</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-success">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Checked In</div>
              <div className="stat-value text-success">
                {guests.filter(g => g.currentStatus === 'checked-in').length}
              </div>
              <div className="stat-desc">Currently staying</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-warning">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Pending</div>
              <div className="stat-value text-warning">
                {guests.filter(g => g.currentStatus === 'pending').length}
              </div>
              <div className="stat-desc">Awaiting check-in</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <Star className="w-8 h-8" />
              </div>
              <div className="stat-title">Loyalty Members</div>
              <div className="stat-value text-info">
                {guests.filter(g => g.loyaltyPoints > 1000).length}
              </div>
              <div className="stat-desc">High-value guests</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
