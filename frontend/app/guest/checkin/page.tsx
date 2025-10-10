'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { EmotionalInput } from '@/src/components/ui/emotional-input'
import { 
  Search, 
  CheckCircle, 
  Clock, 
  User, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Shield,
  AlertCircle,
  ArrowRight,
  QrCode,
  Smartphone
} from 'lucide-react'
import Link from 'next/link'

export default function GuestCheckInPage() {
  const [searchMethod, setSearchMethod] = useState('confirmation') // confirmation, phone, email
  const [searchValue, setSearchValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [foundBooking, setFoundBooking] = useState<any>(null)
  const [checkInStep, setCheckInStep] = useState('search') // search, details, complete

  const sampleBooking = {
    id: 'ETU-2024-001',
    guestName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+264 81 123 4567',
    checkIn: '2024-01-25',
    checkOut: '2024-01-28',
    room: 'Deluxe Suite - Room 101',
    guests: 2,
    totalAmount: 3600,
    status: 'confirmed',
    specialRequests: 'Late check-in requested',
    bookingDate: '2024-01-20'
  }

  const handleSearch = async () => {
    setIsSearching(true)
    // Simulate search delay
    setTimeout(() => {
      setFoundBooking(sampleBooking)
      setCheckInStep('details')
      setIsSearching(false)
    }, 1000)
  }

  const handleCheckIn = () => {
    setCheckInStep('complete')
  }

  const renderSearchStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-display font-bold text-nude-900 mb-4">
          Guest Check-in
        </h1>
        <p className="text-xl text-nude-600">
          Find your booking to begin the check-in process
        </p>
      </div>

      <Card className="p-6">
        <CardHeader>
          <CardTitle>Find Your Booking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Method Selection */}
          <div>
            <label className="form-label-emotional mb-3 block">Search by:</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setSearchMethod('confirmation')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  searchMethod === 'confirmation'
                    ? 'border-nude-600 bg-nude-50'
                    : 'border-nude-200 hover:border-nude-300'
                }`}
              >
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-nude-600" />
                  <div className="font-medium">Confirmation Number</div>
                  <div className="text-sm text-nude-500">ETU-2024-001</div>
                </div>
              </button>
              <button
                onClick={() => setSearchMethod('phone')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  searchMethod === 'phone'
                    ? 'border-nude-600 bg-nude-50'
                    : 'border-nude-200 hover:border-nude-300'
                }`}
              >
                <div className="text-center">
                  <Phone className="w-8 h-8 mx-auto mb-2 text-nude-600" />
                  <div className="font-medium">Phone Number</div>
                  <div className="text-sm text-nude-500">+264 81 123 4567</div>
                </div>
              </button>
              <button
                onClick={() => setSearchMethod('email')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  searchMethod === 'email'
                    ? 'border-nude-600 bg-nude-50'
                    : 'border-nude-200 hover:border-nude-300'
                }`}
              >
                <div className="text-center">
                  <Mail className="w-8 h-8 mx-auto mb-2 text-nude-600" />
                  <div className="font-medium">Email Address</div>
                  <div className="text-sm text-nude-500">john@email.com</div>
                </div>
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div>
            <label className="form-label-emotional">
              {searchMethod === 'confirmation' && 'Confirmation Number'}
              {searchMethod === 'phone' && 'Phone Number'}
              {searchMethod === 'email' && 'Email Address'}
            </label>
            <EmotionalInput
              type={searchMethod === 'email' ? 'email' : 'text'}
              placeholder={
                searchMethod === 'confirmation' ? 'Enter confirmation number' :
                searchMethod === 'phone' ? 'Enter phone number' :
                'Enter email address'
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          <Button 
            variant="primary" 
            className="w-full"
            onClick={handleSearch}
            disabled={isSearching || !searchValue}
          >
            {isSearching ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Find Booking
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* QR Code Check-in */}
      <Card className="mt-6 p-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="w-5 h-5 mr-2" />
            QR Code Check-in
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="w-32 h-32 bg-nude-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-16 h-16 text-nude-400" />
            </div>
            <p className="text-nude-600 mb-4">
              Scan the QR code with your phone camera to check in instantly
            </p>
            <Button variant="outline">
              <Smartphone className="w-4 h-4 mr-2" />
              Open Camera
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderDetailsStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-nude-900 mb-4">
          Booking Found
        </h1>
        <p className="text-xl text-nude-600">
          Please verify your details and complete check-in
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-nude-500">Confirmation Number</label>
                <p className="font-semibold text-lg">{foundBooking.id}</p>
              </div>
              <div>
                <label className="text-sm text-nude-500">Status</label>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">Confirmed</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-nude-500">Check-in Date</label>
                <p className="font-semibold">{foundBooking.checkIn}</p>
              </div>
              <div>
                <label className="text-sm text-nude-500">Check-out Date</label>
                <p className="font-semibold">{foundBooking.checkOut}</p>
              </div>
            </div>

            <div>
              <label className="text-sm text-nude-500">Room Assignment</label>
              <p className="font-semibold text-lg">{foundBooking.room}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-nude-500">Guests</label>
                <p className="font-semibold">{foundBooking.guests} guests</p>
              </div>
              <div>
                <label className="text-sm text-nude-500">Total Amount</label>
                <p className="font-semibold">N$ {foundBooking.totalAmount}</p>
              </div>
            </div>

            {foundBooking.specialRequests && (
              <div>
                <label className="text-sm text-nude-500">Special Requests</label>
                <p className="text-sm bg-nude-50 p-3 rounded">{foundBooking.specialRequests}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Guest Information */}
        <Card>
          <CardHeader>
            <CardTitle>Guest Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="form-label-emotional">Full Name</label>
              <EmotionalInput value={foundBooking.guestName} readOnly />
            </div>
            <div>
              <label className="form-label-emotional">Email Address</label>
              <EmotionalInput type="email" value={foundBooking.email} readOnly />
            </div>
            <div>
              <label className="form-label-emotional">Phone Number</label>
              <EmotionalInput value={foundBooking.phone} readOnly />
            </div>
            <div>
              <label className="form-label-emotional">ID Number</label>
              <EmotionalInput placeholder="Enter ID number" />
            </div>
            <div>
              <label className="form-label-emotional">Emergency Contact</label>
              <EmotionalInput placeholder="Emergency contact number" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment and Terms */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Payment & Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-nude-50 rounded-lg">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-nude-600 mr-3" />
                <div>
                  <p className="font-semibold">Payment Method</p>
                  <p className="text-sm text-nude-600">Credit Card ending in 1234</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>

            <div className="flex items-start space-x-3">
              <input type="checkbox" className="mt-1" />
              <div className="text-sm text-nude-600">
                <p>I agree to the hotel's terms and conditions and privacy policy.</p>
                <p>I understand that I am responsible for any damages to the room.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input type="checkbox" className="mt-1" />
              <div className="text-sm text-nude-600">
                <p>I consent to receive SMS notifications about my stay.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline"
          onClick={() => setCheckInStep('search')}
        >
          Back to Search
        </Button>
        <Button 
          variant="primary"
          onClick={handleCheckIn}
          className="flex items-center"
        >
          Complete Check-in
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  const renderCompleteStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-display font-bold text-nude-900 mb-4">
          Check-in Complete!
        </h1>
        <p className="text-xl text-nude-600">
          Welcome to Etuna Guesthouse, {foundBooking.guestName}!
        </p>
      </div>

      <Card className="p-6 mb-8">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-nude-900">Room Key</h3>
            <div className="w-32 h-20 bg-nude-100 rounded-lg flex items-center justify-center mx-auto mt-2">
              <div className="text-2xl font-mono font-bold text-nude-600">101</div>
            </div>
            <p className="text-sm text-nude-600 mt-2">Digital key sent to your phone</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-nude-500">Room:</span>
              <p className="font-medium">{foundBooking.room}</p>
            </div>
            <div>
              <span className="text-nude-500">Check-out:</span>
              <p className="font-medium">{foundBooking.checkOut}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-nude-900">What's Next?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">Find Your Room</p>
                <p className="text-sm text-nude-600">Room 101, 2nd floor</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">WiFi Access</p>
                <p className="text-sm text-nude-600">Network: Etuna_Guest</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <Button variant="primary">
          <Smartphone className="w-4 h-4 mr-2" />
          Download Mobile App
        </Button>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          View Hotel Services
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 to-nude-100 py-8">
      {/* Header */}
      <header className="bg-white shadow-sm mb-8">
        <div className="container-nude py-4">
          <div className="flex items-center justify-between">
            <Link href="/guest" className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-nude-800 to-black rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-2xl font-bold text-nude-900">Buffr Host</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/guest" className="text-nude-600 hover:text-nude-800">Home</Link>
              <Link href="/guest/booking" className="text-nude-600 hover:text-nude-800">Book Now</Link>
              <Link href="/guest/menu" className="text-nude-600 hover:text-nude-800">Menu</Link>
              <Link href="/guest/checkin" className="text-nude-800 font-medium">Check-in</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container-nude">
        {checkInStep === 'search' && renderSearchStep()}
        {checkInStep === 'details' && renderDetailsStep()}
        {checkInStep === 'complete' && renderCompleteStep()}
      </div>
    </div>
  )
}