"use client";

import React from "react";
import { useState } from "react";

interface ScheduleFormData {
  employee_id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  role?: string;
  notes?: string;
}

interface ScheduleFormProps {
  onSubmit: (data: ScheduleFormData) => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    employee_id: "mock-employee-id",
    shift_date: "",
    start_time: "",
    end_time: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="schedule-form">
      <h2>Create New Schedule</h2>
      <div>
        <label htmlFor="employee_id">Employee ID:</label>
        <input
          type="text"
          id="employee_id"
          name="employee_id"
          value={formData.employee_id}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="shift_date">Shift Date:</label>
        <input
          type="date"
          id="shift_date"
          name="shift_date"
          value={formData.shift_date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="start_time">Start Time:</label>
        <input
          type="datetime-local"
          id="start_time"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="end_time">End Time:</label>
        <input
          type="datetime-local"
          id="end_time"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="role">Role:</label>
        <input
          type="text"
          id="role"
          name="role"
          value={formData.role || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="notes">Notes:</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Create Schedule</button>
    </form>
  );
};

export default ScheduleForm;
