"use client";
export const dynamic = "force-dynamic";
import React from "react";
import SubscriptionList from "@/components/revenue/SubscriptionList";
import SubscriptionForm from "@/components/revenue/SubscriptionForm";

const SubscriptionsPage: React.FC = () => {
  const handleAddSubscription = (data: any) => {
    console.log("Adding subscription:", data);
    // In a real app, send data to backend
  };

  return (
    <div className="subscriptions-page">
      <h1>Subscription Management</h1>
      <SubscriptionList />
      <h2>Create New Subscription</h2>
      <SubscriptionForm onSubmit={handleAddSubscription} />
    </div>
  );
};

export default SubscriptionsPage;
