"use client";
export const dynamic = "force-dynamic";
import React, { useState } from "react";
import { usePayrollRecords, useEmployees, useAuth } from "@/src/hooks/useSupabase";
import { PageHeader, ActionButton, Alert } from "@/src/components/ui";
import { DollarSign, Plus, Edit, Trash2, Search, Calendar } from "lucide-react";
import { PayrollRecord, Employee } from "@/src/lib/supabase";

const PayrollPage: React.FC = () => {
  const { user } = useAuth();
  const { data: employees } = useEmployees();
  const { data: payrollRecords, loading, error, insert, update, remove } = usePayrollRecords();
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleAddPayrollRecord = async (data: Partial<PayrollRecord>) => {
    try {
      await insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setAlert({ message: 'Payroll record added successfully!', type: 'success' });
      setShowForm(false);
    } catch (err) {
      setAlert({ message: 'Failed to add payroll record', type: 'error' });
    }
  };

  const handleUpdatePayrollRecord = async (id: string, data: Partial<PayrollRecord>) => {
    try {
      await update(id, {
        ...data,
        updated_at: new Date().toISOString()
      });
      setAlert({ message: 'Payroll record updated successfully!', type: 'success' });
      setEditingRecord(null);
    } catch (err) {
      setAlert({ message: 'Failed to update payroll record', type: 'error' });
    }
  };

  const handleDeletePayrollRecord = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this payroll record?')) {
      try {
        await remove(id);
        setAlert({ message: 'Payroll record deleted successfully!', type: 'success' });
      } catch (err) {
        setAlert({ message: 'Failed to delete payroll record', type: 'error' });
      }
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown Employee';
  };

  const filteredRecords = payrollRecords.filter(record => {
    const employeeName = getEmployeeName(record.employee_id).toLowerCase();
    return employeeName.includes(searchTerm.toLowerCase()) ||
           record.status.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) return <div className="text-center py-8">Loading payroll records...</div>;
  if (error) return <div className="text-center py-8 text-error">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Payroll Management"
        description="Manage employee payroll records, process payments, and track compensation."
        icon={<DollarSign className="h-4 w-4" />}
        actions={
          <ActionButton
            onClick={() => {
              setEditingRecord(null);
              setShowForm(true);
            }}
            variant="default"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Payroll Record
          </ActionButton>
        }
      />

      <div className="container mx-auto px-4 py-8">
        {alert && <Alert variant={alert.type} description={alert.message} className="mb-4" />}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Search payroll records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
        </div>

        {/* Payroll Records List */}
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Pay Period</th>
                <th>Gross Salary</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{getEmployeeName(record.employee_id)}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(record.pay_period_start).toLocaleDateString()} - {new Date(record.pay_period_end).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>N$ {record.gross_salary.toLocaleString()}</td>
                  <td>N$ {record.deductions.toLocaleString()}</td>
                  <td className="font-semibold">N$ {record.net_salary.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${
                      record.status === 'paid' ? 'badge-success' :
                      record.status === 'processed' ? 'badge-info' :
                      'badge-warning'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        className="btn btn-sm btn-outline btn-primary"
                        onClick={() => setEditingRecord(record)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="btn btn-sm btn-outline btn-error"
                        onClick={() => handleDeletePayrollRecord(record.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-8 text-base-content/70">
            No payroll records found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollPage;
