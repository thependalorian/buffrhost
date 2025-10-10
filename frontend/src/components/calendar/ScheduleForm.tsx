"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

interface ScheduleFormProps {
  schedule?: {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    attendees: string[];
    recurring: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly';
  };
  onSubmit: (schedule: any) => void;
  onCancel: () => void;
}

export function ScheduleForm({ schedule, onSubmit, onCancel }: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    title: schedule?.title || '',
    description: schedule?.description || '',
    startTime: schedule?.startTime || '',
    endTime: schedule?.endTime || '',
    location: schedule?.location || '',
    attendees: schedule?.attendees || [],
    recurring: schedule?.recurring || false,
    frequency: schedule?.frequency || 'weekly',
  });

  const [newAttendee, setNewAttendee] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: schedule?.id || Date.now().toString(),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addAttendee = () => {
    if (newAttendee.trim() && !formData.attendees.includes(newAttendee.trim())) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee.trim()],
      }));
      setNewAttendee('');
    }
  };

  const removeAttendee = (attendee: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(a => a !== attendee),
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{schedule ? 'Edit Schedule' : 'Create New Schedule'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Schedule Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter schedule title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-600 focus:border-nude-600"
              rows={3}
              placeholder="Enter schedule description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                name="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={handleChange}
                required
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="recurring"
              name="recurring"
              checked={formData.recurring}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, recurring: !!checked }))}
            />
            <Label htmlFor="recurring">Recurring Schedule</Label>
          </div>

          {formData.recurring && (
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full p-3 border border-nude-300 rounded-lg focus:ring-2 focus:ring-nude-600 focus:border-nude-600"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}

          <div>
            <Label>Attendees</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newAttendee}
                onChange={(e) => setNewAttendee(e.target.value)}
                placeholder="Add attendee email"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
              />
              <Button type="button" onClick={addAttendee}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.attendees.map((attendee, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-nude-100 text-nude-700 rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{attendee}</span>
                  <button
                    type="button"
                    onClick={() => removeAttendee(attendee)}
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
              {schedule ? 'Update Schedule' : 'Create Schedule'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}