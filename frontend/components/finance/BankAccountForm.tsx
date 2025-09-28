"use client";

import React from "react";
import { useState } from "react";

interface BankAccountFormData {
  user_id: string;
  account_name: string;
  bank_name: string;
  account_number: string;
  routing_number?: string;
  currency?: string;
  is_primary?: boolean;
}

interface BankAccountFormProps {
  onSubmit: (data: BankAccountFormData) => void;
}

const BankAccountForm: React.FC<BankAccountFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<BankAccountFormData>({
    user_id: "mock-user-id",
    account_name: "",
    bank_name: "",
    account_number: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
    <form onSubmit={handleSubmit} className="bank-account-form">
      <h2>Add New Bank Account</h2>
      <div>
        <label htmlFor="account_name">Account Name:</label>
        <input
          type="text"
          id="account_name"
          name="account_name"
          value={formData.account_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="bank_name">Bank Name:</label>
        <input
          type="text"
          id="bank_name"
          name="bank_name"
          value={formData.bank_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="account_number">Account Number:</label>
        <input
          type="text"
          id="account_number"
          name="account_number"
          value={formData.account_number}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="routing_number">Routing Number:</label>
        <input
          type="text"
          id="routing_number"
          name="routing_number"
          value={formData.routing_number || ""}
          onChange={handleChange}
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
        <label htmlFor="is_primary">Primary Account:</label>
        <input
          type="checkbox"
          id="is_primary"
          name="is_primary"
          checked={formData.is_primary}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Add Account</button>
    </form>
  );
};

export default BankAccountForm;
