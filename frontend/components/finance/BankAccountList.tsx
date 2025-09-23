'use client';

import React from 'react';
import { useState, useEffect } from 'react';

interface BankAccount {
  id: string;
  account_name: string;
  bank_name: string;
  account_number: string;
  currency: string;
}

const BankAccountList: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        // In a real application, this would fetch from your FastAPI backend
        // For now, using mock data
        const mockAccounts: BankAccount[] = [
          { id: 'ba1', account_name: 'Main Checking', bank_name: 'First National Bank', account_number: '123456789', currency: 'NAD' },
          { id: 'ba2', account_name: 'Savings', bank_name: 'Standard Bank', account_number: '987654321', currency: 'NAD' },
        ];
        setAccounts(mockAccounts);
      } catch (err) {
        setError('Failed to fetch bank accounts');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  if (loading) return <div>Loading bank accounts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bank-account-list">
      <h2>Bank Accounts</h2>
      <ul>
        {accounts.map(account => (
          <li key={account.id}>
            {account.account_name} ({account.bank_name}) - {account.account_number} ({account.currency})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BankAccountList;
