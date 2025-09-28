"use client";

import React from "react";
import { useState, useEffect } from "react";

interface Disbursement {
  id: string;
  amount: number;
  currency: string;
  status: string;
  disbursement_date: string;
  destination_account_details: Record<string, any>;
}

const DisbursementList: React.FC = () => {
  const [disbursements, setDisbursements] = useState<Disbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisbursements = async () => {
      try {
        // In a real application, this would fetch from your FastAPI backend
        // For now, using mock data
        const mockDisbursements: Disbursement[] = [
          {
            id: "d1",
            amount: 1000.0,
            currency: "NAD",
            status: "processed",
            disbursement_date: "2025-10-15T10:00:00Z",
            destination_account_details: {
              bank_name: "Bank X",
              account_number: "123",
            },
          },
          {
            id: "d2",
            amount: 500.0,
            currency: "NAD",
            status: "pending",
            disbursement_date: "2025-10-22T14:00:00Z",
            destination_account_details: {
              bank_name: "Bank Y",
              account_number: "456",
            },
          },
        ];
        setDisbursements(mockDisbursements);
      } catch (err) {
        setError("Failed to fetch disbursements");
      } finally {
        setLoading(false);
      }
    };
    fetchDisbursements();
  }, []);

  if (loading) return <div>Loading disbursements...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="disbursement-list">
      <h2>Disbursement List</h2>
      <ul>
        {disbursements.map((disbursement) => (
          <li key={disbursement.id}>
            {disbursement.disbursement_date} - {disbursement.amount}{" "}
            {disbursement.currency} to{" "}
            {disbursement.destination_account_details.bank_name} (
            {disbursement.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisbursementList;
