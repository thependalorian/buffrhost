"use client";

import React from "react";
import { useState } from "react";

interface PaymentGatewayFormData {
  name: string;
  api_key?: string;
  secret_key?: string;
  is_active?: boolean;
  config?: Record<string, any>;
}

interface PaymentGatewayFormProps {
  onSubmit: (data: PaymentGatewayFormData) => void;
}

const PaymentGatewayForm: React.FC<PaymentGatewayFormProps> = ({
  onSubmit,
}) => {
  const [formData, setFormData] = useState<PaymentGatewayFormData>({
    name: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
    <form onSubmit={handleSubmit} className="payment-gateway-form">
      <h2>Add New Payment Gateway</h2>
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
        <label htmlFor="api_key">API Key:</label>
        <input
          type="text"
          id="api_key"
          name="api_key"
          value={formData.api_key || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="secret_key">Secret Key:</label>
        <input
          type="text"
          id="secret_key"
          name="secret_key"
          value={formData.secret_key || ""}
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
      <button type="submit">Add Gateway</button>
    </form>
  );
};

export default PaymentGatewayForm;
