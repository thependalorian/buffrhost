"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { 
  Calendar, 
  Users, 
  Bed, 
  Utensils, 
  QrCode,
  Star,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Plus,
  Minus,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface RoomAvailabilityCalendarProps {
  rooms: Array<{
    id: number;
    number: string;
    type: string;
    price: number;
    status: string;
  }>;
  availability: Record<string, {
    available: number;
    occupied: number;
    maintenance: number;
  }>;
  onRoomSelect?: (room: any) => void;
}

export function RoomAvailabilityCalendar({ rooms, availability, onRoomSelect }: RoomAvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-nude-900">Room Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-2">
            {days.map(day => (
              <div key={day} className="text-center text-sm font-medium text-nude-600 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((date, index) => {
              const dateStr = date.toISOString().split('T')[0];
              const dayData = availability[dateStr] || { available: 0, occupied: 0, maintenance: 0 };
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              
              return (
                <div
                  key={index}
                  className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${
                    isToday 
                      ? 'border-nude-600 bg-nude-50' 
                      : 'border-nude-200 hover:border-nude-300'
                  }`}
                  onClick={() => setSelectedDate(dateStr)}
                >
                  <div className="text-sm font-medium text-nude-900">
                    {date.getDate()}
                  </div>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-600">●</span>
                      <span>{dayData.available}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-red-600">●</span>
                      <span>{dayData.occupied}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-yellow-600">●</span>
                      <span>{dayData.maintenance}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Room List */}
          <div className="mt-6">
            <h4 className="font-medium text-nude-900 mb-3">Rooms for {selectedDate}</h4>
            <div className="space-y-2">
              {rooms.map(room => (
                <div
                  key={room.id}
                  className="flex items-center justify-between p-3 bg-nude-50 rounded-lg hover:bg-nude-100 transition-colors cursor-pointer"
                  onClick={() => onRoomSelect?.(room)}
                >
                  <div className="flex items-center space-x-3">
                    <Bed className="w-4 h-4 text-nude-600" />
                    <div>
                      <div className="font-medium text-nude-900">Room {room.number}</div>
                      <div className="text-sm text-nude-600">{room.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-nude-900">N$ {room.price}</div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      room.status === 'available' ? 'bg-green-100 text-green-800' :
                      room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {room.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface GuestProfileCardProps {
  guest: {
    name: string;
    email: string;
    phone: string;
    preferences: string[];
    loyaltyTier: string;
    totalStays: number;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

export function GuestProfileCard({ guest, onEdit, onDelete }: GuestProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-nude-900">Guest Profile</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Guest Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-nude-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {guest.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-nude-900">{guest.name}</h3>
              <p className="text-nude-600">{guest.email}</p>
              <p className="text-sm text-nude-500">{guest.phone}</p>
            </div>
          </div>
          
          {/* Guest Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-nude-900 mb-2">Preferences</h4>
              <div className="space-y-1">
                {guest.preferences.map((pref, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-nude-700">
                    <div className="w-2 h-2 bg-nude-600 rounded-full"></div>
                    {pref}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-nude-900 mb-2">Loyalty Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-nude-600">Tier:</span>
                  <span className="text-sm font-medium text-nude-900">{guest.loyaltyTier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-nude-600">Total Stays:</span>
                  <span className="text-sm font-medium text-nude-900">{guest.totalStays}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface RevenueAnalyticsChartProps {
  data: Array<{
    date: string;
    revenue: number;
    bookings: number;
  }>;
  period: 'daily' | 'weekly' | 'monthly';
}

export function RevenueAnalyticsChart({ data, period }: RevenueAnalyticsChartProps) {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-nude-900">Revenue Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <div className="h-64 flex items-end space-x-2">
            {data.map((item, index) => {
              const height = (item.revenue / maxRevenue) * 200;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-nude-600 rounded-t transition-all hover:bg-nude-700"
                    style={{ height: `${height}px` }}
                    title={`${item.date}: N$ ${item.revenue.toLocaleString()}`}
                  ></div>
                  <div className="text-xs text-nude-600 mt-2 transform -rotate-45 origin-left">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-nude-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-nude-900">
                N$ {data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
              </div>
              <div className="text-sm text-nude-600">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-nude-900">
                {data.reduce((sum, item) => sum + item.bookings, 0)}
              </div>
              <div className="text-sm text-nude-600">Total Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-nude-900">
                N$ {Math.round(data.reduce((sum, item) => sum + item.revenue, 0) / data.length).toLocaleString()}
              </div>
              <div className="text-sm text-nude-600">Average Revenue</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface QROrderingInterfaceProps {
  onOrder?: (order: any) => void;
}

export function QROrderingInterface({ onOrder }: QROrderingInterfaceProps) {
  const [cart, setCart] = useState<Array<{ id: number; name: string; price: number; quantity: number }>>([]);
  
  const menuItems = [
    { id: 1, name: 'Grilled Chicken', price: 150, category: 'Main Course' },
    { id: 2, name: 'Caesar Salad', price: 80, category: 'Salad' },
    { id: 3, name: 'Chocolate Cake', price: 60, category: 'Dessert' },
    { id: 4, name: 'Fresh Juice', price: 35, category: 'Beverage' },
  ];

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Menu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-nude-900 flex items-center">
            <QrCode className="w-5 h-5 mr-2" />
            QR Menu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {menuItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-nude-50 rounded-lg">
                <div>
                  <div className="font-medium text-nude-900">{item.name}</div>
                  <div className="text-sm text-nude-600">{item.category}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-lg font-semibold text-nude-900">N$ {item.price}</div>
                  <Button size="sm" onClick={() => addToCart(item)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-nude-900">Your Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-nude-600">
                Your cart is empty
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-nude-50 rounded-lg">
                      <div>
                        <div className="font-medium text-nude-900">{item.name}</div>
                        <div className="text-sm text-nude-600">N$ {item.price} each</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-nude-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-nude-900">Total:</span>
                    <span className="text-lg font-bold text-nude-900">N$ {total}</span>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => onOrder?.(cart)}
                  >
                    Place Order
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}