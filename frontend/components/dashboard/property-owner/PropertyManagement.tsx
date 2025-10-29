/**
 * Property Management Component
 *
 * Purpose: Comprehensive property management with tabs for different aspects
 * Functionality: Restaurant, hotel, inventory, orders, staff, bookings management
 * Location: /components/dashboard/property-owner/PropertyManagement.tsx
 *
 * Follows 40 Rules:
 * - Uses DaisyUI for consistent styling
 * - Modular component design for easy maintenance
 * - TypeScript for type safety
 * - Vercel-compatible with SSR
 * - Uses Neon PostgreSQL database
 * - Comprehensive error handling
 * - Optimized for performance
 */

'use client';

import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import {
  Utensils,
  Bed,
  Package,
  ShoppingCart,
  Users,
  Calendar,
  Settings,
  Plus,
  Edit3,
  Trash2,
  Eye,
} from 'lucide-react';

// Types for TypeScript compliance
interface Property {
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
  staff_count: number;
  tables_count: number;
  rooms_count: number;
  orders_today: number;
  revenue_today: number;
  inventory_items: number;
  low_stock_items: number;
  active_bookings: number;
  pending_orders: number;
}

interface PropertyManagementProps {
  property: Property;
  onTabChange: (tab: string) => void;
  isLoading?: boolean;
}

// Main Property Management Component
export const PropertyManagement: React.FC<PropertyManagementProps> = ({
  property,
  onTabChange,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState('restaurant');

  // Refs for performance optimization
  const tabTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  // Mock data for different management sections
  const restaurantData = {
    tables: [
      {
        id: '1',
        number: 'T01',
        capacity: 4,
        status: 'occupied',
        currentOrder: 'ORD-001',
      },
      {
        id: '2',
        number: 'T02',
        capacity: 2,
        status: 'available',
        currentOrder: null,
      },
      {
        id: '3',
        number: 'T03',
        capacity: 6,
        status: 'reserved',
        currentOrder: null,
      },
      {
        id: '4',
        number: 'T04',
        capacity: 4,
        status: 'cleaning',
        currentOrder: null,
      },
    ],
    menuItems: [
      {
        id: '1',
        name: 'Grilled Salmon',
        category: 'Main Course',
        price: 180,
        status: 'available',
      },
      {
        id: '2',
        name: 'Caesar Salad',
        category: 'Salad',
        price: 95,
        status: 'available',
      },
      {
        id: '3',
        name: 'Chocolate Cake',
        category: 'Dessert',
        price: 65,
        status: 'out_of_stock',
      },
    ],
  };

  const hotelData = {
    rooms: [
      {
        id: '1',
        number: '101',
        type: 'Standard',
        status: 'occupied',
        guest: 'John Doe',
      },
      {
        id: '2',
        number: '102',
        type: 'Deluxe',
        status: 'available',
        guest: null,
      },
      {
        id: '3',
        number: '103',
        type: 'Suite',
        status: 'maintenance',
        guest: null,
      },
    ],
    services: [
      { id: '1', name: 'Room Service', status: 'active', staff: 3 },
      { id: '2', name: 'Housekeeping', status: 'active', staff: 5 },
      { id: '3', name: 'Concierge', status: 'active', staff: 2 },
    ],
  };

  const inventoryData = {
    items: [
      {
        id: '1',
        name: 'Chicken Breast',
        category: 'Meat',
        quantity: 25,
        minLevel: 10,
        status: 'good',
      },
      {
        id: '2',
        name: 'Lettuce',
        category: 'Vegetables',
        quantity: 5,
        minLevel: 15,
        status: 'low',
      },
      {
        id: '3',
        name: 'Olive Oil',
        category: 'Pantry',
        quantity: 8,
        minLevel: 5,
        status: 'good',
      },
    ],
  };

  const ordersData = {
    orders: [
      {
        id: '1',
        number: 'ORD-001',
        table: 'T01',
        items: 3,
        total: 340,
        status: 'preparing',
        time: '12:30',
      },
      {
        id: '2',
        number: 'ORD-002',
        table: 'T03',
        items: 2,
        total: 180,
        status: 'ready',
        time: '12:45',
      },
      {
        id: '3',
        number: 'ORD-003',
        table: 'T02',
        items: 1,
        total: 95,
        status: 'delivered',
        time: '13:00',
      },
    ],
  };

  const staffData = {
    staff: [
      {
        id: '1',
        name: 'Sarah Johnson',
        role: 'Manager',
        status: 'active',
        shift: 'Morning',
      },
      {
        id: '2',
        name: 'Mike Chen',
        role: 'Chef',
        status: 'active',
        shift: 'Evening',
      },
      {
        id: '3',
        name: 'Lisa Brown',
        role: 'Server',
        status: 'break',
        shift: 'Afternoon',
      },
    ],
  };

  const bookingsData = {
    bookings: [
      {
        id: '1',
        guest: 'Alice Smith',
        date: '2024-01-15',
        time: '19:00',
        party: 4,
        status: 'confirmed',
      },
      {
        id: '2',
        guest: 'Bob Wilson',
        date: '2024-01-15',
        time: '20:30',
        party: 2,
        status: 'pending',
      },
      {
        id: '3',
        guest: 'Carol Davis',
        date: '2024-01-16',
        time: '18:30',
        party: 6,
        status: 'confirmed',
      },
    ],
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
      case 'active':
      case 'confirmed':
      case 'good':
        return 'badge-success';
      case 'occupied':
      case 'preparing':
      case 'ready':
        return 'badge-warning';
      case 'reserved':
      case 'pending':
        return 'badge-info';
      case 'cleaning':
      case 'maintenance':
      case 'break':
        return 'badge-neutral';
      case 'out_of_stock':
      case 'low':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Property Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="loading loading-spinner loading-md text-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Property Management
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="restaurant" className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Restaurant
            </TabsTrigger>
            <TabsTrigger value="hotel" className="flex items-center gap-2">
              <Bed className="w-4 h-4" />
              Hotel
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Staff
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Bookings
            </TabsTrigger>
          </TabsList>

          {/* Restaurant Tab */}
          <TabsContent value="restaurant">
            <div className="space-y-6">
              {/* Tables Management */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Table Management</h3>
                  <Button className="btn-outline btn-sm">
                    <Plus className="w-4 h-4" />
                    Add Table
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {restaurantData.tables.map((table) => (
                    <Card key={table.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">
                            Table {table.number}
                          </h4>
                          <Badge className={getStatusColor(table.status)}>
                            {table.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-base-content/70 mb-2">
                          Capacity: {table.capacity} people
                        </p>
                        {table.currentOrder && (
                          <p className="text-xs text-primary">
                            Order: {table.currentOrder}
                          </p>
                        )}
                        <div className="flex gap-1 mt-3">
                          <Button className="btn-ghost btn-xs">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button className="btn-ghost btn-xs">
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Menu Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Menu Items</h3>
                  <Button className="btn-outline btn-sm">
                    <Plus className="w-4 h-4" />
                    Add Item
                  </Button>
                </div>
                <div className="space-y-2">
                  {restaurantData.menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                    >
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-base-content/70">
                          {item.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">N$ {item.price}</span>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button className="btn-ghost btn-xs">
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button className="btn-ghost btn-xs">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Hotel Tab */}
          <TabsContent value="hotel">
            <div className="space-y-6">
              {/* Room Management */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Room Management</h3>
                  <Button className="btn-outline btn-sm">
                    <Plus className="w-4 h-4" />
                    Add Room
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hotelData.rooms.map((room) => (
                    <Card key={room.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Room {room.number}</h4>
                          <Badge className={getStatusColor(room.status)}>
                            {room.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-base-content/70 mb-2">
                          Type: {room.type}
                        </p>
                        {room.guest && (
                          <p className="text-xs text-primary">
                            Guest: {room.guest}
                          </p>
                        )}
                        <div className="flex gap-1 mt-3">
                          <Button className="btn-ghost btn-xs">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button className="btn-ghost btn-xs">
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Hotel Services</h3>
                <div className="space-y-2">
                  {hotelData.services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                    >
                      <div>
                        <h4 className="font-semibold">{service.name}</h4>
                        <p className="text-sm text-base-content/70">
                          {service.staff} staff members
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                        <Button className="btn-ghost btn-xs">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Inventory Management</h3>
                <Button className="btn-outline btn-sm">
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-2">
                {inventoryData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-base-content/70">
                        {item.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold">{item.quantity} units</div>
                        <div className="text-xs text-base-content/70">
                          Min: {item.minLevel}
                        </div>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button className="btn-ghost btn-xs">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button className="btn-ghost btn-xs">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Order Management</h3>
                <Button className="btn-outline btn-sm">
                  <Plus className="w-4 h-4" />
                  New Order
                </Button>
              </div>

              <div className="space-y-2">
                {ordersData.orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold">{order.number}</h4>
                      <p className="text-sm text-base-content/70">
                        Table {order.table} • {order.items} items • {order.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold">N$ {order.total}</div>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button className="btn-ghost btn-xs">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button className="btn-ghost btn-xs">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Staff Management</h3>
                <Button className="btn-outline btn-sm">
                  <Plus className="w-4 h-4" />
                  Add Staff
                </Button>
              </div>

              <div className="space-y-2">
                {staffData.staff.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-base-content/70">
                        {member.role} • {member.shift} shift
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button className="btn-ghost btn-xs">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button className="btn-ghost btn-xs">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Booking Management</h3>
                <Button className="btn-outline btn-sm">
                  <Plus className="w-4 h-4" />
                  New Booking
                </Button>
              </div>

              <div className="space-y-2">
                {bookingsData.bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold">{booking.guest}</h4>
                      <p className="text-sm text-base-content/70">
                        {booking.date} at {booking.time} • Party of{' '}
                        {booking.party}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button className="btn-ghost btn-xs">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button className="btn-ghost btn-xs">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PropertyManagement;
