"use client";
export const dynamic = "force-dynamic";
import React from "react";
import PaymentGatewayList from "@/components/finance/PaymentGatewayList";
import PaymentGatewayForm from "@/components/finance/PaymentGatewayForm";

const PaymentGatewaysPage: React.FC = () => {
  const handleAddGateway = (data: any) => {
    console.log("Adding payment gateway:", data);
    // In a real app, send data to backend
  };

  return (
    <div className="payment-gateways-page">
      <h1>Payment Gateway Management</h1>
      <PaymentGatewayList />
      <h2>Add New Payment Gateway</h2>
      <PaymentGatewayForm onSubmit={handleAddGateway} />
    </div>
  );
};

export default PaymentGatewaysPage;
