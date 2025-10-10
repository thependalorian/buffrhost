'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Flame,
  Leaf,
  Coffee,
  Wine,
  Cake,
  Utensils,
  Heart,
  Plus,
  Minus,
  ShoppingCart
} from 'lucide-react'
import Link from 'next/link'

export default function GuestMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<any[]>([])

  const categories = [
    { id: 'all', name: 'All Items', icon: Utensils },
    { id: 'starters', name: 'Starters', icon: Leaf },
    { id: 'mains', name: 'Main Course', icon: Flame },
    { id: 'desserts', name: 'Desserts', icon: Cake },
    { id: 'beverages', name: 'Beverages', icon: Coffee },
    { id: 'wine', name: 'Wine', icon: Wine }
  ]

  const menuItems = [
    {
      id: '1',
      name: 'Grilled Springbok Steak',
      category: 'mains',
      description: 'Tender springbok steak grilled to perfection, served with seasonal vegetables and red wine reduction',
      price: 450,
      preparationTime: 25,
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2940&auto=format&fit=crop',
      dietary: ['gluten-free'],
      allergens: [],
      calories: 520,
      chefSpecial: true,
      available: true
    },
    {
      id: '2',
      name: 'Namibian Fish Curry',
      category: 'mains',
      description: 'Fresh Namibian fish in aromatic curry sauce with coconut milk, served with basmati rice',
      price: 380,
      preparationTime: 20,
      rating: 4.6,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=2940&auto=format&fit=crop',
      dietary: ['dairy-free'],
      allergens: ['fish'],
      calories: 420,
      chefSpecial: false,
      available: true
    },
    {
      id: '3',
      name: 'Caesar Salad',
      category: 'starters',
      description: 'Crisp romaine lettuce with parmesan cheese, croutons, and our signature Caesar dressing',
      price: 120,
      preparationTime: 10,
      rating: 4.5,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=2940&auto=format&fit=crop',
      dietary: ['vegetarian'],
      allergens: ['dairy', 'gluten'],
      calories: 280,
      chefSpecial: false,
      available: true
    },
    {
      id: '4',
      name: 'Chocolate Lava Cake',
      category: 'desserts',
      description: 'Warm chocolate lava cake with vanilla ice cream and berry compote',
      price: 180,
      preparationTime: 12,
      rating: 4.9,
      reviews: 123,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2940&auto=format&fit=crop',
      dietary: ['vegetarian'],
      allergens: ['eggs', 'dairy', 'gluten'],
      calories: 480,
      chefSpecial: true,
      available: true
    },
    {
      id: '5',
      name: 'Namibian Coffee',
      category: 'beverages',
      description: 'Premium locally roasted coffee beans, served with traditional milk tart',
      price: 45,
      preparationTime: 5,
      rating: 4.7,
      reviews: 45,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2940&auto=format&fit=crop',
      dietary: ['vegan'],
      allergens: [],
      calories: 5,
      chefSpecial: false,
      available: true
    },
    {
      id: '6',
      name: 'South African Pinotage',
      category: 'wine',
      description: 'Full-bodied red wine with notes of dark fruit and spice, perfect with grilled meats',
      price: 280,
      preparationTime: 2,
      rating: 4.8,
      reviews: 78,
      image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2940&auto=format&fit=crop',
      dietary: ['vegan'],
      allergens: [],
      calories: 120,
      chefSpecial: false,
      available: true
    }
  ]

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch && item.available
  })

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity === 0) {
      removeFromCart(itemId)
    } else {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ))
    }
  }

  const getDietaryIcon = (dietary) => {
    switch (dietary) {
      case 'vegan': return <Leaf className="w-4 h-4 text-green-600" />
      case 'vegetarian': return <Leaf className="w-4 h-4 text-green-500" />
      case 'gluten-free': return <Heart className="w-4 h-4 text-blue-600" />
      case 'dairy-free': return <Coffee className="w-4 h-4 text-orange-600" />
      default: return null
    }
  }

  const totalCartValue = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 to-nude-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
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
              <Link href="/guest/menu" className="text-nude-800 font-medium">Menu</Link>
              <Link href="/guest/checkin" className="text-nude-600 hover:text-nude-800">Check-in</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container-nude py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-nude-900 mb-4">
            Restaurant Menu
          </h1>
          <p className="text-xl text-nude-600">
            Discover our exquisite selection of local and international cuisine
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-nude-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input-emotional w-full pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const CategoryIcon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-nude-600 text-white'
                      : 'bg-white text-nude-600 hover:bg-nude-100'
                  }`}
                >
                  <CategoryIcon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    {item.chefSpecial && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Chef Special
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <div className="text-right">
                        <div className="text-xl font-bold text-nude-900">N$ {item.price}</div>
                        <div className="flex items-center text-sm text-nude-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {item.preparationTime}min
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-nude-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center space-x-1 mb-3">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold text-sm">{item.rating}</span>
                      <span className="text-xs text-nude-500">({item.reviews})</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.dietary.map((diet, index) => (
                        <span key={index} className="badge badge-outline badge-sm flex items-center">
                          {getDietaryIcon(diet)}
                          <span className="ml-1">{diet}</span>
                        </span>
                      ))}
                    </div>
                    
                    {item.allergens.length > 0 && (
                      <div className="text-xs text-nude-500 mb-3">
                        <span className="font-medium">Allergens:</span> {item.allergens.join(', ')}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-nude-500">
                        {item.calories} cal
                      </div>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => addToCart(item)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Your Order ({cart.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-nude-500 text-center py-8">
                    Your cart is empty
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-nude-50 rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{item.name}</h4>
                          <p className="text-xs text-nude-600">N$ {item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-nude-200 flex items-center justify-center hover:bg-nude-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-nude-200 flex items-center justify-center hover:bg-nude-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span>N$ {totalCartValue}</span>
                      </div>
                      <Button variant="primary" className="w-full mt-4">
                        Place Order
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}