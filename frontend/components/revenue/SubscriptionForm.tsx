"use client";
import React from "react";
import { useState } from "react";

interface SubscriptionFormData {
  user_id: string;
  plan_name: string;
  start_date: string;
  end_date?: string;
  status?: string;
  price: number;
  currency?: string;
  billing_period?: string;
}

interface SubscriptionFormProps {
  onSubmit: (data: SubscriptionFormData) => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    user_id: "mock-user-id",
    plan_name: "",
    start_date: "",
    price: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="subscription-form">
      <h2>Create New Subscription</h2>
      <div>
        <label htmlFor="plan_name">Plan Name:</label>
        <input
          type="text"
          id="plan_name"
          name="plan_name"
          value={formData.plan_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="start_date">Start Date:</label>
        <input
          type="datetime-local"
          id="start_date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="end_date">End Date:</label>
        <input
          type="datetime-local"
          id="end_date"
          name="end_date"
          value={formData.end_date || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          required
        />
      </div>
      <div>
        <label htmlFor="currency">Currency:</label>
        <input
          type="text"
          id="currency"
          name="currency"
          value={formData.currency || "NAD"}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="billing_period">Billing Period:</label>
        <input
          type="text"
          id="billing_period"
          name="billing_period"
          value={formData.billing_period || ""}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Create Subscription</button>
    </form>
  );
};

export default SubscriptionForm;
