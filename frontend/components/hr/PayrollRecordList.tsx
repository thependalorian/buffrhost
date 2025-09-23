'use client';
import React from 'react';
import { useState, useEffect } from 'react';

interface PayrollRecord {
  id: string;
  employee_id: string;
  pay_period_start: string;
  pay_period_end: string;
  gross_pay: number;
  net_pay: number;
  status: string;
}

interface PayrollRecordListProps {
  employeeId: string;
}

const PayrollRecordList: React.FC<PayrollRecordListProps> = ({ employeeId }) => {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayrollRecords = async () => {
      try {
        // In a real application, this would fetch from your FastAPI backend
        // For now, using mock data
        const mockRecords: PayrollRecord[] = [
          { id: 'pr1', employee_id: employeeId, pay_period_start: '2025-08-01', pay_period_end: '2025-08-15', gross_pay: 2500, net_pay: 2000, status: 'processed' },
          { id: 'pr2', employee_id: employeeId, pay_period_start: '2025-08-16', pay_period_end: '2025-08-31', gross_pay: 2500, net_pay: 2000, status: 'processed' },
        ];
        setPayrollRecords(mockRecords);
      } catch (err) {
        setError('Failed to fetch payroll records');
      } finally {
        setLoading(false);
      }
    };
    fetchPayrollRecords();
  }, [employeeId]);

  if (loading) return <div>Loading payroll records...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="payroll-record-list">
      <h3>Payroll Records for Employee {employeeId}</h3>
      <ul>
        {payrollRecords.map(record => (
          <li key={record.id}>
            {record.pay_period_start} to {record.pay_period_end}: Gross {record.gross_pay}, Net {record.net_pay} ({record.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PayrollRecordList;
