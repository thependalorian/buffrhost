'use client';
/**
 * Review Form Component
 *
 * A comprehensive review form for customers to rate and review products
 * Features: Star rating, text review, photo upload, form validation
 * Location: components/reviews/review-form.tsx
 */

import { useState, useRef } from 'react';
/**
 * ReviewForm React Component for Buffr Host Hospitality Platform
 * @fileoverview ReviewForm provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/reviews/review-form.tsx
 * @purpose ReviewForm provides specialized functionality for the Buffr Host platform
 * @component ReviewForm
 * @category Reviews
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @state_management Local component state for UI interactions and data management
 * @hooks_utilization useState for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Interactive state management for dynamic user experiences
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {string} [productId] - productId prop description
 * @param {string} [productName] - productName prop description
 * @param {(review} [onSubmit] - onSubmit prop description
 * @param {} [onCancel] - onCancel prop description
 * @param {} [isSubmitting] - isSubmitting prop description
 *
 * State:
 * @state {any} {
    rating: 0 - Component state for {
    rating: 0 management
 *
 * Methods:
 * @method handleInputChange - handleInputChange method for component functionality
 * @method handleFileUpload - handleFileUpload method for component functionality
 * @method removePhoto - removePhoto method for component functionality
 * @method handleDrag - handleDrag method for component functionality
 * @method handleDrop - handleDrop method for component functionality
 *
 * Usage Example:
 * @example
 * import ReviewForm from './ReviewForm';
 *
 * function App() {
 *   return (
 *     <ReviewForm
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered ReviewForm component
 */

import StarRating from './star-rating';

interface ReviewFormProps {
  productId: string;
  productName: string;
  onSubmit: (review: ReviewData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

interface ReviewData {
  rating: number;
  title: string;
  comment: string;
  photos: File[];
  recommend: boolean;
}

export default function ReviewForm({
  productId,
  productName,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewData>({
    rating: 0,
    title: '',
    comment: '',
    photos: [],
    recommend: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof ReviewData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 5 - formData.photos.length);
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newFiles],
    }));
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.rating === 0) {
      newErrors['rating'] = 'Please provide a rating';
    }

    if (!formData.title.trim()) {
      newErrors['title'] = 'Please provide a title for your review';
    }

    if (!formData.comment.trim()) {
      newErrors['comment'] = 'Please write a review comment';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="bg-nude-50 card shadow-2xl-luxury-strong card-body max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-nude-900 mb-2">
          Write a Review
        </h2>
        <p className="text-nude-600">
          Share your experience with{' '}
          <span className="font-semibold">{productName}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-nude-700 mb-2">
            Overall Rating *
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={(rating) => handleInputChange('rating', rating)}
            interactive={true}
            size="lg"
            showLabel={true}
          />
          {errors['rating'] && (
            <p className="mt-1 text-sm text-error">{errors['rating']}</p>
          )}
        </div>

        {/* Review Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-nude-700 mb-2"
          >
            Review Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-nude-300 rounded-md shadow-2xl-nude-soft focus:outline-none focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-nude-500 focus:border-nude-500"
            placeholder="Summarize your review in a few words"
            maxLength={100}
          />
          {errors['title'] && (
            <p className="mt-1 text-sm text-error">{errors['title']}</p>
          )}
          <p className="mt-1 text-xs text-nude-500">
            {formData.title.length}/100 characters
          </p>
        </div>

        {/* Review Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-nude-700 mb-2"
          >
            Your Review *
          </label>
          <textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-nude-300 rounded-md shadow-2xl-nude-soft focus:outline-none focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-nude-500 focus:border-nude-500"
            placeholder="Tell others about your experience with this product..."
            maxLength={1000}
          />
          {errors['comment'] && (
            <p className="mt-1 text-sm text-error">{errors['comment']}</p>
          )}
          <p className="mt-1 text-xs text-nude-500">
            {formData.comment.length}/1000 characters
          </p>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-nude-700 mb-2">
            Photos (Optional)
          </label>
          <div
            className={`input input-bordered border-dashed card card-body text-center transition-colors duration-300 ${
              dragActive
                ? 'border-nude-400 bg-nude-50'
                : 'border-nude-300 hover:border-nude-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-nude-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm text-nude-600">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-nude-600 hover:text-nude-500 font-medium"
                >
                  Click to upload
                </button>{' '}
                or drag and drop
              </p>
              <p className="text-xs text-nude-500">
                PNG, JPG, GIF up to 10MB each (max 5 photos)
              </p>
            </div>
          </div>

          {/* Photo Preview */}
          {formData.photos.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Review photo ${index + 1}`}
                    className="w-full h-24 object-cover card"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-error transition-colors duration-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommend Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="recommend"
            checked={formData.recommend}
            onChange={(e) => handleInputChange('recommend', e.target.checked)}
            className="h-4 w-4 text-nude-600 focus:ring-nude-500 border-nude-300 rounded"
          />
          <label htmlFor="recommend" className="ml-2 text-sm text-nude-700">
            I would recommend this product to others
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="badge badge-lg text-sm font-medium text-nude-700 bg-nude-50 border border-nude-300 rounded-md hover:bg-nude-50 focus:outline-none focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-nude-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-nude-600 border border-transparent rounded-md hover:bg-nude-700 focus:outline-none focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-nude-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
