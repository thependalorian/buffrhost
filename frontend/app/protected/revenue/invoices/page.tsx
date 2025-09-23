'use client';
export const dynamic = 'force-dynamic';
import React from 'react';
import InvoiceList from '@/components/revenue/InvoiceList';
import InvoiceForm from '@/components/revenue/InvoiceForm';

const InvoicesPage: React.FC = () => {
  const handleAddInvoice = (data: any) => {
    console.log('Adding invoice:', data);
    // In a real app, send data to backend
  };

  return (
    <div className="invoices-page">
      <h1>Invoice Management</h1>
      <InvoiceList />
      <h2>Create New Invoice</h2>
      <InvoiceForm onSubmit={handleAddInvoice} />
    </div>
  );
};

export default InvoicesPage;
