/**
 * BuffrSign-Starter: Initials Pad Component
 * Canvas-based initials pad for capturing digital initials
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { InitialsPadProps } from '../../types/signature';

const InitialsPad: React.FC<InitialsPadProps> = ({
  value,
  onChange,
  disabled = false,
  style = 'formal',
  width = 200,
  height = 100
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [initialsStyle, setInitialsStyle] = useState(style);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Set drawing styles based on initials style
    setDrawingStyle(ctx, initialsStyle);

    // Load existing initials if value is provided
    if (value) {
      loadInitials(value);
    }
  }, [width, height, value, initialsStyle]);

  const setDrawingStyle = (ctx: CanvasRenderingContext2D, style: string) => {
    switch (style) {
      case 'formal':
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        break;
      case 'cursive':
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        break;
      case 'block':
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.lineCap = 'square';
        ctx.lineJoin = 'miter';
        break;
      case 'signature-style':
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        break;
      default:
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }
  };

  const loadInitials = useCallback((initialsData: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Load initials data (assuming base64 image data)
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setIsEmpty(false);
      };
      img.src = initialsData;
    } catch (error) {
      console.error('Error loading initials:', error);
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
      const initialsData = canvas.toDataURL('image/png');
      onChange(initialsData);
    }
  }, [isDrawing, onChange]);

  const clearInitials = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onChange('');
  }, [onChange]);

  const handleStyleChange = (newStyle: string) => {
    setInitialsStyle(newStyle);
  };

  return (
    <div className="initials-pad">
      <div className="initials-pad-container border-2 border-dashed border-base-300 rounded-lg p-4">
        {/* Style Selector */}
        <div className="style-selector mb-3">
          <label className="label">
            <span className="label-text text-sm">Initials Style:</span>
          </label>
          <select
            value={initialsStyle}
            onChange={(e) => handleStyleChange(e.target.value)}
            disabled={disabled}
            className="select select-bordered select-sm w-full max-w-xs"
          >
            <option value="formal">Formal</option>
            <option value="cursive">Cursive</option>
            <option value="block">Block</option>
            <option value="signature-style">Signature Style</option>
          </select>
        </div>

        <canvas
          ref={canvasRef}
          className={`initials-canvas ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-crosshair'}`}
          style={{ width: `${width}px`, height: `${height}px` }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        {/* Initials Pad Controls */}
        <div className="initials-controls mt-3 flex justify-between items-center">
          <div className="initials-info text-sm text-base-content/70">
            {isEmpty ? 'Click and drag to write initials' : 'Initials captured'}
          </div>
          
          <div className="initials-actions flex gap-2">
            <button
              type="button"
              onClick={clearInitials}
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
      
      {/* Initials Preview */}
      {!isEmpty && (
        <div className="initials-preview mt-3">
          <div className="text-sm text-base-content/70 mb-2">Initials Preview:</div>
          <div className="border border-base-300 rounded p-2 bg-base-50">
            <img 
              src={value} 
              alt="Initials preview" 
              className="max-w-full h-auto"
              style={{ maxHeight: '60px' }}
            />
          </div>
        </div>
      )}

      {/* Style Examples */}
      <div className="style-examples mt-3">
        <div className="text-sm text-base-content/70 mb-2">Style Examples:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="border border-base-300 rounded p-2">
            <div className="font-bold">Formal:</div>
            <div className="font-serif">A.B.</div>
          </div>
          <div className="border border-base-300 rounded p-2">
            <div className="font-bold">Cursive:</div>
            <div className="italic">A.B.</div>
          </div>
          <div className="border border-base-300 rounded p-2">
            <div className="font-bold">Block:</div>
            <div className="font-mono">A.B.</div>
          </div>
          <div className="border border-base-300 rounded p-2">
            <div className="font-bold">Signature:</div>
            <div className="underline">A.B.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialsPad;