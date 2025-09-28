/**
 * Restaurant List Component
 * Displays a list of restaurants with search and filter capabilities
 */

import React, { useState } from 'react';
import { RestaurantCard as RestaurantCardType } from '@/src/types/restaurant';
import { RestaurantCard } from './RestaurantCard';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Search, Filter, Plus, Grid, List } from 'lucide-react';

interface RestaurantListProps {
  restaurants: RestaurantCardType[];
  loading?: boolean;
  onEdit?: (restaurant: RestaurantCardType) => void;
  onDelete?: (restaurant: RestaurantCardType) => void;
  onView?: (restaurant: RestaurantCardType) => void;
  onCreate?: () => void;
  className?: string;
}

export function RestaurantList({
  restaurants,
  loading = false,
  onEdit,
  onDelete,
  onView,
  onCreate,
  className = '',
}: RestaurantListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter restaurants based on search and filter criteria
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.phone?.includes(searchQuery);
    
    const matchesFilter = filterActive === null || restaurant.isActive === filterActive;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Restaurants</h2>
          <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Restaurants</h2>
          <p className="text-gray-600">
            {filteredRestaurants.length} of {restaurants.length} restaurants
          </p>
        </div>
        
        {onCreate && (
          <Button
            onClick={onCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Restaurant
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Button
            variant={filterActive === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterActive(null)}
          >
            All
          </Button>
          <Button
            variant={filterActive === true ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterActive(true)}
          >
            Active
          </Button>
          <Button
            variant={filterActive === false ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterActive(false)}
          >
            Inactive
          </Button>
        </div>

        {/* View Mode */}
        <div className="flex items-center space-x-1">
          <Button
            variant={viewMode === 'grid' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Results */}
      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || filterActive !== null
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first restaurant.'}
          </p>
          {onCreate && (
            <Button
              onClick={onCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Restaurant
            </Button>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              showActions={true}
              className={viewMode === 'list' ? 'flex' : ''}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RestaurantList;
