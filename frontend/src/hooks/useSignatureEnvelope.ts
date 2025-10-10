/**
 * BuffrSign-Starter: Signature Envelope Hook
 * Manage signature envelope data and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  SignatureEnvelope, 
  SignatureRecipient, 
  SignatureField, 
  UseSignatureEnvelopeReturn 
} from '../types/signature';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const useSignatureEnvelope = (envelopeId: string): UseSignatureEnvelopeReturn => {
  const [envelope, setEnvelope] = useState<SignatureEnvelope | null>(null);
  const [recipients, setRecipients] = useState<SignatureRecipient[]>([]);
  const [fields, setFields] = useState<SignatureField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEnvelopeData = useCallback(async () => {
    if (!envelopeId) return;

    try {
      setLoading(true);
      setError(null);

      // Load envelope details
      const { data: envelopeData, error: envelopeError } = await supabase
        .from('signature_envelopes')
        .select('*')
        .eq('id', envelopeId)
        .single();

      if (envelopeError) throw envelopeError;

      // Load recipients
      const { data: recipientsData, error: recipientsError } = await supabase
        .from('signature_recipients')
        .select('*')
        .eq('envelope_id', envelopeId)
        .order('routing_order');

      if (recipientsError) throw recipientsError;

      // Load fields
      const { data: fieldsData, error: fieldsError } = await supabase
        .from('signature_fields')
        .select('*')
        .eq('envelope_id', envelopeId)
        .order('page_number, y_position');

      if (fieldsError) throw fieldsError;

      setEnvelope(envelopeData);
      setRecipients(recipientsData || []);
      setFields(fieldsData || []);

    } catch (err) {
      console.error('Error loading envelope:', err);
      setError(err instanceof Error ? err.message : 'Failed to load envelope');
    } finally {
      setLoading(false);
    }
  }, [envelopeId]);

  useEffect(() => {
    loadEnvelopeData();
  }, [loadEnvelopeData]);

  const refresh = useCallback(async () => {
    await loadEnvelopeData();
  }, [loadEnvelopeData]);

  return {
    envelope,
    recipients,
    fields,
    loading,
    error,
    refresh
  };
};