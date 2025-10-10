"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ResourceFormProps {
  resource?: {
    id: string;
    name: string;
    type: 'room' | 'equipment' | 'service';
    capacity: number;
    location: string;
    amenities: string[];
    status: 'available' | 'occupied' | 'maintenance';
    hourlyRate?: number;
  };
  onSubmit: (resource: any) => void;
  onCancel: () => void;
}

export function ResourceForm({ resource, onSubmit, onCancel }: ResourceFormProps) {
  const [formData, setFormData] = useState({
    name: resource?.name || '',
    type: resource?.type || 'room',
    capacity: resource?.capacity || 0,
    location: resource?.location || '',
    amenities: resource?.amenities || [],
    status: resource?.status || 'available',
    hourlyRate: resource?.hourlyRate || 0,
  });

  const [newAmenity, setNewAmenity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: resource?.id || Date.now().toString(),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'hourlyRate' ? parseInt(value) || 0 : value,
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity),
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{resource ? 'Edit Resource' : 'Create New Resource'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Resource Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter resource name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Resource Type</Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-600 focus:border-nude-600"
              >
                <option value="room">Room</option>
                <option value="equipment">Equipment</option>
                <option value="service">Service</option>
              </select>
            </div>

            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                min="0"
                placeholder="Enter capacity"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-600 focus:border-nude-600"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <Label htmlFor="hourlyRate">Hourly Rate (Optional)</Label>
            <Input
              id="hourlyRate"
              name="hourlyRate"
              type="number"
              value={formData.hourlyRate}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Enter hourly rate"
            />
          </div>

          <div>
            <Label>Amenities</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add amenity"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              />
              <Button type="button" onClick={addAmenity}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-nude-100 text-nude-700 rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{amenity}</span>
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="ml-1 text-nude-500 hover:text-nude-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {resource ? 'Update Resource' : 'Create Resource'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}