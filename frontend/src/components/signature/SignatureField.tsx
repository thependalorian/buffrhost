/**
 * BuffrSign-Starter: Signature Field Component
 * Individual signature field with different input types
 */

import React, { useState } from 'react';
import { SignatureFieldProps, FieldType } from '../../types/signature';
import SignaturePad from './SignaturePad';
import InitialsPad from './InitialsPad';

const SignatureField: React.FC<SignatureFieldProps> = ({
  field,
  onUpdate,
  onSignatureComplete,
  disabled = false
}) => {
  const [value, setValue] = useState(field.value || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onUpdate(newValue);
  };

  const handleSignatureComplete = (signatureData: any) => {
    const signature = {
      id: `sig_${Date.now()}`,
      envelope_id: field.envelope_id,
      field_id: field.id,
      signature_type: field.field_type,
      signature_data: signatureData,
      signature_hash: `hash_${Date.now()}`,
      certificate_data: {},
      timestamp: new Date().toISOString(),
      device_info: {
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      },
      verification_status: 'completed',
      created_at: new Date().toISOString()
    };

    onSignatureComplete(signature);
  };

  const renderFieldInput = () => {
    switch (field.field_type) {
      case 'signHere':
        return (
          <SignaturePad
            value={value}
            onChange={handleValueChange}
            disabled={disabled}
            width={field.width}
            height={field.height}
          />
        );

      case 'initialHere':
        return (
          <InitialsPad
            value={value}
            onChange={handleValueChange}
            disabled={disabled}
            style={field.field_subtype || 'formal'}
            width={field.width}
            height={field.height}
          />
        );

      case 'dateSigned':
        return (
          <div className="date-field">
            <input
              type="date"
              value={value || new Date().toISOString().split('T')[0]}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={disabled || field.locked}
              className="input input-bordered w-full"
              required={field.required}
            />
          </div>
        );

      case 'text':
        return (
          <div className="text-field">
            <input
              type="text"
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={disabled || field.locked}
              className="input input-bordered w-full"
              placeholder={field.tab_label || 'Enter text'}
              required={field.required}
              style={{
                fontSize: `${field.font_size}px`,
                fontFamily: field.font_family,
                color: field.font_color,
                backgroundColor: field.background_color,
                borderColor: field.border_color,
                borderWidth: `${field.border_width}px`
              }}
            />
          </div>
        );

      case 'checkbox':
        return (
          <div className="checkbox-field">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={value === 'true'}
                onChange={(e) => handleValueChange(e.target.checked.toString())}
                disabled={disabled || field.locked}
                className="checkbox"
                required={field.required}
              />
              <span className="label-text">{field.tab_label || 'Checkbox'}</span>
            </label>
          </div>
        );

      case 'radio':
        return (
          <div className="radio-field">
            <div className="form-control">
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  name={`radio_${field.id}`}
                  value={value}
                  onChange={(e) => handleValueChange(e.target.value)}
                  disabled={disabled || field.locked}
                  className="radio"
                  required={field.required}
                />
                <span className="label-text ml-2">{field.tab_label || 'Radio option'}</span>
              </label>
            </div>
          </div>
        );

      case 'dropdown':
        return (
          <div className="dropdown-field">
            <select
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={disabled || field.locked}
              className="select select-bordered w-full"
              required={field.required}
            >
              <option value="">Select an option</option>
              {field.validation_rules?.options?.map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );

      default:
        return (
          <div className="unknown-field">
            <input
              type="text"
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={disabled || field.locked}
              className="input input-bordered w-full"
              placeholder={`${field.field_type} field`}
              required={field.required}
            />
          </div>
        );
    }
  };

  return (
    <div className="signature-field card bg-base-100 shadow-sm">
      <div className="card-body p-4">
        {/* Field Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold">
              {field.tab_label || field.field_type}
              {field.required && <span className="text-error ml-1">*</span>}
            </h4>
            {field.ai_suggested && (
              <div className="flex items-center gap-1 mt-1">
                <span className="badge badge-sm badge-info">AI Suggested</span>
                {field.ai_confidence_score && (
                  <span className="text-xs text-base-content/70">
                    {Math.round(field.ai_confidence_score * 100)}% confidence
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="text-right">
            <span className="badge badge-sm badge-outline">
              Page {field.page_number}
            </span>
            {field.signed_at && (
              <div className="text-xs text-base-content/70 mt-1">
                Signed: {new Date(field.signed_at).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Field Input */}
        <div className="field-input">
          {renderFieldInput()}
        </div>

        {/* Field Properties */}
        <div className="field-properties mt-3 text-xs text-base-content/70">
          <div className="flex flex-wrap gap-4">
            <span>Type: {field.field_type}</span>
            {field.field_subtype && <span>Style: {field.field_subtype}</span>}
            <span>Position: ({field.x_position}, {field.y_position})</span>
            <span>Size: {field.width}×{field.height}</span>
            {field.locked && <span className="text-warning">Locked</span>}
          </div>
        </div>

        {/* Accessibility Options */}
        {field.accessibility_options && Object.keys(field.accessibility_options).length > 0 && (
          <div className="accessibility-info mt-2">
            <details className="collapse collapse-arrow">
              <summary className="collapse-title text-xs">Accessibility Options</summary>
              <div className="collapse-content text-xs">
                <pre>{JSON.stringify(field.accessibility_options, null, 2)}</pre>
              </div>
            </details>
          </div>
        )}

        {/* Validation Rules */}
        {field.validation_rules && Object.keys(field.validation_rules).length > 0 && (
          <div className="validation-info mt-2">
            <details className="collapse collapse-arrow">
              <summary className="collapse-title text-xs">Validation Rules</summary>
              <div className="collapse-content text-xs">
                <pre>{JSON.stringify(field.validation_rules, null, 2)}</pre>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignatureField;