/**
 * Etuna Menu Page - Enhanced Customer View
 * 
 * Comprehensive menu browsing with food images, ordering, and availability
 * Demonstrates Buffr Host platform capabilities for restaurant management
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Utensils, 
  Wine, 
  Coffee, 
  Pizza, 
  Star,
  Clock,
  Users,
  Phone,
  Mail,
  ShoppingCart,
  Plus,
  Minus,
  Heart,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  ClockIcon,
  DollarSign,
  ChefHat,
  Flame,
  ArrowLeft
} from 'lucide-react';

export default function EtunaMenuPage() {
  const [activeTab, setActiveTab] = useState<'restaurant' | 'bar'>('restaurant');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<Array<{id: string, name: string, price: number, quantity: number}>>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced menu data with images, availability, and ordering info
  const menuData = {
    restaurant: [
      {
        id: 'menu-001',
        name: 'Traditional Half Chicken',
        category: 'Traditional Cuisine',
        description: 'Traditional chicken served with mahangu or maize',
        price: 150,
        currency: 'NAD',
        image: 'https://images.unsplash.com/photo-1598515214211-89d88c13e162?q=80&w=2070&auto=format&fit=crop',
        availability: 'available',
        preparationTime: '25-30 min',
        rating: 4.8,
        reviews: 45,
        ingredients: ['Chicken', 'Mahangu', 'Traditional spices'],
        allergens: ['None'],
        popular: true,
        spicy: false,
        vegetarian: false
      },
      {
        id: 'menu-002',
        name: 'Oxtail Stew',
        category: 'Traditional Cuisine',
        description: 'Ox tail stew served with a bed rice, maize or mahangu',
        price: 150,
        currency: 'NAD',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop',
        availability: 'available',
        preparationTime: '35-40 min',
        rating: 4.7,
        reviews: 38,
        ingredients: ['Oxtail', 'Rice', 'Traditional vegetables'],
        allergens: ['None'],
        popular: true,
        spicy: false,
        vegetarian: false
      },
      {
        id: 'menu-003',
        name: 'Rump Steak',
        category: 'Main Course',
        description: 'Rump steak served with parsley potatoes',
        price: 150,
        currency: 'NAD',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2070&auto=format&fit=crop',
        availability: 'available',
        preparationTime: '20-25 min',
        rating: 4.6,
        reviews: 32,
        ingredients: ['Beef rump', 'Potatoes', 'Parsley'],
        allergens: ['Dairy'],
        popular: false,
        spicy: false,
        vegetarian: false
      },
      {
        id: 'menu-004',
        name: 'King Klip',
        category: 'Main Course',
        description: 'King Klip served with parsley potatoes or French fries',
        price: 150,
        currency: 'NAD',
        image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=2070&auto=format&fit=crop',
        availability: 'limited',
        preparationTime: '15-20 min',
        rating: 4.5,
        reviews: 28,
        ingredients: ['King Klip fish', 'Potatoes', 'Lemon'],
        allergens: ['Fish'],
        popular: false,
        spicy: false,
        vegetarian: false
      },
      {
        id: 'menu-005',
        name: 'Haden Hawaiian Pizza',
        category: 'Pizza',
        description: 'Ham and pineapple pizza',
        price: 100,
        currency: 'NAD',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=2070&auto=format&fit=crop',
        availability: 'available',
        preparationTime: '15-20 min',
        rating: 4.4,
        reviews: 25,
        ingredients: ['Pizza dough', 'Ham', 'Pineapple', 'Cheese'],
        allergens: ['Gluten', 'Dairy', 'Pork'],
        popular: true,
        spicy: false,
        vegetarian: false
      },
      {
        id: 'menu-006',
        name: 'Omaungu',
        category: 'Traditional Cuisine',
        description: 'Mopane worms fried over low heat served with mahangu or maize',
        price: 80,
        currency: 'NAD',
        image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=2070&auto=format&fit=crop',
        availability: 'limited',
        preparationTime: '30-35 min',
        rating: 4.2,
        reviews: 15,
        ingredients: ['Mopane worms', 'Mahangu', 'Traditional spices'],
        allergens: ['None'],
        popular: false,
        spicy: false,
        vegetarian: false
      },
      {
        id: 'menu-007',
        name: 'Chicken Wings',
        category: 'Light Meals',
        description: 'Four chicken wings',
        price: 50,
        currency: 'NAD',
        image: 'https://images.unsplash.com/photo-1567620832904-9fe5cf23db13?q=80&w=2070&auto=format&fit=crop',
        availability: 'available',
        preparationTime: '20-25 min',
        rating: 4.3,
        reviews: 42,
        ingredients: ['Chicken wings', 'Spices', 'Oil'],
        allergens: ['None'],
        popular: true,
        spicy: true,
        vegetarian: false
      },
      {
        id: 'menu-008',
        name: 'Malva Pudding',
        category: 'Desserts',
        description: 'Traditional South African dessert with custard',
        price: 60,
        currency: 'NAD',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2070&auto=format&fit=crop',
        availability: 'available',
        preparationTime: '10-15 min',
        rating: 4.7,
        reviews: 35,
        ingredients: ['Flour', 'Sugar', 'Milk', 'Custard'],
        allergens: ['Gluten', 'Dairy', 'Eggs'],
        popular: true,
        spicy: false,
        vegetarian: true
      }
    ],
    bar: [
      {
        id: 'bar-001',
        name: 'Namibian Lager',
        category: 'Beer',
        description: 'Local Namibian beer',
        price: 25,
        currency: 'NAD',
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=2070&auto=format&fit=crop',
        availability: 'available',
        size: '330ml',
        alcohol: '4.5%',
        popular: true
      },
      {
        id: 'bar-002',
        name: 'Windhoek Lager',
        category: 'Beer',
        description: 'Premium Namibian lager',
        price: 30,
        currency: 'NAD',
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=2070&auto=format&fit=crop',
        availability: 'available',
        size: '330ml',
        alcohol: '4.0%',
        popular: true
      },
      {
        id: 'bar-003',
        name: 'House Wine - Red',
        category: 'Wine',
        description: 'Local red wine',
        price: 120,
        currency: 'NAD',
        image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2070&auto=format&fit=crop',
        availability: 'available',
        size: '750ml',
        alcohol: '13%',
        popular: false
      },
      {
        id: 'bar-004',
        name: 'Cocktail - Namibian Sunset',
        category: 'Cocktails',
        description: 'Signature cocktail with local ingredients',
        price: 80,
        currency: 'NAD',
        image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=2070&auto=format&fit=crop',
        availability: 'available',
        size: '250ml',
        alcohol: '12%',
        popular: true
      }
    ]
  };

  const categories = [
    { id: 'all', name: 'All Items', icon: Utensils },
    { id: 'Traditional Cuisine', name: 'Traditional', icon: ChefHat },
    { id: 'Main Course', name: 'Main Course', icon: Utensils },
    { id: 'Pizza', name: 'Pizza', icon: Pizza },
    { id: 'Light Meals', name: 'Light Meals', icon: Coffee },
    { id: 'Desserts', name: 'Desserts', icon: Star }
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'badge-success';
      case 'limited':
        return 'badge-warning';
      case 'unavailable':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'available':
        return <CheckCircle className="w-4 h-4" />;
      case 'limited':
        return <AlertCircle className="w-4 h-4" />;
      case 'unavailable':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const addToCart = (item: any) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { id: item.id, name: item.name, price: item.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const filteredItems = menuData[activeTab].filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-primary text-primary-content py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-4">
            <Link href="/guest/etuna" className="btn btn-ghost text-primary-content hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Etuna
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Restaurant & Bar Menu</h1>
            <p className="text-xl text-primary-content/80 max-w-3xl mx-auto">
              Authentic Namibian cuisine and full bar service with traditional flavors and modern presentation
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-base-200 py-4">
        <div className="container mx-auto px-6">
          <div className="flex justify-center gap-4">
            <button
              className={`btn ${activeTab === 'restaurant' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('restaurant')}
            >
              <Utensils className="w-4 h-4 mr-2" />
              Restaurant Menu
            </button>
            <button
              className={`btn ${activeTab === 'bar' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('bar')}
            >
              <Wine className="w-4 h-4 mr-2" />
              Bar Menu
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              <input
                type="text"
                placeholder="Search menu items..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="select select-bordered">
              <option>All Availability</option>
              <option>Available</option>
              <option>Limited</option>
            </select>
            <button className="btn btn-outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`btn btn-sm ${selectedCategory === category.id ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <category.icon className="w-4 h-4 mr-1" />
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="card bg-base-100 shadow-xl">
              <figure className="h-48 relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  {item.popular && (
                    <div className="badge badge-warning">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </div>
                  )}
                  <div className={`badge ${getAvailabilityColor(item.availability)} gap-1`}>
                    {getAvailabilityIcon(item.availability)}
                    {item.availability.charAt(0).toUpperCase() + item.availability.slice(1)}
                  </div>
                </div>
                {'spicy' in item && item.spicy && (
                  <div className="absolute top-4 left-4">
                    <div className="badge badge-error">
                      <Flame className="w-3 h-3 mr-1" />
                      Spicy
                    </div>
                  </div>
                )}
              </figure>
              
              <div className="card-body">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="card-title text-lg">{item.name}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {item.currency} {item.price}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-base-content/70 mb-3">{item.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  {'rating' in item && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">{item.rating}</span>
                      <span className="text-xs text-base-content/70">({item.reviews})</span>
                    </div>
                  )}
                  {'preparationTime' in item && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-base-content/50" />
                      <span className="text-sm">{item.preparationTime}</span>
                    </div>
                  )}
                  {'alcohol' in item && (
                    <div className="flex items-center gap-1">
                      <Wine className="w-4 h-4 text-base-content/50" />
                      <span className="text-sm">{item.alcohol}</span>
                    </div>
                  )}
                </div>

                {/* Ingredients and Allergens */}
                {'ingredients' in item && (
                  <div className="mb-4">
                    <div className="text-xs text-base-content/70 mb-1">Ingredients: {item.ingredients.join(', ')}</div>
                    {item.allergens && item.allergens.length > 0 && (
                      <div className="text-xs text-red-600">Allergens: {item.allergens.join(', ')}</div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="card-actions justify-between">
                  <div className="flex items-center gap-2">
                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={() => addToCart(item)}
                      disabled={item.availability === 'unavailable'}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-sm">
                      {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                    </span>
                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        const cartItem = cart.find(cartItem => cartItem.id === item.id);
                        if (cartItem) updateQuantity(item.id, cartItem.quantity - 1);
                      }}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="btn btn-primary btn-sm">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="card bg-base-100 shadow-xl w-80">
            <div className="card-body">
              <h3 className="card-title text-lg">Your Order</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-base-content/70">
                        NAD {item.price} × {item.quantity}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        className="btn btn-ghost btn-xs"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold">{item.quantity}</span>
                      <button 
                        className="btn btn-ghost btn-xs"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button 
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="divider"></div>
              <div className="flex items-center justify-between">
                <span className="font-bold">Total: NAD {getTotalPrice()}</span>
                <button className="btn btn-primary btn-sm">
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="bg-base-200 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help with Your Order?</h2>
            <p className="text-base-content/70 mb-8 max-w-2xl mx-auto">
              Our friendly staff is here to help you with menu recommendations, 
              dietary requirements, and special requests.
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
      </div>
    </div>
  );
}