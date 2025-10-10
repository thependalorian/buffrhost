/**
 * BuffrSign-Starter: Signature Envelope Component
 * Main component for managing signature envelopes
 */

import React, { useState, useEffect } from 'react';
import { useSignatureEnvelope } from '../../hooks/useSignatureEnvelope';
import { useRealtimeCollaboration } from '../../hooks/useRealtimeCollaboration';
import { SignatureEnvelopeProps, SignatureField, DigitalSignature } from '../../types/signature';
import SignatureFieldComponent from './SignatureField';
import CollaborationIndicator from './CollaborationIndicator';

const SignatureEnvelope: React.FC<SignatureEnvelopeProps> = ({ 
  envelopeId, 
  onComplete, 
  onStatusChange 
}) => {
  const { envelope, recipients, fields, loading, error, refresh } = useSignatureEnvelope(envelopeId);
  const { participants, actions, broadcastAction } = useRealtimeCollaboration(envelopeId);
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    if (envelope && onStatusChange) {
      onStatusChange(envelope.status);
    }
  }, [envelope, onStatusChange]);

  const handleFieldUpdate = async (fieldId: string, value: string) => {
    try {
      // Update field in database
      const { error } = await fetch(`/api/signature/fields/${fieldId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      });

      if (error) throw error;

      // Broadcast update to other participants
      await broadcastAction({
        type: 'field_update',
        data: { field_id: fieldId, value },
        user_id: 'current_user', // Replace with actual user ID
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };

  const handleSignatureComplete = async (signature: DigitalSignature) => {
    try {
      setIsSigning(true);

      // Complete signature
      const response = await fetch(`/api/signature/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          field_id: signature.field_id,
          signature_data: signature.signature_data,
          signature_type: signature.signature_type,
          device_info: signature.device_info
        }),
      });

      if (!response.ok) throw new Error('Failed to complete signature');

      // Broadcast signature completion
      await broadcastAction({
        type: 'signature',
        data: signature,
        user_id: 'current_user',
        timestamp: new Date().toISOString()
      });

      // Refresh envelope data
      await refresh();

      // Notify parent component
      if (onComplete) {
        onComplete(signature);
      }

    } catch (error) {
      console.error('Error completing signature:', error);
    } finally {
      setIsSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="loading loading-spinner loading-lg"></div>
        <span className="ml-2">Loading signature envelope...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error: {error}</span>
      </div>
    );
  }

  if (!envelope) {
    return (
      <div className="alert alert-warning">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span>Signature envelope not found</span>
      </div>
    );
  }

  return (
    <div className="signature-envelope">
      {/* Header */}
      <div className="signature-header bg-base-200 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{envelope.envelope_name}</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className={`badge ${
                envelope.status === 'completed' ? 'badge-success' :
                envelope.status === 'sent' ? 'badge-info' :
                envelope.status === 'declined' ? 'badge-error' :
                'badge-warning'
              }`}>
                {envelope.status}
              </span>
              <span className="text-sm text-base-content/70">
                {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}
              </span>
              <span className="text-sm text-base-content/70">
                {fields.length} field{fields.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-base-content/70">
              Created: {new Date(envelope.created_at).toLocaleDateString()}
            </div>
            {envelope.expires_at && (
              <div className="text-sm text-base-content/70">
                Expires: {new Date(envelope.expires_at).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collaboration Indicator */}
      <CollaborationIndicator 
        participants={participants}
        actions={actions}
        isSigning={isSigning}
      />

      {/* Recipients */}
      <div className="recipients-section mb-6">
        <h3 className="text-lg font-semibold mb-3">Recipients</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipients.map((recipient) => (
            <div key={recipient.id} className="card bg-base-100 shadow-sm">
              <div className="card-body p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{recipient.recipient_name}</h4>
                    <p className="text-sm text-base-content/70">{recipient.recipient_email}</p>
                    <span className="badge badge-sm mt-1">{recipient.recipient_type}</span>
                  </div>
                  <span className={`badge badge-sm ${
                    recipient.status === 'signed' ? 'badge-success' :
                    recipient.status === 'pending' ? 'badge-warning' :
                    recipient.status === 'declined' ? 'badge-error' :
                    'badge-info'
                  }`}>
                    {recipient.status}
                  </span>
                </div>
                {recipient.signed_at && (
                  <div className="text-xs text-base-content/70 mt-2">
                    Signed: {new Date(recipient.signed_at).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signature Fields */}
      <div className="signature-fields-section">
        <h3 className="text-lg font-semibold mb-3">Signature Fields</h3>
        <div className="space-y-4">
          {fields.map((field) => (
            <SignatureFieldComponent
              key={field.id}
              field={field}
              onUpdate={(value) => handleFieldUpdate(field.id, value)}
              onSignatureComplete={handleSignatureComplete}
              disabled={isSigning || envelope.status === 'completed'}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="signature-actions mt-6 flex gap-4">
        <button 
          onClick={refresh}
          className="btn btn-outline"
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
        
        {envelope.status === 'draft' && (
          <button 
            className="btn btn-primary"
            onClick={() => {
              // Send envelope logic
              console.log('Send envelope');
            }}
          >
            Send for Signature
          </button>
        )}
      </div>
    </div>
  );
};

export default SignatureEnvelope;