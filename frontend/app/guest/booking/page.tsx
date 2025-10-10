'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { EmotionalInput } from '@/src/components/ui/emotional-input'
import { 
  Search, 
  Calendar, 
  Users, 
  Star, 
  Wifi, 
  Car, 
  Utensils,
  Bed,
  CheckCircle,
  Clock,
  Heart,
  ArrowRight,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'
import Link from 'next/link'

export default function GuestBookingPage() {
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
  })

  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [bookingStep, setBookingStep] = useState('search') // search, select, details, confirmation

  const rooms = [
    {
      id: '1',
      name: 'Deluxe Suite',
      type: 'Suite',
      price: 1200,
      capacity: 4,
      amenities: ['Wifi', 'AC', 'Mini Bar', 'Ocean View', 'Balcony'],
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1562790351-3e9355219858?q=80&w=2940&auto=format&fit=crop',
      description: 'Spacious suite with panoramic ocean views, perfect for romantic getaways or special occasions.',
      size: '65 sqm',
      bedType: 'King Bed'
    },
    {
      id: '2',
      name: 'Standard Room',
      type: 'Room',
      price: 800,
      capacity: 2,
      amenities: ['Wifi', 'AC', 'City View'],
      rating: 4.6,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2940&auto=format&fit=crop',
      description: 'Comfortable room with modern amenities, ideal for business travelers and short stays.',
      size: '35 sqm',
      bedType: 'Queen Bed'
    },
    {
      id: '3',
      name: 'Family Room',
      type: 'Room',
      price: 1500,
      capacity: 6,
      amenities: ['Wifi', 'AC', 'Kitchenette', 'Balcony', 'Sofa Bed'],
      rating: 4.9,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940&auto=format&fit=crop',
      description: 'Spacious family room with kitchenette and separate living area, perfect for families.',
      size: '85 sqm',
      bedType: 'King + Sofa Bed'
    }
  ]

  const handleSearch = () => {
    setBookingStep('select')
  }

  const handleSelectRoom = (room) => {
    setSelectedRoom(room)
    setBookingStep('details')
  }

  const handleBookNow = () => {
    setBookingStep('confirmation')
  }

  const renderSearchStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-display font-bold text-nude-900 mb-4">
          Book Your Stay
        </h1>
        <p className="text-xl text-nude-600">
          Find the perfect room for your luxury experience at Etuna Guesthouse
        </p>
      </div>

      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label-emotional">Check In</label>
            <EmotionalInput 
              type="date" 
              value={searchParams.checkIn}
              onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
            />
          </div>
          <div>
            <label className="form-label-emotional">Check Out</label>
            <EmotionalInput 
              type="date" 
              value={searchParams.checkOut}
              onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
            />
          </div>
          <div>
            <label className="form-label-emotional">Guests</label>
            <select 
              className="form-input-emotional w-full"
              value={searchParams.guests}
              onChange={(e) => setSearchParams({...searchParams, guests: parseInt(e.target.value)})}
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4+ Guests</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button 
              variant="primary" 
              className="w-full"
              onClick={handleSearch}
            >
              <Search className="w-4 h-4 mr-2" />
              Search Rooms
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderSelectStep = () => (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-nude-900">
            Available Rooms
          </h1>
          <p className="text-nude-600">
            {searchParams.checkIn} to {searchParams.checkOut} • {searchParams.guests} guests
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setBookingStep('search')}
        >
          Modify Search
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden hover:shadow-xl transition-shadow">
            <div className="aspect-video overflow-hidden">
              <img 
                src={room.image} 
                alt={room.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <CardTitle className="text-xl">{room.name}</CardTitle>
                  <p className="text-nude-600">{room.type} • {room.capacity} guests</p>
                  <p className="text-sm text-nude-500 mt-1">{room.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-nude-900">N$ {room.price}</div>
                  <div className="text-sm text-nude-500">per night</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 mb-4">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-semibold">{room.rating}</span>
                <span className="text-sm text-nude-500">({room.reviews} reviews)</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-nude-500">Size:</span>
                  <span className="ml-2 font-medium">{room.size}</span>
                </div>
                <div>
                  <span className="text-nude-500">Bed:</span>
                  <span className="ml-2 font-medium">{room.bedType}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {room.amenities.map((amenity, index) => (
                  <span key={index} className="badge badge-outline badge-sm">
                    {amenity}
                  </span>
                ))}
              </div>
              
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => handleSelectRoom(room)}
              >
                Select Room
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderDetailsStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-nude-900 mb-4">
          Booking Details
        </h1>
        <p className="text-nude-600">Complete your reservation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label-emotional">First Name</label>
                  <EmotionalInput placeholder="Enter first name" />
                </div>
                <div>
                  <label className="form-label-emotional">Last Name</label>
                  <EmotionalInput placeholder="Enter last name" />
                </div>
              </div>
              <div>
                <label className="form-label-emotional">Email</label>
                <EmotionalInput type="email" placeholder="Enter email address" />
              </div>
              <div>
                <label className="form-label-emotional">Phone</label>
                <EmotionalInput type="tel" placeholder="Enter phone number" />
              </div>
              <div>
                <label className="form-label-emotional">Special Requests</label>
                <textarea 
                  className="form-input-emotional w-full h-24 resize-none"
                  placeholder="Any special requests or preferences?"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="p-6 sticky top-4">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedRoom && (
                  <div className="flex items-center space-x-3">
                    <img 
                      src={selectedRoom.image} 
                      alt={selectedRoom.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-semibold">{selectedRoom.name}</h4>
                      <p className="text-sm text-nude-600">{selectedRoom.type}</p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span className="font-medium">{searchParams.checkIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span className="font-medium">{searchParams.checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span className="font-medium">{searchParams.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights:</span>
                    <span className="font-medium">3</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>N$ {selectedRoom ? selectedRoom.price * 3 : 0}</span>
                  </div>
                </div>
                
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={handleBookNow}
                >
                  Complete Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderConfirmationStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-display font-bold text-nude-900 mb-4">
          Booking Confirmed!
        </h1>
        <p className="text-xl text-nude-600">
          Your reservation has been successfully created
        </p>
      </div>

      <Card className="p-6 mb-8">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-nude-900">Confirmation Number</h3>
            <p className="text-2xl font-mono font-bold text-nude-600">ETU-2024-001</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-nude-500">Check-in:</span>
              <p className="font-medium">{searchParams.checkIn}</p>
            </div>
            <div>
              <span className="text-nude-500">Check-out:</span>
              <p className="font-medium">{searchParams.checkOut}</p>
            </div>
          </div>
          
          <div className="text-center">
            <span className="text-nude-500">Room:</span>
            <p className="font-medium">{selectedRoom?.name || 'No room selected'}</p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <p className="text-nude-600">
          A confirmation email has been sent to your email address with all the details.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary">
            <Mail className="w-4 h-4 mr-2" />
            View Booking Details
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Add to Calendar
          </Button>
        </div>
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
              <Link href="/guest/booking" className="text-nude-800 font-medium">Book Now</Link>
              <Link href="/guest/menu" className="text-nude-600 hover:text-nude-800">Menu</Link>
              <Link href="/guest/checkin" className="text-nude-600 hover:text-nude-800">Check-in</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container-nude">
        {bookingStep === 'search' && renderSearchStep()}
        {bookingStep === 'select' && renderSelectStep()}
        {bookingStep === 'details' && renderDetailsStep()}
        {bookingStep === 'confirmation' && renderConfirmationStep()}
      </div>
    </div>
  )
}