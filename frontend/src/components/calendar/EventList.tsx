"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  attendees: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface EventListProps {
  events: Event[];
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  onView?: (event: Event) => void;
}

export function EventList({ events, onEdit, onDelete, onView }: EventListProps) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-luxury-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-nude-900 mb-2">{event.title}</h3>
                <p className="text-nude-600 mb-4">{event.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-nude-600" />
                    <span className="text-nude-700">
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-nude-600" />
                    <span className="text-nude-700">{event.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-nude-600" />
                    <span className="text-nude-700">{event.attendees} attendees</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.status}
                </span>
                
                <div className="flex space-x-1">
                  {onView && (
                    <Button variant="ghost" size="sm" onClick={() => onView(event)}>
                      View
                    </Button>
                  )}
                  {onEdit && (
                    <Button variant="ghost" size="sm" onClick={() => onEdit(event)}>
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="ghost" size="sm" onClick={() => onDelete(event)}>
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {events.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-nude-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-nude-900 mb-2">No Events Found</h3>
            <p className="text-nude-600">Create your first event to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}