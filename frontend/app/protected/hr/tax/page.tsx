"use client";
export const dynamic = "force-dynamic";
import React from "react";
import TaxDetailForm from "@/components/hr/TaxDetailForm";

const TaxPage: React.FC = () => {
  const employeeId = "mock-employee-id"; // This should come from context or route params

  const handleAddTaxDetail = (data: any) => {
    console.log("Adding tax detail:", data);
    // In a real app, send data to backend
  };

  return (
    <div className="tax-page">
      <h1>Tax Management</h1>
      <p>Manage tax details for employees.</p>
      <h2>Add New Tax Detail</h2>
      <TaxDetailForm employeeId={employeeId} onSubmit={handleAddTaxDetail} />
    </div>
  );
};

export default TaxPage;
