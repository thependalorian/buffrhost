"use client";
export const dynamic = "force-dynamic";
import React from "react";
import BankAccountList from "@/components/finance/BankAccountList";
import BankAccountForm from "@/components/finance/BankAccountForm";

const BankAccountsPage: React.FC = () => {
  const handleAddAccount = (data: any) => {
    console.log("Adding bank account:", data);
    // In a real app, send data to backend
  };

  return (
    <div className="bank-accounts-page">
      <h1>Bank Account Management</h1>
      <BankAccountList />
      <h2>Add New Bank Account</h2>
      <BankAccountForm onSubmit={handleAddAccount} />
    </div>
  );
};

export default BankAccountsPage;
