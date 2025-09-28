"use client";
import React from "react";
import { useState } from "react";

interface CommissionStructureFormData {
  name: string;
  description?: string;
  commission_type?: string;
  value: number;
  applies_to_role?: string;
  is_active?: boolean;
}

interface CommissionStructureFormProps {
  onSubmit: (data: CommissionStructureFormData) => void;
}

const CommissionStructureForm: React.FC<CommissionStructureFormProps> = ({
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CommissionStructureFormData>({
    name: "",
    value: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "value"
            ? parseFloat(value)
            : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="commission-structure-form">
      <h2>Add New Commission Structure</h2>
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
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="commission_type">Commission Type:</label>
        <input
          type="text"
          id="commission_type"
          name="commission_type"
          value={formData.commission_type || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="value">Value:</label>
        <input
          type="number"
          id="value"
          name="value"
          value={formData.value}
          onChange={handleChange}
          step="0.01"
          required
        />
      </div>
      <div>
        <label htmlFor="applies_to_role">Applies to Role:</label>
        <input
          type="text"
          id="applies_to_role"
          name="applies_to_role"
          value={formData.applies_to_role || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="is_active">Is Active:</label>
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Add Commission Structure</button>
    </form>
  );
};

export default CommissionStructureForm;
