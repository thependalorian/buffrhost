/**
 * BuffrSign-Starter: Signature Pad Component
 * Canvas-based signature pad for capturing digital signatures
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SignaturePadProps } from '../../types/signature';

const SignaturePad: React.FC<SignaturePadProps> = ({
  value,
  onChange,
  disabled = false,
  width = 400,
  height = 200
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Set drawing styles
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Load existing signature if value is provided
    if (value) {
      loadSignature(value);
    }
  }, [width, height, value]);

  const loadSignature = useCallback((signatureData: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Load signature data (assuming base64 image data)
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setIsEmpty(false);
      };
      img.src = signatureData;
    } catch (error) {
      console.error('Error loading signature:', error);
    }
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setIsEmpty(false);

    const rect = canvas.getBoundingClientRect();
    const x = e.type.includes('touch') 
      ? (e as React.TouchEvent).touches[0].clientX - rect.left
      : (e as React.MouseEvent).clientX - rect.left;
    const y = e.type.includes('touch')
      ? (e as React.TouchEvent).touches[0].clientY - rect.top
      : (e as React.MouseEvent).clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [disabled]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.type.includes('touch')
      ? (e as React.TouchEvent).touches[0].clientX - rect.left
      : (e as React.MouseEvent).clientX - rect.left;
    const y = e.type.includes('touch')
      ? (e as React.TouchEvent).touches[0].clientY - rect.top
      : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing, disabled]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;

    setIsDrawing(false);
    
    // Convert canvas to base64 and call onChange
    const canvas = canvasRef.current;
    if (canvas) {
      const signatureData = canvas.toDataURL('image/png');
      onChange(signatureData);
    }
  }, [isDrawing, onChange]);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onChange('');
  }, [onChange]);

  return (
    <div className="signature-pad">
      <div className="signature-pad-container border-2 border-dashed border-base-300 rounded-lg p-4">
        <canvas
          ref={canvasRef}
          className={`signature-canvas ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-crosshair'}`}
          style={{ width: `${width}px`, height: `${height}px` }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        {/* Signature Pad Controls */}
        <div className="signature-controls mt-3 flex justify-between items-center">
          <div className="signature-info text-sm text-base-content/70">
            {isEmpty ? 'Click and drag to sign' : 'Signature captured'}
          </div>
          
          <div className="signature-actions flex gap-2">
            <button
              type="button"
              onClick={clearSignature}
              disabled={disabled || isEmpty}
              className="btn btn-sm btn-outline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          </div>
        </div>
      </div>
      
      {/* Signature Preview */}
      {!isEmpty && (
        <div className="signature-preview mt-3">
          <div className="text-sm text-base-content/70 mb-2">Signature Preview:</div>
          <div className="border border-base-300 rounded p-2 bg-base-50">
            <img 
              src={value} 
              alt="Signature preview" 
              className="max-w-full h-auto"
              style={{ maxHeight: '100px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignaturePad;