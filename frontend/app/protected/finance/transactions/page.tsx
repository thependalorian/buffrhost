import React from 'react';
import TransactionList from '@/components/finance/TransactionList';

const TransactionsPage: React.FC = () => {
  const accountId = 'mock-account-id'; // This should come from context or route params

  return (
    <div className="transactions-page">
      <h1>Transaction History</h1>
      <TransactionList accountId={accountId} />
    </div>
  );
};

export default TransactionsPage;
