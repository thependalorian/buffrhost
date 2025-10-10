"use client";
export const dynamic = "force-dynamic";
import React, { useState } from "react";
import { useEmployees, useAuth } from "@/src/hooks/useSupabase";
import { PageHeader, ActionButton, Alert } from "@/src/components/ui";
import { Users, UserPlus, Edit, Trash2, Search } from "lucide-react";
import { Employee } from "@/src/lib/supabase";

const EmployeesPage: React.FC = () => {
  const { user } = useAuth();
  const { data: employees, loading, error, insert, update, remove } = useEmployees();
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleAddEmployee = async (data: Partial<Employee>) => {
    try {
      await insert({
        ...data,
        property_id: user?.user_metadata?.property_id || 'default-property',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setAlert({ message: 'Employee added successfully!', type: 'success' });
      setShowForm(false);
    } catch (err) {
      setAlert({ message: 'Failed to add employee', type: 'error' });
    }
  };

  const handleUpdateEmployee = async (id: string, data: Partial<Employee>) => {
    try {
      await update(id, {
        ...data,
        updated_at: new Date().toISOString()
      });
      setAlert({ message: 'Employee updated successfully!', type: 'success' });
      setEditingEmployee(null);
    } catch (err) {
      setAlert({ message: 'Failed to update employee', type: 'error' });
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await remove(id);
      setAlert({ message: 'Employee deleted successfully!', type: 'success' });
      } catch (err) {
        setAlert({ message: 'Failed to delete employee', type: 'error' });
      }
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-8">Loading employees...</div>;
  if (error) return <div className="text-center py-8 text-error">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Employee Management"
        description="Manage your staff, track performance, and handle HR operations."
        icon={<Users className="h-4 w-4" />}
        actions={
          <ActionButton
            onClick={() => {
              setEditingEmployee(null);
              setShowForm(true);
            }}
            variant="default"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
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
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
        </div>

        {/* Employees List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">
                  {employee.first_name} {employee.last_name}
                </h3>
                <p className="text-sm text-base-content/70">{employee.position}</p>
                <p className="text-sm text-base-content/70">{employee.department}</p>
                <p className="text-sm text-base-content/70">{employee.email}</p>
                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-sm btn-outline btn-primary"
                    onClick={() => setEditingEmployee(employee)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-8 text-base-content/70">
            No employees found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesPage;
