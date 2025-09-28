"use client";
export const dynamic = "force-dynamic";
import React, { useState } from "react";
import { useFinancialTransactions, useAuth } from "@/src/hooks/useSupabase";
import { PageHeader, ActionButton, Alert } from "@/src/components/ui";
import { DollarSign, Plus, Edit, Trash2, Search, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { FinancialTransaction } from "@/src/lib/supabase";

const DisbursementsPage: React.FC = () => {
  const { user } = useAuth();
  const { data: transactions, loading, error, insert, update, remove } = useFinancialTransactions();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Filter for disbursement transactions (expenses)
  const disbursements = transactions.filter(t => t.type === 'expense');

  const handleAddDisbursement = async (data: Partial<FinancialTransaction>) => {
    try {
      await insert({
        ...data,
        type: 'expense',
        property_id: user?.user_metadata?.property_id || 'default-property',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setAlert({ message: 'Disbursement added successfully!', type: 'success' });
      setShowForm(false);
    } catch (err) {
      setAlert({ message: 'Failed to add disbursement', type: 'error' });
    }
  };

  const handleUpdateDisbursement = async (id: string, data: Partial<FinancialTransaction>) => {
    try {
      await update(id, {
        ...data,
        updated_at: new Date().toISOString()
      });
      setAlert({ message: 'Disbursement updated successfully!', type: 'success' });
      setEditingTransaction(null);
    } catch (err) {
      setAlert({ message: 'Failed to update disbursement', type: 'error' });
    }
  };

  const handleDeleteDisbursement = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this disbursement?')) {
      try {
        await remove(id);
        setAlert({ message: 'Disbursement deleted successfully!', type: 'success' });
      } catch (err) {
        setAlert({ message: 'Failed to delete disbursement', type: 'error' });
      }
    }
  };

  const filteredDisbursements = disbursements.filter(disbursement =>
    disbursement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disbursement.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disbursement.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending': return <Clock className="w-4 h-4 text-warning" />;
      case 'failed': return <XCircle className="w-4 h-4 text-error" />;
      default: return <Clock className="w-4 h-4 text-base-content/60" />;
    }
  };

  if (loading) return <div className="text-center py-8">Loading disbursements...</div>;
  if (error) return <div className="text-center py-8 text-error">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Disbursement Management"
        description="Manage financial disbursements, payments, and expense tracking."
        icon={<DollarSign className="h-4 w-4" />}
        actions={
          <ActionButton
            onClick={() => {
              setEditingTransaction(null);
              setShowForm(true);
            }}
            variant="primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Disbursement
          </ActionButton>
        }
      />

      <div className="container mx-auto px-4 py-8">
        {alert && <Alert type={alert.type} message={alert.message} className="mb-4" />}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Search disbursements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
        </div>

        {/* Disbursements List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDisbursements.map((disbursement) => (
            <div key={disbursement.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="card-title text-lg">{disbursement.description}</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(disbursement.status)}
                    <span className={`badge ${
                      disbursement.status === 'completed' ? 'badge-success' :
                      disbursement.status === 'pending' ? 'badge-warning' :
                      'badge-error'
                    }`}>
                      {disbursement.status}
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-error">-N$ {disbursement.amount.toLocaleString()}</p>
                <p className="text-sm text-base-content/70">{disbursement.currency}</p>
                {disbursement.category && (
                  <p className="text-sm text-base-content/70">Category: {disbursement.category}</p>
                )}
                <div className="flex items-center space-x-2 text-sm text-base-content/70">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(disbursement.created_at).toLocaleDateString()}</span>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-sm btn-outline btn-primary"
                    onClick={() => setEditingTransaction(disbursement)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => handleDeleteDisbursement(disbursement.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDisbursements.length === 0 && (
          <div className="text-center py-8 text-base-content/70">
            No disbursements found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default DisbursementsPage;
