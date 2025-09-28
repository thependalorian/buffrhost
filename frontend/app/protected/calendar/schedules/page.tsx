"use client";
export const dynamic = "force-dynamic";
import React from "react";
import ScheduleList from "@/components/calendar/ScheduleList";
import ScheduleForm from "@/components/calendar/ScheduleForm";

const SchedulesPage: React.FC = () => {
  const handleAddSchedule = (data: any) => {
    console.log("Adding schedule:", data);
    // In a real app, send data to backend
  };

  return (
    <div className="schedules-page">
      <h1>Schedule Management</h1>
      <ScheduleList />
      <h2>Create New Schedule</h2>
      <ScheduleForm onSubmit={handleAddSchedule} />
    </div>
  );
};

export default SchedulesPage;
