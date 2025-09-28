/**
 * Restaurant Card Component
 * Displays restaurant information in a card format
 */

import React from 'react';
import { RestaurantCard as RestaurantCardType } from '@/src/types/restaurant';
import { MapPin, Phone, Globe, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: RestaurantCardType;
  onEdit?: (restaurant: RestaurantCardType) => void;
  onDelete?: (restaurant: RestaurantCardType) => void;
  onView?: (restaurant: RestaurantCardType) => void;
  showActions?: boolean;
  className?: string;
}

export function RestaurantCard({
  restaurant,
  onEdit,
  onDelete,
  onView,
  showActions = true,
  className = '',
}: RestaurantCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${className}`}>
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {restaurant.logo ? (
              <img
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    restaurant.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {restaurant.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-2">
              {onView && (
                <button
                  onClick={() => onView(restaurant)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(restaurant)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit restaurant"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(restaurant)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete restaurant"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="mt-4 space-y-2">
          {restaurant.address && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.address}</span>
            </div>
          )}
          {restaurant.phone && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{restaurant.phone}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Created {new Date(restaurant.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
