"use client";

import React from "react";
import { useState, useEffect } from "react";

interface Schedule {
  id: string;
  employee_id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  role?: string;
}

const ScheduleList: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        // In a real application, this would fetch from your FastAPI backend
        // For now, using mock data
        const mockSchedules: Schedule[] = [
          {
            id: "s1",
            employee_id: "emp1",
            shift_date: "2025-10-26",
            start_time: "2025-10-26T09:00",
            end_time: "2025-10-26T17:00",
            role: "Waiter",
          },
          {
            id: "s2",
            employee_id: "emp2",
            shift_date: "2025-10-26",
            start_time: "2025-10-26T10:00",
            end_time: "2025-10-26T18:00",
            role: "Chef",
          },
        ];
        setSchedules(mockSchedules);
      } catch (err) {
        setError("Failed to fetch schedules");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  if (loading) return <div>Loading schedules...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="schedule-list">
      <h2>Schedule List</h2>
      <ul>
        {schedules.map((schedule) => (
          <li key={schedule.id}>
            {schedule.shift_date} - {schedule.start_time} to {schedule.end_time}{" "}
            ({schedule.role})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleList;
