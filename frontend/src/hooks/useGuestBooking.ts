import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

interface RoomSearchParams {
  property_id: string
  check_in: string
  check_out: string
  guests: number
  rooms: number
}

interface GuestBookingData {
  property_id: string
  room_id: string
  check_in: string
  check_out: string
  guest_info: {
    first_name: string
    last_name: string
    email: string
    phone: string
  }
  payment_method: string
  special_requests?: string
}

interface RoomAvailabilityResponse {
  room_id: string
  room_number: string
  room_type: string
  description: string
  max_occupancy: number
  base_price: number
  amenities: string[]
  images: string[]
  available: boolean
  total_price: number
}

interface MenuResponse {
  restaurant_id: string
  restaurant_name: string
  categories: Array<{
    id: string
    name: string
    description: string
  }>
  items: Array<{
    id: string
    name: string
    description: string
    price: number
    category: string
    dietary: string[]
    allergens: string[]
    calories: number
    image: string
    available: boolean
  }>
  service_hours: {
    breakfast: string
    lunch: string
    dinner: string
  }
}

export const useGuestBooking = () => {
  const [searchParams, setSearchParams] = useState<RoomSearchParams>()

  // Search for available rooms
  const searchRooms = useMutation({
    mutationFn: async (params: RoomSearchParams): Promise<RoomAvailabilityResponse[]> => {
      const response = await fetch('/api/v1/public/rooms/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to search rooms')
      }
      return response.json()
    }
  })

  // Create booking
  const createBooking = useMutation({
    mutationFn: async (bookingData: GuestBookingData) => {
      const response = await fetch('/api/v1/public/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to create booking')
      }
      return response.json()
    }
  })

  // Get menu
  const getMenu = useQuery({
    queryKey: ['public-menu'],
    queryFn: async (): Promise<MenuResponse> => {
      const response = await fetch('/api/v1/public/menu/restaurant-123')
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to fetch menu')
      }
      return response.json()
    }
  })

  // Get property info
  const getPropertyInfo = useQuery({
    queryKey: ['property-info'],
    queryFn: async (propertyId: string) => {
      const response = await fetch(`/api/v1/public/properties/${propertyId}/info`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to fetch property info')
      }
      return response.json()
    }
  })

  // Get property availability
  const getPropertyAvailability = useQuery({
    queryKey: ['property-availability'],
    queryFn: async ({ propertyId, startDate, endDate }: { 
      propertyId: string
      startDate: string
      endDate: string 
    }) => {
      const response = await fetch(
        `/api/v1/public/properties/${propertyId}/availability?start_date=${startDate}&end_date=${endDate}`
      )
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to fetch availability')
      }
      return response.json()
    }
  })

  // Guest check-in
  const guestCheckin = useMutation({
    mutationFn: async ({ confirmationNumber, guestData }: {
      confirmationNumber: string
      guestData: {
        guest_email: string
        identification_data?: any
      }
    }) => {
      const response = await fetch(`/api/v1/public/checkin/${confirmationNumber}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestData)
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to check in')
      }
      return response.json()
    }
  })

  return {
    searchRooms,
    createBooking,
    getMenu,
    getPropertyInfo,
    getPropertyAvailability,
    guestCheckin,
    searchParams,
    setSearchParams
  }
}

export const useGuestMenu = () => {
  const [cart, setCart] = useState<Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>>([])

  const addToCart = (item: {
    id: string
    name: string
    price: number
    image: string
  }) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id)
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId)
    } else {
      setCart(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      )
    }
  }

  const clearCart = () => setCart([])

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice
  }
}

export const useGuestCheckin = () => {
  const [searchMethod, setSearchMethod] = useState<'confirmation' | 'phone' | 'email'>('confirmation')
  const [searchValue, setSearchValue] = useState('')

  const searchBooking = useMutation({
    mutationFn: async ({ method, value }: { method: string; value: string }) => {
      // This would typically search for a booking by confirmation number, phone, or email
      // For now, return mock data
      return {
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
        specialRequests: 'Late check-in requested'
      }
    }
  })

  return {
    searchMethod,
    setSearchMethod,
    searchValue,
    setSearchValue,
    searchBooking
  }
}