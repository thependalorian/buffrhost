import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Import components and pages
import SubscriptionForm from "../../components/revenue/SubscriptionForm";
import SubscriptionList from "../../components/revenue/SubscriptionList";
import ServiceFeeForm from "../../components/revenue/ServiceFeeForm";
import ServiceFeeList from "../../components/revenue/ServiceFeeList";
import CommissionStructureForm from "../../components/revenue/CommissionStructureForm";
import CommissionStructureList from "../../components/revenue/CommissionStructureList";
import InvoiceForm from "../../components/revenue/InvoiceForm";
import InvoiceList from "../../components/revenue/InvoiceList";

import SubscriptionsPage from "../../app/protected/revenue/subscriptions/page";
import FeesPage from "../../app/protected/revenue/fees/page";
import CommissionsPage from "../../app/protected/revenue/commissions/page";
import InvoicesPage from "../../app/protected/revenue/invoices/page";

describe("Revenue Model Components and Pages", () => {
  // SubscriptionForm
  test("SubscriptionForm renders correctly", () => {
    const handleSubmit = jest.fn();
    render(<SubscriptionForm onSubmit={handleSubmit} />);
    expect(screen.getByLabelText(/Plan Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price:/i)).toBeInTheDocument();
  });

  // SubscriptionList
  test("SubscriptionList renders correctly", () => {
    render(<SubscriptionList />);
    expect(screen.getByText(/Loading subscriptions.../i)).toBeInTheDocument();
  });

  // ServiceFeeForm
  test("ServiceFeeForm renders correctly", () => {
    const handleSubmit = jest.fn();
    render(<ServiceFeeForm onSubmit={handleSubmit} />);
    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Value:/i)).toBeInTheDocument();
  });

  // ServiceFeeList
  test("ServiceFeeList renders correctly", () => {
    render(<ServiceFeeList />);
    expect(screen.getByText(/Loading service fees.../i)).toBeInTheDocument();
  });

  // CommissionStructureForm
  test("CommissionStructureForm renders correctly", () => {
    const handleSubmit = jest.fn();
    render(<CommissionStructureForm onSubmit={handleSubmit} />);
    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Value:/i)).toBeInTheDocument();
  });

  // CommissionStructureList
  test("CommissionStructureList renders correctly", () => {
    render(<CommissionStructureList />);
    expect(
      screen.getByText(/Loading commission structures.../i),
    ).toBeInTheDocument();
  });

  // InvoiceForm
  test("InvoiceForm renders correctly", () => {
    const handleSubmit = jest.fn();
    render(<InvoiceForm onSubmit={handleSubmit} />);
    expect(screen.getByLabelText(/Invoice Number:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Total Amount:/i)).toBeInTheDocument();
  });

  // InvoiceList
  test("InvoiceList renders correctly", () => {
    render(<InvoiceList />);
    expect(screen.getByText(/Loading invoices.../i)).toBeInTheDocument();
  });

  // Pages
  test("SubscriptionsPage renders correctly", () => {
    render(<SubscriptionsPage />);
    expect(
      screen.getByRole("heading", { name: /Subscription Management/i }),
    ).toBeInTheDocument();
  });

  test("FeesPage renders correctly", () => {
    render(<FeesPage />);
    expect(
      screen.getByRole("heading", { name: /Service Fee Management/i }),
    ).toBeInTheDocument();
  });

  test("CommissionsPage renders correctly", () => {
    render(<CommissionsPage />);
    expect(
      screen.getByRole("heading", { name: /Commission Management/i }),
    ).toBeInTheDocument();
  });

  test("InvoicesPage renders correctly", () => {
    render(<InvoicesPage />);
    expect(
      screen.getByRole("heading", { name: /Invoice Management/i }),
    ).toBeInTheDocument();
  });
});
