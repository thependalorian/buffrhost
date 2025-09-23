'use client';

import React from 'react';
import { useState, useEffect } from 'react';

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location?: string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // In a real application, this would fetch from your FastAPI backend
        // For now, using mock data
        const mockEvents: Event[] = [
          { id: 'e1', title: 'Hotel Grand Opening', start_time: '2025-11-01T09:00', end_time: '2025-11-01T17:00', location: 'Main Lobby' },
          { id: 'e2', title: 'Staff Training', start_time: '2025-11-05T10:00', end_time: '2025-11-05T12:00', location: 'Conference Room B' },
        ];
        setEvents(mockEvents);
      } catch (err) {
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="event-list">
      <h2>Event List</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.title} at {event.location} from {event.start_time} to {event.end_time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
