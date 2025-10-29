'use client';
import {
  BuffrIcon,
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrButton,
  BuffrInput,
  BuffrTabs,
  BuffrTabsContent,
  BuffrTabsList,
  BuffrTabsTrigger,
  BuffrBadge,
  BuffrSelect,
} from '@/components/ui';
/**
 * Property Management Dashboard Component
 *
 * Comprehensive property management interface for property owners
 * Features: Property profiles, rooms, services, menu items, images, analytics
 * Location: components/dashboard/property-owner/property-management.tsx
 */

import { useState, useEffect } from 'react';
interface Property {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  total_reviews: number;
  status: string;
  featured: boolean;
  verified: boolean;
  created_at: string;
  updated_at: string;
  // Enhanced fields
  property_code: string;
  check_in_time: string;
  check_out_time: string;
  capacity: number;
  price_range: string;
  cuisine_type: string;
  star_rating: number;
  opening_hours: unknown;
  social_media: unknown;
  amenities: (string | number | boolean)[];
  images: (string | number | boolean)[];
  rooms: (string | number | boolean)[];
  services: (string | number | boolean)[];
  menu_items: (string | number | boolean)[];
}

interface PropertyManagementProps {
  propertyId: string;
  tenantId?: string;
}

export default function PropertyManagement({
  propertyId,
  tenantId = 'default-tenant',
}: PropertyManagementProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'rooms'
    | 'services'
    | 'menu'
    | 'images'
    | 'analytics'
    | 'settings'
  >('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPropertyData();
  }, [propertyId]);

  const fetchPropertyData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/secure/properties?property_id=${propertyId}&include_details=true`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch property data: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        const propertyData = data.data[0];

        // Transform database data to component format
        const transformedProperty: Property = {
          id: propertyData.id,
          name: propertyData.name,
          type: propertyData.type,
          location: propertyData.location,
          description: propertyData.description,
          address: propertyData.address,
          phone: propertyData.phone,
          email: propertyData.email,
          website: propertyData.website,
          rating: propertyData.average_rating || 0,
          total_reviews: propertyData.total_reviews || 0,
          status: propertyData.status,
          featured: propertyData.featured || false,
          verified: propertyData.verified || false,
          created_at: propertyData.created_at,
          updated_at: propertyData.updated_at,
          property_code: propertyData.property_code,
          check_in_time: propertyData.check_in_time,
          check_out_time: propertyData.check_out_time,
          capacity: propertyData.capacity,
          price_range: propertyData.price_range,
          cuisine_type: propertyData.cuisine_type,
          star_rating: propertyData.star_rating,
          opening_hours: propertyData.opening_hours,
          social_media: propertyData.social_media,
          amenities: propertyData.amenities || [],
          images: propertyData.images || [],
          rooms: propertyData.rooms || [],
          services: propertyData.services || [],
          menu_items: propertyData.menu_items || [],
        };

        setProperty(transformedProperty);
      } else {
        throw new Error(data.error || 'Property not found');
      }
    } catch (error) {
      console.error('Error fetching property data:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to fetch property data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return <BuffrIcon name="building-2" className="h-5 w-5" />;
      case 'restaurant':
        return <BuffrIcon name="utensils" className="h-5 w-5" />;
      case 'cafe':
        return <BuffrIcon name="utensils" className="h-5 w-5" />;
      default:
        return <BuffrIcon name="building-2" className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      active: { color: 'bg-green-100 text-success', label: 'Active' },
      pending: { color: 'bg-yellow-100 text-warning', label: 'Pending' },
      inactive: { color: 'bg-red-100 text-error', label: 'Inactive' },
      maintenance: {
        color: 'bg-orange-100 text-orange-800',
        label: 'Maintenance',
      },
    };

    const config = statusConfig[status] || statusConfig['pending'];
    if (!config) return null;

    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nude-600 mx-auto mb-4"></div>
          <p className="text-nude-600">Loading property management...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-nude-900 mb-2">
          Error Loading Property
        </h3>
        <p className="text-nude-600 mb-4">{error || 'Property not found'}</p>
        <Button onClick={fetchPropertyData}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Property Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {getPropertyTypeIcon(property.type)}
              <div>
                <CardTitle className="text-2xl">{property.name}</CardTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <BuffrIcon name="map-pin" className="h-4 w-4 text-nude-500" />
                  <span className="text-nude-600">{property.location}</span>
                  {getStatusBadge(property.status)}
                  {property.featured && (
                    <Badge className="bg-purple-100 text-purple-800">
                      Featured
                    </Badge>
                  )}
                  {property.verified && (
                    <Badge className="bg-blue-100 text-primary">Verified</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <BuffrIcon name="edit" className="h-4 w-4 mr-2" />
                Edit Property
              </Button>
              <Button variant="outline" size="sm">
                <BuffrIcon name="settings" className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-nude-900 mb-2">
                Contact Information
              </h4>
              <div className="space-y-1 text-sm text-nude-600">
                <div className="flex items-center space-x-2">
                  <BuffrIcon name="phone" className="h-4 w-4" />
                  <span>{property.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BuffrIcon name="mail" className="h-4 w-4" />
                  <span>{property.email}</span>
                </div>
                {property.website && (
                  <div className="flex items-center space-x-2">
                    <BuffrIcon name="globe" className="h-4 w-4" />
                    <a
                      href={property.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {property.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-nude-900 mb-2">
                Property Details
              </h4>
              <div className="space-y-1 text-sm text-nude-600">
                <div>
                  Type: <span className="capitalize">{property.type}</span>
                </div>
                {property.cuisine_type && (
                  <div>
                    Cuisine:{' '}
                    <span className="capitalize">{property.cuisine_type}</span>
                  </div>
                )}
                {property.star_rating && (
                  <div className="flex items-center space-x-1">
                    <span>Rating:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <BuffrIcon
                          name="star"
                          key={i}
                          className={`h-4 w-4 ${
                            i < property.star_rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-base-content/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {property.capacity && (
                  <div className="flex items-center space-x-1">
                    <BuffrIcon name="users" className="h-4 w-4" />
                    <span>Capacity: {property.capacity}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-nude-900 mb-2">Performance</h4>
              <div className="space-y-1 text-sm text-nude-600">
                <div className="flex items-center space-x-1">
                  <BuffrIcon name="star" className="h-4 w-4 text-yellow-400" />
                  <span>
                    {property.rating.toFixed(1)} ({property.total_reviews}{' '}
                    reviews)
                  </span>
                </div>
                <div>
                  Status: <span className="capitalize">{property.status}</span>
                </div>
                <div>
                  Code:{' '}
                  <span className="font-mono text-xs">
                    {property.property_code}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Management Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as unknown)}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Rooms
                </CardTitle>
                <BuffrIcon
                  name="bed"
                  className="h-4 w-4 text-muted-foreground"
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {property.rooms?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Available rooms</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Services</CardTitle>
                <BuffrIcon
                  name="settings"
                  className="h-4 w-4 text-muted-foreground"
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {property.services?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Active services</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Menu Items
                </CardTitle>
                <BuffrIcon
                  name="utensils"
                  className="h-4 w-4 text-muted-foreground"
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {property.menu_items?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Menu items</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Images</CardTitle>
                <BuffrIcon
                  name="camera"
                  className="h-4 w-4 text-muted-foreground"
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {property.images?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Total images</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Property updated</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New room added</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Service updated</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rooms Tab */}
        <TabsContent value="rooms" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Room Management</h3>
            <Button>
              <BuffrIcon name="plus" className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {property.rooms?.map((room: unknown) => (
              <Card key={room.id}>
                <CardContent className="card-body">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{room.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {room.room_type}
                      </p>
                    </div>
                    <Badge variant="outline">{room.status}</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>
                      Code: <span className="font-mono">{room.room_code}</span>
                    </div>
                    <div>Capacity: {room.max_occupancy} guests</div>
                    <div>Price: N${room.base_price}</div>
                    {room.size_sqm && <div>Size: {room.size_sqm} m²</div>}
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <BuffrIcon name="eye" className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <BuffrIcon name="edit" className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="col-span-full text-center py-12">
                <BuffrIcon
                  name="bed"
                  className="h-12 w-12 text-muted-foreground mx-auto mb-4"
                />
                <h3 className="text-lg font-medium mb-2">No rooms yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add rooms to start managing your property
                </p>
                <Button>
                  <BuffrIcon name="plus" className="h-4 w-4 mr-2" />
                  Add First Room
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Service Management</h3>
            <Button>
              <BuffrIcon name="plus" className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {property.services?.map((service: unknown) => (
              <Card key={service.id}>
                <CardContent className="card-body">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{service.service_name}</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {service.service_type}
                      </p>
                    </div>
                    <Badge
                      variant={service.is_available ? 'default' : 'secondary'}
                    >
                      {service.is_available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {service.price && <div>Price: N${service.price}</div>}
                    {service.duration_minutes && (
                      <div>Duration: {service.duration_minutes} min</div>
                    )}
                    {service.max_capacity && (
                      <div>Capacity: {service.max_capacity} people</div>
                    )}
                    {service.requires_booking && (
                      <div className="flex items-center space-x-1">
                        <BuffrIcon name="clock" className="h-3 w-3" />
                        <span>Booking required</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <BuffrIcon name="eye" className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <BuffrIcon name="edit" className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="col-span-full text-center py-12">
                <BuffrIcon
                  name="settings"
                  className="h-12 w-12 text-muted-foreground mx-auto mb-4"
                />
                <h3 className="text-lg font-medium mb-2">No services yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add services to offer more to your guests
                </p>
                <Button>
                  <BuffrIcon name="plus" className="h-4 w-4 mr-2" />
                  Add First Service
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Menu Tab */}
        <TabsContent value="menu" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Menu Management</h3>
            <Button>
              <BuffrIcon name="plus" className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {property.menu_items?.map((item: unknown) => (
              <Card key={item.id}>
                <CardContent className="card-body">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {item.category}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      {item.is_featured && (
                        <Badge variant="default">Featured</Badge>
                      )}
                      <Badge
                        variant={item.is_available ? 'default' : 'secondary'}
                      >
                        {item.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="font-medium text-lg">N${item.price}</div>
                    {item.preparation_time && (
                      <div>Prep time: {item.preparation_time} min</div>
                    )}
                    {item.spice_level > 0 && (
                      <div>Spice level: {item.spice_level}/5</div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <BuffrIcon name="eye" className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <BuffrIcon name="edit" className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="col-span-full text-center py-12">
                <BuffrIcon
                  name="utensils"
                  className="h-12 w-12 text-muted-foreground mx-auto mb-4"
                />
                <h3 className="text-lg font-medium mb-2">No menu items yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add menu items to showcase your offerings
                </p>
                <Button>
                  <BuffrIcon name="plus" className="h-4 w-4 mr-2" />
                  Add First Menu Item
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Image Management</h3>
            <Button>
              <BuffrIcon name="upload" className="h-4 w-4 mr-2" />
              Upload Images
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {property.images?.map((image: unknown) => (
              <Card key={image.id}>
                <CardContent className="card-body">
                  <div className="aspect-square bg-muted card mb-3 flex items-center justify-center">
                    <BuffrIcon
                      name="camera"
                      className="h-8 w-8 text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">
                      {image.alt_text || 'Untitled'}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {image.image_type}
                    </div>
                    {image.is_primary && (
                      <Badge variant="default" className="text-xs">
                        Primary
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <BuffrIcon name="eye" className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <BuffrIcon name="edit" className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="col-span-full text-center py-12">
                <BuffrIcon
                  name="camera"
                  className="h-12 w-12 text-muted-foreground mx-auto mb-4"
                />
                <h3 className="text-lg font-medium mb-2">No images yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload images to showcase your property
                </p>
                <Button>
                  <BuffrIcon name="upload" className="h-4 w-4 mr-2" />
                  Upload First Image
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12">
            <BuffrIcon
              name="bar-chart-3"
              className="h-12 w-12 text-muted-foreground mx-auto mb-4"
            />
            <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              Detailed analytics and reporting coming soon
            </p>
            <Button>
              <BuffrIcon name="bar-chart-3" className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="text-center py-12">
            <BuffrIcon
              name="settings"
              className="h-12 w-12 text-muted-foreground mx-auto mb-4"
            />
            <h3 className="text-lg font-medium mb-2">Property Settings</h3>
            <p className="text-muted-foreground mb-4">
              Configure your property settings and preferences
            </p>
            <Button>
              <BuffrIcon name="settings" className="h-4 w-4 mr-2" />
              Open Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
