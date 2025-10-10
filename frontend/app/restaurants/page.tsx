"use client";
'use client';

/**
 * Restaurants Management Page
 * Main page for managing restaurants
 */

import React, { useState } from 'react';
import { useRestaurants } from '@/src/hooks/useRestaurants';
import { RestaurantList } from '@/src/components/restaurant/RestaurantList';
import { RestaurantForm } from '@/src/components/restaurant/RestaurantForm';
import { ModalForm } from '@/src/components/ui/modal';
import { RestaurantCard as RestaurantCardType, RestaurantFormData } from '@/src/types/restaurant';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function RestaurantsPage() {
  const { restaurants, loading, error, createRestaurant, updateRestaurant, deleteRestaurant } = useRestaurants();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantCardType | null>(null);

  const handleCreate = () => {
    setSelectedRestaurant(null);
    setShowCreateModal(true);
  };

  const handleEdit = (restaurant: RestaurantCardType) => {
    setSelectedRestaurant(restaurant);
    setShowEditModal(true);
  };

  const handleView = (restaurant: RestaurantCardType) => {
    setSelectedRestaurant(restaurant);
    setShowViewModal(true);
  };

  const handleDelete = async (restaurant: RestaurantCardType) => {
    if (confirm(`Are you sure you want to delete "${restaurant.name}"? This action cannot be undone.`)) {
      try {
        await deleteRestaurant(restaurant.id);
      } catch (error) {
        console.error('Failed to delete restaurant:', error);
        alert('Failed to delete restaurant. Please try again.');
      }
    }
  };

  const handleCreateSubmit = async (data: RestaurantFormData) => {
    try {
      await createRestaurant(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create restaurant:', error);
      throw error;
    }
  };

  const handleModalSubmit = async (formData: FormData) => {
    // Convert FormData to RestaurantFormData
    const data: RestaurantFormData = {
      restaurant_name: formData.get('restaurant_name') as string,
      is_active: formData.get('is_active') === 'true'
    };
    await handleCreateSubmit(data);
  };

  const handleRestaurantFormSubmit = async (data: RestaurantFormData) => {
    await handleCreateSubmit(data);
  };

  const handleEditModalSubmit = async (formData: FormData) => {
    if (!selectedRestaurant) return;
    // Convert FormData to RestaurantFormData
    const data: RestaurantFormData = {
      restaurant_name: formData.get('restaurant_name') as string,
      is_active: formData.get('is_active') === 'true'
    };
    await handleEditSubmit(data);
  };

  const handleEditSubmit = async (data: RestaurantFormData) => {
    if (!selectedRestaurant) return;
    
    try {
      await updateRestaurant(selectedRestaurant.id, data);
      setShowEditModal(false);
      setSelectedRestaurant(null);
    } catch (error) {
      console.error('Failed to update restaurant:', error);
      throw error;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Restaurants</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <RestaurantList
          restaurants={restaurants}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onCreate={handleCreate}
        />
      </div>

      {/* Create Restaurant Modal */}
      <ModalForm
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        title="Create New Restaurant"
        description="Add a new restaurant to your system"
        size="lg"
        onSubmit={handleModalSubmit}
        submitText="Create Restaurant"
        cancelText="Cancel"
      >
        <RestaurantForm
          onSubmit={handleRestaurantFormSubmit}
          onCancel={() => setShowCreateModal(false)}
          submitText="Create Restaurant"
        />
      </ModalForm>

      {/* Edit Restaurant Modal */}
      <ModalForm
        open={showEditModal}
        onOpenChange={setShowEditModal}
        title="Edit Restaurant"
        description="Update restaurant information"
        size="lg"
        onSubmit={handleEditModalSubmit}
        submitText="Update Restaurant"
        cancelText="Cancel"
      >
        {selectedRestaurant && (
          <RestaurantForm
            initialData={{
              restaurant_name: selectedRestaurant.name,
              logo_url: selectedRestaurant.logo || '',
              address: selectedRestaurant.address || '',
              phone: selectedRestaurant.phone || '',
              is_active: selectedRestaurant.isActive,
              timezone: '',
            }}
            onSubmit={handleEditSubmit}
            onCancel={() => setShowEditModal(false)}
            submitText="Update Restaurant"
          />
        )}
      </ModalForm>

      {/* View Restaurant Modal */}
      <ModalForm
        open={showViewModal}
        onOpenChange={setShowViewModal}
        title="Restaurant Details"
        description="View restaurant information"
        size="lg"
        onSubmit={() => setShowViewModal(false)}
        submitText="Close"
        cancelText=""
      >
        {selectedRestaurant && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {selectedRestaurant.logo ? (
                <img
                  src={selectedRestaurant.logo}
                  alt={`${selectedRestaurant.name} logo`}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-400">
                    {selectedRestaurant.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedRestaurant.name}</h3>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    selectedRestaurant.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {selectedRestaurant.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {selectedRestaurant.address && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <p className="text-gray-900">{selectedRestaurant.address}</p>
                </div>
              )}
              
              {selectedRestaurant.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{selectedRestaurant.phone}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Created</label>
                <p className="text-gray-900">
                  {new Date(selectedRestaurant.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </ModalForm>
    </div>
  );
}
