'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { StatusBadge } from '@/src/components/ui/status-badge'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  Edit, 
  Save,
  X,
  Heart,
  Award,
  Clock,
  CreditCard,
  Bell
} from 'lucide-react'

export default function CustomerProfilesPage() {
  const [editingProfile, setEditingProfile] = useState<string | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState('1')

  const customers = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+264 81 123 4567',
      status: 'active',
      tier: 'gold',
      joinDate: '2023-06-15',
      lastVisit: '2024-01-15',
      totalBookings: 12,
      totalSpent: 15600,
      location: 'Windhoek, Namibia',
      preferences: ['Ocean view', 'Late checkout', 'Spa services'],
      notes: 'VIP customer, prefers room 205. Always books spa treatments.',
      loyaltyPoints: 1560,
      birthday: '1985-03-22',
      anniversary: '2010-07-14',
      dietary: 'No allergies',
      roomPreference: 'Deluxe Suite',
      checkInTime: '15:00',
      checkOutTime: '11:00'
    },
    {
      id: '2',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+264 81 234 5678',
      status: 'active',
      tier: 'platinum',
      joinDate: '2023-03-10',
      lastVisit: '2024-01-20',
      totalBookings: 8,
      totalSpent: 22400,
      location: 'Cape Town, South Africa',
      preferences: ['Vegetarian meals', 'Quiet room', 'Business center'],
      notes: 'Business traveler, needs reliable WiFi and quiet environment.',
      loyaltyPoints: 2240,
      birthday: '1982-11-08',
      anniversary: '2008-12-03',
      dietary: 'Vegetarian',
      roomPreference: 'Executive Suite',
      checkInTime: '14:00',
      checkOutTime: '10:00'
    }
  ]

  const currentCustomer = customers.find(c => c.id === selectedCustomer) || customers[0]

  const handleEdit = (field: string) => {
    setEditingProfile(field)
  }

  const handleSave = () => {
    setEditingProfile(null)
    // Here you would save the changes to the backend
  }

  const handleCancel = () => {
    setEditingProfile(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-nude-900">Customer Profiles</h1>
          <p className="text-nude-600">Detailed customer information and preferences</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-1">
          <Card className="dashboard-card-emotional">
            <CardHeader>
              <CardTitle>Customers</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className={`p-4 border-b border-nude-100 cursor-pointer transition-colors ${
                    selectedCustomer === customer.id ? 'bg-nude-50' : 'hover:bg-nude-25'
                  }`}
                  onClick={() => setSelectedCustomer(customer.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-nude-400 to-nude-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-nude-900">{customer.name}</div>
                      <div className="text-sm text-nude-600">{customer.email}</div>
                      <StatusBadge 
                        status={customer.tier === 'platinum' ? 'success' : customer.tier === 'gold' ? 'warning' : 'info'}
                        className="mt-1"
                      >
                        {customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1)}
                      </StatusBadge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Customer Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="dashboard-card-emotional">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Basic Information
                <Button variant="ghost" size="sm" onClick={() => handleEdit('basic')}>
                  <Edit className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label-emotional">Full Name</label>
                  {editingProfile === 'basic' ? (
                    <input 
                      type="text" 
                      defaultValue={currentCustomer.name}
                      className="form-input-emotional"
                    />
                  ) : (
                    <div className="text-nude-900 font-medium">{currentCustomer.name}</div>
                  )}
                </div>
                <div>
                  <label className="form-label-emotional">Email</label>
                  {editingProfile === 'basic' ? (
                    <input 
                      type="email" 
                      defaultValue={currentCustomer.email}
                      className="form-input-emotional"
                    />
                  ) : (
                    <div className="text-nude-900 font-medium flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-nude-500" />
                      {currentCustomer.email}
                    </div>
                  )}
                </div>
                <div>
                  <label className="form-label-emotional">Phone</label>
                  {editingProfile === 'basic' ? (
                    <input 
                      type="tel" 
                      defaultValue={currentCustomer.phone}
                      className="form-input-emotional"
                    />
                  ) : (
                    <div className="text-nude-900 font-medium flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-nude-500" />
                      {currentCustomer.phone}
                    </div>
                  )}
                </div>
                <div>
                  <label className="form-label-emotional">Location</label>
                  {editingProfile === 'basic' ? (
                    <input 
                      type="text" 
                      defaultValue={currentCustomer.location}
                      className="form-input-emotional"
                    />
                  ) : (
                    <div className="text-nude-900 font-medium flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-nude-500" />
                      {currentCustomer.location}
                    </div>
                  )}
                </div>
              </div>
              
              {editingProfile === 'basic' && (
                <div className="flex space-x-2 pt-4">
                  <Button variant="primary" size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Loyalty & Preferences */}
          <Card className="dashboard-card-emotional">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Loyalty & Preferences
                <Button variant="ghost" size="sm" onClick={() => handleEdit('preferences')}>
                  <Edit className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-nude-50 rounded-lg">
                  <Award className="w-8 h-8 text-luxury-charlotte mx-auto mb-2" />
                  <div className="text-2xl font-bold text-nude-900">{currentCustomer.loyaltyPoints}</div>
                  <div className="text-sm text-nude-600">Loyalty Points</div>
                </div>
                <div className="text-center p-4 bg-nude-50 rounded-lg">
                  <Star className="w-8 h-8 text-nude-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-nude-900">{currentCustomer.totalBookings}</div>
                  <div className="text-sm text-nude-600">Total Bookings</div>
                </div>
                <div className="text-center p-4 bg-nude-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-semantic-success mx-auto mb-2" />
                  <div className="text-2xl font-bold text-nude-900">N$ {currentCustomer.totalSpent.toLocaleString()}</div>
                  <div className="text-sm text-nude-600">Total Spent</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label-emotional">Room Preference</label>
                  <div className="text-nude-900 font-medium">{currentCustomer.roomPreference}</div>
                </div>
                <div>
                  <label className="form-label-emotional">Dietary Requirements</label>
                  <div className="text-nude-900 font-medium">{currentCustomer.dietary}</div>
                </div>
                <div>
                  <label className="form-label-emotional">Preferred Check-in</label>
                  <div className="text-nude-900 font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-nude-500" />
                    {currentCustomer.checkInTime}
                  </div>
                </div>
                <div>
                  <label className="form-label-emotional">Preferred Check-out</label>
                  <div className="text-nude-900 font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-nude-500" />
                    {currentCustomer.checkOutTime}
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label-emotional">Special Preferences</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentCustomer.preferences.map((pref, index) => (
                    <span key={index} className="bg-nude-100 text-nude-800 px-3 py-1 rounded-full text-sm">
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Dates */}
          <Card className="dashboard-card-emotional">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Important Dates
                <Button variant="ghost" size="sm" onClick={() => handleEdit('dates')}>
                  <Edit className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label-emotional">Birthday</label>
                  <div className="text-nude-900 font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-nude-500" />
                    {new Date(currentCustomer.birthday).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label className="form-label-emotional">Anniversary</label>
                  <div className="text-nude-900 font-medium flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-nude-500" />
                    {new Date(currentCustomer.anniversary).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label className="form-label-emotional">Member Since</label>
                  <div className="text-nude-900 font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-nude-500" />
                    {new Date(currentCustomer.joinDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label className="form-label-emotional">Last Visit</label>
                  <div className="text-nude-900 font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-nude-500" />
                    {new Date(currentCustomer.lastVisit).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="dashboard-card-emotional">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Customer Notes
                <Button variant="ghost" size="sm" onClick={() => handleEdit('notes')}>
                  <Edit className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingProfile === 'notes' ? (
                <div>
                  <textarea 
                    defaultValue={currentCustomer.notes}
                    className="form-input-emotional w-full h-32 resize-none"
                    placeholder="Add customer notes..."
                  />
                  <div className="flex space-x-2 mt-4">
                    <Button variant="primary" size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-nude-700 leading-relaxed">
                  {currentCustomer.notes}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}