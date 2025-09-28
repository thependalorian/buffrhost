"use client";
import React from "react";
import { useState, useEffect } from "react";

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
  department: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // In a real application, this would fetch from your FastAPI backend
        // For now, using mock data
        const mockEmployees: Employee[] = [
          {
            id: "1",
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
            job_title: "Manager",
            department: "Operations",
          },
          {
            id: "2",
            first_name: "Jane",
            last_name: "Smith",
            email: "jane.smith@example.com",
            job_title: "Chef",
            department: "Kitchen",
          },
        ];
        setEmployees(mockEmployees);
      } catch (err) {
        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (loading) return <div>Loading employees...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="employee-list">
      <h2>Employee List</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.first_name} {employee.last_name} - {employee.job_title} (
            {employee.department})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
