'use client'

import { useState } from 'react'
import { Card } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { EmotionalInput } from '@/src/components/ui/emotional-input'
import { 
  Search, 
  Calendar, 
  Users, 
  MapPin, 
  Star, 
  Wifi, 
  Car, 
  Utensils,
  Bed,
  CheckCircle,
  Clock,
  Heart
} from 'lucide-react'
import Link from 'next/link'

export default function GuestPortalPage() {
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
  })

  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    setIsSearching(true)
    // Simulate search delay
    setTimeout(() => {
      setSearchResults([
        {
          id: '1',
          name: 'Deluxe Suite',
          type: 'Suite',
          price: 1200,
          capacity: 4,
          amenities: ['Wifi', 'AC', 'Mini Bar', 'Ocean View'],
          rating: 4.8,
          reviews: 156,
          image: 'https://images.unsplash.com/photo-1562790351-3e9355219858?q=80&w=2940&auto=format&fit=crop'
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
          image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2940&auto=format&fit=crop'
        },
        {
          id: '3',
          name: 'Family Room',
          type: 'Room',
          price: 1500,
          capacity: 6,
          amenities: ['Wifi', 'AC', 'Kitchenette', 'Balcony'],
          rating: 4.9,
          reviews: 234,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940&auto=format&fit=crop'
        }
      ])
      setIsSearching(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 to-nude-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-nude py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-nude-800 to-black rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-2xl font-bold text-nude-900">Buffr Host</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/guest" className="text-nude-600 hover:text-nude-800">Home</Link>
              <Link href="/guest/booking" className="text-nude-600 hover:text-nude-800">Book Now</Link>
              <Link href="/guest/menu" className="text-nude-600 hover:text-nude-800">Menu</Link>
              <Link href="/guest/checkin" className="text-nude-600 hover:text-nude-800">Check-in</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container-nude text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-nude-900 mb-6">
            Welcome to Etuna Guesthouse
          </h1>
          <p className="text-xl text-nude-600 mb-8 max-w-3xl mx-auto">
            Experience luxury hospitality in the heart of Windhoek. Book your stay, explore our amenities, and enjoy world-class service.
          </p>
          
          {/* Quick Search */}
          <Card className="max-w-4xl mx-auto p-6">
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
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search Rooms
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="py-12">
          <div className="container-nude">
            <h2 className="text-3xl font-display font-bold text-nude-900 mb-8 text-center">
              Available Rooms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((room) => (
                <Card key={room.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={room.image} 
                      alt={room.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-nude-900">{room.name}</h3>
                        <p className="text-nude-600">{room.type} • {room.capacity} guests</p>
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
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.map((amenity, index) => (
                        <span key={index} className="badge badge-outline badge-sm">
                          {amenity}
                        </span>
                      ))}
                    </div>
                    
                    <Button variant="primary" className="w-full">
                      Book Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-nude">
          <h2 className="text-3xl font-display font-bold text-nude-900 mb-12 text-center">
            Why Choose Etuna Guesthouse?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-nude-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8 text-nude-600" />
              </div>
              <h3 className="text-xl font-semibold text-nude-900 mb-2">Free WiFi</h3>
              <p className="text-nude-600">High-speed internet throughout the property</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-nude-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-nude-600" />
              </div>
              <h3 className="text-xl font-semibold text-nude-900 mb-2">Restaurant</h3>
              <p className="text-nude-600">Fine dining with local and international cuisine</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-nude-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-nude-600" />
              </div>
              <h3 className="text-xl font-semibold text-nude-900 mb-2">Tours</h3>
              <p className="text-nude-600">Guided tours to Namibia's most beautiful locations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-nude-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-nude-600" />
              </div>
              <h3 className="text-xl font-semibold text-nude-900 mb-2">Service</h3>
              <p className="text-nude-600">24/7 concierge and exceptional hospitality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-nude-900 text-white py-12">
        <div className="container-nude">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Etuna Guesthouse</h3>
              <p className="text-nude-300 mb-4">
                Your gateway to luxury hospitality in Windhoek, Namibia.
              </p>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">123 Independence Avenue, Windhoek</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/guest/booking" className="block text-nude-300 hover:text-white">Book Now</Link>
                <Link href="/guest/menu" className="block text-nude-300 hover:text-white">Restaurant Menu</Link>
                <Link href="/guest/checkin" className="block text-nude-300 hover:text-white">Check-in</Link>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-nude-300">
                <p>Phone: +264 61 123 4567</p>
                <p>Email: info@etunahotel.com</p>
                <p>24/7 Concierge Service</p>
              </div>
            </div>
          </div>
          <div className="border-t border-nude-700 mt-8 pt-8 text-center text-nude-300">
            <p>&copy; 2024 Etuna Guesthouse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}