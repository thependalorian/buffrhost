/**
 * BuffrSign-Starter: Real-time Collaboration Hook
 * Supabase Realtime integration for live document collaboration
 */

import { useEffect, useState, useCallback } from 'react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { CollaborationAction, UseRealtimeCollaborationReturn } from '../types/signature';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const useRealtimeCollaboration = (envelopeId: string): UseRealtimeCollaborationReturn => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [actions, setActions] = useState<CollaborationAction[]>([]);
  
  useEffect(() => {
    if (!envelopeId) return;

    // Subscribe to envelope changes
    const envelopeChannel = supabase
      .channel(`envelope_${envelopeId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'signature_fields',
          filter: `envelope_id=eq.${envelopeId}`
        }, 
        (payload) => handleFieldUpdate(payload)
      )
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'document_collaboration',
          filter: `envelope_id=eq.${envelopeId}`
        },
        (payload) => handleCollaborationEvent(payload)
      )
      .on('broadcast', { event: 'collaboration_action' }, (payload) => {
        handleBroadcastAction(payload);
      })
      .subscribe();

    setChannel(envelopeChannel);

    return () => {
      envelopeChannel.unsubscribe();
    };
  }, [envelopeId]);

  const handleFieldUpdate = useCallback((payload: any) => {
    const action: CollaborationAction = {
      type: 'field_update',
      data: payload.new,
      user_id: payload.new.updated_by || 'unknown',
      timestamp: new Date().toISOString()
    };
    setActions(prev => [...prev, action]);
  }, []);

  const handleCollaborationEvent = useCallback((payload: any) => {
    const action: CollaborationAction = {
      type: payload.new.action_type,
      data: payload.new.action_data,
      user_id: payload.new.user_id,
      timestamp: payload.new.timestamp
    };
    setActions(prev => [...prev, action]);
  }, []);

  const handleBroadcastAction = useCallback((payload: any) => {
    setActions(prev => [...prev, payload.payload]);
  }, []);

  const broadcastAction = useCallback(async (action: CollaborationAction) => {
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'collaboration_action',
        payload: action
      });
    }
  }, [channel]);

  return {
    participants,
    actions,
    broadcastAction
  };
};