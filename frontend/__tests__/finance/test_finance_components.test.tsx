import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import components and pages
import BankAccountForm from '../../components/finance/BankAccountForm';
import BankAccountList from '../../components/finance/BankAccountList';
import TransactionList from '../../components/finance/TransactionList';
import PaymentGatewayForm from '../../components/finance/PaymentGatewayForm';
import PaymentGatewayList from '../../components/finance/PaymentGatewayList';
import DisbursementForm from '../../components/finance/DisbursementForm';
import DisbursementList from '../../components/finance/DisbursementList';

import BankAccountsPage from '../../app/protected/finance/accounts/page';
import TransactionsPage from '../../app/protected/finance/transactions/page';
import PaymentGatewaysPage from '../../app/protected/finance/gateways/page';
import DisbursementsPage from '../../app/protected/finance/disbursements/page';

describe('Banking & Financial Components and Pages', () => {
  // BankAccountForm
  test('BankAccountForm renders correctly', () => {
    const handleSubmit = jest.fn();
    render(<BankAccountForm onSubmit={handleSubmit} />);
    expect(screen.getByLabelText(/Account Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bank Name:/i)).toBeInTheDocument();
  });

  // BankAccountList
  test('BankAccountList renders correctly', () => {
    render(<BankAccountList />);
    expect(screen.getByText(/Loading bank accounts.../i)).toBeInTheDocument();
  });

  // TransactionList
  test('TransactionList renders correctly', () => {
    render(<TransactionList accountId="test-account-id" />);
    expect(screen.getByText(/Loading transactions.../i)).toBeInTheDocument();
  });

  // PaymentGatewayForm
  test('PaymentGatewayForm renders correctly', () => {
    const handleSubmit = jest.fn();
    render(<PaymentGatewayForm onSubmit={handleSubmit} />);
    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
  });

  // PaymentGatewayList
  test('PaymentGatewayList renders correctly', () => {
    render(<PaymentGatewayList />);
    expect(screen.getByText(/Loading payment gateways.../i)).toBeInTheDocument();
  });

  // DisbursementForm
  test('DisbursementForm renders correctly', () => {
    const handleSubmit = jest.fn();
    render(<DisbursementForm onSubmit={handleSubmit} />);
    expect(screen.getByLabelText(/Source Account ID:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount:/i)).toBeInTheDocument();
  });

  // DisbursementList
  test('DisbursementList renders correctly', () => {
    render(<DisbursementList />);
    expect(screen.getByText(/Loading disbursements.../i)).toBeInTheDocument();
  });

  // Pages
  test('BankAccountsPage renders correctly', () => {
    render(<BankAccountsPage />);
    expect(screen.getByRole('heading', { name: /Bank Account Management/i })).toBeInTheDocument();
  });

  test('TransactionsPage renders correctly', () => {
    render(<TransactionsPage />);
    expect(screen.getByRole('heading', { name: /Transaction History/i })).toBeInTheDocument();
  });

  test('PaymentGatewaysPage renders correctly', () => {
    render(<PaymentGatewaysPage />);
    expect(screen.getByRole('heading', { name: /Payment Gateway Management/i })).toBeInTheDocument();
  });

  test('DisbursementsPage renders correctly', () => {
    render(<DisbursementsPage />);
    expect(screen.getByRole('heading', { name: /Disbursement Management/i })).toBeInTheDocument();
  });
});
