"use client";
export const dynamic = "force-dynamic";
import React from "react";
import EventList from "@/components/calendar/EventList";
import EventForm from "@/components/calendar/EventForm";

const EventsPage: React.FC = () => {
  const handleAddEvent = (data: any) => {
    console.log("Adding event:", data);
    // In a real app, send data to backend
  };

  return (
    <div className="events-page">
      <h1>Event Management</h1>
      <EventList />
      <h2>Create New Event</h2>
      <EventForm onSubmit={handleAddEvent} />
    </div>
  );
};

export default EventsPage;
