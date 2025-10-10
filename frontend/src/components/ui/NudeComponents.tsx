/**
 * Nude Design System Components
 * Drop-in replacements for DaisyUI components with nude theming
 */

import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  TrendingUp, 
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Star,
  Heart,
  Share2,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Edit,
  Trash2,
  Settings,
  User,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Shield,
  Lock,
  Unlock,
  Bell,
  BellOff,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MoreVertical
} from 'lucide-react';

// ============================================================================
// CARD COMPONENTS
// ============================================================================

interface NudeCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'luxury' | 'spa' | 'elevated';
  hover?: boolean;
}

export const NudeCard: React.FC<NudeCardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = false
}) => {
  const baseClasses = 'hospitality-card p-6 transition-all duration-300';
  const variantClasses = {
    default: '',
    luxury: 'hospitality-card-luxury',
    spa: 'hospitality-card-spa',
    elevated: 'shadow-nude-strong'
  };
  const hoverClasses = hover ? 'hover:shadow-nude-medium hover:-translate-y-1' : '';

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

interface NudeCardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const NudeCardBody: React.FC<NudeCardBodyProps> = ({
  children,
  className = ''
}) => (
  <div className={`space-y-4 ${className}`}>
    {children}
  </div>
);

interface NudeCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const NudeCardTitle: React.FC<NudeCardTitleProps> = ({
  children,
  className = ''
}) => (
  <h2 className={`text-xl font-display font-semibold text-nude-800 ${className}`}>
    {children}
  </h2>
);

interface NudeCardActionsProps {
  children: React.ReactNode;
  className?: string;
}

export const NudeCardActions: React.FC<NudeCardActionsProps> = ({
  children,
  className = ''
}) => (
  <div className={`flex items-center space-x-3 ${className}`}>
    {children}
  </div>
);

// ============================================================================
// BUTTON COMPONENTS
// ============================================================================

interface NudeButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const NudeButton: React.FC<NudeButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = ''
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-nude-600 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    outline: 'bg-transparent border-2 border-nude-300 text-nude-700 hover:bg-nude-100 hover:border-nude-400',
    ghost: 'bg-transparent text-nude-700 hover:bg-nude-100',
    link: 'bg-transparent text-nude-600 hover:text-nude-800 underline'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

// ============================================================================
// BADGE COMPONENTS
// ============================================================================

interface NudeBadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'nude' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const NudeBadge: React.FC<NudeBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    nude: 'badge-nude',
    default: 'bg-nude-200 text-nude-800'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};

// ============================================================================
// STAT CARD COMPONENTS
// ============================================================================

interface NudeStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down';
  };
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const NudeStatCard: React.FC<NudeStatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  variant = 'default',
  className = ''
}) => {
  const variantClasses = {
    default: 'border-nude-200',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    error: 'border-red-200 bg-red-50',
    info: 'border-blue-200 bg-blue-50'
  };

  return (
    <NudeCard className={`${variantClasses[variant]} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="w-10 h-10 bg-nude-100 rounded-lg flex items-center justify-center">
              <div className="text-nude-600">{icon}</div>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-nude-600">{title}</h3>
            {description && (
              <p className="text-xs text-nude-500">{description}</p>
            )}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.direction === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-nude-800">{value}</div>
      {trend && (
        <div className="text-xs text-nude-500 mt-1">{trend.label}</div>
      )}
    </NudeCard>
  );
};

// ============================================================================
// INPUT COMPONENTS
// ============================================================================

interface NudeInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const NudeInput: React.FC<NudeInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  disabled = false,
  required = false,
  className = ''
}) => (
  <div className={className}>
    {label && (
      <label className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className="form-input w-full"
    />
    {error && <div className="form-error">{error}</div>}
  </div>
);

// ============================================================================
// SELECT COMPONENTS
// ============================================================================

interface NudeSelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const NudeSelect: React.FC<NudeSelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder,
  error,
  disabled = false,
  required = false,
  className = ''
}) => (
  <div className={className}>
    {label && (
      <label className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className="form-input w-full"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <div className="form-error">{error}</div>}
  </div>
);

// ============================================================================
// TEXTAREA COMPONENTS
// ============================================================================

interface NudeTextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  className?: string;
}

export const NudeTextarea: React.FC<NudeTextareaProps> = ({
  placeholder,
  value,
  onChange,
  label,
  error,
  disabled = false,
  required = false,
  rows = 4,
  className = ''
}) => (
  <div className={className}>
    {label && (
      <label className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      rows={rows}
      className="form-input w-full resize-none"
    />
    {error && <div className="form-error">{error}</div>}
  </div>
);

// ============================================================================
// MODAL COMPONENTS
// ============================================================================

interface NudeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const NudeModal: React.FC<NudeModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = ''
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-content ${sizeClasses[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-semibold text-nude-800">{title}</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-nude-100 rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5 text-nude-600" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// TOAST COMPONENTS
// ============================================================================

interface NudeToastProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose?: () => void;
  className?: string;
}

export const NudeToast: React.FC<NudeToastProps> = ({
  children,
  variant = 'info',
  isVisible,
  onClose,
  className = ''
}) => {
  if (!isVisible) return null;

  const variantClasses = {
    success: 'toast-success',
    error: 'toast-error',
    warning: 'toast-warning',
    info: 'toast-info'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 ${variantClasses[variant]} ${className}`}>
      <div className="flex items-center justify-between">
        <span>{children}</span>
        {onClose && (
          <button 
            onClick={onClose}
            className="ml-4 hover:opacity-70 transition-opacity"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// LOADING COMPONENTS
// ============================================================================

interface NudeSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const NudeSpinner: React.FC<NudeSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-nude-200 border-t-nude-600 rounded-full animate-spin ${className}`} />
  );
};

// ============================================================================
// DIVIDER COMPONENTS
// ============================================================================

interface NudeDividerProps {
  className?: string;
}

export const NudeDivider: React.FC<NudeDividerProps> = ({
  className = ''
}) => (
  <hr className={`border-nude-200 ${className}`} />
);

// ============================================================================
// ALERT COMPONENTS
// ============================================================================

interface NudeAlertProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
  className?: string;
}

export const NudeAlert: React.FC<NudeAlertProps> = ({
  children,
  variant = 'info',
  icon,
  className = ''
}) => {
  const variantClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const defaultIcons = {
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  return (
    <div className={`p-4 rounded-lg border ${variantClasses[variant]} ${className}`}>
      <div className="flex items-center space-x-3">
        {icon || defaultIcons[variant]}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default {
  NudeCard,
  NudeCardBody,
  NudeCardTitle,
  NudeCardActions,
  NudeButton,
  NudeBadge,
  NudeStatCard,
  NudeInput,
  NudeSelect,
  NudeTextarea,
  NudeModal,
  NudeToast,
  NudeSpinner,
  NudeDivider,
  NudeAlert,
};