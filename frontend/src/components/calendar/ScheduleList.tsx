"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, Clock, Users, MapPin } from "lucide-react";

interface Schedule {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  attendees: string[];
  recurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly';
}

interface ScheduleListProps {
  schedules: Schedule[];
  onEdit?: (schedule: Schedule) => void;
  onDelete?: (schedule: Schedule) => void;
  onView?: (schedule: Schedule) => void;
}

export function ScheduleList({ schedules, onEdit, onDelete, onView }: ScheduleListProps) {
  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <Card key={schedule.id} className="hover:shadow-luxury-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5 text-nude-600" />
                  <h3 className="text-lg font-semibold text-nude-900">{schedule.title}</h3>
                  {schedule.recurring && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Recurring
                    </span>
                  )}
                </div>
                
                <p className="text-nude-600 mb-4">{schedule.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-nude-600" />
                    <span className="text-nude-700">
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-nude-600" />
                    <span className="text-nude-700">{schedule.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-nude-600" />
                    <span className="text-nude-700">{schedule.attendees.length} attendees</span>
                  </div>
                </div>
                
                {schedule.attendees.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-nude-600 mb-2">Attendees:</div>
                    <div className="flex flex-wrap gap-2">
                      {schedule.attendees.map((attendee, index) => (
                        <span key={index} className="px-2 py-1 bg-nude-100 text-nude-700 rounded-full text-xs">
                          {attendee}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <div className="flex space-x-1">
                  {onView && (
                    <Button variant="ghost" size="sm" onClick={() => onView(schedule)}>
                      View
                    </Button>
                  )}
                  {onEdit && (
                    <Button variant="ghost" size="sm" onClick={() => onEdit(schedule)}>
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="ghost" size="sm" onClick={() => onDelete(schedule)}>
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {schedules.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-nude-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-nude-900 mb-2">No Schedules Found</h3>
            <p className="text-nude-600">Create your first schedule to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}