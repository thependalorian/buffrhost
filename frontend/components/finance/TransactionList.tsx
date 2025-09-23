'use client';

import React from 'react';
import { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  account_id: string;
  type: string;
  amount: number;
  currency: string;
  description?: string;
  status: string;
  transaction_date: string;
}

interface TransactionListProps {
  accountId: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ accountId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // In a real application, this would fetch from your FastAPI backend
        // For now, using mock data
        const mockTransactions: Transaction[] = [
          { id: 't1', account_id: accountId, type: 'payment', amount: 150.00, currency: 'NAD', description: 'Hotel Stay', status: 'completed', transaction_date: '2025-10-20T10:00:00Z' },
          { id: 't2', account_id: accountId, type: 'deposit', amount: 500.00, currency: 'NAD', description: 'Refund', status: 'pending', transaction_date: '2025-10-21T15:30:00Z' },
        ];
        setTransactions(mockTransactions);
      } catch (err) {
        setError('Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [accountId]);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="transaction-list">
      <h2>Transactions for Account {accountId}</h2>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            {transaction.transaction_date} - {transaction.type} {transaction.amount} {transaction.currency} ({transaction.status})
            {transaction.description && ` - ${transaction.description}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
