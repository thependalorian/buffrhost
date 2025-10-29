'use client';
/**
 * Review Dashboard Component
 *
 * A comprehensive review system that combines review form and review list
 * Features: Review submission, review display, rating statistics
 * Location: components/reviews/review-dashboard.tsx
 */

import { useState, useEffect } from 'react';
import ReviewForm from './review-form';
import ReviewList from './review-list';
import StarRating from './star-rating';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  photos: string[];
  recommend: boolean;
  createdAt: string;
  helpful: number;
  verified: boolean;
}

interface Product {
  id: string;
  name: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ReviewDashboardProps {
  propertyId: string;
  property: Product;
  tenantId?: string;
  userId?: string;
  canReview?: boolean;
}

export default function ReviewDashboard({
  propertyId,
  property,
  tenantId = 'default-tenant',
  userId,
  canReview = true,
}: ReviewDashboardProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    hasMore: false,
    total: 0,
  });

  // Fetch reviews
  const fetchReviews = async (
    page = 1,
    sortBy = 'newest',
    filterBy = 'all'
  ) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        propertyId,
        tenantId,
        page: page.toString(),
        limit: '10',
        sortBy,
        filterBy,
      });

      const response = await fetch(`/api/reviews?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews');
      }

      if (page === 1) {
        setReviews(data.reviews);
      } else {
        setReviews((prev) => [...prev, ...data.reviews]);
      }

      setPagination({
        page: data.pagination.page,
        hasMore: data.pagination.hasMore,
        total: data.pagination.total,
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to fetch reviews'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Submit review
  const handleSubmitReview = async (reviewData: unknown) => {
    if (!userId) {
      setError('You must be logged in to submit a review');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          tenantId,
          orderId: reviewData.orderId,
          customerName: reviewData.customerName,
          customerEmail: reviewData.customerEmail,
          overallRating: reviewData.rating,
          foodRating: reviewData.foodRating,
          serviceRating: reviewData.serviceRating,
          accommodationRating: reviewData.accommodationRating,
          atmosphereRating: reviewData.atmosphereRating,
          valueRating: reviewData.valueRating,
          reviewText: reviewData.comment,
          isVerified: reviewData.verified || false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      // Add new review to the list
      setReviews((prev) => [data.review, ...prev]);
      setShowReviewForm(false);

      // Refresh reviews to get updated statistics
      await fetchReviews(1);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to submit review'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load more reviews
  const handleLoadMore = () => {
    fetchReviews(pagination.page + 1);
  };

  // Initial load
  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  const getRatingPercentage = (rating: number) => {
    if (property.totalReviews === 0) return 0;
    return Math.round(
      (property.ratingDistribution[
        rating as keyof typeof property.ratingDistribution
      ] /
        property.totalReviews) *
        100
    );
  };

  return (
    <div className="space-y-8">
      {/* Product Rating Summary */}
      <div className="bg-nude-50 card shadow-2xl-nude-soft border border-nude-200 card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-2">
              <span className="text-4xl font-bold text-nude-900">
                {property.averageRating.toFixed(1)}
              </span>
              <div className="ml-2">
                <StarRating
                  rating={property.averageRating}
                  size="lg"
                  showLabel={false}
                />
              </div>
            </div>
            <p className="text-nude-600">
              Based on {property.totalReviews} review
              {property.totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm font-medium text-nude-700 w-8">
                  {rating}★
                </span>
                <div className="flex-1 bg-nude-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300 duration-300"
                    style={{ width: `${getRatingPercentage(rating)}%` }}
                  />
                </div>
                <span className="text-sm text-nude-500 w-8">
                  {getRatingPercentage(rating)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Form Toggle */}
      {canReview && userId && (
        <div className="text-center">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="btn btn-md bg-nude-600 text-white font-medium card hover:bg-nude-700 focus:outline-none focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-nude-500 transition-colors duration-300"
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          productId={propertyId}
          productName={property.name}
          onSubmit={handleSubmitReview}
          onCancel={() => setShowReviewForm(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 card card-body">
          <div className="flex">
            <svg
              className="w-5 h-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-error">Error</h3>
              <p className="mt-1 text-sm text-error">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-error"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h3 className="text-lg font-semibold text-nude-900 mb-4">
          Customer Reviews ({property.totalReviews})
        </h3>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-nude-50 border border-nude-200 card card-body animate-pulse"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-nude-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-nude-300 rounded w-1/4"></div>
                    <div className="h-4 bg-nude-300 rounded w-1/2"></div>
                    <div className="h-4 bg-nude-300 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ReviewList
            productId={propertyId}
            reviews={reviews}
            {...(pagination.hasMore && { onLoadMore: handleLoadMore })}
            hasMore={pagination.hasMore}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
