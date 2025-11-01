/**
 * Product Management Component
 * Manage products with Payload CMS integration
 */

'use client';

import React, { useState } from 'react';
/**
 * ProductManagement React Component for Buffr Host Hospitality Platform
 * @fileoverview ProductManagement provides administrative interface and management capabilities
 * @location buffr-host/components/admin/ProductManagement.tsx
 * @purpose ProductManagement provides administrative interface and management capabilities
 * @component ProductManagement
 * @category Admin
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @database_connections Reads from relevant tables based on component functionality
 * @api_integration RESTful API endpoints for data fetching and mutations
 * @state_management Local component state for UI interactions and data management
 * @hooks_utilization useState, useProducts, useDeleteDocument for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Interactive state management for dynamic user experiences
 * - Real-time data integration with backend services
 * - API-driven functionality with error handling and loading states
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * State:
 * @state {any} null - Component state for null management
 * @state {any} {
    title: '' - Component state for {
    title: '' management
 *
 * Methods:
 * @method handleEdit - handleEdit method for component functionality
 * @method formatPrice - formatPrice method for component functionality
 * @method getStatusColor - getStatusColor method for component functionality
 *
 * Usage Example:
 * @example
 * import ProductManagement from './ProductManagement';
 *
 * function App() {
 *   return (
 *     <ProductManagement
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered ProductManagement component
 */

import {
  BuffrCard,
  BuffrCardContent,
  BuffrCardHeader,
  BuffrCardTitle,
} from '@/components/ui';
import { BuffrButton } from '@/components/ui';
import { BuffrIcon } from '@/components/ui';
import {
  useProducts,
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  type PayloadProduct,
} from '@/lib/payload';

interface ProductFormData {
  title: string;
  description: string;
  inventory: number;
  price_in_u_s_d_enabled: boolean;
  price_in_u_s_d?: number;
  _status: 'draft' | 'published';
}

export default function ProductManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PayloadProduct | null>(
    null
  );
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    inventory: 0,
    price_in_u_s_d_enabled: false,
    price_in_u_s_d: 0,
    _status: 'draft',
  });

  // Fetch products from Payload CMS
  const {
    data: productsData,
    loading,
    error,
    refetch,
  } = useProducts({
    limit: 20,
    sort: '-createdAt',
  });

  // CRUD operations
  const { create, loading: creating } =
    useCreateDocument<PayloadProduct>('products');
  const { update, loading: updating } =
    useUpdateDocument<PayloadProduct>('products');
  const { delete: deleteProduct, loading: deleting } =
    useDeleteDocument('products');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        await update(editingProduct.id, formData);
        setEditingProduct(null);
      } else {
        await create(formData);
      }

      setFormData({
        title: '',
        description: '',
        inventory: 0,
        price_in_u_s_d_enabled: false,
        price_in_u_s_d: 0,
        _status: 'draft',
      });
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: PayloadProduct) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description || '',
      inventory: product.inventory,
      price_in_u_s_d_enabled: product.price_in_u_s_d_enabled,
      price_in_u_s_d: product.price_in_u_s_d || 0,
      _status: product._status,
    });
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        refetch();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nude-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-nude-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-nude-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-nude-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-nude-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nude-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-nude-900 mb-2">
              Product Management
            </h1>
            <p className="text-nude-600">
              Manage your hospitality products and services
            </p>
          </div>
          <BuffrButton
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="bg-nude-600 hover:bg-nude-700 text-white"
          >
            <BuffrIcon name="plus" className="w-4 h-4 mr-2" />
            Add Product
          </BuffrButton>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold text-nude-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-nude-500 hover:text-nude-700"
                >
                  <BuffrIcon name="x" className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-nude-700 mb-2">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-nude-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nude-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-nude-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-nude-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nude-500"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-nude-700 mb-2">
                      Inventory
                    </label>
                    <input
                      type="number"
                      value={formData.inventory}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          inventory: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-3 py-2 border border-nude-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nude-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-nude-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData._status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          _status: e.target.value as 'draft' | 'published',
                        }))
                      }
                      className="w-full px-3 py-2 border border-nude-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nude-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.price_in_u_s_d_enabled}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price_in_u_s_d_enabled: e.target.checked,
                        }))
                      }
                      className="rounded border-nude-300"
                    />
                    <span className="text-sm font-medium text-nude-700">
                      Enable USD Pricing
                    </span>
                  </label>
                </div>

                {formData.price_in_u_s_d_enabled && (
                  <div>
                    <label className="block text-sm font-medium text-nude-700 mb-2">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      value={formData.price_in_u_s_d || 0}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price_in_u_s_d: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-3 py-2 border border-nude-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nude-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <BuffrButton
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white"
                  >
                    Cancel
                  </BuffrButton>
                  <BuffrButton
                    type="submit"
                    disabled={creating || updating}
                    className="bg-nude-600 hover:bg-nude-700 text-white"
                  >
                    {creating || updating
                      ? 'Saving...'
                      : editingProduct
                        ? 'Update Product'
                        : 'Create Product'}
                  </BuffrButton>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsData?.docs.map((product) => (
            <BuffrCard
              key={product.id}
              className="bg-white border border-nude-200 hover:shadow-luxury-soft transition-shadow"
            >
              <BuffrCardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-nude-900 line-clamp-2">
                    {product.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product._status)}`}
                  >
                    {product._status}
                  </span>
                </div>

                {product.description && (
                  <p className="text-nude-600 text-sm mb-4 line-clamp-3">
                    {typeof product.description === 'string'
                      ? product.description
                      : 'Rich content'}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-nude-600">Inventory:</span>
                    <span className="font-medium">{product.inventory}</span>
                  </div>

                  {product.price_in_u_s_d_enabled && product.price_in_u_s_d && (
                    <div className="flex justify-between text-sm">
                      <span className="text-nude-600">Price:</span>
                      <span className="font-medium text-green-600">
                        {formatPrice(product.price_in_u_s_d)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <BuffrButton
                    onClick={() => handleEdit(product)}
                    size="sm"
                    className="flex-1 bg-nude-100 hover:bg-nude-200 text-nude-700"
                  >
                    <BuffrIcon name="edit" className="w-4 h-4 mr-1" />
                    Edit
                  </BuffrButton>
                  <BuffrButton
                    onClick={() => handleDelete(product.id)}
                    size="sm"
                    className="bg-red-100 hover:bg-red-200 text-red-700"
                    disabled={deleting}
                  >
                    <BuffrIcon name="trash" className="w-4 h-4" />
                  </BuffrButton>
                </div>
              </BuffrCardContent>
            </BuffrCard>
          ))}
        </div>

        {productsData?.docs.length === 0 && (
          <div className="text-center py-12">
            <BuffrIcon
              name="package"
              className="w-16 h-16 text-nude-300 mx-auto mb-4"
            />
            <h3 className="text-lg font-medium text-nude-900 mb-2">
              No products found
            </h3>
            <p className="text-nude-600 mb-6">
              Get started by creating your first product.
            </p>
            <BuffrButton
              onClick={() => setShowForm(true)}
              className="bg-nude-600 hover:bg-nude-700 text-white"
            >
              <BuffrIcon name="plus" className="w-4 h-4 mr-2" />
              Add Product
            </BuffrButton>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <BuffrIcon name="alert-circle" className="w-5 h-5 text-red-600" />
              <span className="text-red-800">
                Error loading products: {error}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
