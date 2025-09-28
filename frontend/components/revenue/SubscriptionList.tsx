"use client";
import React from "react";
import { useState, useEffect } from "react";

interface Subscription {
  id: string;
  plan_name: string;
  price: number;
  currency: string;
  status: string;
  start_date: string;
}

const SubscriptionList: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        // In a real application, this would fetch from your FastAPI backend
        // For now, using mock data
        const mockSubscriptions: Subscription[] = [
          {
            id: "sub1",
            plan_name: "Basic Host",
            price: 50.0,
            currency: "NAD",
            status: "active",
            start_date: "2025-09-01T00:00:00Z",
          },
          {
            id: "sub2",
            plan_name: "Premium Host",
            price: 150.0,
            currency: "NAD",
            status: "active",
            start_date: "2025-08-15T00:00:00Z",
          },
        ];
        setSubscriptions(mockSubscriptions);
      } catch (err) {
        setError("Failed to fetch subscriptions");
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  if (loading) return <div>Loading subscriptions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="subscription-list">
      <h2>Subscription List</h2>
      <ul>
        {subscriptions.map((sub) => (
          <li key={sub.id}>
            {sub.plan_name} - {sub.price} {sub.currency} ({sub.status}) from{" "}
            {sub.start_date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubscriptionList;
