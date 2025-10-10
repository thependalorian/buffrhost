"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  User,
  Phone,
  Building,
  Shield,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle successful registration
      console.log('Registration successful:', formData);
      
      // Redirect to verification page
      window.location.href = '/auth/verify-email';
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary text-white">
              <UserPlus className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-base-content">Create Your Account</h1>
          <p className="text-base-content/70 mt-2">Join Etuna Guesthouse and start managing your business</p>
        </div>

        {/* Registration Form */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {errors.general && (
              <div className="alert alert-error mb-4">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name *</span>
                  </label>
                  <div className="input-group">
                    <span className="bg-base-200">
                      <User className="w-4 h-4 text-base-content/70" />
                    </span>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Enter your first name"
                      className={`input input-bordered flex-1 ${errors.firstName ? 'input-error' : ''}`}
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.firstName && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.firstName}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Last Name *</span>
                  </label>
                  <div className="input-group">
                    <span className="bg-base-200">
                      <User className="w-4 h-4 text-base-content/70" />
                    </span>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Enter your last name"
                      className={`input input-bordered flex-1 ${errors.lastName ? 'input-error' : ''}`}
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.lastName && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.lastName}</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email Address *</span>
                  </label>
                  <div className="input-group">
                    <span className="bg-base-200">
                      <Mail className="w-4 h-4 text-base-content/70" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className={`input input-bordered flex-1 ${errors.email ? 'input-error' : ''}`}
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.email}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone Number *</span>
                  </label>
                  <div className="input-group">
                    <span className="bg-base-200">
                      <Phone className="w-4 h-4 text-base-content/70" />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      className={`input input-bordered flex-1 ${errors.phone ? 'input-error' : ''}`}
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.phone && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.phone}</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Company Information */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Company/Organization</span>
                </label>
                <div className="input-group">
                  <span className="bg-base-200">
                    <Building className="w-4 h-4 text-base-content/70" />
                  </span>
                  <input
                    type="text"
                    name="company"
                    placeholder="Enter your company name (optional)"
                    className="input input-bordered flex-1"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password *</span>
                  </label>
                  <div className="input-group">
                    <span className="bg-base-200">
                      <Lock className="w-4 h-4 text-base-content/70" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a password"
                      className={`input input-bordered flex-1 ${errors.password ? 'input-error' : ''}`}
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      className="btn btn-square btn-ghost"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.password}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Confirm Password *</span>
                  </label>
                  <div className="input-group">
                    <span className="bg-base-200">
                      <Lock className="w-4 h-4 text-base-content/70" />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      className={`input input-bordered flex-1 ${errors.confirmPassword ? 'input-error' : ''}`}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      className="btn btn-square btn-ghost"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.confirmPassword}</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Password Requirements */}
              <div className="text-sm text-base-content/70">
                <p className="font-semibold mb-2">Password must contain:</p>
                <ul className="space-y-1">
                  <li className={`flex items-center space-x-2 ${formData.password.length >= 8 ? 'text-success' : ''}`}>
                    <CheckCircle className="w-3 h-3" />
                    <span>At least 8 characters</span>
                  </li>
                  <li className={`flex items-center space-x-2 ${/(?=.*[a-z])/.test(formData.password) ? 'text-success' : ''}`}>
                    <CheckCircle className="w-3 h-3" />
                    <span>One lowercase letter</span>
                  </li>
                  <li className={`flex items-center space-x-2 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-success' : ''}`}>
                    <CheckCircle className="w-3 h-3" />
                    <span>One uppercase letter</span>
                  </li>
                  <li className={`flex items-center space-x-2 ${/(?=.*\d)/.test(formData.password) ? 'text-success' : ''}`}>
                    <CheckCircle className="w-3 h-3" />
                    <span>One number</span>
                  </li>
                </ul>
              </div>

              {/* Terms and Newsletter */}
              <div className="space-y-4">
                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    className="checkbox checkbox-primary"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                  />
                  <span className="label-text ml-2">
                    I agree to the{' '}
                    <a href="/terms" className="link link-primary">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="link link-primary">
                      Privacy Policy
                    </a>
                    *
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.agreeToTerms}</span>
                  </label>
                )}

                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    name="subscribeNewsletter"
                    className="checkbox checkbox-primary"
                    checked={formData.subscribeNewsletter}
                    onChange={handleInputChange}
                  />
                  <span className="label-text ml-2">
                    Subscribe to our newsletter for updates and special offers
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Account
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-base-content/70">
                Already have an account?{' '}
                <a href="/auth/login" className="link link-primary font-semibold">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-base-content/70">
            <Shield className="w-4 h-4" />
            <span>Your data is protected with enterprise-grade security</span>
          </div>
        </div>
      </div>
    </div>
  );
}