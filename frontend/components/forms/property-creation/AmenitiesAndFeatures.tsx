/**
 * Amenities and Features Component
 *
 * Purpose: Handles amenities selection and property features configuration
 * Functionality: Amenities selection, policies, features, social media
 * Location: /components/forms/property-creation/AmenitiesAndFeatures.tsx
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
} from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Star,
  Shield,
  Settings,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Utensils,
  Wine,
  Concierge,
  Shirt,
  Building,
  Users,
  Heart,
  Accessibility,
  Spa,
  TreePine,
  Sun,
} from 'lucide-react';

// Types for TypeScript compliance
interface AmenitiesAndFeaturesData {
  amenities: string[];
  cancellation_policy: string;
  house_rules: string;
  instant_booking: boolean;
  featured: boolean;
  social_media: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}

interface AmenitiesAndFeaturesProps {
  formData: AmenitiesAndFeaturesData;
  onUpdate: (field: keyof AmenitiesAndFeaturesData, value: unknown) => void;
  onNestedUpdate: (
    parent: keyof AmenitiesAndFeaturesData,
    field: string,
    value: unknown) => void;
  onSubmit: () => void;
  onPrevious: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Amenities with icons
const amenitiesList = [
  { id: 'wifi', name: 'Free WiFi', icon: Wifi, category: 'Technology' },
  { id: 'parking', name: 'Parking', icon: Car, category: 'Transportation' },
  {
    id: 'air_conditioning',
    name: 'Air Conditioning',
    icon: Settings,
    category: 'Comfort',
  },
  { id: 'heating', name: 'Heating', icon: Sun, category: 'Comfort' },
  { id: 'pool', name: 'Pool', icon: Sun, category: 'Recreation' },
  { id: 'gym', name: 'Gym', icon: Dumbbell, category: 'Fitness' },
  { id: 'restaurant', name: 'Restaurant', icon: Utensils, category: 'Dining' },
  { id: 'bar', name: 'Bar', icon: Wine, category: 'Dining' },
  {
    id: 'room_service',
    name: 'Room Service',
    icon: Concierge,
    category: 'Service',
  },
  { id: 'concierge', name: 'Concierge', icon: Concierge, category: 'Service' },
  { id: 'laundry', name: 'Laundry', icon: Shirt, category: 'Service' },
  {
    id: 'business_center',
    name: 'Business Center',
    icon: Building,
    category: 'Business',
  },
  {
    id: 'conference_room',
    name: 'Conference Room',
    icon: Users,
    category: 'Business',
  },
  {
    id: 'pet_friendly',
    name: 'Pet Friendly',
    icon: Heart,
    category: 'Policies',
  },
  {
    id: 'accessible',
    name: 'Accessible',
    icon: Accessibility,
    category: 'Accessibility',
  },
  { id: 'spa', name: 'Spa', icon: Spa, category: 'Wellness' },
  { id: 'garden', name: 'Garden', icon: TreePine, category: 'Outdoor' },
  { id: 'terrace', name: 'Terrace', icon: Sun, category: 'Outdoor' },
];

// Group amenities by category
const amenitiesByCategory = amenitiesList.reduce(
  (acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  },
  {} as Record<string, typeof amenitiesList>
);

// Main Amenities and Features Component
export const AmenitiesAndFeatures: React.FC<AmenitiesAndFeaturesProps> = ({
  formData,
  onUpdate,
  onNestedUpdate,
  onSubmit,
  onPrevious,
  onCancel,
  isLoading = false,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Handle amenity toggle
  const handleAmenityToggle = (amenityId: string) => {
    const currentAmenities = formData.amenities;
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter((id) => id !== amenityId)
      : [...currentAmenities, amenityId];

    onUpdate('amenities', newAmenities);
  };

  // Handle social media update
  const handleSocialMediaUpdate = (platform: string, value: string) => {
    onNestedUpdate('social_media', platform, value);
  };

  // Filter amenities based on search
  const filteredAmenities = Object.entries(amenitiesByCategory)
    .map(([category, amenities]) => ({
      category,
      amenities: amenities.filter((amenity) =>
        amenity.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.amenities.length > 0);

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate social media URLs
    Object.entries(formData.social_media).forEach(([platform, url]) => {
      if (url && !isValidUrl(url)) {
        newErrors[`social_${platform}`] =
          `Please enter a valid ${platform} URL`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle submit
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Amenities and Features
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
          <Star className="w-5 h-5" />
          Amenities and Features
        </CardTitle>
        <p className="text-base-content/70">
          Select amenities and configure features for your property
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Amenities Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Amenities</h3>
            <div className="text-sm text-base-content/70">
              {formData.amenities.length} selected
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search amenities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
          </div>

          {/* Amenities by Category */}
          <div className="space-y-6">
            {filteredAmenities.map(({ category, amenities }) => (
              <div key={category} className="space-y-3">
                <h4 className="font-medium text-base-content/80">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {amenities.map((amenity) => {
                    const IconComponent = amenity.icon;
                    const isSelected = formData.amenities.includes(amenity.id);

                    return (
                      <div
                        key={amenity.id}
                        className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-base-300 hover:border-primary/50'
                        }`}
                        onClick={() => handleAmenityToggle(amenity.id)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleAmenityToggle(amenity.id)}
                          className="pointer-events-none"
                        />
                        <IconComponent className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {amenity.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policies */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Policies</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="cancellation_policy"
                className="text-sm font-medium"
              >
                Cancellation Policy
              </Label>
              <Textarea
                id="cancellation_policy"
                value={formData.cancellation_policy}
                onChange={(e) =>
                  onUpdate('cancellation_policy', e.target.value)
                }
                placeholder="Describe your cancellation policy..."
                rows={3}
              />
              <p className="text-xs text-base-content/50">
                Be clear about cancellation terms and any fees
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="house_rules" className="text-sm font-medium">
                House Rules
              </Label>
              <Textarea
                id="house_rules"
                value={formData.house_rules}
                onChange={(e) => onUpdate('house_rules', e.target.value)}
                placeholder="Describe your house rules..."
                rows={3}
              />
              <p className="text-xs text-base-content/50">
                Set clear expectations for guests
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Features</h3>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Checkbox
                id="instant_booking"
                checked={formData.instant_booking}
                onCheckedChange={(checked) =>
                  onUpdate('instant_booking', checked)
                }
              />
              <div className="flex-1">
                <Label htmlFor="instant_booking" className="font-medium">
                  Enable Instant Booking
                </Label>
                <p className="text-sm text-base-content/70">
                  Allow guests to book immediately without approval
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => onUpdate('featured', checked)}
              />
              <div className="flex-1">
                <Label htmlFor="featured" className="font-medium">
                  Mark as Featured Property
                </Label>
                <p className="text-sm text-base-content/70">
                  Highlight your property in search results
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Media</h3>
          <p className="text-sm text-base-content/70">
            Add your social media profiles to help guests connect with you
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook" className="text-sm font-medium">
                Facebook
              </Label>
              <Input
                id="facebook"
                value={formData.social_media.facebook}
                onChange={(e) =>
                  handleSocialMediaUpdate('facebook', e.target.value)
                }
                placeholder="https://facebook.com/yourpage"
                className={errors.social_facebook ? 'input-error' : ''}
              />
              {errors.social_facebook && (
                <p className="text-error text-xs">{errors.social_facebook}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-sm font-medium">
                Instagram
              </Label>
              <Input
                id="instagram"
                value={formData.social_media.instagram}
                onChange={(e) =>
                  handleSocialMediaUpdate('instagram', e.target.value)
                }
                placeholder="https://instagram.com/yourpage"
                className={errors.social_instagram ? 'input-error' : ''}
              />
              {errors.social_instagram && (
                <p className="text-error text-xs">{errors.social_instagram}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-sm font-medium">
                Twitter
              </Label>
              <Input
                id="twitter"
                value={formData.social_media.twitter}
                onChange={(e) =>
                  handleSocialMediaUpdate('twitter', e.target.value)
                }
                placeholder="https://twitter.com/yourpage"
                className={errors.social_twitter ? 'input-error' : ''}
              />
              {errors.social_twitter && (
                <p className="text-error text-xs">{errors.social_twitter}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-sm font-medium">
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                value={formData.social_media.linkedin}
                onChange={(e) =>
                  handleSocialMediaUpdate('linkedin', e.target.value)
                }
                placeholder="https://linkedin.com/company/yourcompany"
                className={errors.social_linkedin ? 'input-error' : ''}
              />
              {errors.social_linkedin && (
                <p className="text-error text-xs">{errors.social_linkedin}</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={onPrevious}>
            <Star className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button onClick={handleSubmit} className="btn-primary">
              <Shield className="w-4 h-4 mr-2" />
              Create Property
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AmenitiesAndFeatures;
