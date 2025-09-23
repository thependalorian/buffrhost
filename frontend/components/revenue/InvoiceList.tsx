'use client';
import React from 'react';
import { useState, useEffect } from 'react';

interface Invoice {
  id: string;
  invoice_number: string;
  total_amount: number;
  currency: string;
  status: string;
  issue_date: string;
}

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // In a real application, this would fetch from your FastAPI backend
        // For now, using mock data
        const mockInvoices: Invoice[] = [
          { id: 'inv1', invoice_number: 'INV-2025-001', total_amount: 1200.00, currency: 'NAD', status: 'paid', issue_date: '2025-09-01T00:00:00Z' },
          { id: 'inv2', invoice_number: 'INV-2025-002', total_amount: 350.00, currency: 'NAD', status: 'pending', issue_date: '2025-09-10T00:00:00Z' },
        ];
        setInvoices(mockInvoices);
      } catch (err) {
        setError('Failed to fetch invoices');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  if (loading) return <div>Loading invoices...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="invoice-list">
      <h2>Invoice List</h2>
      <ul>
        {invoices.map(invoice => (
          <li key={invoice.id}>
            {invoice.invoice_number} - {invoice.total_amount} {invoice.currency} ({invoice.status}) on {invoice.issue_date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvoiceList;
