"use client";
import React from "react";
import { useState } from "react";

interface TaxDetailFormData {
  employee_id: string;
  tax_year: number;
  tax_id_number?: string;
  tax_jurisdiction?: string;
  tax_withheld?: number;
  tax_filing_status?: string;
}

interface TaxDetailFormProps {
  employeeId: string;
  initialData?: TaxDetailFormData;
  onSubmit: (data: TaxDetailFormData) => void;
}

const TaxDetailForm: React.FC<TaxDetailFormProps> = ({
  employeeId,
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<TaxDetailFormData>(
    initialData || {
      employee_id: employeeId,
      tax_year: new Date().getFullYear(),
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "tax_year" || name === "tax_withheld"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="tax-detail-form">
      <h3>
        {initialData ? "Edit" : "Add"} Tax Details for Employee {employeeId}
      </h3>
      <div>
        <label htmlFor="tax_year">Tax Year:</label>
        <input
          type="number"
          id="tax_year"
          name="tax_year"
          value={formData.tax_year}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="tax_id_number">Tax ID Number:</label>
        <input
          type="text"
          id="tax_id_number"
          name="tax_id_number"
          value={formData.tax_id_number || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="tax_jurisdiction">Tax Jurisdiction:</label>
        <input
          type="text"
          id="tax_jurisdiction"
          name="tax_jurisdiction"
          value={formData.tax_jurisdiction || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="tax_withheld">Tax Withheld:</label>
        <input
          type="number"
          id="tax_withheld"
          name="tax_withheld"
          value={formData.tax_withheld || ""}
          onChange={handleChange}
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="tax_filing_status">Tax Filing Status:</label>
        <input
          type="text"
          id="tax_filing_status"
          name="tax_filing_status"
          value={formData.tax_filing_status || ""}
          onChange={handleChange}
        />
      </div>
      <button type="submit">
        {initialData ? "Update Details" : "Add Details"}
      </button>
    </form>
  );
};

export default TaxDetailForm;
