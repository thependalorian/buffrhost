'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, File, Image, FileText } from 'lucide-react';

export interface FormFileUploadProps {
  label?: string;
  name: string;
  files: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dragAndDrop?: boolean;
}

export default function FormFileUpload({
  label,
  name,
  files,
  onChange,
  accept,
  multiple = false,
  maxSize = 10, // 10MB default
  required = false,
  disabled = false,
  error,
  success,
  helperText,
  size = 'md',
  className = '',
  dragAndDrop = true
}: FormFileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    } else if (file.type.includes('text')) {
      return <FileText className="w-4 h-4" />;
    } else {
      return <File className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    const validFiles: File[] = [];
    const errors: string[] = [];

    newFiles.forEach(file => {
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name} is too large (max ${maxSize}MB)`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      // In a real app, you'd want to show these errors to the user
      console.error('File upload errors:', errors);
    }

    if (multiple) {
      onChange([...files, ...validFiles]);
    } else {
      onChange(validFiles.slice(0, 1));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`form-control ${className}`}>
      {label && (
        <label className="label">
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragOver ? 'border-primary bg-primary/10' : 'border-base-300'}
          ${error ? 'border-error' : success ? 'border-success' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary'}
          ${sizeClasses[size]}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!disabled ? openFileDialog : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          required={required}
          disabled={disabled}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <Upload className="w-8 h-8 mx-auto mb-2 text-base-content/50" />
        
        <p className="text-base-content/70 mb-1">
          {dragAndDrop ? 'Drag and drop files here, or click to select' : 'Click to select files'}
        </p>
        
        <p className="text-sm text-base-content/50">
          {accept ? `Accepted formats: ${accept}` : 'All file types'} • Max size: {maxSize}MB
        </p>
      </div>
      
      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-base-200 rounded">
              <div className="flex items-center space-x-2">
                {getFileIcon(file)}
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-base-content/50">{formatFileSize(file.size)}</p>
                </div>
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="btn btn-ghost btn-sm hover:text-error"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {(error || success || helperText) && (
        <label className="label">
          <span className={`label-text-alt ${error ? 'text-error' : success ? 'text-success' : 'text-base-content/70'}`}>
            {error || success || helperText}
          </span>
        </label>
      )}
    </div>
  );
}