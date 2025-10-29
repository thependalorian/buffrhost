'use client';

import React, { useState, useEffect } from 'react';
import { usePayloadAPI } from '@/hooks/usePayloadAPI';
import { PropertyOwnerBankingDetails } from '../PropertyOwnerBankingDetails';
import type { User } from '@/payload-types';

interface PropertyOwnerDashboardProps {
  user: User;
}

interface Property {
  id: string;
  name: string;
  type: string;
  status: string;
  total_revenue: number;
  location: string;
  rating: number;
  hotel_details?: {
    total_rooms: number;
  };
}

interface Booking {
  id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  total_amount: number;
  status: string;
  guest_name?: string;
  property?: {
    name: string;
  };
  check_in_date: string;
  created_at: string;
}

interface Order {
  id: string;
  property_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  customer_name: string;
  property?: {
    name: string;
  };
  items?: (string | number | boolean)[];
  total: number;
}

interface Revenue {
  totalRevenue: number;
  totalBookings: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  totalOrders: number;
  monthToDate: number;
  occupancyRate: number;
}

export const PropertyOwnerDashboard = ({
  user,
}: PropertyOwnerDashboardProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [revenue, setRevenue] = useState<Revenue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch owner's properties from actual database
        const [propertiesRes, bookingsRes, ordersRes] = await Promise.all([
          fetch(
            `/api/v1/properties?where[owner_id][equals]=${user.id}&limit=50`
          ),
          fetch(
            `/api/v1/bookings?where[property.owner_id][equals]=${user.id}&limit=20&sort=-created_at`
          ),
          fetch(
            `/api/v1/orders?where[property.owner_id][equals]=${user.id}&limit=20&sort=-created_at`
          ),
        ]);

        const propertiesData = await propertiesRes.json();
        const bookingsData = await bookingsRes.json();
        const ordersData = await ordersRes.json();

        setProperties(propertiesData.docs || []);
        setBookings(bookingsData.docs || []);
        setOrders(ordersData.docs || []);

        // Calculate revenue from actual data
        const totalRevenue = properties.reduce(
          (sum, prop) => sum + (prop.total_revenue || 0),
          0
        );
        const totalBookings = bookings.length;
        const totalOrders = orders.length;

        setRevenue({
          totalRevenue,
          totalBookings,
          totalOrders,
          monthToDate: calculateMonthToDate(bookings, orders),
          occupancyRate: calculateOccupancyRate(properties, bookings),
          monthlyRevenue: calculateMonthToDate(bookings, orders),
          yearlyRevenue: totalRevenue,
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  if (loading) {
    return <div className="loading-spinner">Loading your dashboard...</div>;
  }

  return (
    <div className="property-owner-dashboard">
      {/* Key Metrics Row */}
      <div className="metrics-grid">
        <MetricCard
          title="Total Revenue"
          value={`N$${revenue?.totalRevenue?.toLocaleString() || '0'}`}
          icon="💰"
          color="green"
        />
        <MetricCard
          title="Total Bookings"
          value={revenue?.totalBookings || 0}
          icon="📅"
          color="blue"
        />
        <MetricCard
          title="Total Orders"
          value={revenue?.totalOrders || 0}
          icon="🍽️"
          color="purple"
        />
        <MetricCard
          title="Properties"
          value={properties.length}
          icon="🏨"
          color="orange"
        />
      </div>

      {/* Properties Overview */}
      <div className="dashboard-grid">
        <div className="dashboard-card properties-card">
          <h3>Your Properties</h3>
          <div className="properties-list">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
            {properties.length === 0 && (
              <p className="no-properties">
                No properties found.{' '}
                <a href="/admin/collections/properties/create">
                  Create your first property
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="dashboard-card bookings-card">
          <h3>Recent Bookings</h3>
          <div className="bookings-list">
            {bookings.slice(0, 5).map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
            {bookings.length === 0 && (
              <p className="no-bookings">No recent bookings</p>
            )}
          </div>
          <a href="/admin/collections/bookings" className="view-all-link">
            View All Bookings →
          </a>
        </div>

        {/* Recent Orders */}
        <div className="dashboard-card orders-card">
          <h3>Recent Orders</h3>
          <div className="orders-list">
            {orders.slice(0, 5).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
            {orders.length === 0 && (
              <p className="no-orders">No recent orders</p>
            )}
          </div>
          <a href="/admin/collections/orders" className="view-all-link">
            View All Orders →
          </a>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card actions-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <a
              href="/admin/collections/properties/create"
              className="action-btn primary"
            >
              Add Property
            </a>
            <a
              href="/admin/collections/bookings/create"
              className="action-btn secondary"
            >
              Create Booking
            </a>
            <a
              href="/admin/collections/orders/create"
              className="action-btn secondary"
            >
              Create Order
            </a>
            <a
              href="/admin/collections/sofia-agents"
              className="action-btn secondary"
            >
              Sofia AI Setup
            </a>
          </div>
        </div>
      </div>

      {/* Banking Details Section */}
      <div className="dashboard-section">
        <PropertyOwnerBankingDetails
          userId={user.id.toString()}
          userRole={user.role}
        />
      </div>
    </div>
  );
};

// Helper Components
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const MetricCard = ({ title, value, icon, color }: MetricCardProps) => (
  <div className={`metric-card ${color}`}>
    <div className="metric-icon">{icon}</div>
    <div className="metric-content">
      <h4>{title}</h4>
      <div className="metric-value">{value}</div>
    </div>
  </div>
);

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => (
  <div className="property-card">
    <div className="property-info">
      <h4>{property.name}</h4>
      <p>
        {property.type} • {property.location}
      </p>
      <p>Revenue: N${property.total_revenue?.toLocaleString() || '0'}</p>
      <p>Rating: {property.rating || 'N/A'}/5</p>
    </div>
    <div className="property-status">
      <span className={`status-badge ${property.status}`}>
        {property.status}
      </span>
    </div>
  </div>
);

interface BookingCardProps {
  booking: Booking;
}

const BookingCard = ({ booking }: BookingCardProps) => (
  <div className="booking-card">
    <div className="booking-info">
      <h4>{booking.guest_name || 'Guest'}</h4>
      <p>{booking.property?.name}</p>
      <p>Check-in: {formatDate(booking.check_in_date)}</p>
      <p>Amount: N${booking.total_amount?.toLocaleString() || '0'}</p>
    </div>
    <div className="booking-status">
      <span className={`status-badge ${booking.status}`}>{booking.status}</span>
    </div>
  </div>
);

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => (
  <div className="order-card">
    <div className="order-info">
      <h4>{order.customer_name}</h4>
      <p>{order.property?.name}</p>
      <p>Items: {order.items?.length || 0}</p>
      <p>Total: N${order.total?.toLocaleString() || '0'}</p>
    </div>
    <div className="order-status">
      <span className={`status-badge ${order.status}`}>{order.status}</span>
    </div>
  </div>
);

// Helper functions
const calculateMonthToDate = (bookings: Booking[], orders: Order[]) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthBookings = bookings.filter(
    (b) => new Date(b.created_at) >= startOfMonth
  );
  const monthOrders = orders.filter(
    (o) => new Date(o.created_at) >= startOfMonth
  );

  const bookingRevenue = monthBookings.reduce(
    (sum, b) => sum + (b.total_amount || 0),
    0
  );
  const orderRevenue = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  return bookingRevenue + orderRevenue;
};

const calculateOccupancyRate = (
  properties: Property[],
  bookings: Booking[]
) => {
  if (properties.length === 0) return 0;

  const totalRooms = properties.reduce((sum, prop) => {
    if (prop.type === 'hotel' && prop.hotel_details?.total_rooms) {
      return sum + prop.hotel_details.total_rooms;
    }
    return sum;
  }, 0);

  if (totalRooms === 0) return 0;

  const activeBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'checked_in'
  ).length;

  return Math.round((activeBookings / totalRooms) * 100);
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};
