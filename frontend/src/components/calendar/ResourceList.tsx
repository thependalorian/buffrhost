"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface Resource {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: "available" | "occupied" | "maintenance" | "out-of-order";
  location: string;
  amenities: string[];
}

interface ResourceListProps {
  resources: Resource[];
  onEdit?: (resource: Resource) => void;
  onDelete?: (resourceId: string) => void;
  onStatusChange?: (resourceId: string, status: Resource["status"]) => void;
}

export default function ResourceList({ resources, onEdit, onDelete, onStatusChange }: ResourceListProps) {
  const getStatusColor = (status: Resource["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "out-of-order":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {resources.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No resources available</p>
          </CardContent>
        </Card>
      ) : (
        resources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{resource.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{resource.type} • {resource.location}</p>
                </div>
                <Badge className={getStatusColor(resource.status)}>
                  {resource.status.replace("-", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="text-sm text-gray-500">
                  <p>Capacity: {resource.capacity} people</p>
                </div>
                
                {resource.amenities.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {resource.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(resource)}
                    >
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(resource.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}