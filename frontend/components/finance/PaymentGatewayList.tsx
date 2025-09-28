"use client";

import React from "react";
import { useState, useEffect } from "react";

interface PaymentGateway {
  id: string;
  name: string;
  is_active: boolean;
}

const PaymentGatewayList: React.FC = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGateways = async () => {
      try {
        // In a real application, this would fetch from your FastAPI backend
        // For now, using mock data
        const mockGateways: PaymentGateway[] = [
          { id: "pg1", name: "Stripe", is_active: true },
          { id: "pg2", name: "PayPal", is_active: false },
        ];
        setGateways(mockGateways);
      } catch (err) {
        setError("Failed to fetch payment gateways");
      } finally {
        setLoading(false);
      }
    };
    fetchGateways();
  }, []);

  if (loading) return <div>Loading payment gateways...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="payment-gateway-list">
      <h2>Payment Gateways</h2>
      <ul>
        {gateways.map((gateway) => (
          <li key={gateway.id}>
            {gateway.name} ({gateway.is_active ? "Active" : "Inactive"})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentGatewayList;
