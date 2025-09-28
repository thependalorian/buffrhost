import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Import components and pages
import EmployeeList from "../../components/hr/EmployeeList";
import EmployeeForm from "../../components/hr/EmployeeForm";
import PayrollRecordList from "../../components/hr/PayrollRecordList";
import PayrollRecordForm from "../../components/hr/PayrollRecordForm";
import TaxDetailForm from "../../components/hr/TaxDetailForm";
import BenefitEnrollmentForm from "../../components/hr/BenefitEnrollmentForm";

import EmployeesPage from "../../app/protected/hr/employees/page";
import PayrollPage from "../../app/protected/hr/payroll/page";
import TaxPage from "../../app/protected/hr/tax/page";
import BenefitsPage from "../../app/protected/hr/benefits/page";

describe("HR Components and Pages", () => {
  // EmployeeList
  test("EmployeeList renders correctly", () => {
    render(<EmployeeList />);
    expect(screen.getByText(/Loading employees.../i)).toBeInTheDocument();
  });

  // EmployeeForm
  test("EmployeeForm renders correctly", () => {
    const handleSubmit = jest.fn();
    render(<EmployeeForm onSubmit={handleSubmit} />);
    expect(screen.getByLabelText(/First Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
  });

  // PayrollRecordList
  test("PayrollRecordList renders correctly", () => {
    render(<PayrollRecordList employeeId="test-employee-id" />);
    expect(screen.getByText(/Loading payroll records.../i)).toBeInTheDocument();
  });

  // PayrollRecordForm
  test("PayrollRecordForm renders correctly", () => {
    const handleSubmit = jest.fn();
    render(
      <PayrollRecordForm
        employeeId="test-employee-id"
        onSubmit={handleSubmit}
      />,
    );
    expect(screen.getByLabelText(/Pay Period Start:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pay Period End:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gross Pay:/i)).toBeInTheDocument();
  });

  // TaxDetailForm
  test("TaxDetailForm renders correctly", () => {
    const handleSubmit = jest.fn();
    render(
      <TaxDetailForm employeeId="test-employee-id" onSubmit={handleSubmit} />,
    );
    expect(screen.getByLabelText(/Tax Year:/i)).toBeInTheDocument();
  });

  // BenefitEnrollmentForm
  test("BenefitEnrollmentForm renders correctly", () => {
    const handleSubmit = jest.fn();
    render(
      <BenefitEnrollmentForm
        employeeId="test-employee-id"
        onSubmit={handleSubmit}
      />,
    );
    expect(screen.getByLabelText(/Benefit Type:/i)).toBeInTheDocument();
  });

  // Pages
  test("EmployeesPage renders correctly", () => {
    render(<EmployeesPage />);
    expect(
      screen.getByRole("heading", { name: /Employee Management/i }),
    ).toBeInTheDocument();
  });

  test("PayrollPage renders correctly", () => {
    render(<PayrollPage />);
    expect(
      screen.getByRole("heading", { name: /Payroll Management/i }),
    ).toBeInTheDocument();
  });

  test("TaxPage renders correctly", () => {
    render(<TaxPage />);
    expect(
      screen.getByRole("heading", { name: /Tax Management/i }),
    ).toBeInTheDocument();
  });

  test("BenefitsPage renders correctly", () => {
    render(<BenefitsPage />);
    expect(
      screen.getByRole("heading", { name: /Benefit Management/i }),
    ).toBeInTheDocument();
  });
});
