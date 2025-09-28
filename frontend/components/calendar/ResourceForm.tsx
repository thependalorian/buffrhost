"use client";

import React from "react";
import { useState } from "react";

interface ResourceFormData {
  name: string;
  resource_type: string;
  capacity?: number;
  is_available?: boolean;
  location?: string;
  properties?: Record<string, any>;
}

interface ResourceFormProps {
  onSubmit: (data: ResourceFormData) => void;
}

const ResourceForm: React.FC<ResourceFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ResourceFormData>({
    name: "",
    resource_type: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="resource-form">
      <h2>Create New Resource</h2>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="resource_type">Resource Type:</label>
        <input
          type="text"
          id="resource_type"
          name="resource_type"
          value={formData.resource_type}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="capacity">Capacity:</label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          value={formData.capacity || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="is_available">Is Available:</label>
        <input
          type="checkbox"
          id="is_available"
          name="is_available"
          checked={formData.is_available}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location || ""}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Create Resource</button>
    </form>
  );
};

export default ResourceForm;
