/**
 * BuffrSign-Starter: Signature Types
 * TypeScript interfaces for signature management
 */

export interface SignatureEnvelope {
  id: string;
  envelope_name: string;
  status: SignatureStatus;
  created_by: string;
  property_id?: number;
  guest_id?: number;
  template_id?: string;
  compliance_level: ComplianceLevel;
  ai_analysis_completed: boolean;
  realtime_enabled: boolean;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  completed_at?: string;
  voided_at?: string;
  void_reason?: string;
  metadata: Record<string, any>;
  ai_analysis: Record<string, any>;
  recipients_count: number;
  fields_count: number;
}

export interface SignatureRecipient {
  id: string;
  envelope_id: string;
  recipient_email: string;
  recipient_name: string;
  recipient_type: RecipientType;
  routing_order: number;
  authentication_method: AuthMethod[];
  biometric_verification_required: boolean;
  status: RecipientStatus;
  signed_at?: string;
  declined_at?: string;
  decline_reason?: string;
  ip_address?: string;
  user_agent?: string;
  device_fingerprint?: string;
  authentication_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SignatureField {
  id: string;
  envelope_id: string;
  recipient_id?: string;
  field_type: FieldType;
  field_subtype?: string;
  page_number: number;
  x_position: number;
  y_position: number;
  width: number;
  height: number;
  anchor_string?: string;
  anchor_units: string;
  anchor_x_offset: number;
  anchor_y_offset: number;
  tab_label?: string;
  value?: string;
  required: boolean;
  locked: boolean;
  font_size: number;
  font_family: string;
  font_color: string;
  background_color: string;
  border_color: string;
  border_width: number;
  ai_suggested: boolean;
  ai_confidence_score?: number;
  validation_rules: Record<string, any>;
  accessibility_options: Record<string, any>;
  signed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DigitalSignature {
  id: string;
  envelope_id: string;
  recipient_id?: string;
  field_id: string;
  signature_type: FieldType;
  signature_data: Record<string, any>;
  signature_hash: string;
  certificate_data: Record<string, any>;
  timestamp: string;
  ip_address?: string;
  device_info: Record<string, any>;
  verification_status: string;
  created_at: string;
}

export interface SignatureTemplate {
  id: string;
  template_id: string;
  name: string;
  description?: string;
  category: TemplateCategory;
  document_template_id?: string;
  field_definitions: SignatureField[];
  recipient_definitions: SignatureRecipient[];
  workflow_rules: Record<string, any>;
  ai_enhancements: Record<string, any>;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentAnalysis {
  id: string;
  envelope_id: string;
  document_id: string;
  contract_type?: string;
  key_terms: string[];
  field_suggestions: FieldSuggestion[];
  ai_confidence?: number;
  risk_assessment: Record<string, any>;
  compliance_check: Record<string, any>;
  language_detection?: string;
  template_match: Record<string, any>;
  created_at: string;
}

export interface FieldSuggestion {
  field_type: FieldType;
  page_number: number;
  x_position: number;
  y_position: number;
  width: number;
  height: number;
  confidence_score: number;
  field_subtype?: string;
  validation_rules: Record<string, any>;
  accessibility_options: Record<string, any>;
}

export interface DigitalInitials {
  initials_text: string;
  styles: Record<string, string>;
  preferred_style: string;
  accessibility_options: Record<string, any>;
  validation_rules: Record<string, any>;
}

export interface CollaborationAction {
  type: 'field_update' | 'comment' | 'signature' | 'status_change';
  data: any;
  user_id: string;
  timestamp: string;
}

export interface CreateEnvelopeRequest {
  envelope_name: string;
  property_id?: number;
  guest_id?: number;
  template_id?: string;
  compliance_level: ComplianceLevel;
  expires_at?: string;
  metadata: Record<string, any>;
}

export interface AddRecipientRequest {
  recipient_email: string;
  recipient_name: string;
  recipient_type: RecipientType;
  routing_order: number;
  authentication_method: AuthMethod[];
  biometric_verification_required: boolean;
}

export interface AddFieldRequest {
  field_type: FieldType;
  field_subtype?: string;
  page_number: number;
  x_position: number;
  y_position: number;
  width: number;
  height: number;
  anchor_string?: string;
  anchor_x_offset: number;
  anchor_y_offset: number;
  tab_label?: string;
  required: boolean;
  locked: boolean;
  ai_suggested: boolean;
  ai_confidence_score?: number;
  validation_rules: Record<string, any>;
  accessibility_options: Record<string, any>;
}

export interface SignatureRequest {
  field_id: string;
  signature_data: Record<string, any>;
  signature_type: FieldType;
  ip_address?: string;
  device_info: Record<string, any>;
}

export interface HospitalityTemplateRequest {
  template_type: HospitalityTemplateType;
  property_data: Record<string, any>;
}

// Enums
export type SignatureStatus = 'draft' | 'sent' | 'delivered' | 'completed' | 'declined' | 'voided';
export type RecipientType = 'signer' | 'cc' | 'approver' | 'witness';
export type RecipientStatus = 'pending' | 'sent' | 'delivered' | 'signed' | 'declined';
export type FieldType = 'signHere' | 'initialHere' | 'dateSigned' | 'text' | 'checkbox' | 'radio' | 'dropdown' | 'list' | 'formula' | 'payment' | 'attachment' | 'notarization' | 'witness' | 'approval' | 'acknowledgment';
export type ComplianceLevel = 'standard' | 'advanced' | 'qualified';
export type AuthMethod = 'email' | 'sms' | 'biometric' | 'certificate';
export type TemplateCategory = 'general' | 'hospitality' | 'legal' | 'hr' | 'vendor';
export type HospitalityTemplateType = 'guest_checkin' | 'event_contract' | 'employee_onboarding' | 'vendor_agreement' | 'service_agreement' | 'liability_waiver';

// API Response Types
export interface EnvelopeResponse {
  id: string;
  envelope_name: string;
  status: SignatureStatus;
  created_at: string;
  signing_url: string;
  recipients_count: number;
  fields_count: number;
}

export interface DocumentUploadResponse {
  file_id: string;
  filename: string;
  size: number;
  public_url: string;
  content_type: string;
  upload_timestamp: string;
}

export interface DocumentAnalysisResponse {
  document_id: string;
  contract_type?: string;
  key_terms: string[];
  suggested_fields: FieldSuggestion[];
  ai_confidence?: number;
  risk_assessment: Record<string, any>;
  compliance_check: Record<string, any>;
  language_detection?: string;
  template_match: Record<string, any>;
  analysis_timestamp: string;
}

export interface TemplateResponse {
  id: string;
  template_id: string;
  name: string;
  description?: string;
  category: TemplateCategory;
  field_count: number;
  recipient_count: number;
  is_active: boolean;
  created_at: string;
}

// Component Props
export interface SignatureEnvelopeProps {
  envelopeId: string;
  onComplete?: (signature: DigitalSignature) => void;
  onStatusChange?: (status: SignatureStatus) => void;
}

export interface SignatureFieldProps {
  field: SignatureField;
  onUpdate: (value: string) => void;
  onSignatureComplete: (signature: DigitalSignature) => void;
  disabled?: boolean;
}

export interface CollaborativeSignatureProps {
  envelopeId: string;
  fieldId: string;
  fieldType: FieldType;
  onSignatureComplete: (signature: DigitalSignature) => void;
}

export interface DigitalInitialsProps {
  initials: DigitalInitials;
  onStyleChange: (style: string) => void;
  onInitialsComplete: (initials: string) => void;
}

export interface SignaturePadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  width?: number;
  height?: number;
}

export interface InitialsPadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  style?: string;
  width?: number;
  height?: number;
}

// Hook Return Types
export interface UseRealtimeCollaborationReturn {
  participants: string[];
  actions: CollaborationAction[];
  broadcastAction: (action: CollaborationAction) => Promise<void>;
}

export interface UseSignatureEnvelopeReturn {
  envelope: SignatureEnvelope | null;
  recipients: SignatureRecipient[];
  fields: SignatureField[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface UseDocumentAnalysisReturn {
  analysis: DocumentAnalysis | null;
  loading: boolean;
  error: string | null;
  analyzeDocument: (fileId: string) => Promise<void>;
}

export interface UseDigitalInitialsReturn {
  initials: DigitalInitials | null;
  loading: boolean;
  error: string | null;
  generateInitials: (userId: string, name: string, style?: string) => Promise<void>;
}