"use client";
export const dynamic = "force-dynamic";
import React, { useState } from "react";
import { useBookings, useCustomers, useAuth } from "@/src/hooks/useSupabase";
import { PageHeader, ActionButton, Alert } from "@/src/components/ui";
import { Calendar, Plus, Edit, Trash2, Search, CheckCircle, Clock, XCircle, User } from "lucide-react";
import { Booking, Customer } from "@/src/lib/supabase";

const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const { data: bookings, loading, error, insert, update, remove } = useBookings();
  const { data: customers } = useCustomers();
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleAddBooking = async (data: Partial<Booking>) => {
    try {
      await insert({
        ...data,
        property_id: user?.user_metadata?.property_id || 'default-property',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setAlert({ message: 'Booking added successfully!', type: 'success' });
      setShowForm(false);
    } catch (err) {
      setAlert({ message: 'Failed to add booking', type: 'error' });
    }
  };

  const handleUpdateBooking = async (id: string, data: Partial<Booking>) => {
    try {
      await update(id, {
        ...data,
        updated_at: new Date().toISOString()
      });
      setAlert({ message: 'Booking updated successfully!', type: 'success' });
      setEditingBooking(null);
    } catch (err) {
      setAlert({ message: 'Failed to update booking', type: 'error' });
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await remove(id);
        setAlert({ message: 'Booking deleted successfully!', type: 'success' });
      } catch (err) {
        setAlert({ message: 'Failed to delete booking', type: 'error' });
      }
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown Customer';
  };

  const filteredBookings = bookings.filter(booking =>
    getCustomerName(booking.customer_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.special_requests?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending': return <Clock className="w-4 h-4 text-warning" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-error" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-info" />;
      default: return <Clock className="w-4 h-4 text-base-content/60" />;
    }
  };

  if (loading) return <div className="text-center py-8">Loading bookings...</div>;
  if (error) return <div className="text-center py-8 text-error">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Booking Management"
        description="Manage customer bookings, reservations, and scheduling."
        icon={<Calendar className="h-4 w-4" />}
        actions={
          <ActionButton
            onClick={() => {
              setEditingBooking(null);
              setShowForm(true);
            }}
            variant="primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Booking
          </ActionButton>
        }
      />

      <div className="container mx-auto px-4 py-8">
        {alert && <Alert type={alert.type} message={alert.message} className="mb-4" />}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
        </div>

        {/* Bookings List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="card-title text-lg">Booking #{booking.id.slice(0, 8)}</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(booking.status)}
                    <span className={`badge ${
                      booking.status === 'confirmed' ? 'badge-success' :
                      booking.status === 'pending' ? 'badge-warning' :
                      booking.status === 'cancelled' ? 'badge-error' :
                      'badge-info'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm">{getCustomerName(booking.customer_id)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      {new Date(booking.check_in_date).toLocaleDateString()}
                      {booking.check_out_date && ` - ${new Date(booking.check_out_date).toLocaleDateString()}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">Amount: N$ {booking.total_amount.toLocaleString()}</span>
                  </div>
                  
                  {booking.special_requests && (
                    <p className="text-sm text-base-content/70 italic">
                      &ldquo;{booking.special_requests}&rdquo;
                    </p>
                  )}
                </div>
                
                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-sm btn-outline btn-primary"
                    onClick={() => setEditingBooking(booking)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => handleDeleteBooking(booking.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-8 text-base-content/70">
            No bookings found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
