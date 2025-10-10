"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { MapPin, Users, Clock, Wifi } from "lucide-react";

interface Resource {
  id: string;
  name: string;
  type: 'room' | 'equipment' | 'service';
  capacity: number;
  location: string;
  amenities: string[];
  status: 'available' | 'occupied' | 'maintenance';
  hourlyRate?: number;
}

interface ResourceListProps {
  resources: Resource[];
  onEdit?: (resource: Resource) => void;
  onDelete?: (resource: Resource) => void;
  onBook?: (resource: Resource) => void;
}

export function ResourceList({ resources, onEdit, onDelete, onBook }: ResourceListProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'room':
        return <MapPin className="w-5 h-5" />;
      case 'equipment':
        return <Wifi className="w-5 h-5" />;
      case 'service':
        return <Users className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <Card key={resource.id} className="hover:shadow-luxury-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getTypeIcon(resource.type)}
                  <h3 className="text-lg font-semibold text-nude-900">{resource.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
                    {resource.status}
                  </span>
                </div>
                
                <p className="text-nude-600 mb-4 capitalize">{resource.type}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-nude-600" />
                    <span className="text-nude-700">Capacity: {resource.capacity}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-nude-600" />
                    <span className="text-nude-700">{resource.location}</span>
                  </div>
                  
                  {resource.hourlyRate && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-nude-600" />
                      <span className="text-nude-700">N$ {resource.hourlyRate}/hour</span>
                    </div>
                  )}
                </div>
                
                {resource.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {resource.amenities.map((amenity, index) => (
                      <span key={index} className="px-2 py-1 bg-nude-100 text-nude-700 rounded-full text-xs">
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <div className="flex space-x-1">
                  {onBook && resource.status === 'available' && (
                    <Button size="sm" onClick={() => onBook(resource)}>
                      Book
                    </Button>
                  )}
                  {onEdit && (
                    <Button variant="ghost" size="sm" onClick={() => onEdit(resource)}>
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="ghost" size="sm" onClick={() => onDelete(resource)}>
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {resources.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="w-12 h-12 text-nude-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-nude-900 mb-2">No Resources Found</h3>
            <p className="text-nude-600">Add your first resource to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}